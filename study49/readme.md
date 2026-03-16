.env 에 스파크를 넣어야지 스파크 명령어를 사용가능

.bashr

docker exec -ot my-os /bin/bash






# docker build -t my-spark:3 .


기존에 올렸던 이미지나 컨테이너가 남아있으면 잘 안될수 있으니
이미지 이름같은거 바꾸고 컨테이너 만약 기존에 했던거 있으면 삭제하고 다시 compose up 하기


java >https://jdk.java.net/archive/ 여기서 openjdk 21.0.2 2024-01-16 다운로드 > 압축풀기 >
환경변수에 

'새로생성'
key:  JAVA_HOME
value: 파일경로\jdk-21.0.2

'path' 에 추가
%JAVA_HOME%\bin



uv run --with jupyter jupyter lab


docker cp .\sample.text master:opt/spark/data/sample.text


docker exec -it (image이름) bash
>cd spark-4.1.-bin-hadoop3
>./sbin/start/master.sh 

치면 localhost:8080 들어가지고 7077은 스파크 내부에서 실행용


