import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const HiringPage: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Confetti particles
  const confettiParticles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    color: ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#14b8a6"][
      Math.floor(Math.random() * 6)
    ],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      {/* Animated Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {confettiParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: particle.color,
                  left: `${particle.x}%`,
                  top: "-10px",
                }}
                initial={{ y: -10, opacity: 1, rotate: 0 }}
                animate={{
                  y: "100vh",
                  opacity: 0,
                  rotate: 360,
                  x: Math.random() * 200 - 100,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: particle.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl text-center"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              type: "spring",
              stiffness: 200,
            }}
            className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div
              className="absolute inset-0 border-4 border-purple-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Title Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            <motion.span
              animate={{ color: ["#ffffff", "#a78bfa", "#ffffff"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Registration Closed!
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Thank you to all amazing applicants! We received an overwhelming
            response and are excited to begin the shortlisting process.
          </motion.p>

          {/* Timer Display (Showing 00:00:00) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 text-sm font-semibold">
                Registration Time Remaining
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
              {[
                { label: "Days", value: "00" },
                { label: "Hours", value: "00" },
                { label: "Minutes", value: "00" },
                { label: "Seconds", value: "00" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1 + index * 0.1, type: "spring" }}
                  className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl p-4"
                >
                  <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-1">
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-5">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-purple-400 font-semibold text-lg">
                  Shortlisting
                </span>
              </div>
              <p className="text-white font-bold text-xl">Starting Soon</p>
              <p className="text-gray-400 text-sm mt-1">
                Our team is reviewing all applications
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-5">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-blue-400 font-semibold text-lg">
                  Next Steps
                </span>
              </div>
              <p className="text-white font-bold text-xl">Stay Tuned</p>
              <p className="text-gray-400 text-sm mt-1">
                Selected candidates will be contacted soon
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HiringPage;
