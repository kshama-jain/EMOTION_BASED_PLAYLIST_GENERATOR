from fastapi import APIRouter, Depends, HTTPException, Header, Path, status
from app.services.emotion_detection import predict_emotion
from app.services.journey_generator import generate_emotion_path_with_ollama
from app.services.recommendation import get_recommendations
from app.services.empathetic_response import generate_empathic_response
from app.models.schema import DiaryInput, PlaylistResponse, Playlist, User
from sqlalchemy.orm import Session
from app.config import SessionLocal
from jose import jwt 
import json
from sqlalchemy import func

router = APIRouter()

SECRET_KEY = "your_secret_key"  # Use the same key as in auth.py
ALGORITHM = "HS256"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Header(...), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid user")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/playlists")
def get_playlists(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    playlists = db.query(Playlist).filter(Playlist.user_id == user.id).all()
    for pl in playlists:
        try:
            pl.songs = json.loads(pl.songs)
        except Exception:
            pl.songs = []
    return playlists

@router.post("/playlists")
def create_playlist(data: dict, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    playlist = Playlist(
        user_id=user.id,
        title=data.get("title", "Untitled Playlist"),
        description=data.get("description", ""),
        songs=json.dumps(data.get("songs", [])),
        emotion=data.get("emotion", "")
    )
    db.add(playlist)
    db.commit()
    db.refresh(playlist)
    playlist.songs = json.loads(playlist.songs)
    return playlist

@router.post("/generate", response_model=PlaylistResponse)
def generate_playlist(data: DiaryInput):
    print("Received diary entry: ", data.entry)
    print("Received languages: ", data.languages)
    print("Received time of day: ", data.time_of_day)
    print("Received weather: ", data.weather)
    emotion = predict_emotion(data.entry)
    print("The emotion is = ", emotion)
    journey = generate_emotion_path_with_ollama(data.entry, emotion)
    
    if(journey[0]!=emotion):
        journey = [emotion] + journey[:]
    print("Generated journey: ", journey)
    songs = get_recommendations(data.entry, journey, data.languages, data.time_of_day, data.weather)
    print("Recommended songs: ", songs)
    response = generate_empathic_response(data.entry, emotion)
    print("Generated empathic response: ", response)
    return PlaylistResponse(emotion=emotion, journey=journey, response=response, songs=songs)

@router.get("/playlist-events")
def get_playlist_events(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """
    Returns a list of playlist creation events for the authenticated user.
    Each event contains: id, title, created_at (date), and type="create-playlist".
    """
    playlists = db.query(Playlist).filter(Playlist.user_id == user.id).all()
    events = [
        {
            "id": pl.id,
            "title": pl.title,
            "date": pl.created_at.strftime("%Y-%m-%d"),
            "type": "create-playlist",
            "description": pl.description,
            "color": "green"
        }
        for pl in playlists if hasattr(pl, 'created_at') and pl.created_at
    ]
    return events

@router.get("/playlist/{playlist_id}")
def get_playlist_by_id(playlist_id: int = Path(...), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id, Playlist.user_id == user.id).first()
    print("hellO!!!")
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    try:
        playlist.songs = json.loads(playlist.songs)

        print("Playlist fields:")
        for column in Playlist.__table__.columns:
            print(column.name)


    except Exception:
        playlist.songs = []
        print("WHOOPSSS")
    return {
        "id": playlist.id,
        "title": playlist.title,
        "description": playlist.description,
        "created_at": playlist.created_at.strftime("%Y-%m-%d"),
        "songs": playlist.songs
    }

@router.delete("/playlist/{playlist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_playlist(playlist_id: int = Path(...), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id, Playlist.user_id == user.id).first()
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    db.delete(playlist)
    db.commit()
    return
