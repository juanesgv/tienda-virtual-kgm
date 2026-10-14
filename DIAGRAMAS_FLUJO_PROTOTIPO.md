# Flujos del prototipo KGM Repuestos

> Estado de la rama `claude-notion` al 13 de octubre de 2026. Solo lo que hoy está construido, tal como se comporta en pantalla. Cada ficha cuenta un recorrido corto, de arriba hacia abajo. No incluye lo que Notion define y todavía no existe.

**Cómo leerlos.** Trazo continuo: funciona de verdad en el navegador (la lógica y el guardado son reales). Trazo punteado: simulado, sin integración (SIISA, RUNT, PayU, correo, canal de asesoría). Hay una versión navegable en `diagramas-flujo.html`.

## 1. Mapa de pantallas

_Navegación_

El camino principal de una compra, de la portada al pedido.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef end1 stroke:#1a9d68,stroke-width:3px;
    H["Inicio"] --> C["Catálogo"]
    H --> S["Búsqueda"]
    H --> F["Ficha de producto"]
    C --> F
    S --> F
    F --> K["Carrito"]
    K --> P["Pedido confirmado"]:::end1
    P --> A["Mi cuenta"]
    A -->|"volver a pedir"| K
```

- **Dónde se guarda todo.** Vehículo, garaje, carrito, cuentas y pedidos viven en el navegador (`localStorage`). No hay servidor: cambiar de navegador o limpiar datos los borra.

## 2. Lo que está siempre a mano

_Navegación_

Siete accesos de la cabecera y el pie, disponibles en cualquier pantalla.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 24, "rankSpacing": 34}}}%%
flowchart TD
    classDef client fill:#5b4fa3,stroke:#5b4fa3,color:#ffffff;
    classDef sim stroke-dasharray: 5 4,stroke:#d08a1f,stroke-width:2px;
    subgraph CAB["Cabecera"]
        direction TB
        a1["Chip de vehículo"]:::client --> b1["Ventana: vehículo y garaje"]
        a2["Icono de carrito"]:::client --> b2["Panel lateral del carrito"]
        a3["Buscador"]:::client --> b3["Resultados de búsqueda"]
        a4["Icono de cuenta"]:::client --> b4["Mi cuenta"]
    end
    subgraph PIE["Pie de página"]
        direction TB
        c1["Pedir un asesor"]:::client --> d1["Ventana: asesor"]:::sim
        c2["Demo: registro"]:::client --> d2["Registro de solicitudes"]:::sim
        c3["Demo: simular fallo"]:::client --> d3["Catálogo caído"]:::sim
    end
```


## 3. Identificar mi vehículo

_E01 · E08 - Placa y VIN simulados_

Se digita o se elige, sin fotos. La placa viene primero.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef client fill:#5b4fa3,stroke:#5b4fa3,color:#ffffff;
    classDef end1 stroke:#1a9d68,stroke-width:3px;
    classDef sim stroke-dasharray: 5 4,stroke:#d08a1f,stroke-width:2px;
    A["Quiere ver repuestos<br/>para su vehículo"]:::client --> B{"¿Cómo lo identifica?"}
    B -->|"Placa"| P["Escribe la placa<br/>6 caracteres"]:::client
    B -->|"VIN"| V["Escribe el VIN<br/>17 caracteres"]:::client
    B -->|"Modelo"| M["Elige marca,<br/>modelo y año"]:::client
    P --> R["Muestra un vehículo<br/>de ejemplo"]:::sim
    V --> R
    R --> C{"¿Es el suyo?"}
    C -->|"Sí"| G["Lo guarda en el garaje<br/>y lo deja activo"]:::end1
    C -->|"No"| M
    M --> G
