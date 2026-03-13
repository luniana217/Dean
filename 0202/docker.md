

<!-- docker pull ubuntu:24.04 -->
<!-- docker hub 에서 이미지 다운로드 CLI -->

- `docker` : 도커 명령어
- `pull` : 받다
-`ubuntu` : 이미지 이름
- `:` 이미지 이름과 태그 구분자
-`24.04` : 태그 이름

<!-- docker 이미지 확인 -->

```bash
docker images
```

<!-- container = app 실행 -->


<!-- docker run -d -it --name ubtTeam1 ubuntu:24.04 -->

<!-- create 와 run을 동시에 -->

만들면 터미널에 digst: 가 끔
# 에 명령어 입력

사용자 바꿀대
# su ubuntu 

exit = 취소하고 나가기


docker exec -it ubtTeam1 /bin/bash(실행명령어)

useradd -m -s /bin/bash -c"Dean" dean (도커에 유저 추가)

cat /etc/passwd 유저목록 확인

root passwd = 123
dean passwd = dean

exit = 뒤로가기

su = 유저전환 (아마도 switch user?)

apt install -y = 묻지않고 다 설치하기
apt install '명령어'= 물어보고 설치하기 (지역,구역 두가지 물어봄)

vi 실행후 나가기 :q

vi = 파일 내용물 바꾸기 = 메모장

insert 나가기 = esc

:wq = write quit


>docker run -d -it -p 80:5173 --name nd node:24.13.0  portcode (port주소 정하는 )

react 의 호스트를 켜줘야 함