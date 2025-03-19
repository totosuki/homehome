from fastapi import FastAPI

app = FastAPI()


# ほめ言葉を一つ返す
@app.get("/home")
def get_home():
    # TODO DBから褒め言葉を一つ取得して返す処理
    return {"text": "生きててえらい"}


# ほめ言葉を一つ追加する
@app.post("/home")
def post_home(req):
    # TODO リクエストからDBに褒め言葉を保存する処理
    return {"req": req}
