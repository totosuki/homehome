import datetime

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
        # 今日は既にこのipで褒め言葉を受け取ったかどうかを判定
        return self.dao.record_exists("ip", ip)
