from dataclasses import dataclass


@dataclass
class LoginRecord:
    ip: int
    home_id: int
    created_at: str