```

- **Dónde empieza.** En el panel de la portada o en el chip de la cabecera. La ventana de la cabecera suma una pestaña "por línea", el motor opcional y Mi garaje.
- **Si el dato no sirve.** Una placa de menos de 6 caracteres o un VIN de menos de 17 muestra un error y deja elegir otro método.
- **Simulado.** Cualquier placa o VIN válido en largo devuelve el mismo vehículo de ejemplo. No hay consulta a RUNT ni a SIISA.

## 4. Con un vehículo activo

_E07 · E08_

Qué cambia en la tienda y cómo se cambia o se quita.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef client fill:#5b4fa3,stroke:#5b4fa3,color:#ffffff;
    classDef end1 stroke:#1a9d68,stroke-width:3px;
    G["Vehículo activo"]:::end1 --> A["Chip en la cabecera"]
    G --> B["Etiqueta de compatibilidad en<br/>tarjetas, ficha y carrito"]
    G --> C["Aparece el filtro<br/>solo compatibles"]
    A --> D{"¿Qué hace el cliente?"}
    D -->|"Cambiar"| E["Abre la ventana y<br/>elige otro del garaje"]:::client
    D -->|"Quitar"| F["Sigue en el garaje<br/>y se apaga el filtro"]:::client
```

- **Sin vehículo la tienda no se bloquea.** Se ve todo el catálogo; solo desaparecen las etiquetas de compatibilidad.

## 5. Buscar un repuesto

_E04 · E05_

Desde el buscador de la cabecera, con ejemplos, sugerencias y corrección de tipeo.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef client fill:#5b4fa3,stroke:#5b4fa3,color:#ffffff;
    classDef end1 stroke:#1a9d68,stroke-width:3px;
    A["Hace clic en el buscador"]:::client --> B["Ve ejemplos que rotan:<br/>Disco de freno Tivoli"]
    B --> C["Escribe"]:::client
    C --> D["Sugerencias en vivo"]
    D -->|"Elige una"| F["Ficha o categoría"]:::end1
    C -->|"Presiona Enter"| R{"¿Hay resultados?"}
    R -->|"Sí"| L["Lista con compatibilidad,<br/>filtros y orden"]:::end1
    R -->|"Con corrección"| K["Muestra el término corregido<br/>y deja buscar el original"]
    K --> L
    R -->|"No"| N["Ver el flujo siguiente"]
```

- **Con el catálogo caído** las sugerencias se apagan (último flujo).

## 6. Cuando no hay resultados

_E04 · E13 - Asesor simulado_

La búsqueda no termina en un callejón: ofrece salidas y deja constancia de lo que faltó.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef client fill:#5b4fa3,stroke:#5b4fa3,color:#ffffff;
    classDef sim stroke-dasharray: 5 4,stroke:#d08a1f,stroke-width:2px;
    A["Búsqueda sin resultados"] --> B["Sugiere un término<br/>más general y categorías"]
    A --> C["Registra el término,<br/>sin pedir datos personales"]
    B --> D["Explora una categoría"]:::client
    B --> E["Lo conseguimos por ti:<br/>pide a un asesor"]:::sim
    X["Hay resultados, pero el filtro<br/>de compatibles los oculta"] --> Y["Aviso y botón para<br/>verlos todos"]
```

- **Demanda sin identidad.** Cada búsqueda sin resultados guarda término, fecha y vehículo activo. Se consulta agrupada en la pantalla de demo del registro.

## 7. Explorar el catálogo

_E02 · E03 · E05_

Por categoría o completo, con filtros combinables y 8 productos por página.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef client fill:#5b4fa3,stroke:#5b4fa3,color:#ffffff;
    classDef end1 stroke:#1a9d68,stroke-width:3px;
    A["Entra al catálogo"]:::client --> B["Elige categoría,<br/>todos o solo compatibles"]:::client
    B --> C["Afina con filtros:<br/>subcategoría, precio"]:::client
    C --> D["Ordena por relevancia,<br/>precio o nombre"]:::client
    D --> E{"¿Quedan productos?"}
    E -->|"Sí"| F["Lista de 8 por página,<br/>filtros activos visibles"]:::end1
    E -->|"No"| G["Dice qué filtro quitar"]
    F --> H["Abre la ficha o<br/>agrega al carrito"]:::client
