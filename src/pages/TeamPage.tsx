import React, { useState, useEffect, useRef, useMemo } from "react";
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
} from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { useTheme } from "../context/ThemeContext";

// ─── Google Fonts ─────────────────────────────────────────────
// DISPLAY → "Instrument Serif"  — hero h1, group headings
// LABEL   → "DM Mono"           — "Meet the Team" pill, category filter pills, member category tag, "Lead" badge
// BODY    → "Outfit" 300        — member name, role, bio, loading text
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

// Types & categories — unchanged
interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: string;
  isLead: boolean;
  image: string;
  linkedin?: string;
  instagram?: string;
  email?: string;
  bio?: string;
  order: number;
}

const CATEGORIES = [
  "All",
  "Core Team",
  "Technical",
  "Marketing",
  "Design",
  "Content",
  "Operations",
];

// Particles — unchanged
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
      y: [0, -30, 0, 20, 0],
      x: [0, 15, -10, 8, 0],
      opacity: [0.15, 0.5, 0.2, 0.45, 0.15],
    }}
    transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

const SectionReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Team Member Card ──────────────────────────────────────────
const TeamMemberCard: React.FC<{
  member: TeamMember;
  index: number;
  isDark: boolean;
}> = ({ member, index, isDark }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 40, scale: 0.95 }
      }
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}
      className={`group relative backdrop-blur-md border ${isDark ? "border-white/8" : "border-gray-200"} rounded-2xl overflow-hidden cursor-default`}
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
          : "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.75))",
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.3)"
          : "0 8px 32px rgba(0,0,0,0.06)",
      }}
    >
      {/* Lead badge — DM Mono, amber not purple */}
      {member.isLead && (
        <motion.div
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/85 backdrop-blur-sm rounded-full"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ delay: index * 0.08 + 0.3, type: "spring" }}
        >
          <Crown className="w-2.5 h-2.5 text-white" />
          <span
            style={{
              fontFamily: F.mono,
              fontSize: "8px",
              letterSpacing: "0.1em",
              color: "white",
            }}
          >
            LEAD
          </span>
        </motion.div>
      )}

      {/* Profile image */}
      <div className="relative pt-8 px-8 flex justify-center">
        <div className="relative">
          {/* Subtle ring — white not purple gradient */}
          <div
            className={`absolute -inset-1 rounded-full ${isDark ? "bg-white/15" : "bg-black/8"} blur-[1px] group-hover:bg-white/25 transition-opacity duration-300`}
          />
          <div
            className={`relative w-28 h-28 rounded-full overflow-hidden border-2 ${isDark ? "border-black" : "border-white"}`}
          >
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div
                className={`w-full h-full ${isDark ? "bg-white/10" : "bg-gray-100"} flex items-center justify-center`}
              >
                <UserCircle
                  className={`w-14 h-14 ${isDark ? "text-white/30" : "text-gray-300"}`}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 pt-5 text-center">
        {/* Name — Outfit 400 */}
        <h3
          style={{
            fontFamily: F.body,
            fontWeight: 400,
            fontSize: "0.9rem",
            color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.82)",
            marginBottom: "0.2rem",
          }}
          className="group-hover:opacity-100 transition-opacity"
        >
          {member.name}
        </h3>

        {/* Role — Outfit 300, muted not purple */}
        <p
          style={{
            fontFamily: F.body,
            fontWeight: 300,
            fontSize: "0.75rem",
            color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
            marginBottom: "0.2rem",
          }}
        >
          {member.role}
        </p>

        {/* Category — DM Mono */}
        <p
          style={{
            fontFamily: F.mono,
            fontSize: "8px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.28)",
            marginBottom: "1rem",
          }}
        >
          {member.category}
        </p>

        {/* Bio — Outfit 300 */}
        {member.bio && (
          <p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "0.72rem",
              lineHeight: 1.65,
              color: isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.40)",
              marginBottom: "1rem",
            }}
            className="line-clamp-2"
          >
            {member.bio}
          </p>
        )}

        {/* Social links */}
        <div
          className={`flex items-center justify-center gap-3 pt-3 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}
        >
          {member.linkedin && (
            <motion.a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 ${isDark ? "bg-white/5 hover:bg-white/12 text-white/35" : "bg-black/5 hover:bg-black/10 text-gray-400"} rounded-lg hover:text-blue-400 transition-all duration-300`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="w-3.5 h-3.5" />
            </motion.a>
          )}
          {member.instagram && (
            <motion.a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 ${isDark ? "bg-white/5 hover:bg-white/12 text-white/35" : "bg-black/5 hover:bg-black/10 text-gray-400"} rounded-lg hover:text-pink-400 transition-all duration-300`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Instagram className="w-3.5 h-3.5" />
            </motion.a>
          )}
          {member.email && (
            <motion.a
              href={`mailto:${member.email}`}
              className={`p-2 ${isDark ? "bg-white/5 hover:bg-white/12 text-white/35" : "bg-black/5 hover:bg-black/10 text-gray-400"} rounded-lg hover:text-white/70 transition-all duration-300`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail className="w-3.5 h-3.5" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Placeholder card — unchanged structure, fonts added
const PlaceholderCard: React.FC<{ index: number; isDark: boolean }> = ({
  index,
  isDark,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`backdrop-blur-md border ${isDark ? "border-white/8" : "border-gray-200"} rounded-2xl overflow-hidden`}
    style={{
      background: isDark
        ? "linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))"
        : "linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.75))",
    }}
  >
    <div className="pt-8 px-8 flex justify-center">
      <div
        className={`w-28 h-28 rounded-full ${isDark ? "bg-white/6 border-white/8" : "bg-gray-100 border-gray-200"} border flex items-center justify-center`}
      >
        <UserCircle
          className={`w-14 h-14 ${isDark ? "text-white/15" : "text-gray-300"}`}
        />
      </div>
    </div>
    <div className="p-6 pt-5 text-center">
      <div
        className={`h-4 w-32 ${isDark ? "bg-white/8" : "bg-gray-200"} rounded mx-auto mb-2`}
      />
      <div
        className={`h-3 w-24 ${isDark ? "bg-white/5" : "bg-gray-100"} rounded mx-auto mb-4`}
      />
      <p
        style={{
          fontFamily: F.body,
          fontWeight: 300,
          fontSize: "0.72rem",
          color: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.30)",
        }}
      >
        Team data coming soon
      </p>
    </div>
  </motion.div>
);

// ─── Main ──────────────────────────────────────────────────────
const TeamPage: React.FC = () => {
  useFonts();
  const { isDark } = useTheme();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "teamMembers"), orderBy("order", "asc")),
        );
        setMembers(
          snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TeamMember[],
        );
      } catch {
        try {
          const snap = await getDocs(collection(db, "teamMembers"));
          setMembers(
            snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TeamMember[],
          );
        } catch {}
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const availableCategories = useMemo(() => {
    if (members.length === 0) return CATEGORIES;
    const cats = Array.from(new Set(members.map((m) => m.category)));
    return [
      "All",
      ...CATEGORIES.slice(1).filter((c) => cats.includes(c)),
      ...cats.filter((c) => !CATEGORIES.includes(c)),
    ];
  }, [members]);

  const filteredMembers = useMemo(() => {
    const f =
      activeCategory === "All"
        ? [...members]
        : members.filter((m) => m.category === activeCategory);
    return f.sort((a, b) => {
      if (a.isLead && !b.isLead) return -1;
      if (!a.isLead && b.isLead) return 1;
      return (a.order ?? 999) - (b.order ?? 999);
    });
  }, [members, activeCategory]);

  const groupedMembers = useMemo(() => {
    if (activeCategory !== "All") return null;
    const groups: Record<string, TeamMember[]> = {};
    members.forEach((m) => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
    });
    Object.keys(groups).forEach((k) =>
      groups[k].sort((a, b) => {
        if (a.isLead && !b.isLead) return -1;
        if (!a.isLead && b.isLead) return 1;
        return (a.order ?? 999) - (b.order ?? 999);
      }),
    );
    const orderedKeys = CATEGORIES.slice(1).filter((c) => groups[c]);
    const extraKeys = Object.keys(groups).filter(
      (k) => !CATEGORIES.includes(k),
    );
    return [...orderedKeys, ...extraKeys].map((cat) => ({
      category: cat,
      members: groups[cat],
    }));
  }, [members, activeCategory]);

  const particles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        delay: Math.random() * 4,
        size: Math.random() * 6 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 5 + 5,
        // toned down: no purple — use neutral white/gray particles
        color:
          i % 2 === 0 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
      })),
    [],
  );

  return (
    <div
      className={`min-h-screen overflow-hidden ${isDark ? "bg-black" : "bg-white"}`}
    >
      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 overflow-hidden">
        <div
          className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-black via-black to-black" : "bg-gradient-to-b from-white via-white to-white"}`}
        />
        {/* Very faint radial — not purple, neutral */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, rgba(200,200,200,0.15) 0%, transparent 55%), radial-gradient(circle at 70% 60%, rgba(180,180,180,0.1) 0%, transparent 55%)",
          }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <FloatingParticle key={p.id} {...p} />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Pill — DM Mono, very subtle */}
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-2 ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-gray-200"} border rounded-full mb-8`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Users
                className={`w-3.5 h-3.5 ${isDark ? "text-white/40" : "text-gray-400"}`}
              />
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.40)",
                }}
              >
                Meet the Team
              </span>
            </motion.div>

            {/* H1 — Instrument Serif */}
            <h1
              style={{
                fontFamily: F.display,
                fontWeight: 400,
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.85)",
                }}
              >
                Our{" "}
              </span>
              <span
                style={{
                  fontStyle: "italic",
                  color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.85)",
                }}
              >
                Team
              </span>
            </h1>

            {/* Sub — Outfit 300 */}
            <motion.p
              style={{
                fontFamily: F.body,
                fontWeight: 300,
                fontSize: "clamp(0.78rem,1.3vw,0.9rem)",
                lineHeight: 1.75,
                color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)",
                maxWidth: "44ch",
                margin: "0 auto",
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              The passionate minds behind E-Cell IPS Academy, driving
              entrepreneurship forward one initiative at a time.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ===== CATEGORY FILTER ===== */}
      <section
        className={`sticky top-16 z-30 py-4 px-6 ${isDark ? "bg-black/85 border-white/6" : "bg-white/85 border-gray-200"} backdrop-blur-xl border-b`}
      >
        <div
          ref={filterRef}
          className="max-w-5xl mx-auto flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {availableCategories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontFamily: F.mono,
                fontSize: "8px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
              className={`px-5 py-2.5 rounded-full transition-all duration-300 ${
                activeCategory === cat
                  ? isDark
                    ? "bg-white text-black"
                    : "bg-black text-white" // white/black pill — no purple
                  : isDark
                    ? "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 border border-white/8"
                    : "bg-black/5 text-gray-400 hover:bg-black/10 hover:text-gray-700 border border-gray-200"
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </section>

      {/* ===== TEAM GRID ===== */}
      <section className="relative py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <Loader className="w-7 h-7 text-white/40" />
              </motion.div>
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.78rem",
                  color: isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.35)",
                }}
              >
                Loading team members…
              </p>
            </div>
          ) : members.length === 0 ? (
            <div>
              <div className="text-center mb-12">
                <motion.div
                  className={`inline-flex items-center gap-2 px-4 py-2 ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-gray-200"} border rounded-full mb-6`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Sparkles
                    className={`w-4 h-4 ${isDark ? "text-white/35" : "text-gray-400"}`}
                  />
                  <span
                    style={{
                      fontFamily: F.mono,
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: isDark
                        ? "rgba(255,255,255,0.35)"
                        : "rgba(0,0,0,0.40)",
                    }}
                  >
                    Coming Soon
                  </span>
                </motion.div>
                <h2
                  style={{
                    fontFamily: F.display,
                    fontWeight: 400,
                    fontSize: "1.2rem",
                    color: isDark
                      ? "rgba(255,255,255,0.85)"
                      : "rgba(0,0,0,0.82)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Team Data Coming Soon
                </h2>
                <p
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "0.78rem",
                    color: isDark
                      ? "rgba(255,255,255,0.32)"
                      : "rgba(0,0,0,0.38)",
                    maxWidth: "40ch",
                    margin: "0 auto",
                  }}
                >
                  We're putting the finishing touches on our team profiles.
                  Check back shortly.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <PlaceholderCard key={i} index={i} isDark={isDark} />
                ))}
              </div>
            </div>
          ) : activeCategory !== "All" ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SectionReveal>
                  <div className="flex items-center gap-4 mb-10">
                    <div
                      className={`h-px flex-1 ${isDark ? "bg-white/8" : "bg-gray-200"}`}
                    />
                    <h2
                      style={{
                        fontFamily: F.display,
                        fontWeight: 400,
                        fontSize: "1.1rem",
                        color: isDark
                          ? "rgba(255,255,255,0.75)"
                          : "rgba(0,0,0,0.65)",
                      }}
                    >
                      {activeCategory}
                    </h2>
                    <div
                      className={`h-px flex-1 ${isDark ? "bg-white/8" : "bg-gray-200"}`}
                    />
                  </div>
                </SectionReveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMembers.map((m, i) => (
                    <TeamMemberCard
                      key={m.id}
                      member={m}
                      index={i}
                      isDark={isDark}
                    />
                  ))}
                </div>
                {filteredMembers.length === 0 && (
                  <div className="text-center py-16">
                    <UserCircle
                      className={`w-14 h-14 ${isDark ? "text-white/15" : "text-gray-300"} mx-auto mb-4`}
                    />
                    <p
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.78rem",
                        color: isDark
                          ? "rgba(255,255,255,0.30)"
                          : "rgba(0,0,0,0.35)",
                      }}
                    >
                      No members found in this category.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="space-y-20">
              {groupedMembers?.map((group, gi) => (
                <SectionReveal key={group.category} delay={gi * 0.1}>
                  <div className="flex items-center gap-4 mb-10">
                    <div
                      className={`h-px flex-1 ${isDark ? "bg-white/8" : "bg-gray-200"}`}
                    />
                    {/* Group heading — Instrument Serif, plain not gradient */}
                    <h2
                      style={{
                        fontFamily: F.display,
                        fontWeight: 400,
                        fontSize: "1.1rem",
                        color: isDark
                          ? "rgba(255,255,255,0.72)"
                          : "rgba(0,0,0,0.62)",
                      }}
                    >
                      {group.category}
                    </h2>
                    <span
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        letterSpacing: "0.12em",
                        color: isDark
                          ? "rgba(255,255,255,0.22)"
                          : "rgba(0,0,0,0.28)",
                      }}
                    >
                      ({group.members.length})
                    </span>
                    <div
                      className={`h-px flex-1 ${isDark ? "bg-white/8" : "bg-gray-200"}`}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {group.members.map((m, i) => (
                      <TeamMemberCard
                        key={m.id}
                        member={m}
                        index={i}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </SectionReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
