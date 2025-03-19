import datetime
import os
import random

import pandas as pd


class Data:
    def __init__(self):
        if not os.path.exists("data.csv"):
            self.reset()
        else:
            self.df = pd.read_csv("data.csv")

    def reset(self):
        self.df = pd.DataFrame(columns=["id", "sentence", "created_at"])
        self.df.to_csv("data.csv", index=False)

    def add(self, sentence):
        self.df = pd.read_csv("data.csv")
        new_row = pd.DataFrame(
            [
                {
                    "id": self.df.shape[0] + 1,
                    "sentence": sentence,
                    "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                }
            ]
        )
        self.df = pd.concat([self.df, new_row], ignore_index=True)
        self.df.to_csv("data.csv", index=False)

    def get(self):
        self.df = pd.read_csv("data.csv")
        return self.df.iloc[random.randint(0, self.df.shape[0] - 1)]["sentence"]
