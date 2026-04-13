from src import  step03
from fastapi import FastAPI ,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.step03 import board_agent
import asyncio
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # TODO: DB 커넥션 풀 초기화 (예: SQLAlchemy, aiomysql 등)
    print("서버 시작 - DB 연결 초기화")
    yield 
    # TODO: DB 커넥션 풀 종료
    print("서버 종료 - DB 연결 해제")

app = FastAPI(
    title="Board Agent API",
    version="0.1.0",
    lifespan =lifespan,  
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str
    thread_id: str = "default"


# 핵심 API
@app.post("/chat")
async def chat(req: PromptRequest):
    result = board_agent.invoke({
        "messages": [
            {"role": "user", "content": req.prompt}
        ]
    })

    return {
        "result": result["messages"][-1].content
    }

@app.get("/")

def main():
  print("Hello from app!")
  # step01.run()
  # step02.run()
  step03.run()

if __name__ == "__main__":
  main()
