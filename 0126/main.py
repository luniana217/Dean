from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os #파일 관련으로 넣고싶을떈 os를 넣어야 한다
from controller import root, user, board

def urls():
    return [root.router, user.router, board.router]

app = FastAPI()

static_dir = os.path.join(os.path.dirname(__file__), "update")
app.mount("/update", StaticFiles(directory=static_dir), name="update")

apis = [root.router, user.router, board.router]
for r in apis:
    app.include_router(r)

# app.include_router(user.router)
# app.include_router(board.router)

@app.get("/push")
def test():
    return{"key":"연습"}