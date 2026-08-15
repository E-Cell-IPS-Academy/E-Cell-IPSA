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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// ─── Google Fonts ─────────────────────────────────────────────
// DISPLAY → "Instrument Serif"  — h1 "Frequently Asked Questions", CTA heading
// LABEL   → "DM Mono"           — category filter buttons, "Q" marker, category badge, breadcrumb
// BODY    → "Outfit" 300        — FAQ question text, answer text, descriptions, buttons
function useFonts() {
  useEffect(() => {
    if (document.getElementById("faq-fonts")) return;
    const link = document.createElement("link");
    link.id = "faq-fonts";
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

// Types & static data — unchanged
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const staticFAQs: FAQItem[] = [
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

const FAQPage: React.FC = () => {
  useFonts();
  const { isDark } = useTheme();
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
      const snap = await getDocs(collection(db, "faqs"));
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as FAQItem[];
      setFaqs(data.length > 0 ? data : staticFAQs);
    } catch {
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
    const mc = activeCategory === "All" || faq.category === activeCategory;
    const ms =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return mc && ms;
  });

  const toggleItem = (id: string) =>
    setOpenItems((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  // Floating ? marks — very faint, no purple
  const questionMarks = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 28 + 18,
    rotation: Math.random() * 360,
    duration: Math.random() * 8 + 8,
    delay: Math.random() * 4,
  }));

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-gray-50"}`}>
      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      >
        <div
          className={`absolute inset-0 ${isDark ? "bg-black" : "bg-white"}`}
        />

        {/* Floating ? marks — neutral opacity only */}
        {questionMarks.map((qm) => (
          <motion.div
            key={qm.id}
            className={`absolute font-light select-none pointer-events-none ${isDark ? "text-white/[0.04]" : "text-black/[0.04]"}`}
            style={{ left: `${qm.x}%`, top: `${qm.y}%`, fontSize: qm.size }}
            animate={{
              y: [0, -40, 0],
              rotate: [qm.rotation, qm.rotation + 15, qm.rotation],
              opacity: [0.03, 0.1, 0.03],
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

        {/* Subtle geometric rings — no color */}
        <motion.div
          className={`absolute top-1/4 left-[15%] w-24 h-24 border ${isDark ? "border-white/6" : "border-black/6"} rounded-full`}
          animate={{ rotateZ: [0, 360], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={`absolute bottom-1/4 right-[15%] w-16 h-16 border ${isDark ? "border-white/4" : "border-black/4"} rounded-lg`}
          animate={{ rotateY: [0, 360], rotateX: [0, 180, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Breadcrumb — DM Mono */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-8"
            style={{
              fontFamily: F.mono,
              fontSize: "8px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.32)",
            }}
          >
            <Link to="/" className="hover:opacity-70 transition-opacity">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span>FAQs</span>
          </motion.nav>

          {/* "Got Questions?" pill — DM Mono, neutral */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
            className={`mb-6 inline-flex items-center gap-2 px-4 py-2 ${isDark ? "bg-white/5 border-white/8" : "bg-black/5 border-gray-200"} border rounded-full`}
          >
            <HelpCircle
              className={`w-3.5 h-3.5 ${isDark ? "text-white/40" : "text-gray-400"}`}
            />
            <span
              style={{
                fontFamily: F.mono,
                fontSize: "9px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)",
              }}
            >
              Got Questions?
            </span>
          </motion.div>

          {/* H1 — Instrument Serif, no gradient — plain white/black */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(2rem, 7vw, 4rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.85)",
              marginBottom: "1rem",
            }}
          >
            <span style={{ display: "block" }}>Frequently</span>
            <span style={{ display: "block", fontStyle: "italic" }}>
              Asked Questions
            </span>
          </motion.h1>

          {/* Sub — Outfit 300 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "clamp(0.78rem,1.3vw,0.9rem)",
              color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)",
              lineHeight: 1.75,
              maxWidth: "46ch",
              margin: "0 auto 2.5rem",
            }}
          >
            Find answers to common questions about E-Cell IPS Academy, our
            events, membership, and everything in between.
          </motion.p>

          {/* Search — Outfit 300 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative max-w-xl mx-auto"
          >
            <Search
              className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/30" : "text-gray-400"}`}
            />
            <input
              type="text"
              placeholder="Search your question…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                fontFamily: F.body,
                fontWeight: 300,
                fontSize: "0.85rem",
              }}
              className={`w-full pl-13 pr-6 py-4 ${isDark ? "bg-white/5 border-white/8 text-white placeholder-white/25" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"} border rounded-2xl focus:outline-none focus:border-white/20 backdrop-blur-md transition-all duration-300`}
            />
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ CONTENT ===== */}
      <section ref={contentRef} className="relative py-20 px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* Category Tabs — DM Mono */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {categories.map((cat, i) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                animate={contentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: F.mono,
                  fontSize: "8px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
                className={`px-5 py-2.5 rounded-xl transition-all duration-300 ${
                  activeCategory === cat
                    ? isDark
                      ? "bg-white text-black"
                      : "bg-black text-white" // plain invert, no purple
                    : isDark
                      ? "bg-white/5 text-white/38 border border-white/8 hover:bg-white/10 hover:text-white/65"
                      : "bg-white text-gray-400 border border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {cat}
                <span className="ml-1.5 opacity-50">
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
                <Loader
                  className={`w-7 h-7 ${isDark ? "text-white/30" : "text-gray-400"}`}
                />
              </motion.div>
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.78rem",
                  color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)",
                }}
              >
                Loading FAQs…
              </p>
            </div>
          ) : filteredFAQs.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
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
                        className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                          isOpen
                            ? isDark
                              ? "bg-white/6 border-white/15"
                              : "bg-black/3 border-gray-300"
                            : isDark
                              ? "bg-white/3 border-white/8 hover:bg-white/5 hover:border-white/12"
                              : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <button
                          onClick={() => toggleItem(faq.id)}
                          className="w-full flex items-start gap-4 p-5 text-left"
                        >
                          {/* Q marker — DM Mono, inverted pill */}
                          <div
                            className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 transition-all duration-300 ${isOpen ? (isDark ? "bg-white" : "bg-black") : isDark ? "bg-white/8" : "bg-black/6"}`}
                          >
                            <span
                              style={{
                                fontFamily: F.mono,
                                fontSize: "9px",
                                letterSpacing: "0.05em",
                                color: isOpen
                                  ? isDark
                                    ? "black"
                                    : "white"
                                  : isDark
                                    ? "rgba(255,255,255,0.38)"
                                    : "rgba(0,0,0,0.40)",
                              }}
                            >
                              Q
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Category — DM Mono */}
                            <span
                              style={{
                                fontFamily: F.mono,
                                fontSize: "7px",
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                color: isDark
                                  ? "rgba(255,255,255,0.25)"
                                  : "rgba(0,0,0,0.30)",
                              }}
                              className="block mb-1.5"
                            >
                              {faq.category}
                            </span>

                            {/* Question — Outfit 400 */}
                            <h3
                              style={{
                                fontFamily: F.body,
                                fontWeight: 400,
                                fontSize: "clamp(0.85rem,1.3vw,0.95rem)",
                                lineHeight: 1.4,
                                color: isOpen
                                  ? isDark
                                    ? "rgba(255,255,255,0.90)"
                                    : "rgba(0,0,0,0.88)"
                                  : isDark
                                    ? "rgba(255,255,255,0.65)"
                                    : "rgba(0,0,0,0.62)",
                              }}
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
                              className={`w-4 h-4 ${isOpen ? (isDark ? "text-white/60" : "text-black/60") : isDark ? "text-white/25" : "text-gray-400"}`}
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
                              <div className="px-5 pb-5">
                                <div
                                  className={`ml-11 pl-4 border-l ${isDark ? "border-white/10" : "border-gray-200"}`}
                                >
                                  {/* Answer — Outfit 300 */}
                                  <p
                                    style={{
                                      fontFamily: F.body,
                                      fontWeight: 300,
                                      fontSize: "clamp(0.78rem,1.2vw,0.875rem)",
                                      lineHeight: 1.8,
                                      color: isDark
                                        ? "rgba(255,255,255,0.45)"
                                        : "rgba(0,0,0,0.50)",
                                    }}
                                  >
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
              <HelpCircle
                className={`w-14 h-14 ${isDark ? "text-white/15" : "text-gray-300"} mx-auto mb-4`}
              />
              <h3
                style={{
                  fontFamily: F.display,
                  fontWeight: 400,
                  fontSize: "1.1rem",
                  color: isDark ? "rgba(255,255,255,0.80)" : "rgba(0,0,0,0.75)",
                  marginBottom: "0.4rem",
                }}
              >
                No matching questions found
              </h3>
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.78rem",
                  color: isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.38)",
                  marginBottom: "1.5rem",
                }}
              >
                Try different keywords or browse all categories.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.82rem",
                }}
                className={`px-6 py-3 ${isDark ? "bg-white text-black" : "bg-black text-white"} rounded-xl transition-opacity hover:opacity-80`}
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
              className={`relative p-8 md:p-12 rounded-3xl border ${isDark ? "border-white/8" : "border-gray-200"} overflow-hidden text-center`}
              style={{
                background: isDark
                  ? "linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))"
                  : "linear-gradient(135deg,rgba(0,0,0,0.02),rgba(0,0,0,0.01))",
              }}
            >
              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <div
                    className={`w-14 h-14 ${isDark ? "bg-white/8" : "bg-black/6"} rounded-2xl flex items-center justify-center mx-auto`}
                  >
                    <MessageCircle
                      className={`w-7 h-7 ${isDark ? "text-white/50" : "text-gray-500"}`}
                    />
                  </div>
                </motion.div>

                {/* CTA heading — Instrument Serif */}
                <h3
                  style={{
                    fontFamily: F.display,
                    fontWeight: 400,
                    fontSize: "clamp(1.2rem,2.5vw,1.6rem)",
                    letterSpacing: "-0.015em",
                    color: isDark
                      ? "rgba(255,255,255,0.85)"
                      : "rgba(0,0,0,0.80)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Still have questions?
                </h3>

                {/* CTA body — Outfit 300 */}
                <p
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "clamp(0.75rem,1.2vw,0.875rem)",
                    color: isDark
                      ? "rgba(255,255,255,0.35)"
                      : "rgba(0,0,0,0.40)",
                    lineHeight: 1.75,
                    maxWidth: "40ch",
                    margin: "0 auto 2rem",
                  }}
                >
                  Can't find what you're looking for? Our team is happy to help
                  you with any questions or concerns.
                </p>

                {/* CTA button — plain invert, no purple */}
                <Link
                  to="/contact"
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "0.82rem",
                    letterSpacing: "0.02em",
                  }}
                  className={`inline-flex items-center gap-2 px-7 py-3.5 ${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/85"} rounded-xl transition-all duration-300`}
                >
                  <Sparkles className="w-4 h-4" />
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
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
