from fastapi import APIRouter, status
from sqlmodel import SQLModel, select
from webpush import WebPushSubscription
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

from src.models import DbNudge, DbUser, DbNotification
from src.schemas import NudgeResponse
from src.utils.db import DbSession
from .subscription import post_notification
from .auth import LoggedUser
from fastapi import HTTPException

router = APIRouter(prefix="/nudges", tags=["nudges"])


class NudgeCreate(SQLModel):
    type: str
    message: str
    recipient_id: int


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=NudgeResponse)
async def create_nudge(data: NudgeCreate, user: LoggedUser, db: DbSession):
    recipient = db.exec(select(DbUser).where(DbUser.id == data.recipient_id)).first()
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found",
        )

    for device in recipient.devices:
        device = WebPushSubscription(
            endpoint=device.endpoint,  # type: ignore
            keys={"p256dh": device.p256dh, "auth": device.auth},  # type: ignore
        )
        print(post_notification(device, data.message))

    nudge = DbNudge(**data.model_dump(), sender_id=user.id)  # type: ignore
    notification = DbNotification(
        content=data.message,
        user_id=recipient.id,  # type: ignore
    )
    db.add(notification)
    db.add(nudge)
    db.commit()
    db.refresh(nudge)

    return nudge


@router.get("/last-received", response_model=list[NudgeResponse])
async def get_last_received_nudges(user: LoggedUser, db: DbSession):
    nudges = db.exec(select(DbNudge).where(DbNudge.recipient_id == user.id)).fetchmany(
        5
    )
    return nudges


@router.get("/last-sent", response_model=list[NudgeResponse])
async def get_last_sent_nudges(user: LoggedUser, db: DbSession):
    nudges = db.exec(select(DbNudge).where(DbNudge.sender_id == user.id)).fetchmany(5)
    return nudges


@router.get("/received", response_model=Page[NudgeResponse])
async def get_received_nudges(user: LoggedUser, db: DbSession):
    return paginate(
        db,
        select(DbNudge)
        .where(DbNudge.recipient_id == user.id)
        .order_by(DbNudge.created_at),
    )


@router.get("/sent", response_model=Page[NudgeResponse])
async def get_sent_nudges(user: LoggedUser, db: DbSession):
    return paginate(
        db,
        select(DbNudge)
        .where(DbNudge.sender_id == user.id)
        .order_by(DbNudge.created_at),
    )
