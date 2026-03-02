import uuid
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# CLIENT_ID = os.getenv("PHONEPE_CLIENT_ID")
# CLIENT_SECRET = os.getenv("PHONEPE_CLIENT_SECRET")
# CLIENT_VERSION = int(os.getenv("PHONEPE_CLIENT_VERSION", "1"))
# MERCHANT_ID = os.getenv("PHONEPE_MERCHANT_ID")
#
# AUTH_URL = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
# PAY_URL  = "https://api.phonepe.com/apis/pg/checkout/v2/pay"
# STATUS_URL = "https://api.phonepe.com/apis/pg/checkout/v2/order/{merchantOrderId}/status"


def get_access_token():
    res = requests.post(
        AUTH_URL,
        data={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "client_version": str(CLIENT_VERSION),  # 👈 MUST be string
            "grant_type": "client_credentials",
        },
        headers={
            "Content-Type": "application/x-www-form-urlencoded"
        }
    )

    print("Auth:", res.status_code, res.text)
    res.raise_for_status()
    return res.json()["access_token"]


def initiate_payment(order_id: int, amount: float, redirect_url: str):
    token = get_access_token()

    merchant_order_id = f"ORD{order_id}{uuid.uuid4().hex[:6].upper()}"

    payload = {
        "merchantOrderId": merchant_order_id,
        "amount": int(amount * 100),
        "expireAfter": 1200,
        "paymentFlow": {
            "type": "PG_CHECKOUT",
            "message": "Complete your purchase",
            "merchantUrls": {
                "redirectUrl": redirect_url,
            }
        }
    }

    headers = {
        "Authorization": f"O-Bearer {token}",
        "Content-Type": "application/json",
    }

    res = requests.post(PAY_URL, json=payload, headers=headers)
    print("Pay response:", res.status_code, res.text)

    res.raise_for_status()
    data = res.json()

    return {
        "merchant_order_id": merchant_order_id,
        "payment_url": data["redirectUrl"],
    }


def verify_payment(merchant_order_id: str):
    token = get_access_token()
    url = f"https://api.phonepe.com/apis/pg/checkout/v2/order/{merchant_order_id}/status"
    headers = {
        "Authorization": f"O-Bearer {token}",
        "Content-Type": "application/json",
    }
    res = requests.get(url, headers=headers)
    print("Verify response:", res.status_code, res.text)  # debug
    res.raise_for_status()
    data = res.json()
    return data.get("state") == "COMPLETED"