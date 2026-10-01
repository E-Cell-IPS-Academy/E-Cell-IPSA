"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Rocket } from "lucide-react";

export const fieldClass =
  "w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors focus:border-purple-400/60 focus:bg-white/[0.07]";
export const labelClass = "block text-sm font-medium text-white/80 mb-2";


export function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

const FLOATERS = [
  { emoji: "🚀", left: "8%", top: "18%", size: 28, dur: 7, delay: 0 },
  { emoji: "✨", left: "88%", top: "14%", size: 24, dur: 6, delay: 1 },
  { emoji: "💡", left: "5%", top: "62%", size: 26, dur: 8, delay: 2 },
  { emoji: "🎤", left: "92%", top: "58%", size: 26, dur: 7.5, delay: 0.5 },
  { emoji: "⭐", left: "78%", top: "86%", size: 22, dur: 6.5, delay: 1.5 },
  { emoji: "🔥", left: "18%", top: "88%", size: 24, dur: 7, delay: 2.5 },
];

export function FloatingEmojis() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {FLOATERS.map((f) => (
        <motion.span
          key={f.emoji + f.left}
          className="absolute select-none opacity-30"
          style={{ left: f.left, top: f.top, fontSize: f.size }}
          animate={{ y: [0, -22, 0], rotate: [-8, 8, -8] }}
          transition={{
            duration: f.dur,
            delay: f.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {f.emoji}
        </motion.span>
      ))}
    </div>
  );
}

const CONFETTI_COLORS = ["#a855f7", "#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#ec4899"];

export function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 420,
      y: -(60 + Math.random() * 220),
      rotate: Math.random() * 720 - 360,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.15,
    }))
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-16 h-0 w-0" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block h-2.5 w-1.5 rounded-sm"
          style={{ backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 260], opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: 1.8, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function LaunchMeter({ filled, total }: { filled: number; total: number }) {
  const pct = Math.round((filled / total) * 100);
  const message =
    pct === 0
      ? "Warming up the engines…"
      : pct < 50
      ? "Fuelling up ⛽"
      : pct < 100
      ? "Almost ready for launch…"
      : "Ready for liftoff! 🚀";
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs text-white/60">
        <span>{message}</span>
        <span>{pct}%</span>
      </div>
      <div className="relative h-2 rounded-full bg-white/10">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        <motion.div
          className="absolute -top-2.5"
          animate={{ left: `calc(${pct}% - 12px)` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          <Rocket className="h-6 w-6 rotate-45 text-white drop-shadow-[0_0_6px_rgba(168,85,247,0.9)]" />
        </motion.div>
      </div>
    </div>
  );
}

const SPARKS = [
  { left: "42%", delay: 0.0, dur: 1.4, color: "#a855f7" },
  { left: "46%", delay: 0.3, dur: 1.2, color: "#3b82f6" },
  { left: "50%", delay: 0.1, dur: 1.6, color: "#f59e0b" },
  { left: "54%", delay: 0.5, dur: 1.3, color: "#ec4899" },
  { left: "58%", delay: 0.2, dur: 1.5, color: "#a855f7" },
  { left: "48%", delay: 0.7, dur: 1.2, color: "#f59e0b" },
  { left: "52%", delay: 0.9, dur: 1.4, color: "#3b82f6" },
];

/** Full-screen "ignition" splash shown each time the page loads/reloads. */
export function IgnitexSplash({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="ignitex-splash"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          aria-hidden
        >
          {/* rising sparks */}
          {SPARKS.map((sp, i) => (
            <motion.span
              key={i}
              className="absolute bottom-[38%] h-2 w-2 rounded-full"
              style={{ left: sp.left, backgroundColor: sp.color, boxShadow: `0 0 12px ${sp.color}` }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [-0, -220], opacity: [0, 1, 0], scale: [0.6, 1.2, 0.3] }}
              transition={{ duration: sp.dur, delay: sp.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}

          <div className="relative flex items-center justify-center">
            {/* ignition rings */}
            {[0, 0.6].map((d) => (
              <motion.span
                key={d}
                className="absolute h-40 w-40 rounded-full border-2 border-purple-400/50"
                initial={{ scale: 0.6, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 1.8, delay: d, repeat: Infinity, ease: "easeOut" }}
              />
            ))}
            <motion.div
              className="absolute h-44 w-44 rounded-full bg-purple-500/25 blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              src="/IgniteX.png"
              alt=""
              className="relative h-32 w-auto sm:h-40 drop-shadow-[0_0_28px_rgba(168,85,247,0.7)]"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.9, 1.05, 1], opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>

          <div className="mt-10 w-56 sm:w-72">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            </div>
            <motion.p
              className="mt-3 text-center text-xs tracking-[0.3em] text-white/60"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              IGNITING…
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