```

- **Relevancia.** Con vehículo activo, lo compatible va primero. Lo no compatible se señala, no se oculta.
- **En el celular** los filtros se abren en una capa a pantalla completa.

## 8. Cómo se decide la compatibilidad

_E07 · E10_

Tres resultados posibles. Sin vehículo activo no hay resultado, pero para qué vehículos sirve el repuesto siempre se ve.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef ok fill:#0f7a4d,stroke:#0f7a4d,color:#ffffff;
    classDef no fill:#b3261e,stroke:#b3261e,color:#ffffff;
    classDef unk fill:#8a5300,stroke:#8a5300,color:#ffffff;
    A{"¿Hay vehículo activo?"} -->|"No"| X["Sin estado.<br/>Solo se ve para qué<br/>vehículos sirve"]
    A -->|"Sí"| B{"¿El repuesto tiene<br/>datos de aplicación?"}
    B -->|"No"| U["SIN CONFIRMAR"]:::unk
    B -->|"Sí"| C{"¿Coinciden modelo<br/>y año?"}
    C -->|"No"| N["NO COMPATIBLE"]:::no
    C -->|"Sí"| D{"¿Pide un motor?"}
    D -->|"No"| OK["COMPATIBLE"]:::ok
    D -->|"Sí"| E{"¿El vehículo tiene<br/>ese motor?"}
    E -->|"Sí, igual"| OK
    E -->|"Sí, distinto"| N
    E -->|"No lo indicó"| U
```

- **Dónde se ve.** Etiqueta con icono y texto en cada tarjeta; banner con el motivo en la ficha; fila marcada como tu vehículo en la tabla; estado por línea en el carrito, según el vehículo con que se agregó.
- **Sin confirmar nunca es rechazo.** El repuesto puede servir y solo falta el dato. Se ofrece verificarlo con un asesor.

## 9. Ficha de producto: qué se ve

_E06 · E07 - Asesor simulado_

El banner cambia según la compatibilidad; lo demás aparece siempre.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef client fill:#5b4fa3,stroke:#5b4fa3,color:#ffffff;
    classDef sim stroke-dasharray: 5 4,stroke:#d08a1f,stroke-width:2px;
    A["Abre la ficha"]:::client --> B{"¿Descontinuada?"}
    B -->|"Sí"| B1["Avisa que ya no se vende<br/>y muestra alternativas"]
    B -->|"No"| C{"¿Qué dice el banner?"}
    C -->|"Sin vehículo"| C1["Invita a elegirlo"]
    C -->|"Compatible"| C2["Lo confirma<br/>con el vehículo"]
    C -->|"Sin confirmar"| C3["Explica el motivo y<br/>ofrece un asesor"]:::sim
    C -->|"No compatible"| C4["Explica el motivo y<br/>muestra alternativas"]
    C1 --> D["Debajo, siempre: aplicación en<br/>una frase, tabla filtrable,<br/>entrega estimada"]
    C2 --> D
    C3 --> D
    C4 --> D
```

- **Pendiente de Notion.** La política de garantía y devoluciones está por definir (E19): la ficha lo dice en vez de afirmar plazos.

## 10. Ficha de producto: agregar

_E06 · E10 · E13 · E55 - Aviso y complementos simulados_

Del stock a la advertencia de compatibilidad, hasta el carrito.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef client fill:#5b4fa3,stroke:#5b4fa3,color:#ffffff;
    classDef end1 stroke:#1a9d68,stroke-width:3px;
    classDef sim stroke-dasharray: 5 4,stroke:#d08a1f,stroke-width:2px;
    A{"¿Hay stock?"} -->|"Agotado"| B["Sin compra.<br/>Avísame: pide iniciar sesión"]:::sim
    A -->|"Sí"| C["Elige la cantidad<br/>máximo el stock"]:::client
    C --> D{"¿Es no compatible?"}
    D -->|"No"| G["Agrega al carrito,<br/>anotando el vehículo"]:::end1
    D -->|"Sí"| E["Ventana de advertencia"]
    E -->|"Agregar igual"| G
    E -->|"Cancelar"| F["No agrega nada"]
    G --> H["Ofrece complementos<br/>necesarios y recomendados"]:::sim
```

- **Sin confirmar no frena.** Solo "no compatible" pide confirmación antes de agregar; "sin confirmar" se agrega sin advertencia propia.
- **Simulado.** El aviso de disponibilidad no envía correo y los complementos son un maestro de ejemplo para pocos productos.

