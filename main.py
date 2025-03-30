from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from dao import home_dao, login_record_dao
from service import HomeService, LoginRecordService

app = FastAPI()

home_service = HomeService(home_dao)
login_record_service = LoginRecordService(login_record_dao)


class PostHomeRequest(BaseModel):
    sentence: str


# ほめ言葉を一つ返す
@app.get("/homes")
def get_home(req: Request):
    client_host = req.client.host

    home = home_service.find_random_one()
    login_record_service.create(ip=client_host, home_id=home.get("id"))

    return JSONResponse(content={"sentence": home.get("sentence")})


# ほめ言葉を一つ追加する
@app.post("/homes")
def post_home(req: PostHomeRequest):
    print(f"[Debug] new sentence: {req.sentence}")
    home_service.create(req.sentence)
    return JSONResponse(
        content={"msg": f"new sentence '{req.sentence}' has been added successfully"}
    )


# 受け取り済みの home があれば返す
@app.get("/homes/received")
def received(req: Request):
    client_host = req.client.host
    received = login_record_service.recieved(client_host)
    return JSONResponse(content=received)


app.mount("/", StaticFiles(directory="front", html=True), name="static")
