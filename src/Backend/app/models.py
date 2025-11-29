from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class User(BaseModel):
    id: UUID
    name: Optional[str] = None
    major: Optional[str] = None
    year: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[str] = None
    interests: Optional[str] = None
    created: Optional[datetime] = None
    updated: Optional[datetime] = None

    class Config:
        from_attributes = True
