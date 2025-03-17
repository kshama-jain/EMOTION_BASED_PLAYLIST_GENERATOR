import pandas as pd
import torch
from transformers import BertTokenizer, BertForSequenceClassification

# Load Model & Tokenizer
model = BertForSequenceClassification.from_pretrained("./bert-emotion-classifier")
tokenizer = BertTokenizer.from_pretrained("./bert-emotion-classifier")

# Define Emotion Labels
emotionsList = ["Very Sad", "Moderately Sad", "Little Sad", "Okayish", "Giddy", 
                "Pleasant", "Party!!", "Yikes", "Angry", "Spooky"]

emotion_labels = {idx: emotion for idx, emotion in enumerate(emotionsList)}

# Emotion Prediction Function
def predict_emotion(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=128)
    outputs = model(**inputs)
    predicted_class = torch.argmax(outputs.logits).item()
    
    return emotion_labels.get(predicted_class, "Unknown")

# Example Test
test_text = """Today was a long and exhausting day. I had a tough meeting at work that didn't go well, 
and I feel like my efforts aren't being recognized. It's frustrating because I've been 
working so hard, but it seems like no one cares. On top of that, the weather has been 
cold and gloomy, which made me feel even worse. I just want to unwind and forget about everything."""
print("Predicted Emotion:", predict_emotion(test_text))
