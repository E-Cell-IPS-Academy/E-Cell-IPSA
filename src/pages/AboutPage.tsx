import React, { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Rocket,
  Users,
  Lightbulb,
  Trophy,
  Mic2,
  Handshake,
  GraduationCap,
  Target,
  Eye,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Calendar,
  Star,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useTheme } from "../context/ThemeContext";

// ─── Google Fonts ─────────────────────────────────────────────
// DISPLAY → "Instrument Serif"  — all h1/h2 headings & accent words
// LABEL   → "DM Mono"           — ALL-CAPS section tags, milestone years
// BODY    → "Outfit" 300        — paragraphs, descriptions, button text
function useFonts() {
  useEffect(() => {
    if (document.getElementById("about-fonts")) return;
    const link = document.createElement("link");
    link.id = "about-fonts";
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
      filter: `blur(${size > 6 ? 2 : 0}px)`,
    }}
    animate={{
      y: [0, -40, 0, 30, 0],
      x: [0, 20, -15, 10, 0],
      opacity: [0.2, 0.6, 0.3, 0.7, 0.2],
      scale: [1, 1.3, 0.9, 1.2, 1],
    }}
    transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

const ParticleField: React.FC = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        delay: Math.random() * 5,
        size: Math.random() * 8 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 6 + 5,
        color:
          i % 3 === 0
            ? "rgba(139,92,246,0.5)"
            : i % 3 === 1
              ? "rgba(59,130,246,0.4)"
              : "rgba(168,85,247,0.3)",
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <FloatingParticle key={p.id} {...p} />
      ))}
    </div>
  );
};

