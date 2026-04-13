from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
import json
import logging
from typing import List, Optional
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.prebuilt import create_react_agent
from langgraph_swarm import create_handoff_tool, create_swarm
from fastapi.middleware.cors import CORSMiddleware

# Database Setup
DB_PATH = "board.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# LLM Setup (Matching study61/app/src/step03.py pattern)
llm = ChatOllama(
    model="gemma4:e4b",  # Or whatever model is available
    base_url="http://localhost:11434",
)

# Tools for BoardAgent
def create_post_tool(name: str, title: str, content: str) -> str:
    """Create a new post on the board."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO posts (name, title, content) VALUES (?, ?, ?)", (name, title, content))
        post_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return f"Successfully created post #{post_id} by {name}."
    except Exception as e:
        return f"Error creating post: {str(e)}"

def delete_post_tool(post_id: int) -> str:
    """Delete a post by its ID."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM posts WHERE id = ?", (post_id,))
        conn.commit()
        conn.close()
        return f"Successfully deleted post #{post_id}."
    except Exception as e:
        return f"Error deleting post: {str(e)}"

def list_posts_tool() -> str:
    """List all current posts."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, title FROM posts ORDER BY created_at DESC")
        posts = cursor.fetchall()
        conn.close()
        if not posts: return "The board is currently empty."
        return "\n".join([f"#{p[0]}: {p[2]} (by {p[1]})" for p in posts])
    except Exception as e:
        return f"Error listing posts: {str(e)}"

# Agents (Swarm logic from step03.py)
board_agent = create_react_agent(
    llm,
    [create_post_tool, delete_post_tool, list_posts_tool, 
     create_handoff_tool(agent_name="EmpathyAgent", description="If the user wants to talk about feelings or needs emotional support, hand off to EmpathyAgent.")],
    prompt="""You are the Board Manager Agent. 
Your job is to manage the bulletin board: CREATE, DELETE, or LIST posts.
If the user provides a name, title, and content, use create_post_tool.
If the user asks to delete a specific post ID, use delete_post_tool.
Always confirm the action to the user.
""",
    name="BoardAgent",
)

empathy_agent = create_react_agent(
    llm,
    [create_handoff_tool(agent_name="BoardAgent", description="If the user wants to manage posts (create/delete/list), hand off to BoardAgent.")],
    prompt="""You are the Empathy Agent.
Your job is to provide emotional support and engage in natural conversation.
If the user mentions they want to write a post or manage the board, hand off back to BoardAgent.
""",
    name="EmpathyAgent",
)

# Swarm Configuration
checkpointer = InMemorySaver()
workflow = create_swarm(
    [board_agent, empathy_agent],
    default_active_agent="BoardAgent"
)
graph = workflow.compile(checkpointer=checkpointer)

# FastAPI App
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str
    thread_id: str = "default_user"

@app.post("/api/prompt")
async def process_prompt(req: PromptRequest):
    config = {"configurable": {"thread_id": req.thread_id}}
    try:
        result = graph.invoke(
            {"messages": [{"role": "user", "content": req.prompt}]},
            config,
        )
        last_message = result['messages'][-1]
        return {"response": last_message.content, "agent": getattr(last_message, 'name', 'Assistant')}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/posts")
async def get_posts():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM posts ORDER BY created_at DESC")
    posts = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return posts

@app.get("/api/posts/{post_id}")
async def get_post(post_id: int):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM posts WHERE id = ?", (post_id,))
    post = cursor.fetchone()
    conn.close()
    if post: return dict(post)
    raise HTTPException(status_code=404, detail="Post not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
