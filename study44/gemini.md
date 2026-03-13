def main():
    conn = getConn()
    if not conn:
        return

    try:
        cur = conn.cursor()
        
        # 1. 데이터 추출 (Extract)
        # db_air.비행 테이블의 전체 컬럼을 가져온다고 가정합니다.
        select_sql = "SELECT * FROM db_air.비행"
        cur.execute(select_sql)
        rows = cur.fetchall() # 모든 데이터를 메모리에 가져옴
        
        if not rows:
            print("복사할 데이터가 없습니다.")
            return

        # 2. 데이터 로드 (Load)
        # edu 데이터베이스에 동일한 구조의 'flight_copy' 테이블이 있다고 가정합니다.
        # 컬럼 개수에 맞춰 %s를 조절하세요.
        insert_sql = "INSERT INTO edu.flight_copy VALUES (%s, %s, %s, %s)" 
        
        # executemany를 사용하면 대량의 데이터를 빠르게 넣을 수 있습니다.
        cur.executemany(insert_sql, rows)
        
        # 3. 변경사항 반영
        conn.commit()
        print(f"{cur.rowcount}개의 행이 성공적으로 이전되었습니다.")

    except mariadb.Error as e:
        print(f"작업 중 오류 발생: {e}")
        conn.rollback() # 오류 발생 시 되돌리기
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    main()


"재사용"
다시 쓸수 있으니 이렇게 만들면 안될까
이렇게 만들면 다시 쓸수 있을까?

최대한 하나의 함수에 맞춰서 동작할수 있게끔 만들어야 한다