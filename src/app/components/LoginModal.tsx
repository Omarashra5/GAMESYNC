import { useState } from "react";
import { X, Gamepad2, Shield, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

export function LoginModal() {
  const { showLoginModal, closeLoginModal, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleGoogleClick = async () => {
    try {
      setLoading(true);
      await login();
    } finally {
      setLoading(false);
    }
  };


  const handleClose = () => {
    closeLoginModal();
  };

  if (!showLoginModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(7, 10, 20, 0.92)" }}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0D1321 0%, #111827 100%)",
            border: "1px solid rgba(59,130,246,0.3)",
            boxShadow: "0 0 60px rgba(59,130,246,0.15), 0 0 120px rgba(139,92,246,0.08)",
          }}
        >
          {/* Decorative top bar */}
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #3B82F6, #8B5CF6, #06B6D4)" }} />

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8">
            {!loading && (
              <>
                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
                    >
                      <Gamepad2 size={22} className="text-white" />
                    </div>
                    <span className="font-orbitron text-white" style={{ fontSize: "1.25rem", letterSpacing: "0.05em" }}>
                      GAME<span className="neon-text-blue">SYNC</span>
                    </span>
                  </div>
                </div>

                <h2 className="text-center text-white mb-2" style={{ fontFamily: "Rajdhani", fontSize: "1.75rem", fontWeight: 700 }}>
                  Enter the Arena
                </h2>
                <p className="text-center text-slate-400 text-sm mb-8">
                  Sign in to save favorites, track games, and personalize your experience
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {[
                    { icon: Shield, text: "Secure Google authentication", color: "#3B82F6" },
                    { icon: Zap, text: "Instant access to your favorites", color: "#8B5CF6" },
                    { icon: Gamepad2, text: "Personalized game recommendations", color: "#06B6D4" },
                  ].map(({ icon: Icon, text, color }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                        <Icon size={16} style={{ color }} />
                      </div>
                      <span className="text-slate-300 text-sm">{text}</span>
                    </div>
                  ))}
                </div>

                {/* Google Button */}
                <button
                  onClick={handleGoogleClick}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-medium text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))",
                    border: "1px solid rgba(59,130,246,0.4)",
                    boxShadow: "0 0 20px rgba(59,130,246,0.1)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    ...
                  </svg>
                  Continue with Google
                </button>
                {loading && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-300 mt-4">
                      Connecting to Google...
                    </p>
                  </div>
                )}
                <p className="text-center text-slate-600 text-xs mt-4">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
