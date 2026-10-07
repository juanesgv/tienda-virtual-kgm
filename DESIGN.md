---
name: KGM Repuestos
description: Tienda de repuestos originales SsangYong / KGM al estándar de la categoría (Mercado Libre Colombia, Sodimac): superficies blancas y gris frío, un solo color de acción y color semántico solo para compatibilidad y estado.
colors:
  primary: "#3F3954"
  primary-dark: "#2D2840"
  ink-dark: "#111827"
  success: "#0F7A4D"
  warning: "#8A5300"
  error: "#B3261E"
  success-soft: "#E8F5E9"
  warning-soft: "#FFF3E0"
  error-soft: "#FFEBEE"
  white: "#FFFFFF"
  gray-100: "#F5F6F8"
  gray-200: "#E7E9ED"
  gray-300: "#D1D5DB"
  gray-400: "#9CA3AF"
  gray-500: "#5F6672"
  gray-600: "#4B5563"
  gray-700: "#374151"
  gray-800: "#1F2937"
  gray-900: "#111827"
typography:
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.gray-800}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.gray-100}"
    textColor: "{colors.gray-900}"
  button-add-cart:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  button-add-cart-disabled:
    backgroundColor: "{colors.gray-200}"
    textColor: "{colors.gray-600}"
  product-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "16px"
  category-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "16px"
  badge-compatible:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  badge-not-compatible:
    backgroundColor: "{colors.error-soft}"
    textColor: "{colors.error}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  badge-verify:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  input-search:
    backgroundColor: "{colors.white}"
    textColor: "{colors.gray-900}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    height: "44px"
  compatibility-banner:
    backgroundColor: "{colors.success-soft}"
    rounded: "{rounded.lg}"
    padding: "16px"
  footer:
    backgroundColor: "{colors.ink-dark}"
    textColor: "{colors.white}"
---

# Design System: KGM Repuestos

## Overview

**Creative North Star: "El mostrador del almacén"**

Es una tienda de repuestos que se comporta como la categoría espera: densa, legible, previsible. Se ejecuta el estándar de Mercado Libre Colombia y Sodimac con oficio, sin giros estilísticos ni disfraz de otro mundo. La confianza viene de que cada cosa está donde se espera, de que el vehículo del cliente acompaña la pantalla y de que el color solo se usa cuando dice algo.

