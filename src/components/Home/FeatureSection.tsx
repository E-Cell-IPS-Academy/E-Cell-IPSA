import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const ECellStatsSection = () => {
  const { isDark } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Animated counter hook
  const useCounter = (end: number, duration = 2000, delay = 0) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isInView) return;

      const timer = setTimeout(() => {
        let start = 0;
        const increment = end / (duration / 16);
        const counter = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(counter);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);

        return () => clearInterval(counter);
      }, delay);

      return () => clearTimeout(timer);
    }, [isInView, end, duration, delay]);

    return count;
  };

  const years = useCounter(1, 2000, 300);
  const startups = useCounter(3, 2500, 600);
  const funding = useCounter(3, 2000, 900);
  const events = useCounter(20, 2200, 1200);

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => {
        setVideoLoaded(true);
        console.log("Video loaded successfully");
      };

      const handleError = (e: Event) => {
        console.error("Video failed to load:", e);
        setVideoError(true);
      };

      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("error", handleError);

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("error", handleError);
      };
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center"
    >
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: videoLoaded && !videoError ? 0.3 : 0,
            transition: "opacity 1s ease-in-out",
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/aboutbg.mp4" type="video/mp4" />
          <source
            src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Section Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
              className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-500"} tracking-[0.3em] uppercase font-light`}
            >
              WHO WE ARE
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className={`text-3xl md:text-4xl lg:text-5xl font-thin ${isDark ? "text-white" : "text-gray-900"} leading-tight`}
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Your success is
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                our goal
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
              className={`text-lg md:text-xl font-light ${isDark ? "text-gray-300" : "text-gray-600"} leading-relaxed max-w-2xl`}
            >
              We strive to provide cutting-edge entrepreneurial education and
              startup support for aspiring innovators seeking transformational
              growth.
            </motion.p>

            {/* Call to Action */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-light text-sm transition-all duration-300 overflow-hidden shadow-2xl shadow-purple-500/25"
            >
              <span className="relative z-10">Join Our Community</span>
              <motion.div
                className="relative z-10"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>

             
            </motion.button>
          </motion.div>

          {/* Right Content - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="grid grid-cols-2 gap-8 lg:gap-12"
          >
            {/* Stat 1 - Years */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
              }
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-center group"
            >
              <motion.div
                className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-thin ${isDark ? "text-white" : "text-gray-900"} mb-4`}
                style={{ textShadow: "0 0 30px rgba(255,255,255,0.2)" }}
              >
                {years}
              </motion.div>
              <div className={`text-xs md:text-sm ${isDark ? "text-gray-400" : "text-gray-500"} tracking-[0.2em] uppercase`}>
                YEARS OF
                <br />
                EXCELLENCE
              </div>
            </motion.div>

            {/* Stat 2 - Startups */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
              }
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-center group"
            >
              <motion.div
                className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-thin ${isDark ? "text-white" : "text-gray-900"} mb-4`}
                style={{ textShadow: "0 0 30px rgba(255,255,255,0.2)" }}
              >
                {startups}+
              </motion.div>
              <div className={`text-xs md:text-sm ${isDark ? "text-gray-400" : "text-gray-500"} tracking-[0.2em] uppercase`}>
                STARTUPS
                <br />
                INCUBATED
              </div>
            </motion.div>

            {/* Stat 3 - Funding */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
              }
              transition={{ delay: 1.0, duration: 0.8 }}
              className="text-center group"
            >
              <motion.div
                className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-thin ${isDark ? "text-white" : "text-gray-900"} mb-4`}
                style={{ textShadow: "0 0 30px rgba(255,255,255,0.2)" }}
              >
                ₹{funding}Cr
              </motion.div>
              <div className={`text-xs md:text-sm ${isDark ? "text-gray-400" : "text-gray-500"} tracking-[0.2em] uppercase`}>
                FUNDING
                <br />
                FACILITATED
              </div>
            </motion.div>

            {/* Stat 4 - Events */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
              }
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-center group"
            >
              <motion.div
                className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-thin ${isDark ? "text-white" : "text-gray-900"} mb-4`}
                style={{ textShadow: "0 0 30px rgba(255,255,255,0.2)" }}
              >
                {events}+
              </motion.div>
              <div className={`text-xs md:text-sm ${isDark ? "text-gray-400" : "text-gray-500"} tracking-[0.2em] uppercase`}>
                EVENTS &<br />
                WORKSHOPS
              </div>
            </motion.div>
          </motion.div>
        </div>

       
      </div>

    
    </section>
  );
};

export default ECellStatsSection;
