# Plan de Refactorización — Senator Hotels Landing

## Diagnóstico del Estado Actual

| Elemento | Estado actual | Problema |
|----------|--------------|----------|
| `index.html` | 3 MB, 3.116 líneas | Todo en un único archivo, imposible de mantener |
| CSS | ~707 líneas minificadas inline en `<style>` | Ilegible, sin estructura, sin separación |
| JavaScript | ~560 líneas embebidas en `<script>` | Sin módulos, código suelto, datos hardcoded mezclados |
| Imágenes | 122 archivos, 215 MB total | Sin optimizar, algunas >30 MB, sin lazy loading |
| Librerías | Chart.js, D3.js, TopoJSON vía CDN | Sin versiones fijadas, sin fallback |

---

## Estructura Objetivo

```
senator-hotels-landing/
├── index.html                  ← limpio, solo HTML semántico
├── css/
│   ├── base.css                ← reset, variables CSS, tipografía, utilidades globales
│   ├── nav.css                 ← navegación fija y flechas de sección
│   ├── sections.css            ← estilos de cada sección (.s-quien, .s-res, .s-rend…)
│   ├── components.css          ← tarjetas, popups, mapas, phone mock, tablas
│   └── animations.css          ← keyframes y clases .rv de reveal/scroll
├── js/
│   ├── data.js                 ← datos de gráficas y textos hardcoded
│   ├── nav.js                  ← scroll nav + cambio de color de logo
│   ├── animations.js           ← IntersectionObserver, reveal, count-up
│   ├── charts.js               ← Chart.js: fidelización, revalorización, digital
│   ├── maps.js                 ← D3.js + TopoJSON: mapa España y Caribe
│   └── sections.js             ← sec-arrows, navegación entre secciones
└── imagenes/                   ← sin cambios en fase 1-4, optimizar en fase 5
```

---

## Fases de Actuación

### FASE 1 — Separación de archivos

**Objetivo:** Mover CSS y JS a sus propios archivos sin tocar ninguna lógica.

**Tareas:**

- [x] Crear carpeta `css/`
- [x] Extraer el bloque `<style>` completo a `css/` dividido en los 5 archivos descritos
- [x] Crear carpeta `js/`
- [x] Extraer el bloque `<script>` completo a `js/` dividido en los 6 archivos descritos
- [x] Sustituir `<style>...</style>` por `<link rel="stylesheet">` para cada archivo CSS
- [x] Sustituir `<script>...</script>` por `<script src="...">` para cada archivo JS
- [x] Verificar que la página carga y funciona exactamente igual

**Archivos afectados:** `index.html`

**Criterio de éxito:** La página funciona idéntico visualmente y en interactividad.

---

### FASE 2 — Refactorizar CSS

**Objetivo:** Hacer el CSS legible, sin duplicados y bien organizado.

**Tareas:**

- [x] Expandir el CSS minificado a formato legible (un valor por línea)
- [x] Ordenar propiedades por bloque lógico en cada regla:
  1. Posicionamiento (`position`, `top`, `z-index`)
  2. Display y layout (`display`, `grid`, `flex`)
  3. Dimensiones (`width`, `height`, `padding`, `margin`)
  4. Visual (`background`, `border`, `box-shadow`)
  5. Tipografía (`font`, `color`, `text-align`)
  6. Transiciones y animaciones
- [x] Renombrar variables de color con nombres semánticos:
  - `--N` → `--color-dark`
  - `--W` → `--color-white`
  - `--N5`, `--N10`… → `--color-dark-5`, `--color-dark-10`…
- [x] Eliminar propiedades duplicadas o sobreescritas sin efecto
- [x] Consolidar media queries dentro del contexto de cada componente
- [x] Añadir comentarios de sección: `/* === HERO === */`, `/* === NAV === */`…
- [x] Revisar y unificar valores magic numbers (espaciados, tamaños)

**Archivos afectados:** todos los archivos en `css/`

**Criterio de éxito:** El CSS es legible por cualquier desarrollador sin necesidad de desminificar.

---

### FASE 3 — Refactorizar JavaScript

**Objetivo:** JS modular, sin código suelto y con datos separados de la lógica.

**Tareas:**

- [ ] Crear `js/data.js` con todos los datos hardcoded extraídos:
  - Datos de gráficas de fidelización (8 años, valores, deltas)
  - Datos del gráfico donut (segmentación clientes)
  - Datos de revalorización
  - Etiquetas y colores de Chart.js
  - Definición de las 24 secciones para `sec-arrows`
- [ ] Envolver todo el código en funciones nombradas (eliminar código suelto al nivel raíz)
- [ ] Unificar los IntersectionObservers en una función `createObserver(selector, callback, options)`
- [ ] En `animations.js`: función `initReveal()`, función `initCountUp()`
- [ ] En `charts.js`: funciones `initFidelizacionChart()`, `initDonutChart()`, `initRevalorizacionChart()`
- [ ] En `maps.js`: funciones `initSpainMap()`, `initCaribeMap()`
- [ ] En `nav.js`: función `initNav()`
- [ ] En `sections.js`: función `initSectionArrows(sections)`
- [ ] Llamar todas las funciones `init*` desde un `main.js` o al final de cada archivo con `DOMContentLoaded`
- [ ] Eliminar `var`, usar `const` y `let`
- [ ] Añadir comentarios explicativos solo donde la lógica no es obvia

