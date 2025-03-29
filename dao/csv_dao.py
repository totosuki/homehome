import os

import pandas as pd


class CsvDao:
    """
    CSVファイルのデータにDataFrameを使ってアクセスするクラス
    """

    def __init__(self, path: str, columns: list):
        # csvのパス
        self.path = path
        # データ構造
        self.columns = columns

        if not os.path.exists(path):
            self.reset()
        else:
            self.df = pd.read_csv(self.path)

    def reset(self):
        self.df = pd.DataFrame(columns=self.columns)
        self.df.to_csv(self.path, index=False)

    def get_df(self):
        return pd.read_csv(self.path)

    def save_df_to_csv(self, df: pd.DataFrame):
        self.df = df
        self.df.to_csv(self.path, index=False)
