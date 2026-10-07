# Diagramas de flujo — tienda virtual de repuestos KGM

**Actualizado:** 30 de septiembre de 2026  
**Base técnica:** prototipo Next.js actual, incluido el árbol de trabajo sin confirmar  
**Base funcional:** backlog, modelo conceptual, decisiones pendientes y épicas detalladas de Notion

## Cómo leer los diagramas

- **Verde — funcional:** comportamiento navegable en el prototipo actual.
- **Naranja — simulado:** existe para validar la experiencia, pero usa datos locales o reglas de ejemplo.
- **Rojo — pendiente:** comportamiento exigido o esperado que todavía no está representado.
- **Azul — decisión:** bifurcación o regla de negocio.

El vehículo se trata como un **lente opcional**: sin vehículo se puede explorar todo; con vehículo se prioriza y señaliza, sin ocultar automáticamente lo demás.

## 1. Mapa general de entrada y navegación

**Épicas:** E01, E03, E04, E06, E08, E21, E54.

```mermaid
flowchart TD
    A[Entrada a la tienda] --> B[Home]
    B --> C{¿Qué quiere hacer?}
    C -->|Sabe qué busca| D[Buscar por nombre o referencia]
    C -->|Quiere explorar| E[Catálogo y categorías]
    C -->|Conoce su vehículo| F[Identificar o activar vehículo]
    C -->|No sabe qué pieza necesita| G[Solicitar asesoría]

    D --> H[Resultados de búsqueda]
    E --> I[Listado filtrable]
    F --> J[Vehículo activo como lente]
    J --> H
    J --> I
    G --> K[Formulario de asesoría con contexto]

    H --> L[Ficha de producto]
    I --> L
    L --> M[Compatibilidad, stock y complementos]
    M --> N[Agregar al carrito]
    N --> O[Carrito y checkout]

    class B,D,E,F,H,I,J,L,M,N,O functional;
    class G,K simulated;
    class C decision;

    classDef functional fill:#dcfce7,stroke:#15803d,color:#14532d;
    classDef simulated fill:#ffedd5,stroke:#c2410c,color:#7c2d12;
    classDef pending fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d;
    classDef decision fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a;
```

## 2. Selección y gestión del vehículo

**Épicas:** E07 y E08.  
**Estado actual:** placa y VIN son simulados; selección manual y garaje funcionan con `localStorage`.

```mermaid
flowchart TD
    A[Usuario abre selector] --> B{Método}
    B -->|Placa| C[Ingresar placa]
    B -->|VIN| D[Ingresar VIN]
    B -->|Manual| E[Marca, modelo, año y motor]

    C --> F[Consulta simulada]
    D --> F
    F --> G{¿Formato válido?}
    G -->|No| E
    G -->|Sí| H[Mostrar vehículo encontrado]
    H --> I{¿Confirmar?}
    I -->|No| B
    I -->|Sí| J[Guardar en garaje]
    E --> K{¿Motor confirmado?}
    K -->|Sí| J
    K -->|No estoy seguro| L[Guardar como aproximado]
    L --> J

    J --> M[Activar vehículo]
    M --> N[Persistir garaje y vehículo activo]
    N --> O[Volver a la pantalla anterior]
    O --> P[Recalcular señalización y orden]

    class A,B,E,G,H,I,J,K,M,N,O,P functional;
    class C,D,F,L simulated;
    class B,G,I,K decision;

    classDef functional fill:#dcfce7,stroke:#15803d,color:#14532d;
    classDef simulated fill:#ffedd5,stroke:#c2410c,color:#7c2d12;
    classDef pending fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d;
    classDef decision fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a;
```

## 3. Búsqueda y descubrimiento

**Épicas:** E04, E05, E07, E40 y E54.  
**Estado actual:** búsqueda tokenizada, corrección tipográfica, sugerencias y priorización por compatibilidad funcionan sobre el catálogo local.

