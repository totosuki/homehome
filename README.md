# homehome

## 🌸 今日も誰かを褒めよう

**homehome** は、「一日に一回、誰かがくれた褒め言葉を見て、一日に一回、誰かを褒める」シンプルなWebアプリです。

- 1日1回まで誰かの褒め言葉を見る
- 1日1回まで誰かを褒める言葉を投稿する
- ログイン不要、完全匿名
- 技術：HTML / CSS / JS + FastAPI + Pandas (CSV)

**URL**: https://homehome.help

## 🚀 クイックスタート

### ローカルで試す

1. このリポジトリをクローン：
```
git clone https://github.com/totosuki/homehome.git
```

2. Docker Compose を使って起動：
```
docker compose -f docker-compose.local.yml up -d --build
```

3. ブラウザで以下にアクセス！：<br>
   http://localhost:8000

## 📦 本番環境で動かす（例：AWS EC2）

1. Docker / Docker Compose を用意
2. このリポジトリを配置
3. 以下で起動：
```
docker compose -f docker-compose.prod.yml up -d --build
```
4. ドメインや証明書設定は nginx/conf.d や certbot を参照


# 📝 詳細情報（技術構成・仕様）

## 機能

### 褒め言葉を見る

- ユーザーは1日1回まで、誰かが投稿した褒め言葉を受け取れます。
- 同じ日に再アクセスしても新しい褒め言葉は出ません。

### 褒め言葉を書く

- 1日1回まで、20文字以内の褒め言葉を投稿できます。
- カンマ（,）は禁止文字です（CSV形式のため）。

### 制限管理

- IPアドレスでアクセス制限を判定
- 毎日日本時間0時（UTC 15:00）に制限をリセット（APScheduler使用）

---

## 技術スタック

| 層           | 使用技術                              |
|--------------|---------------------------------------|
| フロントエンド | HTML / CSS / JavaScript              |
| バックエンド   | Python / FastAPI / Uvicorn / APScheduler |
| データ管理     | Pandas / CSVファイル                  |
| インフラ       | Docker / Nginx / Certbot（Let's Encrypt） |

---

## 📁 ディレクトリ構成

```
homehome/
├── front/                     # フロント（HTML, JS, CSS, 画像など）
├── service/                   # ビジネスロジック（データ取得・登録処理）
├── dao/                       # CSVアクセス層（Pandas使用）
├── model/                     # データモデル（dataclass）
├── db/                        # CSVデータ保存場所
├── nginx/                     # 本番用 Nginx 設定・SSL証明書関連
├── main.py                    # FastAPI アプリ本体
├── docker-compose.local.yml   # ローカル開発用定義
├── docker-compose.prod.yml    # 本番用定義
└── Dockerfile                 # FastAPI用Dockerビルド
```


## ⚙️ 実行方法（ローカル）

1. リポジトリをクローンし、以下を実行：
```
docker compose -f docker-compose.local.yml up -d --build
```
2. 起動したらブラウザで以下にアクセス：
   http://localhost:8000


## 🌐 実行方法（本番環境）

- Docker Compose によるマルチサービス構成：
  - app：FastAPIアプリ
  - nginx：リバースプロキシ
  - certbot：SSL証明書取得

- 起動コマンド：
```
docker compose -f docker-compose.prod.yml up -d --build
```
- ドメインやHTTPS設定を変更する場合：
  - nginx/conf.d/default.conf
  - certbot起動時のコマンド・メールアドレス など


## 💡 備考・注意点

- データ保存はCSVファイルベース。データベースは使用していません。
- 同一IPのユーザーは同一人物として制限されます。
- ライセンス：MIT

---

今日も誰かを褒めよう 🫶
