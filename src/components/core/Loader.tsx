import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

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
    let interval: number;
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
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 500);
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
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const steps = [
      { delay: 0 },
      { delay: 2000 },
      { delay: 4000 },
      { delay: 6000 },
    ];

    const timers = steps.map((step, index) =>
      setTimeout(() => {
        setCurrentStep(index);
        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsComplete(true);
            if (onComplete) {
              setTimeout(onComplete, 1000);
            }
          }, 2000);
        }
      }, step.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
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

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
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
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Main Logo Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-4"
        >
          {currentStep >= 0 && (
            <div className="text-6xl md:text-8xl font-bold tracking-wider">
              <DecryptedText
                text="E-CELL IPSA"
                speed={60}
                sequential={true}
                revealDirection="start"
                className="text-white drop-shadow-2xl"
                encryptedClassName="text-gray-500"
                animateOn="auto"
              />
            </div>
          )}

          {currentStep >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-2xl md:text-3xl font-light tracking-widest"
            >
              <DecryptedText
                text="ACADEMY"
                speed={80}
                sequential={true}
                revealDirection="start"
                className="text-purple-300 drop-shadow-lg"
                encryptedClassName="text-gray-600"
                animateOn="auto"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Subtitle */}
        {currentStep >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-2"
          >
            <div className="text-sm md:text-base tracking-[0.3em] text-gray-400 font-light">
              <DecryptedText
                text="ENTREPRENEURSHIP CELL"
                speed={40}
                sequential={true}
                revealDirection="center"
                className="text-gray-300"
                encryptedClassName="text-gray-700"
                animateOn="auto"
              />
            </div>
            <div className="text-xs md:text-sm tracking-[0.2em] text-gray-500">
              <DecryptedText
                text="IPS ACADEMY × IIT BOMBAY"
                speed={50}
                sequential={true}
                revealDirection="start"
                className="text-blue-400"
                encryptedClassName="text-gray-700"
                animateOn="auto"
              />
            </div>
          </motion.div>
        )}

        {/* Loading Animation */}
        {currentStep >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-center space-y-6"
          >
            {/* Progress Bar */}
            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>

            {/* Loading Text */}
            <motion.div
              className="text-sm text-gray-400 tracking-widest"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              INITIALIZING INNOVATION
            </motion.div>

            {/* Spinning Elements */}
            <div className="relative">
              <motion.div
                className="w-16 h-16 border-2 border-purple-500/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              </motion.div>
              <motion.div
                className="absolute inset-2 border-2 border-blue-500/20 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              </motion.div>
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
