import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "../../lib/motion";

// El aro del logo, vivo: se dibuja al cargar y cada pocos segundos lo recorre un
// destello de metal pulido mientras algunas chispas doradas titilan a su alrededor.

const C = 200;
const R = 180;
const SWEEP_EVERY = 4.2;

const sparks = [
  { a: -60, d: 1.1, s: 1 },
  { a: 20, d: 2.6, s: 0.7 },
  { a: 115, d: 1.8, s: 0.85 },
  { a: 200, d: 3.3, s: 0.6 },
  { a: 250, d: 0.6, s: 0.9 },
  { a: 160, d: 4, s: 0.55 },
];

function Spark({ angle, delay, size }: { angle: number; delay: number; size: number }) {
  const rad = (angle * Math.PI) / 180;
  const off = R + 14 + (angle % 3) * 6;
  const x = C + Math.cos(rad) * off;
  const y = C + Math.sin(rad) * off;
  return (
    <motion.path
      d="M0,-9 L2,-2 L9,0 L2,2 L0,9 L-2,2 L-9,0 L-2,-2 Z"
      fill="#F6E3C8"
      style={{ x, y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, size, 0], opacity: [0, 1, 0], rotate: [0, 45] }}
      transition={{ duration: 1.4, delay: 1.6 + delay, repeat: Infinity, repeatDelay: 3.2 + delay, ease: "easeInOut" }}
    />
  );
}

export function LiveRing() {
  const reduced = useReducedMotion();
  return (
    <div className="hero__emblem" aria-hidden>
      <svg viewBox="0 0 400 400">
        <defs>
          <linearGradient id="lr-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F6E3C8" />
            <stop offset="50%" stopColor="#C9A27E" />
            <stop offset="100%" stopColor="#A47E5C" />
          </linearGradient>
          <radialGradient id="lr-glow">
            <stop offset="60%" stopColor="#E2C29F" stopOpacity="0" />
            <stop offset="90%" stopColor="#E2C29F" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#E2C29F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <motion.circle
          cx={C}
          cy={C}
          r={R + 18}
          fill="url(#lr-glow)"
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { opacity: [0, 1, 0.6, 1] }}
          transition={{ duration: 6, delay: 1, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke="url(#lr-ring)"
          strokeWidth="2"
          style={{ rotate: -90, transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.2, ease: easeOut }}
        />
        <circle cx={C} cy={C} r={R - 12} fill="none" stroke="#C9A27E" strokeOpacity="0.25" strokeWidth="0.8" />
        {!reduced && (
          <>
            <motion.circle
              cx={C}
              cy={C}
              r={R}
              fill="none"
              stroke="#FFF4E2"
              strokeWidth="4"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.18 0.82"
              initial={{ strokeDashoffset: 0.18, opacity: 0 }}
              animate={{ strokeDashoffset: [0.18, -0.82], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2, delay: 2.2, repeat: Infinity, repeatDelay: SWEEP_EVERY, ease: [0.45, 0, 0.25, 1] }}
            />
            {sparks.map((s) => (
              <Spark key={s.a} angle={s.a} delay={s.d} size={s.s} />
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
