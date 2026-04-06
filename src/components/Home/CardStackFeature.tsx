import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Lightbulb,
  Rocket,
  Users,
  GraduationCap,
  Trophy,
  Globe,
} from "lucide-react";
import { FadeInOnScroll, TextReveal } from "../animations/ScrollAnimations";
import { useTheme } from "../../context/ThemeContext";

// ─── Google Fonts loader ──────────────────────────────────────
function useFonts() {
  useEffect(() => {
    if (document.getElementById("cardstack-fonts")) return;
    const link = document.createElement("link");
    link.id = "cardstack-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400&family=Outfit:wght@300;400&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Font shorthand constants ─────────────────────────────────
const F = {
  display: "'Instrument Serif', Georgia, serif",
  mono: "'DM Mono', monospace",
  body: "'Outfit', sans-serif",
};

// ─────────────────────────────────────────────────────────────

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string; // single subtle color token used for icon + hairline
}

const features: FeatureCard[] = [
  {
    icon: <Lightbulb className="w-5 h-5" style={{ color: "#f59e0b" }} />,
    title: "Innovation Hub",
    description:
      "A dedicated space for ideation and prototyping where raw ideas are transformed into viable products through design thinking workshops and rapid experimentation.",
    accent: "rgba(245,158,11,0.18)",
  },
  {
    icon: <Rocket className="w-5 h-5" style={{ color: "#a78bfa" }} />,
    title: "Startup Incubation",
    description:
      "End-to-end incubation support with access to co-working spaces, legal counsel, financial planning, and go-to-market strategy development.",
    accent: "rgba(167,139,250,0.18)",
  },
  {
    icon: <Users className="w-5 h-5" style={{ color: "#60a5fa" }} />,
    title: "Mentorship Network",
    description:
      "Connect with seasoned entrepreneurs, investors, and industry leaders who provide one-on-one guidance tailored to your startup's unique challenges.",
    accent: "rgba(96,165,250,0.18)",
  },
  {
    icon: <GraduationCap className="w-5 h-5" style={{ color: "#34d399" }} />,
    title: "Workshops & Bootcamps",
    description:
      "Intensive skill-building sessions covering pitching, fundraising, product design, growth hacking, and technical development fundamentals.",
    accent: "rgba(52,211,153,0.18)",
  },
  {
    icon: <Trophy className="w-5 h-5" style={{ color: "#fbbf24" }} />,
    title: "Competitions & Hackathons",
    description:
      "High-stakes events like VypaarX and IgniteX that push boundaries, foster innovation, and connect winners with funding opportunities.",
    accent: "rgba(251,191,36,0.18)",
  },
  {
    icon: <Globe className="w-5 h-5" style={{ color: "#f472b6" }} />,
    title: "Networking & Community",
    description:
      "A thriving ecosystem of founders, developers, designers, and visionaries collaborating across disciplines to build the next generation of startups.",
    accent: "rgba(244,114,182,0.18)",
  },
];

// ─────────────────────────────────────────────────────────────

const StickyCard = ({
  card,
  index,
  totalCards,
  scrollYProgress,
}: {
  card: FeatureCard;
  index: number;
  totalCards: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const { isDark } = useTheme();
  const segment = 1 / totalCards;
  const start = index * segment;
  const end = Math.min(start + segment, 1);

  const scale = useTransform(scrollYProgress, [start, end], [1, 0.93]);
  const cardOpacity = useTransform(
    scrollYProgress,
    [start, end - segment * 0.2, end],
    [1, 1, index === totalCards - 1 ? 1 : 0.45],
  );
  const rotateX = useTransform(scrollYProgress, [start, end], [0, -1.5]);

  // zero-padded index label e.g. "01"
  const label = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      className="sticky w-full"
      style={{
        top: `${72 + index * 16}px`,
        scale,
        opacity: cardOpacity,
        rotateX,
        zIndex: index + 1,
        transformPerspective: 1400,
      }}
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          // very subtle tinted glass — no loud gradient blobs
          background: isDark
            ? `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)`
            : `linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.01) 100%)`,
          border: isDark
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid rgba(0,0,0,0.07)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Accent hairline top — only colour in the whole card */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: card.accent.replace("0.18", "0.6") }}
        />

        <div className="relative z-10 px-8 py-7 md:px-10 md:py-8">
          <div className="flex items-start gap-6 md:gap-10">
            {/* Index + icon column */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3 pt-0.5">
              {/* Monospaced index number */}
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
                }}
              >
                {label}
              </span>

              {/* Small icon pill — accent background, no heavy glow */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: card.accent }}
              >
                {card.icon}
              </div>
            </div>

            {/* Divider */}
            <div
              className="self-stretch w-px flex-shrink-0 mt-1"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.06)",
              }}
            />

            {/* Text block */}
            <div className="flex-1 space-y-2.5">
              {/* Card title — Instrument Serif, regular weight, modest size */}
              <h3
                style={{
                  fontFamily: F.display,
                  fontSize: "clamp(1rem, 2vw, 1.25rem)", // 16–20 px
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                  color: isDark ? "rgba(255,255,255,0.90)" : "rgba(0,0,0,0.88)",
                }}
              >
                {card.title}
              </h3>

              {/* Description — Outfit 300, small */}
              <p
                style={{
                  fontFamily: F.body,
                  fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)", // 12–14 px
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: isDark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.45)",
                  maxWidth: "52ch",
                }}
              >
                {card.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────

const CardStackFeature = () => {
  useFonts(); // inject Google Fonts once

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="relative bg-black">
      {/* ── Section header ── */}
      <div className="container mx-auto px-6 lg:px-8 pt-24 pb-10">
        {/* Label — DM Mono, tiny, wide tracking */}
        <FadeInOnScroll direction="up">
          <p
            style={{
              fontFamily: F.mono,
              fontSize: "10px",
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            WHAT WE OFFER
          </p>
        </FadeInOnScroll>

        {/* Heading — Instrument Serif italic, quiet & editorial */}
        <FadeInOnScroll direction="up">
          <h2
            style={{
              fontFamily: F.display,
              fontStyle: "italic",
              fontSize: "clamp(1.6rem, 4vw, 2.5rem)", // 26–40 px — was 60 px
              fontWeight: 400,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.88)",
              maxWidth: "22ch",
            }}
          >
            Everything you need to turn your vision into a thriving venture
          </h2>
        </FadeInOnScroll>

        {/* Hairline separator */}
        <div
          className="mt-10"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.12) 0%, transparent 80%)",
          }}
        />
      </div>

      {/* ── Stacking cards ── */}
      <div
        ref={containerRef}
        className="relative container mx-auto px-6 lg:px-8 pb-24"
        style={{ minHeight: `${features.length * 45}vh` }}
      >
        <div className="space-y-4">
          {features.map((card, index) => (
            <StickyCard
              key={index}
              card={card}
              index={index}
              totalCards={features.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardStackFeature;
