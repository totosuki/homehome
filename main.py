import argparse

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from apscheduler.schedulers.background import BackgroundScheduler

from dao import home_dao, login_record_dao
from service import HomeService, LoginRecordService

parser = argparse.ArgumentParser()
parser.add_argument("--env", type=str, default="production", help="Set environment")
args, _ = parser.parse_known_args()

app = FastAPI()

scheduler = BackgroundScheduler()

home_service = HomeService(home_dao)
login_record_service = LoginRecordService(login_record_dao)


class PostHomeRequest(BaseModel):
    sentence: str


# ほめ言葉を一つ返す
@app.get("/homes")
def get_home(req: Request):
    client_host = req.client.host

    home = home_service.find_random_one()
    # この時点で login_record が無ければ作成
    if not login_record_service.is_exist(client_host):
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


@app.get("/config.js")
async def get_config():
    config_js = f"""
    const config = {{
        BASE_URL: "{"http://localhost:8000" if args.env == "development" else "https://homehome.help"}",
    }};
    """
    return Response(content=config_js, media_type="application/javascript")


app.mount("/", StaticFiles(directory="front", html=True), name="static")

if __name__ == "__main__":
    scheduler.add_job(login_record_service.reset, "cron", hour=15, minute=0) # UTCのためhour=15
    scheduler.start()
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
