import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { toast } from "sonner";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, googleProvider } from "@/lib/firebase";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  showLoginModal: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "Player",
          email: firebaseUser.email || "",
          avatar: firebaseUser.photoURL || "",
          joinedAt: new Date().toISOString(),
        };

        setUser(userData);
        localStorage.setItem(
          "gamesync_user",
          JSON.stringify(userData)
        );
      } else {
        setUser(null);
        localStorage.removeItem("gamesync_user");
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      const firebaseUser = result.user;

      const userData: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "Player",
        email: firebaseUser.email || "",
        avatar: firebaseUser.photoURL || "",
        joinedAt: new Date().toISOString(),
      };

      setUser(userData);

      localStorage.setItem(
        "gamesync_user",
        JSON.stringify(userData)
      );

      setShowLoginModal(false);

      toast.success(
        `Welcome back, ${
          userData.name.split(" ")[0]
        }! 🎮`
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Google sign in failed. Please try again."
      );
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);

      setUser(null);

      localStorage.removeItem("gamesync_user");
      localStorage.removeItem("gamesync_favorites");

      toast.info(
        "Signed out. See you in the next session!"
      );
    } catch {
      toast.error("Logout failed");
    }
  };

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        showLoginModal,
        login,
        logout,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}