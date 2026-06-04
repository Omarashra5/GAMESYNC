import { Link } from "react-router";
import { motion } from "motion/react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "#0B0F1A" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
        <p className="font-orbitron text-blue-400 mb-2" style={{ fontSize: "5rem", lineHeight: 1, fontWeight: 900 }}>404</p>
        <h2 className="text-white mb-3" style={{ fontFamily: "Rajdhani", fontWeight: 700 }}>Level Not Found</h2>
        <p className="text-slate-400 text-sm mb-8">The page you're looking for doesn't exist in this universe.</p>
        <Link to="/" className="px-6 py-3 rounded-xl text-white font-medium transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}>
          Return to Home Base
        </Link>
      </motion.div>
    </div>
  );
}
