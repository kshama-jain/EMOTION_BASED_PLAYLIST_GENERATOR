from fastapi import APIRouter
from app.services.emotion_detection import predict_emotion
from app.services.journey_generator import generate_emotion_path_with_ollama
from app.services.recommendation import get_recommendations
from app.services.empathetic_response import generate_empathic_response
from app.models.schema import DiaryInput, PlaylistResponse

router = APIRouter()

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
