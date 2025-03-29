import datetime
import random

from service import DataService


class HomeService(DataService):
    def __init__(self, data):
        super().__init__(data)

    def create(self, sentence: str):
        self.dao.add_row(
            {
                # autoincrement
                "id": self.dao.get_df_length() + 1,
                "sentence": sentence,
                "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
        )

    def find_random_one(self):
        return self.dao.find_by_index(random.randint(0, self.dao.get_df_length() - 1))
