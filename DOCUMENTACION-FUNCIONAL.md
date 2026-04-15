# Documentacion Funcional
## Tienda Virtual de Repuestos KGM

## 1. Proposito

Este documento define los requerimientos funcionales, historias de usuario y criterios de aceptacion de la Tienda Virtual de Repuestos KGM.

Su objetivo es servir como base para:

- desarrollo del producto,
- presentacion funcional a cliente,
- referencia de alcance para futuras integraciones.

## 2. Alcance funcional del proyecto

El proyecto corresponde a una tienda e-commerce de repuestos automotrices para KGM/SsangYong con las siguientes capacidades funcionales:

- exploracion de catalogo de repuestos,
- navegacion por categorias,
- busqueda global,
- filtro por compatibilidad con vehiculo,
- detalle de producto,
- carrito de compras,
- checkout con datos de envio,
- cuenta de usuario,
- historial de pedidos,
- programa de fidelizacion con descuento en compra futura.

## 3. Consideraciones funcionales y tecnicas

- El sistema debe contemplar autenticacion y persistencia de informacion de usuario.
- El sistema debe gestionar sesion, carrito, vehiculo y pedidos asociados al usuario.
- El modulo de metodos de pago y la gestion avanzada de perfil/direcciones pueden evolucionar hacia integraciones transaccionales o backend dedicado.

## 4. Modulos funcionales

### 4.1 Catalogo y navegacion

#### Requerimientos funcionales

- `RF-001` El sistema debe permitir al usuario ingresar a la tienda y visualizar una pagina de inicio con acceso al catalogo.
- `RF-002` El sistema debe mostrar categorias de repuestos para facilitar la navegacion.
- `RF-003` El sistema debe permitir navegar al listado general de repuestos.
- `RF-004` El sistema debe mostrar productos destacados en la pagina principal.

#### Historias de usuario

**HU-001**

Como comprador, quiero ingresar a la tienda y ver un acceso claro al catalogo, para comenzar rapidamente mi busqueda de repuestos.

Criterios de aceptacion:

- Se muestra una pagina de inicio con llamada principal a ver repuestos.
- El usuario puede navegar al listado general desde la portada.
- El usuario visualiza secciones de apoyo como categorias y productos destacados.

**HU-002**

Como comprador, quiero explorar repuestos por categoria, para encontrar mas rapido el tipo de pieza que necesito.

Criterios de aceptacion:

- Se muestran categorias visibles desde el home y/o la navegacion principal.
- Cada categoria redirige al listado filtrado correspondiente.
- El listado refleja la categoria seleccionada.

Prioridad: Alta

### 4.2 Busqueda, filtros y compatibilidad

#### Requerimientos funcionales

- `RF-005` El sistema debe permitir buscar repuestos por nombre, referencia o texto relacionado.
- `RF-006` El sistema debe permitir filtrar productos por categoria.
- `RF-007` El sistema debe permitir asociar un vehiculo a la sesion del usuario.
- `RF-008` El sistema debe identificar si un producto es compatible con el vehiculo guardado.
- `RF-009` El sistema debe permitir mostrar solo productos compatibles con el vehiculo del usuario.

#### Historias de usuario

**HU-003**

Como comprador, quiero buscar repuestos por nombre o referencia, para encontrar un producto especifico sin recorrer todo el catalogo.

Criterios de aceptacion:

- Existe un buscador global accesible desde la cabecera.
- El sistema redirige a una pagina de resultados.
- Los resultados muestran coincidencias relevantes del catalogo.

**HU-004**

Como comprador, quiero guardar mi vehiculo, para saber si los repuestos aplican a mi referencia.

Criterios de aceptacion:

- El usuario puede registrar marca, modelo y anio del vehiculo.
- El vehiculo queda persistido para visitas posteriores.
- El sistema usa ese vehiculo para informar compatibilidad en cards y detalle.

**HU-005**

Como comprador, quiero filtrar el catalogo para ver solo repuestos compatibles con mi vehiculo, para reducir errores al comprar.

Criterios de aceptacion:

- El filtro solo aparece cuando existe un vehiculo guardado.
- Al activarlo, el listado muestra solo productos compatibles.
- El sistema informa cuantos productos compatibles existen.

Prioridad: Alta

### 4.3 Detalle de producto

#### Requerimientos funcionales

- `RF-010` El sistema debe mostrar la ficha detallada de cada repuesto.
- `RF-011` El sistema debe mostrar informacion de compatibilidad en la pagina del producto.
- `RF-012` El sistema debe permitir agregar productos al carrito desde la vista de detalle.
- `RF-013` El sistema debe mostrar productos relacionados.

#### Historias de usuario

**HU-006**

Como comprador, quiero ver el detalle completo de un repuesto, para validar informacion antes de agregarlo al carrito.

