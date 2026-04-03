import { useRef } from "react";
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

// ─────────────────────────────────────────────

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  accentColor: string;
}

const features: FeatureCard[] = [
  {
    icon: <Lightbulb className="w-7 h-7 text-amber-400" />,
    title: "Innovation Hub",
    description:
      "A dedicated space for ideation and prototyping where raw ideas are transformed into viable products through design thinking workshops and rapid experimentation.",
    gradient: "bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-transparent",
    accentColor: "from-amber-500/30 to-orange-500/20",
  },
  {
    icon: <Rocket className="w-7 h-7 text-purple-400" />,
    title: "Startup Incubation",
    description:
      "End-to-end incubation support with access to co-working spaces, legal counsel, financial planning, and go-to-market strategy development.",
    gradient: "bg-gradient-to-br from-purple-600/20 via-violet-600/10 to-transparent",
    accentColor: "from-purple-500/30 to-violet-500/20",
  },
  {
    icon: <Users className="w-7 h-7 text-blue-400" />,
    title: "Mentorship Network",
    description:
      "Connect with seasoned entrepreneurs, investors, and industry leaders who provide one-on-one guidance tailored to your startup's unique challenges.",
    gradient: "bg-gradient-to-br from-blue-600/20 via-cyan-600/10 to-transparent",
    accentColor: "from-blue-500/30 to-cyan-500/20",
  },
  {
    icon: <GraduationCap className="w-7 h-7 text-emerald-400" />,
    title: "Workshops & Bootcamps",
    description:
      "Intensive skill-building sessions covering pitching, fundraising, product design, growth hacking, and technical development fundamentals.",
    gradient: "bg-gradient-to-br from-emerald-600/20 via-green-600/10 to-transparent",
    accentColor: "from-emerald-500/30 to-green-500/20",
  },
  {
    icon: <Trophy className="w-7 h-7 text-yellow-400" />,
    title: "Competitions & Hackathons",
    description:
      "High-stakes events like VypaarX and IgniteX that push boundaries, foster innovation, and connect winners with funding opportunities and media exposure.",
    gradient: "bg-gradient-to-br from-yellow-600/20 via-amber-600/10 to-transparent",
    accentColor: "from-yellow-500/30 to-amber-500/20",
  },
  {
    icon: <Globe className="w-7 h-7 text-pink-400" />,
    title: "Networking & Community",
    description:
      "A thriving ecosystem of founders, developers, designers, and visionaries collaborating across disciplines to build the next generation of startups.",
    gradient: "bg-gradient-to-br from-pink-600/20 via-rose-600/10 to-transparent",
    accentColor: "from-pink-500/30 to-rose-500/20",
  },
];

// ─────────────────────────────────────────────

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
  const segment = 1 / totalCards;
  const start = index * segment;
  const end = Math.min(start + segment, 1);

  const scale = useTransform(scrollYProgress, [start, end], [1, 0.9]);
  const cardOpacity = useTransform(
    scrollYProgress,
    [start, end - segment * 0.2, end],
    [1, 1, index === totalCards - 1 ? 1 : 0.5]
  );
  const rotateX = useTransform(scrollYProgress, [start, end], [0, -2]);

  return (
    <motion.div
      className="sticky w-full"
      style={{
        top: `${80 + index * 20}px`,
        scale,
        opacity: cardOpacity,
        rotateX,
        zIndex: index + 1,
        transformPerspective: 1200,
      }}
    >
      <div
        className={`relative rounded-2xl md:rounded-3xl border border-white/[0.08] overflow-hidden ${card.gradient}`}
      >
        {/* Glassmorphism backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 p-7 md:p-10 lg:p-12">
          <div className="flex flex-col md:flex-row items-start gap-5 md:gap-8">
            {/* Icon container */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${card.accentColor} border border-white/10 flex items-center justify-center`}
                >
                  {card.icon}
                </div>
                {/* Glow behind icon */}
                <div
                  className={`absolute -inset-3 rounded-3xl bg-gradient-to-br ${card.accentColor} blur-xl opacity-40`}
                />
              </div>
            </div>

            {/* Text content */}
            <div className="space-y-3 md:space-y-4 flex-1">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-white/30 tracking-wider">
                  0{index + 1}
                </span>
                <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-white/20 to-transparent" />
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                {card.title}
              </h3>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
                {card.description}
              </p>
            </div>
          </div>
        </div>

        {/* Decorative accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/[0.02] to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/[0.01] to-transparent rounded-tr-full" />
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────

const CardStackFeature = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="relative bg-black">
      {/* Section header */}
      <div className="container mx-auto px-6 lg:px-8 pt-24 pb-12">
        <FadeInOnScroll direction="up">
          <div className="text-xs sm:text-sm text-gray-500 tracking-[0.3em] uppercase font-light mb-6">
            WHAT WE OFFER
          </div>
        </FadeInOnScroll>

        <TextReveal
          text="Everything you need to turn your vision into a thriving venture"
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight max-w-4xl"
        />
      </div>

      {/* Stacking cards */}
      <div
        ref={containerRef}
        className="relative container mx-auto px-6 lg:px-8"
        style={{ minHeight: `${features.length * 45}vh` }}
      >
        <div className="space-y-6">
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

      {/* Bottom fade */}
      <div className="h-32 bg-gradient-to-b from-black to-transparent" />
    </section>
  );
};

export default CardStackFeature;
