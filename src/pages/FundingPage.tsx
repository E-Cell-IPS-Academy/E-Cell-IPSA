import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  TrendingUp,
  ArrowLeft,
  ChevronRight,
  Sprout,
  Handshake,
  Landmark,
  Building2,
  FileCheck,
  SearchCheck,
  PresentationIcon,
  Banknote,
  IndianRupee,
  Rocket,
  Users,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

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
    className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl ${className}`}
    style={{
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    }}
  >
    {children}
  </div>
);

/* Animated Counter */
const AnimatedCounter: React.FC<{
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = ({ target, suffix = "", prefix = "", label, icon: Icon }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <GlassCard className="p-6 group hover:border-green-500/40 transition-all duration-500">
        <Icon className="w-8 h-8 text-green-400 mx-auto mb-3" />
        <div className="text-3xl md:text-4xl font-black text-white mb-1">
          {prefix}
          {count.toLocaleString()}
          {suffix}
        </div>
        <p className="text-gray-400 text-sm">{label}</p>
      </GlassCard>
    </motion.div>
  );
};

const FundingPage: React.FC = () => {
  const [content, setContent] = useState<PageContent | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, "siteContent", "funding");
        const snap = await getDoc(docRef);
        if (snap.exists()) setContent(snap.data() as PageContent);
      } catch {
        /* fallback */
      }
    };
    fetchContent();
    window.scrollTo(0, 0);
  }, []);

  const fundingOptions = [
    {
      icon: Sprout,
      title: "Seed Funding",
      desc: "Get initial capital of up to INR 5 lakh to validate your idea, build an MVP, and acquire your first users. Equity-free for qualifying startups.",
      highlights: ["Up to INR 5L", "Equity-free option", "3-month runway"],
    },
    {
      icon: Handshake,
      title: "Angel Investor Network",
      desc: "Access our curated network of 50+ angel investors actively looking to back early-stage startups from IPS Academy alumni.",
      highlights: [
        "50+ investors",
        "Direct introductions",
        "Follow-on funding",
      ],
    },
    {
      icon: Landmark,
      title: "Government Grants",
      desc: "Navigate Startup India, MSME grants, and state-level schemes. We help you identify, apply, and secure government funding.",
      highlights: ["Startup India", "MSME schemes", "Application support"],
    },
    {
      icon: Building2,
      title: "VC Introductions",
      desc: "For growth-stage startups, we facilitate warm introductions to venture capital firms and help you prepare for due diligence.",
      highlights: ["Warm intros", "Pitch prep", "Due diligence support"],
    },
  ];

  const processSteps = [
    {
      icon: FileCheck,
      label: "Apply",
      desc: "Submit your startup profile, traction metrics, and funding requirements",
    },
    {
      icon: SearchCheck,
      label: "Review",
      desc: "Our investment committee evaluates your application and market potential",
    },
    {
      icon: PresentationIcon,
      label: "Pitch",
      desc: "Present to our panel of investors and mentors in a structured pitch session",
    },
    {
      icon: Banknote,
      label: "Fund",
      desc: "Receive funding, sign agreements, and get post-investment support",
    },
  ];

  const metrics = [
    {
      target: 85,
      suffix: "L+",
      prefix: "INR ",
      label: "Total Funding Raised",
      icon: IndianRupee,
    },
    { target: 24, suffix: "+", label: "Startups Funded", icon: Rocket },
    { target: 50, suffix: "+", label: "Investor Network", icon: Users },
    { target: 92, suffix: "%", label: "Success Rate", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-green-600/8 blur-[130px]"
          animate={{ x: [0, 70, -40, 0], y: [0, -70, 50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-5%", left: "-10%" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]"
          animate={{ x: [0, -60, 35, 0], y: [0, 80, -45, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "-5%", right: "-8%" }}
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

      {/* Hero */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center pt-20"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/15 via-black to-black" />

        {/* Growth Chart Animation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg
            width="600"
            height="400"
            viewBox="0 0 600 400"
            className="overflow-visible"
          >
            <motion.path
              d="M 50 350 Q 150 320 200 280 T 350 180 T 500 60"
              fill="none"
              stroke="url(#growthGrad)"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
            <defs>
              <linearGradient
                id="growthGrad"
                x1="0%"
                y1="100%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Rising Particles */}
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/50 rounded-full"
            style={{ left: `${Math.random() * 100}%`, bottom: "0%" }}
            animate={{
              y: [0, -(200 + Math.random() * 400)],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
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
            transition={{ duration: 1 }}
            style={{ perspective: 1000 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-green-500/20 border border-green-500/30 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(34,197,94,0.2)",
                  "0 0 40px rgba(34,197,94,0.4)",
                  "0 0 20px rgba(34,197,94,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium">
                Fuel Your Growth
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6">
              {content?.heroTitle || (
                <>
                  Funding{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-purple-400">
                    Support
                  </span>
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              {content?.heroSubtitle ||
                "From seed capital to VC introductions, we help promising startups access the funding they need to scale."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-green-500/25"
              >
                Apply for Funding
              </Link>
              <a
                href="#options"
                className="px-8 py-4 bg-white/5 border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Explore Options
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-green-400 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Funding Options */}
      <section id="options" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-center text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Funding{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Options
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center mb-16 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Multiple pathways to secure the capital your startup needs
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fundingOptions.map((opt, i) => (
              <motion.div
                key={opt.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <GlassCard className="p-8 h-full group hover:border-green-500/40 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <motion.div
                    className="w-14 h-14 mb-5 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-green-500/20"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <opt.icon className="w-7 h-7 text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {opt.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">
                    {opt.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {opt.highlights.map((h) => (
                      <span
                        key={h}
                        className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-green-900/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-center text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-400">
              Process
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center mb-16 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            A clear, founder-friendly path from application to funding
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <GlassCard className="p-6 text-center relative group hover:border-green-500/40 transition-all duration-500">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-500/30">
                    {i + 1}
                  </div>
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-green-500/20"
                    whileHover={{ scale: 1.1, rotateZ: 5 }}
                  >
                    <step.icon className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {step.label}
                  </h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                  {i < 3 && (
                    <ChevronRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500/50" />
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-center text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              Impact
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center mb-16 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Numbers that reflect our commitment to startup success
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((m) => (
              <AnimatedCounter key={m.label} {...m} />
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
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-purple-600/10" />
              <div className="relative z-10">
                <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Ready to Get Funded?
                </h2>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                  Apply now and let us connect you with the right funding
                  opportunities for your startup's stage and vision.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-green-500/25"
                >
                  Apply for Funding <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FundingPage;
