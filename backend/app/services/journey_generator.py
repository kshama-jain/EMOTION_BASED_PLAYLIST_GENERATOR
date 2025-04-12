import ollama


def generate_emotion_path_with_ollama(diary_entry, starting_emotion):
    prompt = f"""
    Based on the following diary entry and the detected starting emotion "{starting_emotion}", generate a personalized emotional recovery journey through music.
    List 4-6 emotional stages this person might go through, in a meaningful and comforting order.
    Choose from the following emotions: ["Very Sad", "Moderately Sad", "Little Sad", "Okayish", "Giddy", "Pleasantly", "Party!!", "Yikes", "Angry", "Spooky"] Choose only from these please. Don't make up any new emotions.
    

    Respond only with a Python list like:
    ["Very Sad", "Little Sad", "Okayish", "Pleasantly"]

    Diary entry:
    {diary_entry}
    """
    
    response = ollama.chat(model="llama3.2", messages=[{"role": "user", "content": prompt}])
    content = response['message']['content'].strip()
    
    # Safely evaluate or parse the list
    try:
        journey = eval(content)
        if isinstance(journey, list):
            return journey
    except:
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
        return emotion_transition_paths.get(starting_emotion,[starting_emotion])
        # print("Failed to parse journey from LLM response.")
        # return [starting_emotion]
