from dataclasses import dataclass


@dataclass
class LoginRecord:
    ip: str
    home_id: int
    created_at: str
