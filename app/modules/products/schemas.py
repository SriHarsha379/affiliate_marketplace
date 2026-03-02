from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    commission_percent: float
    product_type: str
    product_access_url: str          # ✅ REQUIRED
    image_base64: Optional[str] = None


class ProductResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    price: float
    commission_percent: float        # ✅ OK here
    product_type: str
    product_access_url: Optional[str]
    status: str
    image_base64: Optional[str] = None
    rejection_reason: Optional[str] = None

    class Config:
        orm_mode = True

class PublicProductResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    price: float
    product_type: str
    image_base64: Optional[str] = None

    class Config:
        orm_mode = True



class RejectProductRequest(BaseModel):
    reason: str