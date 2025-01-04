from fastapi import APIRouter, status
from sqlmodel import SQLModel, select

from src.models import DbNudge
from src.schemas import NudgeResponse
from src.utils.db import DbSession
from .auth import LoggedUser

router = APIRouter(prefix="/nudges", tags=["nudges"])


class NudgeCreate(SQLModel):
    type: str
    message: str
    recipient_id: int


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=NudgeResponse)
async def create_nudge(data: NudgeCreate, user: LoggedUser, db: DbSession):
    nudge = DbNudge(**data.model_dump(), sender_id=user.id)  # type: ignore
    db.add(nudge)
    db.commit()
    return nudge


@router.get("/received", response_model=list[NudgeResponse])
async def get_received_nudges(user: LoggedUser, db: DbSession):
    nudges = db.exec(select(DbNudge).where(DbNudge.recipient_id == user.id)).all()
    return nudges


@router.get("/sent", response_model=list[NudgeResponse])
async def get_sent_nudges(user: LoggedUser, db: DbSession):
    nudges = db.exec(select(DbNudge).where(DbNudge.sender_id == user.id)).all()
    return nudges
