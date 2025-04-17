import { Playlist } from "@/lib/types";
import { useNavigate } from "react-router-dom";

interface PlaylistCardProps {
  playlist: Playlist;
  compact?: boolean;
  showDescription?: boolean;
}

export default function PlaylistCard({ playlist, compact = false, showDescription = true }: PlaylistCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/playlist", { state: { playlist } });
  };

  return (
    <div
      className="playlist-card bg-[#282828] rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition group"
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="w-full aspect-square bg-[#121212] rounded-md mb-3 overflow-hidden">
          <img
            src={playlist.coverUrl}
            alt={`${playlist.title} cover`}
            className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="font-bold text-white truncate">
          {playlist.title}
        </h3>
        {!compact && showDescription && (
          <p className="text-sm text-gray-400 line-clamp-2">
            {playlist.description || `${playlist.songCount} songs • ${playlist.duration}`}
          </p>
        )}
        {!compact && !showDescription && (
          <p className="text-sm text-gray-400">
            {playlist.songCount} songs • {playlist.duration}
          </p>
        )}
      </div>
    </div>
  );
}
