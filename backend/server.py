import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Annotated, Any, List

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
ADMIN_USERNAME = os.environ["ADMIN_USERNAME"]
ADMIN_PASSWORD_HASH = os.environ["ADMIN_PASSWORD_HASH"]

ALGORITHM = "HS256"
TOKEN_HOURS = 12

logger = logging.getLogger("pescematto")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
settings_col = db["restaurant_settings"]


@asynccontextmanager
async def lifespan(_app: FastAPI):
    try:
        await client.admin.command("ping")
        logger.info("Mongo connected: %s", DB_NAME)
    except Exception as e:  # noqa: BLE001
        logger.error("Mongo ping failed: %s", e)
    yield
    client.close()


app = FastAPI(title="Il Pescematto API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "PUT", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

api = APIRouter(prefix="/api")
bearer = HTTPBearer(auto_error=True)


# ---------- Models ----------
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class PhoneBody(BaseModel):
    phone: str = Field(min_length=3, max_length=40)


class MenuBody(BaseModel):
    menu: List[dict[str, Any]]


class PhoneResponse(BaseModel):
    phone: str | None = None


class MenuResponse(BaseModel):
    menu: List[dict[str, Any]] | None = None


# ---------- Auth helpers ----------
def _unauthorized() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenziali non valide o scadute",
        headers={"WWW-Authenticate": "Bearer"},
    )


def make_token(username: str) -> tuple[str, int]:
    now = datetime.now(timezone.utc)
    exp_seconds = TOKEN_HOURS * 3600
    payload = {
        "sub": username,
        "iat": now,
        "exp": now + timedelta(seconds=exp_seconds),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)
    return token, exp_seconds


async def require_admin(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer)],
) -> str:
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[ALGORITHM])
    except InvalidTokenError:
        raise _unauthorized()
    username = payload.get("sub")
    if username != ADMIN_USERNAME:
        raise _unauthorized()
    return username


# ---------- Public routes ----------
@api.get("/")
async def root():
    return {"message": "Il Pescematto API"}


@api.get("/settings/phone", response_model=PhoneResponse)
async def get_phone():
    doc = await settings_col.find_one({"_id": "phone"}, {"_id": 0, "value": 1})
    return PhoneResponse(phone=(doc or {}).get("value"))


@api.get("/settings/menu", response_model=MenuResponse)
async def get_menu():
    doc = await settings_col.find_one({"_id": "menu"}, {"_id": 0, "value": 1})
    return MenuResponse(menu=(doc or {}).get("value"))


# ---------- Auth route ----------
@api.post("/auth/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    if body.username != ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Credenziali non valide")
    try:
        password_ok = bcrypt.checkpw(body.password.encode(), ADMIN_PASSWORD_HASH.encode())
    except ValueError:
        password_ok = False
    if not password_ok:
        raise HTTPException(status_code=401, detail="Credenziali non valide")
    token, expires_in = make_token(ADMIN_USERNAME)
    return TokenResponse(access_token=token, expires_in=expires_in)


# ---------- Protected admin routes ----------
@api.put("/settings/phone", response_model=PhoneResponse)
async def put_phone(body: PhoneBody, _: Annotated[str, Depends(require_admin)]):
    cleaned = body.phone.strip()
    if not cleaned:
        raise HTTPException(status_code=400, detail="Numero non valido")
    await settings_col.update_one(
        {"_id": "phone"},
        {"$set": {"value": cleaned, "updated_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    return PhoneResponse(phone=cleaned)


@api.delete("/settings/phone", response_model=PhoneResponse)
async def delete_phone(_: Annotated[str, Depends(require_admin)]):
    await settings_col.delete_one({"_id": "phone"})
    return PhoneResponse(phone=None)


@api.put("/settings/menu", response_model=MenuResponse)
async def put_menu(body: MenuBody, _: Annotated[str, Depends(require_admin)]):
    await settings_col.update_one(
        {"_id": "menu"},
        {"$set": {"value": body.menu, "updated_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    return MenuResponse(menu=body.menu)


@api.delete("/settings/menu", response_model=MenuResponse)
async def delete_menu(_: Annotated[str, Depends(require_admin)]):
    await settings_col.delete_one({"_id": "menu"})
    return MenuResponse(menu=None)


app.include_router(api)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
