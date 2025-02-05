from fastapi import APIRouter, status, HTTPException
from webpush import WebPush, WebPushSubscription
from sqlmodel import SQLModel, select
import requests
import os

from src.models import DbUser, DbDevice
from src.utils.env import get_var
from src.utils.db import DbSession


private_key_path: str = os.getcwd() + "/private_key.pem"
public_key_path: str = os.getcwd() + "/public_key.pem"
admin_email: str = get_var("WP_SUBSCRIBER")


router = APIRouter(prefix="/subscription", tags=["subscription"])
webpush = WebPush(
    public_key=public_key_path,
    private_key=private_key_path,
    subscriber=admin_email,
)


class SaveSubscriptionRequest(SQLModel):
    subscription: WebPushSubscription
    userId: int


def post_notification(subscription: WebPushSubscription, payload: str):
    message = webpush.get(message=payload, subscription=subscription)
    response = requests.post(
        url=str(subscription.endpoint),
        data=message.encrypted,
        headers=message.headers,  # type: ignore
    )
    return response.status_code


@router.get("/key")
async def get_public_key():
    application_server_key: str
    key_path = os.path.join(os.getcwd(), "applicationServerKey")
    if not os.path.exists(key_path):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Public key file not found",
        )

    with open(key_path, "r") as file:
        application_server_key = file.readline().strip()

    return {"public_key": application_server_key}


@router.post("/subscribe", status_code=status.HTTP_201_CREATED)
async def subscribe_user(payload: SaveSubscriptionRequest, db: DbSession):
    user: DbUser | None = db.exec(
        select(DbUser).where(DbUser.id == payload.userId)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    subscription = payload.subscription
    existing_device = db.exec(
        select(DbDevice)
        .where(DbDevice.user_id == user.id)
        .where(DbDevice.endpoint == str(subscription.endpoint))
    ).first()

    if existing_device:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Device already subscribed",
        )

    device = DbDevice(
        user_id=user.id,  # type: ignore
        endpoint=str(subscription.endpoint),
        p256dh=subscription.keys.p256dh,
        auth=subscription.keys.auth,
    )
    db.add(device)
    db.commit()
    db.refresh(device)

    return {"status": "ok"}
