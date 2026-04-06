import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

function useFonts() {
  useEffect(() => {
    if (document.getElementById("loader-fonts")) return;
    const link = document.createElement("link");
    link.id = "loader-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400&display=swap";
    document.head.appendChild(link);
  }, []);
}

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
  speed = 80,
  maxIterations = 15,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?",
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
      currentRevealed: Set<number>,
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
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 300);
      return () => clearTimeout(timer);
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

interface ECellLoaderProps {
  onComplete?: () => void;
}

const ECellLoader = ({ onComplete }: ECellLoaderProps) => {
  useFonts();

  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const steps = [{ delay: 0 }, { delay: 1400 }, { delay: 2800 }];
    const timers = steps.map((step, index) =>
      setTimeout(() => {
        setCurrentStep(index);
        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsComplete(true);
            if (onComplete) {
              setTimeout(onComplete, 700);
            }
          }, 1400);
        }
      }, step.delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
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
              duration: 2.5 + Math.random() * 1.5,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-2"
        >
          {/* "E-CELL IPS" — Instrument Serif */}
          {currentStep >= 0 && (
            <div
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(2rem, 8vw, 3.5rem)",
                letterSpacing: "0.08em",
              }}
            >
              <DecryptedText
                text="E-CELL IPS"
                speed={40}
                sequential={true}
                revealDirection="start"
                className="text-white drop-shadow-2xl"
                encryptedClassName="text-gray-500"
                animateOn="auto"
              />
            </div>
          )}

          {/* "IPSA" — DM Mono (was "ACADEMY", now on same line as E-CELL IPS) */}
          {currentStep >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontWeight: 400,
                fontSize: "clamp(0.9rem, 2.5vw, 1.15rem)",
                letterSpacing: "0.35em",
              }}
            >
              <DecryptedText
                text="IPSA"
                speed={55}
                sequential={true}
                revealDirection="start"
                className="text-white/55 drop-shadow-lg"
                encryptedClassName="text-gray-600"
                animateOn="auto"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Subtitles — DM Mono */}
        {currentStep >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-1.5"
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontWeight: 400,
                fontSize: "clamp(0.55rem, 1.2vw, 0.7rem)",
                letterSpacing: "0.32em",
              }}
            >
              <DecryptedText
                text="ENTREPRENEURSHIP CELL"
                speed={28}
                sequential={true}
                revealDirection="center"
                className="text-gray-300"
                encryptedClassName="text-gray-700"
                animateOn="auto"
              />
            </div>

            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontWeight: 400,
                fontSize: "clamp(0.5rem, 1vw, 0.62rem)",
                letterSpacing: "0.22em",
              }}
            >
              <DecryptedText
                text="IPS ACADEMY × IIT BOMBAY"
                speed={35}
                sequential={true}
                revealDirection="start"
                className="text-white/40"
                encryptedClassName="text-gray-700"
                animateOn="auto"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Corner Elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white/20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white/20" />
    </motion.div>
  );
};

export default ECellLoader;
