from fastapi import FastAPI, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date
from typing import List

from . import models, schemas, utils, database
from .database import engine

# Create DB Tables automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- Dependencies ---

def get_db():
    return database.get_db()

def get_current_user(authorization: str = Header(None), db: Session = Depends(database.get_db)):
    """
    Validates JWT token from header and returns User object.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Token")
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = utils.jwt.decode(token, utils.SECRET_KEY, algorithms=[utils.ALGORITHM])
        openid: str = payload.get("sub")
        if openid is None:
            raise HTTPException(status_code=401, detail="Invalid Token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Token")
        
    user = db.query(models.User).filter(models.User.openid == openid).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- Routes ---

@app.get("/")
def health_check():
    return {"status": "CloudCarry Backend is Running"}

# 1. Login
@app.post("/api/auth/login")
def login(payload: dict, db: Session = Depends(database.get_db)):
    code = payload.get("code")
    wechat_data = utils.wechat_login(code)
    
    if "errcode" in wechat_data and wechat_data["errcode"] != 0:
        raise HTTPException(status_code=400, detail=f"WeChat Error: {wechat_data.get('errmsg')}")
        
    openid = wechat_data["openid"]
    
    # Find or Create User
    user = db.query(models.User).filter(models.User.openid == openid).first()
    if not user:
        user = models.User(openid=openid)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    # Generate JWT
    token = utils.create_access_token(data={"sub": openid})
    
    return {
        "token": token,
        "user": {
            "id": user.id,
            "wechat": user.contact_wechat,
            "phone": user.contact_phone
        }
    }

# 2. Update Profile
@app.post("/api/user/profile")
def update_profile(
    data: schemas.UserUpdate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    current_user.contact_wechat = data.contact_wechat
    current_user.contact_phone = data.contact_phone
    db.commit()
    return {"status": "success", "user": data}

# 3. Create Post (With Content Security)
@app.post("/api/posts")
def create_post(
    post: schemas.PostCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    # A. Check Profile Completeness
    if not current_user.contact_wechat:
        raise HTTPException(status_code=403, detail="Please complete your profile first.")

    # B. Content Security Check (WeChat)
    text_to_check = f"{post.origin} {post.destination} {post.item_desc or ''} {post.remark or ''}"
    is_safe = utils.check_content_safe(text_to_check, current_user.openid)
    
    if not is_safe:
        raise HTTPException(status_code=400, detail="Content contains sensitive words.")
    
    # C. Save
    new_post = models.Post(
        user_id=current_user.id,
        **post.dict()
    )
    db.add(new_post)
    db.commit()
    return {"status": "success", "id": new_post.id}

# 4. Get Posts (Public List - No Contacts)
@app.get("/api/posts", response_model=List[schemas.PostList])
def get_posts(type: str = None, db: Session = Depends(database.get_db)):
    query = db.query(models.Post)
    if type:
        query = query.filter(models.Post.type == type)
    
    # Order by newest first
    return query.order_by(models.Post.created_at.desc()).limit(50).all()

# 5. Reveal Contact (The Gatekeeper)
@app.get("/api/posts/{post_id}/contact", response_model=schemas.ContactReveal)
def reveal_contact(
    post_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Rule 1: Requester must have filled their own wechat
    if not current_user.contact_wechat:
        raise HTTPException(status_code=403, detail="Please complete your profile first.")
        
    # Rule 2: Rate Limit (Max 5 per day)
    today = datetime.utcnow().date()
    view_count = db.query(models.ViewLog).filter(
        models.ViewLog.viewer_id == current_user.id,
        func.date(models.ViewLog.viewed_at) == today
    ).count()
    
    if view_count >= 5:
        raise HTTPException(status_code=429, detail="Daily limit exceeded (Max 5).")

    # Fetch Target Post
    target_post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not target_post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    target_user = db.query(models.User).filter(models.User.id == target_post.user_id).first()
    
    # Log the view
    log = models.ViewLog(viewer_id=current_user.id, post_id=post_id)
    db.add(log)
    db.commit()
    
    return {
        "wechat": target_user.contact_wechat,
        "phone": target_user.contact_phone
    }