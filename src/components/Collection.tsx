import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { brands, products, type Product } from "../data/products";
import { useCart } from "../lib/cart";
import { lempiras } from "../lib/format";
import { easeOut, exit, spring } from "../lib/motion";
import { PlusIcon, SectionHeader } from "./ui";

const ALL = "Todas";

function Segmented({
  options,
  value,
  onChange,
  id,
  label,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  id: string;
  label: string;
}) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o}
          role="radio"
          aria-checked={value === o}
          className={value === o ? "is-active" : ""}
          onClick={() => onChange(o)}
        >
          {value === o && <motion.span layoutId={`seg-${id}`} className="segmented__pill" transition={spring} />}
          <span className="segmented__label">{o}</span>
        </button>
      ))}
    </div>
  );
}

export function Collection({ onOpen }: { onOpen: (p: Product) => void }) {
  const genders = useMemo(() => [ALL, ...new Set(products.map((p) => p.gender))], []);
  const [gender, setGender] = useState(ALL);
  const [brand, setBrand] = useState(ALL);

  const visible = products.filter(
    (p) => (gender === ALL || p.gender === gender) && (brand === ALL || p.brand === brand),
  );

  return (
    <section id="coleccion" className="section container">
      <SectionHeader
        eyebrow="La colección"
        title="Aromas que"
        accent="se recuerdan."
        text="Seleccionamos lo mejor de la perfumería árabe: intensidad, duración y elegancia en cada frasco."
      />

      <LayoutGroup>
        <div className="filters">
          <Segmented id="gender" label="Filtrar por género" options={genders} value={gender} onChange={setGender} />
          <Segmented id="brand" label="Filtrar por marca" options={[ALL, ...brands]} value={brand} onChange={setBrand} />
        </div>
      </LayoutGroup>

      <motion.div layout className="grid">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={onOpen} />
          ))}
        </AnimatePresence>
      </motion.div>
      {visible.length === 0 && <p className="empty">No hay perfumes con esos filtros por ahora.</p>}
    </section>
  );
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.article
      layout
      className="card"
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: easeOut } }}
      exit={{ opacity: 0, scale: 0.97, transition: exit }}
    >
      <button className="card__media tile" onClick={() => onOpen(product)} aria-label={`Ver ${product.name}`}>
        {product.badge && <span className="badge">{product.badge}</span>}
        <img src={product.image} alt={`${product.name} de ${product.brand}`} loading="lazy" />
      </button>
      <div className="card__body">
        <p className="card__brand">{product.brand}</p>
        <h3 className="card__name">{product.name}</h3>
        <p className="card__meta">
          {product.family} · {product.ml} ml
        </p>
        <div className="card__foot">
          <span className="price">{lempiras(product.price)}</span>
          <button className="btn btn--small btn--gold" onClick={handleAdd} disabled={!product.inStock}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? "ok" : "add"}
                className="row row--tight"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: easeOut } }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
              >
                {!product.inStock ? (
                  "Agotado"
                ) : added ? (
                  "Agregado ✓"
                ) : (
                  <>
                    <PlusIcon width={16} height={16} /> Agregar
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
