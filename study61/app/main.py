from src import step01, step02, step03
from fastapi import fastapi 

app = FastAPI()

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
