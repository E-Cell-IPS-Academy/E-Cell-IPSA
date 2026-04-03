import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Linkedin,
  MapPin,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Loader,
  Users,
  Globe,
  Building2,
  Rocket,
  Trophy,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Network,
} from "lucide-react";
import { Link } from "react-router-dom";

// Firebase imports
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// Types
interface Alumni {
  id: string;
  name: string;
  batch: string;
  role: string;
  company: string;
  photo?: string;
  linkedin?: string;
  location?: string;
  achievement?: string;
}

// Static fallback data
const staticAlumni: Alumni[] = [
  {
    id: "a1",
    name: "Aarav Sharma",
    batch: "2019-2023",
    role: "Co-Founder & CEO",
    company: "NexGen Solutions",
    linkedin: "https://linkedin.com",
    location: "Bangalore, India",
    achievement: "Raised $2M seed funding in 2024",
  },
  {
    id: "a2",
    name: "Priya Patel",
    batch: "2018-2022",
    role: "Product Manager",
    company: "Google India",
    linkedin: "https://linkedin.com",
    location: "Hyderabad, India",
    achievement: "Led launch of Google Pay feature for rural India",
  },
  {
    id: "a3",
    name: "Rohan Verma",
    batch: "2020-2024",
    role: "Founder",
    company: "GreenLeaf AgriTech",
    linkedin: "https://linkedin.com",
    location: "Indore, India",
    achievement: "Winner of Smart India Hackathon 2023",
  },
  {
    id: "a4",
    name: "Sneha Gupta",
    batch: "2017-2021",
    role: "Senior Software Engineer",
    company: "Microsoft",
    linkedin: "https://linkedin.com",
    location: "Pune, India",
    achievement: "Published 3 patents in AI/ML domain",
  },
  {
    id: "a5",
    name: "Vikram Singh",
    batch: "2019-2023",
    role: "Co-Founder & CTO",
    company: "EduSpark Learning",
    linkedin: "https://linkedin.com",
    location: "Delhi, India",
    achievement: "Incubated at IIT Delhi startup hub",
  },
  {
    id: "a6",
    name: "Ananya Joshi",
    batch: "2018-2022",
    role: "Business Analyst",
    company: "McKinsey & Company",
    linkedin: "https://linkedin.com",
    location: "Mumbai, India",
    achievement: "Featured in Forbes 30 Under 30 shortlist",
  },
];

