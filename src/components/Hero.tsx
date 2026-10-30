import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { whatsappLink } from "../lib/format";
import { easeOut } from "../lib/motion";
import { HeroRipple } from "./HeroRipple";
import { ArrowIcon, WhatsAppIcon } from "./ui";

const lines = [
  { words: ["Esencia", "que"], gold: false },
  { words: ["se", "queda."], gold: true },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  let wordIndex = 0;

  return (
    <section id="inicio" className="hero" ref={ref}>
      <div className="hero__glow" aria-hidden />

      <motion.div className="hero__content" style={{ y, opacity }}>
        <HeroRipple />
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: easeOut, delay: 0.2 }}
        >
          Sévora Essence · Perfumería árabe
        </motion.p>

        <h1 className="hero__title">
          {lines.map((line, i) => (
            <span key={i} className={`hero__line ${line.gold ? "gold" : ""}`}>
              {line.words.map((word) => {
                const delay = 0.45 + wordIndex++ * 0.09;
                return (
                  <motion.span
                    key={word}
                    className="hero__word"
                    initial={{ opacity: 0, y: "0.35em", filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1, ease: easeOut, delay }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </h1>

        <motion.p
          className="hero__lead"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 1 }}
        >
          Perfumes árabes 100% originales, elegidos para durar en tu piel y en la memoria. Envíos a toda Honduras.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 1.15 }}
        >
          <a className="btn btn--gold" href="#coleccion">
            Ver colección <ArrowIcon width={18} height={18} />
          </a>
          <a
            className="btn btn--ghost"
            href={whatsappLink("Hola Sévora Essence, me gustaría recibir asesoría para elegir un perfume.")}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon width={18} height={18} /> Asesoría por WhatsApp
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        aria-hidden
      >
        <span />
      </motion.div>
    </section>
  );
}
