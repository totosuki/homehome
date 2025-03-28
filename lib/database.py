import os

import pandas as pd


class Data:
    def __init__(self, path: str, columns: list):
        if not os.path.exists(path):
            self.reset()
        else:
            # csvのパス
            self.path = path
            # データ構造
            self.columns = columns

            self.df = pd.read_csv(self.path)

    def reset(self):
        self.df = pd.DataFrame(columns=self.columns)
        self.df.to_csv(self.path, index=False)

    def write_new_row(self, new_row_data):
        new_row_df = pd.DataFrame([new_row_data])
        self.df = pd.read_csv(self.path)
        self.df = pd.concat([self.df, new_row_df], ignore_index=True)
        self.df.to_csv(self.path, index=False)

    def find_by_index(self, index):
        self.df = pd.read_csv(self.path)
        return self.df.iloc[index]


class DataAccessObject:
    def __init__(self, data: Data):
        self.data = data
