import { useState } from "react";
import { Link } from "react-router";
import { Heart, Monitor, Globe, ExternalLink } from "lucide-react";
import { Game } from "../context/GamesContext";
import { useGames } from "../context/GamesContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
interface GameCardProps {
  game: Game;
  index?: number;
}

const GENRE_COLORS: Record<string, string> = {
  "MMORPG": "#3B82F6",
  "Shooter": "#EF4444",
  "Strategy": "#10B981",
  "MOBA": "#F59E0B",
  "Racing": "#EC4899",
  "Sports": "#06B6D4",
  "Fighting": "#8B5CF6",
  "Battle Royale": "#F97316",
  "Card Game": "#14B8A6",
  "MMO": "#3B82F6",
  "Action RPG": "#A855F7",
  "Fantasy": "#6366F1",
  "Anime": "#EC4899",
};

function getGenreColor(genre: string) {
  for (const key of Object.keys(GENRE_COLORS)) {
    if (genre.toLowerCase().includes(key.toLowerCase())) return GENRE_COLORS[key];
  }
  return "#64748B";
}

export function GameCard({ game, index = 0 }: GameCardProps) {
  const { toggleFavorite, isFavorite } = useGames();
  const { openLoginModal, user } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fav = isFavorite(game.id);
  const isPC = game.platform.toLowerCase().includes("windows") || game.platform.toLowerCase().includes("pc");
  const genreColor = getGenreColor(game.genre);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { openLoginModal(); return; }
    toggleFavorite(game.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.6) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="card-hover group rounded-xl overflow-hidden flex flex-col relative"
      style={{
        background: "linear-gradient(135deg, #111827 0%, #0D1321 100%)",
        border: "1px solid rgba(59,130,246,0.12)",
      }}
    >
      {/* Thumbnail */}
      <Link to={`/game/${game.id}`} className="relative block overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {!imgError ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1E2A3B, #111827)" }}>
            <span className="text-slate-600 text-xs font-mono">{game.title[0]}</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(11,15,26,0.9) 0%, transparent 60%)",
            opacity: hovered ? 1 : 0.6,
          }}
        />

        {/* Platform badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs"
          style={{ background: "rgba(11,15,26,0.85)", backdropFilter: "blur(8px)" }}>
          {isPC ? <Monitor size={10} className="text-blue-400" /> : <Globe size={10} className="text-cyan-400" />}
          <span className="text-slate-300">{isPC ? "PC" : "Browser"}</span>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFav}
          className="absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            background: fav ? "rgba(239,68,68,0.9)" : "rgba(11,15,26,0.7)",
            backdropFilter: "blur(8px)",
            border: fav ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Heart size={14} className={fav ? "text-white fill-white" : "text-slate-300"} />
        </button>

        {/* View Details on hover */}
        <div
          className="absolute inset-0 flex items-end justify-center pb-4 transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <span className="px-4 py-1.5 rounded-lg text-white text-xs font-medium"
            style={{ background: "rgba(59,130,246,0.9)", border: "1px solid rgba(59,130,246,0.5)" }}>
            View Details →
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/game/${game.id}`}>
            <h3 className="text-white text-sm font-semibold leading-tight hover:text-blue-400 transition-colors line-clamp-1"
              style={{ fontFamily: "Rajdhani" }}>
              {game.title}
            </h3>
          </Link>
        </div>

        {/* Genre badge */}
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded-md text-xs font-medium"
            style={{ background: `${genreColor}20`, color: genreColor, border: `1px solid ${genreColor}30` }}
          >
            {game.genre}
          </span>
        </div>

        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 flex-1">
          {game.short_description}
        </p>

        <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid rgba(59,130,246,0.08)" }}>
          <span className="text-slate-500 text-xs truncate">{game.publisher}</span>
          <a
            href={game.game_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-blue-400 hover:text-blue-300 transition-colors"
            style={{ background: "rgba(59,130,246,0.08)" }}
          >
            Play <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(59,130,246,0.08)" }}>
      <div className="skeleton" style={{ aspectRatio: "16/9" }} />
      <div className="p-3 space-y-2" style={{ background: "#111827" }}>
        <div className="skeleton h-4 rounded w-3/4" />
        <div className="skeleton h-3 rounded w-1/3" />
        <div className="skeleton h-3 rounded w-full" />
        <div className="skeleton h-3 rounded w-5/6" />
      </div>
    </div>
  );
}
