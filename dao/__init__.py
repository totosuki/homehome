from model import Home, LoginRecord

from .csv_dao import CsvDao

# インスタンスを作成しておく
home_dao = CsvDao("db/homes.csv", model=Home)
login_record_dao = CsvDao("db/login_records.csv", model=LoginRecord)
