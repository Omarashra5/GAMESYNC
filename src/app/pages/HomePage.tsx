import { useState } from "react";
import { Monitor, Globe, Swords, LayoutGrid, TrendingUp, Shuffle, ChevronDown } from "lucide-react";
import { useGames } from "../context/GamesContext";
import { GameCard, SkeletonCard } from "../components/GameCard";
import { HeroSection } from "../components/HeroSection";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
const FILTERS = [
  { id: "all" as const, label: "All Games", icon: LayoutGrid },
  { id: "pc" as const, label: "PC", icon: Monitor },
  { id: "browser" as const, label: "Browser", icon: Globe },
  { id: "mmorpg" as const, label: "MMORPG", icon: Swords },
];

const PAGE_SIZE = 20;

export default function HomePage() {
  const { filteredGames, isLoading, activeFilter, setFilter, games, getRandomGame, searchQuery } = useGames();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const visibleGames = filteredGames.slice(0, page * PAGE_SIZE);
  const hasMore = visibleGames.length < filteredGames.length;

  const handleRandom = () => {
    const game = getRandomGame();
    if (game) navigate(`/game/${game.id}`);
  };

  return (
    <div className="min-h-screen" style={{ background: "#0B0F1A" }}>
      {/* Hero */}
      {!searchQuery && <HeroSection games={games} />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-blue-400" />
            <h2 className="text-white" style={{ fontFamily: "Rajdhani", fontWeight: 700 }}>
              {searchQuery ? `Results for "${searchQuery}"` : "Discover Games"}
            </h2>
            <span className="px-2 py-0.5 rounded-md text-xs"
              style={{ background: "rgba(59,130,246,0.1)", color: "#3B82F6", border: "1px solid rgba(59,130,246,0.2)" }}>
              {filteredGames.length.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleRandom}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white transition-all hover:scale-105"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}
          >
            <Shuffle size={14} />
            Random Game
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {FILTERS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setFilter(id); setPage(1); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200"
              style={activeFilter === id ? {
                background: "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))",
                border: "1px solid rgba(59,130,246,0.5)",
                color: "#fff",
                boxShadow: "0 0 15px rgba(59,130,246,0.2)",
              } : {
                background: "rgba(30,42,59,0.4)",
                border: "1px solid rgba(59,130,246,0.1)",
                color: "#94A3B8",
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 15 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredGames.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-white mb-2" style={{ fontFamily: "Rajdhani" }}>No games found</h3>
            <p className="text-slate-400 text-sm">Try a different search or filter</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {visibleGames.map((game, i) => (
                <GameCard key={game.id} game={game} index={i} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
                  style={{
                    background: "rgba(30,42,59,0.7)",
                    border: "1px solid rgba(59,130,246,0.3)",
                  }}
                >
                  <ChevronDown size={16} />
                  Load More Games
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
