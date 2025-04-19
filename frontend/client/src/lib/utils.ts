import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getColorForEmotion(emotion: string): string {
  if (!emotion || typeof emotion !== "string") {
    return "#1DB954"; // Default to Spotify Green
  }

  const emotionColors: Record<string, string> = {
    happy: "#FFD700", // Gold
    sad: "#4169E1", // Royal Blue
    angry: "#FF4500", // Orange Red
    fear: "#800080", // Purple
    surprise: "#00BFFF", // Deep Sky Blue
    disgust: "#228B22", // Forest Green
    neutral: "#708090", // Slate Gray
    joy: "#FFD700", // Gold
    excitement: "#FF4500", // Orange Red
    love: "#FF69B4", // Hot Pink
    contentment: "#48D1CC", // Teal
  };

  return emotionColors[emotion.toLowerCase()] || "#1DB954"; // Default to Spotify Green
}