Criterios de aceptacion:

- Se muestra nombre, referencia, precio, stock y descripcion.
- Se muestran especificaciones tecnicas del producto.
- El usuario puede definir cantidad y agregar el producto al carrito.

**HU-007**

Como comprador, quiero verificar la compatibilidad del producto con mi vehiculo, para comprar con mayor seguridad.

Criterios de aceptacion:

- Si existe vehiculo guardado, el sistema informa si el repuesto es compatible o no.
- Se muestra una lista de vehiculos compatibles con el producto.
- El usuario puede cambiar su vehiculo para volver a validar compatibilidad.

Prioridad: Alta

### 4.4 Carrito y checkout

#### Requerimientos funcionales

- `RF-014` El sistema debe permitir agregar, quitar y actualizar cantidades en el carrito.
- `RF-015` El sistema debe mostrar subtotal, costo de envio y total del pedido.
- `RF-016` El sistema debe mostrar una promocion de envio gratis por umbral de compra.
- `RF-017` El sistema debe solicitar datos de envio al momento de confirmar la compra.
- `RF-018` El sistema debe crear un pedido y asociarlo a una cuenta de usuario al finalizar el checkout.

#### Historias de usuario

**HU-008**

Como comprador, quiero administrar los productos del carrito, para controlar que voy a comprar antes de pagar.

Criterios de aceptacion:

- El usuario puede cambiar la cantidad de cada item.
- El usuario puede eliminar productos del carrito.
- El usuario puede vaciar el carrito completo.
- El sistema recalcula subtotales y total en cada cambio.

**HU-009**

Como comprador, quiero ver un resumen del pedido antes de confirmarlo, para entender claramente cuanto voy a pagar.

Criterios de aceptacion:

- Se muestra subtotal.
- Se muestra valor del envio o estado de envio gratis.
- Se muestra el total final a pagar.
- Si aplica un descuento de fidelizacion, este se refleja en el resumen.

**HU-010**

Como comprador, quiero completar mis datos de envio en el checkout, para registrar correctamente mi pedido.

Criterios de aceptacion:

- El formulario solicita nombre, correo, telefono, direccion, ciudad y departamento.
- El formulario permite notas adicionales.
- El pedido no puede confirmarse sin los datos obligatorios.

Prioridad: Alta

### 4.5 Cuenta de usuario y autenticacion

#### Requerimientos funcionales

- `RF-019` El sistema debe permitir crear una cuenta de usuario.
- `RF-020` El sistema debe permitir iniciar y cerrar sesion.
- `RF-021` El sistema debe mostrar un dashboard de cuenta para el usuario autenticado.
- `RF-022` El sistema debe mostrar secciones de cuenta como resumen, pedidos, datos personales, direcciones y metodos de pago.
- `RF-023` El sistema debe persistir el usuario autenticado durante la sesion del navegador.

#### Historias de usuario

**HU-011**

Como visitante, quiero crear una cuenta, para guardar mis pedidos y acceder a beneficios futuros.

Criterios de aceptacion:

- El usuario puede registrar nombre, correo, telefono y contrasena.
- El sistema valida que no exista otra cuenta con el mismo correo.
- Tras registrarse, el usuario queda autenticado.

**HU-012**

Como usuario registrado, quiero iniciar sesion, para acceder a la informacion de mi cuenta.

Criterios de aceptacion:

- El usuario puede ingresar correo y contrasena.
- El sistema valida las credenciales.
- Si las credenciales son incorrectas, se muestra un mensaje de error.

**HU-013**

Como usuario autenticado, quiero ver un dashboard de bienvenida, para consultar rapidamente el estado de mi cuenta.

Criterios de aceptacion:

- Se muestra un saludo al usuario.
- Se muestra un resumen general de pedidos, progreso y acumulados.
- La cuenta presenta navegacion interna por secciones.

Prioridad: Alta

### 4.6 Historial de pedidos

#### Requerimientos funcionales

- `RF-024` El sistema debe almacenar pedidos por usuario autenticado.
- `RF-025` El sistema debe permitir visualizar el historial de pedidos del usuario.
- `RF-026` Cada pedido debe mostrar fecha, estado, total y detalle de productos.
- `RF-027` El sistema debe mostrar primero los pedidos mas recientes.

#### Historias de usuario

**HU-014**

Como usuario registrado, quiero ver una lista de mis pedidos, para llevar control de mis compras anteriores.

Criterios de aceptacion:

- Se muestra el numero total de pedidos registrados.
- Los pedidos se listan en orden descendente de creacion.
- Cada pedido presenta identificador, fecha, estado y total.

**HU-015**

Como usuario registrado, quiero expandir el detalle de un pedido, para revisar exactamente que productos compré.

