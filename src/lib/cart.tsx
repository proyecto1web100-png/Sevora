import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../data/products";
import { useCatalog } from "./catalog";
import { lempiras } from "./format";

export interface CartLine {
  product: Product;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "sevora-cart";
const CartContext = createContext<CartState | null>(null);

function loadCart(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const products = useCatalog();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Sin almacenamiento disponible: el pedido vive solo en esta visita.
    }
  }, [items]);

  const value = useMemo<CartState>(() => {
    const lines = products
      .filter((p) => (items[p.id] ?? 0) > 0)
      .map((product) => ({ product, qty: items[product.id] }));
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.qty * l.product.price, 0),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add: (id) => setItems((s) => ({ ...s, [id]: (s[id] ?? 0) + 1 })),
      setQty: (id, qty) =>
        setItems((s) => {
          const next = { ...s };
          if (qty <= 0) delete next[id];
          else next[id] = qty;
          return next;
        }),
      clear: () => setItems({}),
    };
  }, [items, isOpen, products]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}

export function orderMessage(lines: CartLine[], total: number, name: string, city: string) {
  const items = lines
    .map((l) => `• ${l.qty} × ${l.product.name} – ${l.product.brand} (${l.product.ml} ml) — ${lempiras(l.qty * l.product.price)}`)
    .join("\n");
  const customer = [name && `Nombre: ${name}`, city && `Ciudad: ${city}`].filter(Boolean).join("\n");
  return [
    "Hola Sévora Perfumerie, quiero hacer este pedido:",
    items,
    `Total: ${lempiras(total)}`,
    customer,
    "¿Me confirman disponibilidad, envío y forma de pago?",
  ]
    .filter(Boolean)
    .join("\n\n");
}
