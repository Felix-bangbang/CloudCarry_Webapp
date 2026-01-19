import os
import requests
from datetime import datetime, timedelta
from jose import jwt

# --- CONFIG ---
APP_ID = os.getenv("WECHAT_APPID") 
APP_SECRET = os.getenv("WECHAT_SECRET")

# JWT Settings
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

# 1. JWT Helper
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7) 
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# 2. WeChat Login
def wechat_login(code: str):
    url = f"https://api.weixin.qq.com/sns/jscode2session?appid={APP_ID}&secret={APP_SECRET}&js_code={code}&grant_type=authorization_code"
    response = requests.get(url)
    return response.json()

# 3. Content Security (msgSecCheck)
# We need a cached access token for this
_ACCESS_TOKEN_CACHE = {"token": None, "expires_at": 0}

def get_wechat_access_token():
    # Return cached token if valid
    import time
    if _ACCESS_TOKEN_CACHE["token"] and time.time() < _ACCESS_TOKEN_CACHE["expires_at"]:
        return _ACCESS_TOKEN_CACHE["token"]
    
    # Fetch new token
    url = f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={APP_ID}&secret={APP_SECRET}"
    
    res = requests.get(url).json()
    
    if "access_token" in res:
        _ACCESS_TOKEN_CACHE["token"] = res["access_token"]
        _ACCESS_TOKEN_CACHE["expires_at"] = time.time() + 7000 
        return res["access_token"]
    return None

def check_content_safe(content: str, openid: str):
    """
    Returns True if content is safe. Raises exception or returns False if unsafe.
    """
    token = get_wechat_access_token()
    if not token:
        return True # Fail open if token fails

    url = f"https://api.weixin.qq.com/wxa/msg_sec_check?access_token={token}"
    payload = {
        "content": content,
        "version": 2,
        "scene": 2,
        "openid": openid
    }
    
    res = requests.post(url, json=payload).json()
    
    # errcode 0 means Safe. 87014 means Risky.
    if res.get("errcode") != 0:
        return False
    return True
