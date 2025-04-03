import datetime

from dao import CsvDao, home_dao
from model import Home, LoginRecord
from service import DataService


class LoginRecordService(DataService):
    def __init__(self, dao: CsvDao[LoginRecord]):
        super().__init__()
        self.dao = dao

    def create(self, ip: str, home_id: str):
        self.dao.add_row(
            {
                "ip": ip,
                "home_id": home_id,
                "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
        )

    def recieved(self, ip: str) -> Home:
        # 受け取り済みの褒め言葉があれば返す
        login_record = self.dao.find_by_column("ip", ip)
        if login_record:
            received_home = home_dao.find_by_column("id", login_record.home_id)
            return received_home
        else:
            return {}

    def is_exist(self, ip: str) -> bool:
        # ip が既に登録されているか
        login_record = self.dao.find_by_column("ip", ip)
        return bool(login_record)

    def reset(self):
        self.dao.reset()
