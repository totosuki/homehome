from fastapi import Body, FastAPI
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from lib.database import Data
from lib.home_dao import HomeDataAccessObject

app = FastAPI()
home_data = Data("data.csv", columns=["id", "sentence", "created_at"])
home_dao = HomeDataAccessObject(home_data)


# ほめ言葉を一つ返す
@app.get("/home")
def get_home():
    res = home_dao.find_random_one()
    return JSONResponse(content={"sentence": res.get("sentence")})


# ほめ言葉を一つ追加する
@app.post("/home")
def post_home(sentence: str = Body(..., media_type="text/plain")):
    print(f"[Debug] new sentence: {sentence}")
    home_dao.create(sentence)
    return JSONResponse(
        content={"msg": f"new sentence '{sentence}' has been added successfully"}
    )


app.mount("/", StaticFiles(directory="front", html=True), name="static")
