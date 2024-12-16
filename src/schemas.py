from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime, timezone


def time_now(): 
    return datetime.now(timezone.utc)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    password_hash: str = Field()
    created_at: datetime = Field(default_factory=time_now)

    # Relationships
    friendships: List["Friendship"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"foreign_keys": "[Friendship.user_id]"}
    )
    friends: List["Friendship"] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[Friendship.friend_id]"}
    )
    nudges_sent: List["Nudge"] = Relationship(
        back_populates="sender",
        sa_relationship_kwargs={"foreign_keys": "[Nudge.sender_id]"}
    )
    nudges_received: List["Nudge"] = Relationship(
        back_populates="recipient",
        sa_relationship_kwargs={"foreign_keys": "[Nudge.recipient_id]"}
    )


class Friendship(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    friend_id: int = Field(foreign_key="user.id")
    status: str = Field(default="pending")  
    created_at: datetime = Field(default_factory=time_now)

    # Relationships
    user: User = Relationship(
        back_populates="friendships",
        sa_relationship_kwargs={"foreign_keys": "[Friendship.user_id]"}
    )
    friend: User = Relationship(
        back_populates="friends",
        sa_relationship_kwargs={"foreign_keys": "[Friendship.friend_id]"}
    )


class Nudge(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sender_id: int = Field(foreign_key="user.id")
    recipient_id: int = Field(foreign_key="user.id")
    type: str = Field(default="thinking_of_you")  
    message: Optional[str] = Field(default=None)  
    created_at: datetime = Field(default_factory=time_now)

    # Relationships
    sender: User = Relationship(
        back_populates="nudges_sent",
        sa_relationship_kwargs={"foreign_keys": "[Nudge.sender_id]"}
    )
    recipient: User = Relationship(
        back_populates="nudges_received",
        sa_relationship_kwargs={"foreign_keys": "[Nudge.recipient_id]"}
    )