```mermaid
flowchart TD
    A[Usuario escribe consulta] --> B[Sugerencias en vivo]
    B --> C[Enviar búsqueda]
    C --> D[Normalizar y dividir en palabras]
    D --> E[Separar términos de pieza, vehículo y año]
    E --> F[Buscar y asignar relevancia]
    F --> G{¿Hay resultados?}

    G -->|Sí| H{¿Hay vehículo activo?}
    H -->|No| I[Mostrar todos por relevancia]
    H -->|Sí| J[Evaluar compatibilidad]
    J --> K[Priorizar compatibles, luego sin datos]
    K --> L{¿Filtro solo compatibles activo?}
    L -->|No| M[Mostrar todos señalizados]
    L -->|Sí| N[Mostrar solo compatibles confirmados]

    G -->|No| O{¿Hay corrección posible?}
    O -->|Sí| P[Proponer término corregido]
    P --> Q[Mostrar resultados corregidos]
    O -->|No| R[Estado sin resultados]
    R --> S[Explorar categorías]
    R --> T[Solicitar asesoría con consulta y vehículo]

    C --> U{¿Catálogo disponible?}
    U -->|No| V[Estado degradado y reintento]
    V --> T

    class A,B,C,D,E,F,H,I,J,K,L,M,N,O,P,Q,R,S functional;
    class T,V simulated;
    class G,H,L,O,U decision;

    classDef functional fill:#dcfce7,stroke:#15803d,color:#14532d;
    classDef simulated fill:#ffedd5,stroke:#c2410c,color:#7c2d12;
    classDef pending fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d;
    classDef decision fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a;
```

> **Diferencia pendiente:** en algunos resultados el texto afirma “Mostrando resultados compatibles” aunque el sistema solo los está priorizando y el filtro exclusivo está apagado.

## 4. Evaluación de compatibilidad

**Épicas:** E06, E07 y E42.  
**Regla documental:** aplicabilidad es un dato del producto; compatibilidad es una evaluación contra el vehículo activo.

```mermaid
flowchart TD
    A[Abrir producto o tarjeta] --> B{¿Hay vehículo activo?}
    B -->|No| C[Mostrar aplicabilidad del producto]
    C --> D[Invitar a identificar vehículo sin bloquear compra]

    B -->|Sí| E{¿Hay datos de aplicabilidad?}
    E -->|No| F[Estado sin datos]
    E -->|Sí| G{¿Coinciden marca y modelo?}
    G -->|No| H[No compatible]
    G -->|Sí| I{¿Año dentro del rango?}
    I -->|No| H
    I -->|Sí| J{¿La aplicación exige motor?}
    J -->|No| K[Compatible]
    J -->|Sí| L{¿Motor confirmado?}
    L -->|No| F
    L -->|Sí y coincide| K
    L -->|Sí y no coincide| H

    K --> M[Priorizar y señalizar en verde]
    H --> N[Mostrar motivo y alternativas]
    F --> O[Explicar que debe verificarse]
    N --> P[Permitir compra con confirmación]
    O --> Q[Objetivo: advertir al agregar]
    O --> R[Consultar con asesor]

    class A,B,C,D,E,G,I,J,L,K,M,H,N,P,F,O functional;
    class R simulated;
    class Q pending;
    class B,E,G,I,J,L decision;

    classDef functional fill:#dcfce7,stroke:#15803d,color:#14532d;
    classDef simulated fill:#ffedd5,stroke:#c2410c,color:#7c2d12;
    classDef pending fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d;
    classDef decision fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a;
```

> **Brechas actuales:** el estado `unknown` se agrega al carrito sin una confirmación específica; la lista de aplicaciones puede marcar “Tu vehículo” comparando solo marca y modelo, aunque el año no coincida.

## 5. Ficha de producto y decisión de compra

**Épicas:** E06, E07, E10, E13, E14, E29 y E55.

```mermaid
flowchart TD
    A[Ficha de producto] --> B[Ver precio, IVA, stock y especificaciones]
    B --> C[Ver compatibilidad o aplicabilidad]
    C --> D[Ver complementos de instalación]
    D --> E{¿Producto disponible?}

    E -->|Agotado| F[Aviso de disponibilidad local]
    F --> G[Pendiente: persistir y notificar realmente]

    E -->|Disponible| H[Elegir cantidad]
    H --> I{Estado de compatibilidad}
    I -->|Compatible o sin vehículo| J[Agregar al carrito]
    I -->|No compatible| K[Mostrar advertencia]
    K --> L{¿Continuar conscientemente?}
    L -->|No| M[Conservar ficha]
    L -->|Sí| J
    I -->|Sin datos| N[Actual: agregar directamente]
    N --> O[Objetivo: advertir o consultar]

    J --> P[Guardar producto y vehículo asociado]
    P --> Q[Abrir o continuar compra]

    class A,B,C,D,E,H,I,J,K,L,M,P,Q functional;
    class F,N simulated;
    class G,O pending;
    class E,I,L decision;

    classDef functional fill:#dcfce7,stroke:#15803d,color:#14532d;
    classDef simulated fill:#ffedd5,stroke:#c2410c,color:#7c2d12;
    classDef pending fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d;
    classDef decision fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a;
```

## 6. Complementos necesarios para la instalación

**Épica:** E55.  
**Estado actual:** mock curado de algunas relaciones; no existe fuente operativa ni dueño del dato.

```mermaid
flowchart TD
    A[Abrir ficha] --> B{¿Hay relaciones cargadas?}
    B -->|No| C[No afirmar que no hace falta nada]
    C --> D{¿Instalación compleja?}
    D -->|Sí| E[Ofrecer asesoría]
    D -->|No| F[Continuar con producto principal]

    B -->|Sí| G[Resolver productos relacionados]
    G --> H{¿Hay vehículo activo?}
    H -->|Sí| I[Ocultar complementos no compatibles]
    H -->|No| J[Mostrar relaciones sin evaluación contextual]
    I --> K[Separar por tipo]
    J --> K

    K --> L[Necesario para instalar]
    K --> M[Se reemplaza junto]
    K --> N[Recomendado]
    L --> O[Explicar por qué se necesita]
    M --> O
    N --> O
    O --> P[Mostrar stock y enlace a ficha]
    P --> Q[Seleccionar disponibles]
    Q --> R[Agregar seleccionados al carrito]

    R --> S[Pendiente: administrar relaciones y medir cobertura]

    class A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R functional;
    class E simulated;
    class S pending;
    class B,D,H decision;

    classDef functional fill:#dcfce7,stroke:#15803d,color:#14532d;
    classDef simulated fill:#ffedd5,stroke:#c2410c,color:#7c2d12;
    classDef pending fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d;
    classDef decision fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a;
```

## 7. Asesoría asistida y transferencia de contexto

**Épicas:** E21, E22 y E54.  
**Estado actual:** flujo local funcional para demostración; no envía la solicitud a un canal externo.

```mermaid
flowchart TD
    A{Punto de entrada} -->|Home| B[No sé qué repuesto necesito]
    A -->|Búsqueda vacía| C[No encontré resultados]
    A -->|Ficha| D[Duda de compatibilidad o complementos]
    A -->|Servicio caído| E[Necesito ayuda ahora]
    A -->|Footer| F[Elegir llamada, WhatsApp o correo]

    B --> G[Abrir formulario]
    C --> G
    D --> G
    E --> G
    F --> G

    G --> H[Describir problema con texto libre]
    H --> I[Elegir qué contexto compartir]
    I --> J[Vehículo, búsqueda, producto y carrito]
    J --> K[Confirmar canal y contacto]
    K --> L{¿Dentro del horario de ejemplo?}
    L -->|Sí| M[Prometer respuesta breve]
    L -->|No| N[Indicar próximo horario]
    M --> O[Guardar solicitud en localStorage]
    N --> O
    O --> P[Clasificar fricción o asesoría]
    P --> Q[Mostrar registro interno de demo]
    Q --> R[Volver al flujo conservando vehículo y carrito]

    O --> S[Pendiente: entregar a canal real]
    S --> T[Pendiente: asesor envía producto o carrito]
    T --> U[Pendiente: relacionar solicitud con compra]

    class A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R functional;
    class O,P,Q simulated;
    class S,T,U pending;
    class A,L decision;

    classDef functional fill:#dcfce7,stroke:#15803d,color:#14532d;
    classDef simulated fill:#ffedd5,stroke:#c2410c,color:#7c2d12;
    classDef pending fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d;
    classDef decision fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a;
```

