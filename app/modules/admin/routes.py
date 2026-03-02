from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.modules.products.models import Product
from app.modules.affiliates.models import AffiliateLink, ReferralClick
from app.modules.auth.dependencies import get_admin
from app.modules.users.models import User

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/products/pending")
def get_pending_products(db: Session = Depends(get_db), admin: User = Depends(get_admin)):
    return db.query(Product).filter(Product.status == "pending").order_by(Product.created_at.desc()).all()

@router.get("/products/approved")
def get_approved_products(db: Session = Depends(get_db), admin: User = Depends(get_admin)):
    return db.query(Product).filter(Product.status == "approved").order_by(Product.created_at.desc()).all()

@router.get("/products/rejected")
def get_rejected_products(db: Session = Depends(get_db), admin: User = Depends(get_admin)):
    return db.query(Product).filter(Product.status == "rejected").order_by(Product.created_at.desc()).all()

@router.post("/products/{product_id}/approve")
def approve_product(product_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")
    product.status = "approved"
    product.rejection_reason = None
    db.commit()
    return {"message": "Product approved"}

@router.post("/products/{product_id}/reject")
def reject_product(product_id: int, payload: dict, db: Session = Depends(get_db), admin: User = Depends(get_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")
    product.status = "rejected"
    product.rejection_reason = payload.get("reason")
    db.commit()
    return {"message": "Product rejected"}

# ── User Management ──────────────────────────────────────

@router.get("/users")
def list_users(db: Session = Depends(get_db), admin: User = Depends(get_admin)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "is_active": u.is_active,
            "created_at": u.created_at,
        }
        for u in users
        if u.role != "admin"  # don't show admins in the list
    ]


@router.post("/users/{user_id}/deactivate")
def deactivate_user(user_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    if user.role == "admin":
        raise HTTPException(400, "Cannot deactivate admin accounts")
    user.is_active = False
    db.commit()
    return {"message": "User deactivated"}


@router.post("/users/{user_id}/activate")
def activate_user(user_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.is_active = True
    db.commit()
    return {"message": "User activated"}