## postgres 이미지 다우노륻

```bash
docker pull postgres:15.17
```

##postgres container 생성
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=1234 --name pg postgres:15.17

```bash
