from model import Home, LoginRecord

from .csv_dao import CsvDao

# インスタンスを作成しておく
home_dao = CsvDao(
    "db/homes.csv", columns=["id", "sentence", "is_used", "created_at"], model=Home
)
login_record_dao = CsvDao(
    "db/login_records.csv", columns=["ip", "home_id", "created_at"], model=LoginRecord
)
