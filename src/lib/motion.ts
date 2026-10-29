import type { Transition } from "framer-motion";

// Curvas y resortes compartidos: entradas rápidas que desaceleran suave, salidas cortas.
export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeIn = [0.4, 0, 1, 1] as const;

export const spring: Transition = { type: "spring", stiffness: 380, damping: 30, mass: 0.8 };
export const snappy: Transition = { type: "spring", stiffness: 500, damping: 35 };
export const sheet: Transition = { type: "spring", stiffness: 280, damping: 28 };
export const exit: Transition = { duration: 0.15, ease: easeIn };
