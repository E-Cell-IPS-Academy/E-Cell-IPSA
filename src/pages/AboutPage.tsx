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
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
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
}> = ({ children, className = "", hoverGlow = false }) => (
  <motion.div
    className={`relative backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden ${className}`}
    style={{
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.25)",
    }}
    whileHover={
      hoverGlow
        ? {
            y: -8,
            boxShadow: "0 20px 60px rgba(139, 92, 246, 0.3)",
            borderColor: "rgba(139, 92, 246, 0.4)",
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

// ---------- Default CMS Content ----------
const defaultAboutContent = {
  heroSubtitle: "Discover Our Story",
  heroTitle: "About ",
  heroTitleAccent: "E-Cell",
  heroDescription:
    "Fuelling entrepreneurial ambition at IPS Academy, Indore. Building tomorrow's founders, today.",
  whoWeAreTitle: "The Entrepreneurship Cell of ",
  whoWeAreTitleAccent: "IPS Academy",
  whoWeAreParagraphs: [
    'E-Cell IPS Academy is a student-run, non-profit organization working in collaboration with <span class="text-purple-400 font-semibold">IIT Bombay E-Cell</span> to build and nurture the entrepreneurial ecosystem in and around Indore.',
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

// ---------- Main Component ----------
const AboutPage: React.FC = () => {
  const [content, setContent] = useState(defaultAboutContent);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const snap = await getDoc(doc(db, "siteContent", "about"));
        if (snap.exists()) {
          const data = snap.data();
          setContent((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Failed to fetch about content:", err);
        // Defaults remain in place
      }
    };
    fetchContent();
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Parallax background layers */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/40 via-black to-black" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.25) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(168,85,247,0.2) 0%, transparent 50%)",
            }}
          />
        </motion.div>

        <ParticleField />

        {/* 3D floating orbs */}
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
            <motion.p
              className="text-purple-400 text-lg md:text-xl font-medium tracking-wider uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {content.heroSubtitle}
            </motion.p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
              <span className="text-white">{content.heroTitle}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400">
                {content.heroTitleAccent}
              </span>
            </h1>
            <motion.p
              className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {content.heroDescription}
            </motion.p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
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
              {/* Text */}
              <div>
                <motion.span
                  className="inline-block text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Who We Are
                </motion.span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                  {content.whoWeAreTitle}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {content.whoWeAreTitleAccent}
                  </span>
                </h2>
                <div className="space-y-5 text-gray-300 text-lg leading-relaxed">
                  {content.whoWeAreParagraphs.map((para, idx) => (
                    <p
                      key={idx}
                      dangerouslySetInnerHTML={{ __html: para }}
                    />
                  ))}
                </div>
              </div>

              {/* Image */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                {/* Decorative border */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <SectionReveal>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">
                Our Mission
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              {content.missionTitle}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                {content.missionTitleAccent}
              </span>
            </h2>
            <p className="text-gray-300 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto mb-16">
              {content.missionText}
            </p>
          </SectionReveal>

          {/* Animated icon grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {missionIcons.map((item, index) => (
              <SectionReveal key={item.label} delay={index * 0.1}>
                <motion.div
                  className="flex flex-col items-center gap-3 p-4"
                  whileHover={{ scale: 1.15, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <item.icon className="w-7 h-7 text-purple-400" />
                  </div>
                  <span className="text-gray-400 text-sm font-medium">
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
              {/* Image */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute -inset-3 border-2 border-blue-500/20 rounded-3xl -z-10" />
                <motion.div
                  className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-15 -z-10"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>

              {/* Text */}
              <div className="order-1 lg:order-2">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm font-medium">
                    Our Vision
                  </span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                  {content.visionTitle}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {content.visionTitleAccent}
                  </span>
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {content.visionText}
                </p>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {content.visionText2}
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ===== WHAT WE DO ===== */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/15 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <SectionReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">
                What We Do
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Empowering Through{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Action
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                From ideation to execution, we provide everything a student
                entrepreneur needs to succeed.
              </p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeDoCards.map((card, index) => (
              <SectionReveal key={card.title} delay={index * 0.1}>
                <GlassCard className="p-8 h-full group" hoverGlow>
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <card.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Hover gradient line */}
                  <div
                    className={`mt-6 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${card.gradient} transition-all duration-500`}
                  />
                </GlassCard>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR JOURNEY (Timeline) ===== */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-20">
              <span className="inline-block text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">
                Our Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Milestones That{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Define Us
                </span>
              </h2>
            </div>
          </SectionReveal>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-purple-500/50" />

            {milestones.map((milestone, index) => {
              const isLeft = index % 2 === 0;

              return (
                <SectionReveal key={milestone.year} delay={index * 0.15}>
                  <div
                    className={`relative flex items-center mb-16 last:mb-0 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div
                      className={`ml-20 md:ml-0 md:w-1/2 ${
                        isLeft ? "md:pr-16 md:text-right" : "md:pl-16"
                      }`}
                    >
                      <GlassCard className="p-6 group" hoverGlow>
                        <div
                          className={`flex items-center gap-3 mb-3 ${
                            isLeft ? "md:justify-end" : ""
                          }`}
                        >
                          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                            {milestone.year}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {milestone.description}
                        </p>
                      </GlassCard>
                    </div>

                    {/* Center dot */}
                    <motion.div
                      className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center z-10 border-4 border-black"
                      whileHover={{ scale: 1.3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <milestone.icon className="w-4 h-4 text-white" />
                    </motion.div>

                    {/* Empty spacer for opposite side */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/30 via-transparent to-transparent pointer-events-none" />

        <SectionReveal>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-12 md:p-16">
                {/* Decorative blobs */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

                <motion.div
                  className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Users className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Join Our{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Community
                  </span>
                </h2>
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                  Be part of a vibrant community of innovators, builders, and
                  dreamers. Whether you have an idea or just the passion to
                  learn, there's a place for you at E-Cell.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <motion.button
                      className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-purple-500/25"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get in Touch
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <Link to="/past-events">
                    <motion.button
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
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
