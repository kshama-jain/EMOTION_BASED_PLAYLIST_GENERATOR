import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import PlaylistCard from "@/components/PlaylistCard";
import { TRENDING_PLAYLISTS } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, isAuthenticated, playlists } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const gradientClasses = [
    "bg-gradient-to-br from-blue-500 to-green-500",
    "bg-gradient-to-br from-blue-500 to-green-400",
    "bg-gradient-to-br from-purple-500 to-indigo-500",
    "bg-gradient-to-br from-orange-500 to-yellow-400",
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <Sidebar />
      
      <div className="flex-grow p-6 md:p-8 overflow-y-auto bg-[#121212]">
        <h1 className="text-2xl font-bold mb-6">Good evening</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playlists
              .slice()
              .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
              .slice(0, 3)
              .map((playlist,index) => (
                <PlaylistCard 
                  key={playlist.id}
                  playlist={playlist}
                  showDescription={false}
                  className={`${gradientClasses[index % gradientClasses.length]} hover:scale-[1.03] transition-transform duration-300`}

                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
