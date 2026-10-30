import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { faqs, site, social, trustPoints } from "../data/site";
import { useBrands } from "../lib/catalog";
import { useCart } from "../lib/cart";
import { whatsappLink } from "../lib/format";
import { easeOut, exit } from "../lib/motion";
import { ChevronIcon, FacebookIcon, InstagramIcon, Reveal, SectionHeader, TikTokIcon, WhatsAppIcon } from "./ui";

export function BrandStrip() {
  const brands = useBrands();
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
        <img src="brand/sevora-logo.webp" alt={site.name} width={72} height={72} />
        <p className="muted">Perfumería árabe original en {site.country}.</p>
      </div>
      <div className="footer__cols">
        <div>
          <p className="label">Tienda</p>
          <a href="#coleccion">Colección</a>
          <a href="#encuentra">Encuentra tu perfume</a>
          <a href="#guia">Guía de perfumería</a>
          <a href="#mayoristas">Mayoristas</a>
        </div>
        <div>
          <p className="label">Ayuda</p>
          <a href="#compras">Envíos y devoluciones</a>
          <a href="#compras">Garantía de originalidad</a>
          <a href="#preguntas">Preguntas frecuentes</a>
        </div>
        <div>
          <p className="label">Contacto</p>
          <a href={whatsappLink(`Hola ${site.name}`)} target="_blank" rel="noreferrer">
            WhatsApp {site.whatsappDisplay}
          </a>
          <span className="muted">{site.hours}</span>
          <span className="muted">{site.country}</span>
          <SocialLinks />
        </div>
      </div>
      <p className="footer__legal muted small">
        © {new Date().getFullYear()} {site.name}. Las marcas mencionadas pertenecen a sus respectivos dueños.
      </p>
    </footer>
  );
}

const SOCIAL = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
] as const;

export function SocialLinks() {
  const items = SOCIAL.filter((s) => social[s.key]);
  if (!items.length) return null;
  return (
    <div className="social">
      {items.map(({ key, label, Icon }) => (
        <a key={key} href={social[key]} target="_blank" rel="noreferrer" aria-label={label} className="icon-btn">
          <Icon width={18} height={18} />
        </a>
      ))}
    </div>
  );
}

export function WhatsAppFab() {
  const { isOpen } = useCart();
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.a
          className="fab"
          href={whatsappLink(`Hola ${site.name}, tengo una consulta.`)}
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
