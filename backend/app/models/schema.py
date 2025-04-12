from pydantic import BaseModel
from typing import List

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
