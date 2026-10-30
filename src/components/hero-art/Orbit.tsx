import { motion, useAnimationFrame, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { easeOut } from "../../lib/motion";

// Notas olfativas que giran en una órbita inclinada alrededor del logo: pasan por
// delante (más grandes y brillantes) y por detrás (pequeñas y tenues).

const NOTES = ["Oud", "Ámbar", "Vainilla", "Bergamota", "Almizcle", "Rosa", "Sándalo"];
const PERIOD = 34; // segundos por vuelta

export function Orbit() {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLSpanElement | null)[]>([]);

  const place = (t: number) => {
    const el = wrap.current;
    if (!el) return;
    const rx = el.clientWidth * 0.46;
    const ry = el.clientHeight * 0.26;
    items.current.forEach((node, i) => {
      if (!node) return;
      const a = (t / PERIOD) * Math.PI * 2 + (i / NOTES.length) * Math.PI * 2;
      const x = Math.cos(a) * rx;
      const y = Math.sin(a) * ry;
      const front = (Math.sin(a) + 1) / 2; // 0 detrás, 1 delante
      node.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(0.72 + front * 0.38).toFixed(3)})`;
      node.style.opacity = (0.22 + front * 0.78).toFixed(3);
      node.style.zIndex = front > 0.5 ? "2" : "0";
      node.style.filter = front < 0.35 ? `blur(${((0.35 - front) * 4).toFixed(2)}px)` : "none";
    });
  };

  useAnimationFrame((time) => {
    if (!reduced) place(time / 1000);
  });

  useEffect(() => {
    if (reduced) place(3);
  });

  return (
    <motion.div
      className="hero__emblem hero__emblem--wide orbit"
      ref={wrap}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, delay: 0.2, ease: easeOut }}
      aria-hidden
    >
      <div className="orbit__track" />
      <img className="orbit__logo" src="brand/sevora-logo.webp" alt="" />
      {NOTES.map((n, i) => (
        <span key={n} className="orbit__note" ref={(node) => void (items.current[i] = node)}>
          {n}
        </span>
      ))}
    </motion.div>
  );
}
