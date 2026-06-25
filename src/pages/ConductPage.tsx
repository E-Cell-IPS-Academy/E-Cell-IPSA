import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield,
  ChevronRight,
  Heart,
  Star,
  Lightbulb,
  Users,
  Globe,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Mail,
  Phone,
  ArrowUp,
  CheckCircle,
  XCircle,
  MessageCircle,
  Gavel,
} from "lucide-react";
import { Link } from "react-router-dom";

interface TOCItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const tocItems: TOCItem[] = [
  {
    id: "core-values",
    title: "Core Values",
    icon: <Star className="w-4 h-4" />,
  },
  {
    id: "expected-behavior",
    title: "Expected Behavior",
    icon: <ThumbsUp className="w-4 h-4" />,
  },
  {
    id: "unacceptable-behavior",
    title: "Unacceptable Behavior",
    icon: <ThumbsDown className="w-4 h-4" />,
  },
  {
    id: "reporting",
    title: "Reporting Procedures",
    icon: <MessageCircle className="w-4 h-4" />,
  },
  {
    id: "enforcement",
    title: "Enforcement",
    icon: <Gavel className="w-4 h-4" />,
  },
];

const LAST_UPDATED = "March 15, 2026";

const coreValues = [
  {
    title: "Respect",
    description:
      "We treat every individual with dignity and respect, regardless of their background, experience level, or perspective. Diverse viewpoints strengthen our community.",
    icon: Heart,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    title: "Integrity",
    description:
      "We uphold honesty and transparency in all our actions. Academic integrity, honest communication, and ethical behavior are non-negotiable foundations of our community.",
    icon: Shield,
    gradient: "from-purple-500 to-violet-600",
  },
  {
    title: "Innovation",
    description:
      "We encourage bold thinking, creative problem-solving, and the courage to experiment and fail forward. Every great startup began as an unconventional idea.",
    icon: Lightbulb,
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    title: "Collaboration",
    description:
      "We believe in the power of teamwork. Sharing knowledge, supporting peers, and building together multiplies the impact each individual can make.",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Inclusivity",
    description:
      "We actively work to create a welcoming environment where everyone feels valued and empowered to participate, regardless of gender, caste, religion, disability, or socioeconomic background.",
    icon: Globe,
    gradient: "from-emerald-500 to-teal-500",
  },
];

// Glassmorphism card component
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

const CodeOfConductPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("core-values");
  const heroRef = useRef(null);
  const valuesRef = useRef(null);
  const contentRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.2 });
  const contentInView = useInView(contentRef, { once: true, amount: 0.1 });

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      for (const section of sections.reverse()) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Animated particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 4,
  }));

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/30 to-black" />

        {/* Floating particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-purple-500/20"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* 3D shield shape */}
        <motion.div
          className="absolute top-1/4 right-[18%]"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateY: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-20 h-24 border-2 border-purple-500/15 rounded-t-full" />
        </motion.div>

        {/* Pulsating rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-purple-500/10 rounded-full"
          animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-purple-500/5 rounded-full"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-8"
          >
            <Link to="/" className="hover:text-purple-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-purple-400">Code of Conduct</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Community Standards
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
          >
            Code of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400">
              Conduct
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-4"
          >
            Building a safe, inclusive, and respectful community where every
            aspiring entrepreneur can thrive.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-gray-500 text-sm"
          >
            Last updated: {LAST_UPDATED}
          </motion.p>
        </div>
      </section>

      {/* Core Values Section */}
      <section
        id="core-values"
        ref={valuesRef}
        className="relative py-20 px-6 scroll-mt-32"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              These values guide everything we do and how we interact with each
              other
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 40, rotateX: -10 }}
                  animate={valuesInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ duration: 0.7, delay: index * 0.12 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`group ${
                    index === 4 ? "md:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <GlassCard className="p-8 h-full hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden">
                    {/* Animated background glow on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    />

                    <div className="relative z-10">
                      <motion.div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 shadow-lg`}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Expected & Unacceptable Behavior + Reporting + Enforcement */}
      <section ref={contentRef} className="relative py-16 px-6 pb-32">
        <div className="max-w-7xl mx-auto flex gap-12">
          {/* Sticky TOC Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="hidden lg:block w-72 flex-shrink-0"
          >
            <div className="sticky top-32">
              <div
                className="p-6 rounded-2xl border border-white/10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                }}
              >
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Sections
                </h3>
                <nav className="space-y-1">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-300 ${
                        activeSection === item.id
                          ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                          : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={
                          activeSection === item.id
                            ? "text-purple-400"
                            : "text-gray-600"
                        }
                      >
                        {item.icon}
                      </span>
                      {item.title}
                    </button>
                  ))}
                </nav>

                <button
                  onClick={scrollToTop}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white text-sm transition-all duration-300"
                >
                  <ArrowUp className="w-4 h-4" />
                  Back to top
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Expected Behavior */}
            <motion.section
              id="expected-behavior"
              initial={{ opacity: 0, y: 30 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-16 scroll-mt-32"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Expected Behavior
                </h2>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                All members, participants, mentors, sponsors, and guests are
                expected to uphold the following standards in all E-Cell spaces,
                both online and offline:
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: "Be Welcoming & Inclusive",
                    desc: "Use welcoming and inclusive language. Be mindful that your words and actions affect others. Welcome newcomers and help them feel part of the community.",
                  },
                  {
                    title: "Show Respect",
                    desc: "Respect differing viewpoints and experiences. Engage in constructive criticism. Disagree respectfully and seek to understand before seeking to be understood.",
                  },
                  {
                    title: "Collaborate Openly",
                    desc: "Share knowledge freely. Help fellow members learn and grow. Give credit where it is due. Celebrate the successes of others.",
                  },
                  {
                    title: "Act with Integrity",
                    desc: "Be honest in all interactions. Do not plagiarize work or misrepresent your achievements. Uphold academic integrity in all submissions and competitions.",
                  },
                  {
                    title: "Maintain Professionalism",
                    desc: "Conduct yourself professionally in all E-Cell events, meetings, and communications. Represent the organization positively when interacting with external stakeholders.",
                  },
                  {
                    title: "Respect Privacy",
                    desc: "Do not share personal information of others without their consent. Respect confidential discussions, especially regarding startup ideas and business plans shared in mentorship settings.",
                  },
                  {
                    title: "Take Responsibility",
                    desc: "Own your mistakes and learn from them. If you witness something wrong, speak up. If you have caused harm, acknowledge it and work to make amends.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={contentInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl hover:border-emerald-500/20 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Unacceptable Behavior */}
            <motion.section
              id="unacceptable-behavior"
              initial={{ opacity: 0, y: 30 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16 scroll-mt-32"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Unacceptable Behavior
                </h2>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                The following behaviors are considered violations of this Code
                of Conduct and will not be tolerated under any circumstances:
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: "Harassment & Discrimination",
                    desc: "Any form of harassment, bullying, intimidation, or discrimination based on gender, sexual orientation, disability, physical appearance, body size, race, caste, religion, or any other protected characteristic.",
                  },
                  {
                    title: "Offensive Communication",
                    desc: "Use of sexualized language or imagery, unwelcome sexual attention, deliberate intimidation, stalking, following, harassing photography or recording, sustained disruption of talks or events.",
                  },
                  {
                    title: "Academic Dishonesty",
                    desc: "Plagiarism, cheating in competitions, submitting others' work as your own, falsifying information on registration forms, or any form of academic misconduct during E-Cell activities.",
                  },
                  {
                    title: "Intellectual Property Theft",
                    desc: "Stealing or copying startup ideas, business plans, or proprietary information shared in confidence during mentorship sessions, competitions, or team collaborations without explicit permission.",
                  },
                  {
                    title: "Disruptive Behavior",
                    desc: "Deliberately disrupting events, workshops, or meetings. Spreading misinformation about E-Cell or its members. Engaging in behavior that creates an unsafe or hostile environment.",
                  },
                  {
                    title: "Substance Abuse",
                    desc: "Attending E-Cell events under the influence of alcohol or illegal substances. Distribution or promotion of drugs or alcohol at any E-Cell gathering or communication channel.",
                  },
                  {
                    title: "Retaliation",
                    desc: "Retaliating against anyone who reports a violation, participates in an investigation, or otherwise assists in enforcement of this Code of Conduct.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={contentInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                    className="p-5 bg-red-500/5 border border-red-500/10 rounded-xl hover:border-red-500/20 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Reporting Procedures */}
            <motion.section
              id="reporting"
              initial={{ opacity: 0, y: 30 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16 scroll-mt-32"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Reporting Procedures
                </h2>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                If you experience or witness behavior that violates this Code of
                Conduct, please report it promptly. All reports will be handled
                with discretion and confidentiality.
              </p>

              <div className="space-y-6">
                <GlassCard className="p-6">
                  <h4 className="text-white font-semibold text-lg mb-4">
                    How to Report
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Mail className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          Email (Preferred)
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Send a detailed report to{" "}
                          <a
                            href="mailto:ecell@ipsacademy.org"
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            ecell@ipsacademy.org
                          </a>{" "}
                          with the subject line "Code of Conduct Report".
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Phone className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">In Person</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Approach any E-Cell Core Team member or Faculty
                          Advisor at events. During events, designated safety
                          contacts will be identified.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MessageCircle className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          Anonymous Reporting
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          We understand that reporting can be difficult.
                          Anonymous reports can be submitted through our contact
                          form on the website. While anonymity may limit our
                          ability to investigate fully, all reports are taken
                          seriously.
                        </p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h4 className="text-white font-semibold text-lg mb-4">
                    What to Include in a Report
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Your name and contact information (unless reporting anonymously)",
                      "Names of individuals involved (if known)",
                      "Date, time, and location of the incident",
                      "Description of what happened",
                      "Any supporting evidence (screenshots, messages, photos)",
                      "Names of any witnesses",
                      "Any other relevant context",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>
            </motion.section>

            {/* Enforcement Guidelines */}
            <motion.section
              id="enforcement"
              initial={{ opacity: 0, y: 30 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16 scroll-mt-32"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Gavel className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Enforcement Guidelines
                </h2>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Violations of this Code of Conduct will be reviewed by the
                E-Cell Core Team and Faculty Advisor. Actions taken will be
                proportional to the severity of the violation.
              </p>

              <div className="space-y-4">
                {[
                  {
                    level: "Level 1 - Warning",
                    description:
                      "A private, written warning from the E-Cell leadership. The individual will be informed of the nature of the violation and an explanation of why the behavior was inappropriate. A public apology may be requested.",
                    color: "border-yellow-500/20 bg-yellow-500/5",
                    dotColor: "bg-yellow-500",
                  },
                  {
                    level: "Level 2 - Temporary Restriction",
                    description:
                      "Temporary ban from E-Cell events, communication channels, and activities for a specified period. The duration will depend on the severity of the violation. Conditions for reinstatement will be clearly communicated.",
                    color: "border-orange-500/20 bg-orange-500/5",
                    dotColor: "bg-orange-500",
                  },
                  {
                    level: "Level 3 - Permanent Ban",
                    description:
                      "Permanent removal from all E-Cell activities, events, and communication channels. This applies to severe or repeated violations. The individual's membership will be revoked and they will not be eligible for future participation.",
                    color: "border-red-500/20 bg-red-500/5",
                    dotColor: "bg-red-500",
                  },
                  {
                    level: "Level 4 - Institutional Referral",
                    description:
                      "For violations that may also breach IPS Academy's institutional policies or Indian law (e.g., criminal harassment, threats of violence), the matter will be escalated to the college administration and/or law enforcement authorities as appropriate.",
                    color: "border-red-700/20 bg-red-700/5",
                    dotColor: "bg-red-700",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.level}
                    initial={{ opacity: 0, x: -20 }}
                    animate={contentInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className={`p-6 rounded-xl border ${item.color} transition-all duration-300`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-3 h-3 ${item.dotColor} rounded-full mt-1.5 flex-shrink-0`}
                      />
                      <div>
                        <h4 className="text-white font-semibold mb-2">
                          {item.level}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Appeals Process */}
              <div className="mt-8">
                <GlassCard className="p-6">
                  <h4 className="text-white font-semibold text-lg mb-3">
                    Appeals Process
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Individuals who receive enforcement actions have the right
                    to appeal within 14 days of receiving the decision. Appeals
                    should be submitted in writing to the Faculty Advisor. The
                    appeal will be reviewed by a committee separate from the
                    original decision-makers. The appeals committee's decision
                    is final.
                  </p>
                </GlassCard>
              </div>

              {/* Final Note */}
              <div className="mt-8 p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      Scope of This Code
                    </h4>
                    <p className="text-sm text-gray-400">
                      This Code of Conduct applies to all E-Cell spaces
                      including but not limited to: in-person events, online
                      meetings, social media channels, WhatsApp groups, Discord
                      servers, email communications, and any other medium used
                      for E-Cell activities. It applies to all members,
                      participants, speakers, sponsors, volunteers, and guests.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                <h4 className="text-white font-semibold mb-3">Questions?</h4>
                <p className="text-sm text-gray-400">
                  If you have questions about this Code of Conduct, please reach
                  out to us at{" "}
                  <a
                    href="mailto:ecell@ipsacademy.org"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    ecell@ipsacademy.org
                  </a>{" "}
                  or visit our{" "}
                  <Link
                    to="/contact"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Contact page
                  </Link>
                  .
                </p>
              </div>
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CodeOfConductPage;
