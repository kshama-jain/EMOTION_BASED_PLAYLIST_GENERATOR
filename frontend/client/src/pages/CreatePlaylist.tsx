import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Send, Music, Plus, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

// Define types for the API response
interface Song {
  song_title: string;
  artist: string;
  emotion: string;
  track_id: string;
  language: string;
  weather: string;
  time_of_day: string;
}

interface PlaylistResponse {
  emotion: string;
  journey: string[];
  response: string;
  songs: Song[];
}

// Available language options for music
const LANGUAGE_OPTIONS = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Tamil", label: "Tamil" },
  { value: "Telugu", label: "Telugu" },
  { value: "Malayalam", label: "Malayalam" },
  { value: "Kannada", label: "Kannada" },
  { value: "Bengali", label: "Bengali" },
  { value: "Punjabi", label: "Punjabi" },
  { value: "Gujarati", label: "Gujarati" },
  { value: "Marathi", label: "Marathi" },
  { value: "Urdu", label: "Urdu" },
  { value: "Odia", label: "Odia" },
  { value: "Assamese", label: "Assamese" },
  { value: "Bhojpuri", label: "Bhojpuri" },
  { value: "Haryanvi", label: "Haryanvi" },
  { value: "Rajasthani", label: "Rajasthani" },
];

// Time of day options
const TIME_OPTIONS = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "night", label: "Night" },
];

// Weather options
const WEATHER_OPTIONS = [
  { value: "sunny", label: "Sunny" },
  { value: "rainy", label: "Rainy" },
  { value: "cloudy", label: "Cloudy" },
  { value: "snowy", label: "Snowy" },
  { value: "stormy", label: "Stormy" },
  { value: "clear", label: "Clear" },
  { value: "foggy", label: "Foggy" },
];

