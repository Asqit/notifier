from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routers import nudge, friendship, auth
from src.utils.db import create_all

app = FastAPI()

create_all()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(nudge.router)
app.include_router(friendship.router)
app.include_router(auth.router)
