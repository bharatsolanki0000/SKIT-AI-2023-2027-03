import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file if available
load_dotenv()

class Settings:
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "")
    FIREBASE_CLIENT_EMAIL: str = os.getenv("FIREBASE_CLIENT_EMAIL", "")
    FIREBASE_PRIVATE_KEY_RAW: str = os.getenv("FIREBASE_PRIVATE_KEY", "")
    FIREBASE_WEB_API_KEY: str = os.getenv("FIREBASE_WEB_API_KEY", "")
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "")

    # Clean up formatted newlines in private key
    @property
    def FIREBASE_PRIVATE_KEY(self) -> str:
        if not self.FIREBASE_PRIVATE_KEY_RAW:
            return ""
        return self.FIREBASE_PRIVATE_KEY_RAW.replace("\\n", "\n")

    @property
    def CORS_ORIGINS(self) -> List[str]:
        raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173")
        return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()
