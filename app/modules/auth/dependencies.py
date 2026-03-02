from fastapi import Cookie, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
from jose import JWTError

from app.database import get_db
from app.modules.auth.utils import decode_token
from app.modules.users.models import User


def get_current_user(
    access_token: Optional[str] = Cookie(default=None),
    db: Session = Depends(get_db),
) -> User:
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = decode_token(access_token)
        user_id = int(payload.get("sub"))   # ← cast to int
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except (JWTError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    return user


def require_role(*roles: str):
    def checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Access denied")
        return current_user
    return checker


def get_seller(current_user: User = Depends(require_role("seller"))):
    return current_user

def get_affiliate(current_user: User = Depends(require_role("affiliate"))):
    return current_user

def get_admin(current_user: User = Depends(require_role("admin"))):
    return current_user