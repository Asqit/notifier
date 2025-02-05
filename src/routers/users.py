from fastapi import APIRouter, HTTPException, status
from sqlmodel import select, SQLModel
from typing import Optional
from webpush import WebPushSubscription


from .subscription import post_notification
from .auth import LoggedUser
from src.utils.db import DbSession
from src.schemas import UserResponse
from src.models import DbUser, DbFriendship, DbNotification

router = APIRouter(prefix="/users", tags=["users"])


class UpdateUserRequest(SQLModel):
    username: Optional[str] = None
    bio: Optional[str] = None
    web: Optional[str] = None
    color: Optional[str] = None
    location: Optional[str] = None


@router.get("/me", response_model=UserResponse)
async def get_me(user: LoggedUser):
    return user


@router.post("/follow/{user_id}", status_code=status.HTTP_201_CREATED)
async def follow_user(user_id: int, user: LoggedUser, db: DbSession):
    target_user: DbUser | None = db.exec(
        select(DbUser).where(DbUser.id == user_id)
    ).first()

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    existing_relation: DbFriendship | None = db.exec(
        select(DbFriendship)
        .where(DbFriendship.follower_id == user.id)
        .where(DbFriendship.following_id == target_user.id)
    ).first()

    if existing_relation:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Already following"
        )

    new_relation: DbFriendship = DbFriendship(follower_id=user.id, following_id=target_user.id)  # type: ignore

    notification_message: str = f"{user.username} has started following you."
    user_notification: DbNotification = DbNotification(
        content=notification_message,
        user_id=target_user.id,  # type: ignore
    )

    for device in target_user.devices:
        device = WebPushSubscription(
            endpoint=device.endpoint,  # type: ignore
            keys={"p256dh": device.p256dh, "auth": device.auth},  # type: ignore
        )

        post_notification(device, notification_message)

    db.add(user_notification)
    db.add(new_relation)
    db.commit()
    db.refresh(new_relation)

    return {"status": "created"}


@router.post("/unfollow/{user_id}", status_code=status.HTTP_200_OK)
async def unfollow_user(user_id: int, user: LoggedUser, db: DbSession):
    target_user: DbUser | None = db.exec(
        select(DbUser).where(DbUser.id == user_id)
    ).first()

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    existing_relation: DbFriendship | None = db.exec(
        select(DbFriendship)
        .where(DbFriendship.follower_id == user.id)
        .where(DbFriendship.following_id == target_user.id)
    ).first()

    if not existing_relation:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Not following"
        )

    notification_message: str = f"{user.username} has stopped following you."
    user_notification: DbNotification = DbNotification(
        content=notification_message,
        user_id=target_user.id,  # type: ignore
    )

    for device in target_user.devices:
        device = WebPushSubscription(
            endpoint=device.endpoint,  # type: ignore
            keys={"p256dh": device.p256dh, "auth": device.auth},  # type: ignore
        )

        post_notification(device, notification_message)

    db.add(user_notification)
    db.delete(existing_relation)
    db.commit()

    return {"status": "deleted"}


@router.get("/search/{username}", response_model=list[UserResponse])
async def search_user(username: str, _: LoggedUser, db: DbSession):
    users = db.exec(select(DbUser).where(DbUser.username.ilike(f"%{username}%"))).all()  # type: ignore
    if not users:
        return []

    return users


@router.put("/update", response_model=UserResponse)
async def update_user(data: UpdateUserRequest, user: LoggedUser, db: DbSession):
    if data.username:
        conflicting_user: DbUser | None = db.exec(
            select(DbUser).where(DbUser.username == data.username)
        ).first()

        if conflicting_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Username already taken"
            )

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.get("/following", response_model=list[UserResponse])
async def get_following(db: DbSession, user: LoggedUser):
    following = db.exec(
        select(DbFriendship).where(DbFriendship.follower_id == user.id)
    ).all()
    response = [followed.following for followed in following]
    return response


@router.get("/followers", response_model=list[UserResponse])
async def get_followers(db: DbSession, user: LoggedUser):
    followers = db.exec(select(DbFriendship).where(DbFriendship.following_id == user.id)).all()  # type: ignore
    response = [follower.follower for follower in followers]
    return response


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: DbSession):
    user: DbUser | None = db.exec(select(DbUser).where(DbUser.id == user_id)).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return user
