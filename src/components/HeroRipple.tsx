import { motion, useInView, useReducedMotion, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { easeOut } from "../lib/motion";

// Una gota dorada cae sobre el título y abre ondas concéntricas detrás de él;
// la primera ronda deja el aro del logo. Mientras la portada está a la vista, cae una gota nueva cada pocos segundos.

const C = 200; // centro del viewBox
const RING = 196; // radio del aro final
const FALL = 0.95; // segundos que tarda la gota en caer
const FIRST_DELAY = 0.35;
const EVERY_MS = 7000;

const fall = [0.55, 0, 0.9, 0.55] as const; // acelera como la gravedad

const ripples = [
  { to: 110, width: 2.2, delay: 0 },
  { to: 165, width: 1.6, delay: 0.26 },
  { to: 230, width: 1.1, delay: 0.52 },
];

function Drop({ delay }: { delay: number }) {
  return (
    <motion.g
      initial={{ y: -190, opacity: 0, scaleY: 0.9 }}
      animate={{ y: [-190, C - 14], opacity: [0, 1, 1], scaleY: [0.9, 1.25] }}
      transition={{ duration: FALL, delay, ease: fall, opacity: { duration: FALL, delay, times: [0, 0.25, 1] } }}
      style={{ x: C, transformBox: "fill-box", originX: 0.5, originY: 1 }}
    >
      <motion.g
        initial={{ scale: 1.3, opacity: 1 }}
        animate={{ scale: 0.3, opacity: 0 }}
        transition={{ duration: 0.14, delay: delay + FALL, ease: "easeIn" }}
      >
        <path d="M0,-15 C5,-7 9,-1 9,4 A9,9 0 1 1 -9,4 C-9,-1 -5,-7 0,-15Z" fill="url(#drop)" />
        <ellipse cx="-3.2" cy="3" rx="1.8" ry="3.2" fill="#fff8ee" opacity="0.7" />
      </motion.g>
    </motion.g>
  );
}

function Ripples({ delay }: { delay: number }) {
  const impact = delay + FALL;
  return (
    <g>
      <motion.circle
        cx={C}
        cy={C}
        fill="url(#splash)"
        initial={{ r: 0, opacity: 0 }}
        animate={{ r: [0, 70], opacity: [0, 0.9, 0] }}
        transition={{ duration: 1, delay: impact, ease: easeOut }}
      />
      {ripples.map((rp, i) => (
        <motion.circle
          key={i}
          cx={C}
          cy={C}
          fill="none"
          stroke="url(#ring)"
          initial={{ r: 4, opacity: 0, strokeWidth: rp.width }}
          animate={{ r: rp.to, opacity: [0, 0.95, 0], strokeWidth: 0.4 }}
          transition={{
            duration: 2.2,
            delay: impact + rp.delay,
            ease: easeOut,
            opacity: { duration: 2.2, delay: impact + rp.delay, times: [0, 0.08, 1] },
          }}
        />
      ))}
    </g>
  );
}

export function HeroRipple({ scale }: { scale: MotionValue<number> }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced || !inView) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setCycle((c) => c + 1);
    }, EVERY_MS);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const ringDelay = FIRST_DELAY + FALL + ripples[1].delay;

  const delay = cycle === 0 ? FIRST_DELAY : 0;

  return (
    <>
      <motion.div className="hero__ring" style={{ scale }} aria-hidden>
        <svg viewBox="0 0 400 400" ref={ref}>
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F6E3C8" />
              <stop offset="50%" stopColor="#C9A27E" />
              <stop offset="100%" stopColor="#7A5C42" />
            </linearGradient>
            <radialGradient id="splash">
              <stop offset="0%" stopColor="#F6E3C8" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#E2C29F" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* aro permanente: nace con la primera onda */}
          <motion.circle
            cx={C}
            cy={C}
            fill="none"
            stroke="url(#ring)"
            strokeWidth="1"
            initial={reduced ? false : { r: 24, opacity: 0 }}
            animate={{ r: RING, opacity: 1 }}
            transition={{ duration: 2.4, delay: ringDelay, ease: easeOut }}
          />
          {!reduced && <Ripples key={cycle} delay={delay} />}
        </svg>
      </motion.div>

      {/* la gota va delante del título */}
      {!reduced && (
        <motion.div className="hero__ring hero__ring--front" style={{ scale }} aria-hidden>
          <svg viewBox="0 0 400 400">
            <defs>
              <linearGradient id="drop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FBEBD3" />
                <stop offset="55%" stopColor="#E2C29F" />
                <stop offset="100%" stopColor="#9C7653" />
              </linearGradient>
            </defs>
            <Drop key={cycle} delay={delay} />
          </svg>
        </motion.div>
      )}
    </>
  );
}
