"use client";

import { motion } from "framer-motion";

// ─────────────────────────────────────────────
// 1. RocketLaunchIllustration
// ─────────────────────────────────────────────
export const RocketLaunchIllustration = ({
  className = "",
}: {
  className?: string;
}) => {
  const stars = [
    { cx: 50, cy: 60, r: 2 },
    { cx: 340, cy: 40, r: 1.5 },
    { cx: 80, cy: 180, r: 1.8 },
    { cx: 320, cy: 150, r: 2.2 },
    { cx: 150, cy: 30, r: 1.5 },
    { cx: 280, cy: 80, r: 2 },
    { cx: 370, cy: 220, r: 1.5 },
    { cx: 30, cy: 280, r: 1.8 },
    { cx: 360, cy: 300, r: 1.3 },
  ];

  return (
    <svg viewBox="0 0 400 400" className={className} fill="none">
      <defs>
        <linearGradient id="rktBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="rktFire" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rktWin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {stars.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill="#E9D5FF"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
        />
      ))}

      <motion.g animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <motion.path
          d="M190 280 Q195 310 200 340 Q205 310 210 280 Z"
          fill="url(#rktFire)"
          animate={{ scaleY: [1, 1.3, 0.9, 1], opacity: [0.9, 1, 0.8, 0.9] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "200px 280px" }}
        />
        <path d="M175 250 L160 285 L185 270 Z" fill="#7C3AED" />
        <path d="M225 250 L240 285 L215 270 Z" fill="#7C3AED" />
        <path d="M185 280 L185 200 Q185 160 200 130 Q215 160 215 200 L215 280 Z" fill="url(#rktBody)" />
        <path d="M185 200 Q185 160 200 130 Q215 160 215 200" fill="#A78BFA" />
        <circle cx="200" cy="210" r="12" fill="url(#rktWin)" />
        <circle cx="200" cy="210" r="12" fill="none" stroke="#C4B5FD" strokeWidth="2" />
        <motion.circle
          cx="196" cy="206" r="4" fill="white" opacity={0.4}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <rect x="185" y="245" width="30" height="4" rx="2" fill="#6D28D9" />
        <rect x="185" y="255" width="30" height="4" rx="2" fill="#6D28D9" />
      </motion.g>
    </svg>
  );
};

// ─────────────────────────────────────────────
// 2. IdeaBulbIllustration
// ─────────────────────────────────────────────
export const IdeaBulbIllustration = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none">
      <defs>
        <radialGradient id="bulbGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#EDE9FE" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bulbGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="gearGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>

      {/* Glow pulse */}
      <motion.circle
        cx="200" cy="170" r="100" fill="url(#bulbGlow)"
        animate={{ r: [90, 110, 90], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bulb shape */}
      <path
        d="M160 200 Q160 130 200 110 Q240 130 240 200 Q240 230 230 240 L170 240 Q160 230 160 200 Z"
        fill="url(#bulbGrad)" opacity="0.9"
      />

      {/* Base */}
      <rect x="175" y="240" width="50" height="8" rx="3" fill="#6D28D9" />
      <rect x="178" y="252" width="44" height="6" rx="3" fill="#5B21B6" />
      <rect x="181" y="262" width="38" height="6" rx="3" fill="#4C1D95" />
      <path d="M185 268 Q200 280 215 268" stroke="#4C1D95" strokeWidth="3" fill="none" />

      {/* Gear 1 - rotating */}
      <motion.g
        style={{ transformOrigin: "190px 175px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="190" cy="175" r="14" fill="none" stroke="url(#gearGrad)" strokeWidth="3" />
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <rect
            key={i} x="187" y="158" width="6" height="8" rx="1" fill="#3B82F6"
            transform={`rotate(${a} 190 175)`}
          />
        ))}
        <circle cx="190" cy="175" r="5" fill="#3B82F6" />
      </motion.g>

      {/* Gear 2 - rotating opposite */}
      <motion.g
        style={{ transformOrigin: "215px 185px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="215" cy="185" r="10" fill="none" stroke="url(#gearGrad)" strokeWidth="2.5" />
        {[0, 72, 144, 216, 288].map((a, i) => (
          <rect
            key={i} x="213" y="173" width="4" height="6" rx="1" fill="#8B5CF6"
            transform={`rotate(${a} 215 185)`}
          />
        ))}
        <circle cx="215" cy="185" r="3.5" fill="#8B5CF6" />
      </motion.g>

      {/* Light rays */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = -60 + i * 30;
        const rad = (angle * Math.PI) / 180;
        const x1 = 200 + Math.cos(rad) * 70;
        const y1 = 160 + Math.sin(rad) * 70;
        const x2 = 200 + Math.cos(rad) * 90;
        const y2 = 160 + Math.sin(rad) * 90;
        return (
          <motion.line
            key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        );
      })}
    </svg>
  );
};

