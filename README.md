# 🛠️ 開発環境のセットアップ
homehomeの開発環境は以下のステップで構築することができます。
### 1. Dockerコマンドが使える環境を用意する
[Docker Desktop](https://docs.docker.com/desktop/)をダウンロードするのがおすすめです。
### 2. リポジトリをCloneする
任意のディレクトリにて
```
$ git clone https://github.com/totosuki/homehome.git
```
を実行するか、Download ZIPボタンを押してダウンロードしましょう。
### 3. Dockerコンテナを起動する
cloneしたリポジトリのルートディレクトリで、以下の2つコマンドを順に実行するとDockerコンテナを作成し起動できます。
```
$ docker compose up -d --build
$ docker compose exec app bash
```
ここまでの手順でDockerコンテナ内に入ることができます。<br>
既にDockerコンテナを作成している場合は、以下のコマンドでDockerコンテナ内に入ることが可能です。
```
$ docker compose up -d
$ docker compose exec app bash
```