from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class WalletResponse(BaseModel):
    id: int
    affiliate_id: int
    balance: float
    total_earned: float
    total_withdrawn: float

    class Config:
        orm_mode = True


class TransactionResponse(BaseModel):
    id: int
    amount: float
    type: str
    status: str
    description: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True


class WithdrawRequest(BaseModel):
    amount: float
    upi_id: Optional[str] = None
    bank_account: Optional[str] = None


class WithdrawalResponse(BaseModel):
    id: int
    amount: float
    status: str
    upi_id: Optional[str]
    bank_account: Optional[str]
    requested_at: datetime
    admin_note: Optional[str]

    class Config:
        orm_mode = True