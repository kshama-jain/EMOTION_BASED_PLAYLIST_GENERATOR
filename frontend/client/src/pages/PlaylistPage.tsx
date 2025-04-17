import { useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlaylistPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<any>(location.state?.playlist || null);

  useEffect(() => {
    if (!playlist && id && token) {
      axios.get(`http://localhost:8000/playlist/${id}`, { headers: { token } })
        .then(res => setPlaylist(res.data));
    }
  }, [id, token, playlist]);

  if (!playlist) {
    return <div className="text-white">No playlist data available.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-grow p-6 md:p-8 overflow-y-auto bg-[#121212]">
        <button
          className="mb-4 text-[#1DB954] hover:underline"
          onClick={() => navigate(-1)}
        >
          ← Back to Library
        </button>
        <div className="flex items-center mb-4">
          <button
            className="text-red-400 hover:text-red-600 text-xs border border-red-400 rounded px-3 py-1 bg-[#181818] mr-4"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this playlist?")) {
                axios.delete(`http://localhost:8000/playlist/${playlist.id}`, { headers: { token } })
                  .then(() => navigate('/library'));
              }
            }}
          >
            Delete Playlist
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-2">{playlist.title}</h1>
        <p className="text-xs text-gray-400 mb-2">
          {playlist.created_at ? new Date(playlist.created_at.replace(' ', 'T')).toLocaleString() : ""}
        </p>
        <p className="mb-6 text-gray-300">{playlist.description}</p>
        <h2 className="text-2xl font-semibold mb-4">Songs</h2>
        <ul className="space-y-4">
          {playlist.songs.map((song: any, index: number) => (
            <li key={index} className="p-4 bg-[#282828] rounded">
              <div className="font-medium">{song.song_title}</div>
              <div className="text-sm text-gray-400">Language: {song.language}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}