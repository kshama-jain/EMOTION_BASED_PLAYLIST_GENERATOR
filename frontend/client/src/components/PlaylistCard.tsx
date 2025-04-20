import { Playlist } from "@/lib/types";
import { useNavigate } from "react-router-dom";

interface PlaylistCardProps {
  playlist: Playlist;
  compact?: boolean;
  showDescription?: boolean;
  className?: string;
}

export default function PlaylistCard({
  playlist,
  compact = false,
  showDescription = true,
  className = "",
}: PlaylistCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/playlist", { state: { playlist } });
  };

  return (
    <div
      className={`playlist-card rounded-lg overflow-hidden cursor-pointer transition group ${className}`}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className={`w-full aspect-square rounded-md mb-3 ${className}`}></div>

        <h3 className="font-bold text-white truncate">
          {playlist.title}
        </h3>
        {!compact && showDescription && (
          <p className="text-sm text-gray-300 line-clamp-2">
            {playlist.description || `${playlist.songCount} songs • ${playlist.duration}`}
          </p>
        )}
        {!compact && !showDescription && (
          <p className="text-sm text-gray-300">
            {playlist.songCount} songs • {playlist.duration}
          </p>
        )}
      </div>
    </div>
  );
}

