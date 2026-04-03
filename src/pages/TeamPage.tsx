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
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useTheme } from "../context/ThemeContext";

// ---------- Types ----------
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

// ---------- Category config ----------
const CATEGORIES = [
  "All",
  "Core Team",
  "Technical",
  "Marketing",
  "Design",
  "Content",
  "Operations",
];

// ---------- Floating Particles ----------
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

// ---------- Section Reveal ----------
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

// ---------- Team Member Card ----------
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
      whileHover={{
        y: -10,
        boxShadow: "0 25px 60px rgba(139, 92, 246, 0.25)",
      }}
      className={`group relative backdrop-blur-md border ${isDark ? "border-white/10" : "border-gray-200"} rounded-2xl overflow-hidden cursor-default`}
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))"
          : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
        boxShadow: isDark
          ? "0 8px 32px rgba(31, 38, 135, 0.2)"
          : "0 8px 32px rgba(31, 38, 135, 0.08)",
      }}
    >
      {/* Hover glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none" />

      {/* Lead badge */}
      {member.isLead && (
        <motion.div
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm rounded-full"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ delay: index * 0.08 + 0.3, type: "spring" }}
        >
          <Crown className="w-3 h-3 text-white" />
          <span className="text-white text-xs font-light">Lead</span>
        </motion.div>
      )}

      {/* Profile image */}
      <div className="relative pt-8 px-8 flex justify-center">
        <div className="relative">
          {/* Gradient ring */}
          <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 via-violet-500 to-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-[1px]" />

          <div className={`relative w-28 h-28 rounded-full overflow-hidden border-2 ${isDark ? "border-black" : "border-white"}`}>
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <UserCircle className="w-14 h-14 text-white/70" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 pt-5 text-center">
        <h3 className={`text-base font-light ${isDark ? "text-white" : "text-gray-900"} mb-1 group-hover:text-purple-300 transition-colors`}>
          {member.name}
        </h3>
        <p className="text-purple-400 text-xs font-light mb-1">
          {member.role}
        </p>
        <p className={`${isDark ? "text-gray-500" : "text-gray-400"} text-xs uppercase tracking-wider mb-4`}>
          {member.category}
        </p>

        {member.bio && (
          <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs font-light leading-relaxed mb-4 line-clamp-2`}>
            {member.bio}
          </p>
        )}

        {/* Social links */}
        <div className={`flex items-center justify-center gap-3 pt-2 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
          {member.linkedin && (
            <motion.a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 ${isDark ? "bg-white/5 hover:bg-blue-500/20 text-gray-400" : "bg-black/5 hover:bg-blue-500/10 text-gray-500"} rounded-lg hover:text-blue-400 transition-all duration-300`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="w-4 h-4" />
            </motion.a>
          )}
          {member.instagram && (
            <motion.a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 ${isDark ? "bg-white/5 hover:bg-pink-500/20 text-gray-400" : "bg-black/5 hover:bg-pink-500/10 text-gray-500"} rounded-lg hover:text-pink-400 transition-all duration-300`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Instagram className="w-4 h-4" />
            </motion.a>
          )}
          {member.email && (
            <motion.a
              href={`mailto:${member.email}`}
              className={`p-2 ${isDark ? "bg-white/5 hover:bg-purple-500/20 text-gray-400" : "bg-black/5 hover:bg-purple-500/10 text-gray-500"} rounded-lg hover:text-purple-400 transition-all duration-300`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail className="w-4 h-4" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ---------- Placeholder Card ----------
const PlaceholderCard: React.FC<{ index: number; isDark: boolean }> = ({ index, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`backdrop-blur-md border ${isDark ? "border-white/10" : "border-gray-200"} rounded-2xl overflow-hidden`}
    style={{
      background: isDark
        ? "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))"
        : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
    }}
  >
    <div className="pt-8 px-8 flex justify-center">
      <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${isDark ? "from-purple-500/20 to-blue-500/20 border-white/10" : "from-purple-100 to-blue-100 border-gray-200"} border flex items-center justify-center`}>
        <UserCircle className={`w-14 h-14 ${isDark ? "text-white/20" : "text-gray-300"}`} />
      </div>
    </div>
    <div className="p-6 pt-5 text-center">
      <div className={`h-5 w-32 ${isDark ? "bg-white/10" : "bg-gray-200"} rounded mx-auto mb-2`} />
      <div className={`h-4 w-24 ${isDark ? "bg-purple-500/10" : "bg-purple-100"} rounded mx-auto mb-4`} />
      <p className={`${isDark ? "text-gray-500" : "text-gray-400"} text-xs font-light`}>Team data coming soon</p>
    </div>
  </motion.div>
);

// ---------- Main Component ----------
const TeamPage: React.FC = () => {
  const { isDark } = useTheme();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const filterRef = useRef<HTMLDivElement>(null);

  // Fetch team members from Firestore
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const q = query(
          collection(db, "teamMembers"),
          orderBy("order", "asc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TeamMember[];
        setMembers(data);
      } catch (error) {
        console.error("Error fetching team members:", error);
        try {
          const fallbackSnapshot = await getDocs(
            collection(db, "teamMembers")
          );
          const fallbackData = fallbackSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as TeamMember[];
          setMembers(fallbackData);
        } catch (fallbackError) {
          console.error("Fallback fetch also failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  // Determine available categories from fetched data
  const availableCategories = useMemo(() => {
    if (members.length === 0) return CATEGORIES;
    const cats = Array.from(new Set(members.map((m) => m.category)));
    return ["All", ...CATEGORIES.slice(1).filter((c) => cats.includes(c)), ...cats.filter((c) => !CATEGORIES.includes(c))];
  }, [members]);

  // Filter and sort: leads first within each group
  const filteredMembers = useMemo(() => {
    const filtered =
      activeCategory === "All"
        ? [...members]
        : members.filter((m) => m.category === activeCategory);

    return filtered.sort((a, b) => {
      if (a.isLead && !b.isLead) return -1;
      if (!a.isLead && b.isLead) return 1;
      return (a.order ?? 999) - (b.order ?? 999);
    });
  }, [members, activeCategory]);

  // Group members by category (for "All" view)
  const groupedMembers = useMemo(() => {
    if (activeCategory !== "All") return null;

    const groups: Record<string, TeamMember[]> = {};
    members.forEach((m) => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
    });

    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => {
        if (a.isLead && !b.isLead) return -1;
        if (!a.isLead && b.isLead) return 1;
        return (a.order ?? 999) - (b.order ?? 999);
      });
    });

    const orderedKeys = CATEGORIES.slice(1).filter((c) => groups[c]);
    const extraKeys = Object.keys(groups).filter(
      (k) => !CATEGORIES.includes(k)
    );

    return [...orderedKeys, ...extraKeys].map((cat) => ({
      category: cat,
      members: groups[cat],
    }));
  }, [members, activeCategory]);

  // Particles for hero
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        delay: Math.random() * 4,
        size: Math.random() * 6 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 5 + 5,
        color:
          i % 3 === 0
            ? "rgba(139,92,246,0.4)"
            : i % 3 === 1
            ? "rgba(59,130,246,0.35)"
            : "rgba(168,85,247,0.3)",
      })),
    []
  );

  return (
    <div className={`min-h-screen overflow-hidden ${isDark ? "bg-black" : "bg-white"}`}>
      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 overflow-hidden">
        {/* Animated BG */}
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-purple-950/30 via-black to-black" : "bg-gradient-to-b from-purple-100/30 via-white to-white"}`} />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.25) 0%, transparent 50%)",
          }}
        />

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <FloatingParticle key={p.id} {...p} />
          ))}
        </div>

        {/* 3D floating orb */}
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.5), transparent 70%)",
            right: "10%",
            top: "15%",
          }}
          animate={{ scale: [1, 1.2, 1], y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-2 ${isDark ? "bg-purple-500/10 border-purple-500/20" : "bg-purple-50 border-purple-200"} border rounded-full mb-8`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-xs font-light tracking-wider">
                Meet the Team
              </span>
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-thin leading-tight mb-6">
              <span className={isDark ? "text-white" : "text-gray-900"}>Our </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400">
                Team
              </span>
            </h1>
            <motion.p
              className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm font-light max-w-2xl mx-auto leading-relaxed`}
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
      <section className={`sticky top-16 z-30 py-4 px-6 ${isDark ? "bg-black/80 border-white/5" : "bg-white/80 border-gray-200"} backdrop-blur-xl border-b`}>
        <div
          ref={filterRef}
          className="max-w-5xl mx-auto flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {availableCategories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full font-light text-xs transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                  : isDark
                  ? "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                  : "bg-black/5 text-gray-500 hover:bg-black/10 hover:text-gray-900 border border-gray-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
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
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="mb-4"
              >
                <Loader className="w-8 h-8 text-purple-500" />
              </motion.div>
              <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm font-light`}>Loading team members...</p>
            </div>
          ) : members.length === 0 ? (
            <div>
              <div className="text-center mb-12">
                <motion.div
                  className={`inline-flex items-center gap-2 px-4 py-2 ${isDark ? "bg-purple-500/10 border-purple-500/20" : "bg-purple-50 border-purple-200"} border rounded-full mb-6`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 text-xs font-light tracking-wider">
                    Coming Soon
                  </span>
                </motion.div>
                <h2 className={`text-xl font-light ${isDark ? "text-white" : "text-gray-900"} mb-4`}>
                  Team Data Coming Soon
                </h2>
                <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm font-light max-w-xl mx-auto`}>
                  We're putting the finishing touches on our team profiles.
                  Check back shortly to meet the amazing people behind E-Cell.
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
                  <div className="flex items-center gap-3 mb-10">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                    <h2 className={`text-xl md:text-2xl font-light ${isDark ? "text-white" : "text-gray-900"}`}>
                      {activeCategory}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                  </div>
                </SectionReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMembers.map((member, index) => (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      index={index}
                      isDark={isDark}
                    />
                  ))}
                </div>

                {filteredMembers.length === 0 && (
                  <div className="text-center py-16">
                    <UserCircle className={`w-16 h-16 ${isDark ? "text-gray-600" : "text-gray-300"} mx-auto mb-4`} />
                    <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm font-light`}>
                      No members found in this category.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="space-y-20">
              {groupedMembers &&
                groupedMembers.map((group, groupIndex) => (
                  <SectionReveal
                    key={group.category}
                    delay={groupIndex * 0.1}
                  >
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                      <h2 className="text-xl md:text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        {group.category}
                      </h2>
                      <span className={`${isDark ? "text-gray-500" : "text-gray-400"} text-xs`}>
                        ({group.members.length})
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {group.members.map((member, index) => (
                        <TeamMemberCard
                          key={member.id}
                          member={member}
                          index={index}
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
