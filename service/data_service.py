import pandas as pd

from dao import CsvDao


class DataService:
    """
    ロジックを担当してDAOとやりとりするクラス
    """

    def __init__(self, dao: CsvDao):
        self.dao = dao

    def get_df_length(self):
        return self.dao.get_df().shape[0]

    def get_next_id(self):
        # autoincrementなidを返す
        return self.get_df_length() + 1

    def write_new_row(self, new_row_input: dict):
        # idを振る
        new_row_input["id"] = self.get_next_id()
        new_row_df = pd.DataFrame([new_row_input])
        new_df = pd.concat([self.dao.get_df(), new_row_df], ignore_index=True)
        self.dao.save_df_to_csv(new_df)

    def find_by_index(self, index):
        df = self.dao.get_df()
        return df.iloc[index]
