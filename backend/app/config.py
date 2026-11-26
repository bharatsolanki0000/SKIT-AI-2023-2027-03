import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file if available
load_dotenv()


class Settings:
    # MongoDB Atlas Database Settings
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", os.getenv("MONGODB_DATABASE", "camber"))

    @property
    def MONGODB_DATABASE(self) -> str:
        """Backward-compatibility alias for Sprint 1."""
        return self.DATABASE_NAME

    # JWT Authentication Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )

    @property
    def CORS_ORIGINS(self) -> List[str]:
        raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173")
        return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))


settings = Settings()
