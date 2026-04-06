import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400&family=Outfit:wght@300;400&display=swap";

function useFonts() {
  useEffect(() => {
    if (document.getElementById("stats-fonts")) return;
    const link = document.createElement("link");
    link.id = "stats-fonts";
    link.rel = "stylesheet";
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
  }, []);
}

const F = {
  display: "'Instrument Serif', Georgia, serif",
  mono: "'DM Mono', monospace",
  body: "'Outfit', sans-serif",
  number: "'Cormorant Garamond', Georgia, serif",
};

// ─── Animated counter ─────────────────────────────────────────
const useCounter = (
  end: number,
  duration = 2000,
  delay = 0,
  isInView: boolean,
) => {
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
        } else setCount(Math.floor(start));
      }, 16);
      return () => clearInterval(counter);
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, end, duration, delay]);
  return count;
};

// ─── Stat cell ────────────────────────────────────────────────
interface StatProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  delay: number;
  isInView: boolean;
}

const StatCell = ({
  value,
  prefix = "",
  suffix = "",
  label,
  delay,
  isInView,
}: StatProps) => {
  const count = useCounter(value, 2000, delay, isInView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ delay: delay / 1000 + 0.4, duration: 0.7 }}
      className="text-center"
    >
      {/* Big number — Cormorant Garamond 300 */}
      <div
        style={{
          fontFamily: F.number,
          fontSize: "clamp(2.8rem, 7vw, 5rem)",
          fontWeight: 300,
          lineHeight: 1,
          color: "rgba(255,255,255,0.90)",
          letterSpacing: "-0.02em",
          marginBottom: "0.5rem",
        }}
      >
        {prefix}
        {count}
        {suffix}
      </div>

      {/* Label — DM Mono */}
      <div
        style={{
          fontFamily: F.mono,
          fontSize: "9px",
          letterSpacing: "0.22em",
          color: "rgba(255,255,255,0.30)",
          textTransform: "uppercase",
          lineHeight: 1.6,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────

const ECellStatsSection = () => {
  useFonts();

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center bg-black"
    >
      {/* ── CSS gradient background (replaces video) ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 70% at 70% 10%, rgba(120,40,200,0.22) 0%, transparent 60%),
              radial-gradient(ellipse 50% 60% at 20% 80%, rgba(60,100,220,0.14) 0%, transparent 55%),
              radial-gradient(ellipse 40% 50% at 50% 50%, rgba(90,40,180,0.08) 0%, transparent 60%),
              linear-gradient(160deg, #06000c 0%, #09000f 50%, #05000a 100%)
            `,
          }}
        />
        {/* Hairline diagonal streaks */}
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              118deg,
              transparent 0%, transparent 47%,
              rgba(120,80,220,0.03) 47.3%, rgba(120,80,220,0.03) 47.7%,
              transparent 48%, transparent 52%,
              rgba(60,160,220,0.025) 52.3%, rgba(60,160,220,0.025) 52.6%,
              transparent 53%
            )`,
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="space-y-7"
          >
            {/* Label — DM Mono */}
            <p
              style={{
                fontFamily: F.mono,
                fontSize: "9px",
                letterSpacing: "0.35em",
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
              }}
            >
              WHO WE ARE
            </p>

            {/* Heading — Instrument Serif */}
            <h2
              style={{
                fontFamily: F.display,
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "rgba(255,255,255,0.88)",
              }}
            >
              Your success is
              <br />
              <span style={{ fontStyle: "italic", color: "#a78bfa" }}>
                our goal
              </span>
            </h2>

            {/* Description — Outfit 300 */}
            <p
              style={{
                fontFamily: F.body,
                fontSize: "clamp(0.78rem, 1.3vw, 0.9rem)",
                fontWeight: 300,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.38)",
                maxWidth: "46ch",
              }}
            >
              We strive to provide cutting-edge entrepreneurial education and
              startup support for aspiring innovators seeking transformational
              growth.
            </p>

            {/* CTA button — Outfit 300 */}
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 overflow-hidden rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.7), rgba(59,130,246,0.7))",
                border: "1px solid rgba(167,139,250,0.3)",
                padding: "0.6rem 1.4rem",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: "0.78rem",
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                Join Our Community
              </span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>

          {/* Right — stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="grid grid-cols-2 gap-x-8 gap-y-12"
          >
            <StatCell
              value={1}
              suffix="+"
              label={`Years of\nExcellence`}
              delay={300}
              isInView={isInView}
            />
            <StatCell
              value={3}
              suffix="+"
              label={`Startups\nIncubated`}
              delay={600}
              isInView={isInView}
            />
            <StatCell
              value={3}
              prefix="₹"
              suffix="Cr"
              label={`Funding\nFacilitated`}
              delay={900}
              isInView={isInView}
            />
            <StatCell
              value={20}
              suffix="+"
              label={`Events &\nWorkshops`}
              delay={1200}
              isInView={isInView}
            />
          </motion.div>
        </div>
      </div>

      {/* Subtle hairline divider at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
        }}
      />
    </section>
  );
};

export default ECellStatsSection;
