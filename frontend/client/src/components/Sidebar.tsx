import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, Library, Calendar, PlusCircle, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { playlists, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="w-full md:w-64 bg-black flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <svg
            className="w-8 h-8 text-[#1DB954]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          <h1 className="text-xl font-bold ml-2">Emotify</h1>
        </div>
        <nav>
          <ul>
            <li className="mb-2">
              <Link
                to="/home"
                className={`flex items-center p-2 rounded-md hover:bg-[#282828] transition ${
                  pathname === "/" ? "text-white" : "text-gray-400"
                }`}
              >
                <Home className="w-6 h-6" />
                <span className="ml-3">Home</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/library"
                className={`flex items-center p-2 rounded-md hover:bg-[#282828] transition ${
                  pathname === "/library" ? "text-white" : "text-gray-400"
                }`}
              >
                <Library className="w-6 h-6" />
                <span className="ml-3">Your Library</span>
              </Link>
            </li>
            <li className="mb-6">
              <Link
                to="/calendar"
                className={`flex items-center p-2 rounded-md hover:bg-[#282828] transition ${
                  pathname === "/calendar" ? "text-white bg-[#282828]" : "text-gray-400"
                }`}
              >
                <Calendar className="w-6 h-6" />
                <span className="ml-3">Calendar</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/create-playlist"
                className={`flex items-center p-2 rounded-md hover:bg-[#282828] transition ${
                  pathname === "/create-playlist" ? "text-white" : "text-gray-400"
                }`}
              >
                <PlusCircle className="w-6 h-6" />
                <span className="ml-3">Create Playlist</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/profile"
                className={`flex items-center p-2 rounded-md hover:bg-[#282828] transition ${
                  pathname === "/profile" ? "text-white" : "text-gray-400"
                }`}
              >
                <UserCircle className="w-6 h-6" />
                <span className="ml-3">Profile</span>
              </Link>
            </li>
            <li className="mb-2">
              <Button
                variant="ghost"
                className="flex items-center justify-start p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#282828] transition w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-6 h-6" />
                <span className="ml-3">Logout</span>
              </Button>
            </li>
          </ul>
        </nav>
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-sm font-medium mb-3 text-gray-400">YOUR PLAYLISTS</h3>
          <ul>
            {playlists
              .slice()
              .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
              .slice(0, 3)
              .map((playlist) => (
                <li key={playlist.id} className="mb-2">
                  <button
                    className="block p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#282828] transition w-full text-left"
                    onClick={() => navigate("/playlist/" + playlist.id, { state: { playlist } })}
                  >
                    {playlist.title}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
