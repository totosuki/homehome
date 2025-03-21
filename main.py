from fastapi import FastAPI

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
def post_home(req):
    # TODO リクエストからDBに褒め言葉を保存する処理
    return {"req": req}
