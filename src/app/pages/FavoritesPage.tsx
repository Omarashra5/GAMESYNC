import { Link } from "react-router";
import { Heart, LogIn } from "lucide-react";
import { useGames } from "../context/GamesContext";
import { useAuth } from "../context/AuthContext";
import { GameCard } from "../components/GameCard";
import { motion } from "motion/react";

export default function FavoritesPage() {
  const { games, favorites } = useGames();
  const { user, openLoginModal } = useAuth();

  const favoriteGames = games.filter(g => favorites.includes(g.id));

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-16" style={{ background: "#0B0F1A" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm px-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))", border: "1px solid rgba(59,130,246,0.2)" }}>
            <Heart size={36} className="text-blue-400" />
          </div>
          <h2 className="text-white mb-3" style={{ fontFamily: "Rajdhani", fontWeight: 700 }}>Sign in to view favorites</h2>
          <p className="text-slate-400 text-sm mb-6">Create your personal game collection by signing in with Google.</p>
          <button onClick={openLoginModal}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white mx-auto transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}>
            <LogIn size={16} />
            Sign In with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: "#0B0F1A" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={22} className="text-red-400 fill-red-400" />
          <h1 className="text-white" style={{ fontFamily: "Rajdhani", fontWeight: 700 }}>My Favorites</h1>
          {favoriteGames.length > 0 && (
            <span className="px-2 py-0.5 rounded-md text-xs"
              style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
              {favoriteGames.length}
            </span>
          )}
        </div>

        {favoriteGames.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-white mb-2" style={{ fontFamily: "Rajdhani" }}>No favorites yet</h3>
            <p className="text-slate-400 text-sm mb-6">Browse games and click the heart to save them here.</p>
            <Link to="/" className="px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", boxShadow: "0 0 15px rgba(59,130,246,0.3)" }}>
              Browse Games
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favoriteGames.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
