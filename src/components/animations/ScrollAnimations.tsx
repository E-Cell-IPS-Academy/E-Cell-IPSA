import { useRef, useEffect, useState, Children, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  type MotionValue,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Google Fonts ─────────────────────────────────────────────
// DISPLAY → "Instrument Serif"  — TextReveal heading text
// LABEL   → "DM Mono"           — StackedCard index / accent labels
// BODY    → "Outfit" 300        — StackedCard description
function useFonts() {
  useEffect(() => {
    if (document.getElementById("anim-fonts")) return;
    const link = document.createElement("link");
    link.id = "anim-fonts";
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

// ─────────────────────────────────────────────
// 1. ParallaxSection  — no text, unchanged
// ─────────────────────────────────────────────

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxSection = ({
  children,
  speed = 0.5,
  className = "",
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yRange = 100 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [yRange, -yRange]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 2. FadeInOnScroll  — wrapper only, unchanged
// ─────────────────────────────────────────────

type FadeDirection = "up" | "down" | "left" | "right";

interface FadeInOnScrollProps {
  children: ReactNode;
  direction?: FadeDirection;
  delay?: number;
  duration?: number;
  className?: string;
}

const directionOffsets: Record<FadeDirection, { x: number; y: number }> = {
  up: { x: 0, y: 60 },
  down: { x: 0, y: -60 },
  left: { x: 60, y: 0 },
  right: { x: -60, y: 0 },
};

export const FadeInOnScroll = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className = "",
}: FadeInOnScrollProps) => {
  const offset = directionOffsets[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// 3. StaggerContainer + StaggerItem  — wrappers, unchanged
// ─────────────────────────────────────────────

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: (staggerDelay: number) => ({
    opacity: 1,
    transition: { staggerChildren: staggerDelay, delayChildren: 0.1 },
  }),
};

const staggerItemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggerContainerProps) => (
  <motion.div
    className={className}
    variants={staggerContainerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
    custom={staggerDelay}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "" }: StaggerItemProps) => (
  <motion.div className={className} variants={staggerItemVariants}>
    {children}
  </motion.div>
);

// ─────────────────────────────────────────────
// 4. CardStackSection  — fonts applied to title & description
// ─────────────────────────────────────────────

interface StackCard {
  title: string;
  description: string;
  icon: ReactNode;
  gradient: string;
}

interface CardStackSectionProps {
  cards: StackCard[];
  className?: string;
}

const StackedCard = ({
  card,
  index,
  totalCards,
  scrollYProgress,
}: {
  card: StackCard;
  index: number;
  totalCards: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const cardStart = index / totalCards;
  const cardEnd = (index + 1) / totalCards;

  const scale = useTransform(scrollYProgress, [cardStart, cardEnd], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [cardStart, cardEnd], [1, 0.6]);

  return (
    <motion.div
      className="sticky top-24 w-full"
      style={{
        scale,
        opacity,
        zIndex: index,
        marginTop: index === 0 ? 0 : "-2rem",
      }}
    >
      <div
        className={`relative rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden p-8 md:p-10 ${card.gradient}`}
        style={{ top: `${index * 16}px` }}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
          {/* Icon */}
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl">
            {card.icon}
          </div>

          {/* Text — Instrument Serif title, Outfit 300 body */}
          <div className="space-y-3">
            <h3
              style={{
                fontFamily: F.display,
                fontWeight: 400,
                fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                letterSpacing: "-0.01em",
                color: "rgba(255,255,255,0.90)",
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                fontFamily: F.body,
                fontWeight: 300,
                fontSize: "clamp(0.78rem, 1.3vw, 0.9rem)",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.45)",
                maxWidth: "56ch",
              }}
            >
              {card.description}
            </p>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-blue-500/15 blur-3xl" />
      </div>
    </motion.div>
  );
};

export const CardStackSection = ({
  cards,
  className = "",
}: CardStackSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ minHeight: `${(cards.length + 1) * 40}vh` }}
    >
      <div className="sticky top-0 pt-24 pb-12 space-y-0">
        {cards.map((card, index) => (
          <StackedCard
            key={index}
            card={card}
            index={index}
            totalCards={cards.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 5. TextReveal — Instrument Serif, GSAP powered
// ─────────────────────────────────────────────

interface TextRevealProps {
  text: string;
  className?: string;
}

export const TextReveal = ({ text, className = "" }: TextRevealProps) => {
  useFonts();

  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const words = text.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      wordsRef.current.forEach((word) => {
        if (!word) return;
        gsap.fromTo(
          word,
          { opacity: 0.12, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: word,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-wrap gap-x-3 gap-y-2 ${className}`}
      // Instrument Serif italic for the reveal heading
      style={{ fontFamily: F.display, fontStyle: "italic", fontWeight: 400 }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          ref={(el) => {
            wordsRef.current[i] = el;
          }}
          className="inline-block text-white opacity-[0.12] transition-colors"
        >
          {word}
        </span>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// 6. MagneticHover  — no text, unchanged
// ─────────────────────────────────────────────

interface MagneticHoverProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export const MagneticHover = ({
  children,
  strength = 0.3,
  className = "",
}: MagneticHoverProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{ scale: isHovered ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// 7. ScrollReveal  — wrapper only, unchanged
// ─────────────────────────────────────────────

type RevealDirection = "up" | "down" | "left" | "right";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  className?: string;
}

const revealOffsets: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 80 },
  down: { x: 0, y: -80 },
  left: { x: 80, y: 0 },
  right: { x: -80, y: 0 },
};

export const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const offset = revealOffsets[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, scale: 1 }
          : { opacity: 0, x: offset.x, y: offset.y, scale: 0.95 }
      }
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// 8. CardStack (generic)  — fonts on inner card text if any
// ─────────────────────────────────────────────

interface CardStackProps {
  children: ReactNode;
  className?: string;
}

const CardStackItem = ({
  child,
  index,
  totalCards,
  scrollYProgress,
}: {
  child: ReactNode;
  index: number;
  totalCards: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const cardStart = index / totalCards;
  const cardEnd = (index + 1) / totalCards;

  const scale = useTransform(scrollYProgress, [cardStart, cardEnd], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [cardStart, cardEnd], [1, 0.5]);
  const blurVal = useTransform(scrollYProgress, [cardStart, cardEnd], [0, 4]);
  const filterStr = useTransform(blurVal, (v) => `blur(${v}px)`);

  return (
    <motion.div
      className="sticky top-24 w-full"
      style={{
        scale,
        opacity,
        filter: filterStr,
        zIndex: index,
        marginTop: index === 0 ? 0 : "-1.5rem",
      }}
    >
      <div style={{ transform: `translateY(${index * 16}px)` }}>{child}</div>
    </motion.div>
  );
};

export const CardStack = ({ children, className = "" }: CardStackProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const childArray = Children.toArray(children);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ minHeight: `${(childArray.length + 1) * 40}vh` }}
    >
      <div className="sticky top-0 pt-24 pb-12 space-y-0">
        {childArray.map((child, index) => (
          <CardStackItem
            key={index}
            child={child}
            index={index}
            totalCards={childArray.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
};
