import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const RegistrationClosed: React.FC = () => {
  const [timeDisplay, setTimeDisplay] = useState("00:00:00");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Set time to 00:00:00 immediately to show registration ended
    setTimeDisplay("00:00:00");

    // Trigger confetti animation after component loads
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Confetti particles
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    color: ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"][
      Math.floor(Math.random() * 5)
    ],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-red-500/10 rounded-full blur-xl animate-pulse delay-500" />
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
                  y: window.innerHeight + 10,
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
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl text-center">
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
            className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="w-10 h-10 text-white" />
            </motion.div>

            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 border-4 border-red-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Title Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-4xl font-bold text-white mb-4"
          >
            <motion.span
              animate={{ color: ["#ffffff", "#ef4444", "#ffffff"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Registration Closed
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-gray-400 text-lg mb-8"
          >
            VyapaarX 2.0 - E-Cell IPSA Pitching Competition
          </motion.p>

          {/* Stopwatch Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="bg-black/30 border border-white/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold text-white">
                Registration Timer
              </h2>
            </div>

            <motion.div
              className="text-6xl font-mono font-bold mb-2"
              animate={{ color: ["#ef4444", "#dc2626", "#ef4444"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {timeDisplay}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-red-400 font-semibold text-lg"
            >
              Time Ended
            </motion.p>
          </motion.div>

          {/* Status Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <X className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-semibold">Registration</span>
              </div>
              <p className="text-white font-bold">CLOSED</p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Status</span>
              </div>
              <p className="text-white font-bold">ENDED</p>
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-3">Thank You!</h3>
            <p className="text-gray-300 leading-relaxed">
              Thank you for your interest in VyapaarX 2.0. The registration
              period has ended. We received an overwhelming response and are
              excited to see the innovation from our participants.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RegistrationClosed;