Criterios de aceptacion:

- Cada pedido permite ver un detalle expandible.
- El detalle incluye subtotal, envio y descuento.
- El detalle lista nombre del producto, referencia, cantidad y precio.

Prioridad: Alta

### 4.7 Datos personales y direcciones

#### Requerimientos funcionales

- `RF-028` El sistema debe mostrar los datos basicos del usuario autenticado.
- `RF-029` El sistema debe mostrar direcciones derivadas de pedidos previos.
- `RF-030` El sistema debe presentar una seccion visual para futuras integraciones de metodos de pago.

#### Historias de usuario

**HU-016**

Como usuario autenticado, quiero ver mis datos personales, para confirmar la informacion asociada a mi cuenta.

Criterios de aceptacion:

- Se muestran nombre, correo, telefono y fecha de registro.
- Si falta informacion, el sistema lo indica de manera clara.

**HU-017**

Como usuario autenticado, quiero ver las direcciones usadas en mis pedidos, para reutilizarlas como referencia en futuras compras.

Criterios de aceptacion:

- La seccion de direcciones muestra direccion, ciudad, departamento y telefono.
- El sistema evita duplicar direcciones identicas.
- Si no existen direcciones, se muestra estado vacio.

**HU-018**

Como usuario autenticado, quiero ver una seccion de metodos de pago, para entender que el sistema contempla esa capacidad.

Criterios de aceptacion:

- Existe una seccion diferenciada para metodos de pago.
- Si no hay medios guardados, se muestra un mensaje de estado vacio.
- La seccion queda preparada para futura integracion.

Prioridad: Media

### 4.8 Fidelizacion y beneficios

#### Requerimientos funcionales

- `RF-031` El sistema debe calcular y almacenar el total acumulado de compras por usuario.
- `RF-032` El sistema debe calcular el avance del usuario hacia un umbral de beneficio.
- `RF-033` El sistema debe habilitar un beneficio cuando el usuario supera el umbral de compras.
- `RF-034` El beneficio debe consistir en un 10 por ciento de descuento en la siguiente compra.
- `RF-035` El descuento debe aplicarse una sola vez.
- `RF-036` El sistema debe mostrar el estado del beneficio y cuanto falta para alcanzarlo.
- `RF-037` El sistema debe evitar recalcular todo el historico en cada consulta y conservar acumulados actualizados.

#### Historias de usuario

**HU-019**

Como usuario registrado, quiero ver cuanto he acumulado en compras, para conocer mi avance dentro del programa de beneficios.

Criterios de aceptacion:

- El sistema muestra el total acumulado historico.
- El sistema muestra el progreso actual hacia el proximo beneficio.
- El sistema muestra visualmente el avance mediante una barra o indicador.

**HU-020**

Como usuario registrado, quiero saber cuanto me falta para obtener un descuento, para decidir si completo una compra adicional.

Criterios de aceptacion:

- El sistema muestra un mensaje del tipo "Te faltan $X para desbloquear el beneficio".
- El valor faltante se actualiza segun el avance del usuario.
- Si el beneficio ya fue desbloqueado, el mensaje cambia a estado disponible.

**HU-021**

Como usuario registrado, quiero recibir un 10 por ciento de descuento en mi siguiente compra cuando supere el umbral, para obtener una recompensa por fidelidad.

Criterios de aceptacion:

- El beneficio se activa cuando el usuario alcanza el umbral definido.
- El descuento se refleja automaticamente en el checkout siguiente.
- El descuento se utiliza una sola vez.
- Tras usarlo, el sistema reinicia el progreso del ciclo de beneficio y conserva el acumulado historico total.

Prioridad: Alta

## 5. Resumen de prioridades sugeridas

### Alta

- cuenta de usuario,
- autenticacion,
- historial de pedidos,
- checkout asociado a usuario,
- compatibilidad por vehiculo,
- fidelizacion y descuento en proxima compra.

### Media

- visualizacion de direcciones reutilizables,
- seccion estructural de metodos de pago,
- enriquecimiento del dashboard de cuenta.

## 6. Proximos pasos sugeridos

- conectar autenticacion con backend real,
- persistir pedidos y usuarios en base de datos,
- integrar pasarela de pago,
- permitir edicion de perfil y direcciones,
- parametrizar reglas de fidelizacion desde administracion,
- agregar estados de pedido sincronizados con operacion/logistica.

## 7. Conclusiones

El presente documento establece una base estructurada de requerimientos funcionales e historias de usuario para una tienda virtual de repuestos con enfasis en compatibilidad vehicular, experiencia de compra, cuenta de usuario e incentivo de fidelizacion.

Su uso permite alinear desarrollo, negocio y validacion funcional bajo una misma referencia de alcance.
