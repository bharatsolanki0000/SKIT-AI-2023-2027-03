import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import auth, health
from app.database import (
    is_mongodb_configured,
    ping_database,
    init_indexes,
    close_mongo_client
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("camber.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup lifecycle
    logger.info("Initializing CAMBER backend services...")
    if is_mongodb_configured():
        logger.info("MongoDB URI configured. Verifying connectivity...")
        try:
            if ping_database():
                logger.info("MongoDB connection verified successfully. Initializing indexes...")
                init_indexes()
            else:
                logger.warning("MongoDB is configured but unreachable. Starting in development mode.")
        except Exception:
            logger.warning("Error during MongoDB startup verification. Application continuing in development mode.")
    else:
        logger.info("MongoDB is not configured or placeholder detected. Application starting in development mode.")

    yield

    # Shutdown lifecycle
    logger.info("Shutting down CAMBER backend services...")
    close_mongo_client()


# Initialize FastAPI application
app = FastAPI(
    title="CAMBER Backend API",
    description="Cognitive Assistance and Mood-Based Educational Responder - Authentication & Core Backend Services",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS
origins = settings.CORS_ORIGINS
logger.info(f"Configuring CORS origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router)
app.include_router(health.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "system": "CAMBER API",
        "version": "1.0.0",
        "status": "online",
        "documentation": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
