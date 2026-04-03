import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  Loader,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Firebase imports
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// Types
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Static fallback FAQs
const staticFAQs: FAQItem[] = [
  // General
  {
    id: "g1",
    question: "What is E-Cell IPS Academy?",
    answer:
      "E-Cell (Entrepreneurship Cell) IPS Academy is a student-led organization dedicated to fostering the spirit of entrepreneurship among students. We organize events, workshops, mentorship programs, and provide resources to help aspiring entrepreneurs turn their ideas into reality.",
    category: "General",
  },
  {
    id: "g2",
    question: "Who can join E-Cell?",
    answer:
      "Any student currently enrolled at IPS Academy can join E-Cell. We welcome students from all departments and all years. Whether you have a startup idea or simply want to learn about entrepreneurship, there is a place for you.",
    category: "General",
  },
  {
    id: "g3",
    question: "How can I stay updated about E-Cell activities?",
    answer:
      "Follow us on our social media channels (Instagram, LinkedIn, Twitter), subscribe to our newsletter through the website, and join our official WhatsApp community. We also post regular updates on our blog and through campus notices.",
    category: "General",
  },
  // Events
  {
    id: "e1",
    question: "What types of events does E-Cell organize?",
    answer:
      "We organize a wide range of events including startup pitch competitions, hackathons, entrepreneurship workshops, guest speaker sessions, networking meets, business plan competitions, and flagship events like VypaarX and IgniteX. Events are held both on-campus and virtually throughout the year.",
    category: "Events",
  },
  {
    id: "e2",
    question: "How do I register for E-Cell events?",
    answer:
      "Event registrations are available through our website on the respective event pages. Some events may also have registration through external platforms. Follow our social media for early announcements and registration links. Most events are free for IPS Academy students.",
    category: "Events",
  },
  {
    id: "e3",
    question: "Can non-IPS Academy students participate in events?",
    answer:
      "Yes, many of our events are open to students from other colleges as well. Flagship events like VypaarX typically welcome participants from across India. Check individual event pages for specific eligibility criteria and registration details.",
    category: "Events",
  },
  // Membership
  {
    id: "m1",
    question: "How do I become a member of E-Cell?",
    answer:
      "We conduct an annual recruitment drive at the beginning of each academic year. The process typically involves filling out an application form, followed by a task round and personal interview. Keep an eye on our social media channels for recruitment announcements.",
    category: "Membership",
  },
  {
    id: "m2",
    question: "What are the different roles/domains in E-Cell?",
    answer:
      "E-Cell has several domains including Technical, Design, Content & Social Media, Events Management, Public Relations, Marketing & Outreach, and Research & Development. Each domain plays a crucial role in our operations and you can choose based on your interests and skills.",
    category: "Membership",
  },
  {
    id: "m3",
    question: "What are the benefits of being an E-Cell member?",
    answer:
      "Members gain hands-on experience in event management, marketing, technical skills, and leadership. You get access to exclusive workshops, networking opportunities with industry professionals and alumni, certificates, and the chance to be part of a vibrant community of like-minded individuals.",
    category: "Membership",
  },
  // Startups
  {
    id: "s1",
    question: "I have a startup idea. How can E-Cell help?",
    answer:
      "E-Cell provides multiple avenues of support including mentorship from experienced entrepreneurs and faculty, access to resources and tools, networking opportunities with potential co-founders and investors, pitch practice sessions, and guidance on business model development and validation.",
    category: "Startups",
  },
  {
    id: "s2",
    question: "Does E-Cell provide funding for startups?",
    answer:
      "While E-Cell does not directly provide funding, we help connect aspiring entrepreneurs with angel investors, venture capitalists, and government startup schemes. We also organize pitch competitions where winners can receive seed funding and incubation support from our partner organizations.",
    category: "Startups",
  },
  {
    id: "s3",
    question: "Can I get mentorship through E-Cell?",
    answer:
      "Absolutely! We have a network of mentors including successful entrepreneurs, industry professionals, and experienced faculty members. Mentorship sessions are arranged regularly and can be requested through our contact page. We also invite guest mentors during special events.",
    category: "Startups",
  },
  // Technical
  {
    id: "t1",
    question: "Does E-Cell organize technical workshops?",
    answer:
      "Yes, we regularly organize workshops on topics like web development, app development, UI/UX design, digital marketing, data analytics, and other skills essential for entrepreneurs. These workshops are open to all IPS Academy students regardless of E-Cell membership.",
    category: "Technical",
  },
  {
    id: "t2",
    question: "How can I contribute to E-Cell's technical projects?",
    answer:
      "If you are a member of the Technical domain, you directly work on projects like our website, apps, and internal tools. Non-members can contribute through open-source contributions to our GitHub repositories or by participating in our hackathons where technical solutions are built collaboratively.",
    category: "Technical",
  },
  {
    id: "t3",
    question: "What tech stack does E-Cell use for its projects?",
    answer:
      "Our primary web projects use React with TypeScript, Tailwind CSS for styling, Framer Motion for animations, and Firebase for backend services including authentication, database, and hosting. We also work with various other technologies depending on specific project requirements.",
    category: "Technical",
  },
  {
    id: "t4",
    question: "Are there any prerequisites to join E-Cell's technical team?",
    answer:
      "While having a foundation in programming is helpful, we welcome learners at all levels. During recruitment, we look for problem-solving ability, willingness to learn, and passion more than existing technical skills. We provide internal training and mentorship to help you grow.",
    category: "Technical",
  },
];

