import { MotionConfig } from "framer-motion";
import { useCallback, useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { Collection } from "./components/Collection";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { ProductSheet } from "./components/ProductSheet";
import { BrandStrip, Faq, Footer, Why, Wholesale, WhatsAppFab } from "./components/Sections";
import { Spotlight } from "./components/Spotlight";
import { products, type Product } from "./data/products";
import { CartProvider } from "./lib/cart";

export default function App() {
  const [selected, setSelected] = useState<Product | null>(null);
  const closeSheet = useCallback(() => setSelected(null), []);
  const featured = products.find((p) => p.badge === "Más vendido") ?? products[0];

  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <Nav />
        <main>
          <Hero />
          <BrandStrip />
          <Spotlight product={featured} onOpen={setSelected} />
          <Collection onOpen={setSelected} />
          <Why />
          <Wholesale />
          <Faq />
        </main>
        <Footer />
        <WhatsAppFab />
        <ProductSheet product={selected} onClose={closeSheet} />
        <CartDrawer />
      </CartProvider>
    </MotionConfig>
  );
}
