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
| Perfumes, precios, notas, stock | Hoja de Google Sheets (recomendado) o `src/data/products.ts` |
| Fotos de productos | `public/products/` (cuadradas, fondo blanco, ~1000 px; sube también una copia `.jpg` para la vista previa en WhatsApp) |
| WhatsApp, horario, redes sociales, políticas, preguntas frecuentes | `src/data/site.ts` |
| Artículos de la guía de perfumería | `src/data/guide.ts` |
| Logo e íconos | `public/brand/` y `public/favicon.png` |

> Los precios, notas, duración y proyección actuales son de ejemplo, y las políticas de `site.ts` son una propuesta. Revísenlos antes de promocionar la web.

### Catálogo en Google Sheets (sin programar)

1. En Google Sheets: **Archivo → Importar → Subir** el archivo `plantilla-catalogo.csv` de este repositorio. También se descarga actualizado desde la web publicada, en `…/Sevora/catalogo.csv`.
2. Editen la hoja: una fila por perfume. Las listas dentro de una celda (notas, momento, ocasiones, perfil) van separadas por `;`.
   - `genero`: Hombre, Mujer o Unisex · `momento`: Día; Noche · `clima`: Calor; Fresco
   - `perfil`: Dulce, Fresco, Amaderado, Especiado, Frutal, Cítrico, Floral
   - `duracion` y `proyeccion`: del 1 al 5 · `disponible`: si / no · `etiqueta`: texto como "Nuevo" (opcional)
   - `imagen`: nombre del archivo en `public/products/` o un enlace completo a la foto
3. **Archivo → Compartir → Publicar en la web** → elegir la hoja → formato **CSV** → Publicar, y copiar el enlace.
4. En GitHub: **Settings → Secrets and variables → Actions → Variables → New repository variable**, con nombre `CATALOG_CSV_URL` y el enlace como valor. Luego, en **Actions → Publicar en GitHub Pages → Run workflow**, lanzar una publicación.

Desde ese momento la web lee la hoja cada vez que alguien la abre: los cambios de precio y stock se ven al instante (Google puede tardar unos minutos en actualizar la hoja publicada). Las páginas propias de cada perfume se regeneran solas cada 3 horas, o al momento con **Run workflow**.

### Páginas de cada perfume

Cada perfume tiene su propio enlace, por ejemplo `…/Sevora/perfume/hawas-ice/`, con título, descripción e imagen para la vista previa en WhatsApp y Google. El botón **Compartir** de la ficha copia ese enlace. El build también genera `sitemap.xml` y `robots.txt`.

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
