from kafka import KafkaConsumer  #메세지를 받는 명령어

cs = KafkaConsumer('test',bootstrap_servers=['localhost:9092']) #토픽,서버,[포트] 순서, 포트는 대괄호로 감싸준다 

for msg in cs:   
    print(msg.value)