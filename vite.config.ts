import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { productsFromCsv, productsToCsv } from "./src/data/catalog";
import { products as bundled, type Product } from "./src/data/products";
import { site } from "./src/data/site";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// El catálogo para las páginas de cada perfume: la hoja de Google Sheets si está configurada
// (variable VITE_CATALOG_CSV_URL / CATALOG_CSV_URL o site.catalogCsvUrl); si no, la lista de src/data/products.ts.
async function loadCatalog(): Promise<Product[]> {
  const url = process.env.VITE_CATALOG_CSV_URL || process.env.CATALOG_CSV_URL || site.catalogCsvUrl;
  if (!url) return bundled;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed = productsFromCsv(await res.text());
    if (parsed.length) return parsed;
    throw new Error("la hoja no tiene perfumes válidos");
  } catch (err) {
    console.warn(`[sevora] No se pudo leer la hoja del catálogo (${String(err)}); uso src/data/products.ts`);
    return bundled;
  }
}

// WhatsApp muestra mejor JPG/PNG: usa la versión .jpg de la foto si existe; si no, el logo.
async function shareImageFor(outDir: string, p: Product) {
  if (/^https?:/.test(p.image)) return p.image;
  const jpg = p.image.replace(/\.webp$/i, ".jpg");
  try {
    await access(join(outDir, jpg));
    return new URL(jpg, site.url).href;
  } catch {
    return new URL("brand/og-image.jpg", site.url).href;
  }
}

function setMeta(html: string, attr: "name" | "property", key: string, value: string) {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*" />`);
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function productPage(template: string, p: Product, shareImage: string) {
  const url = `${site.url}perfume/${p.id}/`;
  const title = `${p.name} de ${p.brand} · ${site.name}`;
  const description = `${p.tagline} ${p.description}`.trim();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    brand: { "@type": "Brand", name: p.brand },
    description: p.description,
    image: new URL(p.image, site.url).href,
    url,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "HNL",
      availability: `https://schema.org/${p.inStock ? "InStock" : "OutOfStock"}`,
    },
  };
  let html = template.replace("<head>", `<head>\n    <base href="../../" />`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = setMeta(html, "name", "description", description);
  html = setMeta(html, "property", "og:type", "product");
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:description", description);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "property", "og:image", shareImage);
  html = html.replace(
    "</head>",
    `    <link rel="canonical" href="${url}" />\n    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>\n  </head>`,
  );
  return html;
}

// Después del build crea una página por perfume (con su propio título y vista previa para
// WhatsApp y Google), el sitemap y el robots.txt.
function perfumePages(): Plugin {
  let outDir = "dist";
  return {
    name: "sevora-perfume-pages",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    async closeBundle() {
      const template = await readFile(join(outDir, "index.html"), "utf8");
      const catalog = await loadCatalog();
      for (const p of catalog) {
        const dir = join(outDir, "perfume", p.id);
        await mkdir(dir, { recursive: true });
        await writeFile(join(dir, "index.html"), productPage(template, p, await shareImageFor(outDir, p)));
      }
      const urls = [site.url, ...catalog.map((p) => `${site.url}perfume/${p.id}/`)];
      await writeFile(
        join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((u) => `  <url><loc>${u}</loc></url>`)
          .join("\n")}\n</urlset>\n`,
      );
      // Plantilla descargable con el catálogo actual, para importarla en Google Sheets.
      await writeFile(join(outDir, "catalogo.csv"), productsToCsv(catalog));
      await writeFile(join(outDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}sitemap.xml\n`);
      console.log(`[sevora] ${catalog.length} páginas de perfume, sitemap.xml y robots.txt listos`);
    },
  };
}

export default defineConfig({
  // Rutas relativas: la web funciona en GitHub Pages (/Sevora/), Vercel o Netlify.
  base: "./",
  plugins: [react(), perfumePages()],
});
