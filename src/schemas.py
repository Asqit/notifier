# ------------------------ RUNTIME_SCHEMAS --------------------------- #
from sqlmodel import SQLModel
from datetime import datetime
from typing import List, Optional


class FriendshipResponse(SQLModel, table=False):
    id: int
    follower_id: int
    following_id: int


class DeviceResponse(SQLModel, table=False):
    id: int
    endpoint: str
    p256dh: str
    auth: str
    user_id: int


class NudgeResponse(SQLModel, table=False):
    id: int
    type: str
    message: Optional[str]
    created_at: datetime
    sender_id: int
    recipient_id: int


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
    nudges_send: Optional[List[NudgeResponse]] = []
    nudges_received: Optional[List[NudgeResponse]] = []
    devices: Optional[List[DeviceResponse]] = []


# Ensure models are initialized properly
FriendshipResponse.model_rebuild()
DeviceResponse.model_rebuild()
NudgeResponse.model_rebuild()
UserResponse.model_rebuild()
