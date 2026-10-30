import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { guide } from "../data/guide";
import { policies, site } from "../data/site";
import { whatsappLink } from "../lib/format";
import { exit, sheet } from "../lib/motion";
import { useLockScroll } from "./ProductSheet";
import { ArrowIcon, CloseIcon, Reveal, SectionHeader, WhatsAppIcon } from "./ui";

interface Reading {
  eyebrow: string;
  title: string;
  body: string[];
}

// Ventana de lectura para políticas y artículos de la guía.
function ReadingSheet({ reading, onClose }: { reading: Reading | null; onClose: () => void }) {
  useLockScroll(reading !== null, onClose);
  return (
    <AnimatePresence>
      {reading && (
        <motion.div
          className="overlay overlay--center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25 } }}
          exit={{ opacity: 0, transition: exit }}
          onClick={onClose}
        >
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby="reading-title"
            className="sheet sheet--reading"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: sheet }}
            exit={{ opacity: 0, y: 24, scale: 0.98, transition: exit }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="icon-btn sheet__close" onClick={onClose} aria-label="Cerrar">
              <CloseIcon />
            </button>
            <div className="sheet__body">
              <p className="eyebrow">{reading.eyebrow}</p>
              <h2 id="reading-title" className="sheet__title">
                {reading.title}
              </h2>
              <div className="reading">
                {reading.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <a
                className="btn btn--ghost"
                href={whatsappLink(`Hola ${site.name}, tengo una pregunta sobre: ${reading.title}.`)}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon width={18} height={18} /> ¿Dudas? Escríbenos
              </a>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function useReading() {
  const [reading, setReading] = useState<Reading | null>(null);
  const close = useCallback(() => setReading(null), []);
  return { reading, open: setReading, close };
}

export function Trust() {
  const { reading, open, close } = useReading();
  return (
    <section id="compras" className="section container">
      <SectionHeader
        eyebrow="Compra con confianza"
        title="Claro desde"
        accent="el principio."
        text="Así cuidamos cada pedido, de la compra a la entrega."
      />
      <div className="policies">
        {policies.map((p, i) => (
          <Reveal key={p.id} delay={0.05 * i}>
            <button className="policy" onClick={() => open({ eyebrow: "Políticas", title: p.title, body: p.body })}>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <span className="policy__more">
                Leer más <ArrowIcon width={16} height={16} />
              </span>
            </button>
          </Reveal>
        ))}
      </div>
      <ReadingSheet reading={reading} onClose={close} />
    </section>
  );
}

export function Guide() {
  const { reading, open, close } = useReading();
  return (
    <section id="guia" className="section container">
      <SectionHeader
        eyebrow="Guía de perfumería"
        title="Aprende a elegir"
        accent="y a lucirlo."
        text="Lo esencial para entender tus perfumes y sacarles el máximo provecho."
      />
      <div className="guide">
        {guide.map((a, i) => (
          <Reveal key={a.id} delay={0.05 * i} className={i === 0 ? "guide__lead" : undefined}>
            <button className="article" onClick={() => open({ eyebrow: "Guía", title: a.title, body: a.body })}>
              <span className="article__num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{a.title}</h3>
              <p>{a.summary}</p>
              <span className="policy__more">
                Leer <ArrowIcon width={16} height={16} />
              </span>
            </button>
          </Reveal>
        ))}
      </div>
      <ReadingSheet reading={reading} onClose={close} />
    </section>
  );
}
