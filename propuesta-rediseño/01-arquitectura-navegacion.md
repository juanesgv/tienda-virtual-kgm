# Propuesta de Rediseño - Tienda KGM Repuestos
## Nueva Arquitectura de Navegación

---

## 🎯 Principio Fundamental

**ANTES (Actual):** Vehículo → Repuestos compatibles
**DESPUÉS (Propuesta):** Repuestos → Filtrar por compatibilidad

La identificación del vehículo pasa de ser **obligatoria** a **opcional pero recomendada**.

---

## 🗺️ Mapa de Navegación Propuesto

```
┌─────────────────────────────────────────────────────────────┐
│                         INICIO                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Buscar     │  │  Categorías  │  │  Mi Vehículo     │  │
│  │   repuestos  │  │   populares  │  │  (opcional)      │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    LISTADO DE REPUESTOS                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Filtros disponibles:                                 │  │
│  │  • Categoría │ Subcategoría │ Marca │ Precio          │  │
│  │  • Compatibilidad con mi vehículo (si está guardado)  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  [Card de producto]                                   │  │
│  │  • Imagen + Nombre + Precio                          │  │
│  │  • Badge: "Compatible con tu vehículo" (si aplica)   │  │
│  │  • Badge: "Ver compatibilidad" (si no hay vehículo)  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  DETALLE DE PRODUCTO                        │
│  ┌──────────────────┐  ┌──────────────────────────────┐  │
│  │                  │  │  • Nombre + Referencia         │  │
│  │   Imagen         │  │  • Precio + Stock            │  │
│  │   del            │  │  • Descripción               │  │
│  │   repuesto       │  │  • AGREGAR AL CARRO          │  │
│  │                  │  │                              │  │
│  └──────────────────┘  │  ┌──────────────────────────┐  │  │
│                        │  │  COMPATIBILIDAD          │  │  │
│                        │  │  "Este repuesto es        │  │  │
│                        │  │   compatible con:"        │  │  │
│                        │  │  • [Tu vehículo guardado]  │  │  │
│                        │  │  • O buscar compatibilidad │  │  │
│                        │  └──────────────────────────┘  │  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Cambios Clave en la Experiencia

### 1. **Acceso Inmediato a Productos**
- El usuario puede ver el catálogo completo desde el inicio
- No hay "pared" de autenticación de vehículo

### 2. **Búsqueda por Vehículo - Opcional pero Visible**
- Siempre disponible en el header (como un selector de tienda/ubicación)
- Guarda el vehículo en sesión/localStorage
- Una vez guardado, muestra badges de compatibilidad en todos lados

### 3. **Filtros de Compatibilidad**
- Si el usuario tiene vehículo guardado: "Mostrar solo compatibles"
- Si no: puede buscar compatibilidad desde el producto

### 4. **Página de Producto Informativa**
- Muestra TODOS los vehículos compatibles
- El usuario puede verificar si aplica para su caso

---

## 📱 Componentes UI Nuevos

### Selector de Vehículo (Header)
```
┌────────────────────────────────────────┐
│  [Logo]  [Nav]  [🔍]  [🚗 Mi vehículo] [🛒] │
│                    └───────────────────┘  │
│                    "Guardar vehículo para  │
│                     ver compatibilidad"    │
└────────────────────────────────────────┘
```

### Badge de Compatibilidad (Cards de producto)
```
┌─────────────────────┐
│  [Imagen]           │
│  Filtro de Aire     │
│  $85.000            │
│  ┌────────────────┐ │
│  │ ✅ Compatible  │ │
│  │    con tu KGM  │ │
│  │    Tivoli 2023 │ │
│  └────────────────┘ │
└─────────────────────┘
```

### Widget de Compatibilidad (Página de producto)
```
┌─────────────────────────────────────┐
│  COMPATIBILIDAD                     │
│  ─────────────────────────────────  │
│  Este repuesto es compatible con:   │
│                                     │
│  ✅ KGM Tivoli (2015-2024)          │
│  ✅ KGM Tivoli XLV (2016-2024)      │
│  ✅ SsangYong Tivoli (2015-2022)    │
│                                     │
│  [Verificar con mi vehículo]        │
└─────────────────────────────────────┘
```

---

## 🔄 Flujos de Usuario

### Flujo A: Usuario sin vehículo guardado
1. Entra a la tienda
2. Ve catálogo completo
3. Navega por categorías o busca
4. Ve producto → ve lista de vehículos compatibles
5. Opcional: guarda su vehículo para futuras visitas

### Flujo B: Usuario con vehículo guardado
1. Entra a la tienda
2. Ve catálogo con badges de compatibilidad
3. Puede filtrar "solo compatibles con mi vehículo"
4. Cada producto muestra si es compatible
5. Compra con confianza de que el repuesto sirve

### Flujo C: Usuario que busca por vehículo primero
1. Usa el selector de vehículo en header
2. Ingresa placa/VIN/línea
3. Sistema guarda el vehículo
4. Redirige a catálogo filtrado por compatibilidad
5. Puede quitar filtro para ver todo

---

## ✅ Ventajas del Nuevo Enfoque

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Descubrimiento** | Limitado | Abierto, browse-friendly |
| **SEO** | Pobre (páginas dinámicas) | Mejor (URLs estáticas de productos) |
| **UX** | Friction alta | Friction baja |
| **Confianza** | Forzada | Ganada con información |
| **Conversiones** | Solo usuarios identificados | Todos los usuarios |

---

## 🎨 Paleta de Colores Sugerida

Basada en la marca KGM:
- **Primario:** Rojo KGM (#E30613) o el color corporativo actual
- **Secundario:** Gris oscuro (#1A1A1A)
- **Acento:** Verde de compatibilidad (#00C853)
- **Fondo:** Blanco/Gris claro
- **Texto:** Negro/Gris oscuro

---

## 📁 Archivos de la Propuesta

1. `01-arquitectura-navegacion.md` - Este documento
2. `index-nuevo.html` - Página de inicio rediseñada
3. `listado-nuevo.html` - Página de listado con filtros
4. `producto-nuevo.html` - Página de detalle de producto
5. `styles-nuevo.css` - Estilos de la propuesta

---

*Propuesta generada para rediseño Tienda KGM Repuestos*
