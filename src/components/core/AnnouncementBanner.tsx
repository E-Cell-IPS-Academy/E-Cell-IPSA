import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Megaphone } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";

interface Announcement {
  text: string;
  linkUrl?: string;
  linkText?: string;
  bgColor?: string;
  isEnabled: boolean;
  expiryDate?: any;
}

const DISMISS_KEY = "announcement-banner-dismissed";

const AnnouncementBanner: React.FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem(DISMISS_KEY) === "true";
  });
  const [needsMarquee, setNeedsMarquee] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Real-time listener for announcement document
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "siteContent", "announcement"),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Announcement;
          setAnnouncement(data);
        } else {
          setAnnouncement(null);
        }
      },
      (error) => {
        console.error("Announcement listener error:", error);
        setAnnouncement(null);
      }
    );

    return () => unsubscribe();
  }, []);

  // Check if text overflows and needs marquee
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;
        setNeedsMarquee(textWidth > containerWidth * 0.75);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [announcement?.text]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "true");
  };

  // Determine visibility
  const isExpired = (() => {
    if (!announcement?.expiryDate) return false;
    const expiry = announcement.expiryDate?.toDate
      ? announcement.expiryDate.toDate()
      : new Date(announcement.expiryDate);
    return expiry < new Date();
  })();

  const shouldShow =
    announcement &&
    announcement.isEnabled &&
    !isExpired &&
    !isDismissed &&
    announcement.text?.trim();

  const gradient =
    announcement?.bgColor ||
    "linear-gradient(135deg, #7c3aed 0%, #6d28d9 25%, #4f46e5 50%, #2563eb 75%, #3b82f6 100%)";

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          }}
          className="relative z-[60] w-full overflow-hidden"
          style={{ background: gradient }}
        >
          {/* Animated shimmer overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
            transition={{
              duration: 4,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />

          {/* Particle dots */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 pointer-events-none"
              style={{
                width: 3 + (i % 3) * 2,
                height: 3 + (i % 3) * 2,
                left: `${15 + i * 14}%`,
                top: "50%",
              }}
              animate={{
                y: [-8, 8, -8],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 2 + i * 0.3,
                ease: "easeInOut",
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}

          <div className="relative flex items-center justify-center px-4 py-2 md:py-2.5">
            {/* Megaphone icon */}
            <motion.div
              className="hidden sm:flex items-center mr-3 flex-shrink-0"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <Megaphone className="w-4 h-4 text-white/80" />
            </motion.div>

            {/* Text container */}
            <div
              ref={containerRef}
              className="flex-1 min-w-0 overflow-hidden mx-2 max-w-3xl"
            >
              {needsMarquee ? (
                <div className="relative overflow-hidden">
                  <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      duration: Math.max(10, (announcement?.text?.length || 0) * 0.25),
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  >
                    <span className="text-white text-xs md:text-sm font-medium px-8">
                      {announcement?.text}
                    </span>
                    <span className="text-white text-xs md:text-sm font-medium px-8">
                      {announcement?.text}
                    </span>
                  </motion.div>
                </div>
              ) : (
                <motion.p
                  className="text-white text-xs md:text-sm font-medium text-center truncate"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <span ref={textRef}>{announcement?.text}</span>
                </motion.p>
              )}
            </div>

            {/* Link button */}
            {announcement?.linkUrl && (
              <motion.a
                href={announcement.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[10px] md:text-xs font-semibold hover:bg-white/25 transition-colors duration-300 mr-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Pulse ring */}
                <motion.span
                  className="absolute inset-0 rounded-full border border-white/40"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
                <span className="relative z-10">
                  {announcement.linkText || "Learn More"}
                </span>
                <ExternalLink className="relative z-10 w-3 h-3" />
              </motion.a>
            )}

            {/* Dismiss button */}
            <motion.button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded-full text-white/60 hover:text-white hover:bg-white/15 transition-all duration-200"
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
