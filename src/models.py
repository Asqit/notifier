# ------------------------ DATABASE_MODELS --------------------------- #
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, UTC
from typing import List


def time_now() -> datetime:
    return datetime.now(UTC)


class DbNotification(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    is_open: bool = Field(default=True)
    content: str = Field()
    created_at: datetime = Field(default_factory=time_now)
    user_id: int = Field(foreign_key="dbuser.id")
    user: "DbUser" = Relationship(
        back_populates="notifications",
    )


class DbFriendship(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    follower_id: int = Field(foreign_key="dbuser.id")
    following_id: int = Field(foreign_key="dbuser.id")

    follower: "DbUser" = Relationship(
        back_populates="following",
        sa_relationship_kwargs={"foreign_keys": "DbFriendship.follower_id"},
    )
    following: "DbUser" = Relationship(
        back_populates="followers",
        sa_relationship_kwargs={"foreign_keys": "DbFriendship.following_id"},
    )


class DbUser(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    password_hash: str = Field()
    created_at: datetime = Field(default_factory=time_now)
    bio: str = Field(default="", max_length=160)
    web: str = Field(default="")
    location: str = Field(default="")
    color: str = Field(default="#D6D6D6")

    notifications: List["DbNotification"] = Relationship(back_populates="user")

    devices: List["DbDevice"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"foreign_keys": "DbDevice.user_id"},
    )

    nudges_send: List["DbNudge"] = Relationship(
        back_populates="sender",
        sa_relationship_kwargs={"foreign_keys": "DbNudge.sender_id"},
    )
    nudges_received: List["DbNudge"] = Relationship(
        back_populates="recipient",
        sa_relationship_kwargs={"foreign_keys": "DbNudge.recipient_id"},
    )

    following: List["DbFriendship"] = Relationship(
        back_populates="follower",
        sa_relationship_kwargs={
            "primaryjoin": "DbUser.id == DbFriendship.follower_id",
            "foreign_keys": "DbFriendship.follower_id",
        },
    )
    followers: List["DbFriendship"] = Relationship(
        back_populates="following",
        sa_relationship_kwargs={
            "primaryjoin": "DbUser.id == DbFriendship.following_id",
            "foreign_keys": "DbFriendship.following_id",
        },
    )


class DbNudge(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    type: str = Field()
    message: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=time_now)

    sender_id: int = Field(foreign_key="dbuser.id")
    sender: DbUser = Relationship(
        back_populates="nudges_send",
        sa_relationship_kwargs={"foreign_keys": "DbNudge.sender_id"},
    )

    recipient_id: int = Field(foreign_key="dbuser.id")
    recipient: DbUser = Relationship(
        back_populates="nudges_received",
        sa_relationship_kwargs={"foreign_keys": "DbNudge.recipient_id"},
    )


class DbDevice(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    endpoint: str = Field(unique=True)
    p256dh: str = Field(unique=True)
    auth: str = Field(unique=True)
    user_id: int = Field(foreign_key="dbuser.id")
    user: DbUser = Relationship(
        back_populates="devices",
        sa_relationship_kwargs={"foreign_keys": "DbDevice.user_id"},
    )