// ---------- Section Reveal Wrapper ----------
const SectionReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ---------- Glassmorphism Card ----------
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
  isDark?: boolean;
}> = ({ children, className = "", hoverGlow = false, isDark = true }) => (
  <motion.div
    className={`relative backdrop-blur-md border ${isDark ? "border-white/10" : "border-gray-200"} rounded-2xl overflow-hidden ${className}`}
    style={{
      background: isDark
        ? "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))"
        : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
      boxShadow: isDark
        ? "0 8px 32px rgba(31,38,135,0.25)"
        : "0 8px 32px rgba(31,38,135,0.08)",
    }}
    whileHover={
      hoverGlow
        ? {
            y: -8,
            boxShadow: "0 20px 60px rgba(139,92,246,0.3)",
            borderColor: "rgba(139,92,246,0.4)",
          }
        : undefined
    }
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// ---------- Data ----------
const whatWeDoCards = [
  {
    icon: Rocket,
    title: "Startup Incubation",
    description:
      "Mentoring student startups from idea to launch with hands-on support, resources, and a structured incubation pipeline.",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: GraduationCap,
    title: "Workshops & Events",
    description:
      "Hands-on learning sessions with industry experts covering product building, fundraising, marketing, and more.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Mic2,
    title: "Speaker Sessions",
    description:
      "Inspiring talks from successful entrepreneurs, VCs, and innovators who share real-world insights and lessons.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Trophy,
    title: "Competitions",
    description:
      "Hackathons, pitch competitions, and business plan contests that challenge students to think big and execute fast.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Handshake,
    title: "Mentorship Programs",
    description:
      "One-on-one guidance from experienced mentors in diverse domains to help students navigate the entrepreneurial journey.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Globe,
    title: "Networking",
    description:
      "Building meaningful connections with investors, alumni, industry leaders, and a pan-India student entrepreneur community.",
    gradient: "from-indigo-500 to-blue-600",
  },
];

const milestones = [
  {
    year: "2019",
    title: "E-Cell Founded",
    description:
      "IPS Academy's Entrepreneurship Cell was established in collaboration with IIT Bombay E-Cell.",
    icon: Star,
  },
  {
    year: "2020",
    title: "First Virtual Summit",
    description:
      "Pivoted to virtual events during the pandemic, reaching 500+ students across India.",
    icon: Globe,
  },
  {
    year: "2021",
    title: "Startup Incubation Launch",
    description:
      "Launched the incubation program, supporting 10+ student startups in their first year.",
    icon: Rocket,
  },
  {
    year: "2022",
    title: "National Recognition",
    description:
      "Recognized among top E-Cells in central India with multiple award-winning student ventures.",
    icon: Award,
  },
  {
    year: "2023",
    title: "VypaarX Flagship Event",
    description:
      "Launched VypaarX, our flagship entrepreneurship fest attracting 1000+ participants.",
    icon: Trophy,
  },
  {
    year: "2024",
    title: "IgniteX & Beyond",
    description:
      "Expanded with IgniteX hiring drives, mentorship networks, and strengthened industry partnerships.",
    icon: Zap,
  },
];

const missionIcons = [
  { icon: Lightbulb, label: "Innovation" },
  { icon: Rocket, label: "Launch" },
  { icon: Users, label: "Community" },
  { icon: Target, label: "Focus" },
  { icon: Zap, label: "Energy" },
  { icon: Sparkles, label: "Creativity" },
];

const defaultAboutContent = {
  heroSubtitle: "Discover Our Story",
  heroTitle: "About ",
  heroTitleAccent: "E-Cell",
  heroDescription:
    "Fuelling entrepreneurial ambition at IPS Academy, Indore. Building tomorrow's founders, today.",
  whoWeAreTitle: "The Entrepreneurship Cell of ",
  whoWeAreTitleAccent: "IPS Academy",
  whoWeAreParagraphs: [
    'E-Cell IPS Academy is a student-run, non-profit organization working in collaboration with <span class="text-purple-400 font-light">IIT Bombay E-Cell</span> to build and nurture the entrepreneurial ecosystem in and around Indore.',
    "We are a passionate community of student leaders, innovators, and dreamers who believe that great startups can emerge from anywhere. Through workshops, mentorship, incubation, and large-scale events, we empower students to turn ideas into impactful ventures.",
    "From day one, our goal has been to bridge the gap between academic learning and real-world entrepreneurship, creating pathways for students to learn, build, and launch.",
  ],
  missionTitle: "Igniting the ",
  missionTitleAccent: "Entrepreneurial Spirit",
  missionText:
    "To foster innovation and entrepreneurial spirit among students through workshops, mentorship, and hands-on experiences that transform ideas into reality.",
  visionTitle: "Building the ",
  visionTitleAccent: "Future",
  visionText:
    "To create a thriving entrepreneurial ecosystem that nurtures innovation and empowers the next generation of business leaders.",
  visionText2:
    "We envision a world where every student with a bold idea has access to the mentorship, resources, and community they need to build something extraordinary. Our goal is to make IPS Academy a launchpad for India's most impactful startups.",
};

// ─── Shared heading style helper ──────────────────────────────
const H2 = ({
  isDark,
  children,
}: {
  isDark: boolean;
  children: React.ReactNode;
}) => (
  <h2
    style={{
      fontFamily: F.display,
      fontWeight: 400,
      fontSize: "clamp(1.4rem, 3vw, 2rem)",
      letterSpacing: "-0.02em",
      lineHeight: 1.25,
      color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.85)",
    }}
  >
    {children}
  </h2>
);

