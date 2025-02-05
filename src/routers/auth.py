from datetime import datetime, timedelta, UTC
from typing import Annotated
from pydantic import BaseModel
from sqlmodel import Session, select
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
import jwt

from src.utils.env import get_var
from src.utils.db import DbSession
from src.models import DbUser
from src.schemas import UserResponse


TOKEN_SECRET: str = get_var("JWT_SECRET")
ALGORITHM: str = "HS256"
TOKEN_EXPIRY: int = 30


class AuthResponse(UserResponse):
    access_token: str
    token_type: str


class CreateUser(BaseModel):
    username: str
    password: str
    email: str


class TokenData(BaseModel):
    email: str | None = None


bcrypt = CryptContext(schemes=["bcrypt"], deprecated="auto")
jwt_schema = OAuth2PasswordBearer(tokenUrl="auth/login")
router = APIRouter(prefix="/auth", tags=["Auth"])


def verify_password(plain: str, hash: str) -> bool:
    return bcrypt.verify(plain, hash)


def hash_password(plain: str) -> str:
    return bcrypt.hash(plain)


def authenticate_user(username: str, password: str, db: Session) -> DbUser | bool:
    user: DbUser | None = db.exec(
        select(DbUser).where(DbUser.username == username)
    ).first()

    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return True

    return user


def create_access_token(username: str, expires_delta: timedelta) -> str:
    expires = datetime.now(UTC) + expires_delta

    encode = {"sub": username, "exp": expires}

    return jwt.encode(encode, TOKEN_SECRET, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str, Depends(jwt_schema)], db: DbSession):
    try:
        payload = jwt.decode(token, TOKEN_SECRET, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        user = db.exec(select(DbUser).where(DbUser.username == username)).first()
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        return user
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)


LoggedUser = Annotated[DbUser, Depends(get_current_user)]


@router.post("/register", response_model=AuthResponse)
async def register(data: CreateUser, db: DbSession):
    conflict: DbUser | None = db.exec(
        select(DbUser)
        .where(DbUser.email == data.email)
        .where(DbUser.username == data.username)
    ).first()
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="username of email is already taken!",
        )

    new_user = DbUser(**dict(data), password_hash=hash_password(data.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(new_user.username, timedelta(minutes=20))
    return {"access_token": token, "token_type": "bearer", **new_user.model_dump()}


@router.post("/login", response_model=AuthResponse)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: DbSession
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if type(user) == bool:
        print(user)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    token = create_access_token(user.username, timedelta(minutes=20))
    return {
        "access_token": token,
        "token_type": "bearer",
        "following": user.following,
        "followers": user.followers,
        "nudges_send": user.nudges_send,
        "nudges_received": user.nudges_received,
        **user.model_dump(),
    }


@router.get("/me", response_model=UserResponse)
async def get_user_details(me: LoggedUser):
    return me
