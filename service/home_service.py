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
        home = Home.from_dict(
            {
                # autoincrement
                "id": self.dao.get_df_length() + 1,
                "sentence": sentence,
                "is_used": False,
                "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
        )
        self.dao.add_row(home)

    def update(self, home: Home):
        self.dao.update_row(home)

    def find_random_one(self) -> Home:
        homes = self.dao.find_by_column("is_used", False)
        suitable_homes = [home for home in homes if home.suitable()]

        if suitable_homes:
            # 基本は未使用の褒め言葉を返す
            home = random.choice(suitable_homes)
            home.is_used = True
            self.update(home)
            return home

        else:
            # 未使用のものがなければ、使用済みの褒め言葉から返す
            used_homes = self.dao.find_by_column("is_used", True)
            return random.choice(used_homes)
