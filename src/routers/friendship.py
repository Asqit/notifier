from fastapi import APIRouter, status, HTTPException
from sqlmodel import select

from .auth import LoggedUser
from src.utils.db import DbSession
from src.schemas import Friendship, User


router = APIRouter(prefix="/friends", tags=["Friends"])


@router.post("/request", status_code=status.HTTP_201_CREATED)
async def request_friendship(user_id: int, user, db: DbSession) -> dict:
    friend = db.exec(select(User).where(User.id == user_id)).first()
    if not friend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    relation = db.exec(select(Friendship).where(Friendship.user_id == user_id).where(Friendship.friend_id == user.id)).first()
    if relation:
        if relation.status == "pending":
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="already pending")
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="already friends")
        
    relation = Friendship(
        user_id=user_id,
        friend_id=user.id,
        status="pending"
    )

    db.add(relation)
    db.commit()

    return {"status": "created"}


@router.post("/accept")
async def accept_friendship(friend_id: int, user: LoggedUser, db: DbSession) -> dict:
    relation = db.exec(select(Friendship).where(Friendship.user_id == user.id).where(Friendship.friend_id == friend_id)).first()
    if not relation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    relation.status = "accepted"
    db.commit()
    db.refresh(relation)

    return {"status": "ok"}


@router.delete("/request")
async def reject_request(friend_id: int, user: LoggedUser, db: DbSession) -> None:
    relation = db.exec(select(Friendship).where(Friendship.user_id == user.id).where(Friendship.friend_id == friend_id)).first()
    if not relation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    db.delete(relation)
    db.commit()


@router.get("/")
async def get_friends(user, db: DbSession) -> None:
    return user.friends