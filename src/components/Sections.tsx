import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { brands } from "../data/products";
import { faqs, site, trustPoints } from "../data/site";
import { useCart } from "../lib/cart";
import { whatsappLink } from "../lib/format";
import { easeOut, exit } from "../lib/motion";
import { ChevronIcon, Reveal, SectionHeader, WhatsAppIcon } from "./ui";

export function BrandStrip() {
  return (
    <Reveal className="brandstrip container">
      <p className="eyebrow">Marcas que trabajamos</p>
      <ul>
        {brands.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </Reveal>
  );
}

export function Why() {
  const [first, ...rest] = trustPoints;
  return (
    <section id="nosotros" className="section container">
      <SectionHeader
        eyebrow="Por qué Sévora"
        title="Lujo accesible,"
        accent="sin dudas."
        text="Somos una tienda hondureña dedicada a la perfumería árabe. Te acompañamos desde la elección hasta que el frasco llega a tus manos."
      />
      <div className="bento">
        <Reveal className="bento__item bento__item--hero">
          <img src="brand/sevora-logo.webp" alt="" className="bento__logo" />
          <h3>{first.title}</h3>
          <p>{first.text}</p>
        </Reveal>
        {rest.map((t, i) => (
          <Reveal key={t.title} className="bento__item" delay={0.06 * (i + 1)}>
            <span className="bento__num">0{i + 2}</span>
            <h3>{t.title}</h3>
            <p>{t.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Wholesale() {
  return (
    <section id="mayoristas" className="section container">
      <Reveal className="wholesale">
        <div>
          <p className="eyebrow">Mayoristas y revendedores</p>
          <h2 className="display">
            Haz crecer tu negocio <span className="gold">con Sévora.</span>
          </h2>
          <p className="lead">
            ¿Tienes una tienda, salón o vendes por catálogo? Accede a precios especiales por volumen, producto original
            garantizado y envíos a todo {site.country}.
          </p>
        </div>
        <ul className="wholesale__list">
          <li>Precios por volumen</li>
          <li>Catálogo siempre actualizado</li>
          <li>Atención directa y personalizada</li>
        </ul>
        <a
          className="btn btn--gold"
          href={whatsappLink("Hola Sévora Perfumerie, me interesa comprar al por mayor. ¿Me comparten la lista de precios?")}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon width={18} height={18} /> Solicitar precios de mayoreo
        </a>
      </Reveal>
    </section>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="preguntas" className="section container container--narrow">
      <SectionHeader eyebrow="Preguntas frecuentes" title="Todo claro," accent="antes de pedir." />
      <Reveal>
        <ul className="faq">
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            return (
              <li key={f.q} className={isOpen ? "is-open" : ""}>
                <button aria-expanded={isOpen} onClick={() => setOpenIndex(isOpen ? null : i)}>
                  <span>{f.q}</span>
                  <ChevronIcon className="faq__chevron" />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1, transition: { duration: 0.35, ease: easeOut } }}
                      exit={{ height: 0, opacity: 0, transition: exit }}
                      className="faq__answer"
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer container">
      <div className="footer__brand">
        <img src="brand/sevora-logo.webp" alt="Sévora Perfumerie" width={72} height={72} />
        <p className="muted">Perfumería árabe original en {site.country}.</p>
      </div>
      <div className="footer__cols">
        <div>
          <p className="label">Tienda</p>
          <a href="#coleccion">Colección</a>
          <a href="#mayoristas">Mayoristas</a>
          <a href="#preguntas">Preguntas frecuentes</a>
        </div>
        <div>
          <p className="label">Contacto</p>
          <a href={whatsappLink("Hola Sévora Perfumerie")} target="_blank" rel="noreferrer">
            WhatsApp {site.whatsappDisplay}
          </a>
          <span className="muted">{site.country}</span>
        </div>
      </div>
      <p className="footer__legal muted small">
        © {new Date().getFullYear()} {site.name}. Las marcas mencionadas pertenecen a sus respectivos dueños.
      </p>
    </footer>
  );
}

export function WhatsAppFab() {
  const { isOpen } = useCart();
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.a
          className="fab"
          href={whatsappLink("Hola Sévora Perfumerie, tengo una consulta.")}
          target="_blank"
          rel="noreferrer"
          aria-label="Escríbenos por WhatsApp"
          initial={{ opacity: 0, scale: 0.9, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: easeOut, delay: 1.6 } }}
          exit={{ opacity: 0, scale: 0.9, transition: exit }}
        >
          <WhatsAppIcon width={26} height={26} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