**Archivos afectados:** todos los archivos en `js/`

**Criterio de éxito:** Cada archivo JS hace una sola cosa. Los datos están separados de la lógica.

---

### FASE 4 — Mejorar HTML semántico

**Objetivo:** HTML accesible, semántico y limpio.

**Tareas:**

- [ ] Revisar jerarquía de headings y corregir saltos (`h1` → `h2` → `h3`, sin saltarse niveles)
- [ ] Añadir `alt` descriptivos en todas las imágenes que les falte
- [ ] Sustituir `<div>` contenedores de sección por `<section id="...">`
- [ ] Usar `<article>` para tarjetas de contenido independiente
- [ ] Usar `<figure>` + `<figcaption>` en imágenes con descripción
- [ ] Revisar y completar `aria-label` en botones, links y elementos interactivos
- [ ] Eliminar atributos `style=""` inline que ya estén cubiertos por CSS
- [ ] Añadir `lang="es"` al `<html>` si no está
- [ ] Añadir meta descripción y og-tags básicos

**Archivos afectados:** `index.html`

**Criterio de éxito:** Validación HTML5 sin errores críticos. Accesibilidad básica correcta.

---

### FASE 5 — Optimización de imágenes y assets

**Objetivo:** Reducir el peso total de 215 MB a menos de 20 MB sin pérdida visual apreciable.

**Tareas:**

- [ ] Convertir todas las imágenes JPG/PNG a formato **WebP** (reducción ~60-70%)
- [ ] Redimensionar imágenes al tamaño máximo en que se muestran (ninguna imagen debería servirse más grande de lo necesario)
- [ ] Añadir `loading="lazy"` a todas las imágenes fuera del primer viewport
- [ ] Añadir `fetchpriority="high"` a las imágenes del hero (primeras en cargar)
- [ ] Añadir `width` y `height` explícitos en todos los `<img>` (evitar layout shift)
- [ ] Para los vídeos MP4: usar `<video preload="none" playsinline>` con poster frame
- [ ] Usar `<picture>` con WebP + JPG como fallback para compatibilidad
- [ ] Revisar si las imágenes de logos de restaurantes pueden ser SVG

**Archivos afectados:** `index.html`, carpeta `imagenes/`

**Criterio de éxito:** Lighthouse Performance Score > 70. First Contentful Paint < 3s.

---

## Orden de Ejecución

```
FASE 1 → FASE 2 → FASE 3 → FASE 4 → FASE 5
```

Cada fase es independiente y reversible. Se puede verificar el resultado antes de continuar con la siguiente.

---

## Secciones del Proyecto (referencia)

| ID | Sección | Componentes especiales |
|----|---------|----------------------|
| `#inicio` | Hero | KPI grid, líneas animadas, hero grid |
| `#quienes` | Quiénes somos | Split editorial, quote |
| `#resumen` | KPIs resumen | Count-up animation |
| `#rendimiento` | Rendimiento operativo | 6 tarjetas |
| `#activos` | Activos | Tabla, estructura |
| `#graficos-financieros` | Gráficos financieros | Chart.js |
| `#posicion-financiera` | Posición financiera | Tabla datos |
| `#marcas` | Marcas | Grid 3x3 |
| `#portfolio` | Portfolio | Counter strip, mapas SVG |
| `#map-container` | Mapa España | D3.js + TopoJSON, 9 popups |
| `#caribe-section` | Mapa Caribe | SVG + popup Puerto Plata |
| `#origenes` | Orígenes | Timeline |
| `#valor` | Creando valor | Vídeo fondo, 3 pilares |
| `#por-que` | Por qué Senator | Grid 4x4 iconos SVG |
| `#fidelizacion` | Fidelización | Canvas barras + donut |
| `#digital` | Digital ecosystem | Barras, phone mock Instagram |
| `#ventas` | Red de ventas | Anillos conic-gradient |
| `#revalor` | Revalorización | Canvas chart + imagen |
| `#eficiencia` | Eficiencia | 3 boxes SVG |
| `#gastro` | Gastronomía | Grid 5 cols, logos restaurantes |
| `#hospitalidad` | Hospitalidad | Hero + grid 4 cols |
| `#ocio` | Ocio | Western films + aquarium cards |
| `#personas` | Personas | Sidebar + grid + academy |
| `#gobernanza` | Gobernanza | Foto grupal + organigrama |
| `#sostenibilidad` | Sostenibilidad | 4 pilares ESG |
| `#futuro` | Futuro | Split + 3 departamentos |
| `#alquiler` | Alquiler | Hotel Don Paco split |
| `#alternativas` | Alternativas | 3 alternativas renta |
| `#reposicion` | Reposicionamiento | Hotel Don Paco |
| `#contacto` | Trusted by Asset Owners | Grid 20 logos |

---

## Librerías externas utilizadas

| Librería | Versión | Uso |
|----------|---------|-----|
| Chart.js | v4 | Gráficos de barras, donut, área |
| D3.js | v7 | Mapas interactivos |
| TopoJSON Client | v3 | Geometría de mapas |
| Google Fonts | — | Playfair Display, DM Sans, DM Mono |

---

*Documento generado el 08/06/2026*
