from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    # MySQL 必须指定长度，OpenID 一般 28 位，设 64 足够
    openid = Column(String(64), unique=True, index=True) 
    nickname = Column(String(64), nullable=True)
    
    contact_wechat = Column(String(64), nullable=True)
    contact_phone = Column(String(32), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    type = Column(String(32), index=True) 
    
    origin = Column(String(128))
    destination = Column(String(128))
    date = Column(String(32)) 
    
    capacity = Column(String(128), nullable=True)
    item_desc = Column(Text, nullable=True)
    remark = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ViewLog(Base):
    __tablename__ = "view_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    viewer_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("posts.id"))
    viewed_at = Column(DateTime(timezone=True), server_default=func.now())
