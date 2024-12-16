from fastapi import APIRouter
from sqlmodel import SQLModel

from .auth import LoggedUser
from src.schemas import Nudge
from src.utils.db import DbSession

class CreateNudge(SQLModel):
    message: str
    type: str
    senderId: int
    recipientId: int


router = APIRouter(prefix="/nudge", tags=["Nudge"])

@router.post("/", status_code=201)
async def create_nudge(data: CreateNudge, db: DbSession) -> Nudge:
    nudge = Nudge(**dict(data))
    db.commit()

    return nudge


@router.get("/history", response_model=list[Nudge])
async def get_nudge_history(user: LoggedUser):
    return user.nudges_received


# TODO: Perhaps real-time nudging 