La superficie es blanca sobre un fondo gris frío (#F5F6F8); los contenedores se separan con bordes de 1px, no con sombras. Hay un solo color de acción, el morado oscuro del logo SsangYong. Verde, ámbar y rojo no son decoración: significan compatibilidad (compatible, sin confirmar, no compatible) y estado de stock o pedido. El tono es sobrio y de uso rápido, pensado para celular y para el taller que compra varias piezas.

**Key Characteristics:**
- Una sola familia tipográfica (Inter) en cinco tamaños.
- Un solo color de acción; color semántico reservado.
- Bordes de 1px en lugar de sombras; la sombra aparece en superposiciones y como respuesta al cursor en tarjetas.
- Objetivos táctiles de 44px como mínimo; foco visible en todo.
- Contenedor de 1400px, rejillas que se adaptan con `auto-fill`.

## Colors

Paleta neutra fría con un acento institucional y tres colores de estado. Los valores viven en `:root` de `app/globals.css`.

### Primary
- **Morado SsangYong** (`primary`): único color de acción: botones principales, enlaces, pestaña activa, interruptores y casillas marcadas, contador del carrito, foco. Blanco sobre este color da 11:1.
- **Morado profundo** (`primary-dark`): solo el estado hover de lo anterior.

### Secondary
- **Tinta de pie** (`ink-dark`, mismo valor que `gray-900`): fondo del pie de página y bloques oscuros.

### Semantic (reservado)
- **Verde compatible** (`success`) sobre `success-soft`: pieza compatible, en stock, etapa de pedido completada, vehículo activo en el garaje, y confirmaciones de acción (aviso "ya está en tu carrito", envío gratis alcanzado, asesor disponible). Lo "predeterminado" o "elegido" (dirección predeterminada, categoría sugerida) va en primario o gris, no en verde. Los tres pares `*-soft` existen como tokens en `:root`; no se escriben como literales.
- **Ámbar verificar** (`warning`) sobre `warning-soft`: compatibilidad sin confirmar, poco stock, cambio de precio o cantidad. Nunca se presenta como rechazo.
- **Rojo no compatible** (`error`) sobre `error-soft`: no compatible, agotado, cancelado, error.

### Neutral
- **Blanco** (`white`): tarjetas, paneles, cabecera, campos.
- **Gris 100** (`gray-100`): fondo de página, imagen de producto, hover de filas.
- **Gris 200** (`gray-200`): bordes de tarjetas y divisores.
- **Gris 300** (`gray-300`): bordes de controles.
- **Gris 400** (`gray-400`): solo bordes de casillas e iconos tenues; no sirve para texto sobre blanco. Sí se usa como texto sobre el pie oscuro.
- **Gris 500 a 900** (`gray-500` a `gray-900`): texto. Del 500 en adelante cumple 4.5:1 sobre blanco; `gray-900` es la tinta principal.

### Named Rules
**The Reserved Signal Rule.** Verde, ámbar y rojo solo comunican compatibilidad y estado de stock o pedido. Nunca para decorar, para marcar una categoría ni para acciones.

**The One Action Color Rule.** Todo lo que se puede pulsar o está seleccionado usa el morado primario; lo secundario es blanco con borde gris.

**The Never Alone Rule.** Un estado nunca se comunica solo con color: va con icono y texto ("Compatible", "Verificar compatibilidad", "No compatible").

## Typography

**Display Font:** Inter (con -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif), servida por `next/font` como `--font-inter`.
**Body Font:** la misma Inter.

**Character:** Neutra, de interfaz de comercio; la jerarquía sale del peso y del tamaño, no de otra familia.

### Hierarchy
- **Headline** (700, 28px `--text-xl`, 1.2, -0.01em): título de página, título del panel de vehículo, nombre de producto en ficha, precio en ficha.
- **Title** (700, 20px `--text-lg`, 1.3): encabezado de sección, tarjeta de ayuda, precio en tarjeta de producto.
- **Body** (400, 16px `--text-base`, 1.5): texto corrido (máx. 60ch en párrafos de entrada), nombre de producto en tarjeta (600), botones (600).
- **Body small** (400 a 600, 14px `--text-sm`): navegación, metadatos, stock, texto de apoyo.
- **Label** (600, 12px `--text-xs`): SKU, insignias de compatibilidad, contador del carrito.

Las cifras (precios, SKU, ids de pedido) usan `font-variant-numeric: tabular-nums`.

### Named Rules
**The Five Steps Rule.** Los tamaños nuevos salen de 12 / 14 / 16 / 20 / 28 (el CSS existente conserva deriva conocida: 11, 13, 18, 22 y 24 px; se normaliza al tocar cada regla). Los títulos grandes llevan `text-wrap: balance`.

## Layout

Contenedor de hasta 1400px centrado, con 24px de margen lateral (16px en pantallas angostas). El espaciado sigue la escala de 4px (`--space-1` a `--space-16`: 4, 8, 12, 16, 24, 32, 48, 64); las reglas nuevas usan los tokens.

- **Inicio:** panel de vehículo (1.7fr) junto a tarjeta de ayuda (1fr); una columna bajo 900px.
- **Categorías:** rejilla `auto-fill` con mínimo de 160px, separación de 12px.
- **Productos:** rejilla `auto-fill` con mínimo de 240px, separación de 16px.
- **Catálogo:** barra lateral de filtros de 280px y columna de resultados; los filtros pasan a un panel móvil al estrechar.
- **Ficha:** dos columnas 5fr/6fr con 48px de separación; la galería es cuadrada.
- **Puntos de ruptura usados:** 1080, 1024, 900, 820, 768, 720, 600 y 480px.
- **Objetivos táctiles:** 44px de alto mínimo en botones, campos, enlaces de navegación secundaria, filas de filtros y paginación; la navegación principal tiene 48px.

### Named Rules
**The 44 Rule.** Nada pulsable mide menos de 44px en su lado menor.

## Elevation & Depth

Sistema plano con bordes. Las tarjetas, paneles y barras se separan con un borde de 1px (`gray-200`) sobre fondo blanco, no con sombra. La sombra existe para dos cosas: superposiciones reales y la respuesta al cursor sobre tarjetas clicables.

### Shadow Vocabulary
- **Sutil** (`box-shadow: 0 1px 2px rgba(17, 24, 39, 0.06)`): definida como `--shadow-sm`; reservada.
- **Media** (`box-shadow: 0 4px 12px rgba(17, 24, 39, 0.08)`): sugerencias de búsqueda y hover de tarjetas de producto y categoría.
- **Alta** (`box-shadow: 0 12px 32px rgba(17, 24, 39, 0.12)`): modales.

### Named Rules
**The Border Before Shadow Rule.** En reposo, la separación es un borde de 1px. Una sombra nueva solo se justifica en una superposición o como respuesta a hover.

## Shapes

Esquinas discretas, nunca de píldora en controles: 4px para detalles (insignias, casillas, ítems de lista), 6px para controles (botones, campos, selectores), 8px para tarjetas y paneles, 12px solo para superposiciones (modales). Los círculos se reservan a puntos de línea de tiempo, contador y marcador de estado. Los bordes son completos y del mismo tono; no se usan bordes laterales gruesos como acento.

## Components

### Buttons
- **Shape:** esquina de 6px, mínimo 44px de alto, relleno horizontal de 24px, texto 16px a 600.
- **Primary** (`.btn-main`, `.btn-primary`): fondo morado, texto blanco, borde del mismo tono. Hover a `primary-dark`.
- **Secondary** (`.btn-secondary`, `.btn-outline`): fondo blanco, borde `gray-300`, texto `gray-800`. Hover a fondo `gray-100` y borde `gray-400`.
- **Disabled:** opacidad 0.5 y cursor no permitido.
- **Add to cart:** botón compacto de tarjeta (`.btn-add-cart`, 14px, 44px) y botón de ficha (`.btn-add-to-cart`, 48px, ancho flexible). Deshabilitado: fondo `gray-200`, texto `gray-600`.
- Las transiciones son de 0.2s y el efecto visible es de color; no hay desplazamientos al pasar el cursor (algunas reglas heredadas listan también `box-shadow, opacity, transform` sin usarlos).

### Cards / Containers
- **Product card:** blanco, borde 1px `gray-200`, esquina 8px, imagen 4:3 sobre `gray-100`, insignia de compatibilidad arriba a la izquierda, SKU, nombre a dos líneas, stock, pie con precio y botón separado por línea de 1px. Una pieza no compatible atenúa la imagen (opacidad 0.55, algo de gris), no el texto.
- **Category card:** blanco, borde 1px, esquina 8px, icono de 44px en cuadro `gray-100`, nombre y conteo.
- **Panel (vehículo, ayuda, filtros, barra de orden):** blanco, borde 1px, esquina 8px, relleno de 16 a 32px.

### Badges y banners de compatibilidad
- Insignia: 12px a 600, esquina 4px, relleno 4px 8px, fondo suave y texto del color semántico, con icono.
- Banner de ficha: borde completo de 1px en un tono intermedio del mismo color, fondo suave, icono y título en el color semántico, texto en `gray-700`.

### Inputs / Fields
- **Style:** blanco, borde 1px `gray-300`, esquina 6px, 44px de alto, 14 a 16px.
- **Focus:** anillo de 2px `primary` con desfase de 2px (`:focus-visible` global); sobre el pie oscuro el anillo es blanco.
- **Controles personalizados:** interruptor de 48x24 y casilla de 20x20 con el `input` real superpuesto e invisible, de modo que el teclado y el lector de pantalla operan el control real.

### Navigation
- **Cabecera:** blanca, sticky, borde inferior 1px; logo, buscador global (máx. 720px, botón de búsqueda morado a la derecha), selector de vehículo, carrito con contador.
- **Navegación principal:** ítems de 14px a 500 en `gray-700`, 48px de alto, desplazable en horizontal. Activo: texto morado y subrayado inferior de 3px.
- **Pie:** fondo `ink-dark`, enlaces `gray-400` que pasan a blanco, 44px de alto.

### Selector de vehículo (componente distintivo)
Botón blanco con borde y icono morado; con vehículo guardado se vuelve neutro (el verde se reserva para el estado de compatibilidad de una pieza). Acompaña la cabecera y el garaje para sostener "el vehículo como lente".

## Do's and Don'ts

### Do:
- **Do** usar `--color-primary` (#3F3954) solo para acciones y selección.
- **Do** expresar los tres estados de compatibilidad con color semántico, icono y texto; "sin confirmar" va en ámbar y nunca como rechazo.
- **Do** separar superficies con bordes de 1px (`gray-200`) y esquinas de 8px.
- **Do** mantener 44px mínimos en todo lo pulsable y el anillo de foco de 2px con desfase de 2px (blanco sobre el pie).
- **Do** usar los tokens `--space-*` y `--text-*` en reglas nuevas.
- **Do** atenuar la imagen de lo no compatible, no su texto.

### Don't:
- **Don't** usar verde, ámbar o rojo fuera de compatibilidad y estado de stock o pedido.
- **Don't** usar `gray-400` como color de texto sobre blanco (no llega a 4.5:1).
- **Don't** añadir sombras en reposo ni bordes laterales gruesos como acento.
- **Don't** introducir una segunda familia tipográfica ni tamaños fuera de la escala.
- **Don't** presentar datos simulados (SIISA, PayU, envío, asesoría) como reales.
