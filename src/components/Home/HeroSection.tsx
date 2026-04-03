import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Star } from "lucide-react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

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

  // Fixed animation variants with proper typing
  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.5,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 2.2,
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };

  const glassVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, x: 100 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        delay: 2.5,
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  const ctaButton = content.ctaLink ? (
    <motion.a
      href={content.ctaLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 overflow-hidden"
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <Star className="w-4 h-4" />
      <span>{content.ctaText}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
    </motion.a>
  ) : (
    <motion.button
      className="group relative inline-flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 overflow-hidden"
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <Star className="w-4 h-4" />
      <span>{content.ctaText}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
    </motion.button>
  );

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 opacity-75 object-cover"
          style={{
            minWidth: "100vw",
            minHeight: "100vh",
          }}
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
              {/* Loading shimmer - subtle, doesn't break layout */}
              {loading && (
                <div className="space-y-4 animate-pulse">
                  <div className="h-10 bg-white/10 rounded-lg w-3/4" />
                  <div className="h-6 bg-white/5 rounded-lg w-1/2" />
                  <div className="h-4 bg-white/5 rounded-lg w-2/3" />
                </div>
              )}

              {/* Main Heading */}
              <motion.h1
                className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 ${loading ? "opacity-0 h-0 overflow-hidden" : ""}`}
                initial="hidden"
                animate="visible"
              >
                {letters.map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className="inline-block"
                    style={{
                      transition: `opacity 0.6s ease-out ${
                        index * 0.05 + 0.3
                      }s, transform 0.6s ease-out ${index * 0.05 + 0.3}s`,
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Subtitle */}
              <motion.h2
                className={`text-lg md:text-xl font-medium text-purple-300 mb-3 ${loading ? "opacity-0 h-0 overflow-hidden" : ""}`}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                {content.subtitle}
              </motion.h2>

              {/* Description */}
              <motion.p
                className={`text-sm md:text-base text-gray-400 mb-8 max-w-lg leading-relaxed ${loading ? "opacity-0 h-0 overflow-hidden" : ""}`}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                {content.description}
              </motion.p>

              {/* CTA Button */}
              {!loading && ctaButton}
            </div>

            {/* Right Content - Entrepreneurship Glassmorphism */}
            <motion.div
              className="relative hidden lg:block"
              variants={glassVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Main Glass Container */}
              <div className="relative w-80 h-96 mx-auto">
                {/* Glassmorphism Card */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />

                  {/* Content inside glass */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                    {/* Top section - Innovation metrics */}
                    <div className="space-y-4">
                      <motion.div
                        className="text-xs text-gray-400 tracking-[0.2em] uppercase"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        Innovation Metrics
                      </motion.div>

                      <div className="space-y-3">
                        {/* Startup Success Rate */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-300">
                            <span>Startup Success</span>
                            <span>85%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                              initial={{ width: 0 }}
                              animate={{ width: "85%" }}
                              transition={{
                                delay: 3,
                                duration: 2,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                        </div>

                        {/* Innovation Index */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-300">
                            <span>Innovation Index</span>
                            <span>92%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-purple-400 to-blue-500"
                              initial={{ width: 0 }}
                              animate={{ width: "92%" }}
                              transition={{
                                delay: 3.5,
                                duration: 2,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                        </div>

                        {/* Market Impact */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-300">
                            <span>Market Impact</span>
                            <span>78%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                              initial={{ width: 0 }}
                              animate={{ width: "78%" }}
                              transition={{
                                delay: 4,
                                duration: 2,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Middle section - Key words */}
                    <div className="space-y-3">
                      {["INNOVATE", "CREATE", "DISRUPT", "SCALE"].map(
                        (word, i) => (
                          <motion.div
                            key={word}
                            className="text-sm font-light text-white/70 tracking-[0.15em]"
                            animate={{
                              opacity: [0.3, 1, 0.3],
                              x: [0, 5, 0],
                            }}
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

                    {/* Bottom section - Network effect */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400 tracking-[0.2em] uppercase">
                        Network Effect
                      </div>
                      <div className="flex items-center justify-between">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-white/20 rounded-full"
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
                            className="w-1 h-1 bg-white/30 rounded-full"
                            animate={{
                              y: [0, -8, 0],
                              opacity: [0.3, 1, 0.3],
                            }}
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

                  {/* Subtle grid pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-8 grid-rows-12 h-full w-full">
                      {[...Array(96)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="border-r border-b border-white/5"
                          animate={{
                            opacity: [0, 0.3, 0],
                          }}
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
                  <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-white/30" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-white/30" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-white/30" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-white/30" />
                </div>

                {/* Rotating innovation ring */}
                <motion.div
                  className="absolute -inset-6 rounded-full border border-white/5"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {/* Small dots on the ring */}
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white/30 rounded-full"
                      style={{
                        top: "50%",
                        left: "50%",
                        transformOrigin: "0 0",
                        transform: `rotate(${angle}deg) translate(${120}px, -2px)`,
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

                {/* Pulsing outer glow */}
                <motion.div
                  className="absolute -inset-12 rounded-3xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
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

      {/* Subtle background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/10 rounded-full"
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
