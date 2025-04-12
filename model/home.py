from dataclasses import dataclass
from datetime import datetime, timedelta

from .base_model import BaseModel


@dataclass
class Home(BaseModel):
    id: int
    sentence: str
    is_used: bool
    created_at: str

    def suitable(self) -> bool:
        """今この褒め言葉を出しても良いかどうかを判定"""
        if self.is_used:
            return False
        created_dt = datetime.strptime(self.created_at, "%Y-%m-%d %H:%M:%S")
        return datetime.now() - created_dt > timedelta(days=1)
