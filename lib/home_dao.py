import datetime
import random

from .database import DataAccessObject


class HomeDataAccessObject(DataAccessObject):
    def __init__(self, data):
        super().__init__(data)

    def create(self, sentence: str):
        self.data.write_new_row(
            {
                "id": self.data.df.shape[0] + 1,
                "sentence": sentence,
                "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
        )

    def find_random_one(self):
        return self.data.find_by_index(random.randint(0, self.data.df.shape[0] - 1))
