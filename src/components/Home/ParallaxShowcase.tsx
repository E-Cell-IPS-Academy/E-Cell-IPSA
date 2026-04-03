import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  RocketLaunchIllustration,
  IdeaBulbIllustration,
  GrowthChartIllustration,
  NetworkIllustration,
} from "../illustrations/StartupIllustrations";
import { FadeInOnScroll } from "../animations/ScrollAnimations";

// ─────────────────────────────────────────────
// Animated Counter Hook
// ─────────────────────────────────────────────

const useAnimatedCounter = (
  end: number,
  duration = 2000,
  isInView: boolean
) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

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
  }, [isInView, end, duration]);

  return count;
};

// ─────────────────────────────────────────────
// Stat Badge Component
// ─────────────────────────────────────────────

interface StatBadgeProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  isInView: boolean;
}

const StatBadge = ({
  value,
  suffix = "",
  prefix = "",
  label,
  isInView,
}: StatBadgeProps) => {
  const animatedValue = useAnimatedCounter(value, 2200, isInView);

  return (
    <div className="relative group">
      <div className="relative bg-white/[0.04] backdrop-blur-lg border border-white/[0.08] rounded-2xl p-5 overflow-hidden transition-all duration-500 hover:border-purple-500/30 hover:bg-white/[0.06]">
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500 rounded-2xl" />

        <div className="relative z-10">
          <div className="text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight">
            {prefix}
            {animatedValue}
            {suffix}
          </div>
          <div className="text-xs text-gray-500 tracking-[0.15em] uppercase font-light">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Showcase Section Data
// ─────────────────────────────────────────────

interface ShowcaseSection {
  tag: string;
  title: string;
  titleAccent: string;
  description: string;
  illustration: React.ComponentType<{ className?: string }>;
  stats: StatBadgeProps[];
  accentGradient: string;
}

const sections: ShowcaseSection[] = [
  {
    tag: "IGNITE",
    title: "Launch Your",
    titleAccent: "Startup",
    description:
      "From spark to liftoff -- our incubation program provides the launchpad for your entrepreneurial journey. Access resources, funding guidance, and expert mentorship to transform your idea into a market-ready product.",
    illustration: RocketLaunchIllustration,
    stats: [
      { value: 3, suffix: "+", label: "Startups Launched", isInView: false },
      { value: 85, suffix: "%", label: "Success Rate", isInView: false },
    ],
    accentGradient: "from-purple-500 to-violet-600",
  },
  {
    tag: "CREATE",
    title: "Innovate &",
    titleAccent: "Create",
    description:
      "Fuel your creativity in our innovation labs. Brainstorm, prototype, and iterate with cutting-edge tools, collaborative workshops, and a community that challenges conventional thinking.",
    illustration: IdeaBulbIllustration,
    stats: [
      { value: 20, suffix: "+", label: "Workshops Held", isInView: false },
      { value: 500, suffix: "+", label: "Ideas Generated", isInView: false },
    ],
    accentGradient: "from-amber-500 to-orange-600",
  },
  {
    tag: "SCALE",
    title: "Grow",
    titleAccent: "Together",
    description:
      "Accelerate your growth with data-driven strategies, market analysis, and scaling frameworks developed by our network of successful founders and industry veterans.",
    illustration: GrowthChartIllustration,
    stats: [
      { value: 3, suffix: "Cr+", prefix: "\u20B9", label: "Funding Facilitated", isInView: false },
      { value: 10, suffix: "x", label: "Avg Growth", isInView: false },
    ],
    accentGradient: "from-emerald-500 to-green-600",
  },
  {
    tag: "CONNECT",
    title: "Build Your",
    titleAccent: "Network",
    description:
      "Join a vibrant ecosystem of founders, mentors, investors, and changemakers. Our events, summits, and community platforms create meaningful connections that last beyond the campus.",
    illustration: NetworkIllustration,
    stats: [
      { value: 50, suffix: "+", label: "Active Members", isInView: false },
      { value: 15, suffix: "+", label: "Industry Partners", isInView: false },
    ],
    accentGradient: "from-blue-500 to-cyan-600",
  },
];

// ─────────────────────────────────────────────
// Individual Parallax Row
// ─────────────────────────────────────────────

const ShowcaseRow = ({
  section,
  index,
}: {
  section: ShowcaseSection;
  index: number;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const isReversed = index % 2 !== 0;
  const isInView = useInView(rowRef, { once: true, amount: 0.25 });

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });

  // Parallax: illustration moves slower than scroll
  const illustrationY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  // Text has a subtler parallax
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const Illustration = section.illustration;

  return (
    <div
      ref={rowRef}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background accent glow */}
      <motion.div
        className={`absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.04] bg-gradient-to-r ${section.accentGradient}`}
        style={{
          top: "50%",
          left: isReversed ? "20%" : "60%",
          transform: "translate(-50%, -50%)",
        }}
        animate={
          isInView
            ? { opacity: [0, 0.06, 0.04], scale: [0.8, 1.1, 1] }
            : {}
        }
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <div className="container mx-auto px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
            isReversed ? "lg:direction-rtl" : ""
          }`}
          style={{ direction: isReversed ? "rtl" : "ltr" }}
        >
          {/* Text Side */}
          <motion.div
            className="space-y-8"
            style={{ y: textY, direction: "ltr" }}
          >
            <FadeInOnScroll direction={isReversed ? "right" : "left"} delay={0.1}>
              <div className="space-y-6">
                {/* Tag */}
                <div className="flex items-center gap-3">
                  <div
                    className={`h-px w-10 bg-gradient-to-r ${section.accentGradient}`}
                  />
                  <span className="text-xs tracking-[0.3em] text-gray-500 uppercase font-light">
                    {section.tag}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                  {section.title}{" "}
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-r ${section.accentGradient}`}
                  >
                    {section.titleAccent}
                  </span>
                </h2>

                {/* Description */}
                <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                  {section.description}
                </p>
              </div>
            </FadeInOnScroll>

            {/* Stats */}
            <FadeInOnScroll direction="up" delay={0.3}>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {section.stats.map((stat, i) => (
                  <StatBadge
                    key={i}
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    label={stat.label}
                    isInView={isInView}
                  />
                ))}
              </div>
            </FadeInOnScroll>
          </motion.div>

          {/* Illustration Side */}
          <motion.div
            className="relative flex items-center justify-center"
            style={{ y: illustrationY, direction: "ltr" }}
          >
            {/* Glow ring behind illustration */}
            <motion.div
              className={`absolute inset-0 m-auto w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-r ${section.accentGradient} opacity-0 blur-3xl`}
              animate={
                isInView
                  ? { opacity: [0, 0.1, 0.06], scale: [0.6, 1.1, 1] }
                  : {}
              }
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            />

            {/* Illustration */}
            <motion.div
              className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.85 }
              }
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              {/* Glassmorphism frame */}
              <div className="absolute -inset-4 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm" />

              <div className="relative z-10 w-full h-full p-4">
                <Illustration className="w-full h-full" />
              </div>
            </motion.div>

            {/* Floating accent dots */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-white/20"
                style={{
                  top: `${20 + i * 15}%`,
                  left: `${10 + (i * 20) % 80}%`,
                }}
                animate={{
                  y: [0, -12, 0],
                  opacity: [0.15, 0.5, 0.15],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Divider line */}
      {index < sections.length - 1 && (
        <div className="container mx-auto px-6 lg:px-8 mt-20 md:mt-32">
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

const ParallaxShowcase = () => {
  return (
    <section className="relative bg-black overflow-hidden">
      {/* Section Header */}
      <div className="container mx-auto px-6 lg:px-8 pt-24 pb-8">
        <FadeInOnScroll direction="up">
          <div className="text-center space-y-4">
            <div className="text-xs sm:text-sm text-gray-500 tracking-[0.3em] uppercase font-light">
              OUR ECOSYSTEM
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              The E-Cell{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Experience
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Four pillars that define our entrepreneurial ecosystem
            </p>
          </div>
        </FadeInOnScroll>
      </div>

      {/* Showcase Sections */}
      {sections.map((section, index) => (
        <ShowcaseRow key={index} section={section} index={index} />
      ))}

      {/* Bottom gradient fade */}
      <div className="h-24 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
};

export default ParallaxShowcase;
