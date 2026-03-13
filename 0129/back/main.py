from fastapi import FastAPI

app = FastAPI()

@app.get("login")
def read_root():
  return {"Hello": "World"}

@app.post("login")
def read_root():
  return {"Hello": "World"}