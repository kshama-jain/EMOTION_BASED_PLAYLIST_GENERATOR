import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  playlists: any[];
  addPlaylist: (playlist: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [playlists, setPlaylists] = useState<any[]>([]);
  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) {
      // Fetch user info from backend
      axios.get("http://localhost:8000/auth/me", { headers: { token } })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
      // Fetch playlists from backend when token is set
      axios.get("http://localhost:8000/playlists", { headers: { token } })
        .then(res => setPlaylists(res.data))
        .catch(() => setPlaylists([]));
    } else {
      setUser(null);
      setPlaylists([]);
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    const res = await axios.post("http://localhost:8000/auth/login", { username, password });
    setToken(res.data.access_token);
    localStorage.setItem("token", res.data.access_token);
    // Fetch user info after login
    const userRes = await axios.get("http://localhost:8000/auth/me", { headers: { token: res.data.access_token } });
    setUser(userRes.data);
    // Fetch playlists after login
    const playlistsRes = await axios.get("http://localhost:8000/playlists", { headers: { token: res.data.access_token } });
    setPlaylists(playlistsRes.data);
  };

  const signup = async (username: string, email: string, password: string) => {
    await axios.post("http://localhost:8000/auth/signup", { username, email, password });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const addPlaylist = async (playlist: any) => {
    await axios.post("http://localhost:8000/playlists", playlist, {
      headers: { token },
    });
    // Refetch playlists after adding
    const playlistsRes = await axios.get("http://localhost:8000/playlists", { headers: { token } });
    setPlaylists(playlistsRes.data);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, signup, logout, playlists, addPlaylist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};