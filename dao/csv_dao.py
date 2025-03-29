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

    def get_df_length(self):
        return self.get_df().shape[0]

    def save_df_to_csv(self, df: pd.DataFrame):
        self.df = df
        self.df.to_csv(self.path, index=False)

    def add_row(self, new_row_input: dict):
        # 新しいデータをDataFrameに変換、結合して保存
        new_row_df = pd.DataFrame([new_row_input])
        new_df = pd.concat([self.get_df(), new_row_df], ignore_index=True)
        self.save_df_to_csv(new_df)

    def find_by_index(self, index):
        df = self.get_df()
        return df.iloc[index]

    def record_exists(self, column: str, value) -> bool:
        #  指定した列と値を持つレコードが存在するかどうか
        if column not in self.df.columns:
            raise ValueError(f"Column '{column}' does not exist in the DataFrame.")
        return not self.df[self.df[column] == value].empty
