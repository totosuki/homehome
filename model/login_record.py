from dataclasses import dataclass

from .base_model import BaseModel


@dataclass
class LoginRecord(BaseModel):
    hash: str
    ip: str
    home_id: int
    has_posted: bool
    created_at: str
