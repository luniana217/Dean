import mariadb
import os
from dotenv import load_dotenv

load_dotenv()

conn_params = {
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DB_DATABASE"),
    "port": int(os.getenv("DB_PORT"))
}

def getConn():
    try:
        return mariadb.connect(**conn_params)
    except mariadb.Error as e:
        print(f"접속 오류 : {e}")
        return None

def findOne(sql):
    result = None
    try:
        conn = getConn()
        if conn:
            cur = conn.cursor()
            cur.execute(sql)
            row = cur.fetchone()
            columns = [desc[0] for desc in cur.description] if cur.description else []
            result = dict(zip(columns, row)) if row else None
            cur.close()
            conn.close()
    except mariadb.Error as e:
        print(f"MariaDB Error : {e}")
    return result

def findAll(sql):
    result = []
    try:
        conn = getConn()
        if conn:
            cur = conn.cursor()
            cur.execute(sql)
            rows = cur.fetchall()
            columns = [desc[0] for desc in cur.description] if cur.description else []
            result = [dict(zip(columns, row)) for row in rows]
            cur.close()
            conn.close()
    except mariadb.Error as e:
        print(f"MariaDB Error : {e}")
    return result

def save(sql):
    try:
        conn = getConn()
        if conn:
            cur = conn.cursor()
            cur.execute(sql)
            conn.commit()
            cur.close()
            conn.close()
            return True
    except mariadb.Error as e:
        print(f"MariaDB Error : {e}")
    return False
