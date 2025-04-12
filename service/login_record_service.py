import datetime

from dao import CsvDao, home_dao
from model import Home, LoginRecord
from service import DataService


class LoginRecordService(DataService):
    def __init__(self, dao: CsvDao[LoginRecord]):
        super().__init__()
        self.dao = dao

    def create(self, ip: str, home_id: str):
        login_record = LoginRecord.from_dict(
            {
                "ip": ip,
                "home_id": home_id,
                "has_posted": False,
                "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
        )
        self.dao.add_row(login_record)

    def received(self, ip: str) -> Home:
        # 受け取り済みの褒め言葉があれば返す
        login_record = self.dao.find_by_column("ip", ip)
        if login_record:
            received_home = home_dao.find_by_column("id", login_record[0].home_id)[0]
            return received_home
        else:
            return {}

    def is_exist(self, ip: str) -> bool:
        # ip が既に登録されているか
        login_records = self.dao.find_by_column("ip", ip)
        return bool(login_records)

    def reset(self):
        self.dao.reset()