const stats = [
  { label: "Companies Founded", value: "25+", icon: Rocket },
  { label: "Industries Represented", value: "12+", icon: Building2 },
  { label: "Countries", value: "8+", icon: Globe },
  { label: "Alumni Network", value: "200+", icon: Users },
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

const AlumniPage: React.FC = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const spotlightRef = useRef(null);
  const statsRef = useRef(null);
  const achieveRef = useRef(null);
  const ctaRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const spotlightInView = useInView(spotlightRef, { once: true, amount: 0.2 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const achieveInView = useInView(achieveRef, { once: true, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "alumni"));
      if (querySnapshot.empty) {
        setAlumni(staticAlumni);
      } else {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Alumni[];
        setAlumni(data.length > 0 ? data : staticAlumni);
      }
    } catch (error) {
      console.error("Error fetching alumni:", error);
      setAlumni(staticAlumni);
    } finally {
      setLoading(false);
    }
  };

  // Network connection lines for hero
  const nodes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 3,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 3,
  }));

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[75vh] flex items-center justify-center overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/40 to-black" />

        {/* Network nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute rounded-full bg-purple-500/30"
            style={{
              width: node.size,
              height: node.size,
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
            animate={{
              x: [0, Math.random() * 40 - 20, 0],
              y: [0, Math.random() * 40 - 20, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: node.duration,
              delay: node.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Connection lines SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          {nodes.slice(0, 8).map((n1, i) =>
            nodes.slice(i + 1, i + 3).map((n2, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={`${n1.x}%`}
                y1={`${n1.y}%`}
                x2={`${n2.x}%`}
                y2={`${n2.y}%`}
                stroke="rgba(139,92,246,0.3)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 0] }}
                transition={{
                  duration: 6,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))
          )}
        </svg>

        {/* 3D rotating hexagon */}
        <motion.div
          className="absolute top-1/4 right-[15%] w-32 h-32"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateY: [0, 360],
            rotateX: [0, 180, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full border-2 border-purple-500/15 rounded-full" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-[10%] w-20 h-20"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateZ: [0, -360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full border border-blue-500/15 rounded-lg" />
        </motion.div>

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[120px]" />

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
            <span className="text-purple-400">Alumni Network</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full"
          >
            <Network className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Our Community
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
          >
            <span className="block">Alumni</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400">
              Network
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Celebrating the achievements of E-Cell IPSA alumni who are shaping
            the future through innovation and entrepreneurship.
          </motion.p>
        </div>
      </section>

      {/* Where Are They Now Stats */}
      <section ref={statsRef} className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Where Are They Now?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Our alumni are making waves across industries and geographies
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={
                    statsInView
                      ? { opacity: 1, y: 0, scale: 1 }
                      : {}
                  }
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="text-center"
                >
                  <GlassCard className="p-8">
                    <motion.div
                      className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 10 }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <motion.h3
                      className="text-4xl font-bold text-white mb-2"
                      initial={{ opacity: 0 }}
                      animate={statsInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Alumni Spotlight */}
      <section ref={spotlightRef} className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={spotlightInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Alumni Spotlight
            </h2>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <Loader className="w-8 h-8 text-purple-500" />
              </motion.div>
              <p className="text-gray-400">Loading alumni data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={spotlightInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <GlassCard className="p-6 h-full hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden">
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      {/* Photo & Basic Info */}
                      <div className="flex items-start gap-4 mb-5">
                        {person.photo ? (
                          <img
                            src={person.photo}
                            alt={person.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 group-hover:border-purple-500/30 transition-colors"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 border-2 border-white/10 group-hover:border-purple-500/30 transition-colors">
                            <span className="text-2xl font-bold text-white">
                              {person.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                            {person.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-sm text-gray-400">
                              Batch {person.batch}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Role & Company */}
                      <div className="space-y-3 mb-5">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">
                            {person.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="text-gray-300 text-sm font-medium">
                            {person.company}
                          </span>
                        </div>
                        {person.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span className="text-gray-400 text-sm">
                              {person.location}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Achievement */}
                      {person.achievement && (
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 mb-5">
                          <div className="flex items-start gap-2">
                            <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-300">
                              {person.achievement}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* LinkedIn */}
                      {person.linkedin && (
                        <a
                          href={person.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-all duration-300"
                        >
                          <Linkedin className="w-4 h-4" />
                          Connect on LinkedIn
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Achievements Section */}
      <section ref={achieveRef} className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={achieveInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Alumni Achievements
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Our alumni continue to inspire through their remarkable
              achievements
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Startups Launched",
                description:
                  "E-Cell alumni have collectively launched 25+ startups across fintech, edtech, agritech, healthtech and SaaS verticals, raising over $15M in combined funding.",
                icon: Rocket,
                gradient: "from-purple-500 to-violet-600",
              },
              {
                title: "Industry Leaders",
                description:
                  "Our alumni hold key positions at leading companies including Google, Microsoft, McKinsey, Amazon, and Flipkart, driving innovation at scale.",
                icon: Briefcase,
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                title: "Community Impact",
                description:
                  "Many alumni actively give back as mentors, guest speakers, and judges at E-Cell events, creating a strong cycle of knowledge sharing and community building.",
                icon: Users,
                gradient: "from-emerald-500 to-teal-500",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={achieveInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -5 }}
                >
                  <GlassCard className="p-8 h-full">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Join Alumni Network CTA */}
      <section ref={ctaRef} className="relative py-20 px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div
              className="relative p-8 md:p-16 rounded-3xl border border-white/10 overflow-hidden text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.06))",
              }}
            >
              {/* Background accents */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block mb-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
                    <Network className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Join the Alumni Network
                </h3>
                <p className="text-gray-300 max-w-lg mx-auto mb-8 text-lg">
                  Are you an E-Cell IPSA alumnus? Stay connected, mentor
                  current students, and be part of our growing community of
                  changemakers.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://forms.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                  >
                    <Sparkles className="w-5 h-5" />
                    Register as Alumni
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AlumniPage;
