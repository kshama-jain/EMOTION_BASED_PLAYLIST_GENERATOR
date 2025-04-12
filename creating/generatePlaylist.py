import chromadb
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from sentence_transformers import SentenceTransformer


# Connect to ChromaDB
client = chromadb.PersistentClient(path="./song_db4")
collection = client.get_collection("songs")

# Example diary entry
diary_entry = """
Today I met my ex-fiance after 3 years. I honestly thought I was okay with us breaking up, but it seems I still haven't moved on. When I saw him on the altar with his new soon to be wife, I felt something in me break. It was probably my heart. I can't believe I'm still hung up over him, I hadn't even thought about him for so many years. 
Will I ever be able to love anyone else ever again ? Or will I always be hung up over him ? 
"""


embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def get_diary_embedding(diary_text):
    return embedding_model.encode(diary_text).tolist()


# Load emotion model
model = BertForSequenceClassification.from_pretrained("./bert-emotion-classifier")
tokenizer = BertTokenizer.from_pretrained("./bert-emotion-classifier")

# Define available languages
emotionsList = ["Very Sad", "Moderately Sad", "Little Sad", "Okayish", "Giddy", 
                "Pleasantly", "Party!!", "Yikes", "Angry", "Spooky"]
emotion_labels = {idx: emotion for idx, emotion in enumerate(emotionsList)}

def predict_emotion(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=128)
    outputs = model(**inputs)
    predicted_class = torch.argmax(outputs.logits).item()
    return emotion_labels.get(predicted_class, "Unknown")

# Convert diary entry into an embedding
diary_embedding = get_diary_embedding(diary_entry)

# Get current weather and time of day
current_time_of_day = "Evening"
current_weather = "Rainy"
languages = ['Bhojpuri', 'Assamese', 'English']

emotion = predict_emotion(diary_entry)
print("Emotion detected:", emotion)
print("Preferred Languages:", languages)

# Define Emotional Journey Path
emotion_transition_paths = {
    "Very Sad": ["Very Sad", "Moderately Sad", "Little Sad", "Okayish"],
    "Moderately Sad": ["Moderately Sad", "Little Sad", "Okayish", "Pleasantly"],
    "Little Sad": ["Little Sad", "Okayish", "Pleasantly", "Giddy"],
    "Okayish": ["Okayish", "Pleasantly", "Giddy", "Party!!"],
    "Giddy": ["Pleasantly", "Party!!", "Giddy"],
    "Angry": ["Yikes", "Okayish", "Pleasantly"],
    "Spooky": ["Spooky", "Okayish", "Giddy", "Party!!"],
    "Yikes": ["Yikes", "Little Sad", "Okayish", "Pleasantly"]
}

journey_emotions = emotion_transition_paths.get(emotion, [emotion])
recommended_songs = []

# Number of songs per emotion stage
songs_per_emotion = 10
songs_per_language = 5  # To balance across languages
min_songs_needed = 40
max_songs_allowed = 100

# Reset recommended songs list
recommended_songs = []

# **Step 1: Fetch songs per emotion stage, considering multiple languages**
for emotion in journey_emotions:
    if len(recommended_songs) >= max_songs_allowed:
        break  # Stop if we already have enough songs

    for language in languages:
        query_results = collection.query(
            query_embeddings=[diary_embedding],  
            n_results=songs_per_language,  # Fetch songs per language
            where={
                "$and": [
                    {"emotion": {"$eq": emotion}},  
                    {"weather": {"$eq": current_weather}},  
                    {"time_of_day": {"$eq": current_time_of_day}},
                    {"language": {"$eq": language}}
                ]
            }
        )

        if query_results["ids"][0]:  
            for track_id, meta in zip(query_results["ids"][0], query_results["metadatas"][0]):
                recommended_songs.append({
                    "song_title": meta["song_title"],
                    "artist": meta["artist"],
                    "emotion": meta["emotion"],
                    "track_id": track_id,
                    "language": meta["language"],
                    "weather": meta.get("weather", "N/A"),
                    "time_of_day": meta.get("time_of_day", "N/A")
                })

# **Step 2: Relax weather constraint if needed**
if len(recommended_songs) < min_songs_needed:
    for emotion in journey_emotions:
        for language in languages:
            if len(recommended_songs) >= min_songs_needed:
                break

            query_results = collection.query(
                query_embeddings=[diary_embedding],  
                n_results=songs_per_language,
                where={
                    "$and": [
                        {"emotion": {"$eq": emotion}},  
                        {"time_of_day": {"$eq": current_time_of_day}},
                        {"language": {"$eq": language}}
                    ]
                }
            )

            if query_results["ids"][0]:  
                for track_id, meta in zip(query_results["ids"][0], query_results["metadatas"][0]):
                    recommended_songs.append({
                        "song_title": meta["song_title"],
                        "artist": meta["artist"],
                        "emotion": meta["emotion"],
                        "track_id": track_id,
                        "language": meta["language"],
                        "weather": meta.get("weather", "N/A"),
                        "time_of_day": meta.get("time_of_day", "N/A")
                    })
                    if len(recommended_songs) >= max_songs_allowed:
                        break 

# **Step 3: Relax both weather and time constraints if needed**
if len(recommended_songs) < min_songs_needed:
    for emotion in journey_emotions:
        for language in languages:
            if len(recommended_songs) >= min_songs_needed:
                break

            query_results = collection.query(
                query_embeddings=[diary_embedding],  
                n_results=songs_per_language,
                where={
                    "$and": [
                        {"emotion": {"$eq": emotion}},
                        {"language": {"$eq": language}}

                    ]
                    
                    
                }
            )

            if query_results["ids"][0]:  
                for track_id, meta in zip(query_results["ids"][0], query_results["metadatas"][0]):
                    recommended_songs.append({
                        "song_title": meta["song_title"],
                        "artist": meta["artist"],
                        "emotion": meta["emotion"],
                        "track_id": track_id,
                        "language": meta["language"],
                        "weather": meta.get("weather", "N/A"),
                        "time_of_day": meta.get("time_of_day", "N/A")
                    })
                    if len(recommended_songs) >= max_songs_allowed:
                        break 

# Print the final emotional journey playlist
print("\n🚀 Emotional Journey Playlist:\n")
for idx, song in enumerate(recommended_songs[:min_songs_needed], 1):
    
    print(f"{idx}. {song['song_title']} - {song['artist']} ({song['language']}, Track ID: {song['track_id']}, Emotion: {song['emotion']}, Weather: {song['weather']}, Time: {song['time_of_day']})")
    print("------------------------------------------------")
    