// ─────────────────────────────────────────────
// 3. GrowthChartIllustration
// ─────────────────────────────────────────────
export const GrowthChartIllustration = ({
  className = "",
}: {
  className?: string;
}) => {
  const bars = [
    { x: 80, height: 60, delay: 0 },
    { x: 120, height: 100, delay: 0.15 },
    { x: 160, height: 80, delay: 0.3 },
    { x: 200, height: 140, delay: 0.45 },
    { x: 240, height: 120, delay: 0.6 },
    { x: 280, height: 180, delay: 0.75 },
    { x: 320, height: 220, delay: 0.9 },
  ];

  return (
    <svg viewBox="0 0 400 400" className={className} fill="none">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="barHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i} x1="60" y1={120 + i * 50} x2="360" y2={120 + i * 50}
          stroke="#6D28D9" strokeWidth="0.5" opacity="0.3"
        />
      ))}

      {/* Axis */}
      <line x1="60" y1="100" x2="60" y2="330" stroke="#8B5CF6" strokeWidth="2" />
      <line x1="60" y1="330" x2="360" y2="330" stroke="#8B5CF6" strokeWidth="2" />

      {/* Bars */}
      {bars.map((bar, i) => (
        <motion.rect
          key={i}
          x={bar.x}
          width="28"
          rx="4"
          fill={i === bars.length - 1 ? "url(#barHighlight)" : "url(#barGrad)"}
          initial={{ y: 330, height: 0 }}
          animate={{ y: 330 - bar.height, height: bar.height }}
          transition={{ duration: 1, delay: bar.delay, ease: "easeOut" }}
        />
      ))}

      {/* Trend line */}
      <motion.path
        d="M94 270 L134 230 L174 250 L214 190 L254 210 L294 150 L334 110"
        stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
      />

      {/* Arrow at end */}
      <motion.polygon
        points="334,104 340,114 328,114"
        fill="#F59E0B"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      />

      {/* Dot markers */}
      {bars.map((bar, i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={bar.x + 14}
          cy={330 - bar.height - 6}
          r="3"
          fill="#E9D5FF"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1] }}
          transition={{ delay: bar.delay + 1 }}
        />
      ))}
    </svg>
  );
};

