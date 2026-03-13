import mariadb
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

conn_params = {
  "user" : 'root',
  "password" : 'aiedu',
  "host" : '127.0.0.1',
  "database" : 'edu',
  "port" : 23306
}

# 실행 이랑, useYn

origins = [ "http://localhost:5173"]

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.post("/run")
def run(year:int, month: int):
  print("db_air 에서 db_to_air 데이터 이관 작업")
  try:
    conn = mariadb.connect(**conn_params)
    if conn:
      where = f"where 년도 = {year} and 월 = {month}"
      sql1 = f"delete from db_to_air.`비행` {where}"
      sql2 = f"insert into db_to_air.`비행` select * from db_air.`비행` {where}"
      sql3 = f"select count(*) as cnt from db_to_air.`비행` {where}"
      print("SQL 실행")
      cur = conn.cursor()
      cur.execute(sql1)
      cur.execute(sql2)
      conn.commit()
      cur.execute(sql3)
      row = cur.fetchone()
      print(f"적재 : {row[0]} 건")
      cur.close()
      conn.close()
  except mariadb.Error as e:
    print(f"접속 오류 : {e}")

@app.post("/")
def list(table: str, year:int = 0, month: int = 0):
  print("db_air 에서 db_to_air 데이터 이관 작업")
  try:
    conn = mariadb.connect(**conn_params)
    if conn:
      where = ""
      if year > 0 and month > 0:
        where = f"where 년도 = {year} and 월 = {month}"
      sql1 = f"delete from db_to_air.`{table}` {where}"
      sql2 = f"insert into db_to_air.`{table}` select * from db_air.`{table}` {where}"
      sql3 = f"select count(*) as cnt from db_to_air.`{table}` {where}"
      print("SQL 실행")
      cur = conn.cursor()
      cur.execute(sql1)
      cur.execute(sql2)
      conn.commit()
      cur.execute(sql3)
      row = cur.fetchone()
      print(f"{table} 적재 : {row[0]} 건")
      cur.close()
      conn.close()
  except mariadb.Error as e:
    print(f"접속 오류 : {e}")

@app.get("/")
def run(data: dict):
  print("db_air 에서 db_to_air 데이터 이관 작업")
  try:
    conn = mariadb.connect(**conn_params)
    if conn:
      no = data["no"]
      year = data["year"]
      month = data["month"]
      table = data["table"]
      where = ""
      if year > 0 and month > 0:
        where = f"where 년도 = {year} and 월 = {month}"
      sql1 = f"delete from db_to_air.`{table}` {where}"
      sql2 = f"insert into db_to_air.`{table}` select * from db_air.`{table}` {where}"
      sql3 = f"select count(*) as cnt from db_to_air.`{table}` {where}"
      print("SQL 실행")
      cur = conn.cursor()
      cur.execute(sql1)
      cur.execute(sql2)
      conn.commit()
      cur.execute(sql3)
      row = cur.fetchone()
      print(f"{table} 적재 : {row[0]} 건")
      sql4 = f"update db_to_air.jobs set `cnt` = {row[0]}, `modDate` = now() where `no` = {no}"
      cur.execute(sql4)
      conn.commit()
      cur.close()
      conn.close()
  except mariadb.Error as e:
    print(f"접속 오류 : {e}")

@app.post("/")
def jobs(useYn: tuple):
  try:
    conn = mariadb.connect(**conn_params)
    if conn:
      if isinstance(useYn, (list, tuple)):
        keys = ",".join(map(str, useYn))
      else:
        keys = useYn
      sql = f"select `no`, `table`, `year`, `month` from db_to_air.jobs where useYn in ({keys})"
      cur = conn.cursor()
      cur.execute(sql)
      rows = cur.fetchall()
      columns = [desc[0] for desc in cur.description]
      cur.close()
      conn.close()
      result = [dict(zip(columns, row)) for row in rows]
      return result
  except mariadb.Error as e:
    print(f"접속 오류 : {e}")
  return []

@app.get
def main(name):
  useYn = tuple([0])
  for row in jobs(useYn):
    if row: etl3(row)
  # etl2("비행", 1987, 10)
  # etl2("운반대")
  # etl2("항공사")
