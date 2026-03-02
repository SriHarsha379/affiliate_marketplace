from sqlalchemy.orm import Session
from app.modules.wallet.models import Wallet, WalletTransaction

MIN_WITHDRAWAL = 500.0


def get_or_create_wallet(affiliate_id: int, db: Session) -> Wallet:
    wallet = db.query(Wallet).filter(Wallet.affiliate_id == affiliate_id).first()
    if not wallet:
        wallet = Wallet(affiliate_id=affiliate_id, balance=0.0, total_earned=0.0, total_withdrawn=0.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    return wallet


def credit_commission(affiliate_id: int, order_id: int, amount: float, description: str, db: Session):
    wallet = get_or_create_wallet(affiliate_id, db)
    wallet.balance += amount
    wallet.total_earned += amount

    txn = WalletTransaction(
        wallet_id=wallet.id,
        amount=amount,
        type="commission",
        status="completed",
        description=description,
        order_id=order_id,
    )
    db.add(txn)
    db.commit()
    return wallet