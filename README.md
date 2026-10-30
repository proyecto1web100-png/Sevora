# Sévora Perfumerie

Web de marca de **Sévora Perfumerie**, perfumería árabe en Honduras. Los pedidos se envían por WhatsApp.

Hecha con Vite, React, TypeScript y Framer Motion.

## Cómo correrla

```bash
npm install
npm run dev      # servidor local en http://localhost:5173
npm run build    # genera la versión final en /dist
```

## Cómo editar el contenido

| Qué cambiar | Dónde |
|---|---|
| Perfumes, precios, notas, stock | `src/data/products.ts` |
| Fotos de productos | `public/products/` (cuadradas, fondo blanco, ~1000 px) |
| Número de WhatsApp, puntos de confianza, preguntas frecuentes | `src/data/site.ts` |
| Logo e íconos | `public/brand/` y `public/favicon.png` |

Para agregar un perfume, copia un bloque en `products.ts`, cambia los datos y pon la foto en `public/products/`.
Para marcar uno como agotado, usa `inStock: false`.

> Los precios actuales son de ejemplo. Revísalos antes de publicar.

## Cómo funciona un pedido

1. El cliente agrega perfumes al pedido (se guarda en su navegador).
2. Toca **Enviar pedido por WhatsApp** y se abre un chat al +504 9794-6129 con el detalle y el total.
3. Ustedes confirman disponibilidad y envío, y mandan el enlace de pago (PixelPay, BAC, etc.) o los datos para la transferencia.

## Publicarla

Es un sitio estático. Se puede hospedar gratis en **Vercel** o **Netlify** conectando este repositorio:

- Comando de build: `npm run build`
- Carpeta de salida: `dist`

Luego se conecta el dominio (por ejemplo `sevora.hn` o `sevoraperfumerie.com`).

### GitHub Pages

La web está publicada en **https://proyecto1web100-png.github.io/Sevora/**.

Cada push a `main` la actualiza sola: el workflow `.github/workflows/deploy.yml` construye el sitio y lo sube
a la rama `gh-pages`, que es la que GitHub Pages publica. También se puede lanzar a mano desde
**Actions → Publicar en GitHub Pages → Run workflow**. No hay que editar la rama `gh-pages` a mano.
