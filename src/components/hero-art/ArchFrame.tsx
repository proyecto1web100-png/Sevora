import { motion, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { easeOut } from "../../lib/motion";

// Arco árabe dorado que enmarca todo el bloque de texto sin cruzarlo: los lados corren
// por fuera del contenido y la punta del arco queda encima. Una luz recorre el arco
// cada pocos segundos y la estrella de la clave brilla al pasar.

function archPath(w: number, h: number, cap: number, inset: number) {
  const l = inset;
  const r = w - inset;
  const top = inset;
  const shoulder = cap + inset * 0.6;
  const mid = w / 2;
  return [
    `M${l},${h}`,
    `L${l},${shoulder}`,
    `C${l},${shoulder - cap * 0.55} ${mid - (mid - l) * 0.35},${top + cap * 0.22} ${mid},${top}`,
    `C${mid + (r - mid) * 0.35},${top + cap * 0.22} ${r},${shoulder - cap * 0.55} ${r},${shoulder}`,
    `L${r},${h}`,
  ].join(" ");
}

function star(cx: number, cy: number, R: number) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const rad = i % 2 === 0 ? R : R * 0.45;
    const a = (Math.PI / 8) * i - Math.PI / 2;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

export function ArchFrame() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const cap = Math.min(Math.max(w * 0.22, 80), 170);
  const outer = w ? archPath(w, h, cap, 2) : "";
  const inner = w ? archPath(w, h, cap - 10, 14) : "";

  return (
    <div className="arch" ref={ref} style={{ ["--arch-cap" as string]: `${cap}px` }} aria-hidden>
      {w > 0 && (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <linearGradient id="arch-line" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F6E3C8" />
              <stop offset="55%" stopColor="#C9A27E" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C9A27E" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={outer}
            fill="none"
            stroke="url(#arch-line)"
            strokeWidth="1.4"
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, delay: 0.2, ease: easeOut }}
          />
          <motion.path
            d={inner}
            fill="none"
            stroke="url(#arch-line)"
            strokeWidth="0.8"
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 2.2, delay: 0.6, ease: easeOut }}
          />
          {!reduced && (
            <motion.path
              d={outer}
              fill="none"
              stroke="#FFF4E2"
              strokeWidth="2.4"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.06 0.94"
              initial={{ strokeDashoffset: 0.06, opacity: 0 }}
              animate={{ strokeDashoffset: [0.06, -1], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.2, delay: 2.4, repeat: Infinity, repeatDelay: 3, ease: [0.45, 0, 0.25, 1] }}
            />
          )}
          <motion.polygon
            points={star(w / 2, 2, 11)}
            fill="#E2C29F"
            style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
            initial={reduced ? false : { scale: 0, rotate: -90, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { scale: [0, 1.2, 1], rotate: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.6, ease: easeOut }}
          />
        </svg>
      )}
    </div>
  );
}
