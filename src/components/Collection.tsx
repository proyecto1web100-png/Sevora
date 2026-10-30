import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { allNotes, MOMENTS, PROFILES, type Moment, type Product, type Profile } from "../data/products";
import { useBrands, useCatalog } from "../lib/catalog";
import { useCart } from "../lib/cart";
import { lempiras } from "../lib/format";
import { easeOut, exit, spring } from "../lib/motion";
import { PlusIcon, SearchIcon, SectionHeader } from "./ui";

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

type Sort = "populares" | "precio-asc" | "precio-desc" | "nombre";

const SORTS: { value: Sort; label: string }[] = [
  { value: "populares", label: "Más vendidos" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nombre", label: "Nombre (A–Z)" },
];

const roundTo50 = (n: number) => Math.round(n / 50) * 50;

// Tres rangos de precio a partir de los precios reales del catálogo.
function priceRanges(prices: number[]) {
  const sorted = [...new Set(prices)].sort((a, b) => a - b);
  if (sorted.length < 3) return [];
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];
  const lo = roundTo50(at(1 / 3));
  const hi = roundTo50(at(2 / 3));
  if (lo >= hi) return [];
  return [
    { id: "bajo", label: `Hasta ${lempiras(lo)}`, test: (p: number) => p <= lo },
    { id: "medio", label: `${lempiras(lo)} – ${lempiras(hi)}`, test: (p: number) => p > lo && p <= hi },
    { id: "alto", label: `Más de ${lempiras(hi)}`, test: (p: number) => p > hi },
  ];
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className={`select ${value !== ALL && value !== "populares" ? "is-set" : ""}`}>
      <span className="visually-hidden">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Collection({ onOpen }: { onOpen: (p: Product) => void }) {
  const products = useCatalog();
  const brands = useBrands();
  const genders = useMemo(() => [ALL, ...new Set(products.map((p) => p.gender))], [products]);
  const profiles = useMemo(() => PROFILES.filter((x) => products.some((p) => p.profiles.includes(x))), [products]);
  const ranges = useMemo(() => priceRanges(products.map((p) => p.price)), [products]);

  const [gender, setGender] = useState(ALL);
  const [brand, setBrand] = useState(ALL);
  const [profile, setProfile] = useState(ALL);
  const [moment, setMoment] = useState(ALL);
  const [range, setRange] = useState(ALL);
  const [sort, setSort] = useState<Sort>("populares");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const priceTest = ranges.find((r) => r.id === range)?.test;
  const visible = products
    .filter(
      (p) =>
        (gender === ALL || p.gender === gender) &&
        (brand === ALL || p.brand === brand) &&
        (profile === ALL || p.profiles.includes(profile as Profile)) &&
        (moment === ALL || p.moments.includes(moment as Moment)) &&
        (!priceTest || priceTest(p.price)) &&
        (!q || [p.name, p.brand, p.family, ...allNotes(p)].some((t) => t.toLowerCase().includes(q))),
    )
    .sort((a, b) => {
      if (sort === "precio-asc") return a.price - b.price;
      if (sort === "precio-desc") return b.price - a.price;
      if (sort === "nombre") return a.name.localeCompare(b.name, "es");
      return Number(b.inStock) - Number(a.inStock) || b.popularity - a.popularity;
    });

  const filtered = gender !== ALL || brand !== ALL || profile !== ALL || moment !== ALL || range !== ALL || q !== "";
  const reset = () => {
    setGender(ALL);
    setBrand(ALL);
    setProfile(ALL);
    setMoment(ALL);
    setRange(ALL);
    setQuery("");
  };

  return (
    <section id="coleccion" className="section container">
      <SectionHeader
        eyebrow="La colección"
        title="Aromas que"
        accent="se recuerdan."
        text="Seleccionamos lo mejor de la perfumería árabe: intensidad, duración y elegancia en cada frasco."
      />

      <div className="filters">
        <LayoutGroup>
          <Segmented id="gender" label="Filtrar por género" options={genders} value={gender} onChange={setGender} />
        </LayoutGroup>
        <label className="search">
          <SearchIcon width={18} height={18} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar perfume, marca o nota"
            aria-label="Buscar perfume, marca o nota"
          />
        </label>
      </div>
      <div className="filters filters--selects">
        <Select
          label="Marca"
          value={brand}
          onChange={setBrand}
          options={[{ value: ALL, label: "Todas las marcas" }, ...brands.map((b) => ({ value: b, label: b }))]}
        />
        <Select
          label="Aroma"
          value={profile}
          onChange={setProfile}
          options={[{ value: ALL, label: "Todos los aromas" }, ...profiles.map((x) => ({ value: x, label: x }))]}
        />
        <Select
          label="Momento"
          value={moment}
          onChange={setMoment}
          options={[
            { value: ALL, label: "Día y noche" },
            ...MOMENTS.map((m) => ({ value: m, label: m === "Día" ? "Para el día" : "Para la noche" })),
          ]}
        />
        {ranges.length > 0 && (
          <Select
            label="Precio"
            value={range}
            onChange={setRange}
            options={[{ value: ALL, label: "Cualquier precio" }, ...ranges.map((r) => ({ value: r.id, label: r.label }))]}
          />
        )}
        <Select label="Ordenar" value={sort} onChange={(v) => setSort(v as Sort)} options={SORTS} />
        <AnimatePresence>
          {filtered && (
            <motion.button
              className="filters__reset"
              onClick={reset}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, transition: exit }}
            >
              Limpiar filtros
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <p className="filters__count muted small" aria-live="polite">
        {visible.length} {visible.length === 1 ? "perfume" : "perfumes"}
      </p>

      <motion.div layout className="grid">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={onOpen} />
          ))}
        </AnimatePresence>
      </motion.div>
      {visible.length === 0 && (
        <div className="empty">
          <p>No hay perfumes con esos filtros por ahora.</p>
          <button className="btn btn--small btn--ghost" onClick={reset}>
            Ver todos
          </button>
        </div>
      )}
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
