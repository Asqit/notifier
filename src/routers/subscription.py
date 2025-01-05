from fastapi import APIRouter, status, HTTPException
from fastapi.concurrency import run_in_threadpool
from webpush import WebPush, WebPushSubscription
import requests
import os

from src.utils.env import get_var


private_key_path: str = os.getcwd() + "/private_key.pem"
public_key_path: str = os.getcwd() + "/public_key.pem"
admin_email: str = get_var("WP_SUBSCRIBER")


router = APIRouter(prefix="/subscription", tags=["subscription"])
webpush = WebPush(
    public_key=public_key_path,
    private_key=private_key_path,
    subscriber=admin_email,
)


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


@router.post("/subscribe")
async def subscribe_user(subscription: WebPushSubscription):
    message = webpush.get(message="Hello, world", subscription=subscription)

    def send_push_notification():
        response = requests.post(
            url=str(subscription.endpoint),
            data=message.encrypted,
            headers=message.headers,  # type: ignore
        )
        response.raise_for_status()
        return response

    await run_in_threadpool(send_push_notification)

    return {"status": "ok"}
