import asyncio
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, HTTPException  # FastAPI 대소문자 주의
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel             # BaseModel import 필수

# board_agent는 step03에서 가져옴 (MemorySaver checkpointer 포함된 버전)
from src.step03 import board_agent
from src.database import init_db

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


class ChatResponse(BaseModel):
   result: str
   thread_id: str = "default"

@app.get("/")
def health_check():
   return{"status": "ok"}

# 핵심 API
@app.post("/chat",response_model=ChatResponse)
async def chat(req: PromptRequest):
    # thread_id를 config에 넘겨야 MemorySaver가 대화 히스토리를 유지함
    config = {"configurable":{"thread_id": req.thread_id}}
    
    try:
       loop = asyncio.get_event_loop()
       
       result = await loop.run_in_executor(
         None,
         lambda: board_agent.invoke(
         {
        "messages": [{"role": "user", "content": req.prompt}]},
        config,
       )
     )

       return ChatResponse(
            result=result["messages"][-1].content,
            thread_id=req.thread_id,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/")

def main():
  print("Hello from app!")
  step03.run()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,   # 개발 중 코드 변경 시 자동 재시작 (운영 시 False로 변경)
    )