// ─────────────────────────────────────────────
// 4. TeamWorkIllustration
// ─────────────────────────────────────────────
export const TeamWorkIllustration = ({
  className = "",
}: {
  className?: string;
}) => {
  const nodes = [
    { cx: 200, cy: 120, r: 22 },
    { cx: 120, cy: 220, r: 18 },
    { cx: 280, cy: 220, r: 18 },
    { cx: 90, cy: 310, r: 16 },
    { cx: 200, cy: 320, r: 16 },
    { cx: 310, cy: 310, r: 16 },
  ];

  const connections = [
    [0, 1], [0, 2], [1, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 4], [4, 5],
  ];

  return (
    <svg viewBox="0 0 400 400" className={className} fill="none">
      <defs>
        <linearGradient id="nodeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <radialGradient id="nodePulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Connection lines */}
      {connections.map(([a, b], i) => (
        <motion.line
          key={`conn-${i}`}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="#7C3AED" strokeWidth="2" opacity="0.4"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={`node-${i}`}>
          {/* Pulse ring */}
          <motion.circle
            cx={n.cx} cy={n.cy} r={n.r + 8}
            fill="url(#nodePulse)"
            animate={{ r: [n.r + 4, n.r + 14, n.r + 4], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
          />
          {/* Node circle */}
          <circle cx={n.cx} cy={n.cy} r={n.r} fill="url(#nodeGrad)" />
          {/* Person icon - head */}
          <circle cx={n.cx} cy={n.cy - 4} r={n.r * 0.28} fill="white" opacity="0.9" />
          {/* Person icon - body */}
          <path
            d={`M${n.cx - n.r * 0.3} ${n.cy + n.r * 0.15} Q${n.cx} ${n.cy - 2} ${n.cx + n.r * 0.3} ${n.cy + n.r * 0.15} Q${n.cx} ${n.cy + n.r * 0.45} ${n.cx - n.r * 0.3} ${n.cy + n.r * 0.15}`}
            fill="white" opacity="0.9"
          />
        </g>
      ))}

      {/* Data packets traveling along connections */}
      {[0, 2, 5].map((ci) => {
        const [a, b] = connections[ci];
        return (
          <motion.circle
            key={`pkt-${ci}`}
            r="3" fill="#E9D5FF"
            animate={{
              cx: [nodes[a].cx, nodes[b].cx],
              cy: [nodes[a].cy, nodes[b].cy],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: ci * 0.5, ease: "easeInOut" }}
          />
        );
      })}
    </svg>
  );
};

// ─────────────────────────────────────────────
// 5. InnovationIllustration
// ─────────────────────────────────────────────
export const InnovationIllustration = ({
  className = "",
}: {
  className?: string;
}) => {
  const circuitNodes = [
    { cx: 200, cy: 200, r: 8 },
    { cx: 120, cy: 140, r: 6 },
    { cx: 280, cy: 140, r: 6 },
    { cx: 100, cy: 260, r: 6 },
    { cx: 300, cy: 260, r: 6 },
    { cx: 160, cy: 100, r: 5 },
    { cx: 240, cy: 100, r: 5 },
    { cx: 70, cy: 200, r: 5 },
    { cx: 330, cy: 200, r: 5 },
    { cx: 160, cy: 320, r: 5 },
    { cx: 240, cy: 320, r: 5 },
  ];

  const paths = [
    "M200 200 L120 140", "M200 200 L280 140", "M200 200 L100 260",
    "M200 200 L300 260", "M120 140 L160 100", "M280 140 L240 100",
    "M120 140 L70 200", "M280 140 L330 200", "M100 260 L160 320",
    "M300 260 L240 320", "M100 260 L70 200", "M300 260 L330 200",
  ];

  return (
    <svg viewBox="0 0 400 400" className={className} fill="none">
      <defs>
        <linearGradient id="circuitLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <radialGradient id="circuitGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#6D28D9" />
        </radialGradient>
      </defs>

      {/* Circuit paths */}
      {paths.map((d, i) => (
        <motion.path
          key={`path-${i}`}
          d={d}
          stroke="url(#circuitLine)" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, delay: i * 0.15, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Nodes */}
      {circuitNodes.map((n, i) => (
        <g key={`cn-${i}`}>
          <motion.circle
            cx={n.cx} cy={n.cy} r={n.r + 6}
            fill="url(#circuitGlow)" opacity="0.2"
            animate={{ r: [n.r + 3, n.r + 10, n.r + 3], opacity: [0.1, 0.35, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
          />
          <motion.circle
            cx={n.cx} cy={n.cy} r={n.r}
            fill="url(#circuitGlow)" stroke="#C4B5FD" strokeWidth="1.5"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
          {i === 0 && (
            <motion.circle
              cx={n.cx} cy={n.cy} r={3}
              fill="#E9D5FF"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </g>
      ))}

      {/* Traveling pulses */}
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={`pulse-${i}`}
          r="3" fill="#E9D5FF"
          animate={{
            cx: [circuitNodes[0].cx, circuitNodes[i + 1].cx],
            cy: [circuitNodes[0].cy, circuitNodes[i + 1].cy],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
};

// ─────────────────────────────────────────────
// 6. CodeIllustration
// ─────────────────────────────────────────────
export const CodeIllustration = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none">
      <defs>
        <linearGradient id="screenBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="screenFrame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Monitor frame */}
      <rect x="60" y="60" width="280" height="220" rx="12" fill="url(#screenBg)" stroke="url(#screenFrame)" strokeWidth="3" />

      {/* Title bar */}
      <rect x="60" y="60" width="280" height="28" rx="12" fill="#4C1D95" />
      <rect x="60" y="76" width="280" height="12" fill="#4C1D95" />
      <circle cx="82" cy="74" r="5" fill="#EF4444" opacity="0.8" />
      <circle cx="98" cy="74" r="5" fill="#F59E0B" opacity="0.8" />
      <circle cx="114" cy="74" r="5" fill="#22C55E" opacity="0.8" />

      {/* Monitor stand */}
      <rect x="180" y="280" width="40" height="30" rx="2" fill="#6D28D9" />
      <rect x="150" y="308" width="100" height="8" rx="4" fill="#5B21B6" />

      {/* Code lines */}
      {[
        { x: 85, y: 110, w: 40, color: "#8B5CF6" },
        { x: 130, y: 110, w: 80, color: "#3B82F6" },
        { x: 100, y: 130, w: 60, color: "#A78BFA" },
        { x: 165, y: 130, w: 50, color: "#60A5FA" },
        { x: 100, y: 150, w: 90, color: "#C4B5FD" },
        { x: 115, y: 170, w: 70, color: "#8B5CF6" },
        { x: 190, y: 170, w: 40, color: "#3B82F6" },
        { x: 115, y: 190, w: 55, color: "#A78BFA" },
        { x: 100, y: 210, w: 80, color: "#60A5FA" },
        { x: 85, y: 230, w: 45, color: "#8B5CF6" },
        { x: 135, y: 230, w: 60, color: "#C4B5FD" },
        { x: 85, y: 250, w: 30, color: "#A78BFA" },
      ].map((line, i) => (
        <motion.rect
          key={i}
          x={line.x} y={line.y} width={line.w} height="6" rx="3"
          fill={line.color} opacity="0.7"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}

      {/* Left bracket < */}
      <motion.path
        d="M90 155 L75 170 L90 185"
        stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        animate={{ x: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Right bracket > */}
      <motion.path
        d="M290 155 L305 170 L290 185"
        stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Blinking cursor */}
      <motion.rect
        x="120" y="248" width="2" height="12" rx="1" fill="#E9D5FF"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
      />

      {/* Slash / between brackets */}
      <motion.line
        x1="185" y1="185" x2="195" y2="155"
        stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
};

// ─────────────────────────────────────────────
// Aliases for backward compatibility
// ─────────────────────────────────────────────
export const NetworkIllustration = InnovationIllustration;
