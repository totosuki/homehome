from dataclasses import dataclass


@dataclass
class Home:
    id: int
    sentence: str
    is_used: bool
    created_at: str
