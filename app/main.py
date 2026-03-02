from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

# Models
from app.modules.users.models import User
from app.modules.products.models import Product
from app.modules.affiliates.models import AffiliateLink, ReferralClick
from app.modules.wallet.models import Wallet, WalletTransaction, WithdrawalRequest  # ← add this

# Routers
from app.modules.products.routes import router as seller_product_router
from app.modules.products.routes import public_router
from app.modules.admin.routes import router as admin_router
from app.modules.affiliates.routes import router as affiliate_router
from app.modules.affiliates.routes import redirect_router
from app.modules.orders.routes import router as order_router
from app.modules.wallet.routes import router as wallet_router, admin_router as wallet_admin_router
from app.modules.auth.routes import router as auth_router   # ← add this
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="Affiliate Marketplace")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Routers
app.include_router(auth_router)              # ← add this — /auth/signup, /auth/login, /auth/me
app.include_router(seller_product_router)
app.include_router(public_router)
app.include_router(admin_router)
app.include_router(affiliate_router)
app.include_router(redirect_router)
app.include_router(order_router)
app.include_router(wallet_router)
app.include_router(wallet_admin_router)

@app.get("/")
def root():
    return {"message": "Affiliate Marketplace API running"}