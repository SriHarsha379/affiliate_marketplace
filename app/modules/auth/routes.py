from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.modules.users.models import User
from app.modules.auth.schemas import SignupRequest, LoginRequest, UserResponse
from app.modules.auth.utils import hash_password, verify_password, create_access_token
from app.modules.auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

ALLOWED_SIGNUP_ROLES = {"seller", "affiliate"}


@router.post("/signup", response_model=UserResponse)
def signup(payload: SignupRequest, response: Response, db: Session = Depends(get_db)):
    if payload.role not in ALLOWED_SIGNUP_ROLES:
        raise HTTPException(400, "Invalid role. Choose 'seller' or 'affiliate'")

    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(400, "Email already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "role": user.role})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="none",  # 🔥 REQUIRED for cross-site POST
        secure=True,  # 🔥 REQUIRED when SameSite=None
        max_age=60 * 60 * 24,
    )

    return user


@router.post("/login", response_model=UserResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")

    if not user.is_active:
        raise HTTPException(403, "Account is deactivated")

    token = create_access_token({"sub": user.id, "role": user.role})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="none",  # 🔥 REQUIRED for cross-site POST
        secure=True,  # 🔥 REQUIRED when SameSite=None
        max_age=60 * 60 * 24,
    )

    return user


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user