export default function CreatePlaylist() {
  const { user, isAuthenticated, addPlaylist } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Replace single input with diary entry state
  const [diaryEntry, setDiaryEntry] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["english"]);
  const [timeOfDay, setTimeOfDay] = useState("afternoon");
  const [weather, setWeather] = useState("sunny");
  
  // Keep the old input for chat messages
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Hello${user?.name ? ` ${user.name}` : ""}! Share how you're feeling in the diary entry below. You can also select your preferred music languages, time of day, and weather to get a personalized playlist.`,
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isGenerating) {
      // Prevent browser navigation
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isGenerating]);

  if (!isAuthenticated) {
    return null;
  }

  const addLanguage = (language: string) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const removeLanguage = (language: string) => {
    setSelectedLanguages(selectedLanguages.filter(lang => lang !== language));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!diaryEntry.trim()) {
      toast({
        title: "Empty diary entry",
        description: "Please write something in your diary entry.",
        variant: "destructive",
      });
      return;
    }
    
    // Add user message with diary content
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: diaryEntry,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);
    
    try {
      // Capitalize the first letter of each language
      const capitalizedLanguages = selectedLanguages.map(lang => capitalizeFirstLetter(lang));
      
      // Call the backend API instead of simulating the response
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry: diaryEntry,
          languages: capitalizedLanguages,
          time_of_day: timeOfDay,
          weather: weather
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Generate playlist based on API response
      handleApiResponse(data);
    } catch (error) {
      console.error("Error calling API:", error);
      toast({
        title: "Error",
        description: "There was an error processing your request. Falling back to local generation.",
        variant: "destructive",
      });
      
      // Fallback to local generation for demo purposes
      setTimeout(() => {
        generatePlaylistResponse(diaryEntry);
      }, 1500);
    }
  };

  const handleApiResponse = (data: PlaylistResponse) => {
    // Generate response from the API data
    const { emotion, journey, response, songs } = data;
    
    // Create playlist title and description based on detected emotion
    const playlistTitle = `${capitalizeFirstLetter(emotion)} Journey`;
    const playlistDescription = response;
    const playlistColor = getColorForEmotion(emotion);
    
    // Format all songs list in a similar way to how they appeared in the box
    const songsFormatted = songs.map((song, index) => 
      `${index + 1}. "${song.song_title}" by ${song.artist}\n   Language: ${song.language}`
    ).join('\n\n');
    
    // Generate AI response with all songs preview
    const aiResponse = `${response}\n\nI've created a "${playlistTitle}" playlist for you. Here are all the recommended songs:\n\n${songsFormatted}\n\nWould you like me to add this to your library?`;
    
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      content: aiResponse,
      role: "assistant",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, assistantMessage]);
    setIsGenerating(false);
    
    // Store playlist info
    sessionStorage.setItem("proposedPlaylist", JSON.stringify({
      title: playlistTitle,
      description: playlistDescription,
      color: playlistColor,
      songs: songs
    }));
    
    // Clear diary entry for next use
    setDiaryEntry("");
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const getColorForEmotion = (emotion: string) => {
    // Map emotions to colors
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
      // Add more emotions as needed
    };
    
    return emotionColors[emotion.toLowerCase()] || "#1DB954"; // Default to Spotify Green
  };

  // Keeping the old function for fallback
  const generatePlaylistResponse = (userInput: string) => {
    // This is where you would normally call an AI API
    // For now, we'll simulate a response based on keywords
    
    let playlistTitle = "";
    let playlistDescription = "";
    let playlistColor = "";
    
    const lowerInput = userInput.toLowerCase();
    
    // Check for mood/sentiment keywords
    if (lowerInput.includes("happy") || lowerInput.includes("joy") || lowerInput.includes("excited")) {
      playlistTitle = "Upbeat Vibes";
      playlistDescription = "Energetic tracks to boost your already happy mood!";
      playlistColor = "#FFD700"; // Gold
    } else if (lowerInput.includes("sad") || lowerInput.includes("blue") || lowerInput.includes("down")) {
      playlistTitle = "Comfort Zone";
      playlistDescription = "Soothing melodies for when you need emotional support.";
      playlistColor = "#4169E1"; // Royal Blue
    } else if (lowerInput.includes("relax") || lowerInput.includes("calm") || lowerInput.includes("peace")) {
      playlistTitle = "Chill Retreat";
      playlistDescription = "Ambient sounds to help you unwind and find your center.";
      playlistColor = "#48D1CC"; // Teal
    } else if (lowerInput.includes("energy") || lowerInput.includes("workout") || lowerInput.includes("exercise")) {
      playlistTitle = "Power Hour";
      playlistDescription = "High-tempo tracks to fuel your workout session.";
      playlistColor = "#FF4500"; // Orange Red
    } else if (lowerInput.includes("focus") || lowerInput.includes("work") || lowerInput.includes("study")) {
      playlistTitle = "Deep Focus";
      playlistDescription = "Instrumental tracks to boost your productivity.";
      playlistColor = "#800080"; // Purple
    } else {
      // Default if no keywords match
      playlistTitle = "Custom Mix";
      playlistDescription = "A personalized playlist based on your preferences.";
      playlistColor = "#1DB954"; // Spotify Green
    }
    
    // Check for location keywords
    if (lowerInput.includes("beach") || lowerInput.includes("ocean") || lowerInput.includes("sea")) {
      playlistTitle = "Beach Waves";
      playlistDescription = "Perfect soundtrack for your time by the ocean.";
      playlistColor = "#00BFFF"; // Deep Sky Blue
    } else if (lowerInput.includes("mountain") || lowerInput.includes("hiking") || lowerInput.includes("nature")) {
      playlistTitle = "Mountain Echoes";
      playlistDescription = "Organic sounds that complement the great outdoors.";
      playlistColor = "#228B22"; // Forest Green
    } else if (lowerInput.includes("city") || lowerInput.includes("urban") || lowerInput.includes("downtown")) {
      playlistTitle = "Urban Pulse";
      playlistDescription = "Rhythms that match the pace of city life.";
      playlistColor = "#708090"; // Slate Gray
    }
    
    // Generate the AI response
    const aiResponse = `Based on your mood and preferences, I've created a "${playlistTitle}" playlist for you. ${playlistDescription} Would you like me to add this to your library?`;
    
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      content: aiResponse,
      role: "assistant",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, assistantMessage]);
    setIsGenerating(false);
    
    // Store the proposed playlist in state or context for later confirmation
    sessionStorage.setItem("proposedPlaylist", JSON.stringify({
      title: playlistTitle,
      description: playlistDescription,
      color: playlistColor,
    }));
  };

  const handleCreatePlaylist = async () => {
    // Get the proposed playlist from sessionStorage
    const proposedPlaylistJson = sessionStorage.getItem("proposedPlaylist");
    if (!proposedPlaylistJson) return;
    const proposedPlaylist = JSON.parse(proposedPlaylistJson);

    // Only send songs and their language
    const songs = (proposedPlaylist.songs || []).map((song: any) => ({
      song_title: song.song_title,
      language: song.language,
      artist: song.artist,
      track_id: song
    }));

    await addPlaylist({
      title: proposedPlaylist.title,
      description: proposedPlaylist.description,
      songs,
      emotion: proposedPlaylist.emotion || ""
    });

    sessionStorage.removeItem("proposedPlaylist");
    toast({
      title: "Playlist created!",
      description: `"${proposedPlaylist.title}" has been added to your library.`,
    });
    const confirmationMessage: Message = {
      id: `assistant-confirmation-${Date.now()}`,
      content: `Great! I've added "${proposedPlaylist.title}" to your library. You can find it in your playlists section. Is there anything else you'd like to do?`,
      role: "assistant",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, confirmationMessage]);
  };

  // Simple function to generate a dummy cover image URL based on title and color
  const generateCoverImage = (title: string, color: string) => {
    // For a real app, you would generate or select an actual image
    // For now, return a placeholder with the title's first letter
    return `https://via.placeholder.com/300/${color.replace('#', '')}/${getContrastColor(color)}?text=${title.charAt(0).toUpperCase()}`;
  };

  // Helper function to determine contrasting text color
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.5 ? '000000' : 'FFFFFF';
  };

  const renderActions = () => {
    // Check if the last message is from the assistant and contains a playlist suggestion
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "assistant" && lastMessage.content.includes("Would you like me to add this to your library?")) {
      return (
        <div className="flex space-x-3 mt-2">
          <Button
            onClick={handleCreatePlaylist}
            className="flex items-center space-x-2 bg-[#1DB954] hover:bg-opacity-80 text-white"
          >
            <Plus size={16} />
            <span>Add to Library</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-[#282828] hover:bg-opacity-80 text-white border-none"
            onClick={() => {
              setMessages(prev => [
                ...prev, 
                {
                  id: `assistant-restart-${Date.now()}`,
                  content: "No problem! Let's try again. Tell me how you're feeling or what kind of music you'd like.",
                  role: "assistant",
                  timestamp: new Date()
                }
              ]);
              sessionStorage.removeItem("proposedPlaylist");
            }}
          >
            <span>Try Again</span>
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-grow flex flex-col bg-[#121212]">
        {/* Overlay while generating playlist */}
        {isGenerating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 cursor-not-allowed select-none" style={{ pointerEvents: 'all' }}>
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#1DB954] mb-4" />
              <div className="text-xl font-semibold text-white mb-2">Loading the perfect playlist for you...</div>
              <div className="text-gray-400">Please wait, this may take a few moments.</div>
            </div>
          </div>
        )}
        <div className="flex-1 p-6 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Create Playlist</h1>
              <p className="text-gray-400">
                Tell me how you feel, and I'll create the perfect playlist for you
              </p>
            </div>
            <Music className="h-8 w-8 text-[#1DB954]" />
          </div>
          
          {/* Chat History */}
          <ScrollArea className="flex-1 mb-4 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-[#1DB954] text-white"
                        : "bg-[#282828] text-white"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                    {message.role === "assistant" && 
                      message.id === messages[messages.length - 1].id && 
                      renderActions()}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
          </ScrollArea>
          
          {/* Diary Entry Form */}
          <Card className="bg-[#282828] border-none mb-4">
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Diary Entry</label>
                  <Textarea 
                    placeholder="Write about how you're feeling today, what's on your mind, or what music you're in the mood for..."
                    value={diaryEntry}
                    onChange={(e) => setDiaryEntry(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1E1E1E] border-none focus-visible:ring-1 focus-visible:ring-[#1DB954] text-white min-h-[120px] resize-y"
                    disabled={isGenerating}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Language Selection */}
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      Languages
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedLanguages.map(lang => (
                        <div key={lang} className="bg-[#1E1E1E] text-white px-2 py-1 rounded-full text-xs flex items-center">
                          {LANGUAGE_OPTIONS.find(option => option.value === lang)?.label}
                          <button 
                            type="button"
                            onClick={() => removeLanguage(lang)}
                            className="ml-1 hover:text-[#1DB954]"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <Select onValueChange={addLanguage}>
                      <SelectTrigger className="w-full bg-[#1E1E1E] border-none focus:ring-[#1DB954]">
                        <SelectValue placeholder="Add language" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#282828] text-white border-gray-700">
                        {LANGUAGE_OPTIONS.filter(option => !selectedLanguages.includes(option.value)).map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Time of Day */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">Time of Day</label>
                    <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                      <SelectTrigger className="w-full bg-[#1E1E1E] border-none focus:ring-[#1DB954]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#282828] text-white border-gray-700">
                        {TIME_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Weather */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">Weather</label>
                    <Select value={weather} onValueChange={setWeather}>
                      <SelectTrigger className="w-full bg-[#1E1E1E] border-none focus:ring-[#1DB954]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#282828] text-white border-gray-700">
                        {WEATHER_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#1DB954] hover:bg-opacity-80 text-white px-6"
                    disabled={isGenerating || !diaryEntry.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generating Playlist...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Create Playlist
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}