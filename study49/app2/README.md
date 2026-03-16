uv 형식 jupyter 설치

-프로젝트 생성
```bash
uv init .
```

-jupyter 모듈설치
```bash
uv add --dev ipykernel
```

-jupyter 실행
```bash
uv run --with jupyter jupyter lab
```

#수동으로 만들기 연습하기

# docker run -d -it -p 8080:8080 -p 7077:7077 -e SPARK_PUBLIC=localhost --name master my-spark:latest
