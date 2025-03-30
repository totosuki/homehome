from dao import CsvDao


class DataService:
    """
    ロジックを担当してDAOとやりとりするクラス
    """

    def __init__(self, dao: CsvDao):
        self.dao = dao
