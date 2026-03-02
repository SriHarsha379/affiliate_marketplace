from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class AffiliateLink(Base):
    __tablename__ = "affiliate_links"

    id = Column(Integer, primary_key=True)
    affiliate_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    ref_code = Column(String, unique=True, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ReferralClick(Base):
    __tablename__ = "referral_clicks"

    id = Column(Integer, primary_key=True)
    affiliate_link_id = Column(Integer, ForeignKey("affiliate_links.id"))
    ip_address = Column(String)
    clicked_at = Column(DateTime(timezone=True), server_default=func.now())
