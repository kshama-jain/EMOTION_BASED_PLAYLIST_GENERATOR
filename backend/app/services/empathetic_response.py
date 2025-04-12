
import ollama  # or however you're calling your LLM

def generate_empathic_response(entry, emotion):
    prompt = f"""You are a warm, supportive friend. Your job is to respond with empathy to someone's diary entry and gently introduce them to a playlist to support their emotional journey.

Diary Entry:
\"\"\"{entry}\"\"\"

Detected Emotion: {emotion}

Respond with empathy and then say you'll suggest some songs to support them. Don't actually suggest a song, just say you are going to suggest a playlist.

"""
    response = ollama.chat(
        model="llama3.2",
        messages=[{"role": "user", "content": prompt}]
    )
    return response["message"]["content"]
