from dataclasses import dataclass, fields
from typing import Any, Dict, Type, TypeVar

T = TypeVar("T", bound="BaseModel")


@dataclass
class BaseModel:
    @classmethod
    def from_dict(cls: Type[T], data: Dict[str, Any]) -> T:
        return cls(**data)

    @classmethod
    def get_columns(cls) -> list[str]:
        return [f.name for f in fields(cls)]
