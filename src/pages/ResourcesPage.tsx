import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileText,
  Compass,
  Wrench,
  Video,
  GraduationCap,
  Search,
  Download,
  ExternalLink,
  Star,
  ChevronRight,
  Loader,
  Sparkles,
  Library,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Firebase imports
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// Types
interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "download" | "link";
  url: string;
  icon?: string;
  featured?: boolean;
  tags: string[];
  author?: string;
  date?: string;
}

interface ResourceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  description: string;
}

// Static fallback data
const staticResources: Resource[] = [
  {
    id: "1",
    title: "Startup Playbook: From Idea to MVP",
    description:
      "A comprehensive guide covering ideation, validation, market research, and building your first minimum viable product.",
    category: "E-Books",
    type: "download",
    url: "#",
    featured: true,
    tags: ["startup", "mvp", "ideation"],
    author: "E-Cell IPSA",
    date: "2025-12-01",
  },
  {
    id: "2",
    title: "Business Model Canvas Template",
    description:
      "Editable canvas template to map out your business model, value propositions, customer segments, and revenue streams.",
    category: "Templates",
    type: "download",
    url: "#",
    featured: true,
    tags: ["business-model", "template", "planning"],
    author: "E-Cell IPSA",
    date: "2025-11-15",
  },
  {
    id: "3",
    title: "Pitch Deck Masterclass",
    description:
      "Learn how to create compelling pitch decks that capture investor attention and communicate your vision effectively.",
    category: "Guides",
    type: "link",
    url: "#",
    featured: true,
    tags: ["pitch", "investors", "presentation"],
    author: "E-Cell IPSA",
    date: "2025-10-20",
  },
  {
    id: "4",
    title: "Financial Modeling Toolkit",
    description:
      "Excel-based financial modeling toolkit with revenue projections, cash flow statements, and valuation calculators.",
    category: "Tools",
    type: "download",
    url: "#",
    tags: ["finance", "modeling", "excel"],
    author: "E-Cell IPSA",
    date: "2025-09-10",
  },
  {
    id: "5",
    title: "How to Validate Your Startup Idea",
    description:
      "Video series covering customer discovery interviews, landing page tests, and market analysis techniques.",
    category: "Videos",
    type: "link",
    url: "#",
    tags: ["validation", "customer-discovery", "video"],
    author: "E-Cell IPSA",
    date: "2025-08-05",
  },
  {
    id: "6",
    title: "Entrepreneurship 101 Course",
    description:
      "Self-paced online course covering fundamentals of entrepreneurship, lean methodology, and growth strategies.",
    category: "Courses",
    type: "link",
    url: "#",
    featured: true,
    tags: ["course", "fundamentals", "lean"],
    author: "E-Cell IPSA",
    date: "2025-07-20",
  },
  {
    id: "7",
    title: "Legal Essentials for Startups",
    description:
      "Guide covering company registration, intellectual property, co-founder agreements, and compliance basics in India.",
    category: "E-Books",
    type: "download",
    url: "#",
    tags: ["legal", "registration", "compliance"],
    author: "E-Cell IPSA",
    date: "2025-06-15",
  },
  {
    id: "8",
    title: "Digital Marketing Cheat Sheet",
    description:
      "Quick-reference guide for SEO, social media marketing, content strategy, and growth hacking for early-stage startups.",
    category: "Guides",
    type: "download",
    url: "#",
    tags: ["marketing", "seo", "growth"],
    author: "E-Cell IPSA",
    date: "2025-05-10",
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  "E-Books": <BookOpen className="w-6 h-6" />,
  Templates: <FileText className="w-6 h-6" />,
  Guides: <Compass className="w-6 h-6" />,
  Tools: <Wrench className="w-6 h-6" />,
  Videos: <Video className="w-6 h-6" />,
  Courses: <GraduationCap className="w-6 h-6" />,
};

const categoryColors: Record<string, string> = {
  "E-Books": "from-purple-500 to-violet-600",
  Templates: "from-blue-500 to-cyan-500",
  Guides: "from-emerald-500 to-teal-500",
  Tools: "from-orange-500 to-amber-500",
  Videos: "from-red-500 to-pink-500",
  Courses: "from-indigo-500 to-blue-600",
};

const categoryDescriptions: Record<string, string> = {
  "E-Books": "In-depth reads on startup building",
  Templates: "Ready-to-use documents & canvases",
  Guides: "Step-by-step how-to walkthroughs",
  Tools: "Calculators, toolkits & utilities",
  Videos: "Visual learning & masterclasses",
  Courses: "Structured self-paced programs",
};

// Glassmorphism card component
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
}> = ({ children, className = "", isDark = true }) => (
  <div
    className={`backdrop-blur-md border rounded-2xl ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} ${className}`}
    style={{
      background: isDark
        ? "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))"
        : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
      boxShadow: isDark
        ? "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        : "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
    }}
  >
    {children}
  </div>
);

