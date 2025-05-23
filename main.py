import argparse
import html
from dataclasses import asdict

import uvicorn
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, constr

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
    sentence: constr(strip_whitespace=True, min_length=1, max_length=20)
    hash: str


# ほめ言葉を一つ返す
@app.get("/homes")
def get_home(req: Request):
    client_host = req.client.host

    home = home_service.find_random_one()
    login_records = login_record_service.find_by_ip(client_host)
    # 同じIPに LoginRecord は10個まで
    if len(login_records) < 100:
        # LoginRecord を作成し、ハッシュを取得
        new_hash = login_record_service.create(ip=client_host, home_id=home.id)
        return JSONResponse(content={"sentence": home.sentence, "hash": new_hash})

    else:
        return JSONResponse(
            content={"detail": "同一IPからの今日のリクエストが上限に達しました。"},
            status_code=403,
        )


# ほめ言葉を一つ追加する
@app.post("/homes")
def post_home(req: Request, body: PostHomeRequest):
    # 同日2回目以降の登録は弾く
    login_record = login_record_service.find_by_hash(body.hash)
    if login_record.has_posted:
        raise HTTPException(status_code=429, detail="今日の登録は済んでいます。")
    # バリデーション
    if "," in body.sentence:
        raise HTTPException(status_code=400, detail="カンマ（,）は使用できません。")
    safe_sentence = html.escape(body.sentence)
    home_service.create(safe_sentence)
    # LoginRecord にPOSTしたことを記録
    login_record_service.update_has_posted(login_record)
    return JSONResponse(
        content={"msg": f"new sentence '{body.sentence}' has been added successfully"}
    )


# 受け取り済みの home があれば返す（hash はクエリパラメータ）
@app.get("/homes/received")
def received(hash: str):
    received = login_record_service.received(hash)
    if received:
        return JSONResponse(content=asdict(received))


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
    scheduler.add_job(
        login_record_service.reset, "cron", hour=15, minute=0
    )  # UTCのためhour=15
    scheduler.start()

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
