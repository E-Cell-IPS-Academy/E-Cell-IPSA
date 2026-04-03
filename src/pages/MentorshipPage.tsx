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

const MentorshipPage: React.FC = () => {
  const [content, setContent] = useState<PageContent | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, "siteContent", "mentorship");
        const snap = await getDoc(docRef);
        if (snap.exists()) setContent(snap.data() as PageContent);
      } catch {
        /* fallback to static */
      }
    };
    fetchContent();
    window.scrollTo(0, 0);
  }, []);

  const mentors = [
    { name: "Dr. Ananya Sharma", role: "CEO, TechNova Solutions", industry: "Technology", expertise: "AI/ML, Product Strategy", exp: "15+ years" },
    { name: "Rajiv Mehta", role: "Partner, Elevate Ventures", industry: "Venture Capital", expertise: "Fundraising, Scaling", exp: "20+ years" },
    { name: "Priya Deshmukh", role: "Founder, GreenBridge", industry: "Sustainability", expertise: "Impact Investing, Operations", exp: "12+ years" },
    { name: "Vikram Joshi", role: "CTO, PayFlow", industry: "FinTech", expertise: "Engineering, Architecture", exp: "18+ years" },
    { name: "Neha Kulkarni", role: "CMO, BrandSpark", industry: "Marketing", expertise: "Growth Hacking, Branding", exp: "10+ years" },
    { name: "Arjun Patel", role: "Co-founder, LegalEase", industry: "LegalTech", expertise: "Compliance, IP Strategy", exp: "14+ years" },
  ];

  const steps = [
    { icon: UserPlus, label: "Match", desc: "We pair you with a mentor aligned to your domain, stage, and goals" },
    { icon: Handshake, label: "Meet", desc: "Bi-weekly 1-on-1 sessions — structured yet flexible to your needs" },
    { icon: TrendingUp, label: "Grow", desc: "Set milestones, tackle challenges, and iterate on your strategy" },
    { icon: Award, label: "Succeed", desc: "Graduate with clarity, connections, and a roadmap for the future" },
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
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]"
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 80, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "10%", right: "-5%" }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[130px]"
          animate={{ x: [0, -60, 40, 0], y: [0, 70, -50, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "5%", left: "-8%" }}
        />
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <motion.line x1="10%" y1="20%" x2="90%" y2="80%" stroke="url(#grad)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }} />
          <motion.line x1="80%" y1="10%" x2="20%" y2="90%" stroke="url(#grad)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 1 }} />
          <defs><linearGradient id="grad"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs>
        </svg>
      </div>

      {/* Back Button */}
      <motion.div className="fixed top-24 left-6 z-50" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm">Back</span>
        </Link>
      </motion.div>

      {/* Hero */}
      <motion.section className="relative min-h-screen flex items-center justify-center pt-20" style={{ y: heroY, opacity: heroOpacity }}>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />

        {/* Network Nodes Animation */}
        {[...Array(12)].map((_, i) => {
          const x = 15 + Math.random() * 70;
          const y = 15 + Math.random() * 70;
          return (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-purple-500/30 rounded-full"
              style={{ left: `${x}%`, top: `${y}%` }}
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
            />
          );
        })}

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40, rotateX: 15 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 1 }} style={{ perspective: 1000 }}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-purple-500/20 border border-purple-500/30 rounded-full"
              animate={{ boxShadow: ["0 0 20px rgba(147,51,234,0.2)", "0 0 40px rgba(147,51,234,0.4)", "0 0 20px rgba(147,51,234,0.2)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Connect. Learn. Grow.</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6">
              {content?.heroTitle || (
                <>
                  Mentorship{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Program</span>
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              {content?.heroSubtitle || "Get paired with industry veterans who've been where you are. 1-on-1 guidance to accelerate your entrepreneurial journey."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/25">
                Apply as Mentee
              </Link>
              <a href="#mentors" className="px-8 py-4 bg-white/5 border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300">
                Meet Our Mentors
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2" animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <motion.div className="w-1.5 h-1.5 bg-purple-400 rounded-full" animate={{ y: [0, 16, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </motion.section>

      {/* Mentor Profiles */}
      <section id="mentors" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 className="text-4xl md:text-5xl font-black text-center text-white mb-4" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Mentors</span>
          </motion.h2>
          <motion.p className="text-gray-400 text-center mb-16 max-w-xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Industry leaders committed to shaping the next generation of entrepreneurs
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 30, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-6 group hover:border-purple-500/40 transition-all duration-500 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar Placeholder */}
                    <motion.div
                      className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-500/20 flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.6 }}
                    >
                      <span className="text-2xl font-bold text-purple-300">{m.name.split(" ").map((n) => n[0]).join("")}</span>
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{m.name}</h3>
                      <p className="text-purple-400 text-sm">{m.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 text-sm">{m.industry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 text-sm">{m.expertise}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 text-sm">{m.exp} experience</span>
                    </div>
                  </div>
                  <motion.div className="flex items-center gap-2 text-purple-400 hover:text-purple-300 cursor-pointer" whileHover={{ x: 5 }}>
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm font-medium">Connect</span>
                  </motion.div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How Mentorship Works */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.h2 className="text-4xl md:text-5xl font-black text-center text-white mb-4" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Works</span>
          </motion.h2>
          <motion.p className="text-gray-400 text-center mb-16 max-w-xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            A structured yet flexible mentorship journey
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.label} initial={{ opacity: 0, y: 40, rotateY: -15 }} whileInView={{ opacity: 1, y: 0, rotateY: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}>
                <GlassCard className="p-6 text-center relative group hover:border-purple-500/40 transition-all duration-500">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/30">{i + 1}</div>
                  <motion.div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-purple-500/20" whileHover={{ scale: 1.1, rotateZ: 5 }}>
                    <step.icon className="w-8 h-8 text-purple-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.label}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                  {i < 3 && <ChevronRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-500/50" />}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 className="text-4xl md:text-5xl font-black text-center text-white mb-4" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Mentee{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Voices</span>
          </motion.h2>
          <motion.p className="text-gray-400 text-center mb-16 max-w-xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Hear from those who've been through the program
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}>
                <GlassCard className="p-6 h-full relative">
                  <Quote className="w-8 h-8 text-purple-500/30 mb-4" />
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-300">{t.name.split(" ").map((n) => n[0]).join("")}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-purple-400 text-xs">{t.role}</p>
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
              <div className="relative z-10">
                <Users className="w-12 h-12 text-purple-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Join the Mentorship Network</h2>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">Whether you want to mentor or be mentored, there's a place for you in our ecosystem.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/25">
                    Apply as Mentee <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300">
                    Become a Mentor
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MentorshipPage;
