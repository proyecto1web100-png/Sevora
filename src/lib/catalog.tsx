import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { productsFromCsv } from "../data/catalog";
import { products as bundled, type Product } from "../data/products";
import { site } from "../data/site";

// Catálogo vivo: arranca con la lista incluida en la web y, si hay una hoja de Google Sheets
// configurada, la reemplaza con lo que diga la hoja (precios, stock, perfumes nuevos).

// La hoja se puede configurar en site.ts o, sin tocar el código, con la variable
// CATALOG_CSV_URL del repositorio (el workflow la pasa como VITE_CATALOG_CSV_URL).
const CSV_URL: string = import.meta.env.VITE_CATALOG_CSV_URL || site.catalogCsvUrl;

const CatalogContext = createContext<Product[]>(bundled);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(bundled);

  useEffect(() => {
    const url = CSV_URL;
    if (!url) return;
    let cancelled = false;
    fetch(url, { cache: "no-store" })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((text) => {
        const parsed = productsFromCsv(text);
        if (!cancelled && parsed.length) setItems(parsed);
      })
      .catch(() => {
        // Si la hoja no responde, se queda la lista incluida en la web.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <CatalogContext.Provider value={items}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}

export function useBrands() {
  return Array.from(new Set(useCatalog().map((p) => p.brand)));
}
