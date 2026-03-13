from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt, JWTError 
from datetime import datetime, timedelta, timezone
import mariadb
from db import findOne,save,findAll

SECRET_KEY = "your-extremely-secure-random-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def set_token(sub: int, name: str):
   try:
      iat = datetime.now(timezone.utc)
      exp = iat + (timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
      data = {"name":str(name),"iss" :"EDU", "sub": str(1), "iat": iat , "exp": exp}
      return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
      
   except JWTError as e:
      print(f"JWT ERROR:{e}")
   return None

origins = [
  "http://localhost:5173" 
]

class LoginModel(BaseModel):
  email: str
  password : str

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
  return {"status": True, "result": ["공유는 해드림"]}

@app.post("/login")
def read_root(model:LoginModel):
    sql = f"select `no`,`name` from edu.user where `email` = '{model.email}' and `password` ={model.password}"       <!-- 왜 model.~~ 가 들어가는지 -->
    data = findOne(sql)
    if data:
       access_token = set_token(data["no"],data["name"])
       return {"status": True, "model": model, "access_token" : access_token }
    else:
       return {"status": False}

# @app.post("/token")
# def token():
  #  result = set_token(1)
  #  return {"status": True, "token": result}