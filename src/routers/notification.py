from fastapi import APIRouter, HTTPException, status
from sqlmodel import select
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

from .auth import LoggedUser
from src.utils.db import DbSession
from src.models import DbNotification
from src.schemas import NotificationResponse


router = APIRouter(prefix="/notification", tags=["notifications"])


@router.get("/", response_model=Page[NotificationResponse])
async def get_notifications(user: LoggedUser, db: DbSession):
    return paginate(
        db,
        select(DbNotification)
        .where(DbNotification.user_id == user.id)
        .order_by(DbNotification.created_at),
    )


@router.put("/{notification_id}", response_model=NotificationResponse)
async def mark_as_read(user: LoggedUser, db: DbSession):
    notification = db.exec(
        select(DbNotification).where(DbNotification.user_id == user.id)
    ).first()

    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    notification.is_open = False
    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification
