# Auditoría del prototipo de tienda virtual de repuestos

**Fecha de revisión:** 24 de septiembre de 2026  
**Proyecto:** Nueva tienda virtual de repuestos  
**Prototipo revisado:** `http://localhost:3000`  
**Tipo de revisión:** funcional, técnica, UX, responsive y accesibilidad

## Fuentes y alcance de la revisión

Se consultaron las siguientes fuentes:

- [Backlog de épicas de e-commerce](https://www.notion.so/9af76042414147af9ca71aef4677fe51)
- [Hub del proyecto](https://www.notion.so/3c09daf513368171ab8bc1939a1ecb67)
- [Modelo conceptual de dominio](https://www.notion.so/3ca9daf51336818fa8f7f0202f3ab54f)
- [Decisiones pendientes](https://www.notion.so/3ca9daf513368122a7b3c6c9f1148fc2)
- [Guía de descubrimiento de SIISA](https://www.notion.so/3ca9daf513368190a4a7eb0626a9c86a)
- [Wireframes de baja fidelidad A](https://www.notion.so/3d89daf51336814ba1eae17164efd152) y [B](https://www.notion.so/3d89daf513368111af12e728c942b2f2)
- [Diseños de alta fidelidad A](https://www.notion.so/3dd9daf5133681bc938adce439aa3237) y [B](https://www.notion.so/3dd9daf513368177a4dce3da3f727916)
- [Roadmap](https://www.notion.so/3919daf5133680f58854fab839f52d96)
- [Notas del 24 de agosto](https://www.notion.so/3c69daf5133681afb7b5e223c0af0a59) y [25 de agosto](https://www.notion.so/3c79daf51336813fa925f4fd8a80ccb8)
- Épicas detalladas E01–E18, E54, E55 y E58.
- El archivo local `DOCUMENTACION-FUNCIONAL.md`.
- El código fuente y un recorrido funcional del prototipo en escritorio y viewport móvil.

Varias páginas del backlog contienen solamente metadatos o están vacías. En esos casos no existen criterios de aceptación suficientes y la evaluación se limita al objetivo de la épica. La E56 aparece citada como dependencia, pero no está visible en la base consultada. Las notas de reunión también indican que algunos puntos necesitan confirmación de participantes.

No se modificaron archivos del proyecto durante la auditoría. La comprobación de TypeScript pasó con `tsc --noEmit --incremental false`. No se encontraron pruebas automatizadas. No se ejecutó una compilación de producción para evitar escrituras en `.next`.

## 1. Estado general del prototipo

El prototipo cubre bien la estructura básica de una tienda de repuestos:

- Inicio, catálogo, categorías y detalle de producto.
- Selección manual o simulada de vehículo.
- Garaje con varios vehículos.
- Carrito persistente.
- Registro, acceso, recuperación de contraseña y perfil.
- Direcciones.
- Historial y detalle de pedidos.
- Estados visuales de inventario y disponibilidad del servicio.
- Diseño adaptable parcial.

La implementación es completamente local. Los productos, precios, inventario y compatibilidades están en archivos estáticos. Usuarios, contraseñas, vehículos, carrito y pedidos se guardan en `localStorage`. No hay integración con SIISA, PayU, transportadoras, facturación, correo, WhatsApp ni servicios de backend.

Esto es válido para una maqueta navegable, pero actualmente el prototipo puede dar conclusiones equivocadas en dos aspectos centrales del negocio: compatibilidad vehículo–repuesto y finalización de compra.

## 2. Hallazgos prioritarios

### Críticos

#### 2.1 La compatibilidad ignora año y motorización

La función central compara únicamente marca y modelo en `app/data/products.ts`.

En la prueba funcional se seleccionó un **KGM Rexton 2015**. El alternador fue declarado compatible, aunque su aplicabilidad visible indica **Rexton 2018–2024**. El modo “No estoy seguro” tampoco impide emitir un resultado definitivo.

Esto afecta E07 y puede invalidar una prueba con usuarios: el usuario podría interpretar que la tienda garantiza una compatibilidad que los propios datos contradicen.

#### 2.2 El checkout no representa el flujo de pago definido

“Confirmar pedido” crea inmediatamente un pedido local en estado pendiente. No existe redirección a PayU ni resultados aprobado, rechazado, pendiente o abandonado. Tampoco se puede validar idempotencia o el manejo de pagos pendientes durante cuatro a ocho horas.

La pantalla posterior dice que el comercio contactará al comprador para coordinar el pago, un modelo distinto al de E12.

#### 2.3 La asesoría humana todavía no es un flujo utilizable

E21 está definida como crítica. En el prototipo aparece una tarjeta de “vista previa simulada” en algunos estados sin resultados o fallas, pero no permite:

- Describir libremente la necesidad.
- Elegir canal.
- Conocer el horario de atención.
- Transferir vehículo, búsqueda, producto y error al asesor.
- Volver al punto del flujo desde el que se pidió ayuda.
- Medir el motivo de la solicitud.

El enlace de WhatsApp del pie de página apunta a `#`.

### Altos

#### 2.4 La búsqueda falla con consultas naturales de varias palabras

La búsqueda requiere que la consulta completa sea una subcadena del producto o del texto de compatibilidad.

Ejemplos comprobados:

- `korndo` se corrige correctamente a `korando`.
- Una referencia exacta funciona.
- `filtro Tivoli` devuelve cero resultados.
- `pastillas de freno` termina sin resultados útiles.

Falta tokenizar la consulta y combinar tipo de repuesto, referencia, marca y vehículo. Esto limita E04 y E54.

#### 2.5 Los productos compatibles no se priorizan automáticamente

El catálogo permite filtrar por compatibilidad, pero la selección del vehículo no reorganiza por defecto los resultados. El modelo funcional establece que los compatibles deben ocupar las primeras posiciones.

#### 2.6 El carrito puede mostrar una compatibilidad incorrecta tras cambiar de vehículo

Cada línea guarda una instantánea del vehículo usado al agregarla, pero la pantalla recalcula el mensaje usando el vehículo actualmente activo.

Un carrito con repuestos para varios vehículos puede quedar visualmente mal etiquetado.

#### 2.7 El checkout móvil presenta desbordamiento horizontal

En un viewport de 390 × 844, el documento quedó en aproximadamente 414 px de ancho. Parte del total y del contenido derecho se recorta y aparece desplazamiento horizontal. Esta pantalla es un punto central de la demostración y debe probarse desde 320 px.

#### 2.8 La entrega y el total se presentan con reglas que aún no están definidas

El prototipo aplica envío fijo de $25.000 y envío gratis desde $500.000 antes de conocer cobertura o dirección. Los documentos contienen otros valores preliminares, incluida una referencia a $100.000, y la decisión sigue abierta.

Tampoco se separa claramente subtotal, impuestos, costo calculado por destino y total definitivo.

#### 2.9 Las relaciones entre productos no representan E55

Los “productos relacionados” se obtienen principalmente por pertenecer a la misma categoría. No distinguen:

- Complemento indispensable.
- Complemento recomendado.
- Sustituto o referencia intercambiable.
- Recomendación comercial.

Esto mezcla E55, prioritaria para la compra correcta, con E28, que está ubicada en Fase 2.

### Medios

#### 2.10 Los conteos del catálogo no corresponden al conjunto de datos

Se muestran cifras como 245 productos aunque el catálogo simulado contiene alrededor de once. Esto dificulta evaluar filtros, paginación y resultados.

#### 2.11 Existen rutas heredadas divergentes

`/listado` y `/producto/[id]` usan otro contexto de vehículo distinto del proveedor global. Estas rutas pueden fallar al hidratarse y además duplicar elementos que el layout ya renderiza. Conviene retirarlas o consolidarlas antes de compartir enlaces.

#### 2.12 No hay estados de carga reales

Los proveedores esperan a leer `localStorage` y mientras tanto retornan `null`. Esto puede producir una pantalla vacía. Tampoco hay archivos `loading.tsx` ni límites de error por ruta.

#### 2.13 Hay alcance futuro presentado como si perteneciera al MVP

La fidelización aparece en inicio, cuenta y checkout, aunque E23 está marcada para Fase 2. Además:

- El banner ofrece 10 % desde $2.000.000.
- La lógica usa un umbral de $5.000.000.
- El llamado a la acción del banner no hace nada.
- La documentación funcional local le asigna más importancia que el backlog de Notion.

Esto puede distraer la sesión de validación y crear expectativas prematuras.

## 3. Matriz de cobertura funcional

| Código | Capacidad | Estado | Evidencia y brecha principal |
|---|---|---|---|
| E01 | Inicio | Parcialmente cubierto | Inicio navegable con categorías, productos, confianza y promociones. La búsqueda no domina el primer pantallazo como pide la épica. |
| E02 | Catálogo | Simulado adecuadamente | Tarjetas, orden, filtros y paginación local. Conteos ficticios y sin fuente real. |
| E03 | Categorías | Simulado adecuadamente | Categorías y subcategorías navegables. Taxonomía todavía estática. |
| E04 | Búsqueda | Parcialmente cubierto | Sugerencias, referencia exacta y corrección simple. Falla al combinar repuesto y vehículo. |
| E05 | Filtros | Simulado adecuadamente | Precio, categoría, subcategoría y compatibilidad. “Vista lista” es decorativa. |
| E06 | Detalle | Parcialmente cubierto | Precio, inventario, especificaciones, compatibilidad y carrito. Galería repetida, sin buscador de aplicaciones ni origen de datos. |
| E07 | Compatibilidad | Parcialmente cubierto | Tres estados visuales. Algoritmo incompleto porque ignora año y motor; el filtro no persiste entre pantallas. |
| E08 | Garaje | Simulado adecuadamente | Alta, selección, eliminación y persistencia de varios vehículos. Falta la combinación explícita del garaje invitado al registrarse. |
| E09 | Registro y acceso | Simulado adecuadamente | Alta, ingreso, salida, validaciones y recuperación simulada. Sin sesión real ni política de expiración. |
| E10 | Carrito | Parcialmente cubierto | Cantidades, eliminación, persistencia y alertas. Hay riesgo con carritos multivehículo y referencias retiradas. |
| E11 | Checkout | Parcialmente cubierto | Captura dirección y datos básicos. Sin método de envío, cobertura, facturación ni revisión previa separada. |
| E12 | PayU | No cubierto | No existen pasarela ni estados de resultado. Se crea un pedido pendiente local. |
| E13 | Inventario | Simulado adecuadamente | Existencias, límites y agotado. Sin SIISA ni reservas reales. |
| E14 | Precio e impuestos | Parcialmente cubierto | Precios COP e indicación de IVA en detalle. No hay desglose fiscal ni fuente sincronizada. |
| E15 | Pedidos | Parcialmente cubierto | Creación, listado y detalle local. Sin transición real de estados, idempotencia o trazabilidad logística. |
| E16 | Perfil | Simulado adecuadamente | Edición de datos, contraseña y direcciones. Seguridad apta solamente para demostración. |
| E17 | Historial y recompra | Simulado adecuadamente | Historial, filtro por vehículo y recompra. Los estados posteriores no se alcanzan desde el flujo normal. |
| E18 | Envíos | Solo visual | ETA fija y costo estático. Sin cobertura, alternativas o integración logística. |
| E19 | Cambios y devoluciones | No cubierto | Solo se afirma “devolución 30 días”; no hay flujo ni reglas verificables. |
| E20 | Facturación | No cubierto | No se capturan datos fiscales ni comprador tercero. |
| E21 | Soporte | Solo visual | Tarjeta simulada sin canal funcional, contexto ni seguimiento. |
| E22 | WhatsApp | Solo visual | Enlace inactivo y sin transferencia de contexto. |
| E23 | Fidelización | Fuera del alcance actual | Implementada como simulación pese a estar ubicada en Fase 2; reglas contradictorias. |
| E28 | Recomendaciones | Fuera del alcance actual | Se muestran relacionados por categoría, pero la épica es Fase 2 y no hay criterio comercial. |
| E29 | Notificaciones | Solo visual | Aviso de disponibilidad cambia estado local; no se guarda ni envía. |
| E30–E31 | Seguridad y privacidad | No evaluable | No hay arquitectura productiva. Contraseñas y datos están en `localStorage`, aceptable únicamente como mock controlado. |
| E32 | CMS | No cubierto | Todos los textos y promociones están codificados. |
| E33 | Analítica | No cubierto | No hay eventos de búsqueda, compatibilidad, abandono, asesoría o conversión. |
| E34–E35 | SIISA e inventario | No cubierto | Existen estados simulados, pero no contratos, autenticación, mapeos o integración. |
| E36–E38 | Arquitectura, SSR y API | No evaluable | Next.js sirve el prototipo, pero no existe backend ni contrato de integración. El frontend final indicado en Notion es Angular. |
| E39 | Sistema de diseño | Parcialmente cubierto | Hay variables y patrones CSS. La estética diverge del lenguaje TORQUE documentado. |
| E40 | Errores y degradación | Parcialmente cubierto | Estado de servicio caído y reintento. Faltan errores por ruta y estados de carga. |
| E42 | Calidad de datos | No cubierto | Hay contradicciones internas en compatibilidad, promociones, conteos y reglas de envío. |
| E44 | Rendimiento | No evaluable | Catálogo muy pequeño y sin servicios reales; no permite medir comportamiento productivo. |
| E45 | Responsive | Parcialmente cubierto | Catálogo y navegación se adaptan; carrito/checkout desborda horizontalmente en móvil. |
| E46 | Accesibilidad | Parcialmente cubierto | Buen inicio con idioma, encabezados y etiquetas. Modales, foco, teclado y carrusel requieren trabajo. |
| E49–E50 | Legal y cookies | No cubierto | Enlaces del pie no llevan a contenidos y no existe gestión de consentimiento. |
| E54 | Asesor de repuestos | Solo visual | Aparece en estados puntuales, pero no recibe necesidad, contexto ni permite completar la asistencia. |
| E55 | Productos complementarios | No cubierto | No hay relaciones indispensables/recomendadas ni reglas por instalación. |
| E57–E58 | Funciones futuras y sistemas del vehículo | Fuera del alcance actual | La agrupación por sistemas aparece parcialmente en la taxonomía, sin modelo completo. |

No se recomienda calcular un porcentaje global de avance: varias épicas están vacías, otras son de producción y otras pertenecen expresamente a fases futuras. Un porcentaje único daría una precisión falsa.

## 4. Evaluación de los principales flujos

| Flujo | Resultado |
|---|---|
| Encontrar repuesto desde inicio | Parcial. La entrada es clara, pero el hero prioriza catálogo y promociones sobre búsqueda. |
| Buscar por nombre | Parcial. Funciona con términos simples; falla con frases naturales. |
| Buscar por referencia | Correcto para el conjunto simulado. |
| Corregir error tipográfico | Correcto para casos predefinidos. |
| Buscar por vehículo | Parcial. La consulta no interpreta bien combinaciones como repuesto + modelo. |
| Seleccionar vehículo por placa/VIN | Simulado adecuadamente. Cualquier valor válido termina en vehículos prefijados. |
| Seleccionar vehículo manualmente | Correcto para demostración. Permitir año y motor vacíos reduce la certeza. |
| Guardar varios vehículos | Correcto. |
| Determinar compatibilidad | No apto para validación de confianza mientras se ignore año y motor. |
| Filtrar compatibles | Funciona localmente, pero no persiste y depende del algoritmo defectuoso. |
| Revisar detalle de producto | Parcialmente apto. Falta evidencia suficiente de aplicación y relaciones correctas. |
| Añadir al carrito | Correcto para un vehículo. Riesgoso en carrito multivehículo. |
| Manejar cambio de precio/inventario | Existe un modal, pero la revalidación usa el mismo catálogo local y es difícil provocar el caso de forma realista. |
| Completar datos de compra | Parcial. No incluye envío real, facturación ni revisión final clara. |
| Pagar | No cubierto. |
| Consultar pedidos y recomprar | Bien simulado, aunque los pedidos no recorren estados posteriores. |

## 5. Diferencias entre Notion, prototipo y código

### 5.1 Requisitos todavía no representados

- Resultados compatibles priorizados.
- Compatibilidad por marca, modelo, año, motor y reglas de excepción.
- Asesoría humana con transferencia de contexto.
- Pago PayU y sus estados.
- Envío calculado por destino.
- Facturación y comprador diferente.
- Complementos indispensables.
- Cambios y devoluciones.
- Notificaciones reales.
- Analítica de validación.
- Legales y consentimiento.
- Contratos e integración SIISA.

### 5.2 Funcionalidades que existen, pero con simulación insuficiente

- Placa y VIN siempre resuelven vehículos prefijados.
- Compatibilidad da certeza con datos incompletos.
- Revalidación de carrito no consulta una fuente distinta.
- Confirmación de pedido no corresponde a confirmación de pago.
- Rastreo y estados logísticos no se alcanzan desde el recorrido normal.
- Aviso de disponibilidad no persiste.
- Soporte no permite iniciar una conversación.

### 5.3 Comportamientos añadidos sin respaldo claro o fuera de fase

- Programa de fidelización visible en el MVP.
- Descuento del 10 % con umbrales contradictorios.
- Recomendaciones genéricas como bloque comercial.
- Costo y umbral fijo de envío gratis.
- Promesas de devolución a 30 días.
- “Envío a todo Colombia” sin reglas de cobertura.
- Promociones con botones sin destino.

### 5.4 Contradicciones documentales

- Fidelización: Fase 2 en Notion, pero priorizada en la documentación local.
- Envío gratis: aparecen umbrales distintos.
- Pago: Notion plantea PayU; el prototipo plantea coordinación posterior.
- Frontend: el hub señala Angular como destino, mientras el prototipo está construido en Next.js. Esto puede ser correcto si Next.js es solo una herramienta descartable de validación, pero debe declararse.
- La E56 se usa como dependencia sin estar disponible en la base de épicas.

## 6. Calidad técnica

La estructura principal es comprensible: App Router, contextos globales y datos separados. Para un prototipo, el código permite iterar con rapidez.

Los principales riesgos técnicos son:

- Lógica de negocio repartida entre componentes y contextos.
- Dos implementaciones distintas de contexto de vehículo.
- Rutas heredadas que compiten con las actuales.
- Ausencia de una capa de repositorios o adaptadores que permita sustituir mocks por SIISA.
- Datos derivados manualmente y conteos codificados.
- Falta de pruebas para búsqueda, compatibilidad, carrito y cálculo de totales.
- Ausencia de un estado explícito de “compatibilidad desconocida”.
- Eliminación de una referencia del catálogo no genera discrepancia durante la revalidación.
- Contraseñas, pedidos y datos personales en `localStorage`; esto debe quedar claramente señalado como comportamiento exclusivo del prototipo.

Archivos centrales revisados:

- `app/data/products.ts`
- `app/context/VehicleContext.tsx`
- `app/context/CartContext.tsx`
- `app/context/UserContext.tsx`
- `app/carrito/page.tsx`
- `app/repuestos/[id]/page.tsx`
- `app/globals.css`

## 7. UX, responsive y accesibilidad

La navegación general resulta entendible y las pantallas tienen una jerarquía visual razonable. Los indicadores de compatible, no compatible y sin vehículo ayudan a comprender el estado.

Antes de una prueba formal se deberían corregir:

- El desbordamiento horizontal del carrito y checkout móvil.
- Los botones del carrusel sin acción.
- La vista de lista sin acción.
- Las miniaturas de galería que repiten la imagen y no cambian la vista.
- Los enlaces muertos en el pie.
- La falta de explicación del grado de certeza cuando no se conoce año o motor.
- Los conteos que aparentan un catálogo mucho mayor.
- El exceso de promociones frente a la tarea principal de encontrar el repuesto correcto.

En accesibilidad:

- Los modales no declaran `role="dialog"` ni `aria-modal`.
- No hay trampa ni restauración clara del foco.
- No se comprobó cierre por Escape.
- Varios botones de icono carecen de nombre accesible.
- El buscador no implementa navegación completa por teclado entre sugerencias.
- No hay estilos consistentes de `:focus-visible`.
- El carrusel automático no ofrece pausa y no respeta claramente `prefers-reduced-motion`.
- Algunos campos quitan el contorno nativo y dependen solo del cambio de borde.

## 8. Preguntas que deben resolverse con negocio y SIISA

1. ¿Qué campos determinan una compatibilidad exacta: marca, modelo, año, motor, versión, transmisión, tracción, VIN o alguna combinación?
2. ¿SIISA tiene identificadores estructurados de vehículos o solo descripciones libres?
3. ¿Cómo se expresan rangos, exclusiones y excepciones de aplicabilidad?
4. ¿Quién responde si el usuario compra un repuesto marcado erróneamente como compatible?
5. ¿Qué debe ocurrir cuando faltan año o motor: ocultar resultado, mostrar “posible” o remitir a asesor?
6. ¿Cuáles son las fuentes maestras de precio, impuesto, inventario e imágenes?
7. ¿SIISA permite consultar existencias en tiempo real y reservar durante el pago?
8. ¿Cuál es la política cuando una referencia desaparece después de agregarse al carrito?
9. ¿Qué representa exactamente el estado “pendiente” después de volver de PayU?
10. ¿Cuándo se crea el pedido: antes de ir a PayU, al aprobarse o al recibir el webhook?
11. ¿Cómo se evita duplicar pedidos o cobros por reintentos?
12. ¿Cuál es la regla real de envío gratis y quién calcula cobertura, costo y ETA?
13. ¿Se permite facturar a una persona o empresa distinta del comprador?
14. ¿Qué datos deben enviarse al asesor y durante cuánto tiempo pueden conservarse?
15. ¿El canal inicial será WhatsApp, chat, llamada o formulario?
16. ¿Cómo se modelan sustitutos, intercambiables y complementos indispensables?
17. ¿Qué estados de pedido se exponen al cliente y cuáles quedan internos?
18. ¿El programa de fidelización se retira del MVP o se formalizan ahora sus reglas?
19. ¿Next.js es exclusivamente un prototipo descartable antes de Angular?
20. ¿Dónde está documentada la E56 y qué dependencias introduce?

## 9. Plan recomendado para los siguientes bloques

### Bloque 1: estabilizar la demostración

- Corregir compatibilidad usando año y motor.
- Introducir el estado “información insuficiente”.
- Corregir consultas de varias palabras.
- Priorizar compatibles automáticamente.
- Arreglar el carrito multivehículo.
- Corregir el desbordamiento móvil.
- Retirar o etiquetar promociones y fidelización de Fase 2.
- Consolidar las rutas heredadas.
- Sustituir conteos irreales por valores derivados del mock.

### Bloque 2: completar la propuesta de asistencia

- Crear un formulario de asesoría usable.
- Transferir vehículo, consulta, producto y motivo.
- Simular elección de canal, horario y respuesta.
- Añadir retorno al flujo original.
- Registrar eventos de solicitud de ayuda.

### Bloque 3: representar correctamente checkout y pago

- Separar carrito, entrega, revisión, pago y resultado.
- Simular cobertura y alternativas de envío.
- Añadir datos de facturación.
- Crear resultados PayU: aprobado, rechazado, pendiente y cancelado.
- Simular webhook idempotente.
- Definir cuándo nace el pedido y cómo cambia de estado.

### Bloque 4: modelar datos para SIISA

- Definir contratos de producto, vehículo, aplicabilidad, precio e inventario.
- Separar mocks de los componentes mediante adaptadores.
- Modelar sustitutos y complementos.
- Documentar actualización, caché, errores y degradación.
- Resolver las preguntas de la guía de descubrimiento de SIISA.

### Bloque 5: endurecer calidad de la experiencia

- Corregir foco, teclado, modales y carrusel.
- Añadir estados de carga y límites de error.
- Revisar desde 320 px hasta escritorio.
- Añadir pruebas enfocadas en compatibilidad, búsqueda, carrito y totales.
- Instrumentar eventos mínimos para sesiones de validación.

## 10. Conclusión

El prototipo está **parcialmente listo** para validar navegación, catálogo, selección de vehículo, carrito, cuenta e historial. Todavía no está listo para validar de extremo a extremo la promesa central de “encontrar y comprar el repuesto correcto”.

Antes de presentarlo a usuarios, se deberían corregir como mínimo la compatibilidad por año y motor, la búsqueda combinada, el carrito multivehículo y el checkout móvil. También se debería representar de forma interactiva la asesoría y los estados de pago. De lo contrario, la sesión podría validar una experiencia visualmente convincente sobre reglas de negocio que aún son incorrectas o inexistentes.
