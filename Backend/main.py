from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from Routers import auth, user


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# API version prefix
app.include_router(auth.router, prefix="/api/v1")
app.include_router(user.router, prefix="/api/v1")
# app.include_router(participant.router)


models.base.metadata.create_all(bind = engine)