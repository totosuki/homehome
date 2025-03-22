from fastapi import Body, FastAPI
from fastapi.staticfiles import StaticFiles

from database import Data

app = FastAPI()
data = Data()


# ほめ言葉を一つ返す
@app.get("/home")
def get_home():
    sentence = data.get()
    return {"text": sentence}


# ほめ言葉を一つ追加する
@app.post("/home")
def post_home(req: str = Body(..., media_type="text/plain")):
    print(f"[Debug] new sentence: {req}")
    data.add(req)
    return {"req": req}


app.mount("/", StaticFiles(directory="front", html=True), name="static")
