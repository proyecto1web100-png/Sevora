import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Product } from "../data/products";
import { site } from "../data/site";
import { useCart } from "../lib/cart";
import { useCatalog } from "../lib/catalog";
import { lempiras, productUrl, whatsappLink } from "../lib/format";
import { similarProducts } from "../lib/match";
import { easeOut, exit, sheet } from "../lib/motion";
import { CloseIcon, ShareIcon, WhatsAppIcon } from "./ui";

export function useLockScroll(locked: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onEscape();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [locked, onEscape]);
}

function Meter({ label, value, low, high }: { label: string; value: number; low: string; high: string }) {
  return (
    <div className="meter">
      <div className="meter__head">
        <span>{label}</span>
        <span className="muted">{value <= 2 ? low : value >= 4 ? high : "Media"}</span>
      </div>
      <div className="meter__track" role="meter" aria-valuemin={1} aria-valuemax={5} aria-valuenow={value} aria-label={label}>
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={i}
            className={i <= value ? "is-on" : ""}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease: easeOut }}
          />
        ))}
      </div>
    </div>
  );
}

function ShareButton({ product }: { product: Product }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = productUrl(product.id);
    const title = `${product.name} de ${product.brand} en ${site.name}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // El usuario canceló o el navegador no permite compartir.
    }
  };
  return (
    <button className="btn btn--small btn--ghost" onClick={share}>
      <ShareIcon width={16} height={16} /> {copied ? "Enlace copiado" : "Compartir"}
    </button>
  );
}

const TIERS = [
  { key: "notesTop", name: "Salida", hint: "Primeros minutos" },
  { key: "notesHeart", name: "Corazón", hint: "Varias horas" },
  { key: "notesBase", name: "Fondo", hint: "Lo que queda" },
] as const;

export function ProductSheet({
  product,
  onClose,
  onSelect,
}: {
  product: Product | null;
  onClose: () => void;
  onSelect: (p: Product) => void;
}) {
  const { add, open } = useCart();
  const catalog = useCatalog();
  const panel = useRef<HTMLDivElement>(null);
  useLockScroll(product !== null, onClose);

  useEffect(() => {
    panel.current?.scrollTo({ top: 0 });
  }, [product?.id]);

  const similar = product ? similarProducts(product, catalog) : [];

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="overlay overlay--center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25 } }}
          exit={{ opacity: 0, transition: exit }}
          onClick={onClose}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            className="sheet"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: sheet }}
            exit={{ opacity: 0, y: 24, scale: 0.98, transition: exit }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="icon-btn sheet__close" onClick={onClose} aria-label="Cerrar">
              <CloseIcon />
            </button>
            <div className="sheet__media tile">
              {product.badge && <span className="badge">{product.badge}</span>}
              <img src={product.image} alt={`${product.name} de ${product.brand}`} />
            </div>
            <div className="sheet__body" key={product.id}>
              <div className="sheet__top">
                <p className="eyebrow">{product.brand}</p>
                <ShareButton product={product} />
              </div>
              <h2 id="sheet-title" className="sheet__title">
                {product.name}
              </h2>
              <p className="gold sheet__tagline">{product.tagline}</p>
              <p className="lead">{product.description}</p>

              <dl className="specs">
                <div>
                  <dt>Familia</dt>
                  <dd>{product.family}</dd>
                </div>
                <div>
                  <dt>Concentración</dt>
                  <dd>{product.concentration}</dd>
                </div>
                <div>
                  <dt>Tamaño</dt>
                  <dd>{product.ml} ml</dd>
                </div>
                <div>
                  <dt>Para</dt>
                  <dd>{product.gender}</dd>
                </div>
              </dl>

              <p className="label">Pirámide olfativa</p>
              <ol className="pyramid">
                {TIERS.filter((t) => product[t.key].length).map((t, i) => (
                  <motion.li
                    key={t.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: easeOut }}
                  >
                    <div className="pyramid__tier">
                      <span>{t.name}</span>
                      <span className="muted small">{t.hint}</span>
                    </div>
                    <p>{product[t.key].join(" · ")}</p>
                  </motion.li>
                ))}
              </ol>

              <div className="meters">
                <Meter label="Duración" value={product.longevity} low="Ligera" high="Muy larga" />
                <Meter label="Proyección" value={product.sillage} low="Cercana" high="Deja estela" />
              </div>

              <p className="label">Cuándo usarlo</p>
              <ul className="chips chips--tight">
                {product.moments.map((m) => (
                  <li key={m}>{m === "Día" ? "☀︎ De día" : "☾ De noche"}</li>
                ))}
                {product.climates.map((c) => (
                  <li key={c}>{c === "Calor" ? "Clima caluroso" : "Clima fresco"}</li>
                ))}
                {product.occasions.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>

              <div className="sheet__buy">
                <span className="price price--lg">{lempiras(product.price)}</span>
                <div className="row">
                  <button
                    className="btn btn--gold"
                    disabled={!product.inStock}
                    onClick={() => {
                      add(product.id);
                      onClose();
                      open();
                    }}
                  >
                    {product.inStock ? "Agregar al pedido" : "Agotado"}
                  </button>
                  <a
                    className="btn btn--ghost"
                    target="_blank"
                    rel="noreferrer"
                    href={whatsappLink(
                      `Hola ${site.name}, me interesa el ${product.name} de ${product.brand} (${product.ml} ml). ¿Está disponible? ${productUrl(product.id)}`,
                    )}
                  >
                    <WhatsAppIcon width={18} height={18} /> Preguntar
                  </a>
                </div>
              </div>

              {similar.length > 0 && (
                <div className="similar">
                  <p className="label">También te puede gustar</p>
                  <ul>
                    {similar.map((p) => (
                      <li key={p.id}>
                        <button onClick={() => onSelect(p)}>
                          <span className="similar__img tile">
                            <img src={p.image} alt="" loading="lazy" />
                          </span>
                          <span className="similar__info">
                            <span className="card__brand">{p.brand}</span>
                            <span className="similar__name">{p.name}</span>
                            <span className="muted small">{lempiras(p.price)}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
