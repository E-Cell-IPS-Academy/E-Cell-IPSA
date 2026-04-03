import React, { useState, useEffect, useRef } from "react";
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

interface PageContent {
  heroTitle?: string;
  heroSubtitle?: string;
  [key: string]: any;
}

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl ${className}`}
    style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    }}
  >
    {children}
  </div>
);

/* Countdown Hook */
const useCountdown = (targetDate: string) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
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

const CountdownUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <motion.div
      className="w-14 h-14 md:w-16 md:h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-1"
      key={value}
      initial={{ rotateX: -90 }}
      animate={{ rotateX: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-xl md:text-2xl font-black text-white">{String(value).padStart(2, "0")}</span>
    </motion.div>
    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
  </div>
);

const CompetitionsPage: React.FC = () => {
  const [content, setContent] = useState<PageContent | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, "siteContent", "competitions");
        const snap = await getDoc(docRef);
        if (snap.exists()) setContent(snap.data() as PageContent);
      } catch {
        /* fallback */
      }
    };
    fetchContent();
    window.scrollTo(0, 0);
  }, []);

  const competitions = [
    {
      title: "VypaarX 3.0 - Startup Pitch Competition",
      deadline: "2026-05-15",
      prize: "50,000",
      teamSize: "2-4",
      category: "pitch",
      description: "Pitch your startup idea to a panel of investors and industry experts. Top 3 teams get funded.",
      status: "active",
    },
    {
      title: "HackNova - 36-Hour Hackathon",
      deadline: "2026-05-01",
      prize: "75,000",
      teamSize: "3-5",
      category: "hackathon",
      description: "Build a working prototype in 36 hours. Themes: HealthTech, EdTech, FinTech, Sustainability.",
      status: "active",
    },
    {
      title: "BizPlan Challenge",
      deadline: "2026-06-10",
      prize: "30,000",
      teamSize: "2-3",
      category: "bizplan",
      description: "Draft a comprehensive business plan with market analysis, financial projections, and go-to-market strategy.",
      status: "active",
    },
    {
      title: "CaseX - Business Case Study Competition",
      deadline: "2026-06-20",
      prize: "25,000",
      teamSize: "3-4",
      category: "casestudy",
      description: "Solve a real-world business problem presented by our corporate partner. Best solution wins.",
      status: "upcoming",
    },
  ];

  const categories = [
    { id: "pitch", label: "Pitch Competitions", icon: Target, color: "from-purple-500 to-pink-500" },
    { id: "hackathon", label: "Hackathons", icon: Code, color: "from-blue-500 to-cyan-500" },
    { id: "bizplan", label: "Business Plan", icon: FileText, color: "from-green-500 to-emerald-500" },
    { id: "casestudy", label: "Case Studies", icon: BookOpen, color: "from-orange-500 to-yellow-500" },
  ];

  const pastWinners = [
    { team: "NexGen Labs", competition: "VypaarX 2.0", prize: "1st Place", members: "Ankit, Priya, Rohit", year: "2025" },
    { team: "CodeCraft", competition: "HackNova 2024", prize: "1st Place", members: "Sneha, Arjun, Dev, Maya", year: "2024" },
    { team: "StratEdge", competition: "BizPlan 2025", prize: "1st Place", members: "Kavya, Nikhil", year: "2025" },
    { team: "CaseMasters", competition: "CaseX 2024", prize: "1st Place", members: "Ria, Sahil, Tanvi, Jay", year: "2024" },
    { team: "AgriSmart", competition: "VypaarX 2.0", prize: "2nd Place", members: "Deepak, Shruti, Aman", year: "2025" },
    { team: "MedConnect", competition: "HackNova 2024", prize: "2nd Place", members: "Pooja, Karthik, Nisha", year: "2024" },
  ];

  const getCategoryIcon = (cat: string) => {
    const map: Record<string, React.ElementType> = { pitch: Target, hackathon: Code, bizplan: FileText, casestudy: BookOpen };
    return map[cat] || Trophy;
  };

  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      pitch: "from-purple-500 to-pink-500",
      hackathon: "from-blue-500 to-cyan-500",
      bizplan: "from-green-500 to-emerald-500",
      casestudy: "from-orange-500 to-yellow-500",
    };
    return map[cat] || "from-purple-500 to-blue-500";
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-yellow-600/8 blur-[130px]"
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 50, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-5%", right: "-10%" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]"
          animate={{ x: [0, -70, 40, 0], y: [0, 80, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "-5%", left: "-5%" }}
        />
      </div>

      {/* Back Button */}
      <motion.div className="fixed top-24 left-6 z-50" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm">Back</span>
        </Link>
      </motion.div>

      {/* Hero */}
      <motion.section className="relative min-h-screen flex items-center justify-center pt-20" style={{ y: heroY, opacity: heroOpacity }}>
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/10 via-black to-black" />

        {/* Trophy Animation */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Trophy className="w-[350px] h-[350px] text-yellow-500" strokeWidth={0.5} />
        </motion.div>

        {/* Sparkles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-yellow-400/40 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 4 }}
          />
        ))}

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40, rotateX: 15 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 1 }} style={{ perspective: 1000 }}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-yellow-500/20 border border-yellow-500/30 rounded-full"
              animate={{ boxShadow: ["0 0 20px rgba(234,179,8,0.2)", "0 0 40px rgba(234,179,8,0.4)", "0 0 20px rgba(234,179,8,0.2)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Flame className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm font-medium">Compete. Win. Rise.</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6">
              {content?.heroTitle || (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-400">
                    Competitions
                  </span>
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              {content?.heroSubtitle || "Battle it out in pitch competitions, hackathons, and business challenges. Prove your mettle and win big."}
            </p>
            <a href="#active" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-black rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 shadow-lg shadow-yellow-500/25">
              View Active Competitions <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2" animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <motion.div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" animate={{ y: [0, 16, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </motion.section>

      {/* Categories */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 className="text-4xl md:text-5xl font-black text-center text-white mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Competition{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">Categories</span>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-6 text-center group hover:border-purple-500/40 transition-all duration-500 cursor-pointer">
                  <motion.div
                    className={`w-14 h-14 mx-auto mb-3 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}
                    whileHover={{ scale: 1.15, rotateZ: 10 }}
                  >
                    <cat.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-sm font-bold text-white">{cat.label}</h3>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Competitions */}
      <section id="active" className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.h2 className="text-4xl md:text-5xl font-black text-center text-white mb-4" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Active{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Competitions</span>
          </motion.h2>
          <motion.p className="text-gray-400 text-center mb-16 max-w-xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Register before the deadline and show what you've got
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {competitions.map((c, i) => {
              const CatIcon = getCategoryIcon(c.category);
              return (
                <motion.div key={c.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  <CompetitionCard competition={c} catIcon={CatIcon} catColor={getCategoryColor(c.category)} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hall of Fame */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 className="text-4xl md:text-5xl font-black text-center text-white mb-4" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Hall of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">Fame</span>
          </motion.h2>
          <motion.p className="text-gray-400 text-center mb-16 max-w-xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Past champions who set the bar
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastWinners.map((w, i) => (
              <motion.div key={`${w.team}-${w.competition}`} initial={{ opacity: 0, y: 30, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-5 h-full group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-yellow-500/20">
                      {w.prize.includes("1st") ? <Crown className="w-5 h-5 text-yellow-400" /> : <Medal className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{w.team}</h3>
                      <p className="text-purple-400 text-sm">{w.competition}</p>
                      <p className="text-yellow-400 text-xs font-medium mt-1">{w.prize} - {w.year}</p>
                      <p className="text-gray-500 text-xs mt-1">Team: {w.members}</p>
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
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <GlassCard className="p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-purple-600/10" />
              <div className="relative z-10">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Compete?</h2>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">Register your team, prepare your pitch, and show the world what you're made of.</p>
                <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-black rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 shadow-lg shadow-yellow-500/25">
                  Register Now <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

/* Competition Card with Countdown */
const CompetitionCard: React.FC<{
  competition: { title: string; deadline: string; prize: string; teamSize: string; category: string; description: string; status: string };
  catIcon: React.ElementType;
  catColor: string;
}> = ({ competition: c, catIcon: CatIcon, catColor }) => {
  const { days, hours, mins, secs } = useCountdown(c.deadline);

  return (
    <GlassCard className="p-6 h-full group hover:border-purple-500/40 transition-all duration-500 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${catColor}`} />
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 bg-gradient-to-br ${catColor} rounded-lg flex items-center justify-center opacity-80`}>
          <CatIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{c.title}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
            {c.status === "active" ? "Active" : "Upcoming"}
          </span>
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{c.description}</p>

      {/* Countdown */}
      <div className="flex gap-2 mb-4 justify-center">
        <CountdownUnit value={days} label="Days" />
        <CountdownUnit value={hours} label="Hrs" />
        <CountdownUnit value={mins} label="Min" />
        <CountdownUnit value={secs} label="Sec" />
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-4 mb-5 justify-center">
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-semibold">INR {c.prize}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <Users className="w-4 h-4" />{c.teamSize} members
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <Timer className="w-4 h-4" />Deadline: {new Date(c.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </div>
      </div>

      <Link to="/register" className="block w-full text-center py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-md shadow-purple-500/20">
        Register Team
      </Link>
    </GlassCard>
  );
};

export default CompetitionsPage;
