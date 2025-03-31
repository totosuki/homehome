import datetime

from dao import home_dao
from service import DataService


class LoginRecordService(DataService):
    def __init__(self, dao):
        super().__init__(dao)

    def create(self, ip: str, home_id: str):
        self.dao.add_row(
            {
                # autoincrement
                "ip": ip,
                "home_id": home_id,
                "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
        )

    def recieved(self, ip: str) -> dict:
        # 受け取り済みの褒め言葉があれば返す
        login_records = self.dao.find_by_column("ip", ip)
        if login_records:
            received_homes = home_dao.find_by_column(
                "id", login_records[0].get("home_id")
            )
            return received_homes[0]
        else:
            return {}

    def is_exist(self, ip: str) -> dict:
        # ip が既に登録されているか
        login_records = self.dao.find_by_column("ip", ip)
        return bool(login_records)
