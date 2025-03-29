from fastapi import Body, FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from dao import CsvDao
from service import HomeService, LoginRecordService

app = FastAPI()

home_dao = CsvDao("db/homes.csv", columns=["id", "sentence", "created_at"])
home_service = HomeService(home_dao)

login_record_dao = CsvDao(
    "db/login_records.csv", columns=["ip", "home_id", "created_at"]
)
login_record_service = LoginRecordService(login_record_dao)


# ほめ言葉を一つ返す
@app.get("/homes")
def get_home(req: Request):
    client_host = req.client.host

    home = home_service.find_random_one()
    login_record_service.create(ip=client_host, home_id=home.get("id"))

    return JSONResponse(content={"sentence": home.get("sentence")})


# ほめ言葉を一つ追加する
@app.post("/homes")
def post_home(sentence: str = Body(..., media_type="text/plain")):
    print(f"[Debug] new sentence: {sentence}")
    home_service.create(sentence)
    return JSONResponse(
        content={"msg": f"new sentence '{sentence}' has been added successfully"}
    )


# ほめ言葉を受け取ったかどうかを返す
@app.get("/homes/received")
def received(req: Request):
    client_host = req.client.host
    received = login_record_service.recieved(client_host)
    print(received)
    return JSONResponse(content={"received": received})


app.mount("/", StaticFiles(directory="front", html=True), name="static")
