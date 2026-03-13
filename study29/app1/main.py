from fastapi import FastAPI
from kafka import KafkaProducer
import json
import redis
from pydantic import EmailStr, BaseModel
from settings import settings
from datetime import datetime, timedelta, timezone
from jose import jwt,JWTError, ExpiredSignatureError
from db import findOne
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware 

origins = ["http://localhost:5173"]

app = FastAPI(title="Producer")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer

class EmailModel(BaseModel):
  email:EmailStr

class CodeModel(BaseModel):
  id:str


pd = KafkaProducer(
  bootstrap_servers=settings.kafka_server,
  value_serializer=lambda v: json.dumps(v).encode("utf-8")
)


client = redis.Redis(
  host=settings.redis_host,
  port=settings.redis_port,
  db=settings.redis_db,
  decode_responses=True
)

@app.get("/")
def read_root():
  return {"Hello": "World"}

@app.get("/msg")
def event1(msg: str):
  pd.send(kafka_topic, {"msg": msg})
  pd.flush()
  return {"status": True}



@app.post("/login")
def producer(model:EmailModel):
  sql = f"select `no`, `name` from edu.user where `email`= '{model.email}'"
  data = findOne(sql)
  if data:
    pd.send(settings.kafka_topic,dict(model))
    pd.flush()
    return{"status":True}
  return{"status":False}