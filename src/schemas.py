# ------------------------ RUNTIME_SCHEMAS --------------------------- #
from sqlmodel import SQLModel
from datetime import datetime
from typing import List, Optional


class FriendshipResponse(SQLModel, table=False):
    id: int
    follower_id: int
    following_id: int


class UserResponse(SQLModel, table=False):
    id: int
    username: str
    email: str
    created_at: datetime
    bio: str
    web: str
    location: str
    color: str

    followers: Optional[List[FriendshipResponse]] = []
    following: Optional[List[FriendshipResponse]] = []
    nudges_send: Optional[List["NudgeResponse"]] = []
    nudges_received: Optional[List["NudgeResponse"]] = []


class NudgeResponse(SQLModel, table=False):
    id: int
    type: str
    message: Optional[str]
    created_at: datetime
    sender_id: int
    recipient_id: int


FriendshipResponse.model_rebuild()
NudgeResponse.model_rebuild()
UserResponse.model_rebuild()
