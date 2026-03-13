from fastapi import FastAPI, Response
from kafka import KafkaProducer
from settings import settings
from pydantic import EmailStr, BaseModel
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from fastapi.middleware.cors import CORSMiddleware
import uuid
import json
import redis

origins = [ settings.react_url, "http://localhost:5173" ]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "your-extremely-secure-random-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class EmailModel(BaseModel):
  email: EmailStr

app = FastAPI()

client = redis.Redis(
    host="localhost",
    port=6379,
    db=0
  )

pd = KafkaProducer(
  bootstrap_servers=settings.kafka_server,
  value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

@app.get("/")
def root():
  return {"msg": "Producer"}

@app.post("/login")
def producer(model: EmailModel):
  pd.send(settings.kafka_topic, dict(model))
  pd.flush()
  return {"status": True}

@app.post("/code")
def code(id:str):
  print(id)
  result = client.get(id)
  if result:
    client.delete(id)
    return{"result":result}
  
@app.get("/token")
def setRedis(value, response: Response):
    # 변수를 미리 선언해두거나 try 안에서 확실히 리턴합니다.
    try:
        iat = datetime.now(timezone.utc) + (timedelta(hours=7))
        exp = iat + (timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        data = {
            "iss": "EDU", 
            "sub": value, 
            "iat": iat,
            "exp": exp
        }
        token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
        
        id = uuid.uuid4().hex
        keys = f"fastapi:{id}"
        
        # Redis 저장
        client.setex(keys, 60*60*24, token)
        
        # 쿠키 설정
        response.set_cookie(
            key="data",
            value=keys,
            max_age=60 * 60,
            expires=60 * 60,
            path="/",
            domain="localhost",
            secure=False,
            httponly=True,
            samesite="lax",
        )
        
        # ✅ 성공했을 때 리턴 (try 블록 안으로 이동)
        return {
            "status": True,
            "token_key": keys,
            "jwt_token": token # 실제 토큰 값도 보고 싶다면 추가하세요!
        }
        
    except JWTError as e:
        print(f"JWT ERROR : {e}")
        # ❌ 실패했을 때 리턴
        return {"status": False, "error": str(e)}

