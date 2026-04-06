// ═══════════════════════════════════════════════════════════════
// MentorshipPage.tsx — fonts updated, purple reduced
// ═══════════════════════════════════════════════════════════════
// Save this file as MentorshipPage.tsx in your pages directory

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Users,
  Handshake,
  TrendingUp,
  Award,
  ArrowLeft,
  ChevronRight,
  Quote,
  Briefcase,
  GraduationCap,
  Globe,
  Linkedin,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function useMentorFonts() {
  useEffect(() => {
    if (document.getElementById("mentor-fonts")) return;
    const link = document.createElement("link");
    link.id = "mentor-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400&family=Outfit:wght@300;400&display=swap";
    document.head.appendChild(link);
  }, []);
}
const FM = {
  display: "'Instrument Serif', Georgia, serif",
  mono: "'DM Mono', monospace",
  body: "'Outfit', sans-serif",
};

interface PageContent {
  heroTitle?: string;
  heroSubtitle?: string;
  [key: string]: any;
}

const GlassCardM: React.FC<{
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

const MentorshipPage: React.FC = () => {
  useMentorFonts();
  const [content, setContent] = useState<PageContent | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "siteContent", "mentorship"));
        if (snap.exists()) setContent(snap.data() as PageContent);
      } catch {}
    })();
    window.scrollTo(0, 0);
  }, []);

  const mentors = [
    {
      name: "Dr. Ananya Sharma",
      role: "CEO, TechNova Solutions",
      industry: "Technology",
      expertise: "AI/ML, Product Strategy",
      exp: "15+ years",
    },
    {
      name: "Rajiv Mehta",
      role: "Partner, Elevate Ventures",
      industry: "Venture Capital",
      expertise: "Fundraising, Scaling",
      exp: "20+ years",
    },
    {
      name: "Priya Deshmukh",
      role: "Founder, GreenBridge",
      industry: "Sustainability",
      expertise: "Impact Investing, Operations",
      exp: "12+ years",
    },
    {
      name: "Vikram Joshi",
      role: "CTO, PayFlow",
      industry: "FinTech",
      expertise: "Engineering, Architecture",
      exp: "18+ years",
    },
    {
      name: "Neha Kulkarni",
      role: "CMO, BrandSpark",
      industry: "Marketing",
      expertise: "Growth Hacking, Branding",
      exp: "10+ years",
    },
    {
      name: "Arjun Patel",
      role: "Co-founder, LegalEase",
      industry: "LegalTech",
      expertise: "Compliance, IP Strategy",
      exp: "14+ years",
    },
  ];

  const steps = [
    {
      icon: UserPlus,
      label: "Match",
      desc: "We pair you with a mentor aligned to your domain, stage, and goals",
    },
    {
      icon: Handshake,
      label: "Meet",
      desc: "Bi-weekly 1-on-1 sessions — structured yet flexible to your needs",
    },
    {
      icon: TrendingUp,
      label: "Grow",
      desc: "Set milestones, tackle challenges, and iterate on your strategy",
    },
    {
      icon: Award,
      label: "Succeed",
      desc: "Graduate with clarity, connections, and a roadmap for the future",
    },
  ];

  const testimonials = [
    {
      name: "Arushi Verma",
      role: "Founder, EduPulse",
      text: "My mentor helped me pivot from a failing model to a subscription-based platform. Within 3 months, we hit 10K users. The mentorship program is genuinely life-changing.",
    },
    {
      name: "Karan Singhania",
      role: "Co-founder, AgroSense",
      text: "The structured approach and accountability made all the difference. Our mentor connected us with agricultural cooperatives that became our first paying customers.",
    },
    {
      name: "Meera Nair",
      role: "CEO, StyleLoop",
      text: "Having a mentor who had built and exited a fashion-tech startup was invaluable. She knew exactly which mistakes to help us avoid and which risks were worth taking.",
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.018] blur-[120px]"
          animate={{ x: [0, 60, -30, 0], y: [0, -50, 70, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "10%", right: "-5%" }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-white/[0.012] blur-[130px]"
          animate={{ x: [0, -50, 30, 0], y: [0, 60, -40, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "5%", left: "-8%" }}
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
          style={{ fontFamily: FM.body, fontWeight: 300, fontSize: "0.78rem" }}
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
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.015] via-black to-black" />
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/8 rounded-full"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
            }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/5 border border-white/8 rounded-full">
              <Users className="w-3.5 h-3.5 text-white/35" />
              <span
                style={{
                  fontFamily: FM.mono,
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                Connect. Learn. Grow.
              </span>
            </motion.div>
            <h1
              style={{
                fontFamily: FM.display,
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
                  Mentorship{" "}
                  <span style={{ fontStyle: "italic" }}>Program</span>
                </>
              )}
            </h1>
            <p
              style={{
                fontFamily: FM.body,
                fontWeight: 300,
                fontSize: "clamp(0.82rem,1.5vw,1rem)",
                color: "rgba(255,255,255,0.38)",
                lineHeight: 1.75,
                maxWidth: "46ch",
                margin: "0 auto 2.5rem",
              }}
            >
              {content?.heroSubtitle ||
                "Get paired with industry veterans who've been where you are. 1-on-1 guidance to accelerate your entrepreneurial journey."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                style={{
                  fontFamily: FM.body,
                  fontWeight: 400,
                  fontSize: "0.88rem",
                }}
                className="px-8 py-4 bg-white text-black rounded-xl hover:bg-white/90 transition-all duration-300"
              >
                Apply as Mentee
              </Link>
              <a
                href="#mentors"
                style={{
                  fontFamily: FM.body,
                  fontWeight: 300,
                  fontSize: "0.88rem",
                }}
                className="px-8 py-4 bg-white/5 border border-white/12 text-white/55 rounded-xl hover:bg-white/8 transition-all duration-300"
              >
                Meet Our Mentors
              </a>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/12 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1 h-1 bg-white/25 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Mentors */}
      <section id="mentors" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            style={{
              fontFamily: FM.display,
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
            Our <span style={{ fontStyle: "italic" }}>Mentors</span>
          </motion.h2>
          <motion.p
            style={{
              fontFamily: FM.body,
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
            Industry leaders committed to shaping the next generation of
            entrepreneurs
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCardM className="p-6 hover:border-white/14 transition-all duration-500 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center flex-shrink-0">
                      <span
                        style={{
                          fontFamily: FM.display,
                          fontWeight: 400,
                          fontSize: "1.1rem",
                          color: "rgba(255,255,255,0.55)",
                        }}
                      >
                        {m.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: FM.display,
                          fontWeight: 400,
                          fontSize: "0.9rem",
                          color: "rgba(255,255,255,0.80)",
                        }}
                      >
                        {m.name}
                      </h3>
                      <p
                        style={{
                          fontFamily: FM.mono,
                          fontSize: "8px",
                          letterSpacing: "0.08em",
                          color: "rgba(255,255,255,0.30)",
                        }}
                      >
                        {m.role}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {[
                      { icon: Briefcase, text: m.industry },
                      { icon: GraduationCap, text: m.expertise },
                      { icon: Globe, text: `${m.exp} experience` },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-white/22" />
                        <span
                          style={{
                            fontFamily: FM.body,
                            fontWeight: 300,
                            fontSize: "0.75rem",
                            color: "rgba(255,255,255,0.38)",
                          }}
                        >
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-white/30 hover:text-white/55 cursor-pointer transition-colors">
                    <Linkedin className="w-3.5 h-3.5" />
                    <span
                      style={{
                        fontFamily: FM.mono,
                        fontSize: "8px",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Connect
                    </span>
                  </div>
                </GlassCardM>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            style={{
              fontFamily: FM.display,
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
            How It <span style={{ fontStyle: "italic" }}>Works</span>
          </motion.h2>
          <motion.p
            style={{
              fontFamily: FM.body,
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
            A structured yet flexible mentorship journey
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
                <GlassCardM className="p-6 text-center relative hover:border-white/15 transition-all duration-500">
                  <div
                    className="absolute -top-3 -right-3 w-7 h-7 bg-white/8 border border-white/12 rounded-full flex items-center justify-center"
                    style={{
                      fontFamily: FM.mono,
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="w-14 h-14 mx-auto mb-4 bg-white/5 border border-white/8 rounded-2xl flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-white/40" />
                  </div>
                  <h3
                    style={{
                      fontFamily: FM.display,
                      fontWeight: 400,
                      fontSize: "1rem",
                      color: "rgba(255,255,255,0.78)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {step.label}
                  </h3>
                  <p
                    style={{
                      fontFamily: FM.body,
                      fontWeight: 300,
                      fontSize: "0.75rem",
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.32)",
                    }}
                  >
                    {step.desc}
                  </p>
                  {i < 3 && (
                    <ChevronRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/12" />
                  )}
                </GlassCardM>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            style={{
              fontFamily: FM.display,
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
            Mentee <span style={{ fontStyle: "italic" }}>Voices</span>
          </motion.h2>
          <motion.p
            style={{
              fontFamily: FM.body,
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
            Hear from those who've been through the program
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <GlassCardM className="p-6 h-full">
                  <Quote className="w-7 h-7 text-white/10 mb-4" />
                  <p
                    style={{
                      fontFamily: FM.body,
                      fontWeight: 300,
                      fontSize: "0.78rem",
                      lineHeight: 1.75,
                      color: "rgba(255,255,255,0.42)",
                      marginBottom: "1.5rem",
                      fontStyle: "italic",
                    }}
                  >
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center">
                      <span
                        style={{
                          fontFamily: FM.mono,
                          fontSize: "9px",
                          color: "rgba(255,255,255,0.50)",
                        }}
                      >
                        {t.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: FM.body,
                          fontWeight: 400,
                          fontSize: "0.80rem",
                          color: "rgba(255,255,255,0.72)",
                        }}
                      >
                        {t.name}
                      </p>
                      <p
                        style={{
                          fontFamily: FM.mono,
                          fontSize: "8px",
                          letterSpacing: "0.08em",
                          color: "rgba(255,255,255,0.28)",
                        }}
                      >
                        {t.role}
                      </p>
                    </div>
                  </div>
                </GlassCardM>
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
            <GlassCardM className="p-12 relative overflow-hidden">
              <div className="relative z-10">
                <Users className="w-10 h-10 text-white/22 mx-auto mb-5" />
                <h2
                  style={{
                    fontFamily: FM.display,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(1.5rem,3.5vw,2.2rem)",
                    letterSpacing: "-0.02em",
                    color: "rgba(255,255,255,0.82)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Join the Mentorship Network
                </h2>
                <p
                  style={{
                    fontFamily: FM.body,
                    fontWeight: 300,
                    fontSize: "0.82rem",
                    lineHeight: 1.75,
                    color: "rgba(255,255,255,0.35)",
                    maxWidth: "42ch",
                    margin: "0 auto 2rem",
                  }}
                >
                  Whether you want to mentor or be mentored, there's a place for
                  you in our ecosystem.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/register"
                    style={{
                      fontFamily: FM.body,
                      fontWeight: 400,
                      fontSize: "0.88rem",
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl hover:bg-white/90 transition-all duration-300"
                  >
                    Apply as Mentee <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/contact"
                    style={{
                      fontFamily: FM.body,
                      fontWeight: 300,
                      fontSize: "0.88rem",
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/12 text-white/55 rounded-xl hover:bg-white/8 transition-all duration-300"
                  >
                    Become a Mentor
                  </Link>
                </div>
              </div>
            </GlassCardM>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MentorshipPage;
