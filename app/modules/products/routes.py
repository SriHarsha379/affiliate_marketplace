from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.modules.products.models import Product
from app.modules.products.schemas import ProductCreate, ProductResponse
from app.modules.auth.dependencies import get_seller, get_current_user
from app.modules.users.models import User

router = APIRouter(
    prefix="/seller/products",
    tags=["Seller Products"]
)


@router.get("/", response_model=list[ProductResponse])
def list_seller_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_seller),
):
    return (
        db.query(Product)
        .filter(Product.seller_id == current_user.id)
        .order_by(Product.created_at.desc())
        .all()
    )


@router.post("/", response_model=ProductResponse)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_seller),
):
    product = Product(
        seller_id=current_user.id,
        title=payload.title,
        description=payload.description,
        price=payload.price,
        commission_percent=payload.commission_percent,
        product_type=payload.product_type,
        product_access_url=payload.product_access_url,
        image_base64=payload.image_base64,
        status="pending",
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_seller),
):
    product = (
        db.query(Product)
        .filter(
            Product.id == product_id,
            Product.seller_id == current_user.id,   # ← scoped to this seller only
        )
        .first()
    )

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.status == "approved":
        raise HTTPException(
            status_code=400,
            detail="Approved products cannot be edited"
        )

    product.title = payload.title
    product.description = payload.description
    product.price = payload.price
    product.commission_percent = payload.commission_percent
    product.product_type = payload.product_type
    product.product_access_url = payload.product_access_url
    product.image_base64 = payload.image_base64

    # resubmission flow — reset back to pending on edit after rejection
    if product.status == "rejected":
        product.status = "pending"
        product.rejection_reason = None

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_seller),
):
    product = (
        db.query(Product)
        .filter(
            Product.id == product_id,
            Product.seller_id == current_user.id,   # ← can't delete another seller's product
        )
        .first()
    )

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"success": True}


# ─────────────────────────────────────────────
# Public router — no auth required
# ─────────────────────────────────────────────

public_router = APIRouter(
    prefix="/products",
    tags=["Public Products"]
)


@public_router.get("/", response_model=list[ProductResponse])
def get_approved_products(db: Session = Depends(get_db)):
    return (
        db.query(Product)
        .filter(Product.status == "approved")
        .order_by(Product.created_at.desc())
        .all()
    )


@public_router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = (
        db.query(Product)
        .filter(Product.id == product_id, Product.status == "approved")
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product