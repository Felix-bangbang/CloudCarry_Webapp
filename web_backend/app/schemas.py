from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    contact_wechat: Optional[str] = None
    contact_phone: Optional[str] = None

class UserUpdate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    openid: str
    class Config:
        from_attributes = True

# --- Post Schemas ---
class PostCreate(BaseModel):
    type: str # 'traveler' or 'sender'
    origin: str
    destination: str
    date: str
    capacity: Optional[str] = None
    item_desc: Optional[str] = None
    remark: Optional[str] = None

class PostList(PostCreate):
    id: int
    user_id: int
    created_at: datetime
    # Note: Contact info is purposefully MISSING here
    class Config:
        from_attributes = True

# --- Contact Reveal Schema ---
class ContactReveal(BaseModel):
    wechat: str
    phone: Optional[str] = None
