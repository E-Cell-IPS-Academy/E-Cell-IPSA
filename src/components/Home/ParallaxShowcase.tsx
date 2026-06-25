/**
 * ParallaxShowcase — Font Architecture
 * ──────────────────────────────────────────────────────────────
 *  DISPLAY  → "Instrument Serif" italic (400)
 *             Used for: section heading "The E-Cell Experience",
 *             each row's title + accent word
 *             Why: editorial, quiet authority — no need to shout
 *
 *  LABEL    → "DM Mono" (400)
 *             Used for: tags (IGNITE / CREATE / SCALE / CONNECT),
 *             "OUR ECOSYSTEM", stat labels
 *             Why: monospaced = precise, techy, never feels decorative
 *
 *  BODY     → "Outfit" (300)
 *             Used for: descriptions, sub-header paragraph
 *             Why: geometric light sans reads cleanly at small sizes
 *
 *  RULES
 *  • No font-bold anywhere — heaviest weight used is 400
 *  • All headings stepped down ~30-40% from original sizes
 *  • Gradient accent words kept but opacity toned down
 *  • Stat badges: number font → Instrument Serif, label → DM Mono
 *  • Glow blobs: opacity halved so they stop screaming
 * ──────────────────────────────────────────────────────────────
 */

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  RocketLaunchIllustration,
  IdeaBulbIllustration,
  GrowthChartIllustration,
  NetworkIllustration,
} from "../illustrations/StartupIllustrations";
import { FadeInOnScroll } from "../animations/ScrollAnimations";

// ─── Google Fonts loader ──────────────────────────────────────
function useFonts() {
  useEffect(() => {
    if (document.getElementById("showcase-fonts")) return;
    const link = document.createElement("link");
    link.id = "showcase-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400&family=Outfit:wght@300;400&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Font constants ───────────────────────────────────────────
const F = {
  display: "'Instrument Serif', Georgia, serif",
  mono: "'DM Mono', monospace",
  body: "'Outfit', sans-serif",
};

// ─────────────────────────────────────────────────────────────
// Animated Counter Hook
// ─────────────────────────────────────────────────────────────

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
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(counter);
  }, [isInView, end, duration]);
  return count;
};

