// Catálogo de productos.
// Para agregar un perfume: copia un bloque, cambia los datos y coloca la foto en public/products.
// IMPORTANTE: los precios son de ejemplo. Revísalos antes de publicar la web.

export type Gender = "Hombre" | "Mujer" | "Unisex";

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
  notes: string[];
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
    notes: ["Bergamota", "Notas verdes", "Ámbar", "Almizcle", "Vainilla"],
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
    notes: ["Cítricos", "Manzana", "Notas acuáticas", "Almizcle", "Ámbar gris"],
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
    notes: ["Frutas tropicales", "Cítricos", "Notas acuáticas", "Maderas", "Almizcle"],
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
    notes: ["Especias", "Notas dulces", "Ámbar", "Vainilla", "Maderas"],
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
    notes: ["Naranja", "Bergamota", "Limón", "Ámbar", "Almizcle"],
    inStock: true,
  },
];

export const brands = Array.from(new Set(products.map((p) => p.brand)));