// ---------- Main Component ----------
const AboutPage: React.FC = () => {
  useFonts();
  const { isDark } = useTheme();
  const [content, setContent] = useState(defaultAboutContent);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "siteContent", "about"));
        if (snap.exists()) setContent((prev) => ({ ...prev, ...snap.data() }));
      } catch {}
    })();
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div
      className={`min-h-screen overflow-hidden ${isDark ? "bg-black" : "bg-white"}`}
    >
      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <div
            className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-purple-950/40 via-black to-black" : "bg-gradient-to-b from-purple-100/40 via-white to-white"}`}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.25) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(168,85,247,0.2) 0%, transparent 50%)",
            }}
          />
        </motion.div>

        <ParticleField />

        <motion.div
          className="absolute w-72 h-72 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.6), transparent 70%)",
            left: "5%",
            top: "20%",
          }}
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.5), transparent 70%)",
            right: "0%",
            bottom: "10%",
          }}
          animate={{ scale: [1, 1.15, 1], x: [0, -25, 0], y: [0, 15, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <motion.div
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Hero label — DM Mono */}
            <motion.p
              style={{
                fontFamily: F.mono,
                fontSize: "9px",
                letterSpacing: "0.35em",
                color: "#a78bfa",
                textTransform: "uppercase",
              }}
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {content.heroSubtitle}
            </motion.p>

            {/* Hero h1 — Instrument Serif */}
            <h1
              style={{
                fontFamily: F.display,
                fontWeight: 400,
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
                marginBottom: "1.5rem",
              }}
            >
              <span
                style={{
                  color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.85)",
                }}
              >
                {content.heroTitle}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400">
                {content.heroTitleAccent}
              </span>
            </h1>

            {/* Hero description — Outfit 300 */}
            <motion.p
              style={{
                fontFamily: F.body,
                fontWeight: 300,
                fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)",
                color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
                lineHeight: 1.75,
                maxWidth: "48ch",
                margin: "0 auto",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {content.heroDescription}
            </motion.p>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div
              className={`w-6 h-10 border-2 ${isDark ? "border-white/30" : "border-gray-300"} rounded-full flex justify-center`}
            >
              <motion.div
                className="w-1.5 h-3 bg-purple-400 rounded-full mt-2"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== WHO WE ARE ===== */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                {/* Label — DM Mono */}
                <motion.p
                  style={{
                    fontFamily: F.mono,
                    fontSize: "9px",
                    letterSpacing: "0.35em",
                    color: "#a78bfa",
                    textTransform: "uppercase",
                  }}
                  className="mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Who We Are
                </motion.p>

                {/* Heading — Instrument Serif */}
                <H2 isDark={isDark}>
                  {content.whoWeAreTitle}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {content.whoWeAreTitleAccent}
                  </span>
                </H2>

                {/* Body — Outfit 300 */}
                <div
                  className="space-y-4 mt-6"
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)",
                    color: isDark
                      ? "rgba(255,255,255,0.42)"
                      : "rgba(0,0,0,0.45)",
                    lineHeight: 1.8,
                  }}
                >
                  {content.whoWeAreParagraphs.map((para, idx) => (
                    <p key={idx} dangerouslySetInnerHTML={{ __html: para }} />
                  ))}
                </div>
              </div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 40, rotateY: 5 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src="/about.jpg"
                    alt="E-Cell IPS Academy team"
                    className="w-full h-[420px] object-cover rounded-2xl"
                  />
                  <div
                    className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-black/60 via-transparent to-transparent" : "bg-gradient-to-t from-white/40 via-transparent to-transparent"}`}
                  />
                </div>
                <div className="absolute -inset-3 border-2 border-purple-500/20 rounded-3xl -z-10" />
                <motion.div
                  className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl opacity-20 -z-10"
                  animate={{ rotate: [0, 90, 180, 270, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ===== OUR MISSION ===== */}
      <section className="relative py-24 md:py-32 px-6">
        <div
          className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" : "bg-gradient-to-b from-transparent via-purple-50/50 to-transparent"} pointer-events-none`}
        />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <SectionReveal>
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-2 ${isDark ? "bg-purple-500/10 border-purple-500/20" : "bg-purple-50 border-purple-200"} border rounded-full mb-8`}
              whileHover={{ scale: 1.05 }}
            >
              <Target className="w-4 h-4 text-purple-400" />
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  color: "#a78bfa",
                  textTransform: "uppercase",
                }}
              >
                Our Mission
              </span>
            </motion.div>

            <H2 isDark={isDark}>
              {content.missionTitle}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                {content.missionTitleAccent}
              </span>
            </H2>

            <p
              style={{
                fontFamily: F.body,
                fontWeight: 300,
                fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)",
                color: isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.45)",
                lineHeight: 1.8,
                maxWidth: "54ch",
                margin: "1.5rem auto 4rem",
              }}
            >
              {content.missionText}
            </p>
          </SectionReveal>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {missionIcons.map((item, index) => (
              <SectionReveal key={item.label} delay={index * 0.1}>
                <motion.div
                  className="flex flex-col items-center gap-3 p-4"
                  whileHover={{ scale: 1.15, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${isDark ? "from-purple-500/20 to-blue-500/20 border-purple-500/30" : "from-purple-100 to-blue-100 border-purple-200"} border rounded-2xl flex items-center justify-center backdrop-blur-sm`}
                  >
                    <item.icon className="w-7 h-7 text-purple-400" />
                  </div>
                  <span
                    style={{
                      fontFamily: F.mono,
                      fontSize: "8px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: isDark
                        ? "rgba(255,255,255,0.32)"
                        : "rgba(0,0,0,0.38)",
                    }}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR VISION ===== */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                className="relative order-2 lg:order-1"
                initial={{ opacity: 0, x: -40, rotateY: -5 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src="/vision.jpg"
                    alt="E-Cell vision"
                    className="w-full h-[420px] object-cover rounded-2xl"
                  />
                  <div
                    className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-black/60 via-transparent to-transparent" : "bg-gradient-to-t from-white/40 via-transparent to-transparent"}`}
                  />
                </div>
                <div className="absolute -inset-3 border-2 border-blue-500/20 rounded-3xl -z-10" />
                <motion.div
                  className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-15 -z-10"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>

              <div className="order-1 lg:order-2">
                <motion.div
                  className={`inline-flex items-center gap-2 px-4 py-2 ${isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-200"} border rounded-full mb-6`}
                  whileHover={{ scale: 1.05 }}
                >
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span
                    style={{
                      fontFamily: F.mono,
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                      color: "#60a5fa",
                      textTransform: "uppercase",
                    }}
                  >
                    Our Vision
                  </span>
                </motion.div>

                <H2 isDark={isDark}>
                  {content.visionTitle}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {content.visionTitleAccent}
                  </span>
                </H2>

                <p
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)",
                    color: isDark
                      ? "rgba(255,255,255,0.40)"
                      : "rgba(0,0,0,0.45)",
                    lineHeight: 1.8,
                    marginTop: "1.25rem",
                    marginBottom: "1rem",
                  }}
                >
                  {content.visionText}
                </p>
                <p
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)",
                    color: isDark
                      ? "rgba(255,255,255,0.30)"
                      : "rgba(0,0,0,0.35)",
                    lineHeight: 1.8,
                  }}
                >
                  {content.visionText2}
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ===== WHAT WE DO ===== */}
      <section className="relative py-24 md:py-32 px-6">
        <div
          className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-transparent via-purple-950/15 to-transparent" : "bg-gradient-to-b from-transparent via-purple-50/30 to-transparent"} pointer-events-none`}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionReveal>
            <div className="text-center mb-16">
              <p
                style={{
                  fontFamily: F.mono,
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  color: "#a78bfa",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                What We Do
              </p>
              <H2 isDark={isDark}>
                Empowering Through{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Action
                </span>
              </H2>
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)",
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.40)",
                  lineHeight: 1.75,
                  maxWidth: "46ch",
                  margin: "1rem auto 0",
                }}
              >
                From ideation to execution, we provide everything a student
                entrepreneur needs to succeed.
              </p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeDoCards.map((card, index) => (
              <SectionReveal key={card.title} delay={index * 0.1}>
                <GlassCard
                  className="p-8 h-full group"
                  hoverGlow
                  isDark={isDark}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  {/* Card title — Instrument Serif */}
                  <h3
                    style={{
                      fontFamily: F.display,
                      fontWeight: 400,
                      fontSize: "1rem",
                      letterSpacing: "-0.01em",
                      color: isDark
                        ? "rgba(255,255,255,0.88)"
                        : "rgba(0,0,0,0.85)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {card.title}
                  </h3>
                  {/* Card body — Outfit 300 */}
                  <p
                    style={{
                      fontFamily: F.body,
                      fontWeight: 300,
                      fontSize: "0.78rem",
                      lineHeight: 1.75,
                      color: isDark
                        ? "rgba(255,255,255,0.38)"
                        : "rgba(0,0,0,0.42)",
                    }}
                  >
                    {card.description}
                  </p>
                  <div
                    className={`mt-5 h-px w-0 group-hover:w-full bg-gradient-to-r ${card.gradient} transition-all duration-500`}
                  />
                </GlassCard>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR JOURNEY ===== */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-20">
              <p
                style={{
                  fontFamily: F.mono,
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  color: "#a78bfa",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                Our Journey
              </p>
              <H2 isDark={isDark}>
                Milestones That{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Define Us
                </span>
              </H2>
            </div>
          </SectionReveal>

          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-purple-500/50" />
            {milestones.map((milestone, index) => {
              const isLeft = index % 2 === 0;
              return (
                <SectionReveal key={milestone.year} delay={index * 0.15}>
                  <div
                    className={`relative flex items-center mb-16 last:mb-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div
                      className={`ml-20 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16"}`}
                    >
                      <GlassCard
                        className="p-6 group"
                        hoverGlow
                        isDark={isDark}
                      >
                        {/* Year — Instrument Serif italic */}
                        <p
                          style={{
                            fontFamily: F.display,
                            fontStyle: "italic",
                            fontWeight: 400,
                            fontSize: "1.05rem",
                            color: "#a78bfa",
                            marginBottom: "0.4rem",
                          }}
                        >
                          {milestone.year}
                        </p>
                        {/* Title — Instrument Serif */}
                        <h3
                          style={{
                            fontFamily: F.display,
                            fontWeight: 400,
                            fontSize: "0.95rem",
                            color: isDark
                              ? "rgba(255,255,255,0.85)"
                              : "rgba(0,0,0,0.82)",
                            marginBottom: "0.4rem",
                          }}
                        >
                          {milestone.title}
                        </h3>
                        {/* Description — Outfit 300 */}
                        <p
                          style={{
                            fontFamily: F.body,
                            fontWeight: 300,
                            fontSize: "0.75rem",
                            lineHeight: 1.7,
                            color: isDark
                              ? "rgba(255,255,255,0.32)"
                              : "rgba(0,0,0,0.40)",
                          }}
                        >
                          {milestone.description}
                        </p>
                      </GlassCard>
                    </div>

                    <motion.div
                      className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center z-10 border-4 ${isDark ? "border-black" : "border-white"}`}
                      whileHover={{ scale: 1.3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <milestone.icon className="w-4 h-4 text-white" />
                    </motion.div>
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-24 md:py-32 px-6">
        <div
          className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-purple-950/30 via-transparent to-transparent" : "bg-gradient-to-t from-purple-50/50 via-transparent to-transparent"} pointer-events-none`}
        />
        <SectionReveal>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-12 md:p-16" isDark={isDark}>
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

                <motion.div
                  className="w-16 h-16 mx-auto mb-7 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>

                <H2 isDark={isDark}>
                  Join Our{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Community
                  </span>
                </H2>

                <p
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)",
                    color: isDark
                      ? "rgba(255,255,255,0.38)"
                      : "rgba(0,0,0,0.45)",
                    lineHeight: 1.8,
                    maxWidth: "48ch",
                    margin: "1.25rem auto 2.5rem",
                  }}
                >
                  Be part of a vibrant community of innovators, builders, and
                  dreamers. Whether you have an idea or just the passion to
                  learn, there's a place for you at E-Cell.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <motion.button
                      className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-purple-500/25"
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.82rem",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get in Touch
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <Link to="/past-events">
                    <motion.button
                      className={`inline-flex items-center gap-3 px-8 py-4 ${isDark ? "bg-white/5 border-white/20 text-white" : "bg-black/5 border-gray-200 text-gray-900"} border rounded-xl transition-all duration-300`}
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.82rem",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Calendar className="w-5 h-5" />
                      View Events
                    </motion.button>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
};

export default AboutPage;
