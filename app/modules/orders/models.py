from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    affiliate_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    customer_email = Column(String, nullable=True)
    amount_paid = Column(Float, nullable=False)
    commission_amount = Column(Float, default=0.0)   # ← add this
    payment_status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # In app/modules/orders/models.py — add this column:
    merchant_order_id = Column(String, nullable=True)