import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Trophy,
  ArrowLeft,
  ChevronRight,
  Timer,
  Users,
  DollarSign,
  Flame,
  Code,
  FileText,
  BookOpen,
  Crown,
  Medal,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// ─── Fonts ────────────────────────────────────────────────────
// DISPLAY → Instrument Serif — h1, section headings, competition titles
// LABEL   → DM Mono           — category labels, status badges, meta, countdown labels
// BODY    → Outfit 300        — descriptions, button labels, team/deadline info
function useFonts() {
  useEffect(() => {
    if (document.getElementById("comp-fonts")) return;
    const link = document.createElement("link");
    link.id = "comp-fonts";
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

interface PageContent {
  heroTitle?: string;
  heroSubtitle?: string;
  [key: string]: any;
}

const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`backdrop-blur-md border border-white/8 rounded-2xl ${className}`}
    style={{
      background:
        "linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
    }}
  >
    {children}
  </div>
);

const useCountdown = (targetDate: string) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      };
    };
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
};

const CountdownUnit: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => (
  <div className="text-center">
    <motion.div
      className="w-14 h-14 md:w-16 md:h-16 bg-white/6 border border-white/8 rounded-xl flex items-center justify-center mb-1"
      key={value}
      initial={{ rotateX: -90 }}
      animate={{ rotateX: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span
        style={{
          fontFamily: F.display,
          fontWeight: 400,
          fontSize: "1.2rem",
          color: "rgba(255,255,255,0.80)",
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
    </motion.div>
    <span
      style={{
        fontFamily: F.mono,
        fontSize: "7px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.28)",
      }}
    >
      {label}
    </span>
  </div>
);

const CompetitionsPage: React.FC = () => {
  useFonts();
  const [content, setContent] = useState<PageContent | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "siteContent", "competitions"));
        if (snap.exists()) setContent(snap.data() as PageContent);
      } catch {}
    })();
    window.scrollTo(0, 0);
  }, []);

  const competitions = [
    {
      title: "VypaarX 3.0 - Startup Pitch Competition",
      deadline: "2026-05-15",
      prize: "50,000",
      teamSize: "2-4",
      category: "pitch",
      description:
        "Pitch your startup idea to a panel of investors and industry experts. Top 3 teams get funded.",
      status: "active",
    },
    {
      title: "HackNova - 36-Hour Hackathon",
      deadline: "2026-05-01",
      prize: "75,000",
      teamSize: "3-5",
      category: "hackathon",
      description:
        "Build a working prototype in 36 hours. Themes: HealthTech, EdTech, FinTech, Sustainability.",
      status: "active",
    },
    {
      title: "BizPlan Challenge",
      deadline: "2026-06-10",
      prize: "30,000",
      teamSize: "2-3",
      category: "bizplan",
      description:
        "Draft a comprehensive business plan with market analysis, financial projections, and go-to-market strategy.",
      status: "active",
    },
    {
      title: "CaseX - Business Case Study Competition",
      deadline: "2026-06-20",
      prize: "25,000",
      teamSize: "3-4",
      category: "casestudy",
      description:
        "Solve a real-world business problem presented by our corporate partner. Best solution wins.",
      status: "upcoming",
    },
  ];

  const categories = [
    {
      id: "pitch",
      label: "Pitch Competitions",
      icon: Target,
      color: "from-amber-500/70 to-orange-500/70",
    },
    {
      id: "hackathon",
      label: "Hackathons",
      icon: Code,
      color: "from-blue-500/70 to-cyan-500/70",
    },
    {
      id: "bizplan",
      label: "Business Plan",
      icon: FileText,
      color: "from-emerald-500/70 to-green-500/70",
    },
    {
      id: "casestudy",
      label: "Case Studies",
      icon: BookOpen,
      color: "from-orange-500/70 to-yellow-500/70",
    },
  ];

  const pastWinners = [
    {
      team: "NexGen Labs",
      competition: "VypaarX 2.0",
      prize: "1st Place",
      members: "Ankit, Priya, Rohit",
      year: "2025",
    },
    {
      team: "CodeCraft",
      competition: "HackNova 2024",
      prize: "1st Place",
      members: "Sneha, Arjun, Dev, Maya",
      year: "2024",
    },
    {
      team: "StratEdge",
      competition: "BizPlan 2025",
      prize: "1st Place",
      members: "Kavya, Nikhil",
      year: "2025",
    },
    {
      team: "CaseMasters",
      competition: "CaseX 2024",
      prize: "1st Place",
      members: "Ria, Sahil, Tanvi, Jay",
      year: "2024",
    },
    {
      team: "AgriSmart",
      competition: "VypaarX 2.0",
      prize: "2nd Place",
      members: "Deepak, Shruti, Aman",
      year: "2025",
    },
    {
      team: "MedConnect",
      competition: "HackNova 2024",
      prize: "2nd Place",
      members: "Pooja, Karthik, Nisha",
      year: "2024",
    },
  ];

  const getCatIcon = (
    cat: string
  ): React.ComponentType<{ className?: string }> =>
    ({
      pitch: Target,
      hackathon: Code,
      bizplan: FileText,
      casestudy: BookOpen,
    })[cat] || Trophy;
  const getCatColor = (cat: string) =>
    ({
      pitch: "from-amber-500/60 to-orange-500/60",
      hackathon: "from-blue-500/60 to-cyan-500/60",
      bizplan: "from-emerald-500/60 to-green-500/60",
      casestudy: "from-orange-500/60 to-yellow-500/60",
    })[cat] || "from-white/10 to-white/5";

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Ambient — amber/gold tones for competitions, no purple */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-amber-600/[0.05] blur-[130px]"
          animate={{ x: [0, 70, -30, 0], y: [0, -50, 40, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-5%", right: "-10%" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.015] blur-[120px]"
          animate={{ x: [0, -60, 30, 0], y: [0, 70, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "-5%", left: "-5%" }}
        />
      </div>

      <motion.div
        className="fixed top-24 left-6 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          to="/"
          style={{ fontFamily: F.body, fontWeight: 300, fontSize: "0.78rem" }}
          className="flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-md border border-white/8 rounded-full text-white/40 hover:text-white/65 hover:bg-white/12 transition-all duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
      </motion.div>

      {/* Hero */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center pt-20"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/[0.08] via-black to-black" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <Trophy
            className="w-[320px] h-[320px] text-amber-400"
            strokeWidth={0.5}
          />
        </motion.div>
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/25 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ scale: [0, 1.5, 0], opacity: [0, 0.6, 0] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <Flame className="w-3.5 h-3.5 text-amber-400/70" />
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(251,191,36,0.55)",
                }}
              >
                Compete. Win. Rise.
              </span>
            </motion.div>
            <h1
              style={{
                fontFamily: F.display,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(2.5rem,8vw,5.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "rgba(255,255,255,0.88)",
                marginBottom: "1.5rem",
              }}
            >
              {content?.heroTitle || "Competitions"}
            </h1>
            <p
              style={{
                fontFamily: F.body,
                fontWeight: 300,
                fontSize: "clamp(0.82rem,1.5vw,1rem)",
                color: "rgba(255,255,255,0.38)",
                lineHeight: 1.75,
                maxWidth: "46ch",
                margin: "0 auto 2.5rem",
              }}
            >
              {content?.heroSubtitle ||
                "Battle it out in pitch competitions, hackathons, and business challenges. Prove your mettle and win big."}
            </p>
            <a
              href="#active"
              style={{
                fontFamily: F.body,
                fontWeight: 400,
                fontSize: "0.88rem",
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-black rounded-xl hover:bg-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/20"
            >
              View Active Competitions <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/12 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1 h-1 bg-amber-400/40 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Categories */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              letterSpacing: "-0.025em",
              textAlign: "center",
              color: "rgba(255,255,255,0.82)",
              marginBottom: "4rem",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Competition <span style={{ fontStyle: "italic" }}>Categories</span>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 text-center group hover:border-white/14 transition-all duration-500 cursor-pointer">
                  <div
                    className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center`}
                  >
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3
                    style={{
                      fontFamily: F.mono,
                      fontSize: "8px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.58)",
                    }}
                  >
                    {cat.label}
                  </h3>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Competitions */}
      <section id="active" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              letterSpacing: "-0.025em",
              textAlign: "center",
              color: "rgba(255,255,255,0.82)",
              marginBottom: "0.75rem",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Active <span style={{ fontStyle: "italic" }}>Competitions</span>
          </motion.h2>
          <motion.p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.32)",
              textAlign: "center",
              marginBottom: "4rem",
              maxWidth: "38ch",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Register before the deadline and show what you've got
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {competitions.map((c, i) => {
              const CatIcon = getCatIcon(c.category);
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <CompetitionCard
                    competition={c}
                    catIcon={CatIcon}
                    catColor={getCatColor(c.category)}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hall of Fame */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              letterSpacing: "-0.025em",
              textAlign: "center",
              color: "rgba(255,255,255,0.82)",
              marginBottom: "0.75rem",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Hall of <span style={{ fontStyle: "italic" }}>Fame</span>
          </motion.h2>
          <motion.p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.32)",
              textAlign: "center",
              marginBottom: "4rem",
              maxWidth: "38ch",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Past champions who set the bar
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastWinners.map((w, i) => (
              <motion.div
                key={`${w.team}-${w.competition}`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-5 h-full group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-amber-500/0 group-hover:bg-amber-500/30 transition-colors duration-500" />
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-amber-500/12 border border-amber-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                      {w.prize.includes("1st") ? (
                        <Crown className="w-4 h-4 text-amber-400/70" />
                      ) : (
                        <Medal className="w-4 h-4 text-white/30" />
                      )}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: F.display,
                          fontWeight: 400,
                          fontSize: "0.9rem",
                          color: "rgba(255,255,255,0.78)",
                        }}
                      >
                        {w.team}
                      </h3>
                      <p
                        style={{
                          fontFamily: F.mono,
                          fontSize: "8px",
                          letterSpacing: "0.08em",
                          color: "rgba(255,255,255,0.30)",
                        }}
                      >
                        {w.competition}
                      </p>
                      <p
                        style={{
                          fontFamily: F.mono,
                          fontSize: "8px",
                          letterSpacing: "0.06em",
                          color: "rgba(251,191,36,0.55)",
                          marginTop: "0.2rem",
                        }}
                      >
                        {w.prize} — {w.year}
                      </p>
                      <p
                        style={{
                          fontFamily: F.body,
                          fontWeight: 300,
                          fontSize: "0.72rem",
                          color: "rgba(255,255,255,0.25)",
                          marginTop: "0.2rem",
                        }}
                      >
                        Team: {w.members}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12 relative overflow-hidden">
              <div className="relative z-10">
                <Trophy className="w-10 h-10 text-amber-400/50 mx-auto mb-5" />
                <h2
                  style={{
                    fontFamily: F.display,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(1.5rem,3.5vw,2.2rem)",
                    letterSpacing: "-0.02em",
                    color: "rgba(255,255,255,0.82)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Ready to Compete?
                </h2>
                <p
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "0.82rem",
                    lineHeight: 1.75,
                    color: "rgba(255,255,255,0.35)",
                    maxWidth: "42ch",
                    margin: "0 auto 2rem",
                  }}
                >
                  Register your team, prepare your pitch, and show the world
                  what you're made of.
                </p>
                <Link
                  to="/register"
                  style={{
                    fontFamily: F.body,
                    fontWeight: 400,
                    fontSize: "0.88rem",
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-black rounded-xl hover:bg-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/20"
                >
                  Register Now <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const CompetitionCard: React.FC<{
  competition: {
    title: string;
    deadline: string;
    prize: string;
    teamSize: string;
    category: string;
    description: string;
    status: string;
  };
  catIcon: React.ComponentType<{ className?: string }>;
  catColor: string;
}> = ({ competition: c, catIcon: CatIcon, catColor }) => {
  const { days, hours, mins, secs } = useCountdown(c.deadline);
  return (
    <GlassCard className="p-6 h-full hover:border-white/14 transition-all duration-500 relative overflow-hidden">
      <div
        className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${catColor}`}
      />
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-9 h-9 bg-gradient-to-br ${catColor} rounded-lg flex items-center justify-center`}
        >
          <CatIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.80)",
            }}
          >
            {c.title}
          </h3>
          <span
            style={{
              fontFamily: F.mono,
              fontSize: "7px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
            className={`px-2 py-0.5 rounded-full ${c.status === "active" ? "bg-emerald-500/15 text-emerald-400/70" : "bg-amber-500/15 text-amber-400/70"}`}
          >
            {c.status === "active" ? "Active" : "Upcoming"}
          </span>
        </div>
      </div>
      <p
        style={{
          fontFamily: F.body,
          fontWeight: 300,
          fontSize: "0.75rem",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.38)",
          marginBottom: "1rem",
        }}
      >
        {c.description}
      </p>
      <div className="flex gap-2 mb-4 justify-center">
        <CountdownUnit value={days} label="Days" />
        <CountdownUnit value={hours} label="Hrs" />
        <CountdownUnit value={mins} label="Min" />
        <CountdownUnit value={secs} label="Sec" />
      </div>
      <div
        className="flex flex-wrap gap-4 mb-5 justify-center"
        style={{
          fontFamily: F.mono,
          fontSize: "9px",
          letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.30)",
        }}
      >
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3 text-emerald-400/60" />
          <span style={{ color: "rgba(52,211,153,0.65)" }}>INR {c.prize}</span>
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {c.teamSize} members
        </span>
        <span className="flex items-center gap-1">
          <Timer className="w-3 h-3" />
          Deadline:{" "}
          {new Date(c.deadline).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>
      <Link
        to="/register"
        style={{ fontFamily: F.body, fontWeight: 300, fontSize: "0.80rem" }}
        className="block w-full text-center py-3 bg-white/8 hover:bg-white/14 border border-white/8 text-white/60 rounded-lg transition-all duration-300"
      >
        Register Team
      </Link>
    </GlassCard>
  );
};

export { CompetitionsPage as default };
