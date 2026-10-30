import { allNotes, type Climate, type Moment, type Product, type Profile } from "../data/products";

// Perfumes parecidos: comparten perfil, familia, notas, momento y público.
export function similarProducts(product: Product, catalog: Product[], limit = 3) {
  const notes = new Set(allNotes(product));
  return catalog
    .filter((p) => p.id !== product.id)
    .map((p) => {
      let score = 0;
      score += p.profiles.filter((x) => product.profiles.includes(x)).length * 3;
      if (p.family === product.family) score += 3;
      score += allNotes(p).filter((n) => notes.has(n)).length;
      score += p.moments.filter((m) => product.moments.includes(m)).length;
      if (p.gender === product.gender || p.gender === "Unisex" || product.gender === "Unisex") score += 1;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.popularity - a.p.popularity)
    .slice(0, limit)
    .map((x) => x.p);
}

export interface QuizAnswers {
  who: "Hombre" | "Mujer" | "Regalo" | "Cualquiera";
  profile: Profile[];
  moment: Moment | "Ambos";
  climate: Climate | "Ambos";
  intensity: "Suave" | "Media" | "Intensa";
}

// Recomendación del cuestionario: puntúa cada perfume según las respuestas.
export function recommend(answers: QuizAnswers, catalog: Product[], limit = 3) {
  const target = { Suave: 2, Media: 3.5, Intensa: 5 }[answers.intensity];
  return catalog
    .filter((p) => p.inStock)
    .filter((p) => {
      if (answers.who === "Hombre") return p.gender !== "Mujer";
      if (answers.who === "Mujer") return p.gender !== "Hombre";
      return true;
    })
    .map((p) => {
      let score = 0;
      score += p.profiles.filter((x) => answers.profile.includes(x)).length * 4;
      if (answers.moment === "Ambos" || p.moments.includes(answers.moment)) score += 2;
      if (answers.climate === "Ambos" || p.climates.includes(answers.climate)) score += 2;
      score -= Math.abs((p.longevity + p.sillage) / 2 - target);
      score += p.popularity / 100;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}
