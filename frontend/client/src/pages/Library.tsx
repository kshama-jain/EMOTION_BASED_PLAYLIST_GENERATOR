import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/lib/auth-context";
import axios from "axios";

export default function Library() {
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8000/playlists", { headers: { token } })
      .then(res => setPlaylists(res.data));
  }, [token]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <Sidebar />
      
      <div className="flex-grow p-6 md:p-8 overflow-y-auto bg-[#121212]">
        <div className="pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Your Library</h1>
              <p className="text-gray-400">
                Manage and explore your playlists collection
              </p>
            </div>
          </div>
          
          {playlists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-[#282828] rounded-lg p-4 cursor-pointer hover:bg-[#333] relative"
                  onClick={() => navigate(`/playlist/${playlist.id}`, { state: { playlist } })}
                >
                  <h2 className="text-xl font-semibold mb-2">{playlist.title}</h2>
                  <p className="text-xs text-gray-400 mb-2">
                    {playlist.created_at ? new Date(playlist.created_at.replace(' ', 'T')).toLocaleString() : ""}
                  </p>
                  <button
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs border border-red-400 rounded px-2 py-1 bg-[#181818]"
                    onClick={e => {
                      e.stopPropagation();
                      if (window.confirm("Are you sure you want to delete this playlist?")) {
                        axios.delete(`http://localhost:8000/playlist/${playlist.id}`, { headers: { token } })
                          .then(() => setPlaylists(playlists.filter(p => p.id !== playlist.id)));
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#181818] rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
              <p className="text-gray-400 mb-4">
                Start creating playlists to see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}