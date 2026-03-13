from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
from jose import JWTError,jwt
from db import findOne, findAll, save
import mariadb
import uuid

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def set_token( name : str, user_id : int):
    try:
       iat = datetime.now(timezone.utc)
       exp = iat + timedelta(ACCESS_TOKEN_EXPIRE_MINUTES)

       
       
       data = {
          "sub" : str(user_id),
          "name" : name,
          "iss" : "hyunseo",
          "iat" : iat,
          "exp" : exp,
          
        }

       return jwt.encode(data, key = SECRET_KEY, algorithm = ALGORITHM)

    except JWTError as e:
       print(f"JWTError : {e}")
    return None  

origins = [
  "http://localhost:5173"
  "http://192.168.0.246:5173"
]

# 회원 정보 수정용 BaseModel
class UpdateUserModel(BaseModel):
  email: str
  pwd: str
  gender: int



class LoginModel(BaseModel):
  email: str
  pwd: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login")
def login(loginModel: LoginModel, response: Response):
  msg = "잘못된 정보 입니다."
  try:
    sql = f"""
      select * from edu.user 
       WHERE `email` = '{loginModel.email}' 
         AND `password` = '{loginModel.pwd}'
    """
    data = findOne(sql)
    if data:
      id = uuid.uuid4().hex
      token = set_token(data["name"],data["no"])
      sql = f"INSERT INTO edu.login (`id`, `userNo`, `token`) value ('{id}', {data['no']}, '{token}')"
      saved = save(sql)
      if saved:
        response.set_cookie(
        key="id",
        value=id,
        max_age=60 * 60,        # 1시간 (초)
        expires=60 * 60,        # max_age와 유사 (초)
        path="/",
        # domain="localhost",
        secure=True,            # HTTPS에서만 전송
        httponly=True,          # JS 접근 차단 (⭐ 보안 중요)
        samesite="none",         # 'lax' | 'strict' | 'none'
        )
        return {"status": True, "id" : id}
  except mariadb.Error as e:
    print(f"SQL 오류 : {e}")
  return {"status": False, "message": msg}

@app.post("/logout")
def logout(response: Response):
  response.delete_cookie(key="id")
  return {"status": True}

@app.get("/user")
def user(request: Request):
  email = request.cookies.get("user")
  if email:
    return {"status": True, "me": email}
  else:
    return {"status": False}


@app.get("/getme")
def getme(request: Request):
  no = request.cookies.get("user")
  print("cookie no =", no)

  sql = f"""
    SELECT
      no,
      name,
      email,
      gender,
      reg_date AS regDate,
      mod_date AS modDate,
      password AS pwd
    FROM edu.user
    WHERE no = {int(no)}
  """
  print("SQL =", sql)

  data = findOne(sql)
  print("DB data =", data)

  if data:
    return {"status": True, "user": data}
  else:
    return {"status": False}

@app.put("/user")
def Edit_user(body: UpdateUserModel, request: Request):
  no = request.cookies.get("user")
  try:
    sql = f"""
      UPDATE edu.user
         SET email = '{body.email}',
             password = '{body.password}',
             gender = {int(body.gender)},
             mod_date = NOW()
       WHERE no = {int(no)}
    """
    save(sql)
    return {"status": True}
  except mariadb.Error as e:
    print(f"SQL 오류 : {e}")
    return {"status": False, "message": "수정 실패"}