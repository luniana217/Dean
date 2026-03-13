from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse

app = FastAPI()

arr = []

@app.get("/",response_class=HTMLResponse) #주소담당. 얻는다는 get read방식 , 기존에 받는 방식에서 get은 string 방식으로 받는다
def root(txt): #기능담당. 급할경우 화면만 보내는것도 가능은 하다 parameter가 주고값이 되는데 인터넷창에
    return{"status": True, "txt": txt} #기본적인 문자열을 사용하는게 get방식이다

@app.post ("/{var}") #crud랑 개념이 비슷하다. 이중에선 create 즉 만드는 개념 기본적으로 json형식으로 받는다. 그렇기 때문에 form형식으로 바꿔야 한다. 주소 만들어서 넣는방식
def root(
    id : str = Form(""),
    pwd : str = Form(""),
    var : str = ""
       ):
    return{"status": True, "id": id, "pwd": pwd, "var" : var}

@app.get("/view",response_class=HTMLResponse)
def view():
    return"""
     <body>
        <form action="/2" method="post">
            <input type="text" name="id" />
            <input type="password" name="pwd" />
            <button type = "submit"> 요청 </button>        
        </form>
    </body>
"""
# json이 아닌 form 유형으로 받아줘야 한다
#form 형태가 아닌걸로 받아줘야 한다
# get 방식과 post 방식의 받는 방식은 서로 다르다
# get을 제외한 나머지는 form으로 
#post에 있는 값과 get에 있는 값은 1ㄷ1 이여야 한다
 #Form("")=초기값 ,Form() 무조건 와야한다

#변수에 담아서 클래스로 만들어줘야 한다. 작업이 하나라도 빠지면 진행이 안됨 
# 파이썬 시작 필수코드
# 위에 코드가 없으면 서버 자제가 안열림, 변수에 담아줘야지만 서버로 켜진다

# uv run fastapi dev --port 4546 (port번호 바꾸는, 환경변수 만드는 명령어)
# 기본 포트는 8000
# http://0.0.0.0:23306 0000 = 다 허용하겠다
# 다른곳에서 들어오기 위해선 uv run fastapi run 으로 실행을 시켜줘야 한다. 접속할때는 ip:port 로 접속가능해진다
# 