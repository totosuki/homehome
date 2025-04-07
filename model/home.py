from .base_model import BaseModel


class Home(BaseModel):
    id: int
    sentence: str
    is_used: bool
    created_at: str
