# TripMind Radio — sitio

Sitio estático de [tripmindradio.com](https://tripmindradio.com). Sin build: Netlify publica la raíz tal cual.

## Qué hay que saber

- `index.html` lo lleva todo: estilos, marcado y scripts en un solo archivo.
- `sw.js` tiene una constante `VERSION`. **Súbela en cada cambio** o los visitantes siguen viendo la versión vieja en caché.
- Tres bandas se llenan desde listas en `index.html` y quedan ocultas mientras estén vacías:
  - `TM_PATROCINIOS` — logos de patrocinadores.
  - `TM_PLATAFORMAS` — directorios donde ya está publicada la emisora. Solo altas aprobadas.
  - La parrilla es fija y se calcula con la hora de Bogotá, no con la del visitante.

## Publicar

Netlify despliega solo con cada push a `main`.
