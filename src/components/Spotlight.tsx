import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Product } from "../data/products";
import { useCart } from "../lib/cart";
import { lempiras } from "../lib/format";
import { Reveal } from "./ui";

export function Spotlight({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const ref = useRef<HTMLElement>(null);
  const { add } = useCart();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [48, -48]);

  return (
    <section className="spotlight container" ref={ref} aria-labelledby="spotlight-title">
      <Reveal className="spotlight__tile tile">
        <motion.img src={product.image} alt={`${product.name} de ${product.brand}`} style={{ y }} loading="lazy" />
      </Reveal>
      <div className="spotlight__copy">
        <Reveal>
          <p className="eyebrow">Destacado · {product.brand}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="spotlight-title" className="display">
            {product.name}.
            <br />
            <span className="gold">{product.tagline}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="lead">{product.description}</p>
          <ul className="chips" aria-label="Notas olfativas">
            {product.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <div className="spotlight__buy">
            <span className="price price--lg">{lempiras(product.price)}</span>
            <span className="muted">
              {product.concentration} · {product.ml} ml
            </span>
          </div>
          <div className="row">
            <button className="btn btn--gold" onClick={() => add(product.id)}>
              Agregar al pedido
            </button>
            <button className="btn btn--ghost" onClick={() => onOpen(product)}>
              Ver detalles
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
