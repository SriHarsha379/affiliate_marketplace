from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.modules.products.models import Product
from app.modules.products.schemas import ProductCreate, ProductResponse

router = APIRouter(prefix="/seller/products", tags=["Seller Products"])

# TEMP: fake seller id (we’ll replace with auth)
FAKE_SELLER_ID = 1


@router.post("/", response_model=ProductResponse)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    product = Product(
        seller_id=FAKE_SELLER_ID,
        title=payload.title,
        description=payload.description,
        price=payload.price,
        commission_percent=payload.commission_percent,
        product_type=payload.product_type,
        file_url=payload.file_url,
        status="pending"
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/", response_model=list[ProductResponse])
def list_seller_products(db: Session = Depends(get_db)):
    products = (
        db.query(Product)
        .filter(Product.seller_id == FAKE_SELLER_ID)
        .order_by(Product.created_at.desc())
        .all()
    )
    return products
