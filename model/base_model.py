from typing import Any, Dict, Type, TypeVar

T = TypeVar("T", bound="BaseModel")


class BaseModel:
    @classmethod
    def from_dict(cls: Type[T], data: Dict[str, Any]) -> T:
        return cls(**data)
