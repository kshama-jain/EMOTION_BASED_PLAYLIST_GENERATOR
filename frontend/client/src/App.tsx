import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Land from "@/pages/Land";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Home from "@/pages/Home";
import Calendar from "@/pages/Calendar";
import Library from "@/pages/Library";
import CreatePlaylist from "@/pages/CreatePlaylist";
import NotFound from "@/pages/not-found";
import PlaylistPage from "./pages/PlaylistPage";
import Profile from "@/pages/Profile";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/lib/auth-context";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-green-500 rounded-full mb-4"></div>
          <div className="text-xl font-semibold text-white">Loading Emotify...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element = {<Land />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/library" element={<Library />} />
        <Route path="/create-playlist" element={<CreatePlaylist />} />
        <Route path="/playlist/:id" element={<PlaylistPage />} />
        <Route path="/playlist" element={<PlaylistPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
