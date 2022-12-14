import os
from dotenv import load_dotenv

from pathlib import Path
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)


class Settings:
    PROJECT_NAME: str = "OneGame"
    PROJECT_VERSION: str = "0.0.5"
    FRONTEND_ORIGIN: str = "http://localhost:3000"
    TOKEN_LEN: int = 256

    POSTGRES_USER: str = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", 5432)
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "tdd")
    DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"

    ADMIN_TOKEN: str = os.getenv("ADMIN_TOKEN")

    TWITCH_ID: str = os.getenv("TWITCH_ID")
    TWITCH_SECRET: str = os.getenv("TWITCH_SECRET")


settings = Settings()
