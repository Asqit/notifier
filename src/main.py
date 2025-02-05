from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from src.routers import auth, users, nudge, subscription, notification
from src.utils.db import create_all
from fastapi_pagination import add_pagination

app = FastAPI()

create_all()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

add_pagination(app)


@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {"status": "ok"}


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(nudge.router)
app.include_router(subscription.router)
app.include_router(notification.router)
