from fastapi import FastAPI
from src.routers import nudge, friendship, auth
from src.utils.db import create_all

app = FastAPI()

create_all()
app.include_router(nudge.router)
app.include_router(friendship.router)
app.include_router(auth.router)
