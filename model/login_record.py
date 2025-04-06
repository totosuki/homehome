from .base_model import BaseModel


class LoginRecord(BaseModel):
    ip: str
    home_id: int
    created_at: str
