import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { easeOut } from "../../lib/motion";

// El frasco real (Amber Oud) entra flotando, se inclina un poco siguiendo el cursor
// y cada pocos segundos un barrido de luz cruza el vidrio.

const IMG = "products/amber-oud-bottle.webp";

export function Bottle3D() {
  const reduced = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-1, 1], [-14, 14]), { stiffness: 120, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-1, 1], [10, -10]), { stiffness: 120, damping: 18 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduced]);

  return (
    <div className="hero__emblem hero__emblem--tall bottle3d" aria-hidden>
      <motion.div
        className="bottle3d__stage"
        initial={reduced ? false : { opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: easeOut }}
        style={{ rotateX, rotateY }}
      >
        <img src={IMG} alt="" />
        {!reduced && (
          <motion.span
            className="bottle3d__sweep"
            style={{ WebkitMaskImage: `url(${IMG})`, maskImage: `url(${IMG})` }}
            initial={{ backgroundPosition: "160% 0" }}
            animate={{ backgroundPosition: ["160% 0", "-60% 0"] }}
            transition={{ duration: 1.6, delay: 1.6, repeat: Infinity, repeatDelay: 4, ease: [0.45, 0, 0.25, 1] }}
          />
        )}
      </motion.div>
      <div className="bottle3d__shadow" />
    </div>
  );
}
