from fastapi import APIRouter, Depends,Cookie
from pydantic import BaseModel, Field
from db import findAll, findOne, save, add_key
from auth import get_user


router = APIRouter(prefix="/board",tags=["게시판"])

class BoardAddModel(BaseModel):
  title: str = Field(..., title="제목", description="게시글 제목 입니다.")
  content: str = Field(..., title="내용", description="게시글 내용 입니다.")

@router.post("/add")  
def board_add(boardAddModel: BoardAddModel, payload=Depends(get_user), user: str = Cookie(None)):
  if not payload or not user:
    return {"status": False, "message": "로그인이 필요합니다."}

  login_row = findOne(f"SELECT `user_no` FROM mini.`login` WHERE `id`='{user}'")
  if not login_row:
    return {"status": False, "message": "로그인 정보가 없습니다."}

  sql = (
    f"INSERT INTO mini.`board` (`title`, `content`, `user_no`) "
    f"VALUES ('{boardAddModel.title}', '{boardAddModel.content}', {login_row['user_no']})"
  )
  data = add_key(sql)
  if data[0]:
    return {"status": True, "message": "게시글 추가 완료", "result": data[1]}
  return {"status": False, "message": "게시글 추가 중 오류"}




@router.post("/{no}")
def board_view(no: int, payload = Depends(get_user)):
    sql = f"""
        SELECT b.`no`, b.`title`,b.`name`,b.`content`, b.`user_no`
        FROM mini.`board` AS b
        INNER JOIN mini.`user` AS u
        ON (b.`user_no` = u.`no` AND u.`del_yn` = 0)
        WHERE b.`del_yn`=0 AND b.`no` = {no}     
          """
    result = findOne(sql)
    if result:
        role = False
        if payload and int(payload["sub"]) ==result["user_no"]:
            role = True
        return {"status": True, "result": result, "role":role}
    return{"status": False, "message": "없는 글입니다"}
       


    
@router.delete("/{no}")
def board_delete(no: int, payload= Depends(get_user)):
    if payload:
        sql = f"""UPDATE mini.`board` 
            SET `del_yn` = 1  
            WHERE `no` = {no}"""
        if save(sql):
            return{"status": True,"message": "삭제되었습니다"}
        return{"status": False, "message": "오류가 발생되어 삭제되지않았습니다"}



  