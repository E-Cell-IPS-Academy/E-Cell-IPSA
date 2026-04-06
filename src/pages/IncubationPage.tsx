import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Rocket,
  FileSearch,
  FlaskConical,
  Send,
  Building2,
  Users,
  DollarSign,
  Network,
  Scale,
  Cpu,
  ArrowLeft,
  ChevronRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// ─── Fonts ────────────────────────────────────────────────────
// DISPLAY → Instrument Serif — h1, section headings
// LABEL   → DM Mono           — "Now Accepting Applications" pill, step numbers, meta
// BODY    → Outfit 300        — descriptions, button labels, eligibility items
function useFonts() {
  useEffect(() => {
    if (document.getElementById("incubation-fonts")) return;
    const link = document.createElement("link");
    link.id = "incubation-fonts";
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

const IncubationPage: React.FC = () => {
  useFonts();
  const [content, setContent] = useState<PageContent | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "siteContent", "incubation"));
        if (snap.exists()) setContent(snap.data() as PageContent);
      } catch {}
    })();
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      icon: Send,
      label: "Apply",
      desc: "Submit your startup idea with a pitch deck and vision statement",
    },
    {
      icon: FileSearch,
      label: "Screen",
      desc: "Our panel reviews your application for feasibility and innovation",
    },
    {
      icon: FlaskConical,
      label: "Incubate",
      desc: "Get hands-on mentorship, workspace, and resources for 6 months",
    },
    {
      icon: Rocket,
      label: "Launch",
      desc: "Go to market with demo day, investor pitches, and launch support",
    },
  ];

  const benefits = [
    {
      icon: Building2,
      title: "Office Space",
      desc: "Dedicated co-working space with high-speed internet and meeting rooms",
    },
    {
      icon: Users,
      title: "Mentorship",
      desc: "1-on-1 sessions with industry veterans and serial entrepreneurs",
    },
    {
      icon: DollarSign,
      title: "Funding Access",
      desc: "Seed funding opportunities and investor introductions",
    },
    {
      icon: Network,
      title: "Network",
      desc: "Access to 500+ alumni entrepreneurs and industry connections",
    },
    {
      icon: Scale,
      title: "Legal Support",
      desc: "Free legal consultations for incorporation, IP, and compliance",
    },
    {
      icon: Cpu,
      title: "Tech Resources",
      desc: "Cloud credits, development tools, and technical infrastructure",
    },
  ];

  const successStories = [
    {
      name: "NexGen Solutions",
      domain: "EdTech",
      raised: "12L",
      desc: "AI-powered personalized learning platform now serving 50K+ students",
      year: "2024",
    },
    {
      name: "GreenPulse",
      domain: "CleanTech",
      raised: "18L",
      desc: "Smart waste management system deployed across 3 municipalities",
      year: "2023",
    },
    {
      name: "FinLit",
      domain: "FinTech",
      raised: "8L",
      desc: "Financial literacy app helping rural communities manage micro-investments",
      year: "2024",
    },
  ];

  const eligibility = [
    "Must be a current student or recent alumnus of IPS Academy",
    "Startup must be in ideation or early-stage (pre-revenue accepted)",
    "Team of 2-5 members with complementary skills",
    "Commitment to full-time or part-time incubation for 6 months",
    "Original idea with clear problem-solution fit",
    "Willingness to attend mandatory mentorship sessions",
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Very subtle ambient — no purple */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[120px]"
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-10%", left: "-10%" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.015] blur-[120px]"
          animate={{ x: [0, -60, 40, 0], y: [0, 80, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "-10%", right: "-10%" }}
        />
      </div>

      {/* Back */}
      <motion.div
        className="fixed top-24 left-6 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          to="/"
          style={{ fontFamily: F.body, fontWeight: 300, fontSize: "0.78rem" }}
          className="flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-md border border-white/8 rounded-full text-white/45 hover:text-white/70 hover:bg-white/12 transition-all duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
      </motion.div>

      {/* Hero */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center pt-20"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-black to-black" />

        {/* Faint Rocket watermark */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <Rocket
            className="w-[380px] h-[380px] text-white"
            strokeWidth={0.5}
          />
        </motion.div>

        {/* Minimal particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [-20, -60], opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut",
            }}
          />
        ))}

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Pill — DM Mono, neutral */}
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/5 border border-white/10 rounded-full">
              <Rocket className="w-3.5 h-3.5 text-white/40" />
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                Now Accepting Applications
              </span>
            </motion.div>

            {/* H1 — Instrument Serif */}
            <h1
              style={{
                fontFamily: F.display,
                fontWeight: 400,
                fontSize: "clamp(2.5rem,8vw,5.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "rgba(255,255,255,0.88)",
                marginBottom: "1.5rem",
              }}
            >
              {content?.heroTitle || (
                <>
                  Startup{" "}
                  <span style={{ fontStyle: "italic" }}>Incubation</span>
                  <br />
                  Program
                </>
              )}
            </h1>

            {/* Sub — Outfit 300 */}
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
                "Transform your idea into a funded, market-ready startup. 6 months of intensive mentorship, resources, and launchpad support."}
            </p>

            {/* CTAs — Outfit 300, plain invert */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                style={{
                  fontFamily: F.body,
                  fontWeight: 400,
                  fontSize: "0.88rem",
                }}
                className="px-8 py-4 bg-white text-black rounded-xl hover:bg-white/90 transition-all duration-300"
              >
                Apply Now
              </Link>
              <a
                href="#how-it-works"
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.88rem",
                }}
                className="px-8 py-4 bg-white/5 border border-white/12 text-white/60 rounded-xl hover:bg-white/8 transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/15 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1 h-1 bg-white/30 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              letterSpacing: "-0.025em",
              textAlign: "center",
              color: "rgba(255,255,255,0.85)",
              marginBottom: "0.75rem",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It <span style={{ fontStyle: "italic" }}>Works</span>
          </motion.h2>
          <motion.p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.35)",
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
            A streamlined four-step journey from idea to launch
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <GlassCard className="p-6 text-center relative hover:border-white/15 transition-all duration-500">
                  {/* Step number — DM Mono */}
                  <div
                    className="absolute -top-3 -right-3 w-7 h-7 bg-white/10 border border-white/15 rounded-full flex items-center justify-center"
                    style={{
                      fontFamily: F.mono,
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="w-14 h-14 mx-auto mb-4 bg-white/6 border border-white/8 rounded-2xl flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-white/45" />
                  </div>
                  <h3
                    style={{
                      fontFamily: F.display,
                      fontWeight: 400,
                      fontSize: "1rem",
                      color: "rgba(255,255,255,0.80)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {step.label}
                  </h3>
                  <p
                    style={{
                      fontFamily: F.body,
                      fontWeight: 300,
                      fontSize: "0.75rem",
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    {step.desc}
                  </p>
                  {i < 3 && (
                    <ChevronRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/15" />
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              letterSpacing: "-0.025em",
              textAlign: "center",
              color: "rgba(255,255,255,0.85)",
              marginBottom: "0.75rem",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What You <span style={{ fontStyle: "italic" }}>Get</span>
          </motion.h2>
          <motion.p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.35)",
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
            Everything you need to build, grow, and launch your startup
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <GlassCard className="p-6 hover:border-white/14 transition-all duration-500 h-full">
                  <div className="w-12 h-12 mb-4 bg-white/6 border border-white/8 rounded-xl flex items-center justify-center">
                    <b.icon className="w-6 h-6 text-white/40" />
                  </div>
                  <h3
                    style={{
                      fontFamily: F.display,
                      fontWeight: 400,
                      fontSize: "0.95rem",
                      color: "rgba(255,255,255,0.78)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {b.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: F.body,
                      fontWeight: 300,
                      fontSize: "0.75rem",
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    {b.desc}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              letterSpacing: "-0.025em",
              textAlign: "center",
              color: "rgba(255,255,255,0.85)",
              marginBottom: "0.75rem",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Success <span style={{ fontStyle: "italic" }}>Stories</span>
          </motion.h2>
          <motion.p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.35)",
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
            Startups that launched from our incubation program
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <GlassCard className="p-6 h-full relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-px bg-white/10 group-hover:bg-white/20 transition-colors duration-500" />
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-amber-400/60" />
                    <span
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      {s.domain}
                    </span>
                    <span
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        color: "rgba(255,255,255,0.20)",
                      }}
                      className="ml-auto"
                    >
                      {s.year}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: F.display,
                      fontWeight: 400,
                      fontSize: "1rem",
                      color: "rgba(255,255,255,0.80)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {s.name}
                  </h3>
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
                    {s.desc}
                  </p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400/60" />
                    <span
                      style={{
                        fontFamily: F.mono,
                        fontSize: "9px",
                        letterSpacing: "0.08em",
                        color: "rgba(52,211,153,0.7)",
                      }}
                    >
                      Raised: INR {s.raised}
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              letterSpacing: "-0.025em",
              textAlign: "center",
              color: "rgba(255,255,255,0.85)",
              marginBottom: "0.75rem",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Eligibility <span style={{ fontStyle: "italic" }}>Criteria</span>
          </motion.h2>
          <motion.p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.35)",
              textAlign: "center",
              marginBottom: "3rem",
              maxWidth: "38ch",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Check if you qualify for the incubation program
          </motion.p>
          <GlassCard className="p-8">
            <div className="space-y-4">
              {eligibility.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <CheckCircle2 className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                  <p
                    style={{
                      fontFamily: F.body,
                      fontWeight: 300,
                      fontSize: "0.82rem",
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.50)",
                    }}
                  >
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
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
                <Rocket className="w-10 h-10 text-white/25 mx-auto mb-5" />
                <h2
                  style={{
                    fontFamily: F.display,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(1.5rem,3.5vw,2.2rem)",
                    letterSpacing: "-0.02em",
                    color: "rgba(255,255,255,0.85)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Ready to Launch Your Startup?
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
                  Applications are open for the next cohort. Don't miss your
                  chance to turn your idea into reality.
                </p>
                <Link
                  to="/register"
                  style={{
                    fontFamily: F.body,
                    fontWeight: 400,
                    fontSize: "0.88rem",
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl hover:bg-white/90 transition-all duration-300"
                >
                  Apply Now <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default IncubationPage;
