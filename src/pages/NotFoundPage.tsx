import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

// ─── Google Fonts ─────────────────────────────────────────────
// NUMBER  → "Cormorant Garamond" 300 — the giant "404"
// DISPLAY → "Instrument Serif"       — "Page Not Found" heading
// BODY    → "Outfit" 300             — description & button labels
function useFonts() {
  useEffect(() => {
    if (document.getElementById("404-fonts")) return;
    const link = document.createElement("link");
    link.id = "404-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400&display=swap";
    document.head.appendChild(link);
  }, []);
}

const NotFoundPage: React.FC = () => {
  useFonts();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        {/* 404 — Cormorant Garamond, plain white/gray, no purple gradient */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontSize: "clamp(6rem, 20vw, 10rem)",
            lineHeight: 1,
            color: "rgba(255,255,255,0.12)",
            letterSpacing: "-0.04em",
          }}
        >
          404
        </motion.div>

        {/* Heading — Instrument Serif */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
            letterSpacing: "-0.02em",
            color: "rgba(255,255,255,0.75)",
            marginTop: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          Page Not Found
        </motion.h1>

        {/* Description — Outfit 300 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(0.78rem, 1.2vw, 0.9rem)",
            color: "rgba(255,255,255,0.32)",
            lineHeight: 1.75,
            marginBottom: "2rem",
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Buttons — Outfit 300, plain invert — no purple */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 justify-center"
        >
          <Link
            to="/"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 300,
              fontSize: "0.82rem",
              letterSpacing: "0.02em",
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl hover:bg-white/90 transition-all duration-300"
          >
            <Home size={15} />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 300,
              fontSize: "0.82rem",
              letterSpacing: "0.02em",
              color: "rgba(255,255,255,0.55)",
            }}
            className="flex items-center gap-2 px-6 py-3 border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-300"
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
