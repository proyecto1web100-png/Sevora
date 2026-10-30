import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "../../lib/motion";

// Silueta de frasco que se dibuja con línea dorada y luego se llena de líquido champagne
// con una superficie que ondula y burbujas que suben.

const BODY = "M48,96 Q48,80 64,80 L136,80 Q152,80 152,96 L152,236 Q152,252 136,252 L64,252 Q48,252 48,236 Z";
const NECK = "M88,80 L88,66 L112,66 L112,80";
const CAP = "M80,24 Q80,18 86,18 L114,18 Q120,18 120,24 L120,60 Q120,66 114,66 L86,66 Q80,66 80,60 Z";

const bubbles = [
  { x: 74, d: 2.6, delay: 3.4, r: 2.2 },
  { x: 104, d: 3.2, delay: 4.1, r: 1.6 },
  { x: 128, d: 2.8, delay: 4.8, r: 2 },
  { x: 90, d: 3.6, delay: 5.6, r: 1.3 },
];

export function BottleFill() {
  const reduced = useReducedMotion();
  const draw = (delay: number) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 1.6, delay, ease: easeOut },
        };

  return (
    <div className="hero__emblem hero__emblem--tall" aria-hidden>
      <svg viewBox="0 0 200 270">
        <defs>
          <linearGradient id="bf-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F6E3C8" />
            <stop offset="100%" stopColor="#B38B66" />
          </linearGradient>
          <linearGradient id="bf-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F3DCBC" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#A47E5C" stopOpacity="0.9" />
          </linearGradient>
          <clipPath id="bf-clip">
            <path d={BODY} />
          </clipPath>
        </defs>

        {/* líquido */}
        <g clipPath="url(#bf-clip)">
          <motion.g
            initial={reduced ? false : { y: 180 }}
            animate={{ y: 0 }}
            transition={{ duration: 2.6, delay: 1.4, ease: [0.3, 0.7, 0.3, 1] }}
          >
            <motion.path
              d="M-200,118 Q-175,110 -150,118 T-100,118 T-50,118 T0,118 T50,118 T100,118 T150,118 T200,118 T250,118 T300,118 L300,280 L-200,280 Z"
              fill="url(#bf-liquid)"
              animate={reduced ? undefined : { x: [0, 100] }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />
          </motion.g>
          {!reduced &&
            bubbles.map((b, i) => (
              <motion.circle
                key={i}
                cx={b.x}
                r={b.r}
                fill="#FFF4E2"
                initial={{ cy: 248, opacity: 0 }}
                animate={{ cy: [248, 130], opacity: [0, 0.8, 0] }}
                transition={{ duration: b.d, delay: b.delay, repeat: Infinity, repeatDelay: 2.5, ease: "easeOut" }}
              />
            ))}
        </g>

        {/* vidrio y tapa */}
        <motion.path d={BODY} fill="none" stroke="url(#bf-line)" strokeWidth="2" {...draw(0.2)} />
        <motion.path d={NECK} fill="none" stroke="url(#bf-line)" strokeWidth="2" {...draw(0.7)} />
        <motion.path d={CAP} fill="none" stroke="url(#bf-line)" strokeWidth="2" {...draw(0.9)} />
        <motion.path
          d="M62,104 L62,200"
          stroke="#FFF4E2"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ duration: 1, delay: 3.6 }}
        />
      </svg>
    </div>
  );
}
