import datetime
import random

from dao import CsvDao
from model import Home
from service import DataService


class HomeService(DataService):
    def __init__(self, dao: CsvDao[Home]):
        super().__init__()
        self.dao = dao

    def create(self, sentence: str):
        self.dao.add_row(
            {
                # autoincrement
                "id": self.dao.get_df_length() + 1,
                "sentence": sentence,
                "is_used": False,
                "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
        )

    def update(self, home: Home):
        self.dao.update_row(home)

    def find_random_one(self) -> Home:
        homes = self.dao.find_by_column("is_used", False)

        if homes:
            # 基本は未使用の褒め言葉を返す
            random_index = random.randint(0, len(homes) - 1)
            home = homes[random_index]
            home.is_used = True
            self.update(home)
            return home

        else:
            # 未使用のものがなければ、使用済みの褒め言葉から返す
            used_homes = self.dao.find_by_column("is_used", True)
            random_index = random.randint(0, len(used_homes) - 1)
            return used_homes[random_index]
