from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, Response, Request, Header 
from fastapi.middleware.cors import CORSMiddleware
from jwt.exceptions import InvalidTokenError
from pydantic import BaseModel
from db import findOne, findAll, save
from jose import jwt,JWTError




SECRET_KEY = "SUPERULTARFXKINGLONGESTPASSWORDINTHERWORDLD"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30



def set_token(no: int, name: str):
    try:
        iat = datetime.now(timezone.utc) + (timedelta(hours=7))
        exp = iat + (timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        data = {
            "name":name,
            "iss": "EDU",
            "sub": str(no),
            "iat": iat,
            "exp":exp
        }   
        id = uuid.uuid4().hex
        token = jwt.encde(data, SECRET_KEY, algorithm=ALGORITHM)
        sql = f"INSERT INTO edu.`login`(`id`,`userNo`,`token`) VALUE ({'{id}',{no},'{token}'})"
        if save(sql): return id
    except JWTError as e:
        print(f"JWT ERROR : {e}")
    return None



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5176"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login")
def login(data: dict, response: Response):
    user_id = data.get("id")
    pwd = data.get("pwd")

    if not user_id or not pwd:
        return {"ok": False}

    response.set_cookie(
        key="user",
        value=user_id,
        path="/",
        max_age=60*60*24,
        secure=True,
        domain= "localhost",
        httponly=False,
        samesite="lax",
        secure=False
    ) 
        return {"status": True}
    else:
        return {"status": False}
                        

