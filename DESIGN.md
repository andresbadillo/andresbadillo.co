# Sistema de diseño — andresbadillo (web)

Reglas y tokens del sitio. Cualquier persona o agente (Claude Code, Codex, Cursor) que toque la interfaz debe leer este archivo antes y usar los tokens en lugar de valores sueltos.

## Dónde vive cada cosa

| Archivo | Contenido |
|---|---|
| `src/styles/theme.scss` | Colores y `--shadow`, por tema: `:root, [data-theme="dark"]` (oscuro, el de partida) y `[data-theme="light"]`. |
| `src/styles/tokens.scss` | Lo que no cambia con el tema: tipografía, espacio, radios, sombras, capas y los tonos de onda calculados. |
| `src/styles/_breakpoints.scss` | Puntos de corte como variables Sass (`bp.$sm`, `bp.$md`, `bp.$lg`). |
| `public/theme-init.js` | Pone `data-theme` y `theme-color` antes del primer pintado, para que no parpadee el tema. |
| `src/styles/fonts.scss` | `@font-face` de Inter y JetBrains Mono, servidas desde `src/assets/fonts/`. |
| `src/styles/globals.scss` | Reset, `body`, `.container`, foco y skip-link. Importa los tres anteriores. |

## Reglas

1. **Nada de valores sueltos.** Color, radio, sombra, capa y familia tipográfica salen siempre de un token. Si falta uno, se añade al archivo que corresponde y a este documento.
2. **Un color nuevo se define en los dos bloques** de `theme.scss` (oscuro y claro).
3. **Un solo color de marca**: `--accent`. Sobre `--accent` el texto va en `--on-accent`.
4. **Texto pequeño en color de marca** (tags, etiquetas, nombre en el footer) usa `--accent-text`: en tema claro `--accent` solo llega a 3.3:1 sobre el fondo.
5. **Todo lo que se pulsa es píldora** (`--radius-pill`). No hay botón secundario ni de contorno: una acción secundaria es un enlace (en el admin, `.linkAction`). La acción destructiva es una píldora en `--danger`.
6. **Sin bordes para separar bandas.** Las bandas alternan `--bg` y `--home-hero-bg` y se unen con ondas.
7. **El movimiento respeta `prefers-reduced-motion`**: cada animación nueva lleva su variante quieta.
8. **Foco visible**: contorno de 2px en `--accent`, separado 2px. No se quita.

## Color

| Token | Oscuro | Claro | Uso |
|---|---|---|---|
| `--bg` | `#0f1115` | `#f2f4f7` | Fondo de página y de las bandas Portfolio y Contact. |
| `--home-hero-bg` | `#1a1a1a` | `#ffffff` | Hero, banda Blog, footer y menú móvil. |
| `--card` | `#171b22` | `#ffffff` | Superficie de `ProjectCard` y paneles de administración. |
| `--home-preview-surface` | `#4a5a6e` | `#b8c5d6` | Marco de la captura en `HomeProjectRow`. |
| `--border` | `#2b3441` | `#c9d2dc` | Bordes de tarjetas y campos de administración. |
| `--fg` | `#eef2f6` | `#1f2329` | Texto principal. |
| `--muted` | `#9ba6b2` | `#5d6670` | Títulos de sección, extractos, metadatos. |
| `--home-hero-fg` | `#e2e4e8` | `#1f2329` | Texto del hero y del menú móvil. |
| `--home-hero-greet` | `#b8bec7` | `#4a5563` | Saludo y primera línea de la bio. |
| `--home-hero-muted` | `#9ea5af` | `#5d6670` | Segunda línea de la bio. |
| `--accent` | `#f2a36b` | `#c86f3a` | Color de marca: botones, logo, nombre, subrayados, anillo del avatar, iconos, foco. |
| `--accent-text` | `#f2a36b` | `#a34f1f` | Texto pequeño en color de marca. |
| `--on-accent` | `#111111` | `#111111` | Texto sobre `--accent`. |
| `--accent-bars` | `rgba(242, 163, 107, 0.35)` | igual | Barras de `CanvasBarsDivider` (el canvas lo lee del CSS). |
| `--starfield-rgb` | `242, 244, 255` | `58, 65, 74` | Partículas de `StarfieldCanvas` (tres números, sin `rgb()`). |
| `--wave-shade-hero` | `#131313` | `#b8b8b8` | Onda trasera de un divisor que parte de `--home-hero-bg`. |
| `--wave-shade-bg` | `#0b0c0f` | `#aeb0b2` | Onda trasera de un divisor que parte de `--bg`. |
| `--home-form-input-bg` / `-fg` | `#ffffff` / `#1a1a1a` | igual | Campos del formulario de contacto: blancos en los dos temas. |
| `--danger` | `#a83f3f` | `#b23b3b` | Fondo del botón Eliminar del admin. |
| `--on-danger` | `#ffffff` | `#ffffff` | Texto sobre `--danger`. |
| `--danger-text` | `#ef9292` | `#a32f2f` | Mensajes de error. |
| `--success-text` | `#8fd6ad` | `#1f7a4a` | Mensajes de éxito. |
| `--embed-surface` | `#ffffff` | `#ffffff` | Fondo blanco de `LinkedInEmbed` en rejillas. |
| `--toggle-*` | — | — | Piezas de `ThemeToggle`, incluidas sus sombras (`--toggle-shadow-track`, `--toggle-shadow-thumb`). |

