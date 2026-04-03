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

const IncubationPage: React.FC = () => {
  const [content, setContent] = useState<PageContent | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, "siteContent", "incubation");
        const snap = await getDoc(docRef);
        if (snap.exists()) setContent(snap.data() as PageContent);
      } catch {
        /* fallback to static */
      }
    };
    fetchContent();
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    { icon: Send, label: "Apply", desc: "Submit your startup idea with a pitch deck and vision statement" },
    { icon: FileSearch, label: "Screen", desc: "Our panel reviews your application for feasibility and innovation" },
    { icon: FlaskConical, label: "Incubate", desc: "Get hands-on mentorship, workspace, and resources for 6 months" },
    { icon: Rocket, label: "Launch", desc: "Go to market with demo day, investor pitches, and launch support" },
  ];

  const benefits = [
    { icon: Building2, title: "Office Space", desc: "Dedicated co-working space with high-speed internet and meeting rooms" },
    { icon: Users, title: "Mentorship", desc: "1-on-1 sessions with industry veterans and serial entrepreneurs" },
    { icon: DollarSign, title: "Funding Access", desc: "Seed funding opportunities and investor introductions" },
    { icon: Network, title: "Network", desc: "Access to 500+ alumni entrepreneurs and industry connections" },
    { icon: Scale, title: "Legal Support", desc: "Free legal consultations for incorporation, IP, and compliance" },
    { icon: Cpu, title: "Tech Resources", desc: "Cloud credits, development tools, and technical infrastructure" },
  ];

  const successStories = [
    { name: "NexGen Solutions", domain: "EdTech", raised: "12L", desc: "AI-powered personalized learning platform now serving 50K+ students", year: "2024" },
    { name: "GreenPulse", domain: "CleanTech", raised: "18L", desc: "Smart waste management system deployed across 3 municipalities", year: "2023" },
    { name: "FinLit", domain: "FinTech", raised: "8L", desc: "Financial literacy app helping rural communities manage micro-investments", year: "2024" },
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
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]"
          animate={{ x: [0, 100, -50, 0], y: [0, -80, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-10%", left: "-10%" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]"
          animate={{ x: [0, -80, 50, 0], y: [0, 100, -60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "-10%", right: "-10%" }}
        />
      </div>

      {/* Back Button */}
      <motion.div
        className="fixed top-24 left-6 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center pt-20"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-black to-black" />

        {/* 3D Rocket Animation */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Rocket className="w-[400px] h-[400px] text-purple-500" strokeWidth={0.5} />
        </motion.div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -80],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
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
            initial={{ opacity: 0, y: 40, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ perspective: 1000 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-purple-500/20 border border-purple-500/30 rounded-full"
              animate={{ boxShadow: ["0 0 20px rgba(147,51,234,0.2)", "0 0 40px rgba(147,51,234,0.4)", "0 0 20px rgba(147,51,234,0.2)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Rocket className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Now Accepting Applications</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6">
              {content?.heroTitle || (
                <>
                  Startup{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                    Incubation
                  </span>
                  <br />
                  Program
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              {content?.heroSubtitle ||
                "Transform your idea into a funded, market-ready startup. 6 months of intensive mentorship, resources, and launchpad support."}
            </p>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                Apply Now
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-white/5 border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <motion.div className="w-1.5 h-1.5 bg-purple-400 rounded-full" animate={{ y: [0, 16, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </motion.section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-center text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Works</span>
          </motion.h2>
          <motion.p className="text-gray-400 text-center mb-16 max-w-xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            A streamlined four-step journey from idea to launch
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <GlassCard className="p-6 text-center relative group hover:border-purple-500/40 transition-all duration-500">
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/30">
                    {i + 1}
                  </div>
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-purple-500/20"
                    whileHover={{ scale: 1.1, rotateZ: 5 }}
                  >
                    <step.icon className="w-8 h-8 text-purple-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.label}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                  {i < 3 && (
                    <ChevronRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-500/50" />
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-center text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What You{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Get</span>
          </motion.h2>
          <motion.p className="text-gray-400 text-center mb-16 max-w-xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Everything you need to build, grow, and launch your startup
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <GlassCard className="p-6 group hover:border-purple-500/40 transition-all duration-500 h-full">
                  <motion.div
                    className="w-14 h-14 mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-500"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <b.icon className="w-7 h-7 text-purple-400" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
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
            className="text-4xl md:text-5xl font-black text-center text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Success{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Stories</span>
          </motion.h2>
          <motion.p className="text-gray-400 text-center mb-16 max-w-xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
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
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-purple-400 text-sm font-medium">{s.domain}</span>
                    <span className="ml-auto text-gray-500 text-xs">{s.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{s.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{s.desc}</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-semibold text-sm">Raised: INR {s.raised}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-center text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Eligibility{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Criteria</span>
          </motion.h2>
          <motion.p className="text-gray-400 text-center mb-12 max-w-xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
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
                  <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">{item}</p>
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
              <div className="relative z-10">
                <Rocket className="w-12 h-12 text-purple-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Ready to Launch Your Startup?
                </h2>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                  Applications are open for the next cohort. Don't miss your chance to turn your idea into reality.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/25"
                >
                  Apply Now <ChevronRight className="w-5 h-5" />
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
