from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class Profile(BaseModel):
    id: UUID
    name: Optional[str] = None
    email: Optional[str] = None
    major: Optional[str] = None
    year: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[str] = None
    interests: Optional[str] = None
    created: Optional[datetime] = None
    updated: Optional[datetime] = None

    class Config:
        from_attributes = True

class Project(BaseModel):
    id: Optional[UUID] = None
    #owner_id: Optional[UUID] = None
    title: str
    description: Optional[str] = None
    status: Optional[str] = None
    created: Optional[datetime] = None
    updated: Optional[datetime] = None

    class Config:
        from_attributes = True