const categoryColors: Record<string, string> = {
  General: "from-purple-500 to-violet-600",
  Events: "from-blue-500 to-cyan-500",
  Membership: "from-emerald-500 to-teal-500",
  Startups: "from-orange-500 to-amber-500",
  Technical: "from-red-500 to-pink-500",
};

const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const contentInView = useInView(contentRef, { once: true, amount: 0.1 });

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "faqs"));
      if (querySnapshot.empty) {
        setFaqs(staticFAQs);
      } else {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FAQItem[];
        setFaqs(data.length > 0 ? data : staticFAQs);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setFaqs(staticFAQs);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    ...Array.from(new Set(faqs.map((f) => f.category))),
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Floating question marks for hero
  const questionMarks = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 30 + 20,
    rotation: Math.random() * 360,
    duration: Math.random() * 8 + 8,
    delay: Math.random() * 4,
  }));

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/40 to-black" />

        {/* Floating question marks */}
        {questionMarks.map((qm) => (
          <motion.div
            key={qm.id}
            className="absolute text-purple-500/10 font-bold select-none pointer-events-none"
            style={{
              left: `${qm.x}%`,
              top: `${qm.y}%`,
              fontSize: qm.size,
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [qm.rotation, qm.rotation + 20, qm.rotation],
              opacity: [0.05, 0.2, 0.05],
            }}
            transition={{
              duration: qm.duration,
              delay: qm.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ?
          </motion.div>
        ))}

        {/* 3D floating shapes */}
        <motion.div
          className="absolute top-1/4 left-[15%] w-24 h-24 border border-purple-500/20 rounded-full"
          animate={{
            rotateZ: [0, 360],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-[15%] w-16 h-16 border border-blue-500/20 rounded-lg"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateY: [0, 360],
            rotateX: [0, 180, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[100px]" />

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
            <span className="text-purple-400">FAQs</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full"
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Got Questions?
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
          >
            <span className="block">Frequently</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400">
              Asked Questions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          >
            Find answers to common questions about E-Cell IPS Academy, our
            events, membership, and everything in between.
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
              placeholder="Search your question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-md transition-all duration-300 text-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section ref={contentRef} className="relative py-20 px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {categories.map((cat, index) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                animate={contentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
                <span className="ml-2 text-xs opacity-70">
                  (
                  {cat === "All"
                    ? faqs.length
                    : faqs.filter((f) => f.category === cat).length}
                  )
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* FAQ Items */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <Loader className="w-8 h-8 text-purple-500" />
              </motion.div>
              <p className="text-gray-400">Loading FAQs...</p>
            </div>
          ) : filteredFAQs.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {filteredFAQs.map((faq, index) => {
                  const isOpen = openItems.has(faq.id);
                  return (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.06 }}
                    >
                      <div
                        className={`backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 ${
                          isOpen
                            ? "bg-white/8 border-purple-500/30 shadow-lg shadow-purple-500/10"
                            : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
                        }`}
                        style={{
                          background: isOpen
                            ? "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.04))"
                            : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                        }}
                      >
                        <button
                          onClick={() => toggleItem(faq.id)}
                          className="w-full flex items-start gap-4 p-6 text-left"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 transition-all duration-300 ${
                              isOpen
                                ? "bg-gradient-to-br from-purple-500 to-blue-500"
                                : "bg-white/10"
                            }`}
                          >
                            <span
                              className={`text-sm font-bold ${
                                isOpen ? "text-white" : "text-gray-400"
                              }`}
                            >
                              Q
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  categoryColors[faq.category]
                                    ? "bg-purple-500/10 text-purple-400"
                                    : "bg-white/10 text-gray-400"
                                }`}
                              >
                                {faq.category}
                              </span>
                            </div>
                            <h3
                              className={`text-lg font-semibold transition-colors ${
                                isOpen ? "text-white" : "text-gray-200"
                              }`}
                            >
                              {faq.question}
                            </h3>
                          </div>

                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0 mt-1"
                          >
                            <ChevronDown
                              className={`w-5 h-5 transition-colors ${
                                isOpen ? "text-purple-400" : "text-gray-500"
                              }`}
                            />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 pl-18">
                                <div className="ml-12 pl-0 border-l-2 border-purple-500/30 pl-4">
                                  <p className="text-gray-300 leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No matching questions found
              </h3>
              <p className="text-gray-400 mb-6">
                Try different keywords or browse all categories.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
              >
                Show All FAQs
              </button>
            </motion.div>
          )}

          {/* Still have questions CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20"
          >
            <div
              className="relative p-8 md:p-12 rounded-3xl border border-white/10 overflow-hidden text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.05))",
              }}
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Still have questions?
                </h3>
                <p className="text-gray-300 max-w-md mx-auto mb-8">
                  Cannot find what you are looking for? Our team is happy to help
                  you with any questions or concerns.
                </p>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                >
                  <Sparkles className="w-5 h-5" />
                  Contact Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
