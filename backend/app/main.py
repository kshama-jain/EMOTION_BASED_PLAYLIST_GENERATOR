from fastapi import FastAPI
from app.routes import playlist

app = FastAPI()
app.include_router(playlist.router)