Los tonos `--wave-shade-*` están en `tokens.scss` y se calculan solos: `color-mix(in srgb, <fondo> 72%, #000)`. Siguen a `--bg` y `--home-hero-bg` sin tocarlos.

Todos los pares de texto llegan a 4.5:1, salvo `--accent` en tema claro (3.3:1); por eso existe `--accent-text`.

## Tipografía

- `--font-sans`: Inter. Toda la interfaz. Títulos en 500 y 600; texto en 400.
- `--font-mono`: JetBrains Mono. Código y etiquetas de administración.

| Estilo | Tamaño | Peso | Notas |
|---|---|---|---|
| Logo `<AB/>` | `2rem` | 700 | Mayúsculas, `--accent`. |
| Nombre del hero | `clamp(1.75rem, 4vw, 2.75rem)` | 600 | Interlineado 1.15. |
| Título de proyecto | `clamp(1.35rem, 2.5vw, 1.85rem)` | 600 | |
| Título de sección | `clamp(1.1rem, 2vw, 1.35rem)` | 500 | `--muted`; primera palabra en `--fg` con subrayado. |
| Bio | `1.2rem` | 400 / 700 | Interlineado 1.7. |
| Texto | `1rem` | 400 | Interlineado 1.5. |
| Botón | `0.88rem` | 600 | «Send» usa `0.95rem`. |
| Navegación | `0.9rem` | 400 | Mayúsculas, `letter-spacing: 0.2em`. |
| Metadatos | `0.72rem` | 400 | Mayúsculas, `0.06em`. |
| Tags | `0.68rem` | 400 | Mayúsculas, `0.04em`, `--accent-text`. |

## Espacio, radios, sombras y capas

| Token | Valor | Uso |
|---|---|---|
| `--space-1` … `--space-6` | `0.35`, `0.5`, `0.75`, `1`, `1.25`, `2rem` | Separaciones. Úsalos en código nuevo. |
| `--section-min` / `--section-max` | `3rem` / `5rem` | Padding vertical de sección: `clamp(var(--section-min), 8vw, var(--section-max))`. |
| `--container` | `1080px` | Ancho máximo: `min(var(--container), 92vw)`. |
| `--header-offset` | `84px` | Espacio que `main` reserva para el header fijo. |
| `--radius-input` | `0.4rem` | Campos y skip-link. |
| `--radius-image` | `0.5rem` | Capturas y embeds. |
| `--radius-post` | `0.65rem` | `BlogPostCard`. |
| `--radius-card` | `0.8rem` | `ProjectCard`. |
| `--radius-surface` | `1rem` | Marcos de captura. |
| `--radius-pill` | `999px` | Botones, interruptor, subrayados. |
| `--shadow` | por tema | Tarjetas. |
| `--shadow-preview` | `0 20px 50px rgba(0,0,0,.25)` | Marco de captura. |
| `--shadow-avatar` | `0 24px 60px rgba(0,0,0,.35)` | Avatar del hero. |
| `--z-hero`, `--z-divider`, `--z-band` | `2`, `3`, `4` | Hero, divisores y contenido de banda. |
| `--z-menu`, `--z-header`, `--z-menu-actions` | `1000`, `1001`, `1002` | Panel del menú móvil, header y botón que lo cierra. |
| `--z-scroll-cue`, `--z-curtain`, `--z-skip-link` | `1100`, `1200`, `9999` | Indicador SCROLL, cortina y skip-link. |

Los `z-index` 0 y 1 dentro de un contexto aislado (`isolation: isolate`) son locales y van escritos.

### Puntos de corte

Las media queries no admiten variables CSS, así que son variables Sass en `_breakpoints.scss`:

| Variable | Valor | Uso |
|---|---|---|
| `bp.$sm` | `425px` | Móvil estrecho. |
| `bp.$md` | `767px` | Móvil y tablet vertical: menú móvil, hero en una columna, contenedor con padding lateral. |
| `bp.$lg` | `900px` | Tablet ancha: rejillas a dos columnas. |

```scss
@use "@/styles/breakpoints" as bp;

@media (max-width: bp.$md) { … }
```

El retrato usa siempre `border-radius: 45% 55% 50% 50% / 40% 45% 55% 60%`; nunca un círculo.

## Movimiento

Tres piezas son la firma del sitio y no se sustituyen por imágenes ni vídeo:

- **Hero con parallax** (`HomePage` + `StarfieldCanvas`): pista de `200lvh`, hero `sticky` de `100lvh`, 1200 partículas que se agrupan hacia el avatar con el scroll; la bio aparece al 5–20% y al 40–72% del progreso. No pongas `overflow-x: hidden` en sus contenedores ni cambies `lvh` por `dvh`.
- **Ondas** (`SvgWavesDivider` y divisores de `HomePage`): dos capas, vaivén de 3.8s y 5.75s.
- **Barras** (`CanvasBarsDivider`): 80 barras que ondulan y suben bajo el cursor.

Duraciones del resto: subrayado de títulos 0.9s `cubic-bezier(0.16, 1, 0.3, 1)`; cortina entre páginas 320ms; cambio de tema 240ms; header 320ms; menú móvil 420ms `cubic-bezier(0.22, 1, 0.36, 1)`.

## Pendiente

- `--space-*` ya se usa en el admin y el header; el resto de `gap`, `margin` y `padding` del sitio sigue con sus valores originales.
- `index.html` repite a mano los colores del skip-link (`#f2a36b`, `#111`) porque se pinta antes de cargar el CSS, y `public/theme-init.js` repite los dos valores de `--home-hero-bg` para `theme-color`.
