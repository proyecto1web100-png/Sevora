import { MotionConfig } from "framer-motion";
import { useCallback, useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { Collection } from "./components/Collection";
import { Hero } from "./components/Hero";
import { DEFAULT_VARIANT, heroVariants } from "./components/hero-art/variants";
import { HeroPicker } from "./components/HeroPicker";
import { Nav } from "./components/Nav";
import { ProductSheet } from "./components/ProductSheet";
import { BrandStrip, Faq, Footer, Why, Wholesale, WhatsAppFab } from "./components/Sections";
import { Spotlight } from "./components/Spotlight";
import { products, type Product } from "./data/products";
import { CartProvider } from "./lib/cart";

const SHOW_PICKER = import.meta.env.VITE_HERO_PICKER === "1";
const PICKER_KEY = "sevora-hero-variant";

export default function App() {
  const [selected, setSelected] = useState<Product | null>(null);
  const closeSheet = useCallback(() => setSelected(null), []);
  const [variantId, setVariantId] = useState(() => {
    if (!SHOW_PICKER) return DEFAULT_VARIANT;
    try {
      return localStorage.getItem(PICKER_KEY) ?? DEFAULT_VARIANT;
    } catch {
      return DEFAULT_VARIANT;
    }
  });
  const variant = heroVariants.find((v) => v.id === variantId) ?? heroVariants[0];
  const chooseVariant = (id: string) => {
    setVariantId(id);
    try {
      localStorage.setItem(PICKER_KEY, id);
    } catch {
      // sin almacenamiento: la elección dura solo esta visita
    }
  };
  const featured = products.find((p) => p.badge === "Más vendido") ?? products[0];

  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <Nav />
        <main>
          <Hero key={variant.id} variant={variant} />
          <BrandStrip />
          <Spotlight product={featured} onOpen={setSelected} />
          <Collection onOpen={setSelected} />
          <Why />
          <Wholesale />
          <Faq />
        </main>
        <Footer />
        <WhatsAppFab />
        {SHOW_PICKER && <HeroPicker value={variant.id} onChange={chooseVariant} />}
        <ProductSheet product={selected} onClose={closeSheet} />
        <CartDrawer />
      </CartProvider>
    </MotionConfig>
  );
}
