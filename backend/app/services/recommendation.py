from sentence_transformers import SentenceTransformer
import chromadb


def get_recommendations(entry, journey, languages, time_of_day, weather):


    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    def get_diary_embedding(diary_text):
        return embedding_model.encode(diary_text).tolist()
    diary_embedding = get_diary_embedding(entry)
    client = chromadb.PersistentClient(path="E:/Sem-6/GENAI/PROJECT/GEN-P/EMOTION_BASED_PLAYLIST_GENERATOR/backend/song_db4/song_db4")
    collection = client.get_collection("songs")

    recommended_songs = []
    songs_per_language = 5  
    min_songs_needed = 40
    max_songs_allowed = 100

    # Reset recommended songs list
    recommended_songs = []
    # **Step 1: Fetch songs per emotion stage, considering multiple languages**
    for emotion in journey:
        if len(recommended_songs) >= max_songs_allowed:
            break  # Stop if we already have enough songs

        for language in languages:
            query_results = collection.query(
                query_embeddings=[diary_embedding],  
                n_results=songs_per_language,  # Fetch songs per language
                where={
                    "$and": [
                        {"emotion": {"$eq": emotion}},  
                        {"weather": {"$eq": weather}},  
                        {"time_of_day": {"$eq": time_of_day}},
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
        for emotion in journey:
            for language in languages:
                if len(recommended_songs) >= min_songs_needed:
                    break

                query_results = collection.query(
                    query_embeddings=[diary_embedding],  
                    n_results=songs_per_language,
                    where={
                        "$and": [
                            {"emotion": {"$eq": emotion}},  
                            {"time_of_day": {"$eq": time_of_day}},
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
        for emotion in journey:
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
    return recommended_songs

