import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { Product } from "../data/products";
import { useCart } from "../lib/cart";
import { lempiras, whatsappLink } from "../lib/format";
import { exit, sheet } from "../lib/motion";
import { CloseIcon, WhatsAppIcon } from "./ui";

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

export function ProductSheet({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { add, open } = useCart();
  useLockScroll(product !== null, onClose);

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
            <div className="sheet__body">
              <p className="eyebrow">{product.brand}</p>
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

              <p className="label">Notas olfativas</p>
              <ul className="chips">
                {product.notes.map((n) => (
                  <li key={n}>{n}</li>
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
                      `Hola Sévora Essence, me interesa el ${product.name} de ${product.brand} (${product.ml} ml). ¿Está disponible?`,
                    )}
                  >
                    <WhatsAppIcon width={18} height={18} /> Preguntar
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
