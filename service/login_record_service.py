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

    def recieved(self, ip: str):
        # 受け取り済みの褒め言葉があれば返す
        login_record = self.dao.find_by_column("ip", ip)
        received_home = home_dao.find_by_column("id", login_record.get("home_id"))
        return received_home
