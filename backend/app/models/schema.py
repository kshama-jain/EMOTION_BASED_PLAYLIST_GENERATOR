from pydantic import BaseModel
from typing import List
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.config import Base
from datetime import datetime
from sqlalchemy import DateTime

class DiaryInput(BaseModel):
    entry: str
    languages: List[str]
    time_of_day: str
    weather: str

class Song(BaseModel):
    song_title: str
    artist: str
    emotion: str
    track_id: str
    language: str
    weather: str
    time_of_day: str

class PlaylistResponse(BaseModel):
    emotion: str
    journey: List[str]
    response: str
    songs: List[Song]

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    playlists = relationship("Playlist", back_populates="user", cascade="all, delete-orphan")

class Playlist(Base):
    __tablename__ = "playlists"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(100), nullable=False)
    description = Column(Text)
    songs = Column(Text)  # Store as JSON string
    emotion = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)  # Store as string for simplicity
    user = relationship("User", back_populates="playlists")

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(100), nullable=False)
    date = Column(String(20), nullable=False)
    type = Column(String(50), nullable=False, default="create-playlist")
    description = Column(Text)
    color = Column(String(20), default="green")
