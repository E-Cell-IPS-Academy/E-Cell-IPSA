import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Users,
  Linkedin,
  Instagram,
  Mail,
  Loader,
  Crown,
  Sparkles,
  UserCircle,
  Github,
  Twitter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Globe,
  Activity,
  Layers,
  Award,
  Briefcase,
  Code,
  Cpu,
  Database,
  Megaphone,
  Palette,
  PenTool,
  Rocket,
  Target,
  TrendingUp,
  Zap,
  Heart,
  Music,
  Camera,
  BookOpen,
  FileText,
  Settings,
  Wrench,
  Lightbulb,
  Flag,
  Star,
  Shield,
} from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { useTheme } from "../context/ThemeContext";

// ─── Fonts ────────────────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    if (document.getElementById("team-fonts")) return;
    const link = document.createElement("link");
    link.id = "team-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400&family=Outfit:wght@300;400&display=swap";
    document.head.appendChild(link);
  }, []);
}

const F = {
  display: "'Instrument Serif', Georgia, serif",
  mono: "'DM Mono', monospace",
  body: "'Outfit', sans-serif",
};

// ─── Icon Registry (mirrors admin ICON_MAP exactly) ───────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Crown,
  Star,
  Shield,
  Award,
  Briefcase,
  Code,
  Cpu,
  Database,
  Megaphone,
  Palette,
  PenTool,
  Rocket,
  Target,
  TrendingUp,
  Zap,
  Heart,
  Music,
  Camera,
  BookOpen,
  FileText,
  Settings,
  Wrench,
  Lightbulb,
  Flag,
  Globe,
  Activity,
  Sparkles,
  Layers,
};
const DynamicIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className,
}) => {
  const Icon = ICON_MAP[name] || Users;
  return <Icon className={className} />;
};

// ─── Types — field names EXACTLY match admin's Firestore schema ───────────────
interface TeamCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  order: number;
}

interface TeamMember {
  id: string;
  name: string;
  position: string; // admin writes "position"
  category: string; // stores category ID
  isLead: boolean;
  photo: string; // admin writes "photo"
  photoPublicId: string;
  bio: string;
  email: string;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    github?: string;
    twitter?: string;
  };
  order: number;
  isActive: boolean;
}

// ─── Floating particle ────────────────────────────────────────────────────────
const FloatingParticle: React.FC<{
  delay: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  color: string;
}> = ({ delay, size, x, y, duration, color }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      background: color,
      filter: `blur(${size > 5 ? 1 : 0}px)`,
    }}
    animate={{
      y: [0, -28, 0, 18, 0],
      x: [0, 14, -9, 7, 0],
      opacity: [0.1, 0.38, 0.12, 0.32, 0.1],
    }}
    transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

