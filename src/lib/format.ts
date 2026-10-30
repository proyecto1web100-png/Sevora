import { site } from "../data/site";

export function lempiras(amount: number) {
  return `L ${amount.toLocaleString("es-HN")}`;
}

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Enlace público a la página de un perfume. */
export function productUrl(id: string) {
  return `${site.url}perfume/${id}/`;
}
