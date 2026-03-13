from kafka import KafkaProducer  #메세지를 만드는 명령어

pd = KafkaProducer(bootstrap_servers='localhost:9092')

pd.send('test',b'Hello3 shagal')
pd.flush()