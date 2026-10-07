json..j# Revisión comparativa de la auditoría y estado actual del prototipo

**Fecha:** 28 de septiembre de 2026  
**Proyecto:** Nueva tienda virtual de repuestos  
**Código revisado:** `dd07225cd7d695946e87e6560409490fe00f31ca`  
**Prototipo:** `http://localhost:3000`

## 1. Conclusión ejecutiva

El texto atribuido a Claude y el archivo `AUDITORIA_PROTOTIPO.md` contienen exactamente las mismas 388 líneas y no presentan diferencias de contenido. Los hashes son distintos por su representación física —por ejemplo, codificación o finales de línea—, pero `Compare-Object` no encontró ninguna línea diferente. Por ello no son dos auditorías independientes que se corroboren entre sí: son el mismo informe.

Ese informe describía razonablemente el estado del 24 de septiembre, pero quedó parcialmente desactualizado después de los commits `8dd3263` y `dd07225`, que incorporaron más de dos mil líneas y retiraron código heredado. Además, la matriz original contiene errores de clasificación frente a Notion:

- E30 es SEO y E31 es migración de SEO/URLs; el informe las agrupó como seguridad y privacidad.
- E44 es Seguridad; el informe la presentó como Rendimiento.
- E45 es Rendimiento y escalabilidad; el informe la presentó como Responsive.
- E47 Observabilidad, E48 Auditoría y trazabilidad, E51 Testing, E52 CI/CD y E53 Feature flags no quedaron representadas claramente.

El prototipo actual ha mejorado de forma material. Ya es adecuado para demostrar búsqueda, compatibilidad con tres estados, selección de vehículo, carrito, asesoría simulada y complementos curados. Aún no está listo para validar una compra completa ni para servir como base productiva: no existen PayU, SIISA, facturación, logística por destino, analítica, contratos API ni backend real.

## 2. Fuentes consultadas

