import { MotionConfig } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { Collection } from "./components/Collection";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { ProductSheet } from "./components/ProductSheet";
import { BrandStrip, Faq, Footer, Why, Wholesale, WhatsAppFab } from "./components/Sections";
import { Spotlight } from "./components/Spotlight";
import { Guide, Trust } from "./components/Info";
import { Quiz } from "./components/Quiz";
import type { Product } from "./data/products";
import { CartProvider } from "./lib/cart";
import { CatalogProvider, useCatalog } from "./lib/catalog";

// En la página propia de un perfume (…/perfume/<id>/) abrimos su ficha al cargar.
function productIdFromPath() {
  return location.pathname.match(/\/perfume\/([^/]+)\/?$/)?.[1] ?? null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <CatalogProvider>
        <CartProvider>
          <Store />
        </CartProvider>
      </CatalogProvider>
    </MotionConfig>
  );
}

function Store() {
  const products = useCatalog();
  const [selected, setSelected] = useState<Product | null>(null);
  const closeSheet = useCallback(() => setSelected(null), []);
  const featured = products.find((p) => p.badge === "Más vendido") ?? products[0];

  useEffect(() => {
    const id = productIdFromPath();
    const match = id && products.find((p) => p.id === id);
    if (match) setSelected(match);
  }, [products]);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <BrandStrip />
        {featured && <Spotlight product={featured} onOpen={setSelected} />}
        <Collection onOpen={setSelected} />
        <Quiz onOpen={setSelected} />
        <Why />
        <Guide />
        <Trust />
        <Wholesale />
        <Faq />
      </main>
      <Footer />
      <WhatsAppFab />
      <ProductSheet product={selected} onClose={closeSheet} onSelect={setSelected} />
      <CartDrawer />
    </>
  );
}
