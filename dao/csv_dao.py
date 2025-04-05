import os
from dataclasses import asdict
from typing import Type

import pandas as pd


class CsvDao[T]:
    """
    CSVファイルのデータにDataFrameを使ってアクセスするクラス
    """

    def __init__(self, path: str, columns: list, model: Type[T]):
        # csvのパス
        self.path = path
        # データ構造
        self.columns = columns
        # 返すモデル
        self.model = model

        if not os.path.exists(path):
            self.reset()
        else:
            self.df = pd.read_csv(self.path)

    def reset(self):
        self.df = pd.DataFrame(columns=self.columns)
        self.df.to_csv(self.path, index=False)

    def get_df(self) -> pd.DataFrame:
        return pd.read_csv(self.path)

    def get_df_length(self) -> int:
        return self.get_df().shape[0]

    def save_df_to_csv(self, df: pd.DataFrame):
        self.df = df
        self.df.to_csv(self.path, index=False)

    def add_row(self, new_row: T):
        # 新しいデータをDataFrameに変換、結合して保存
        new_row_df = pd.DataFrame([new_row])
        new_df = pd.concat([self.get_df(), new_row_df], ignore_index=True)
        self.save_df_to_csv(new_df)

    def update_row(self, updated_row: T, key_column: str = "id"):
        updated_row_dict = asdict(updated_row)
        # 指定したキーの値に一致する行を更新する
        df = self.get_df()
        # キーの値が一致する行を探す
        mask = df[key_column] == updated_row_dict[key_column]

        if not mask.any():
            raise ValueError(
                f"Key '{updated_row_dict[key_column]}' not found in column '{key_column}'"
            )
        # 更新して保存
        for col, value in updated_row_dict.items():
            df.loc[mask, col] = value
        self.save_df_to_csv(df)

    def find_by_index(self, index: int) -> T:
        df = self.get_df()
        return self.model(**df.iloc[index])

    def find_by_column(self, column: str, value) -> list[T] | None:
        # 指定した列と値で検索し、該当する行をdict形式で返す
        if column not in self.df.columns:
            raise ValueError(f"Column '{column}' does not exist in the DataFrame.")

        result_df = self.df[self.df[column] == value]
        row_dict = result_df.to_dict(orient="records")
        if row_dict:
            return [self.model(**d) for d in row_dict]
