from fastapi import Body, FastAPI
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from dao import CsvDao
from service import HomeService

app = FastAPI()
home_dao = CsvDao("data.csv", columns=["id", "sentence", "created_at"])
home_service = HomeService(home_dao)


# ほめ言葉を一つ返す
@app.get("/home")
def get_home():
    res = home_service.find_random_one()
    return JSONResponse(content={"sentence": res.get("sentence")})


# ほめ言葉を一つ追加する
@app.post("/home")
def post_home(sentence: str = Body(..., media_type="text/plain")):
    print(f"[Debug] new sentence: {sentence}")
    home_service.create(sentence)
    return JSONResponse(
        content={"msg": f"new sentence '{sentence}' has been added successfully"}
    )


app.mount("/", StaticFiles(directory="front", html=True), name="static")
