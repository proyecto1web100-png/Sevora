import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { sections, site } from "../data/site";
import { whatsappLink } from "../lib/format";
import { easeOut, exit, sheet } from "../lib/motion";
import { useLockScroll } from "./ProductSheet";
import { CloseIcon, VisaBadge, WhatsAppIcon } from "./ui";

// La sección que está a la vista: la última cuyo inicio ya pasó por debajo de la barra.
export function useActiveSection() {
  const [active, setActive] = useState(sections[0].id);
  useEffect(() => {
    const update = () => {
      let current = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) current = s.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return active;
}

export function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const active = useActiveSection();
  useLockScroll(open, onClose);

  const go = (id: string) => {
    onClose();
    // Esperamos a que el menú se cierre y se libere el scroll antes de desplazarnos.
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 220);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25 } }}
          exit={{ opacity: 0, transition: exit }}
          onClick={onClose}
        >
          <motion.nav
            className="menu"
            aria-label="Secciones de la página"
            initial={{ x: "-100%" }}
            animate={{ x: 0, transition: sheet }}
            exit={{ x: "-100%", transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="menu__head">
              <img src="brand/sevora-logo.webp" alt={site.name} width={48} height={48} />
              <button className="icon-btn" onClick={onClose} aria-label="Cerrar menú">
                <CloseIcon />
              </button>
            </header>

            <p className="label menu__label">Ir a</p>
            <ul className="menu__list">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.03, ease: easeOut }}
                >
                  <a
                    href={`#${s.id}`}
                    className={active === s.id ? "is-active" : ""}
                    aria-current={active === s.id ? "location" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      go(s.id);
                    }}
                  >
                    {s.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="menu__foot">
              <a
                className="btn btn--gold btn--block"
                href={whatsappLink(`Hola ${site.name}, tengo una consulta.`)}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon width={18} height={18} /> Escríbenos por WhatsApp
              </a>
              <p className="muted small">{site.hours}</p>
              <div className="menu__pay">
                <span className="label">Aceptamos</span>
                <VisaBadge height={20} />
                <span className="muted small">y transferencia</span>
              </div>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
