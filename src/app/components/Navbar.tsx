import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Gamepad2, Search, Heart, User, LogOut, ChevronDown, Menu, X, Shuffle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useGames } from "../context/GamesContext";
import { motion, AnimatePresence } from "motion/react";
export function Navbar() {
  const { user, logout, openLoginModal } = useAuth();

  const { setSearch, searchQuery, getRandomGame } = useGames();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleRandom = () => {
    const game = getRandomGame();
    if (game) navigate(`/game/${game.id}`);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 h-16"
      style={{
        background: "rgba(11, 15, 26, 0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(59,130,246,0.15)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
          >
            <Gamepad2 size={18} className="text-white" />
          </div>
          <span className="font-orbitron text-white hidden sm:block" style={{ fontSize: "1rem", letterSpacing: "0.05em" }}>
            GAME<span className="neon-text-blue">SYNC</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className={`flex-1 max-w-md relative transition-all duration-300 ${searchFocused ? "max-w-lg" : ""}`}>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300"
            style={{
              background: searchFocused ? "rgba(30,42,59,0.9)" : "rgba(30,42,59,0.5)",
              border: searchFocused ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(59,130,246,0.15)",
              boxShadow: searchFocused ? "0 0 15px rgba(59,130,246,0.15)" : "none",
            }}
          >
            <Search size={16} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearch("")} className="text-slate-400 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={handleRandom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white text-sm transition-all duration-200 hover:bg-blue-500/10"
          >
            <Shuffle size={14} />
            <span>Random</span>
          </button>

          {user && (
            <Link
              to="/favorites"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white text-sm transition-all duration-200 hover:bg-purple-500/10"
            >
              <Heart size={14} />
              <span>Favorites</span>
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3 ml-auto">
          {user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200"
                style={{
                  background: profileOpen ? "rgba(59,130,246,0.15)" : "rgba(30,42,59,0.5)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                <span className="text-white text-sm hidden sm:block">{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden z-50"
                    style={{
                      background: "#111827",
                      border: "1px solid rgba(59,130,246,0.2)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.1)",
                    }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
                      <p className="text-white text-sm font-medium">{user.name}</p>
                      <p className="text-slate-400 text-xs">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-blue-500/10 text-sm transition-all duration-200"
                      >
                        <User size={14} />
                        My Profile
                      </Link>
                      <Link
                        to="/favorites"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-purple-500/10 text-sm transition-all duration-200"
                      >
                        <Heart size={14} />
                        Favorites
                      </Link>
                      <div style={{ borderTop: "1px solid rgba(59,130,246,0.1)" }} className="mt-1 pt-1">
                        <button
                          onClick={() => { logout(); setProfileOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-all duration-200"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="px-4 py-1.5 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                boxShadow: "0 0 15px rgba(59,130,246,0.3)",
              }}
            >
              Sign In
            </button>
          )}
          
          {/* Mobile menu */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-1"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: "#0D1321", borderBottom: "1px solid rgba(59,130,246,0.15)" }}
          >
            <div className="px-4 py-3 space-y-1">
              <button onClick={() => { handleRandom(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white text-sm hover:bg-blue-500/10 transition-all">
                <Shuffle size={14} /> Random Game
              </button>
              {user && (
                <>
                  <Link to="/favorites" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white text-sm hover:bg-purple-500/10 transition-all">
                    <Heart size={14} /> Favorites
                  </Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white text-sm hover:bg-blue-500/10 transition-all">
                    <User size={14} /> Profile
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
