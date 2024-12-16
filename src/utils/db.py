from sqlmodel import create_engine, Session, SQLModel
from fastapi import Depends
from typing import Annotated

from src.utils.env import get_var

username: str = get_var("DB_USER")
password: str = get_var("DB_PASSWORD")
port: int = int(get_var("DB_PORT"))
database: str = get_var("DB_DATABASE")

CONNECTION_STRING = f"postgresql://{username}:{password}@localhost:{port}/{database}"
engine = create_engine("sqlite:///database.db")


def create_all():   
    SQLModel.metadata.create_all(engine)


def get_session(): 
    with Session(engine) as session:
        yield session



DbSession = Annotated[Session, Depends(get_session)]