const ResourcesPage: React.FC = () => {
  const { isDark } = useTheme();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const featuredRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const gridInView = useInView(gridRef, { once: true, amount: 0.2 });
  const featuredInView = useInView(featuredRef, { once: true, amount: 0.2 });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "resources"));
      if (querySnapshot.empty) {
        setResources(staticResources);
      } else {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Resource[];
        setResources(data.length > 0 ? data : staticResources);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResources(staticResources);
    } finally {
      setLoading(false);
    }
  };

  // Build categories from resources
  const categories: ResourceCategory[] = (() => {
    const catCounts: Record<string, number> = {};
    resources.forEach((r) => {
      catCounts[r.category] = (catCounts[r.category] || 0) + 1;
    });
    return Object.entries(catCounts).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      icon: categoryIcons[name] || <BookOpen className="w-6 h-6" />,
      count,
      color: categoryColors[name] || "from-purple-500 to-blue-500",
      description: categoryDescriptions[name] || "",
    }));
  })();

  const filteredResources = resources.filter((r) => {
    const matchesCategory =
      activeCategory === "All" || r.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const featuredResources = resources.filter((r) => r.featured);

  // Floating particles for hero
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-gray-50"}`}>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      >
        {/* Animated background */}
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-br from-black via-purple-950/50 to-black" : "bg-gradient-to-br from-white via-purple-50 to-white"}`} />

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
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* 3D floating book shapes */}
        <motion.div
          className="absolute top-1/4 left-[10%] w-20 h-28 border border-purple-500/30 rounded-lg"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.05))",
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: [0, 15, -15, 0],
            rotateX: [-5, 5, -5],
            y: [-10, 10, -10],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-[12%] w-16 h-22 border border-blue-500/30 rounded-lg"
          style={{
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.05))",
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: [15, -15, 15],
            rotateX: [5, -5, 5],
            y: [10, -10, 10],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/3 right-[25%] w-12 h-16 border border-violet-500/20 rounded-md"
          style={{
            background:
              "linear-gradient(135deg, rgba(167,139,250,0.1), transparent)",
          }}
          animate={{
            rotateY: [-10, 20, -10],
            y: [5, -15, 5],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={`flex items-center justify-center gap-2 text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mb-8`}
          >
            <Link to="/" className="hover:text-purple-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-purple-400">Resources</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full"
          >
            <Library className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Knowledge Hub
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-3xl md:text-4xl font-thin ${isDark ? "text-white" : "text-gray-900"} mb-6 tracking-tight`}
          >
            <span className="block">Resources</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400">
              & Learning
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-sm font-light ${isDark ? "text-gray-300" : "text-gray-600"} max-w-2xl mx-auto mb-10`}
          >
            Everything you need to kickstart your entrepreneurial journey.
            E-Books, templates, tools, and courses curated by E-Cell IPSA.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources, templates, guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-14 pr-6 py-4 ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-gray-200 text-gray-900"} border rounded-2xl placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-md transition-all duration-300 text-sm font-light`}
            />
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section ref={gridRef} className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className={`text-xl font-light ${isDark ? "text-white" : "text-gray-900"} mb-4`}>
              Browse by Category
            </h2>
            <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm font-light max-w-lg mx-auto`}>
              Explore curated resources across different formats and topics
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {/* All filter */}
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory("All")}
              className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
                activeCategory === "All"
                  ? "border-purple-500/50 bg-purple-500/10"
                  : isDark ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10" : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto bg-gradient-to-br from-purple-500 to-blue-500`}
              >
                <Filter className="w-6 h-6 text-white" />
              </div>
              <h3 className={`${isDark ? "text-white" : "text-gray-900"} font-light text-xs mb-1`}>All</h3>
              <p className={`${isDark ? "text-gray-500" : "text-gray-400"} text-xs`}>{resources.length} items</p>
            </motion.button>

            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.name)}
                className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
                  activeCategory === cat.name
                    ? "border-purple-500/50 bg-purple-500/10"
                    : isDark ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10" : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {/* Hover glow */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto bg-gradient-to-br ${cat.color}`}
                >
                  <span className="text-white">{cat.icon}</span>
                </div>
                <h3 className={`${isDark ? "text-white" : "text-gray-900"} font-light text-xs mb-1`}>
                  {cat.name}
                </h3>
                <p className={`${isDark ? "text-gray-500" : "text-gray-400"} text-xs`}>{cat.count} items</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <section ref={featuredRef} className="relative py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featuredInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h2 className={`text-xl font-light ${isDark ? "text-white" : "text-gray-900"}`}>
                Featured Resources
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <GlassCard isDark={isDark} className="p-6 h-full relative overflow-hidden">
                    {/* Gradient accent */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                        categoryColors[resource.category] ||
                        "from-purple-500 to-blue-500"
                      }`}
                    />

                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                          categoryColors[resource.category] ||
                          "from-purple-500 to-blue-500"
                        }`}
                      >
                        <span className="text-white">
                          {categoryIcons[resource.category] || (
                            <BookOpen className="w-5 h-5" />
                          )}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-xs">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    </div>

                    <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"} uppercase tracking-wider`}>
                      {resource.category}
                    </span>
                    <h3 className={`text-sm font-light ${isDark ? "text-white" : "text-gray-900"} mt-1 mb-2 group-hover:text-purple-300 transition-colors line-clamp-2`}>
                      {resource.title}
                    </h3>
                    <p className={`text-xs font-light ${isDark ? "text-gray-400" : "text-gray-500"} mb-4 line-clamp-3`}>
                      {resource.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-0.5 ${isDark ? "bg-white/5" : "bg-black/5"} rounded-full text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
                    >
                      {resource.type === "download" ? (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          Access Resource
                        </>
                      )}
                    </a>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Resources */}
      <section className="relative py-16 px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className={`text-xl font-light ${isDark ? "text-white" : "text-gray-900"}`}>
              {activeCategory === "All"
                ? "All Resources"
                : activeCategory}{" "}
              <span className={`${isDark ? "text-gray-500" : "text-gray-400"} text-sm font-light`}>
                ({filteredResources.length})
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <Loader className="w-8 h-8 text-purple-500" />
              </motion.div>
              <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm font-light`}>Loading resources...</p>
            </div>
          ) : filteredResources.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <GlassCard isDark={isDark} className={`p-6 h-full ${isDark ? "hover:border-white/20" : "hover:border-gray-300"} transition-all duration-300`}>
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${
                            categoryColors[resource.category] ||
                            "from-purple-500 to-blue-500"
                          }`}
                        >
                          <span className="text-white">
                            {categoryIcons[resource.category] || (
                              <BookOpen className="w-5 h-5" />
                            )}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"} uppercase tracking-wider`}>
                            {resource.category}
                          </span>
                          <h3 className={`text-sm font-light ${isDark ? "text-white" : "text-gray-900"} group-hover:text-purple-300 transition-colors line-clamp-2`}>
                            {resource.title}
                          </h3>
                        </div>
                      </div>

                      <p className={`text-xs font-light ${isDark ? "text-gray-400" : "text-gray-500"} mb-4 line-clamp-3`}>
                        {resource.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 ${isDark ? "bg-white/5" : "bg-black/5"} rounded-full text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {resource.author && (
                        <p className={`text-xs ${isDark ? "text-gray-600" : "text-gray-400"} mb-3`}>
                          By {resource.author}
                          {resource.date &&
                            ` | ${new Date(resource.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )}`}
                        </p>
                      )}

                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          resource.type === "download"
                            ? "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20"
                            : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                        }`}
                      >
                        {resource.type === "download" ? (
                          <>
                            <Download className="w-4 h-4" />
                            Download
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            Open Link
                          </>
                        )}
                      </a>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className={`text-sm font-light ${isDark ? "text-white" : "text-gray-900"} mb-2`}>
                No resources found
              </h3>
              <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs font-light mb-6`}>
                Try adjusting your search or category filter.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;
