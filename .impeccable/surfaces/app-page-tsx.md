---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/globals.css","app/repuestos/page.tsx","app/carrito/page.tsx"]
---

# Surface brief: tienda completa (rediseño)

## Scope and mode
Toda la tienda del prototipo: inicio, catálogo, búsqueda, ficha, carrito, checkout, pedido, cuenta y asesoría. Modo **Operate**: el visitante viene a completar una tarea (encontrar la pieza correcta para su vehículo y comprarla). El inicio también es funcional: punto de partida, no vitrina.

## Audience, task, constraints
- Cliente particular y taller con el mismo peso; escritorio y, sobre todo, celular.
- Tarea: elegir vehículo, buscar o navegar, confirmar compatibilidad, comprar sin sorpresas.
- Restricciones: no cambiar flujos, rutas ni lógica; logo SsangYong/KGM real; WCAG 2.2 AA; todo lo simulado se etiqueta como tal; los tres estados de compatibilidad (compatible, no compatible, sin confirmar) y sus avisos se conservan.

## Chosen direction
Estándar de la categoría (salida permanente elegida a propósito), ejecutado con todo el oficio. Vara de calidad: Mercado Libre Colombia y Sodimac / Homecenter. Seed 96b4ebd8, modo operate.

## Direction contract

THESIS: Una tienda de repuestos que se siente tan rodada como los referentes que el cliente ya usa a diario: el vehículo y la búsqueda mandan, el precio y la disponibilidad se leen de un vistazo y nada se interpone entre el cliente y la compra. Rechaza el carrusel promocional, la tarjeta recargada y el acento decorativo.

OWN-WORLD: Superficies blancas y gris frío (#FFFFFF, #F5F6F8), tinta #111827, el color de marca del logo SsangYong #3F3954 solo para acciones y selección. Verde, rojo y ámbar reservados para compatibilidad y estado de pedido, en tonos de contraste AA. Una sola familia de texto (Inter) en escala 12/14/16/20/28, cifras tabulares en precios y referencias. Radio 8 px en tarjetas, 6 px en controles, bordes de 1 px y sombra solo en superposiciones. Espaciado en múltiplos de 4. Fotografía de producto sobre fondo gris claro.

STORY: El visitante entiende en segundos para qué vehículo compra, ve qué le sirve y qué no, y llega al pago sabiendo el total.

FIRST VIEWPORT: Escritorio 1440 px. Cabecera blanca con logo KGM, buscador ancho, chip de vehículo, cuenta y carrito; fila de categorías debajo. Bajo ella, panel principal "¿Para qué vehículo compras?" con selector (placa o marca/modelo/año) y botón de acción en color primario #3F3954 (el selector se abre en un modal; adaptación registrada: evita duplicar el formulario de VehicleModal en la portada), junto a una tarjeta estática de ayuda con asesor; luego fila de categorías con icono y las piezas destacadas. Sin carrusel automático.

FORM: Estándar de la categoría (canon), sin posición en la lista ordenada; seed 96b4ebd8.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved decisions
- Fuente de las fotos reales de producto (hoy son marcadores de posición).
- Tamaño final de la escala tipográfica y del radio, que se afina en la Fase 1b.