// ─── Section reveal wrapper ───────────────────────────────────────────────────
const SectionReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ─── Member Card ──────────────────────────────────────────────────────────────
const TeamMemberCard: React.FC<{
  member: TeamMember;
  categoryName: string;
  index: number;
  isDark: boolean;
  onClick: () => void;
}> = ({ member, categoryName, index, isDark, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.48, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className={`group relative cursor-pointer backdrop-blur-md border rounded-2xl overflow-hidden
        transition-all duration-300
        ${
          isDark
            ? "border-white/8 hover:border-white/18 bg-white/[0.04] hover:bg-white/[0.07]"
            : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/80"
        }`}
      style={{
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.28)"
          : "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* Hover hint */}
      <div
        className={`absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity
        flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-sm border
        ${isDark ? "bg-white/8 border-white/10 text-white/45" : "bg-black/4 border-gray-200 text-gray-400"}`}
        style={{ fontFamily: F.mono, fontSize: "7px", letterSpacing: "0.12em" }}
      >
        <ArrowUpRight className="w-2.5 h-2.5" /> VIEW
      </div>

      {/* Lead badge */}
      {member.isLead && (
        <motion.div
          className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 bg-amber-500/90 rounded-full"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{
            delay: index * 0.06 + 0.26,
            type: "spring",
            stiffness: 260,
          }}
        >
          <Crown className="w-2.5 h-2.5 text-white" />
          <span
            style={{
              fontFamily: F.mono,
              fontSize: "7px",
              letterSpacing: "0.12em",
              color: "white",
            }}
          >
            LEAD
          </span>
        </motion.div>
      )}

      {/* Avatar */}
      <div className="pt-8 px-8 flex justify-center">
        <div className="relative">
          <div
            className={`absolute -inset-1 rounded-full blur-sm transition-opacity duration-300
            ${isDark ? "bg-white/8 group-hover:bg-white/18" : "bg-black/4 group-hover:bg-black/8"}`}
          />
          <div
            className={`relative w-24 h-24 rounded-full overflow-hidden border-2
            ${isDark ? "border-black" : "border-white"}`}
          >
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-2xl font-semibold
                ${isDark ? "bg-white/8 text-white/30" : "bg-gray-100 text-gray-300"}`}
                style={{ fontFamily: F.display }}
              >
                {member.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 pt-4 text-center">
        <h3
          style={{
            fontFamily: F.body,
            fontWeight: 400,
            fontSize: "0.87rem",
            color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.82)",
            marginBottom: "0.2rem",
          }}
        >
          {member.name}
        </h3>
        <p
          style={{
            fontFamily: F.body,
            fontWeight: 300,
            fontSize: "0.72rem",
            color: isDark ? "rgba(255,255,255,0.44)" : "rgba(0,0,0,0.44)",
            marginBottom: "0.25rem",
          }}
        >
          {member.position}
        </p>
        <p
          style={{
            fontFamily: F.mono,
            fontSize: "7px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.24)",
            marginBottom: "0.9rem",
          }}
        >
          {categoryName}
        </p>

        {/* Social icons */}
        <div
          className={`flex items-center justify-center gap-2 pt-3 border-t
          ${isDark ? "border-white/5" : "border-gray-100"}`}
        >
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              onClick={(e) => e.stopPropagation()}
              className={`p-1.5 rounded-lg transition-all
                ${
                  isDark
                    ? "text-white/25 hover:text-white/70 hover:bg-white/8"
                    : "text-gray-300 hover:text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Mail className="w-3 h-3" />
            </a>
          )}
          {member.socialLinks?.linkedin && (
            <a
              href={member.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`p-1.5 rounded-lg transition-all
                ${
                  isDark
                    ? "text-white/25 hover:text-blue-400 hover:bg-blue-500/10"
                    : "text-gray-300 hover:text-blue-600 hover:bg-blue-50"
                }`}
            >
              <Linkedin className="w-3 h-3" />
            </a>
          )}
          {member.socialLinks?.github && (
            <a
              href={member.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`p-1.5 rounded-lg transition-all
                ${
                  isDark
                    ? "text-white/25 hover:text-white/80 hover:bg-white/8"
                    : "text-gray-300 hover:text-gray-800 hover:bg-gray-100"
                }`}
            >
              <Github className="w-3 h-3" />
            </a>
          )}
          {member.socialLinks?.instagram && (
            <a
              href={member.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`p-1.5 rounded-lg transition-all
                ${
                  isDark
                    ? "text-white/25 hover:text-pink-400 hover:bg-pink-500/10"
                    : "text-gray-300 hover:text-pink-500 hover:bg-pink-50"
                }`}
            >
              <Instagram className="w-3 h-3" />
            </a>
          )}
          {member.socialLinks?.twitter && (
            <a
              href={member.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`p-1.5 rounded-lg transition-all
                ${
                  isDark
                    ? "text-white/25 hover:text-sky-400 hover:bg-sky-500/10"
                    : "text-gray-300 hover:text-sky-500 hover:bg-sky-50"
                }`}
            >
              <Twitter className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Carousel Modal ───────────────────────────────────────────────────────────
const CarouselModal: React.FC<{
  members: TeamMember[];
  initialIndex: number;
  getCategoryName: (id: string) => string;
  getCategoryIcon: (id: string) => string;
  isDark: boolean;
  onClose: () => void;
}> = ({
  members,
  initialIndex,
  getCategoryName,
  getCategoryIcon,
  isDark,
  onClose,
}) => {
  const [current, setCurrent] = useState(initialIndex);
  const [direction, setDirection] = useState<1 | -1>(1);
  const member = members[current];

  const goTo = useCallback((idx: number, dir: 1 | -1) => {
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1, -1);
  }, [current, goTo]);
  const next = useCallback(() => {
    if (current < members.length - 1) goTo(current + 1, 1);
  }, [current, members.length, goTo]);

  // Keyboard + body scroll lock
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [prev, next, onClose]);

  // Swipe support
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  const variants = {
    enter: (d: number) => ({ x: d * 72, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d * -72, opacity: 0, scale: 0.97 }),
  };

  const hasSocials =
    member.email ||
    member.socialLinks?.linkedin ||
    member.socialLinks?.github ||
    member.socialLinks?.instagram ||
    member.socialLinks?.twitter;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{
        backdropFilter: "blur(18px)",
        background: isDark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.55)",
      }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Panel */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 28 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 28 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className={`relative w-full max-w-xl rounded-3xl overflow-hidden border shadow-2xl
          ${isDark ? "bg-[#0d0d10] border-white/10" : "bg-white border-gray-200"}`}
        style={{ maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar: dots + close */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 pt-4">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {members.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={`rounded-full transition-all duration-300
                  ${
                    i === current
                      ? isDark
                        ? "w-5 h-1.5 bg-white/65"
                        : "w-5 h-1.5 bg-black/55"
                      : isDark
                        ? "w-1.5 h-1.5 bg-white/18 hover:bg-white/35"
                        : "w-1.5 h-1.5 bg-black/12 hover:bg-black/25"
                  }`}
              />
            ))}
          </div>

          {/* Counter + close */}
          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: F.mono,
                fontSize: "8px",
                letterSpacing: "0.14em",
                color: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.26)",
              }}
            >
              {current + 1} / {members.length}
            </span>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-all
                ${
                  isDark
                    ? "text-white/38 hover:text-white hover:bg-white/10"
                    : "text-gray-400 hover:text-gray-800 hover:bg-gray-100"
                }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable animated content */}
        <div className="overflow-y-auto" style={{ maxHeight: "88vh" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={member.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* ── Banner strip (no overflow-hidden so avatar is never clipped) ── */}
              <div className="relative" style={{ paddingTop: "3.5rem" }}>
                {/* Coloured banner behind avatar */}
                <div
                  className="absolute top-0 left-0 right-0 h-28 rounded-t-3xl"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.015) 100%)"
                      : "linear-gradient(135deg, #f4f4f6 0%, #ececee 100%)",
                  }}
                >
                  {/* Subtle decorative blobs inside the strip */}
                  <div
                    className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,255,255,0.12), transparent)",
                    }}
                  />
                  <div
                    className="absolute top-4 left-1/4 w-24 h-24 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,255,255,0.06), transparent)",
                    }}
                  />
                </div>

                {/* Avatar — sits on top of the strip, no clipping */}
                <div
                  className="relative z-10 flex justify-center"
                  style={{ paddingTop: "0.5rem" }}
                >
                  <div
                    className="relative"
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 20,
                      overflow: "hidden",
                      border: isDark
                        ? "3px solid #0d0d10"
                        : "3px solid #ffffff",
                      boxShadow: isDark
                        ? "0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)"
                        : "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                      flexShrink: 0,
                    }}
                  >
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: F.display,
                          fontSize: "2.2rem",
                          background: isDark
                            ? "rgba(255,255,255,0.08)"
                            : "#f0f0f2",
                          color: isDark
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(0,0,0,0.25)",
                        }}
                      >
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Name / badges row ── */}
              <div className="flex flex-col items-center px-7 pt-3 pb-1 text-center">
                {/* Lead + category pills */}
                <div className="flex items-center gap-2 mb-3 flex-wrap justify-center">
                  {member.isLead && (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/90 rounded-full"
                      style={{
                        fontFamily: F.mono,
                        fontSize: "7.5px",
                        letterSpacing: "0.12em",
                        color: "white",
                      }}
                    >
                      <Crown className="w-2.5 h-2.5" /> LEAD
                    </span>
                  )}
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border"
                    style={{
                      fontFamily: F.mono,
                      fontSize: "7.5px",
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      background: isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.04)",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.08)",
                      color: isDark
                        ? "rgba(255,255,255,0.44)"
                        : "rgba(0,0,0,0.44)",
                    }}
                  >
                    <DynamicIcon
                      name={getCategoryIcon(member.category)}
                      className="w-2.5 h-2.5"
                    />
                    {getCategoryName(member.category)}
                  </span>
                </div>

                {/* Name */}
                <h2
                  style={{
                    fontFamily: F.display,
                    fontWeight: 400,
                    fontSize: "1.65rem",
                    color: isDark
                      ? "rgba(255,255,255,0.92)"
                      : "rgba(0,0,0,0.88)",
                    lineHeight: 1.12,
                    marginBottom: "0.3rem",
                  }}
                >
                  {member.name}
                </h2>

                {/* Position */}
                <p
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "0.85rem",
                    color: isDark
                      ? "rgba(255,255,255,0.46)"
                      : "rgba(0,0,0,0.46)",
                    marginBottom: "0",
                  }}
                >
                  {member.position}
                </p>
              </div>

              {/* ── Divider ── */}
              <div
                className={`mx-7 mt-5 mb-5 h-px ${isDark ? "bg-white/6" : "bg-gray-100"}`}
              />

              {/* ── Bio ── */}
              <div className="px-7 pb-2">
                {member.bio ? (
                  <div
                    className={`p-4 rounded-2xl border
                    ${isDark ? "bg-white/[0.035] border-white/6" : "bg-gray-50 border-gray-100"}`}
                  >
                    <p
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.8rem",
                        lineHeight: 1.88,
                        color: isDark
                          ? "rgba(255,255,255,0.52)"
                          : "rgba(0,0,0,0.52)",
                      }}
                    >
                      {member.bio}
                    </p>
                  </div>
                ) : (
                  <p
                    style={{
                      fontFamily: F.body,
                      fontWeight: 300,
                      fontSize: "0.78rem",
                      color: isDark
                        ? "rgba(255,255,255,0.22)"
                        : "rgba(0,0,0,0.26)",
                      textAlign: "center",
                    }}
                  >
                    No bio available.
                  </p>
                )}
              </div>

              {/* ── Social links ── */}
              {hasSocials && (
                <div className="px-7 pt-4 pb-8 flex flex-wrap gap-2">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all
                        ${
                          isDark
                            ? "bg-white/[0.04] border-white/8 text-white/55 hover:text-white hover:bg-white/10"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.77rem",
                      }}
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </a>
                  )}
                  {member.socialLinks?.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all
                        ${
                          isDark
                            ? "bg-white/[0.04] border-white/8 text-white/55 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200"
                        }`}
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.77rem",
                      }}
                    >
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                  )}
                  {member.socialLinks?.github && (
                    <a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all
                        ${
                          isDark
                            ? "bg-white/[0.04] border-white/8 text-white/55 hover:text-white hover:bg-white/10"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.77rem",
                      }}
                    >
                      <Github className="w-3.5 h-3.5" /> GitHub
                    </a>
                  )}
                  {member.socialLinks?.instagram && (
                    <a
                      href={member.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all
                        ${
                          isDark
                            ? "bg-white/[0.04] border-white/8 text-white/55 hover:text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/20"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:text-pink-500 hover:bg-pink-50 hover:border-pink-200"
                        }`}
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.77rem",
                      }}
                    >
                      <Instagram className="w-3.5 h-3.5" /> Instagram
                    </a>
                  )}
                  {member.socialLinks?.twitter && (
                    <a
                      href={member.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all
                        ${
                          isDark
                            ? "bg-white/[0.04] border-white/8 text-white/55 hover:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/20"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:text-sky-500 hover:bg-sky-50 hover:border-sky-200"
                        }`}
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.77rem",
                      }}
                    >
                      <Twitter className="w-3.5 h-3.5" /> Twitter
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Prev arrow */}
        <button
          onClick={prev}
          disabled={current === 0}
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-xl border transition-all
            ${current === 0 ? "opacity-20 cursor-not-allowed" : ""}
            ${
              isDark
                ? "bg-white/6 border-white/10 text-white/55 hover:text-white hover:bg-white/14"
                : "bg-white border-gray-200 text-gray-400 hover:text-gray-800 shadow-sm"
            }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Next arrow */}
        <button
          onClick={next}
          disabled={current === members.length - 1}
          className={`absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-xl border transition-all
            ${current === members.length - 1 ? "opacity-20 cursor-not-allowed" : ""}
            ${
              isDark
                ? "bg-white/6 border-white/10 text-white/55 hover:text-white hover:bg-white/14"
                : "bg-white border-gray-200 text-gray-400 hover:text-gray-800 shadow-sm"
            }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const TeamPage: React.FC = () => {
  useFonts();
  const { isDark } = useTheme();

  const [categories, setCategories] = useState<TeamCategory[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [carousel, setCarousel] = useState<{
    members: TeamMember[];
    index: number;
  } | null>(null);

  // ── Fetch teamCategories + teamMembers ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [catSnap, memSnap] = await Promise.all([
          getDocs(
            query(collection(db, "teamCategories"), orderBy("order", "asc")),
          ),
          getDocs(
            query(collection(db, "teamMembers"), orderBy("order", "asc")),
          ),
        ]);
        setCategories(
          catSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as TeamCategory),
        );
        setMembers(
          memSnap.docs
            .map((d) => ({ id: d.id, ...d.data() }) as TeamMember)
            .filter((m) => m.isActive !== false), // only active members
        );
      } catch (err) {
        console.error("TeamPage: fetch error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Lookup helpers ──────────────────────────────────────────────────────────
  const getCategoryName = useCallback(
    (id: string) => categories.find((c) => c.id === id)?.name || "Team",
    [categories],
  );

  const getCategoryIcon = useCallback(
    (id: string) => categories.find((c) => c.id === id)?.icon || "Users",
    [categories],
  );

  // ── Sorted filtered list ────────────────────────────────────────────────────
  const filteredMembers = useMemo(() => {
    const list =
      activeCategory === "all"
        ? [...members]
        : members.filter((m) => m.category === activeCategory);
    return list.sort((a, b) => {
      if (a.isLead && !b.isLead) return -1;
      if (!a.isLead && b.isLead) return 1;
      return (a.order ?? 999) - (b.order ?? 999);
    });
  }, [members, activeCategory]);

  // ── Grouped by fetched category order ──────────────────────────────────────
  const groupedMembers = useMemo(() => {
    if (activeCategory !== "all") return null;
    const map: Record<string, TeamMember[]> = {};
    members.forEach((m) => {
      if (!map[m.category]) map[m.category] = [];
      map[m.category].push(m);
    });
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => {
        if (a.isLead && !b.isLead) return -1;
        if (!a.isLead && b.isLead) return 1;
        return (a.order ?? 999) - (b.order ?? 999);
      }),
    );
    return categories
      .filter((c) => map[c.id]?.length)
      .map((c) => ({ category: c, members: map[c.id] }));
  }, [members, categories, activeCategory]);

  // ── Particles ───────────────────────────────────────────────────────────────
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        delay: Math.random() * 4,
        size: Math.random() * 5 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 5 + 5,
        color:
          i % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
      })),
    [],
  );

  const openCarousel = (memberList: TeamMember[], index: number) =>
    setCarousel({ members: memberList, index });

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={`min-h-screen overflow-x-hidden ${isDark ? "bg-black" : "bg-white"}`}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <FloatingParticle key={p.id} {...p} />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full mb-8
                ${isDark ? "bg-white/5 border-white/10" : "bg-black/[0.03] border-gray-200"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Users
                className={`w-3.5 h-3.5 ${isDark ? "text-white/38" : "text-gray-400"}`}
              />
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: isDark ? "rgba(255,255,255,0.36)" : "rgba(0,0,0,0.38)",
                }}
              >
                Meet the Team
              </span>
            </motion.div>

            <h1
              style={{
                fontFamily: F.display,
                fontWeight: 400,
                fontSize: "clamp(2.2rem,6vw,3.75rem)",
                letterSpacing: "-0.022em",
                lineHeight: 1.1,
                marginBottom: "1.1rem",
              }}
            >
              <span
                style={{
                  color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.85)",
                }}
              >
                The People Behind{" "}
              </span>
              <em
                style={{
                  fontStyle: "italic",
                  color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.85)",
                }}
              >
                the Vision
              </em>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              style={{
                fontFamily: F.body,
                fontWeight: 300,
                fontSize: "clamp(0.78rem,1.3vw,0.88rem)",
                lineHeight: 1.82,
                color: isDark ? "rgba(255,255,255,0.36)" : "rgba(0,0,0,0.40)",
                maxWidth: "48ch",
                margin: "0 auto",
              }}
            >
              Passionate minds driving entrepreneurship forward — one
              initiative, one member at a time.
            </motion.p>
          </motion.div>

          {/* Stats */}
          {!loading && members.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52 }}
              className="flex items-center justify-center gap-10 mt-12"
            >
              {[
                { label: "Members", value: members.length },
                {
                  label: "Teams",
                  value: categories.filter((c) =>
                    members.some((m) => m.category === c.id),
                  ).length,
                },
                {
                  label: "Leads",
                  value: members.filter((m) => m.isLead).length,
                },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div
                    style={{
                      fontFamily: F.display,
                      fontWeight: 400,
                      fontSize: "2.1rem",
                      color: isDark
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(0,0,0,0.82)",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontFamily: F.mono,
                      fontSize: "7.5px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: isDark
                        ? "rgba(255,255,255,0.22)"
                        : "rgba(0,0,0,0.28)",
                      marginTop: "0.2rem",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Category Filter — uses fetched teamCategories ─────────────────────── */}
      {!loading && categories.length > 0 && (
        <div
          className={`sticky top-16 z-30 py-3.5 px-6 border-b backdrop-blur-xl
          ${isDark ? "bg-black/82 border-white/6" : "bg-white/88 border-gray-200"}`}
        >
          <div
            className="max-w-6xl mx-auto flex gap-2.5 overflow-x-auto pb-0.5"
            style={
              {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              } as React.CSSProperties
            }
          >
            {/* All */}
            <motion.button
              onClick={() => setActiveCategory("all")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                fontFamily: F.mono,
                fontSize: "7.5px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
              className={`px-4 py-2 rounded-full transition-all duration-280
                ${
                  activeCategory === "all"
                    ? isDark
                      ? "bg-white text-black"
                      : "bg-black text-white"
                    : isDark
                      ? "bg-white/5 text-white/38 hover:bg-white/10 hover:text-white/65 border border-white/8"
                      : "bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600 border border-gray-200"
                }`}
            >
              All
            </motion.button>

            {/* One button per fetched category */}
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  fontFamily: F.mono,
                  fontSize: "7.5px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-280
                  ${
                    activeCategory === cat.id
                      ? isDark
                        ? "bg-white text-black"
                        : "bg-black text-white"
                      : isDark
                        ? "bg-white/5 text-white/38 hover:bg-white/10 hover:text-white/65 border border-white/8"
                        : "bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600 border border-gray-200"
                  }`}
              >
                <DynamicIcon
                  name={cat.icon}
                  className={`w-2.5 h-2.5 ${
                    activeCategory === cat.id
                      ? isDark
                        ? "text-black"
                        : "text-white"
                      : isDark
                        ? "text-white/28"
                        : "text-gray-400"
                  }`}
                />
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader
                  className={`w-6 h-6 ${isDark ? "text-white/32" : "text-gray-400"}`}
                />
              </motion.div>
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.78rem",
                  color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.33)",
                }}
              >
                Loading team…
              </p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-24">
              <UserCircle
                className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-white/14" : "text-gray-300"}`}
              />
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.8rem",
                  color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.32)",
                }}
              >
                No team members yet.
              </p>
            </div>
          ) : activeCategory !== "all" ? (
            /* ── Filtered single category ─── */
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.28 }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredMembers.map((m, i) => (
                    <TeamMemberCard
                      key={m.id}
                      member={m}
                      categoryName={getCategoryName(m.category)}
                      index={i}
                      isDark={isDark}
                      onClick={() => openCarousel(filteredMembers, i)}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            /* ── Grouped by category ─── */
            <div className="space-y-20">
              {groupedMembers?.map((group, gi) => (
                <SectionReveal key={group.category.id} delay={gi * 0.07}>
                  {/* Group header */}
                  <div className="flex items-center gap-3 mb-10">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                      ${isDark ? "bg-white/5 border border-white/8" : "bg-gray-100 border border-gray-150"}`}
                    >
                      <DynamicIcon
                        name={group.category.icon}
                        className={`w-4 h-4 ${isDark ? "text-white/40" : "text-gray-500"}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <h2
                        style={{
                          fontFamily: F.display,
                          fontWeight: 400,
                          fontSize: "1.12rem",
                          color: isDark
                            ? "rgba(255,255,255,0.78)"
                            : "rgba(0,0,0,0.72)",
                        }}
                      >
                        {group.category.name}
                      </h2>
                      {group.category.description && (
                        <p
                          style={{
                            fontFamily: F.body,
                            fontWeight: 300,
                            fontSize: "0.7rem",
                            color: isDark
                              ? "rgba(255,255,255,0.26)"
                              : "rgba(0,0,0,0.34)",
                            marginTop: "0.08rem",
                          }}
                          className="truncate"
                        >
                          {group.category.description}
                        </p>
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: F.mono,
                        fontSize: "7.5px",
                        letterSpacing: "0.1em",
                        color: isDark
                          ? "rgba(255,255,255,0.16)"
                          : "rgba(0,0,0,0.22)",
                        flexShrink: 0,
                      }}
                    >
                      ({group.members.length})
                    </span>
                    <div
                      className={`flex-1 h-px ${isDark ? "bg-white/6" : "bg-gray-100"}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {group.members.map((m, i) => (
                      <TeamMemberCard
                        key={m.id}
                        member={m}
                        categoryName={group.category.name}
                        index={i}
                        isDark={isDark}
                        onClick={() => openCarousel(group.members, i)}
                      />
                    ))}
                  </div>
                </SectionReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Carousel Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {carousel && (
          <CarouselModal
            members={carousel.members}
            initialIndex={carousel.index}
            getCategoryName={getCategoryName}
            getCategoryIcon={getCategoryIcon}
            isDark={isDark}
            onClose={() => setCarousel(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamPage;
