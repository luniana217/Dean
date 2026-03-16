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