## 8. Carrito y checkout actual

**Épicas:** E10, E11, E15 y E18.  
**Estado actual:** pedido local pendiente; no existe pago electrónico.

```mermaid
flowchart TD
    A[Producto agregado] --> B[Carrito persistente local]
    B --> C[Ver líneas, cantidades y compatibilidad]
    C --> D[Modificar o eliminar]
    D --> E[Calcular subtotal]
    E --> F[Aplicar regla de envío de ejemplo]
    F --> G[Mostrar cuánto falta para envío gratis]
    G --> H[Iniciar checkout]

    H --> I[Revalidar precio, stock y referencias]
    I --> J{¿Hay cambios?}
    J -->|Sí| K[Mostrar modal de discrepancias]
    K --> L{¿Actualizar carrito?}
    L -->|No| C
    L -->|Sí| M[Aplicar cambios]
    M --> H
    J -->|No| N{¿Usuario autenticado?}

    N -->|No| O[Registrar o iniciar sesión]
    N -->|Sí| P[Usar cuenta actual]
    O --> Q[Ingresar o elegir dirección]
    P --> Q
    Q --> R[Mostrar ETA y tarifa plana de ejemplo]
    R --> S[Confirmar pedido]
    S --> T[Crear pedido local pendiente]
    T --> U[Vaciar carrito]
    U --> V[Página de confirmación]
    V --> W[Mensaje: contacto posterior para coordinar pago]

    class A,B,C,D,E,G,H,I,J,K,L,M,N,O,P,Q,S,T,U,V functional;
    class F,R,W simulated;
    class J,L,N decision;

    classDef functional fill:#dcfce7,stroke:#15803d,color:#14532d;
    classDef simulated fill:#ffedd5,stroke:#c2410c,color:#7c2d12;
    classDef pending fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d;
    classDef decision fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a;
```

> **Brecha multivehículo:** el carrito asocia un vehículo a la línea, pero una misma referencia añadida para dos vehículos se fusiona por `product.id`; además, algunos snapshots no conservan el motor.

## 9. Checkout objetivo documentado

**Épicas:** E11, E12, E14, E15, E18, E20, E29, E34, E35, E38 y E44.  
**Este flujo no está implementado; representa la dirección funcional que debe validarse con SIISA, PayU, Contabilidad y Logística.**

```mermaid
flowchart TD
    A[Carrito revalidado] --> B[Identidad del comprador]
    B --> C[Dirección de entrega]
    C --> D[Consultar cobertura, costo y ETA]
    D --> E{¿Hay cobertura?}
    E -->|No| F[Explicar y ofrecer alternativa]
    E -->|Sí| G[Elegir opción de envío]
    G --> H[Datos de facturación]
    H --> I{¿Comprador y facturado son distintos?}
    I -->|Sí| J[Capturar tercero o empresa]
    I -->|No| K[Usar datos del comprador]
    J --> L[Revisión final]
    K --> L

    L --> M[Crear intento de pago seguro]
    M --> N[Redirigir a PayU]
    N --> O{Resultado de retorno}
    O -->|Aprobado| P[Esperar y validar webhook]
    O -->|Rechazado| Q[Mostrar motivo recuperable]
    O -->|Pendiente| R[Mostrar estado pendiente]
    O -->|Cancelado| S[Conservar carrito y permitir reintento]

    P --> T{¿Evento ya procesado?}
    T -->|Sí| U[No duplicar pedido ni cobro]
    T -->|No| V[Registrar pago]
    V --> W[Crear o confirmar pedido en SIISA]
    W --> X[Emitir factura]
    X --> Y[Notificar confirmación]
    Y --> Z[Mostrar pedido y seguimiento]

    R --> AA[Actualizar al recibir webhook]
    AA --> T

    class A,B,C,G,H,I,J,K,L decision;
    class D,F,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA pending;

    classDef functional fill:#dcfce7,stroke:#15803d,color:#14532d;
    classDef simulated fill:#ffedd5,stroke:#c2410c,color:#7c2d12;
    classDef pending fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d;
    classDef decision fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a;
```

