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
| Fotos de productos | `public/products/` (cuadradas, fondo blanco, ~1000 px; sube también una copia `.jpg` de 1200×630 con el perfume centrado, para la vista previa en WhatsApp) |
| WhatsApp, horario, redes sociales, políticas, preguntas frecuentes | `src/data/site.ts` |
| Artículos de la guía de perfumería | `src/data/guide.ts` |
| Logo e íconos | `public/brand/` y `public/favicon.png` |

> Los precios, notas, duración y proyección actuales son de ejemplo. Revísenlos antes de promocionar la web.

### Catálogo en Google Sheets (sin programar)

1. En Google Sheets: **Archivo → Importar → Subir** el archivo `plantilla-catalogo.csv` de este repositorio. También se descarga actualizado desde la web publicada, en `https://sevorahn.com/catalogo.csv`.
2. Editen la hoja: una fila por perfume. Las listas dentro de una celda (notas, momento, ocasiones, perfil) van separadas por `;`.
   - `genero`: Hombre, Mujer o Unisex · `momento`: Día; Noche · `clima`: Calor; Fresco
   - `perfil`: Dulce, Fresco, Amaderado, Especiado, Frutal, Cítrico, Floral
   - `duracion` y `proyeccion`: del 1 al 5 · `disponible`: si / no · `etiqueta`: texto como "Nuevo" (opcional)
   - `imagen`: nombre del archivo en `public/products/` o un enlace completo a la foto
3. **Archivo → Compartir → Publicar en la web** → elegir la hoja → formato **CSV** → Publicar, y copiar el enlace.
4. En GitHub: **Settings → Secrets and variables → Actions → Variables → New repository variable**, con nombre `CATALOG_CSV_URL` y el enlace como valor. Luego, en **Actions → Publicar en GitHub Pages → Run workflow**, lanzar una publicación.

Desde ese momento la web lee la hoja cada vez que alguien la abre: los cambios de precio y stock se ven al instante (Google puede tardar unos minutos en actualizar la hoja publicada). Las páginas propias de cada perfume se regeneran solas cada 3 horas, o al momento con **Run workflow**.

### Páginas de cada perfume

Cada perfume tiene su propio enlace, por ejemplo `https://sevorahn.com/perfume/hawas-ice/`, con título, descripción e imagen para la vista previa en WhatsApp y Google. El botón **Compartir** de la ficha copia ese enlace. El build también genera `sitemap.xml` y `robots.txt`.

## Cómo funciona un pedido

1. El cliente agrega perfumes al pedido (se guarda en su navegador).
2. Elige la forma de pago, toca **Enviar pedido por WhatsApp** y se abre un chat al +504 9794-6129 con el detalle y el total.
3. El cliente elige la forma de pago (va en el mensaje):
   - **Tarjeta Visa:** generen en la App Ficohsa (TapiYa → Link) un enlace por el total con envío y envíenlo. Vence pronto, así que genérenlo cuando el cliente ya confirmó.
   - **Transferencia:** envíen los datos de la cuenta y esperen el comprobante.
4. Despachen el pedido cuando el pago esté confirmado. No hay pago contra entrega.

Las formas de pago y sus textos se editan en `payments` dentro de `src/data/site.ts`.

## Publicarla

La web oficial es **https://sevorahn.com**, hospedada en **Netlify** (proyecto `sevorahn`). La configuración está en `netlify.toml`: comando `npm run build` y carpeta `dist`.

### Netlify conectado a GitHub (despliegue automático)

1. En Netlify: **Projects → sevorahn → Project configuration → Build & deploy → Continuous deployment → Link repository**.
2. Elegir **GitHub** → `proyecto1web100-png/Sevora` → rama `main`. Netlify toma el comando y la carpeta de `netlify.toml`.
3. Desde ahí, cada cambio en `main` se publica solo.
4. Si usan la hoja de Google Sheets: **Project configuration → Environment variables** → agregar `VITE_CATALOG_CSV_URL` con el enlace CSV.

### Dominio sevorahn.com

1. En Netlify: **Domain management → Add a domain** → `sevorahn.com` → marcarlo como dominio principal. Agregar también `www.sevorahn.com`.
2. En el proveedor donde compraron el dominio, una de estas dos opciones:
   - **Opción A, recomendada:** cambiar los *nameservers* por los 4 que muestra Netlify (Netlify DNS). Netlify configura todo solo.
   - **Opción B:** dejar los nameservers y crear estos registros DNS:
     - `A` · nombre `@` · valor `75.2.60.5`
     - `CNAME` · nombre `www` · valor `sevorahn.netlify.app`
3. Esperar la propagación, normalmente de minutos a pocas horas. Netlify activa el HTTPS (Let's Encrypt) solo.

La dirección del sitio se configura en `url` dentro de `src/data/site.ts`. La usan los enlaces de cada perfume, la vista previa en WhatsApp y el sitemap.

### GitHub Pages (copia)

El workflow `.github/workflows/deploy.yml` sigue publicando una copia en `https://proyecto1web100-png.github.io/Sevora/` en cada push a `main`. Cuando sevorahn.com esté funcionando se puede desactivar.
