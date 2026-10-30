import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { useCart } from "../lib/cart";
import { easeOut, snappy } from "../lib/motion";
import { BagIcon } from "./ui";

const links = [
  { href: "#coleccion", label: "Colección" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#mayoristas", label: "Mayoristas" },
  { href: "#preguntas", label: "Preguntas" },
];

export function Nav() {
  const { count, open } = useCart();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <motion.header
      className={`nav ${scrolled ? "nav--glass" : ""}`}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
    >
      <a href="#inicio" className="nav__brand" aria-label="Sévora Perfumerie, inicio">
        <img src="brand/sevora-logo.webp" alt="" width={36} height={36} />
        <span>SÉVORA</span>
      </a>
      <nav className="nav__links" aria-label="Principal">
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <button className="nav__cart" onClick={open} aria-label={`Ver pedido, ${count} productos`}>
        <BagIcon />
        <span className="nav__cart-label">Pedido</span>
        <AnimatePresence initial={false} mode="popLayout">
          {count > 0 && (
            <motion.span
              key={count}
              className="nav__count"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.1 } }}
              transition={snappy}
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.header>
  );
}
