import datetime
import uuid

from dao import CsvDao, home_dao
from model import Home, LoginRecord
from service import DataService


class LoginRecordService(DataService):
    def __init__(self, dao: CsvDao[LoginRecord]):
        super().__init__()
        self.dao = dao

    def create(self, ip: str, home_id: str) -> str:
        """
        LoginRecord を作成し、発行したハッシュを返す
        """
        new_hash = str(uuid.uuid4())
        login_record = LoginRecord.from_dict(
            {
                "hash": new_hash,
                "ip": ip,
                "home_id": home_id,
                "has_posted": False,
                "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
        )
        self.dao.add_row(login_record)
        return new_hash

    def update(self, login_record: LoginRecord):
        self.dao.update_row(login_record, key_column="ip")

    def update_has_posted(self, login_record: LoginRecord):
        login_record.has_posted = True
        self.update(login_record)

    def find_by_ip(self, ip: str) -> LoginRecord | None:
        # ip が既に登録されているか
        login_records = self.dao.find_by_column("ip", ip)
        if login_records:
            return login_records
        else:
            return None

    def find_by_hash(self, hash: str) -> LoginRecord | None:
        # ip が既に登録されているか
        login_records = self.dao.find_by_column("hash", hash)
        if login_records:
            return login_records[0]
        else:
            return None

    def received(self, hash: str) -> Home:
        # 受け取り済みの褒め言葉があれば返す
        login_record = self.find_by_hash(hash)
        if login_record:
            received_home = home_dao.find_by_column("id", login_record.home_id)[0]
            return received_home
        else:
            return {}

    def reset(self):
        self.dao.reset()
