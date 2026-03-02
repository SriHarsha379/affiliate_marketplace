from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy import Text

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    price = Column(Float, nullable=False)
    commission_percent = Column(Float, nullable=False)

    product_type = Column(String, nullable=False)  # course / software / service
    product_access_url = Column(String, nullable=True)  # NEW

    image_base64 = Column(Text, nullable=True)

    status = Column(String, default="pending")
    rejection_reason = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


