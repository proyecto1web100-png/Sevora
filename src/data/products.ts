// Catálogo de productos incluido en la web.
// Si configuras una hoja de Google Sheets en src/data/site.ts (catalogCsvUrl), la web usa esa hoja
// en lugar de esta lista. Para agregar un perfume aquí: copia un bloque, cambia los datos y coloca
// la foto en public/products.
// IMPORTANTE: precios, notas, duración y proyección son de ejemplo. Revísalos antes de promocionar la web.

export type Gender = "Hombre" | "Mujer" | "Unisex";
export type Moment = "Día" | "Noche";
export type Climate = "Calor" | "Fresco";
export type Profile = "Dulce" | "Fresco" | "Amaderado" | "Especiado" | "Frutal" | "Cítrico" | "Floral";

export const MOMENTS: Moment[] = ["Día", "Noche"];
export const CLIMATES: Climate[] = ["Calor", "Fresco"];
export const PROFILES: Profile[] = ["Dulce", "Fresco", "Amaderado", "Especiado", "Frutal", "Cítrico", "Floral"];

export interface Product {
  id: string;
  name: string;
  brand: string;
  gender: Gender;
  family: string;
  concentration: string;
  ml: number;
  /** Precio en lempiras. */
  price: number;
  image: string;
  tagline: string;
  description: string;
  /** Pirámide olfativa. */
  notesTop: string[];
  notesHeart: string[];
  notesBase: string[];
  /** De 1 a 5. */
  longevity: number;
  /** De 1 a 5: qué tanto se nota a tu alrededor. */
  sillage: number;
  moments: Moment[];
  climates: Climate[];
  occasions: string[];
  profiles: Profile[];
  /** Más alto = aparece primero al ordenar por "Más vendidos". */
  popularity: number;
  inStock: boolean;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "amber-oud-gold",
    name: "Amber Oud Gold Edition",
    brand: "Al Haramain",
    gender: "Unisex",
    family: "Ámbar dulce",
    concentration: "Eau de Parfum",
    ml: 120,
    price: 2450,
    image: "products/amber-oud-gold.webp",
    tagline: "Dorado, dulce y magnético.",
    description:
      "Un clásico moderno de la perfumería árabe. Abre fresco y frutal, y se asienta en un fondo ambarado y cálido que dura todo el día.",
    notesTop: ["Bergamota", "Notas verdes"],
    notesHeart: ["Notas frutales", "Ámbar"],
    notesBase: ["Almizcle", "Vainilla", "Maderas"],
    longevity: 5,
    sillage: 4,
    moments: ["Día", "Noche"],
    climates: ["Fresco"],
    occasions: ["Citas", "Eventos", "Diario"],
    profiles: ["Dulce", "Frutal"],
    popularity: 100,
    inStock: true,
    badge: "Más vendido",
  },
  {
    id: "hawas-ice",
    name: "Hawas Ice",
    brand: "Rasasi",
    gender: "Hombre",
    family: "Fresca acuática",
    concentration: "Eau de Parfum",
    ml: 100,
    price: 2150,
    image: "products/hawas-ice.webp",
    tagline: "Frescura helada para el calor.",
    description:
      "La versión más fresca de Hawas. Cítrica, limpia y helada: ideal para el clima de Honduras y para usar a diario.",
    notesTop: ["Limón", "Bergamota", "Manzana"],
    notesHeart: ["Notas acuáticas", "Notas heladas"],
    notesBase: ["Almizcle", "Ámbar gris", "Maderas"],
    longevity: 4,
    sillage: 4,
    moments: ["Día"],
    climates: ["Calor"],
    occasions: ["Diario", "Oficina"],
    profiles: ["Fresco", "Cítrico"],
    popularity: 90,
    inStock: true,
    badge: "Nuevo",
  },
  {
    id: "hawas-tropical",
    name: "Hawas Tropical",
    brand: "Rasasi",
    gender: "Hombre",
    family: "Frutal tropical",
    concentration: "Eau de Parfum",
    ml: 100,
    price: 2150,
    image: "products/hawas-tropical.webp",
    tagline: "Verano en un frasco.",
    description:
      "Jugoso y vibrante, con frutas tropicales sobre un fondo fresco y amaderado. Perfecto para el día y los fines de semana.",
    notesTop: ["Frutas tropicales", "Cítricos"],
    notesHeart: ["Notas acuáticas", "Notas florales"],
    notesBase: ["Maderas", "Almizcle"],
    longevity: 4,
    sillage: 3,
    moments: ["Día"],
    climates: ["Calor"],
    occasions: ["Diario", "Fin de semana"],
    profiles: ["Frutal", "Fresco"],
    popularity: 70,
    inStock: true,
  },
  {
    id: "9pm-night-out",
    name: "9 PM Night Out",
    brand: "Afnan",
    gender: "Hombre",
    family: "Oriental especiada",
    concentration: "Extrait de Parfum",
    ml: 100,
    price: 2300,
    image: "products/9pm-night-out.webp",
    tagline: "Hecho para la noche.",
    description:
      "Intenso, dulce y especiado. Una concentración extrait con gran duración y estela, pensada para salidas y ocasiones especiales.",
    notesTop: ["Especias", "Notas frutales"],
    notesHeart: ["Notas dulces", "Notas florales"],
    notesBase: ["Ámbar", "Vainilla", "Maderas"],
    longevity: 5,
    sillage: 5,
    moments: ["Noche"],
    climates: ["Fresco"],
    occasions: ["Fiesta", "Citas", "Eventos"],
    profiles: ["Dulce", "Especiado"],
    popularity: 85,
    inStock: true,
  },
  {
    id: "bharara-king",
    name: "King",
    brand: "Bharara",
    gender: "Hombre",
    family: "Cítrica amaderada",
    concentration: "Eau de Parfum",
    ml: 100,
    price: 2250,
    image: "products/bharara-king.webp",
    tagline: "Presencia de rey.",
    description:
      "Elegante y seguro. Una salida cítrica brillante que evoluciona hacia un fondo amaderado y ambarado, con excelente proyección.",
    notesTop: ["Naranja", "Bergamota", "Limón"],
    notesHeart: ["Notas florales", "Notas frutales"],
    notesBase: ["Ámbar", "Almizcle", "Maderas"],
    longevity: 4,
    sillage: 4,
    moments: ["Día", "Noche"],
    climates: ["Calor", "Fresco"],
    occasions: ["Oficina", "Citas", "Eventos"],
    profiles: ["Cítrico", "Amaderado"],
    popularity: 80,
    inStock: true,
  },
];

export function allNotes(p: Product) {
  return [...p.notesTop, ...p.notesHeart, ...p.notesBase];
}
