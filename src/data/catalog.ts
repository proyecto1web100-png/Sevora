// Lee y escribe el catálogo en formato CSV, el que exporta Google Sheets.
// Lo usan la web (para leer la hoja publicada) y el build (para crear una página por perfume).
// Listas dentro de una celda (notas, momentos, ocasiones…) van separadas por ";".

import {
  CLIMATES,
  MOMENTS,
  PROFILES,
  type Climate,
  type Gender,
  type Moment,
  type Product,
  type Profile,
} from "./products";

export const CSV_COLUMNS = [
  "id",
  "nombre",
  "marca",
  "genero",
  "familia",
  "concentracion",
  "ml",
  "precio",
  "imagen",
  "frase",
  "descripcion",
  "notas_salida",
  "notas_corazon",
  "notas_fondo",
  "duracion",
  "proyeccion",
  "momento",
  "clima",
  "ocasiones",
  "perfil",
  "popularidad",
  "disponible",
  "etiqueta",
] as const;

type Row = Record<(typeof CSV_COLUMNS)[number], string>;

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const list = (v: string) =>
  v
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

const pick = <T extends string>(v: string, allowed: readonly T[]) =>
  list(v).filter((x): x is T => (allowed as readonly string[]).includes(x));

const toNumber = (v: string, fallback: number) => {
  const n = Number(v.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && v.trim() !== "" ? n : fallback;
};

const clamp15 = (n: number) => Math.min(5, Math.max(1, Math.round(n)));

const yes = (v: string) => !/^(no|false|0|agotado)$/i.test(v.trim());

function toGender(v: string): Gender {
  const s = v.trim().toLowerCase();
  if (s.startsWith("muj")) return "Mujer";
  if (s.startsWith("hom")) return "Hombre";
  return "Unisex";
}

/** Convierte el CSV de la hoja en productos. Ignora filas sin id, nombre o precio. */
export function productsFromCsv(text: string): Product[] {
  const [header, ...body] = parseCsv(text);
  if (!header) return [];
  const keys = header.map((h) => h.trim().toLowerCase());
  return body
    .map((cells) => Object.fromEntries(CSV_COLUMNS.map((c) => [c, (cells[keys.indexOf(c)] ?? "").trim()])) as Row)
    .filter((r) => r.id && r.nombre && r.precio)
    .map(
      (r): Product => ({
        id: r.id.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
        name: r.nombre,
        brand: r.marca,
        gender: toGender(r.genero),
        family: r.familia,
        concentration: r.concentracion || "Eau de Parfum",
        ml: toNumber(r.ml, 100),
        price: toNumber(r.precio, 0),
        image: r.imagen.includes("/") ? r.imagen : `products/${r.imagen}`,
        tagline: r.frase,
        description: r.descripcion,
        notesTop: list(r.notas_salida),
        notesHeart: list(r.notas_corazon),
        notesBase: list(r.notas_fondo),
        longevity: clamp15(toNumber(r.duracion, 3)),
        sillage: clamp15(toNumber(r.proyeccion, 3)),
        moments: pick<Moment>(r.momento, MOMENTS),
        climates: pick<Climate>(r.clima, CLIMATES),
        occasions: list(r.ocasiones),
        profiles: pick<Profile>(r.perfil, PROFILES),
        popularity: toNumber(r.popularidad, 0),
        inStock: yes(r.disponible),
        badge: r.etiqueta || undefined,
      }),
    );
}

const esc = (v: string | number) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** Exporta productos al formato de la hoja (sirve como plantilla para Google Sheets). */
export function productsToCsv(items: Product[]): string {
  const rows = items.map((p) => {
    const row: Row = {
      id: p.id,
      nombre: p.name,
      marca: p.brand,
      genero: p.gender,
      familia: p.family,
      concentracion: p.concentration,
      ml: String(p.ml),
      precio: String(p.price),
      imagen: p.image.replace(/^products\//, ""),
      frase: p.tagline,
      descripcion: p.description,
      notas_salida: p.notesTop.join("; "),
      notas_corazon: p.notesHeart.join("; "),
      notas_fondo: p.notesBase.join("; "),
      duracion: String(p.longevity),
      proyeccion: String(p.sillage),
      momento: p.moments.join("; "),
      clima: p.climates.join("; "),
      ocasiones: p.occasions.join("; "),
      perfil: p.profiles.join("; "),
      popularidad: String(p.popularity),
      disponible: p.inStock ? "si" : "no",
      etiqueta: p.badge ?? "",
    };
    return CSV_COLUMNS.map((c) => esc(row[c])).join(",");
  });
  return [CSV_COLUMNS.join(","), ...rows].join("\n") + "\n";
}
