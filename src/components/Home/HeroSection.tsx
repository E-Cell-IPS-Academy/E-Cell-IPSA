import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Star } from "lucide-react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "../../context/ThemeContext";

// ─── Google Fonts ─────────────────────────────────────────────
// DISPLAY → "Instrument Serif"  — hero title
// LABEL   → "DM Mono"           — subtitle, card labels
// BODY    → "Outfit" 300        — description, button
function useFonts() {
  useEffect(() => {
    if (document.getElementById("hero-fonts")) return;
    const link = document.createElement("link");
    link.id = "hero-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400&family=Outfit:wght@300;400&display=swap";
    document.head.appendChild(link);
  }, []);
}

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const DEFAULT_CONTENT: HeroContent = {
  title: "E-CELL | IPS ACADEMY",
  subtitle: "E-cell x IIT Bombay",
  description: "Where E-cell's passion meets IIT Bombay innovation",
  ctaText: "Get in touch",
  ctaLink: "",
};

const HeroSection = () => {
  useFonts();

  const { isDark } = useTheme();
  const [content, setContent] = useState<HeroContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const heroDoc = await getDoc(doc(db, "siteContent", "hero"));
        if (heroDoc.exists()) {
          const data = heroDoc.data();
          setContent({
            title: data.title || DEFAULT_CONTENT.title,
            subtitle: data.subtitle || DEFAULT_CONTENT.subtitle,
            description: data.description || DEFAULT_CONTENT.description,
            ctaText: data.ctaText || DEFAULT_CONTENT.ctaText,
            ctaLink: data.ctaLink || DEFAULT_CONTENT.ctaLink,
          });
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroContent();
  }, []);

  const letters = content.title.split("");

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.3, duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 1.5, duration: 0.8, ease: "easeOut" },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 2.2, duration: 0.6, ease: "easeOut" },
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const glassVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, x: 100 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { delay: 2.5, duration: 1.2, ease: "easeOut" },
    },
  };

  const ctaButton = content.ctaLink ? (
    <motion.a
      href={content.ctaLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative inline-flex items-center gap-3 ${isDark ? "bg-white text-black" : "bg-gray-900 text-white"} px-6 py-3 rounded-full font-light text-sm transition-all duration-300 overflow-hidden`}
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <Star className="w-4 h-4" />
      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
        {content.ctaText}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
    </motion.a>
  ) : (
    <motion.button
      className={`group relative inline-flex items-center gap-3 ${isDark ? "bg-white text-black" : "bg-gray-900 text-white"} px-6 py-3 rounded-full font-light text-sm transition-all duration-300 overflow-hidden`}
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <Star className="w-4 h-4" />
      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
        {content.ctaText}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
    </motion.button>
  );

  return (
    <section
      className={`relative min-h-screen ${isDark ? "bg-black" : "bg-white"} overflow-hidden`}
    >
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 opacity-75 object-cover"
          style={{ minWidth: "100vw", minHeight: "100vh" }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/headerbg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              {loading && (
                <div className="space-y-4 animate-pulse">
                  <div
                    className={`h-10 ${isDark ? "bg-white/10" : "bg-black/5"} rounded-lg w-3/4`}
                  />
                  <div
                    className={`h-6  ${isDark ? "bg-white/5" : "bg-black/5"} rounded-lg w-1/2`}
                  />
                  <div
                    className={`h-4  ${isDark ? "bg-white/5" : "bg-black/5"} rounded-lg w-2/3`}
                  />
                </div>
              )}

              {/* Main Heading — Instrument Serif */}
              <motion.h1
                className={`text-3xl md:text-4xl lg:text-5xl font-thin ${isDark ? "text-white" : "text-gray-900"} leading-tight mb-4 ${loading ? "opacity-0 h-0 overflow-hidden" : ""}`}
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                }}
                initial="hidden"
                animate="visible"
              >
                {letters.map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className="inline-block"
                    style={{
                      transition: `opacity 0.6s ease-out ${index * 0.05 + 0.3}s, transform 0.6s ease-out ${index * 0.05 + 0.3}s`,
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Subtitle — DM Mono */}
              <motion.h2
                className={`${isDark ? "text-purple-300" : "text-purple-600"} mb-3 ${loading ? "opacity-0 h-0 overflow-hidden" : ""}`}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 400,
                  fontSize: "0.82rem",
                  letterSpacing: "0.1em",
                }}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                {content.subtitle}
              </motion.h2>

              {/* Description — Outfit 300 */}
              <motion.p
                className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-8 max-w-lg leading-relaxed ${loading ? "opacity-0 h-0 overflow-hidden" : ""}`}
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.875rem",
                }}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                {content.description}
              </motion.p>

              {!loading && ctaButton}
            </div>

            {/* Right Content - Entrepreneurship Glassmorphism */}
            <motion.div
              className="relative hidden lg:block"
              variants={glassVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="relative w-80 h-96 mx-auto">
                <div
                  className={`absolute inset-0 ${isDark ? "bg-white/5" : "bg-black/5"} backdrop-blur-xl rounded-3xl border ${isDark ? "border-white/10" : "border-gray-200"} overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />

                  <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                    {/* Innovation Metrics — DM Mono */}
                    <div className="space-y-4">
                      <motion.div
                        className={isDark ? "text-gray-400" : "text-gray-500"}
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "9px",
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                        }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        Innovation Metrics
                      </motion.div>

                      <div className="space-y-3">
                        {[
                          {
                            label: "Startup Success",
                            pct: "85%",
                            bar: "85%",
                            colors: "from-green-400 to-emerald-500",
                            delay: 3,
                          },
                          {
                            label: "Innovation Index",
                            pct: "92%",
                            bar: "92%",
                            colors: "from-purple-400 to-blue-500",
                            delay: 3.5,
                          },
                          {
                            label: "Market Impact",
                            pct: "78%",
                            bar: "78%",
                            colors: "from-orange-400 to-red-500",
                            delay: 4,
                          },
                        ].map(({ label, pct, bar, colors, delay }) => (
                          <div key={label} className="space-y-1">
                            <div
                              className={`flex justify-between ${isDark ? "text-gray-300" : "text-gray-600"}`}
                              style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "9px",
                                letterSpacing: "0.05em",
                              }}
                            >
                              <span>{label}</span>
                              <span>{pct}</span>
                            </div>
                            <div
                              className={`h-1 ${isDark ? "bg-white/10" : "bg-black/5"} rounded-full overflow-hidden`}
                            >
                              <motion.div
                                className={`h-full bg-gradient-to-r ${colors}`}
                                initial={{ width: 0 }}
                                animate={{ width: bar }}
                                transition={{
                                  delay,
                                  duration: 2,
                                  ease: "easeOut",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Keywords — DM Mono */}
                    <div className="space-y-3">
                      {["INNOVATE", "CREATE", "DISRUPT", "SCALE"].map(
                        (word, i) => (
                          <motion.div
                            key={word}
                            className={
                              isDark ? "text-white/70" : "text-gray-600"
                            }
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "11px",
                              letterSpacing: "0.18em",
                            }}
                            animate={{ opacity: [0.3, 1, 0.3], x: [0, 5, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.5,
                              ease: "easeInOut",
                            }}
                          >
                            {word}
                          </motion.div>
                        )
                      )}
                    </div>

                    {/* Network Effect — DM Mono */}
                    <div className="space-y-2">
                      <div
                        className={isDark ? "text-gray-400" : "text-gray-500"}
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "9px",
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                        }}
                      >
                        Network Effect
                      </div>
                      <div className="flex items-center justify-between">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`w-2 h-2 ${isDark ? "bg-white/20" : "bg-gray-400/40"} rounded-full`}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.2, 1, 0.2],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`w-1 h-1 ${isDark ? "bg-white/30" : "bg-gray-400/50"} rounded-full`}
                            animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Grid pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-8 grid-rows-12 h-full w-full">
                      {[...Array(96)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`border-r border-b ${isDark ? "border-white/5" : "border-gray-200/30"}`}
                          animate={{ opacity: [0, 0.3, 0] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: (i % 8) * 0.1,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Corner accents */}
                  <div
                    className={`absolute top-4 left-4 w-6 h-6 border-l border-t ${isDark ? "border-white/30" : "border-gray-400/30"}`}
                  />
                  <div
                    className={`absolute top-4 right-4 w-6 h-6 border-r border-t ${isDark ? "border-white/30" : "border-gray-400/30"}`}
                  />
                  <div
                    className={`absolute bottom-4 left-4 w-6 h-6 border-l border-b ${isDark ? "border-white/30" : "border-gray-400/30"}`}
                  />
                  <div
                    className={`absolute bottom-4 right-4 w-6 h-6 border-r border-b ${isDark ? "border-white/30" : "border-gray-400/30"}`}
                  />
                </div>

                {/* Rotating ring */}
                <motion.div
                  className={`absolute -inset-6 rounded-full border ${isDark ? "border-white/5" : "border-gray-200/30"}`}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 ${isDark ? "bg-white/30" : "bg-gray-400/50"} rounded-full`}
                      style={{
                        top: "50%",
                        left: "50%",
                        transformOrigin: "0 0",
                        transform: `rotate(${angle}deg) translate(120px, -2px)`,
                      }}
                      animate={{
                        scale: [0.5, 1.5, 0.5],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.div>

                {/* Pulsing glow */}
                <motion.div
                  className="absolute -inset-12 rounded-3xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-xl"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-0.5 h-0.5 ${isDark ? "bg-white/10" : "bg-gray-400/20"} rounded-full`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
