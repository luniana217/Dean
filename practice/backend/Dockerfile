FROM python:3.11-slim

WORKDIR /backend

# uv 설치
RUN pip install uv

# 의존성 파일 복사
COPY pyproject.toml uv.lock ./

# 의존성 설치
RUN uv sync --frozen

# 나머지 코드
COPY . .

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]