- [Hub del proyecto](https://app.notion.com/p/3c09daf513368171ab8bc1939a1ecb67)
- [Backlog de épicas](https://app.notion.com/p/9af76042414147af9ca71aef4677fe51)
- [Modelo conceptual de dominio](https://app.notion.com/p/3ca9daf51336818fa8f7f0202f3ab54f)
- [Decisiones pendientes](https://app.notion.com/p/3ca9daf513368122a7b3c6c9f1148fc2)
- [E07 · Compatibilidad](https://app.notion.com/p/3c09daf5133681eab44ef3a98fd91e26)
- [E10 · Carrito](https://app.notion.com/p/3c09daf5133681679a10c8d5aca8ab9f)
- [E18 · Envíos](https://app.notion.com/p/3c09daf5133681acbac6e99590816c6e)
- [E54 · Asesoría asistida](https://app.notion.com/p/3c59daf51336812b9c53d073dc0382f7)
- [E55 · Relaciones entre productos](https://app.notion.com/p/3c59daf5133681d9b90dc203b5ae089d)
- Código fuente actual, historial Git y prototipo ejecutándose en localhost.

El hub de Notion continúa ubicando el proyecto en **Fase 0: descubrimiento y fundamentos**. Su última edición visible es del 16 de septiembre de 2026. Las páginas detalladas consultadas fueron editadas por última vez entre el 25 y el 31 de agosto. En la base, todas las épicas siguen con estado **Sin empezar**.

Esto genera una ambigüedad documental: si el estado mide el producto real, Notion está desactualizado respecto al prototipo; si deliberadamente excluye prototipos, hace falta una propiedad separada como `Cobertura en prototipo` para no confundir demostración con implementación productiva.

## 3. Comparación de los hallazgos del 24 de septiembre

| Hallazgo anterior | Estado actual | Evidencia |
|---|---|---|
| Compatibilidad ignoraba año y motor | **Corregido en la función central** | `getCompatibilityDetail` evalúa marca, modelo, año y motor; devuelve `compatible`, `not_compatible` o `unknown`. |
| Rexton 2015 aparecía compatible con alternador 2018–2024 | **Corregido** | La ficha ahora informa “no compatible” y explica el rango 2018–2024. |
| Búsqueda `filtro Tivoli` devolvía cero resultados | **Corregido** | La ejecución actual devuelve cuatro filtros. La búsqueda tokeniza, elimina palabras vacías y prioriza vehículo. |
| Los compatibles no se priorizaban | **Corregido** | `sortByCompatibility` ordena compatibles, sin datos y no compatibles. |
| El filtro de compatibilidad no persistía | **Corregido** | Vive en `VehicleContext` y se conserva en `localStorage`. |
| Conteos del catálogo ficticios | **Corregido** | Los conteos se derivan de los productos visibles. |
| Vista de lista decorativa | **Corregido retirando la opción** | Ya no se promete una segunda vista que no exista. |
| Galería con miniaturas duplicadas | **Corregido retirando la simulación falsa** | La ficha muestra una imagen principal. |
| Carrito comparaba todo contra el vehículo activo | **Parcialmente corregido** | `getLineCompatibility` usa el vehículo asociado a la línea, pero el snapshot omite motor y una misma referencia no puede separarse por vehículo. |
| Referencia eliminada podía pasar la revalidación | **Corregido** | Una referencia ausente o descontinuada genera discrepancia y se retira al aceptar el ajuste. |
| Carrito/checkout tenía overflow móvil | **Corregido en la prueba actual** | A 390 px: `clientWidth = 375` y `scrollWidth = 375`. |
| Rutas `/listado` y `/producto/[id]` divergentes | **Corregido** | Las rutas y el contexto heredado fueron eliminados. |
| Asesoría era solo una tarjeta | **Mejorado a simulación funcional** | Hay texto libre, canal, contacto, horario, contexto seleccionable, origen, clasificación, persistencia y registro de demo. |
| Complementos E55 no existían | **Mejorado a simulación funcional** | Distingue necesario, reemplazo conjunto y recomendado; permite agregar varios y explica la ausencia de datos. |
| Modales sin semántica, Escape o foco | **Corregido en los modales revisados** | `useDialog` implementa foco, ciclo de Tab, Escape y restauración; los modales usan `role="dialog"` y `aria-modal`. |
| Envío gratis usaba $500.000 | **Corregido y etiquetado** | El mock usa los $100.000 documentados y marca la tarifa de $25.000 como ejemplo pendiente de D3. |
| Contactos del footer apuntaban a `#` | **Corregido para la demo** | Los tres abren el flujo simulado de asesoría. |
| Checkout no representa PayU | **Sin cambio** | Confirmar pedido crea un pedido local y anuncia coordinación posterior del pago. |
| Fidelización contradice el alcance | **Sin cambio** | E23 sigue en Fase 2, pero fidelización continúa integrada en cuenta y checkout. |
| Promoción 10 % desde $2 millones contradice la lógica | **Sin cambio** | La lógica mantiene un umbral de $5 millones. |
| Sin integraciones, analítica ni backend | **Sin cambio** | Todo sigue en archivos estáticos y `localStorage`. |
| Sin pruebas automatizadas | **Sin cambio** | No se encontraron archivos de prueba ni un script de test. |
| Sin carga visible inicial | **Sin cambio** | `VehicleProvider` continúa retornando `null` mientras lee `localStorage`. |

## 4. Hallazgos actuales

### 4.1 Altos

#### A. La lista de aplicabilidad contradice el resultado de compatibilidad

En la ficha del alternador, el encabezado dice correctamente que no es compatible con el Rexton 2015 porque aplica desde 2018. Sin embargo, la fila “KGM Rexton 2018–2024” lleva la insignia **Tu vehículo**.

La causa está en `app/repuestos/[id]/page.tsx`: el resaltado de la lista solo compara marca y modelo, sin año ni motor. Esto vuelve a mezclar aplicabilidad con compatibilidad, justo la distinción central del modelo conceptual de Notion.

#### B. Un producto con compatibilidad `unknown` se agrega sin advertencia

E10 exige que, si el estado es “sin datos”, al agregar el producto se indique que debe verificarse. Tanto `ProductCard` como la ficha solo abren confirmación para `not_compatible`; `unknown` entra directamente al carrito.

El estado sí se muestra antes de agregar, pero falta una confirmación o aviso específico en el momento de la acción.

#### C. El vehículo almacenado en la línea del carrito pierde el motor

Las altas desde `ProductCard`, la ficha y complementos guardan marca, modelo y año, pero no `engine`. Mientras el mismo vehículo está activo, `getLineCompatibility` recupera el motor desde el contexto. Después de cambiar de vehículo, la línea anterior se evalúa con el snapshot incompleto y un repuesto dependiente del motor puede pasar de compatible a desconocido.

#### D. Una misma referencia para dos vehículos se fusiona en una sola línea

`CartContext.addToCart` busca una línea existente únicamente por `product.id`. Si el mismo repuesto se agrega para dos vehículos, suma las cantidades y reemplaza la asociación de vehículo con la última selección. El carrito deja de representar para cuál vehículo corresponde cada cantidad.

Notion no define expresamente cómo agrupar este caso, pero el prototipo ya ofrece garaje multivehículo y muestra asociación por línea; por tanto, el comportamiento actual es inconsistente con su propia UI.

#### E. Pago, facturación y logística siguen sin poder validarse

Persisten los vacíos más importantes del recorrido transaccional:

- Sin PayU ni resultados aprobado, rechazado, pendiente o cancelado.
- Sin simulación de webhook o idempotencia.
- Sin captura de datos fiscales ni comprador diferente.
- Sin cobertura u opciones de envío por dirección.
- ETA fija de tres a cinco días.
- Total presentado como definitivo usando una tarifa plana de ejemplo.

El prototipo permite validar el formulario, pero no la finalización de compra descrita por E11, E12, E18 y E20.

#### F. El alcance de fidelización continúa contradiciendo Notion

E23 está en Fase 2 y Notion advierte no distraer el MVP. El prototipo mantiene programa, estado, descuentos y mensajes dentro del checkout. También persiste la contradicción entre la promoción de $2.000.000 y el umbral lógico de $5.000.000.

### 4.2 Medios

#### G. Mensaje engañoso en resultados de búsqueda

La búsqueda dice “Mostrando resultados compatibles con KGM Rexton” aunque el filtro “Solo compatibles” está apagado y el contador indica cero compatibles. En realidad se muestran todos, ordenados por compatibilidad.

El texto debería decir “Compatibilidad evaluada para…” o, si el filtro está activo, “Mostrando solo compatibles con…”.

#### H. La aplicabilidad todavía no está visible en las tarjetas

El modelo conceptual exige mostrar siempre para qué vehículos sirve una pieza, incluso sin vehículo activo. Las tarjetas muestran “Verificar compatibilidad”, pero no una síntesis de aplicabilidad. La información completa está en la ficha.

#### I. E54 está bien simulada, pero no cierra su última historia

El flujo actual cubre buena parte de HU-E54-01 a HU-E54-04 y registra origen y tipo para HU-E54-05. Aún faltan:

- Transferencia a un canal real.
- Enlace enviado por el asesor hacia producto o carrito.
- Relación entre solicitud y compra posterior.
- Medición consolidada fuera del navegador.
- Horario real validado con Posventa.

La clasificación actual por origen es útil, pero `empty_search = fricción` y `footer = asesoría` son reglas provisionales que pueden clasificar mal la intención real.

#### J. E55 está bien representada visualmente, pero el dato sigue sin solución operativa

El frontend cumple gran parte de HU-E55-01 a HU-E55-04 con unos pocos productos curados. HU-E55-05 continúa sin cubrir: no existe dueño, administración, revisión, cobertura del catálogo ni integración con SIISA.

El prototipo lo comunica correctamente con “Información de ejemplo · por validar con Posventa”, lo que evita presentar el mock como dato definitivo.

#### K. Accesibilidad mejoró, pero sigue incompleta

Se corrigieron los modales. Permanecen:

- Carrusel automático sin botón de pausa.
- Sin adaptación visible a `prefers-reduced-motion`.
- Sin estilos globales claros de `:focus-visible`.
- Sugerencias de búsqueda sin navegación completa por flechas y `aria-activedescendant`.
- Controles del carrusel actualizados dentro de una región `aria-live`, lo que puede anunciar cambios automáticos innecesariamente.

#### L. La disciplina técnica no tiene controles automatizados

- TypeScript pasa.
- La compilación de producción pasa.
- `npm run lint` falla porque Next.js 16 ya no admite `next lint` de esa forma.
- No hay pruebas automatizadas.
- No hay CI visible.

Las funciones de búsqueda, compatibilidad, revalidación y totales ya tienen suficiente lógica para justificar pruebas unitarias.

#### M. SEO y analítica están muy por debajo de la prioridad documental

Hay metadatos globales, pero no se encontraron metadatos por producto, sitemap, robots, datos estructurados ni mapa de redirecciones. Tampoco hay analítica de búsquedas, abandonos, solicitudes de asesoría o conversiones. En Notion, E30, E31 y E33 son críticas.

## 5. Alineación actual con Notion

| Épica | Estado del prototipo actual | Evaluación |
|---|---|---|
| E04 Búsqueda | Tokenización, corrección, referencia, vehículo y sugerencias | **Simulada adecuadamente**, con mensajes por ajustar |
| E07 Compatibilidad | Marca, modelo, año, motor, tres estados, priorización y filtro persistente | **Parcialmente cubierta** por contradicciones de UI y snapshot |
| E10 Carrito | Persistencia, cantidades, stock, advertencia incompatible, revalidación | **Parcialmente cubierta**; falta aviso `unknown` y agrupación multivehículo consistente |
| E11 Checkout | Datos personales, cuenta y dirección | **Parcialmente cubierta** |
| E12 PayU | Sin representación | **No cubierta** |
| E18 Envíos | Umbral, progreso, tarifa y advertencia simulados | **Simulada parcialmente**; sin opciones por dirección |
| E20 Facturación | Sin datos fiscales | **No cubierta** |
| E21/E54 Asesoría | Flujo simulado con contexto, canal, horario y registro | **Simulada adecuadamente**, sin handoff real ni atribución de compra |
| E23 Fidelización | Implementada localmente | **Fuera del alcance MVP documentado** |
| E30/E31 SEO | Solo metadata global | **No cubierta a nivel de épica** |
| E33 Analítica | Registro local de asesoría únicamente | **No cubierta** |
| E34/E35/E38 SIISA/BFF/API | Sin integración ni contrato | **No cubierta** |
| E39 Sistema de diseño | CSS amplio y componentes reutilizados parcialmente | **Parcialmente cubierta** |
| E40 Degradación | Simulación de catálogo caído y vacíos útiles | **Parcialmente cubierta** |
| E42 Calidad de datos | Mock más consistente y estados explícitos | **Parcialmente cubierta**; no existe proceso de datos |
| E44 Seguridad | Autenticación local y contraseñas en texto en `localStorage` | **No evaluable como solución productiva** |
| E45 Rendimiento | Build estático parcial; catálogo mínimo | **No evaluable de forma representativa** |
| E46 Accesibilidad | Modales mejorados; pendientes de teclado y movimiento | **Parcialmente cubierta** |
| E47/E48 Observabilidad y trazabilidad | Consola y datos locales | **No cubiertas** |
| E49/E50 Legal y consentimiento | Sin contenido ni consentimiento | **No cubiertas** |
| E51 Testing | Sin suite ni script funcional | **No cubierta** |
| E52 CI/CD | Sin evidencia en el proyecto revisado | **No cubierta** |
| E53 Feature flags | Solo interruptor local de demo | **Solo visual**, no es gestión de configuración real |
| E55 Complementos | Relaciones curadas, tipos, razones y agregado múltiple | **Simulada adecuadamente en frontend**, operación de datos no cubierta |

## 6. Verificaciones técnicas realizadas

### Correctas

- `node node_modules/typescript/bin/tsc --noEmit --incremental false`: correcto.
- `npm run build`: correcto fuera del sandbox; compiló, verificó TypeScript y generó ocho rutas.
- Consulta `filtro Tivoli`: cuatro resultados.
- Rexton 2015 contra alternador 2018–2024: resultado principal no compatible.
- Diálogo de asesoría: abre con contexto, recibe foco, cierra con Escape y devuelve el foco al botón.
- Carrito móvil a 390 px: sin desbordamiento horizontal.
- Árbol Git: estaba limpio después de las verificaciones y antes de crear este reporte.

### Incorrectas o ausentes

- `npm run lint`: falla porque el script `next lint` no es válido con la versión actual.
- No hay pruebas automatizadas.
- No hay configuración visible de CI.

## 7. Recomendaciones priorizadas

### Antes de la próxima demostración

1. Corregir la insignia “Tu vehículo” para considerar año y motor.
2. Añadir confirmación específica al agregar productos con compatibilidad desconocida.
3. Incluir `engine` en el snapshot del carrito.
4. Definir si el carrito separa líneas por `producto + vehículo`; aplicar esa clave de forma consistente.
5. Corregir el texto “Mostrando resultados compatibles” cuando solo se están priorizando.
6. Retirar fidelización de la ruta principal o marcarla como experimento de Fase 2 con una regla única.

### Para validar el recorrido completo

7. Simular los cuatro resultados de PayU y el retorno seguro al pedido.
8. Añadir un paso de revisión antes de crear el pedido.
9. Simular cobertura, opción de envío, costo y ETA según dirección.
10. Añadir datos de facturación y el escenario comprador distinto del facturado.
11. Relacionar una solicitud de asesoría con una compra posterior dentro de la demo.

### Para alinear proyecto y documentación

12. Agregar en Notion una propiedad `Cobertura en prototipo` separada de `Estado`.
13. Mantener E54 y E55 como posibles/parciales hasta validar canal, Posventa y fuente de datos.
14. Resolver D3 o conservar de forma explícita el rótulo de valores de ejemplo.
15. Corregir la documentación funcional local para que fidelización no contradiga la fase definida.

### Para calidad técnica

16. Reemplazar `next lint` por una invocación compatible de ESLint.
17. Añadir pruebas de búsqueda, compatibilidad, carrito multivehículo, revalidación y totales.
18. Añadir metadata por producto, sitemap y estrategia de redirecciones antes de tratar SEO como cubierto.
19. Añadir eventos de búsqueda, compatibilidad, ayuda y conversión para poder validar el rediseño.

## 8. Dictamen actualizado

El prototipo actual es sensiblemente mejor que el descrito en la auditoría del 24 de septiembre. Puede usarse para una demostración controlada de descubrimiento, búsqueda, compatibilidad, asesoría y complementos, siempre que se explique que SIISA, los canales y los datos son simulados.

No debe usarse todavía para validar una compra de extremo a extremo. Los mayores vacíos siguen en pago, facturación, logística y datos reales. Antes de una prueba de confianza sobre compatibilidad deben corregirse la insignia contradictoria de aplicabilidad, la adición silenciosa de estados desconocidos y la pérdida del motor en el carrito.
