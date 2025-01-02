from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from .auth import LoggedUser
from src.utils.db import DbSession
from src.schemas import UserResponse
from src.models import DbUser, DbFriendship

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_me(user: LoggedUser):
    return user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: DbSession):
    user: DbUser | None = db.exec(select(DbUser).where(DbUser.id == user_id)).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

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

    if target_user in user.following:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Already following"
        )

    new_relation: DbFriendship = DbFriendship(
        follower_id=user.id, following_id=target_user.id  # type: ignore
    )

    user.following.append(new_relation)
    target_user.followers.append(new_relation)
    db.add(user)
    db.commit()

    return {"status": "created"}
