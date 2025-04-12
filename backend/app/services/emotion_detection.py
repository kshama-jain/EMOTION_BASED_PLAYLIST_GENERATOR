import torch
from transformers import BertTokenizer, BertForSequenceClassification


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