// ─────────────────────────────────────────────────────────────
// Stat Badge — refined, font-driven
// ─────────────────────────────────────────────────────────────

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
    <div
      className="rounded-xl px-4 py-4"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Number — Instrument Serif, large but NOT bold */}
      <div
        style={{
          fontFamily: F.display,
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          fontWeight: 400,
          color: "rgba(255,255,255,0.88)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: "0.35rem",
        }}
      >
        {prefix}
        {animatedValue}
        {suffix}
      </div>

      {/* Label — DM Mono, very small */}
      <div
        style={{
          fontFamily: F.mono,
          fontSize: "9px",
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.30)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Section data
// ─────────────────────────────────────────────────────────────

interface ShowcaseSection {
  tag: string;
  title: string;
  titleAccent: string;
  description: string;
  illustration: React.ComponentType<{ className?: string }>;
  stats: StatBadgeProps[];
  accentColor: string; // raw CSS color for hairlines & gradient stops
}

const sections: ShowcaseSection[] = [
  {
    tag: "IGNITE",
    title: "Launch your",
    titleAccent: "Startup",
    description:
      "From spark to liftoff — our incubation program provides the launchpad for your entrepreneurial journey. Access resources, funding guidance, and expert mentorship to transform your idea into a market-ready product.",
    illustration: RocketLaunchIllustration,
    stats: [
      { value: 3, suffix: "+", label: "Startups Launched", isInView: false },
      { value: 85, suffix: "%", label: "Success Rate", isInView: false },
    ],
    accentColor: "#a78bfa", // violet-400
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
    accentColor: "#fbbf24", // amber-400
  },
  {
    tag: "SCALE",
    title: "Grow",
    titleAccent: "Together",
    description:
      "Accelerate your growth with data-driven strategies, market analysis, and scaling frameworks developed by our network of successful founders and industry veterans.",
    illustration: GrowthChartIllustration,
    stats: [
      {
        value: 3,
        suffix: "Cr+",
        prefix: "₹",
        label: "Funding Facilitated",
        isInView: false,
      },
      { value: 10, suffix: "x", label: "Avg Growth", isInView: false },
    ],
    accentColor: "#34d399", // emerald-400
  },
  {
    tag: "CONNECT",
    title: "Build your",
    titleAccent: "Network",
    description:
      "Join a vibrant ecosystem of founders, mentors, investors, and changemakers. Our events, summits, and community platforms create meaningful connections that last beyond the campus.",
    illustration: NetworkIllustration,
    stats: [
      { value: 50, suffix: "+", label: "Active Members", isInView: false },
      { value: 15, suffix: "+", label: "Industry Partners", isInView: false },
    ],
    accentColor: "#60a5fa", // blue-400
  },
];

// ─────────────────────────────────────────────────────────────
// Individual Parallax Row
// ─────────────────────────────────────────────────────────────

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
  const illustrationY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const Illustration = section.illustration;

  return (
    <div ref={rowRef} className="relative py-16 md:py-24 overflow-hidden">
      {/* Very subtle ambient glow — opacity capped at 0.03 */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: section.accentColor,
          filter: "blur(140px)",
          opacity: 0.03,
          top: "50%",
          left: isReversed ? "20%" : "65%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="container mx-auto px-6 lg:px-8">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          style={{ direction: isReversed ? "rtl" : "ltr" }}
        >
          {/* ── Text side ── */}
          <motion.div
            className="space-y-6"
            style={{ y: textY, direction: "ltr" }}
          >
            <FadeInOnScroll
              direction={isReversed ? "right" : "left"}
              delay={0.1}
            >
              <div className="space-y-4">
                {/* Tag — DM Mono hairline + text */}
                <div className="flex items-center gap-3">
                  <div
                    className="h-px w-8"
                    style={{ background: section.accentColor, opacity: 0.6 }}
                  />
                  <span
                    style={{
                      fontFamily: F.mono,
                      fontSize: "9px",
                      letterSpacing: "0.35em",
                      color: "rgba(255,255,255,0.30)",
                      textTransform: "uppercase",
                    }}
                  >
                    {section.tag}
                  </span>
                </div>

                {/* Title — Instrument Serif, modest size, italic accent word */}
                <h2
                  style={{
                    fontFamily: F.display,
                    fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", // ~26–40 px
                    fontWeight: 400,
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    color: "rgba(255,255,255,0.88)",
                  }}
                >
                  {section.title}{" "}
                  <span
                    style={{
                      fontStyle: "italic",
                      color: section.accentColor,
                      opacity: 0.9,
                    }}
                  >
                    {section.titleAccent}
                  </span>
                </h2>

                {/* Description — Outfit 300, small */}
                <p
                  style={{
                    fontFamily: F.body,
                    fontSize: "clamp(0.75rem, 1.3vw, 0.875rem)", // 12–14 px
                    fontWeight: 300,
                    lineHeight: 1.75,
                    color: "rgba(255,255,255,0.38)",
                    maxWidth: "50ch",
                  }}
                >
                  {section.description}
                </p>
              </div>
            </FadeInOnScroll>

            {/* Stats */}
            <FadeInOnScroll direction="up" delay={0.25}>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
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

          {/* ── Illustration side ── */}
          <motion.div
            className="relative flex items-center justify-center"
            style={{ y: illustrationY, direction: "ltr" }}
          >
            {/* Subtle glow ring */}
            <motion.div
              className="absolute inset-0 m-auto rounded-full blur-3xl"
              style={{
                width: 280,
                height: 280,
                background: section.accentColor,
                opacity: 0,
              }}
              animate={
                isInView
                  ? { opacity: [0, 0.07, 0.04], scale: [0.7, 1.1, 1] }
                  : {}
              }
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            />

            {/* Illustration frame */}
            <motion.div
              className="relative"
              style={{
                width: "clamp(220px, 30vw, 340px)",
                height: "clamp(220px, 30vw, 340px)",
              }}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.88 }
              }
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            >
              {/* Glass frame — very subtle */}
              <div
                className="absolute -inset-3 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                }}
              />
              <div className="relative z-10 w-full h-full p-3">
                <Illustration className="w-full h-full" />
              </div>
            </motion.div>

            {/* Floating dots — fewer, dimmer */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: section.accentColor,
                  opacity: 0.2,
                  top: `${22 + i * 16}%`,
                  left: `${8 + ((i * 22) % 75)}%`,
                }}
                animate={{ y: [0, -10, 0], opacity: [0.1, 0.35, 0.1] }}
                transition={{
                  duration: 3 + i * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Hairline divider */}
      {index < sections.length - 1 && (
        <div className="container mx-auto px-6 lg:px-8 mt-16 md:mt-24">
          <motion.div
            className="h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            }}
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

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

const ParallaxShowcase = () => {
  useFonts();

  return (
    <section className="relative bg-black overflow-hidden">
      {/* ── Section header ── */}
      <div className="container mx-auto px-6 lg:px-8 pt-24 pb-6">
        <FadeInOnScroll direction="up">
          <div className="text-center space-y-3">
            {/* Label — DM Mono */}
            <p
              style={{
                fontFamily: F.mono,
                fontSize: "9px",
                letterSpacing: "0.38em",
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
              }}
            >
              OUR ECOSYSTEM
            </p>

            {/* Heading — Instrument Serif italic */}
            <h2
              style={{
                fontFamily: F.display,
                fontStyle: "italic",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)", // ~29–45 px
                fontWeight: 400,
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              The E-Cell{" "}
              <span style={{ color: "#a78bfa", fontStyle: "normal" }}>
                Experience
              </span>
            </h2>

            {/* Sub-text — Outfit 300 */}
            <p
              style={{
                fontFamily: F.body,
                fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)",
                fontWeight: 300,
                color: "rgba(255,255,255,0.32)",
                maxWidth: "38ch",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Four pillars that define our entrepreneurial ecosystem
            </p>
          </div>
        </FadeInOnScroll>
      </div>

      {/* ── Rows ── */}
      {sections.map((section, index) => (
        <ShowcaseRow key={index} section={section} index={index} />
      ))}

      <div className="h-20 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
};

export default ParallaxShowcase;
