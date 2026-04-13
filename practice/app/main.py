from src import  step03
from Fastapi import Fastapi 
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str


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
