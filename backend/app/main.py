from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import playlist
from app.routes import auth

app = FastAPI()

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins instead of "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(playlist.router)
app.include_router(auth.router)
