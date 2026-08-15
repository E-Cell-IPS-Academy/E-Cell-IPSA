import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Wrench,
  Code,
  BarChart3,
  Palette,
  Megaphone,
  ArrowLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  Image,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";

interface Workshop {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  instructor: string;
  category: string;
  spots: number;
  description: string;
}

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

const WorkshopsPage: React.FC = () => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const staticWorkshops: Workshop[] = [
    {
      id: "1",
      title: "Full-Stack Web Development Bootcamp",
      date: "2026-04-20",
      time: "10:00 AM - 4:00 PM",
      venue: "Tech Lab, IPS Academy",
      instructor: "Prof. Amit Kumar",
      category: "technical",
      spots: 40,
      description:
        "Build a complete MERN stack application from scratch in this intensive hands-on workshop.",
    },
    {
      id: "2",
      title: "Pitch Perfect: Mastering Investor Presentations",
      date: "2026-04-25",
      time: "2:00 PM - 5:00 PM",
      venue: "Auditorium Hall",
      instructor: "Sneha Agarwal",
      category: "business",
      spots: 60,
      description:
        "Learn the art of crafting and delivering compelling pitches that win funding.",
    },
    {
      id: "3",
      title: "UI/UX Design Thinking Workshop",
      date: "2026-05-02",
      time: "11:00 AM - 3:00 PM",
      venue: "Design Studio",
      instructor: "Ravi Shankar",
      category: "design",
      spots: 30,
      description:
        "Human-centered design principles, wireframing, prototyping with Figma.",
    },
    {
      id: "4",
      title: "Digital Marketing for Startups",
      date: "2026-05-10",
      time: "10:00 AM - 1:00 PM",
      venue: "Seminar Hall B",
      instructor: "Priya Thakur",
      category: "marketing",
      spots: 50,
      description:
        "SEO, social media strategy, content marketing, and paid ads on a startup budget.",
    },
    {
      id: "5",
      title: "AI & Machine Learning Essentials",
      date: "2026-05-15",
      time: "9:00 AM - 5:00 PM",
      venue: "Tech Lab, IPS Academy",
      instructor: "Dr. Rakesh Jain",
      category: "technical",
      spots: 35,
      description:
        "Hands-on introduction to ML models, data pipelines, and deploying AI solutions.",
    },
    {
      id: "6",
      title: "Financial Modeling & Valuation",
      date: "2026-05-22",
      time: "2:00 PM - 6:00 PM",
      venue: "Conference Room A",
      instructor: "CA Manish Gupta",
      category: "business",
      spots: 45,
      description:
        "Build financial models, understand unit economics, and learn startup valuation methods.",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentRef = doc(db, "siteContent", "workshops");
        const contentSnap = await getDoc(contentRef);
        if (contentSnap.exists()) setContent(contentSnap.data() as PageContent);

        const q = query(
          collection(db, "events"),
          where("category", "==", "workshop")
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const fetched = snap.docs.map(
            (d) => ({ id: d.id, ...d.data() }) as Workshop
          );
          setWorkshops(fetched);
        } else {
          setWorkshops(staticWorkshops);
        }
      } catch {
        setWorkshops(staticWorkshops);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { id: "all", label: "All Workshops", icon: Sparkles },
    { id: "technical", label: "Technical", icon: Code },
    { id: "business", label: "Business", icon: BarChart3 },
    { id: "design", label: "Design", icon: Palette },
    { id: "marketing", label: "Marketing", icon: Megaphone },
  ];

  const pastHighlights = [
    { title: "Blockchain & Web3 Bootcamp", attendees: 120, rating: 4.8 },
    { title: "Startup Legal Foundations", attendees: 85, rating: 4.6 },
    { title: "Product Management Masterclass", attendees: 95, rating: 4.9 },
    { title: "Data Analytics with Python", attendees: 110, rating: 4.7 },
  ];

  const filteredWorkshops =
    activeCategory === "all"
      ? workshops
      : workshops.filter((w) => w.category === activeCategory);

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      technical: "from-blue-500 to-cyan-500",
      business: "from-purple-500 to-pink-500",
      design: "from-orange-500 to-yellow-500",
      marketing: "from-green-500 to-emerald-500",
    };
    return colors[cat] || "from-purple-500 to-blue-500";
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]"
          animate={{ x: [0, 60, -30, 0], y: [0, -80, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "5%", left: "-5%" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px]"
          animate={{ x: [0, -50, 30, 0], y: [0, 60, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "10%", right: "0%" }}
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
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />

        {/* Floating Gear Animation */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{ rotate: i % 2 === 0 ? [0, 360] : [360, 0] }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Wrench
              className={`w-${6 + i * 2} h-${6 + i * 2} text-purple-500/10`}
              style={{ width: 20 + i * 8, height: 20 + i * 8 }}
            />
          </motion.div>
        ))}

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1 }}
            style={{ perspective: 1000 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-purple-500/20 border border-purple-500/30 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(147,51,234,0.2)",
                  "0 0 40px rgba(147,51,234,0.4)",
                  "0 0 20px rgba(147,51,234,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Wrench className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">
                Hands-on Learning
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6">
              {content?.heroTitle || (
                <>
                  Workshops &{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                    Bootcamps
                  </span>
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              {content?.heroSubtitle ||
                "Level up your skills with intensive workshops led by industry experts. From coding to pitching, we've got you covered."}
            </p>
            <a
              href="#upcoming"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/25"
            >
              View Upcoming <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-purple-400 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Category Filter */}
      <section id="upcoming" className="relative z-10 pt-24 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-center text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Upcoming{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Workshops
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Explore and register for upcoming skill-building sessions
          </motion.p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 border-purple-500/50 text-white shadow-lg shadow-purple-500/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Cards */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                layout
              >
                <GlassCard className="p-6 h-full group hover:border-purple-500/40 transition-all duration-500 relative overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getCategoryColor(w.category)}`}
                  />
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(w.category)} text-white`}
                    >
                      {w.category.charAt(0).toUpperCase() + w.category.slice(1)}
                    </span>
                    <span className="text-gray-500 text-xs ml-auto flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {w.spots} spots
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {w.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {w.description}
                  </p>
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(w.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {w.time}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      {w.venue}
                    </div>
                  </div>
                  <p className="text-purple-400 text-sm font-medium mb-4">
                    Instructor: {w.instructor}
                  </p>
                  <Link
                    to="/register"
                    className="block w-full text-center py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-medium hover:bg-purple-600 hover:border-purple-600 transition-all duration-300"
                  >
                    Register
                  </Link>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          {filteredWorkshops.length === 0 && (
            <motion.p
              className="text-center text-gray-500 py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No workshops in this category yet. Check back soon!
            </motion.p>
          )}
        </div>
      </section>

      {/* Past Highlights */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-center text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Past{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Highlights
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center mb-16 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            A look back at our most impactful workshops
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastHighlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-5 h-full text-center group">
                  <div className="w-full h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl mb-4 flex items-center justify-center border border-white/5">
                    <Image className="w-10 h-10 text-purple-500/30" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">
                    {h.title}
                  </h3>
                  <div className="flex justify-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {h.attendees}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-500">
                      {"*".repeat(Math.round(h.rating))} {h.rating}
                    </span>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
              <div className="relative z-10">
                <Wrench className="w-12 h-12 text-purple-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Want a Custom Workshop?
                </h2>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                  Have a topic in mind? Suggest a workshop or register your
                  interest and we'll make it happen.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/25"
                >
                  Register Interest <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default WorkshopsPage;
