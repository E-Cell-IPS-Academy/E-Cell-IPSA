import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── DecryptedText (kept, made faster) ─── */

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "auto" | "manual";
  [key: string]: any;
}

const DecryptedText = ({
  text,
  speed = 30,
  maxIterations = 10,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "auto",
  ...props
}: DecryptedTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set<number>());
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentIteration = 0;

    const getNextIndex = (revealedSet: Set<number>): number => {
      const textLength = text.length;
      switch (revealDirection) {
        case "start":
          return revealedSet.size;
        case "end":
          return textLength - 1 - revealedSet.size;
        case "center": {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex =
            revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
          if (
            nextIndex >= 0 &&
            nextIndex < textLength &&
            !revealedSet.has(nextIndex)
          ) {
            return nextIndex;
          }
          for (let i = 0; i < textLength; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
      : characters.split("");

    const shuffleText = (
      originalText: string,
      currentRevealed: Set<number>
    ): string => {
      return originalText
        .split("")
        .map((char: string, i: number) => {
          if (char === " ") return " ";
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[
            Math.floor(Math.random() * availableChars.length)
          ];
        })
        .join("");
    };

    if (isAnimating) {
      interval = setInterval(() => {
        setRevealedIndices((prevRevealed) => {
          if (sequential) {
            if (prevRevealed.size < text.length) {
              const nextIndex = getNextIndex(prevRevealed);
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            } else {
              clearInterval(interval);
              setDisplayText(text);
              return prevRevealed;
            }
          } else {
            setDisplayText(shuffleText(text, prevRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(interval);
              setDisplayText(text);
            }
            return prevRevealed;
          }
        });
      }, speed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isAnimating,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    characters,
    useOriginalCharsOnly,
  ]);

  useEffect(() => {
    if (animateOn === "auto") {
      setIsAnimating(true);
    }
  }, [animateOn]);

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap font-mono ${parentClassName}`}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char: string, index: number) => {
          const isRevealed = revealedIndices.has(index) || !isAnimating;
          return (
            <span
              key={index}
              className={isRevealed ? className : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
};

/* ─── Loader ─── */

interface ECellLoaderProps {
  onComplete?: () => void;
}

/* Helper: deterministic pseudo-random from seed */
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

const ECellLoader = ({ onComplete }: ECellLoaderProps) => {
  const [showEcell, setShowEcell] = useState(false);
  const [showIPS, setShowIPS] = useState(false);
  const [exitPhase, setExitPhase] = useState(false);

  /* Pre-compute geometric shapes */
  const geometricShapes = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const dist = 180 + seededRandom(i + 10) * 220;
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          size: 20 + seededRandom(i + 20) * 50,
          rotation: seededRandom(i + 30) * 360,
          type: i % 3, // 0 = square, 1 = circle, 2 = diamond
          delay: seededRandom(i + 40) * 0.3,
        };
      }),
    []
  );

  /* Floating dots */
  const floatingDots = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: (seededRandom(i + 100) - 0.5) * 800,
        y: (seededRandom(i + 200) - 0.5) * 600,
        size: 3 + seededRandom(i + 300) * 5,
        delay: seededRandom(i + 400) * 0.8,
      })),
    []
  );

  /* Master timeline - everything in ~2 seconds */
  useEffect(() => {
    // E-CELL decrypt starts at 0.15s
    const t1 = setTimeout(() => {
      setShowEcell(true);
    }, 150);

    // IPS ACADEMY at 0.7s
    const t2 = setTimeout(() => {
      setShowIPS(true);
    }, 700);

    // Start exit wipe at 1.8s
    const t3 = setTimeout(() => {
      setExitPhase(true);
    }, 1800);

    // Call onComplete at 2.2s
    const t4 = setTimeout(() => {
      onComplete?.();
    }, 2200);

    return () => {
      [t1, t2, t3, t4].forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exitPhase ? (
        <motion.div
          key="loader"
          className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #f8f6ff 40%, #f0ebff 100%)",
          }}
          exit={{
            clipPath: "inset(0 0 100% 0)",
          }}
          transition={{
            duration: 0.4,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          {/* ── CSS Keyframes ── */}
          <style>{`
            @keyframes loaderSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes loaderMorph {
              0%, 100% { border-radius: 20%; }
              50% { border-radius: 50%; }
            }
            @keyframes loaderFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            @keyframes loaderPulseRing {
              0% { transform: scale(0.8); opacity: 0.6; }
              100% { transform: scale(1.6); opacity: 0; }
            }
          `}</style>

          {/* ── Subtle grid pattern ── */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(124,58,237,1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(124,58,237,1) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* ── Large gradient blob (top right) ── */}
          <motion.div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.08) 0%, rgba(139,92,246,0.03) 50%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 20, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />

          {/* ── Large gradient blob (bottom left) ── */}
          <motion.div
            className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.06) 0%, rgba(168,85,247,0.02) 50%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -10, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />

          {/* ── Geometric shapes (rotating squares, morphing circles, diamonds) ── */}
          {geometricShapes.map((shape) => (
            <motion.div
              key={shape.id}
              className="absolute pointer-events-none"
              style={{
                width: shape.size,
                height: shape.size,
                left: "50%",
                top: "50%",
                border:
                  shape.type === 1
                    ? "1.5px solid rgba(139,92,246,0.15)"
                    : "1.5px solid rgba(168,85,247,0.12)",
                borderRadius: shape.type === 1 ? "50%" : shape.type === 2 ? "4px" : "0px",
                background:
                  shape.type === 0
                    ? "rgba(168,85,247,0.03)"
                    : shape.type === 1
                    ? "rgba(139,92,246,0.04)"
                    : "rgba(124,58,237,0.03)",
                transform:
                  shape.type === 2 ? "rotate(45deg)" : "rotate(0deg)",
              }}
              initial={{
                x: shape.x,
                y: shape.y,
                opacity: 0,
                scale: 0,
                rotate: shape.rotation,
              }}
              animate={{
                x: shape.x * 0.6,
                y: shape.y * 0.6,
                opacity: [0, 0.8, 0.6],
                scale: 1,
                rotate: shape.rotation + (shape.type === 0 ? 180 : 90),
              }}
              transition={{
                duration: 2,
                delay: shape.delay,
                ease: "easeOut",
              }}
            />
          ))}

          {/* ── Floating dots ── */}
          {floatingDots.map((dot) => (
            <motion.div
              key={`dot-${dot.id}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: dot.size,
                height: dot.size,
                left: "50%",
                top: "50%",
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(139,92,246,0.1) 100%)",
              }}
              initial={{
                x: dot.x,
                y: dot.y,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: dot.x,
                y: [dot.y, dot.y - 15, dot.y],
                opacity: [0, 0.6, 0.4],
                scale: [0, 1.2, 1],
              }}
              transition={{
                duration: 2.5,
                delay: dot.delay,
                ease: "easeOut",
              }}
            />
          ))}

          {/* ── Pulse rings from center ── */}
          {[0, 0.4, 0.8].map((delay, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute rounded-full border pointer-events-none"
              style={{
                width: 120,
                height: 120,
                left: "50%",
                top: "50%",
                marginLeft: -60,
                marginTop: -60,
                borderColor: "rgba(168,85,247,0.1)",
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: [0.5, 3],
                opacity: [0.4, 0],
              }}
              transition={{
                duration: 1.8,
                delay,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 0.6,
              }}
            />
          ))}

          {/* ── Central content ── */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* ── Hexagonal accent mark above text ── */}
            <motion.div
              className="mb-6 relative"
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48">
                <defs>
                  <linearGradient
                    id="loaderHexGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <motion.polygon
                  points="24,2 44,14 44,34 24,46 4,34 4,14"
                  fill="none"
                  stroke="url(#loaderHexGrad)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <motion.polygon
                  points="24,10 36,17 36,31 24,38 12,31 12,17"
                  fill="rgba(168,85,247,0.1)"
                  stroke="rgba(168,85,247,0.3)"
                  strokeWidth="1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{ transformOrigin: "center" }}
                />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="3"
                  fill="#a855f7"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.4, 1] }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  style={{ transformOrigin: "center" }}
                />
              </svg>

              {/* Rotating orbit ring */}
              <motion.div
                className="absolute inset-[-12px] rounded-full border border-purple-400/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              />
            </motion.div>

            {/* ── E-CELL Text ── */}
            {showEcell && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="relative text-5xl md:text-7xl font-black tracking-[0.15em] font-mono">
                  {/* Purple shadow layer (offset) */}
                  <span
                    className="absolute inset-0"
                    style={{
                      transform: "translateX(-2px) translateY(2px)",
                      opacity: 0.1,
                    }}
                    aria-hidden="true"
                  >
                    <DecryptedText
                      text="E-CELL"
                      speed={15}
                      maxIterations={6}
                      sequential={true}
                      revealDirection="start"
                      className="text-purple-700"
                      encryptedClassName="text-purple-400"
                      animateOn="auto"
                    />
                  </span>
                  {/* Main text */}
                  <span className="relative">
                    <DecryptedText
                      text="E-CELL"
                      speed={15}
                      maxIterations={6}
                      sequential={true}
                      revealDirection="start"
                      className="bg-gradient-to-r from-purple-900 via-purple-700 to-violet-800 bg-clip-text text-transparent"
                      encryptedClassName="text-purple-400/60"
                      animateOn="auto"
                      style={{
                        filter: "drop-shadow(0 2px 8px rgba(124,58,237,0.15))",
                      }}
                    />
                  </span>
                </div>
              </motion.div>
            )}

            {/* ── IPS ACADEMY Text ── */}
            {showIPS && (
              <motion.div
                className="mt-2 overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="text-xl md:text-3xl font-bold tracking-[0.3em] font-mono whitespace-nowrap"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6d28d9 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  IPS ACADEMY
                </motion.div>
              </motion.div>
            )}

            {/* ── Subtitle ── */}
            {showIPS && (
              <motion.div
                className="mt-3 text-xs md:text-sm tracking-[0.25em] text-purple-400/60 font-mono"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
              >
                ENTREPRENEURSHIP CELL
              </motion.div>
            )}
          </div>

          {/* ── Progress bar at bottom ── */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-purple-100/50">
            <motion.div
              className="h-full origin-left"
              style={{
                background:
                  "linear-gradient(90deg, #a855f7, #7c3aed, #6d28d9)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
            {/* Glowing dot at progress tip */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{
                background: "#a855f7",
                boxShadow:
                  "0 0 8px rgba(168,85,247,0.8), 0 0 16px rgba(168,85,247,0.4)",
              }}
              initial={{ left: "0%" }}
              animate={{ left: "100%" }}
              transition={{
                duration: 1.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          </div>

          {/* ── Corner accents (thinner, more elegant on white) ── */}
          <motion.div
            className="absolute top-6 left-6 w-10 h-10 border-l border-t border-purple-400/30"
            initial={{ opacity: 0, x: -8, y: -8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          />
          <motion.div
            className="absolute top-6 right-6 w-10 h-10 border-r border-t border-purple-400/30"
            initial={{ opacity: 0, x: 8, y: -8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
          />
          <motion.div
            className="absolute bottom-6 left-6 w-10 h-10 border-l border-b border-purple-400/30"
            initial={{ opacity: 0, x: -8, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
          />
          <motion.div
            className="absolute bottom-6 right-6 w-10 h-10 border-r border-b border-purple-400/30"
            initial={{ opacity: 0, x: 8, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
          />
        </motion.div>
      ) : (
        /* ── Exit: White wipe upward revealing dark site ── */
        <motion.div
          key="loader-exit"
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #f8f6ff 40%, #f0ebff 100%)",
          }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          animate={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{
            duration: 0.4,
            ease: [0.76, 0, 0.24, 1],
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default ECellLoader;
