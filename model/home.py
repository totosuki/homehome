from dataclasses import dataclass

from .base_model import BaseModel


@dataclass
class Home(BaseModel):
    id: int
    sentence: str
    is_used: bool
    created_at: str
