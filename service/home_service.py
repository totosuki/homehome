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
                "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
        )

    def update(self, home: Home):
        self.dao.update_row(home)

    def find_random_one(self):
        home = self.dao.find_by_index(random.randint(0, self.dao.get_df_length() - 1))
        return home
