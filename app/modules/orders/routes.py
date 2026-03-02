from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.modules.payments.phonepe import initiate_payment, verify_payment
from app.database import get_db
from app.modules.orders.models import Order
from app.modules.products.models import Product
from app.modules.affiliates.models import AffiliateLink
from app.modules.wallet.services import credit_commission

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post("/create")
def create_order(
    product_id: int,
    ref_code: Optional[str] = None,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product or product.status != "approved":
        raise HTTPException(status_code=400, detail="Invalid product")

    affiliate_id = None
    if ref_code:
        link = db.query(AffiliateLink).filter(AffiliateLink.ref_code == ref_code).first()
        if link:
            affiliate_id = link.affiliate_id

    order = Order(
        product_id=product_id,
        affiliate_id=affiliate_id,
        amount_paid=product.price,
        payment_status="pending"
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "order_id": order.id,
        "amount": order.amount_paid,
        "message": "Order created"
    }


@router.post("/{order_id}/success")
def mark_payment_success(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.payment_status = "paid"
    product = db.query(Product).filter(Product.id == order.product_id).first()

    # ── AUTO-CREDIT COMMISSION ──────────────────────────
    if order.affiliate_id:
        commission_amount = round((product.commission_percent / 100) * order.amount_paid, 2)
        credit_commission(
            affiliate_id=order.affiliate_id,
            order_id=order.id,
            amount=commission_amount,
            description=f"Commission for sale of '{product.title}' (₹{order.amount_paid})",
            db=db,
        )
    # ────────────────────────────────────────────────────

    db.commit()
    return {
        "message": "Payment successful",
        "access_url": product.product_access_url
    }

@router.post("/{order_id}/initiate-payment")
def initiate_order_payment(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    if order.payment_status == "paid":
        raise HTTPException(400, "Already paid")

    product = db.query(Product).filter(Product.id == order.product_id).first()

    redirect_url = f"http://localhost:3000/payment/verify?order_id={order_id}"

    result = initiate_payment(
        order_id=order_id,
        amount=order.amount_paid,
        redirect_url=redirect_url,
    )

    # Save merchant_order_id for verification later
    order.merchant_order_id = result["merchant_order_id"]
    db.commit()

    return {"payment_url": result["payment_url"]}


@router.post("/{order_id}/verify-payment")
def verify_order_payment(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    if order.payment_status == "paid":
        # Already handled
        product = db.query(Product).filter(Product.id == order.product_id).first()
        return {"status": "paid", "access_url": product.product_access_url}

    paid = verify_payment(order.merchant_order_id)
    if not paid:
        raise HTTPException(402, "Payment not completed")

    # Mark paid and credit commission
    order.payment_status = "paid"
    product = db.query(Product).filter(Product.id == order.product_id).first()

    if order.affiliate_id:
        from app.modules.wallet.services import credit_commission
        commission_amount = round((product.commission_percent / 100) * order.amount_paid, 2)
        credit_commission(
            affiliate_id=order.affiliate_id,
            order_id=order.id,
            amount=commission_amount,
            description=f"Commission for sale of '{product.title}'",
            db=db,
        )

    db.commit()
    return {"status": "paid", "access_url": product.product_access_url}