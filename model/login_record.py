from dataclasses import dataclass

from .base_model import BaseModel


@dataclass
class LoginRecord(BaseModel):
    ip: str
    home_id: int
    created_at: str
