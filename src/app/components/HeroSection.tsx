import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Play, Heart, Star, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Game } from "../context/GamesContext";
import { useGames } from "../context/GamesContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
const FEATURED_OVERRIDE = [
  {
    id: 452,
    title: "Call Of Duty: Warzone",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1400&h=600&fit=crop&auto=format",
    genre: "Battle Royale",
    platform: "PC (Windows)",
    short_description: "A massive combat arena where 150 players drop in and fight to be the last one standing. Experience the ultimate free-to-play battle royale.",
    publisher: "Activision",
    developer: "Infinity Ward",
    release_date: "2020-03-10",
    game_url: "https://www.callofduty.com/warzone",
    freetogame_profile_url: "",
    rating: "9.2",
    players: "100M+",
  },
  {
    id: 517,
    title: "Apex Legends",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1400&h=600&fit=crop&auto=format",
    genre: "Battle Royale",
    platform: "PC (Windows)",
    short_description: "A battle royale hero shooter where legendary characters with powerful abilities team up to battle for glory, fame, and fortune.",
    publisher: "EA",
    developer: "Respawn Entertainment",
    release_date: "2019-02-04",
    game_url: "https://www.ea.com/games/apex-legends",
    freetogame_profile_url: "",
    rating: "9.0",
    players: "130M+",
  },
  {
    id: 246,
    title: "Destiny 2",
    thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1400&h=600&fit=crop&auto=format",
    genre: "MMORPG",
    platform: "PC (Windows)",
    short_description: "Humanity's last safe city has fallen to an overwhelming invasion force led by Dominus Ghaul, commander of the Red Legion.",
    publisher: "Bungie",
    developer: "Bungie",
    release_date: "2017-09-06",
    game_url: "https://www.bungie.net/7/en/destiny/buy",
    freetogame_profile_url: "",
    rating: "8.8",
    players: "40M+",
  },
];

interface HeroGame {
  id: number;
  title: string;
  thumbnail: string;
  genre: string;
  platform: string;
  short_description: string;
  publisher: string;
  developer: string;
  release_date: string;
  game_url: string;
  freetogame_profile_url: string;
  rating?: string;
  players?: string;
}

export function HeroSection({ games }: { games: Game[] }) {
  const { toggleFavorite, isFavorite } = useGames();
  const { user, openLoginModal } = useAuth();
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);

  const featured: HeroGame[] = FEATURED_OVERRIDE;

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, [auto, featured.length]);

  const game = featured[current];

  const prev = () => { setAuto(false); setCurrent(c => (c - 1 + featured.length) % featured.length); };
  const next = () => { setAuto(false); setCurrent(c => (c + 1) % featured.length); };

  const handleFav = () => {
    if (!user) { openLoginModal(); return; }
    toggleFavorite(game.id);
  };

  return (
    <div className="relative w-full overflow-hidden " style={{ height: "520px" }}>
      {/* Background */}
      
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, rgba(11,15,26,0.95) 30%, rgba(11,15,26,0.4) 70%, rgba(11,15,26,0.2) 100%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, #0B0F1A 0%, transparent 40%)",
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background: i % 2 === 0 ? "#3B82F6" : "#8B5CF6",
              left: `${Math.random() * 50}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.4,
              animation: `float ${3 + i}s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl"
            >
              {/* Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 rounded-md text-xs font-medium"
                  style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.4)", color: "#3B82F6" }}>
                  ⚡ FEATURED
                </span>
                
                <span className="text-slate-400 text-xs">{game.genre}</span>
              </div>

              <h1 className="text-white mb-3 font-rajdhani" style={{ fontFamily: "Rajdhani", fontWeight: 700 }}>
                {game.title}
              </h1>

              <p className="text-slate-300 mb-6 leading-relaxed" style={{ fontSize: "0.95rem", maxWidth: "420px" }}>
                {game.short_description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-6">
                {game.rating && (
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-medium">{game.rating}</span>
                    <span className="text-slate-500 text-xs">/ 10</span>
                  </div>
                )}
                {game.players && (
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-blue-400" />
                    <span className="text-slate-300 text-sm">{game.players} players</span>
                  </div>
                )}
                <span className="text-slate-500 text-xs">{game.publisher}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link
                  to={`/game/${game.id}`}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                    boxShadow: "0 0 25px rgba(59,130,246,0.4)",
                  }}
                >
                  <Play size={16} className="fill-white" />
                  Explore Game
                </Link>

                <button
                  onClick={handleFav}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    background: isFavorite(game.id) ? "rgba(239,68,68,0.2)" : "rgba(30,42,59,0.7)",
                    border: isFavorite(game.id) ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(59,130,246,0.2)",
                    color: isFavorite(game.id) ? "#EF4444" : "#94A3B8",
                  }}
                >
                  <Heart size={16} className={isFavorite(game.id) ? "fill-red-400" : ""} />
                  <span className="hidden sm:block">{isFavorite(game.id) ? "Saved" : "Save"}</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button onClick={prev}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
          style={{ background: "rgba(30,42,59,0.7)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          {featured.map((_, i) => (
            <button key={i} onClick={() => { setAuto(false); setCurrent(i); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? "24px" : "6px",
                height: "6px",
                background: i === current ? "#3B82F6" : "rgba(59,130,246,0.3)",
              }}
            />
          ))}
        </div>
        <button onClick={next}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
          style={{ background: "rgba(30,42,59,0.7)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