## 11. Compra: del carrito a los datos

_E10 · E11 · E18 - Valores de ejemplo_

Lo que se ve y se completa antes de confirmar.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef client fill:#5b4fa3,stroke:#5b4fa3,color:#ffffff;
    classDef sim stroke-dasharray: 5 4,stroke:#d08a1f,stroke-width:2px;
    A["Abre el carrito"]:::client --> B["Ve cada línea con cantidad<br/>y compatibilidad"]
    B --> C["Resumen: subtotal, envío y<br/>cuánto falta para envío gratis"]:::sim
    C --> D["Entrega estimada y<br/>qué pasa después"]:::sim
    D --> E["Completa los datos de envío"]:::client
    E --> F{"¿Tiene sesión?"}
    F -->|"No"| G["Crea cuenta o inicia sesión<br/>en el mismo formulario"]:::client
    F -->|"Sí"| H["Elige una dirección<br/>guardada o escribe otra"]:::client
    G --> H
    H --> I["Confirmar pedido"]:::client
```

- **Valores de ejemplo.** Envío gratis desde $100.000, tarifa plana y entrega de 3 a 5 días hábiles son decisiones abiertas (D3, E18).

## 12. Compra: confirmar el pedido

_E11 · E15 · E17 - Sin pasarela de pago_

Antes de crear el pedido se revisa que nada haya cambiado. No se cobra: el cliente es contactado para coordinar el pago.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef client fill:#5b4fa3,stroke:#5b4fa3,color:#ffffff;
    classDef end1 stroke:#1a9d68,stroke-width:3px;
    classDef sim stroke-dasharray: 5 4,stroke:#d08a1f,stroke-width:2px;
    A["Confirmar pedido"]:::client --> B{"¿Algo cambió en<br/>el catálogo?"}
    B -->|"No"| D["Crea el pedido<br/>y vacía el carrito"]
    D --> E["Página de confirmación"]:::end1
    B -->|"Sí"| F["Ventana: qué cambió<br/>agotado, descontinuado,<br/>menos stock o precio"]
    F -->|"Actualizar mi pedido"| G["Aplica los ajustes<br/>sin cobrar nada"]:::client
    G --> A
    F -->|"Revisar mi carrito"| H["Vuelve al carrito"]:::client
    E --> I["Número, resumen,<br/>entrega estimada y<br/>qué pasa después"]
    E --> J["Seguimiento del pedido"]:::sim
```

- **Lo real.** La revisión antes de confirmar, la cuenta creada en el checkout, las direcciones guardadas y el vehículo anotado en cada línea del pedido.

## 13. Entrar a mi cuenta

_E09 - Recuperación simulada_

Iniciar sesión, crear la cuenta o recuperar la contraseña.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef client fill:#5b4fa3,stroke:#5b4fa3,color:#ffffff;
    classDef end1 stroke:#1a9d68,stroke-width:3px;
    classDef sim stroke-dasharray: 5 4,stroke:#d08a1f,stroke-width:2px;
    A["Entra a Mi cuenta"]:::client --> B{"¿Tiene sesión?"}
    B -->|"Sí"| M["Menú de la cuenta"]:::end1
    B -->|"No"| C{"¿Qué necesita?"}
    C -->|"Iniciar sesión"| M
    C -->|"Crear cuenta"| D["Errores por campo; si el<br/>correo existe, ofrece iniciar sesión"]
    D --> M
    C -->|"Olvidé la contraseña"| E["Código simulado y<br/>contraseña nueva"]:::sim
    E --> M
```

- **Contraseñas.** Se guardan en el navegador sin cifrar: es un prototipo, no un modelo de seguridad.

## 14. Dentro de mi cuenta

_E16 · E17_

Seis secciones; la de pedidos permite volver a pedir.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 26, "rankSpacing": 38}}}%%
flowchart TD
    classDef end1 stroke:#1a9d68,stroke-width:3px;
    classDef sim stroke-dasharray: 5 4,stroke:#d08a1f,stroke-width:2px;
    M["Menú de la cuenta"]:::end1 --> A["Resumen"]
    M --> B["Mis pedidos"]
    M --> C["Datos personales"]
    M --> D["Direcciones"]
    M --> E["Mi garaje"]
    M --> F["Métodos de pago"]:::sim
    B --> B1["Filtra por vehículo<br/>y abre el detalle"]
    B1 --> B2["Volver a pedir:<br/>agrega con precio y stock de hoy"]
    C --> C1["Edita nombre y teléfono;<br/>cambia la contraseña<br/>con la actual"]
    D --> D1["Agrega, edita, elimina<br/>y marca la predeterminada"]
    F --> F1["Solo estado vacío"]:::sim
```

- **Volver a pedir.** Reintenta cada línea contra el catálogo de hoy y avisa qué no se pudo agregar y por qué.

## 15. Pedir ayuda a un asesor

_E54 · E21 · E22 - Simulado por completo_

El mismo formulario desde siete puntos, con el contexto de donde nació la solicitud.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef client fill:#5b4fa3,stroke:#5b4fa3,color:#ffffff;
    classDef end1 stroke:#1a9d68,stroke-width:3px;
    classDef sim stroke-dasharray: 5 4,stroke:#d08a1f,stroke-width:2px;
    A["Pide ayuda desde<br/>uno de siete puntos"]:::client --> B["Se abre el formulario"]:::sim
    B --> C["Elige qué compartir:<br/>vehículo, búsqueda,<br/>producto, carrito"]:::client
    C --> D["Escribe qué necesita<br/>y elige el canal"]:::client
    D --> E["Ve el horario<br/>de ejemplo"]:::sim
    E --> F{"¿Contacto válido?"}
    F -->|"No"| D
    F -->|"Sí"| G["Se envía y se clasifica:<br/>fricción o asesoría"]:::sim
    G --> H["Confirmación con número"]:::sim
    H --> I["Vuelve a lo que<br/>estaba haciendo"]:::end1
    H --> J["Queda en el<br/>registro de demo"]:::sim
```

- **Los siete puntos.** Inicio, pie de página, búsqueda sin resultados, catálogo caído, duda de compatibilidad, repuesto sin alternativas y duda de complementos.
- **Fricción o asesoría.** Fricción es no encontrar algo o que algo falle; asesoría es necesitar criterio experto.
- **Sin canal real.** No hay bandeja, horario real ni mensaje enviado: la solicitud solo queda guardada en el navegador.

## 16. Cuando el catálogo no responde

_E02 - Interruptor de demo_

El pie de página trae un interruptor para mostrar este escenario.

```mermaid
%%{init: {"themeVariables": {"fontSize": "15px"}, "flowchart": {"nodeSpacing": 30, "rankSpacing": 38}}}%%
flowchart TD
    classDef client fill:#5b4fa3,stroke:#5b4fa3,color:#ffffff;
    classDef end1 stroke:#1a9d68,stroke-width:3px;
    classDef sim stroke-dasharray: 5 4,stroke:#d08a1f,stroke-width:2px;
    A["Activa el interruptor<br/>del pie de página"]:::sim --> B{"¿En qué pantalla está?"}
    B -->|"Inicio"| C["Los destacados muestran un<br/>mensaje; el resto sigue igual"]
    B -->|"Buscador"| E["Sin sugerencias"]
    B -->|"Catálogo, búsqueda o ficha"| D["Aviso: no pudimos<br/>completar la operación"]
    D --> F["Reintentar<br/>recarga la página"]:::client
    D --> G["Pedir un asesor"]:::sim
    D --> J["Ir al inicio"]:::client
    F --> H{"¿Sigue la falla?"}
    H -->|"Sí"| D
    H -->|"No"| I["Vuelve el contenido"]:::end1
```

- **Origen.** La épica E40 no tiene historias escritas en Notion; este comportamiento se apoya en HU-E02-04 (saber que el catálogo no está disponible).

---

**Fuera de este mapa, a propósito:** pago real (PayU), conexión con SIISA, correos, back-office, política de garantía y devoluciones (E19), fidelización (E23), promociones y reseñas. No existen en el prototipo.

Donde difiera de las historias de usuario o del modelo conceptual de Notion, esos documentos mandan.
