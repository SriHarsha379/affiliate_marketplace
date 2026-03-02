from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.modules.wallet.models import Wallet, WalletTransaction, WithdrawalRequest
from app.modules.wallet.schemas import WalletResponse, TransactionResponse, WithdrawRequest, WithdrawalResponse
from app.modules.wallet.services import get_or_create_wallet, MIN_WITHDRAWAL
from app.modules.auth.dependencies import get_affiliate, get_admin
from app.modules.users.models import User

router = APIRouter(prefix="/affiliate/wallet", tags=["Wallet"])


@router.get("/", response_model=WalletResponse)
def get_wallet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_affiliate),
):
    return get_or_create_wallet(current_user.id, db)


@router.get("/transactions", response_model=List[TransactionResponse])
def get_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_affiliate),
):
    wallet = get_or_create_wallet(current_user.id, db)
    return (
        db.query(WalletTransaction)
        .filter(WalletTransaction.wallet_id == wallet.id)
        .order_by(WalletTransaction.created_at.desc())
        .all()
    )


@router.post("/withdraw", response_model=WithdrawalResponse)
def request_withdrawal(
    payload: WithdrawRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_affiliate),
):
    if not payload.upi_id and not payload.bank_account:
        raise HTTPException(400, "Provide either UPI ID or bank account")

    wallet = get_or_create_wallet(current_user.id, db)

    if wallet.balance < MIN_WITHDRAWAL:
        raise HTTPException(400, f"Minimum withdrawal is ₹{MIN_WITHDRAWAL}. Your balance: ₹{wallet.balance}")

    if payload.amount > wallet.balance:
        raise HTTPException(400, "Insufficient balance")

    if payload.amount < MIN_WITHDRAWAL:
        raise HTTPException(400, f"Minimum withdrawal amount is ₹{MIN_WITHDRAWAL}")

    wallet.balance -= payload.amount
    wallet.total_withdrawn += payload.amount

    wr = WithdrawalRequest(
        affiliate_id=current_user.id,
        wallet_id=wallet.id,
        amount=payload.amount,
        upi_id=payload.upi_id,
        bank_account=payload.bank_account,
        status="pending",
    )
    db.add(wr)

    txn = WalletTransaction(
        wallet_id=wallet.id,
        amount=-payload.amount,
        type="withdrawal",
        status="pending",
        description=f"Withdrawal to {payload.upi_id or payload.bank_account}",
    )
    db.add(txn)
    db.commit()
    db.refresh(wr)
    return wr


@router.get("/withdrawals", response_model=List[WithdrawalResponse])
def get_withdrawal_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_affiliate),
):
    return (
        db.query(WithdrawalRequest)
        .filter(WithdrawalRequest.affiliate_id == current_user.id)
        .order_by(WithdrawalRequest.requested_at.desc())
        .all()
    )


# ── Admin routes ──────────────────────────────────────────

admin_router = APIRouter(prefix="/admin/withdrawals", tags=["Admin Wallet"])


@admin_router.get("/", response_model=List[WithdrawalResponse])
def list_withdrawal_requests(
    status: str = "pending",
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin),
):
    return (
        db.query(WithdrawalRequest)
        .filter(WithdrawalRequest.status == status)
        .order_by(WithdrawalRequest.requested_at.desc())
        .all()
    )


@admin_router.post("/{request_id}/approve")
def approve_withdrawal(
    request_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin),
):
    wr = db.query(WithdrawalRequest).filter(WithdrawalRequest.id == request_id).first()
    if not wr:
        raise HTTPException(404, "Request not found")
    if wr.status != "pending":
        raise HTTPException(400, "Already resolved")

    wr.status = "approved"
    wr.resolved_at = datetime.utcnow()

    txn = (
        db.query(WalletTransaction)
        .filter(
            WalletTransaction.wallet_id == wr.wallet_id,
            WalletTransaction.type == "withdrawal",
            WalletTransaction.status == "pending",
        )
        .order_by(WalletTransaction.created_at.desc())
        .first()
    )
    if txn:
        txn.status = "completed"

    db.commit()
    return {"message": "Withdrawal approved"}


@admin_router.post("/{request_id}/reject")
def reject_withdrawal(
    request_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin),
):
    wr = db.query(WithdrawalRequest).filter(WithdrawalRequest.id == request_id).first()
    if not wr:
        raise HTTPException(404, "Request not found")
    if wr.status != "pending":
        raise HTTPException(400, "Already resolved")

    wr.status = "rejected"
    wr.admin_note = payload.get("note", "")
    wr.resolved_at = datetime.utcnow()

    wallet = db.query(Wallet).filter(Wallet.id == wr.wallet_id).first()
    wallet.balance += wr.amount
    wallet.total_withdrawn -= wr.amount

    txn = WalletTransaction(
        wallet_id=wr.wallet_id,
        amount=wr.amount,
        type="refund",
        status="completed",
        description=f"Withdrawal rejected: {wr.admin_note}",
    )
    db.add(txn)
    db.commit()
    return {"message": "Withdrawal rejected, balance refunded"}