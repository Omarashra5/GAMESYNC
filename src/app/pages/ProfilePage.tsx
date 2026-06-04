import { Link } from "react-router";
import { Heart, Clock, LogOut, User, Mail, Calendar, Gamepad2, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useGames } from "../context/GamesContext";
import { GameCard } from "../components/GameCard";
import { motion } from "motion/react";

export default function ProfilePage() {
  const { user, logout, openLoginModal } = useAuth();
  const { games, favorites, recentlyViewed } = useGames();

  const favoriteGames = games.filter(g => favorites.includes(g.id));

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-16" style={{ background: "#0B0F1A" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm px-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))", border: "1px solid rgba(59,130,246,0.2)" }}>
            <User size={36} className="text-blue-400" />
          </div>
          <h2 className="text-white mb-3" style={{ fontFamily: "Rajdhani", fontWeight: 700 }}>Sign in to view profile</h2>
          <p className="text-slate-400 text-sm mb-6">Track your gaming history and manage your collection.</p>
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

  const joinDate = new Date(user.joinedAt).toLocaleDateString("en-US", { year: "numeric", month: "long" });

  return (
    <div className="min-h-screen pt-16" style={{ background: "#0B0F1A" }}>
      {/* Profile header */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0D1321, #111827)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <img src={user.avatar} alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover"
                style={{ border: "2px solid rgba(59,130,246,0.4)", boxShadow: "0 0 25px rgba(59,130,246,0.2)" }}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                style={{ border: "2px solid #0B0F1A" }}>
                <div className="w-2 h-2 rounded-full bg-green-300" />
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-white mb-1" style={{ fontFamily: "Rajdhani", fontWeight: 700 }}>{user.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Mail size={13} />
                  {user.email}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar size={13} />
                  Joined {joinDate}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Stats */}
              <div className="flex gap-4">
                <div className="text-center px-4 py-2 rounded-xl"
                  style={{ background: "rgba(30,42,59,0.5)", border: "1px solid rgba(59,130,246,0.15)" }}>
                  <p className="text-white font-bold" style={{ fontFamily: "Orbitron" }}>{favoriteGames.length}</p>
                  <p className="text-slate-400 text-xs">Favorites</p>
                </div>
                <div className="text-center px-4 py-2 rounded-xl"
                  style={{ background: "rgba(30,42,59,0.5)", border: "1px solid rgba(59,130,246,0.15)" }}>
                  <p className="text-white font-bold" style={{ fontFamily: "Orbitron" }}>{recentlyViewed.length}</p>
                  <p className="text-slate-400 text-xs">Viewed</p>
                </div>
              </div>

              <button onClick={logout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 text-sm transition-all"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Favorites section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white flex items-center gap-2" style={{ fontFamily: "Rajdhani", fontWeight: 700 }}>
              <Heart size={18} className="text-red-400 fill-red-400" />
              My Favorites
            </h2>
            {favoriteGames.length > 0 && (
              <Link to="/favorites" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                View all →
              </Link>
            )}
          </div>

          {favoriteGames.length === 0 ? (
            <div className="py-12 text-center rounded-xl" style={{ background: "#111827", border: "1px solid rgba(59,130,246,0.1)" }}>
              <Heart size={28} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No favorites saved yet.</p>
              <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">Browse games →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {favoriteGames.slice(0, 5).map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
            </div>
          )}
        </section>

        {/* Recently Viewed */}
        <section>
          <h2 className="text-white flex items-center gap-2 mb-5" style={{ fontFamily: "Rajdhani", fontWeight: 700 }}>
            <Clock size={18} className="text-purple-400" />
            Recently Viewed
          </h2>

          {recentlyViewed.length === 0 ? (
            <div className="py-12 text-center rounded-xl" style={{ background: "#111827", border: "1px solid rgba(59,130,246,0.1)" }}>
              <Gamepad2 size={28} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">You haven't viewed any games yet.</p>
              <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">Explore games →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {recentlyViewed.slice(0, 10).map((g, i) => <GameCard key={`${g.id}-${i}`} game={g} index={i} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
