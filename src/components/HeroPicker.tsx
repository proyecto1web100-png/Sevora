import { motion } from "framer-motion";
import { spring } from "../lib/motion";
import { heroVariants } from "./hero-art/variants";

// Selector para comparar animaciones de portada. Solo aparece en la vista previa
// (build con VITE_HERO_PICKER=1), nunca en la web publicada.
export function HeroPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="picker" role="radiogroup" aria-label="Animación de portada">
      <span className="picker__label">Animación</span>
      {heroVariants.map((v) => (
        <button
          key={v.id}
          role="radio"
          aria-checked={value === v.id}
          className={value === v.id ? "is-active" : ""}
          onClick={() => {
            onChange(v.id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          {value === v.id && <motion.span layoutId="picker-pill" className="picker__pill" transition={spring} />}
          <span className="picker__text">
            <b>{v.id}</b> {v.label}
          </span>
        </button>
      ))}
    </div>
  );
}
