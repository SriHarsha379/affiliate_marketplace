import uuid
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi.responses import RedirectResponse

from app.database import get_db
from app.modules.products.models import Product
from app.modules.affiliates.models import AffiliateLink, ReferralClick
from app.modules.orders.models import Order
from app.modules.auth.dependencies import get_affiliate
from app.modules.users.models import User

router = APIRouter(prefix="/affiliate", tags=["Affiliate"])
redirect_router = APIRouter(tags=["Referral"])


@router.get("/products")
def list_products_for_affiliate(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_affiliate),
):
    products = db.query(Product).filter(Product.status == "approved").all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "price": p.price,
            "commission_percent": p.commission_percent,
            "image_base64": p.image_base64,
            "product_type": p.product_type,
            "description": p.description,
        }
        for p in products
    ]


@router.post("/products/{product_id}/promote")
def promote_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_affiliate),
):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.status == "approved"
    ).first()
    if not product:
        raise HTTPException(404, "Product not found")

    existing = db.query(AffiliateLink).filter_by(
        affiliate_id=current_user.id,
        product_id=product_id
    ).first()

    if existing:
        return {
            "referral_link": f"http://localhost:3000/?ref={existing.ref_code}",
            "ref_code": existing.ref_code,
        }

    ref_code = uuid.uuid4().hex[:8]
    link = AffiliateLink(
        affiliate_id=current_user.id,
        product_id=product_id,
        ref_code=ref_code
    )
    db.add(link)
    db.commit()
    db.refresh(link)

    return {
        "referral_link": f"http://localhost:3000/?ref={ref_code}",
        "ref_code": ref_code,
    }


@router.get("/stats")
def affiliate_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_affiliate),
):
    affiliate_id = current_user.id

    # All links for this affiliate
    links = (
        db.query(AffiliateLink)
        .filter(AffiliateLink.affiliate_id == affiliate_id)
        .all()
    )

    total_links = len(links)

    total_clicks = (
        db.query(ReferralClick)
        .join(AffiliateLink)
        .filter(AffiliateLink.affiliate_id == affiliate_id)
        .count()
    )

    total_sales = (
        db.query(Order)
        .filter(
            Order.affiliate_id == affiliate_id,
            Order.payment_status == "paid"
        )
        .count()
    )

    total_earnings = (
        db.query(func.sum(Order.commission_amount))
        .filter(
            Order.affiliate_id == affiliate_id,
            Order.payment_status == "paid"
        )
        .scalar() or 0.0
    )

    # Per-product breakdown
    product_stats = []
    for link in links:
        clicks = db.query(ReferralClick).filter(
            ReferralClick.affiliate_link_id == link.id
        ).count()

        sales = db.query(Order).filter(
            Order.affiliate_id == affiliate_id,
            Order.product_id == link.product_id,
            Order.payment_status == "paid"
        ).count()

        earnings = db.query(func.sum(Order.commission_amount)).filter(
            Order.affiliate_id == affiliate_id,
            Order.product_id == link.product_id,
            Order.payment_status == "paid"
        ).scalar() or 0.0

        product = db.query(Product).filter(Product.id == link.product_id).first()

        product_stats.append({
            "product_id": link.product_id,
            "title": product.title if product else "Unknown",
            "image_base64": product.image_base64 if product else None,
            "price": product.price if product else 0,
            "commission_percent": product.commission_percent if product else 0,
            "ref_code": link.ref_code,
            "referral_link": f"http://localhost:3000/?ref={link.ref_code}",
            "clicks": clicks,
            "sales": sales,
            "earnings": round(earnings, 2),
        })

    return {
        "summary": {
            "total_links": total_links,
            "total_clicks": total_clicks,
            "total_sales": total_sales,
            "total_earnings": round(float(total_earnings), 2),
        },
        "products": product_stats,
    }


@redirect_router.get("/r/{ref_code}")
def referral_redirect(ref_code: str, request: Request, db: Session = Depends(get_db)):
    link = db.query(AffiliateLink).filter_by(ref_code=ref_code).first()
    if not link:
        raise HTTPException(404, "Invalid referral link")

    click = ReferralClick(
        affiliate_link_id=link.id,
        ip_address=request.client.host
    )
    db.add(click)
    db.commit()

    response = RedirectResponse(
        url=f"http://localhost:3000/products/{link.product_id}?ref={ref_code}"
    )
    response.set_cookie(key="ref_code", value=ref_code, max_age=60 * 60 * 24)
    return response