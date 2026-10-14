# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dos audiencias con el mismo peso (confirmado):

- **Cliente particular.** Conoce su vehículo (marca, modelo, año) pero no siempre el repuesto exacto. Compra puntual, a menudo desde el celular. Puede comprar para el carro de otra persona.
- **Taller.** Conoce las referencias, compra varias piezas por pedido y espera precios de taller. Hoy todo el que se registra entra como cliente público y alguien reclasifica la cuenta a mano (decisión D4 en Notion, sin dueño ni SLA).

Interactúan además los **asesores de Servicio y Posventa**, que atienden lo que la tienda no resuelve sola (WhatsApp hoy). Son quienes validan este prototipo.

## Product Purpose

Tienda virtual de repuestos originales SsangYong / KGM para Colombia. Este repositorio es un **prototipo de validación** (confirmado): sirve para validar flujos y comportamiento con el equipo de Servicio y Repuestos antes de construir el producto final en Angular con las integraciones reales (SIISA, PayU). No es el producto productivo.

Éxito: que el equipo pueda recorrer los cuatro escenarios de validación y decir en qué punto el cliente dudaría y se iría a WhatsApp.

## Positioning

El **vehículo es una lente, no un filtro**: con un vehículo activo la tienda prioriza lo que le sirve, nunca oculta el resto. La compatibilidad tiene **tres estados** (compatible, no compatible, sin confirmar) y "sin confirmar" nunca se presenta como rechazo. Una tienda genérica de repuestos no tiene ese contrato con el cliente.

## Operating Context

- Backlog en Notion: épicas E01–E58 con historias (HU-Exx-yy), Modelo conceptual de dominio y tablero de decisiones D1–D6.
- Los cuatro escenarios de validación: búsqueda sin vehículo, búsqueda con vehículo, usuario que no sabe qué pieza necesita (con derivación a asesor) e intención de compra por checkout simulado.
- Hoy los casos que la tienda no resuelve terminan en WhatsApp o en intervención manual del asesor, que es justo lo que el proyecto quiere reducir.

## Capabilities and Constraints

- Stack del prototipo: Next.js (App Router), React, TypeScript, CSS plano en `app/globals.css`; sin backend. Estado en Context y `localStorage`. El producto final será Angular.
- **Todo lo externo es simulado** y debe verse como tal: SIISA (inventario, precios, compatibilidad), PayU (pagos), transportadora (envío), canal de asesoría (WhatsApp, llamada, correo). No presentar mocks como funcionalidad productiva.
- Funcionalidades marcadas en Notion como "posible funcionalidad" (por ejemplo E55, complementos de instalación) no se presentan como confirmadas.
- Decisiones abiertas sin dueño: umbral de envío gratis y tarifa (D3), duración del carrito (D1), criterio de relevancia (D5), facturación a terceros (D6), SLA de reclasificación de taller (D4). Los valores usados en el prototipo para estas son de ejemplo.
- Terminología: "sin confirmar" / "verificar compatibilidad" (nunca "incompatible" cuando solo falta el dato), "asesor", "vehículo activo".

## Brand Commitments

- Se mantiene el **logo y nombre reales SsangYong / KGM** en la cabecera (confirmado).
- Notion documenta una identidad ficticia llamada TORQUE (maquetas de alta fidelidad, Bloques A y B). Se decidió **no adoptarla como base**; no es vinculante.
- **Dirección visual (confirmado, 7-oct-2026):** el estándar de la categoría ejecutado con todo el oficio, sin giros estilísticos ni disfraz de ningún mundo. Referentes de calidad: **Mercado Libre Colombia** y **Sodimac / Homecenter**.

## Evidence on Hand

- Datos de ejemplo: 15 productos con aplicabilidad por modelo, año y motor (`app/data/products.ts`). Son inventados.
- Imágenes de producto: fotos de stock genéricas (Unsplash) como marcador de posición. **No hay fotos reales de repuestos** ni guía de marca KGM en el repositorio; no inventarlas.
- Documentación: `DOCUMENTACION-FUNCIONAL.md`, `AUDITORIA_PROTOTIPO.md`, y el documento "Preguntas pendientes para Servicio y Repuestos" (39 preguntas).
- Ausencias que no deben fabricarse: reseñas, clientes, métricas, precios reales, horarios de atención, tarifas de envío.

## Product Principles

1. **Incertidumbre honesta.** Lo que no se sabe se dice como "sin confirmar", sin afirmarlo ni negarlo; la ausencia de dato no es ausencia de necesidad.
2. **El vehículo acompaña todo el recorrido.** Cliente y taller siempre ven para qué vehículo compran y qué le aplica.
3. **Simulado a la vista.** Lo que no es real se etiqueta como simulado; la maqueta no debe parecer una promesa.
4. **Ninguna sorpresa antes de pagar.** Total desglosado, revalidación de precio y stock, y avisar que aún no se cobró nada.
5. **Salida a un asesor sin perder el contexto.** Pedir ayuda conserva vehículo, búsqueda y carrito, y permite volver al flujo.

## Accessibility & Inclusion

WCAG 2.2 AA (confirmado): contraste de texto de 4.5:1, objetivos táctiles de al menos 44 px, foco visible, operación completa por teclado, `prefers-reduced-motion` respetado. Uso frecuente en celular y con conexión variable.
