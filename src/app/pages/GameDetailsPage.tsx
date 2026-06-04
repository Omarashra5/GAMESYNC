import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Heart, ExternalLink, Monitor, Globe, Calendar, Building2, User2, Tag, Star, Shield, Cpu, HardDrive, MemoryStick } from "lucide-react";
import { useGames, Game, GameDetails } from "../context/GamesContext";
import { useAuth } from "../context/AuthContext";
import { GameCard, SkeletonCard } from "../components/GameCard";
import { motion } from "framer-motion";
export default function GameDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { games, toggleFavorite, isFavorite, addToRecent } = useGames();
  const { user, openLoginModal } = useAuth();
  const [details, setDetails] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

  const game = games.find(g => g.id === Number(id));

  useEffect(() => {
    setLoading(true);
    setDetails(null);
    setImgLoaded(false);

    const fetchDetails = async () => {
      try {
        const res = await fetch(`https://www.freetogame.com/api/game?id=${id}`, {
          signal: AbortSignal.timeout(6000),
        });
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setDetails(data);
        if (data) {
          const g: Game = {
            id: data.id,
            title: data.title,
            thumbnail: data.thumbnail,
            short_description: data.short_description,
            game_url: data.game_url,
            genre: data.genre,
            platform: data.platform,
            publisher: data.publisher,
            developer: data.developer,
            release_date: data.release_date,
            freetogame_profile_url: data.freetogame_profile_url,
          };
          addToRecent(g);
        }
      } catch {
        if (game) {
          setDetails({
            ...game,
            description: game.short_description + "\n\nThis is a free-to-play game with regularly updated content, seasonal events, and a thriving community. Players can enjoy the full experience without spending money, with optional cosmetic items available for purchase.",
            screenshots: [],
          });
          addToRecent(game);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const similarGames = games.filter(g => g.id !== Number(id) && (game ? g.genre === game.genre : true)).slice(0, 5);

  const handleFav = () => {
    if (!user) { openLoginModal(); return; }
    toggleFavorite(Number(id));
  };

  const fav = isFavorite(Number(id));
  const isPC = details?.platform.toLowerCase().includes("windows") || details?.platform.toLowerCase().includes("pc");

  if (!loading && !details && !game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0B0F1A" }}>
        <div className="text-6xl">😔</div>
        <h2 className="text-white" style={{ fontFamily: "Rajdhani" }}>Game not found</h2>
        <Link to="/" className="px-4 py-2 rounded-lg text-blue-400 hover:text-blue-300 text-sm">← Back to Home</Link>
      </div>
    );
  }

  const d = details;

  return (
    <div className="min-h-screen pt-16 " style={{ background: "#000000" }}>
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 pt-2 mb-2">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="skeleton rounded-2xl" style={{ height: "400px" }} />
          <div className="space-y-3">
            <div className="skeleton h-8 rounded w-1/2" />
            <div className="skeleton h-4 rounded w-full" />
            <div className="skeleton h-4 rounded w-5/6" />
          </div>
        </div>
      ) : d ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          {/* Hero Image */}
          <div className="relative w-full overflow-hidden" style={{ height: "400px" }}>
            {d.screenshots?.[0]?.image ? (
              <img
                src={d.screenshots[0].image}
                alt={d.title}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImgLoaded(true)}
              />
            ) : (
              <img
                src={d.thumbnail}
                alt={d.title}
                className="w-full h-full object-cover"
                style={{ filter: "blur(2px) brightness(0.6)", transform: "scale(1.05)" }}
              />
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0B0F1A 10%, rgba(11,15,26,0.3) 60%)" }} />

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 pb-8">
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-xs"
                      style={{ background: "rgba(59,130,246,0.2)", color: "#3B82F6", border: "1px solid rgba(59,130,246,0.3)" }}>
                      {d.genre}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-xs">
                      {isPC ? <Monitor size={12} /> : <Globe size={12} />}
                      {isPC ? "PC" : "Browser"}
                    </span>
                  </div>
                  <h1 className="text-white" style={{ fontFamily: "Rajdhani", fontWeight: 700 }}>{d.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleFav}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all hover:scale-105"
                    style={{
                      background: fav ? "rgba(239,68,68,0.2)" : "rgba(30,42,59,0.8)",
                      border: fav ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(59,130,246,0.2)",
                      color: fav ? "#EF4444" : "#94A3B8",
                    }}>
                    <Heart size={16} className={fav ? "fill-red-400" : ""} />
                    {fav ? "Saved" : "Save"}
                  </button>
                  <a href={d.game_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", boxShadow: "0 0 20px rgba(59,130,246,0.4)" }}>
                    <ExternalLink size={16} />
                    Play Free Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div className="rounded-xl p-6" style={{ background: "#111827", border: "1px solid rgba(59,130,246,0.1)" }}>
                  <h3 className="text-white mb-4 flex items-center gap-2" style={{ fontFamily: "Rajdhani" }}>
                    <Star size={16} className="text-blue-400" /> About This Game
                  </h3>
                  <div className="text-slate-300 leading-relaxed text-sm space-y-3">
                    {d.description?.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>

                {/* Screenshots */}
                {d.screenshots && d.screenshots.length > 0 && (
                  <div className="rounded-xl p-6" style={{ background: "#111827", border: "1px solid rgba(59,130,246,0.1)" }}>
                    <h3 className="text-white mb-4" style={{ fontFamily: "Rajdhani" }}>Screenshots</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {d.screenshots.slice(0, 4).map(s => (
                        <img key={s.id} src={s.image} alt="Screenshot" className="rounded-lg w-full object-cover"
                          style={{ aspectRatio: "16/9" }} />
                      ))}
                    </div>
                  </div>
                )}

                {/* System requirements */}
                {d.minimum_system_requirements && (
                  <div className="rounded-xl p-6" style={{ background: "#111827", border: "1px solid rgba(59,130,246,0.1)" }}>
                    <h3 className="text-white mb-4 flex items-center gap-2" style={{ fontFamily: "Rajdhani" }}>
                      <Shield size={16} className="text-purple-400" /> System Requirements
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { icon: Monitor, label: "OS", value: d.minimum_system_requirements.os },
                        { icon: Cpu, label: "Processor", value: d.minimum_system_requirements.processor },
                        { icon: MemoryStick, label: "Memory", value: d.minimum_system_requirements.memory },
                        { icon: Monitor, label: "Graphics", value: d.minimum_system_requirements.graphics },
                        { icon: HardDrive, label: "Storage", value: d.minimum_system_requirements.storage },
                      ].filter(i => i.value).map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-3 p-3 rounded-lg"
                          style={{ background: "rgba(30,42,59,0.4)" }}>
                          <Icon size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-slate-500 text-xs">{label}</p>
                            <p className="text-slate-200 text-sm">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Game info */}
                <div className="rounded-xl p-5" style={{ background: "#111827", border: "1px solid rgba(59,130,246,0.1)" }}>
                  <h3 className="text-white mb-4" style={{ fontFamily: "Rajdhani" }}>Game Info</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Tag, label: "Genre", value: d.genre },
                      { icon: Monitor, label: "Platform", value: d.platform },
                      { icon: Building2, label: "Publisher", value: d.publisher },
                      { icon: User2, label: "Developer", value: d.developer },
                      { icon: Calendar, label: "Released", value: new Date(d.release_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3">
                        <Icon size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-slate-500 text-xs">{label}</p>
                          <p className="text-slate-200 text-sm">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(59,130,246,0.1)" }}>
                  <img src={d.thumbnail} alt={d.title} className="w-full object-cover" />
                </div>
              </div>
            </div>

            {/* Similar games */}
            {similarGames.length > 0 && (
              <div className="mt-12">
                <h2 className="text-white mb-6 flex items-center gap-2" style={{ fontFamily: "Rajdhani", fontWeight: 700 }}>
                  <Tag size={18} className="text-purple-400" />
                  Similar Games — {d.genre}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {similarGames.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
