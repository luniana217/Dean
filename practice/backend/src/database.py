# src/database.py - MariaDB 연결 및 세션 관리
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from settings import settings

print(f"!!!! DB_HOST: {settings.db_host}")
print(f"!!!! DB_PORT: {settings.db_port}")
print(f"!!!! DB_USER: {settings.db_user}")
print(f"!!!! DB_NAME: {settings.db_name}")
print(f"!!!! DB 접속 IP: {settings.db_host}")
print(f"!!!! DB 전체 URL: {settings.db_user}@{settings.db_host}:{settings.db_port}/{settings.db_name}")

# ────────────────────────────────────────
# DB 연결 URL 구성
# settings.py에 DB 접속 정보 추가 필요
# ────────────────────────────────────────
DATABASE_URL = (
    f"mysql+pymysql://{settings.db_user}:{settings.db_password}"
    f"@{settings.db_host}:{settings.db_port}/{settings.db_name}"
    f"?charset=utf8mb4"
)

# SQLAlchemy 엔진 생성
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # 커넥션 끊김 자동 감지
    pool_recycle=3600,    # 1시간마다 커넥션 재생성 (MariaDB 타임아웃 대비)
    echo=False,           # SQL 쿼리 로그 출력 여부 (디버깅 시 True로 변경)
)

# 세션 팩토리 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ORM Base 클래스
Base = declarative_base()


# ────────────────────────────────────────
# 게시글 테이블 모델 정의
# ────────────────────────────────────────
class Post(Base):
    __tablename__ = "diary"

    id      = Column(Integer, primary_key=True, index=True, autoincrement=True)
    author  = Column(String(100), nullable=False)        # 작성자
    title   = Column(String(255), nullable=False)        # 제목
    content = Column(Text, nullable=False)               # 내용
    created_at = Column(DateTime, default=datetime.now)  # 작성일시
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)


def init_db():
    """서버 시작 시 테이블 자동 생성 (없을 때만)"""
    Base.metadata.create_all(bind=engine)


def get_db():
    """DB 세션 의존성 주입용 제너레이터"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()