## 10. Estado degradado del catálogo

**Épicas:** E21, E40 y E54.

```mermaid
flowchart TD
    A[Usuario solicita catálogo, búsqueda o ficha] --> B{¿Inventario disponible?}
    B -->|Sí| C[Mostrar contenido normal]
    B -->|No| D[Mostrar mensaje contextual]
    D --> E[Permitir reintento]
    D --> F[Volver al inicio]
    D --> G[Solicitar asesoría]
    G --> H[Adjuntar origen: servicio caído]
    H --> I[Guardar solicitud simulada]
    I --> J[Pendiente: enviar al canal real]

    class A,B,C,D,E,F,G,H functional;
    class I simulated;
    class J pending;
    class B decision;

    classDef functional fill:#dcfce7,stroke:#15803d,color:#14532d;
    classDef simulated fill:#ffedd5,stroke:#c2410c,color:#7c2d12;
    classDef pending fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d;
    classDef decision fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a;
```

## 11. Dependencias externas del flujo completo

```mermaid
flowchart LR
    UI[Frontend de tienda] --> BFF[Capa BFF y caché]
    BFF --> SIISA[SIISA]
    BFF --> PAYU[PayU]
    BFF --> SHIP[Transportadora]
    BFF --> MSG[Correo, WhatsApp o notificaciones]
    BFF --> ANALYTICS[Analítica]

    SIISA --> P[Productos y categorías]
    SIISA --> V[Vehículos y aplicabilidad]
    SIISA --> PR[Precios e impuestos]
    SIISA --> ST[Inventario]
    SIISA --> OR[Pedidos y clientes]

    UI -. Prototipo actual .-> MOCK[Datos estáticos y localStorage]

    class UI,MOCK simulated;
    class BFF,SIISA,PAYU,SHIP,MSG,ANALYTICS,P,V,PR,ST,OR pending;

    classDef functional fill:#dcfce7,stroke:#15803d,color:#14532d;
    classDef simulated fill:#ffedd5,stroke:#c2410c,color:#7c2d12;
    classDef pending fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d;
    classDef decision fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a;
```

## Fuentes de Notion

- [Inicio del proyecto](https://app.notion.com/p/3c09daf513368171ab8bc1939a1ecb67)
- [Backlog de épicas](https://app.notion.com/p/9af76042414147af9ca71aef4677fe51)
- [Modelo conceptual de dominio](https://app.notion.com/p/3ca9daf51336818fa8f7f0202f3ab54f)
- [Decisiones pendientes](https://app.notion.com/p/3ca9daf513368122a7b3c6c9f1148fc2)
- [E07 · Compatibilidad](https://app.notion.com/p/3c09daf5133681eab44ef3a98fd91e26)
- [E10 · Carrito](https://app.notion.com/p/3c09daf5133681679a10c8d5aca8ab9f)
- [E18 · Envíos](https://app.notion.com/p/3c09daf5133681acbac6e99590816c6e)
- [E54 · Asesoría asistida](https://app.notion.com/p/3c59daf51336812b9c53d073dc0382f7)
- [E55 · Relaciones entre productos](https://app.notion.com/p/3c59daf5133681d9b90dc203b5ae089d)

## Nota de alcance

Notion mantiene estas épicas como **Sin empezar** porque el proyecto sigue registrado en Fase 0. Los nodos verdes de este documento indican cobertura navegable en el **prototipo**, no implementación productiva ni cierre de la épica.
