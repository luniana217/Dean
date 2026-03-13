from fastapi import FastAPI, Request, Response 
import redis
import uuid
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError


# docker run -d -p 6379:6379 --name redis redis:8.4.0

SECRET_KEY = "your-extremely-secure-random-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

client = redis.Redis(
    host="192.168.0.250",
    port= 6379,
    db=0,
  )
print(type(client))

def set_token(name: str):
  try:
    iat = datetime.now(timezone.utc) + (timedelta(hours=7))
    exp = iat + (timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    data = {
      "name": name,
      "iss": "EDU", 
      "iat": iat,
      "exp": exp
    }
    return jwt.encode(data, key = SECRET_KEY, algorithm = ALGORITHM)   
  except JWTError as e:
    print(f"JWT ERROR : {e}")  
  return None


app = FastAPI()



@app.get("/set")
def setRedis(name, response: Response):
   
  id = uuid.uuid4().hex
  client.setex(f"1team:{id}", 60*60*24, set_token(name) )
  response.set_cookie(
    key="data",
    value= id,
    max_age=60 * 60,        
    expires=60 * 60,       
    path="/",
    domain="localhost",
    secure=True,            # HTTPS에서만 전송
    httponly=True,          # JS 접근 차단 (⭐ 보안 중요)
    samesite="lax",         # 'lax' | 'strict' | 'none'
  )
  return{"status": True, "set_token": set_token(name)}

@app.get("/get")
def getRedis(request: Request):
  id = request.cookies.get("data")
  result = client.get(f"1team:{id}")
  return{"result": result}

@app.get("/del")
def delete(request: Request, response:Response):
  id = request.cookies.get("data")
  client.delete(f"1team:{id}")
  response.delete_cookie(key="data")
  return{"status": True}

@app.get("/")
def read_root():
  return {"Hello": "World"}