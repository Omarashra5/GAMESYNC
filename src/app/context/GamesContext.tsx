import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export interface Game {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url: string;
}

export interface GameDetails extends Game {
  description: string;
  minimum_system_requirements?: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
  screenshots: { id: number; image: string }[];
}

type FilterType = "all" | "pc" | "browser" | "mmorpg";

interface GamesContextType {
  games: Game[];
  filteredGames: Game[];
  isLoading: boolean;
  error: string | null;
  activeFilter: FilterType;
  searchQuery: string;
  favorites: number[];
  recentlyViewed: Game[];
  setFilter: (f: FilterType) => void;
  setSearch: (q: string) => void;
  toggleFavorite: (gameId: number) => void;
  isFavorite: (gameId: number) => boolean;
  addToRecent: (game: Game) => void;
  getRandomGame: () => Game | null;
}

const GamesContext = createContext<GamesContextType | null>(null);

const API_BASE = "https://www.freetogame.com/api";

const FALLBACK_GAMES: Game[] = [
  { id: 1, title: "Dauntless", thumbnail: "https://www.freetogame.com/g/1/thumbnail.jpg", short_description: "A free-to-play action RPG with cooperative monster hunting gameplay.", game_url: "https://www.freetogame.com/open/dauntless", genre: "MMORPG", platform: "PC (Windows)", publisher: "Phoenix Labs", developer: "Phoenix Labs", release_date: "2019-05-21", freetogame_profile_url: "https://www.freetogame.com/dauntless" },
  { id: 2, title: "Warframe", thumbnail: "https://www.freetogame.com/g/2/thumbnail.jpg", short_description: "Warframe is a cooperative free-to-play online action game.", game_url: "https://www.freetogame.com/open/warframe", genre: "Shooter", platform: "PC (Windows)", publisher: "Digital Extremes", developer: "Digital Extremes", release_date: "2013-03-25", freetogame_profile_url: "https://www.freetogame.com/warframe" },
  { id: 3, title: "World of Tanks", thumbnail: "https://www.freetogame.com/g/3/thumbnail.jpg", short_description: "Massively multiplayer online game featuring 20th century armored vehicles.", game_url: "https://www.freetogame.com/open/world-of-tanks", genre: "Shooter", platform: "PC (Windows)", publisher: "Wargaming", developer: "Wargaming", release_date: "2011-04-12", freetogame_profile_url: "https://www.freetogame.com/world-of-tanks" },
  { id: 4, title: "Crossfire", thumbnail: "https://www.freetogame.com/g/4/thumbnail.jpg", short_description: "A military-themed online first-person shooter.", game_url: "https://www.freetogame.com/open/crossfire", genre: "Shooter", platform: "PC (Windows)", publisher: "Smilegate", developer: "Smilegate", release_date: "2007-05-19", freetogame_profile_url: "https://www.freetogame.com/crossfire" },
  { id: 5, title: "Enlisted", thumbnail: "https://www.freetogame.com/g/5/thumbnail.jpg", short_description: "A squad-based MMO shooter covering battles of World War II.", game_url: "https://www.freetogame.com/open/enlisted", genre: "Shooter", platform: "PC (Windows)", publisher: "Gaijin Entertainment", developer: "Darkflow Software", release_date: "2021-04-08", freetogame_profile_url: "https://www.freetogame.com/enlisted" },
  { id: 6, title: "Forge of Empires", thumbnail: "https://www.freetogame.com/g/6/thumbnail.jpg", short_description: "Build your city and develop it from Stone Age to modern era.", game_url: "https://www.freetogame.com/open/forge-of-empires", genre: "Strategy", platform: "Web Browser", publisher: "InnoGames", developer: "InnoGames", release_date: "2012-04-17", freetogame_profile_url: "https://www.freetogame.com/forge-of-empires" },
  { id: 7, title: "Smite", thumbnail: "https://www.freetogame.com/g/7/thumbnail.jpg", short_description: "SMITE is the online battleground of the gods.", game_url: "https://www.freetogame.com/open/smite", genre: "MOBA", platform: "PC (Windows)", publisher: "Hi-Rez Studios", developer: "Hi-Rez Studios", release_date: "2014-03-25", freetogame_profile_url: "https://www.freetogame.com/smite" },
  { id: 8, title: "Paladins", thumbnail: "https://www.freetogame.com/g/8/thumbnail.jpg", short_description: "A team-based action shooter with strategy elements.", game_url: "https://www.freetogame.com/open/paladins", genre: "Shooter", platform: "PC (Windows)", publisher: "Hi-Rez Studios", developer: "Hi-Rez Studios", release_date: "2018-05-08", freetogame_profile_url: "https://www.freetogame.com/paladins" },
];

export function GamesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Game[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("gamesync_favorites");
    if (stored) {
      try { setFavorites(JSON.parse(stored)); } catch { /* ignore */ }
    }
    const storedRecent = localStorage.getItem("gamesync_recent");
    if (storedRecent) {
      try { setRecentlyViewed(JSON.parse(storedRecent)); } catch { /* ignore */ }
    }
  }, []);

  const fetchGames = useCallback(async (filter: FilterType) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `${API_BASE}/games`;
      if (filter === "pc") url = `${API_BASE}/games?platform=pc`;
      else if (filter === "browser") url = `${API_BASE}/games?platform=browser`;
      else if (filter === "mmorpg") url = `${API_BASE}/games?category=mmorpg`;

      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      setGames(Array.isArray(data) ? data : FALLBACK_GAMES);
    } catch {
      setGames(FALLBACK_GAMES);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchGames(activeFilter); }, [activeFilter, fetchGames]);

  const filteredGames = games.filter(g =>
    searchQuery.trim() === "" ||
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (gameId: number) => {
    if (!user) {
      toast.error("Sign in to save favorites!");
      return;
    }
    setFavorites(prev => {
      const updated = prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId];
      localStorage.setItem("gamesync_favorites", JSON.stringify(updated));
      if (prev.includes(gameId)) toast.info("Removed from favorites");
      else toast.success("Added to favorites! ❤️");
      return updated;
    });
  };

  const isFavorite = (gameId: number) => favorites.includes(gameId);

  const addToRecent = (game: Game) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(g => g.id !== game.id);
      const updated = [game, ...filtered].slice(0, 10);
      localStorage.setItem("gamesync_recent", JSON.stringify(updated));
      return updated;
    });
  };

  const getRandomGame = () => {
    if (games.length === 0) return null;
    return games[Math.floor(Math.random() * games.length)];
  };

  return (
    <GamesContext.Provider value={{
      games, filteredGames, isLoading, error, activeFilter, searchQuery,
      favorites, recentlyViewed,
      setFilter: setActiveFilter, setSearch: setSearchQuery,
      toggleFavorite, isFavorite, addToRecent, getRandomGame,
    }}>
      {children}
    </GamesContext.Provider>
  );
}

export function useGames() {
  const ctx = useContext(GamesContext);
  if (!ctx) throw new Error("useGames must be used within GamesProvider");
  return ctx;
}
