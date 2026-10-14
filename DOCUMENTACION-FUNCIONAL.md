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
- historial de pedidos.

Fuera del alcance actual (Fase 2): programa de fidelizacion con descuento en compra futura. Ver seccion 4.8.

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
- `RF-007` El sistema debe permitir asociar un vehiculo a la sesion del usuario. El vehiculo puede identificarse por placa, VIN o seleccion guiada de modelo y anio (sin preguntar la marca; motor opcional), y se guarda en un garaje con varios vehiculos de los que uno esta activo.
- `RF-008` El sistema debe identificar, para el vehiculo activo, si un producto es compatible, no compatible o si la compatibilidad no se puede confirmar (por ejemplo, porque falta el motor o el dato del repuesto). "Sin confirmar" nunca se presenta como rechazo.
- `RF-009` El sistema debe permitir mostrar solo productos compatibles con el vehiculo activo. El filtro solo tiene efecto con un vehiculo activo y se apaga si el usuario se queda sin vehiculo activo.

#### Historias de usuario

**HU-003**

Como comprador, quiero buscar repuestos por nombre o referencia, para encontrar un producto especifico sin recorrer todo el catalogo.

Criterios de aceptacion:

- Existe un buscador global accesible desde la cabecera.
- El sistema redirige a una pagina de resultados.
- Los resultados muestran coincidencias relevantes del catalogo.
- Si la busqueda no tiene resultados, el sistema sugiere terminos mas generales, el formato "pieza y modelo" (por ejemplo, "Disco de freno Tivoli") y categorias, y ofrece pedirle a un asesor que consiga el repuesto (con la busqueda y el vehiculo como contexto).
- Toda busqueda sin resultados queda registrada sin pedir datos al cliente (termino, fecha y vehiculo activo, si lo hay), para saber que repuestos faltan en el catalogo (HU-E13-04). Esa demanda se consulta agrupada por termino; en el prototipo, en la pantalla de demo del registro de solicitudes.

**HU-004**

Como comprador, quiero guardar mi vehiculo, para saber si los repuestos aplican a mi referencia.

Criterios de aceptacion:

- El usuario identifica su vehiculo digitando o eligiendo, sin fotos de documentos: placa (metodo por defecto), modelo (modelo y anio; la marca no se pregunta porque KGM y SsangYong son la misma marca) o VIN (disponible, de menor uso por su longitud). Los tres estan en la portada, sin pasar por una ventana aparte; el motor es opcional. Las busquedas por placa y VIN piden confirmar el resultado antes de guardarlo y, si fallan, ofrecen la seleccion manual. En el prototipo estas busquedas son simuladas (sin RUNT ni SIISA).
- Si no se indica el motor, el vehiculo queda marcado como "version sin confirmar".
- El usuario puede guardar varios vehiculos en "Mi garaje", elegir cual esta activo, cambiar de vehiculo y quitar el vehiculo activo sin borrarlo del garaje.
- El garaje queda persistido para visitas posteriores.
- El sistema usa el vehiculo activo para informar compatibilidad en cards, detalle y carrito.

**HU-005**

Como comprador, quiero filtrar el catalogo para ver solo repuestos compatibles con mi vehiculo, para reducir errores al comprar.

Criterios de aceptacion:

- El filtro solo aparece cuando existe un vehiculo activo.
- Al activarlo, el listado muestra solo productos compatibles (los de compatibilidad sin confirmar no se cuentan como compatibles).
- El sistema informa cuantos productos compatibles existen.
- El filtro persiste entre catalogo, busqueda y categorias; se apaga si el usuario quita el vehiculo activo o lo borra del garaje.
- Si el filtro deja el listado vacio, el sistema lo explica y permite quitarlo.

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

- Si existe vehiculo activo, el sistema informa si el repuesto es compatible, no compatible o sin confirmar, con icono y texto (nunca solo con color).
- Si el repuesto no es compatible, se explica por que y se ofrece consultar a un asesor o ver alternativas que si sirvan.
- Se muestra siempre, con o sin vehiculo activo, para que vehiculos sirve el repuesto: primero en una frase en lenguaje claro (marca, modelos y rangos de anios) y despues en una tabla de vehiculos compatibles que se puede filtrar por marca, modelo, anio y motor. La frase se genera a partir de los mismos datos de la tabla.
- Si ningun vehiculo cumple los filtros, se indica que eso no significa que el repuesto no sirva y se permite quitar los filtros.
- Con vehiculo activo, la fila que de verdad aplica (modelo, anio y motor) aparece primero y marcada.
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
- Se muestra el total final a pagar (subtotal mas envio).
- Se muestra la entrega estimada con fechas (por ejemplo, "entre el miercoles 14 y el viernes 16 de octubre"), en la tarjeta del producto, la ficha, el carrito y la confirmacion del pedido. En el prototipo es un valor de ejemplo (3 a 5 dias habiles, sin festivos) hasta que exista el contrato con la transportadora (HU-E18-01) y se decida D3.

**HU-010**

Como comprador, quiero completar mis datos de envio en el checkout, para registrar correctamente mi pedido.

Criterios de aceptacion:

- El formulario solicita nombre, correo, telefono, direccion, ciudad y departamento.
- El formulario permite notas adicionales.
- El pedido no puede confirmarse sin los datos obligatorios.
- Antes de confirmar, y en la confirmacion del pedido, se explica que pasa despues: un asesor revisa la compatibilidad, se coordina el pago (no se cobra antes) y se avisa el despacho con la fecha estimada. Es un proceso propuesto, por validar con Posventa.
- Garantia y devoluciones no se afirman con plazos propios mientras la epica E19 no tenga politica definida: la tienda muestra un solo texto ("por definir con Comercial") en la ficha, el carrito y la confirmacion.

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

Como visitante, quiero crear una cuenta, para guardar mis pedidos y mis datos de compra.

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
- Se muestra un resumen general de pedidos, total en compras y ultimo pedido.
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
- El detalle incluye subtotal, envio y total.
- El detalle lista nombre del producto, referencia, cantidad y precio.

Prioridad: Alta

### 4.7 Datos personales y direcciones

#### Requerimientos funcionales

- `RF-028` El sistema debe mostrar los datos basicos del usuario autenticado.
- `RF-029` El sistema debe ofrecer una libreta de direcciones propia del usuario, independiente del historial de pedidos, en la que pueda agregar, editar, eliminar y marcar una direccion como predeterminada, y reutilizarla al hacer el checkout.
- `RF-030` El sistema debe presentar una seccion visual para futuras integraciones de metodos de pago.

#### Historias de usuario

**HU-016**

Como usuario autenticado, quiero ver mis datos personales, para confirmar la informacion asociada a mi cuenta.

Criterios de aceptacion:

- Se muestran nombre, correo, telefono y fecha de registro.
- Si falta informacion, el sistema lo indica de manera clara.

**HU-017**

Como usuario autenticado, quiero administrar mis direcciones de envio, para reutilizarlas en futuras compras sin escribirlas de nuevo.

Criterios de aceptacion:

- La seccion de direcciones muestra etiqueta, direccion, ciudad, departamento y telefono.
- El usuario puede agregar, editar y eliminar direcciones; la primera queda como predeterminada y puede cambiarse.
- Editar o eliminar una direccion no altera los pedidos ya hechos.
- En el checkout el usuario puede elegir una direccion guardada o escribir una nueva.
- Si no existen direcciones, se muestra estado vacio.

**HU-018**

Como usuario autenticado, quiero ver una seccion de metodos de pago, para entender que el sistema contempla esa capacidad.

Criterios de aceptacion:

- Existe una seccion diferenciada para metodos de pago.
- Si no hay medios guardados, se muestra un mensaje de estado vacio.
- La seccion queda preparada para futura integracion.

Prioridad: Media

### 4.8 Fidelizacion y beneficios (Fase 2, fuera del alcance actual)

> **Estado: fuera del alcance del MVP y del prototipo.** La epica E23 (Fidelizacion) esta en Fase 2 en el backlog de Notion, con prioridad Media, y su pagina esta en blanco (sin historias de usuario). La observacion registrada dice que el negocio ya lo contempla pero sin definir y que no hay que distraerse con ello en el MVP. El prototipo no implementa ningun descuento, acumulado ni beneficio de fidelizacion: el total del pedido es subtotal mas envio.
>
> Los requerimientos de esta seccion se conservan solo como referencia historica para cuando la epica se priorice. Estan **sin validar**: el umbral de beneficio nunca se definio de forma unica (se manejaron $2.000.000 y $5.000.000 en distintos materiales) y el 10 % de descuento tampoco esta confirmado por negocio. No deben usarse como alcance de desarrollo.

#### Requerimientos funcionales (referencia, Fase 2)

- `RF-031` El sistema debe calcular y almacenar el total acumulado de compras por usuario.
- `RF-032` El sistema debe calcular el avance del usuario hacia un umbral de beneficio.
- `RF-033` El sistema debe habilitar un beneficio cuando el usuario supera el umbral de compras.
- `RF-034` El beneficio debe consistir en un 10 por ciento de descuento en la siguiente compra.
- `RF-035` El descuento debe aplicarse una sola vez.
- `RF-036` El sistema debe mostrar el estado del beneficio y cuanto falta para alcanzarlo.
- `RF-037` El sistema debe evitar recalcular todo el historico en cada consulta y conservar acumulados actualizados.

#### Historias de usuario (referencia, Fase 2)

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

Prioridad: Fase 2 (no priorizada)

## 5. Resumen de prioridades sugeridas

### Alta

- cuenta de usuario,
- autenticacion,
- historial de pedidos,
- checkout asociado a usuario,
- compatibilidad por vehiculo.

### Media

- visualizacion de direcciones reutilizables,
- seccion estructural de metodos de pago,
- enriquecimiento del dashboard de cuenta.

### Fase 2 (no priorizada)

- fidelizacion y descuento en proxima compra (seccion 4.8).

## 6. Proximos pasos sugeridos

- conectar autenticacion con backend real,
- persistir pedidos y usuarios en base de datos,
- integrar pasarela de pago,
- permitir edicion de perfil y direcciones,
- cuando se priorice la Fase 2, definir con negocio las reglas de fidelizacion antes de implementarlas,
- agregar estados de pedido sincronizados con operacion/logistica.

## 7. Conclusiones

El presente documento establece una base estructurada de requerimientos funcionales e historias de usuario para una tienda virtual de repuestos con enfasis en compatibilidad vehicular, experiencia de compra, y cuenta de usuario. La fidelizacion queda registrada como Fase 2.

Su uso permite alinear desarrollo, negocio y validacion funcional bajo una misma referencia de alcance.

## 8. Trazabilidad con el backlog de Notion

Los codigos `HU-001` a `HU-021` y `RF-001` a `RF-037` de este documento son **locales**: vienen del documento base original y **no coinciden** con los codigos del backlog de Notion (`HU-E##-##`, agrupados por epica `E##`). La fuente de verdad del alcance es Notion; este documento describe el comportamiento esperado y se mantiene alineado con el prototipo.

La tabla se contrasto el 2026-10-07 leyendo las paginas de las epicas del backlog de Notion (E01 a E18, E23, E40, E54 y E55): titulos y criterios de cada historia. Esas paginas siguen marcadas como borrador en Notion. "Cubierta" significa que el prototipo satisface los criterios de la historia con comportamiento funcional o simulado; "parcial" indica que faltan criterios; "no cubierta" que no existe en el prototipo. Es una lectura de los criterios contra el comportamiento del prototipo, no una validacion con el cliente.

| Historia local | Historias de Notion relacionadas | Cobertura del prototipo |
|---|---|---|
| HU-001 Inicio | HU-E01-01 Buscar desde la Home; HU-E01-02 Identificar mi vehiculo desde la Home; HU-E01-03 Explorar por categorias desde la Home; HU-E01-04 Entender que la tienda es confiable | E01-02 y E01-03 cubiertas (selector de vehiculo en la portada). E01-01 parcial: el buscador esta en la cabecera, pero no es el elemento mas destacado de la portada. E01-04 parcial: hay un bloque de ventajas con textos de ejemplo; falta el contenido real de garantia, originalidad y envios (depende de E32 y E18) |
| HU-002 Categorias | HU-E03-01 Navegar por categorias; HU-E03-02 Saber donde estoy y volver atras; HU-E03-03 Categorias filtradas por mi vehiculo | Cubiertas. Las categorias sin productos se muestran vacias con explicacion (decision abierta en Notion) |
| HU-003 Busqueda y listado | HU-E04-01, 02, 03, 05 y 06; HU-E04-04 Buscar por codigo de parte; HU-E05-01, 02 y 04 (filtros); HU-E02-01, 02, 03 y 04 (listado) | E04-01, 02, 03, 05, 06, E05-01, 02, 04 y E02-01 a E02-04 cubiertas (E02-04 mediante el interruptor de demostracion de catalogo caido). E04-04 por validar: la busqueda admite referencia, sin verificar los criterios de referencia intercambiable y aviso al asesor |
| HU-004 Vehiculo y garaje | HU-E08-01 Identificar mi vehiculo; HU-E08-02 Seleccionar manualmente; HU-E08-03 Varios vehiculos; HU-E08-04 Usar un vehiculo sin cuenta; HU-E08-05 Cambiar o quitar el activo; HU-E16-03 Garaje desde el perfil | Cubiertas. Placa y VIN son simuladas (sin SIISA); la seleccion manual no pide version, solo motor opcional, y avisa que la compatibilidad puede ser aproximada. El garaje se guarda en el navegador |
| HU-005 Filtro de compatibles | HU-E05-03 Filtrar por compatibilidad; HU-E07-01 Ver solo lo que sirve para mi carro; HU-E04-06 Buscar con mi vehiculo; HU-E03-03 | Cubiertas |
| HU-006 Detalle del producto | HU-E06-01 Ver toda la informacion; HU-E06-04 Agregar al carrito; HU-E13-01 Saber si esta disponible; HU-E13-03 Aviso de disponibilidad; HU-E55-01, 02 y 03 | E06-04, E13-01 y E55-01 a 03 cubiertas. E06-01 parcial: muestra una sola imagen (sin galeria). E13-03 cubierta de forma simulada (pide iniciar sesion y no envia correo). La referencia descontinuada no aparece en el catalogo y su enlace directo explica que ya no se vende |
| HU-007 Compatibilidad en el producto | HU-E06-02 Confirmar que sirve; HU-E06-03 Para que vehiculos sirve; HU-E06-05 Salir del paso si no me sirve; HU-E07-02 Estado de compatibilidad; HU-E07-03 No perder de vista los no compatibles; HU-E07-04 Alternativas compatibles; HU-E10-04 Advertencia antes de agregar | Cubiertas. La lista de vehiculos compatibles no tiene busqueda interna (E06-03, parcial). Decision abierta en Notion: el prototipo permite agregar un producto no compatible con advertencia |
| HU-008 Carrito | HU-E10-01 Armar el carrito sin cuenta; HU-E10-02 Modificar el carrito; HU-E10-03 Ver el resumen; HU-E10-05 Carrito vacio con salida; HU-E13-02 Que no me vendan lo que no hay | Cubiertas. El carrito persiste en el navegador; no hay carrito en servidor |
| HU-009 Resumen del pedido | HU-E10-03; HU-E11-04 Ver el total real antes de pagar; HU-E18-02 Pagar el envio cuando mi compra es pequena; HU-E18-03 Cuanto me falta para el envio gratis | E18-02 y E18-03 cubiertas con valores de ejemplo (decision comercial D3 pendiente). E11-04 parcial: el total se desglosa en productos y envio; no hay impuestos |
| HU-010 Checkout | HU-E11-01 Revisar mi pedido; HU-E11-02 Donde recibir mi pedido; HU-E11-05 Enterarme si algo cambio; HU-E15-01 Confirmacion del pedido; HU-E18-01; HU-E11-03 Datos de facturacion | E11-01, E11-05 y E15-01 cubiertas (sin pago real ni correo de confirmacion). E11-02 parcial: direcciones guardadas si; opciones de envio y cobertura no. E18-01 y E11-03 no cubiertas (E18-01 esta bloqueada por contrato con la transportadora; E11-03 depende de DIAN). El pago (E12, PayU) no esta en el prototipo |
| HU-011 Crear cuenta | HU-E09-01 Crear mi cuenta para comprar | Cubierta (registro en el checkout, errores por campo, ofrece iniciar sesion si el correo existe) |
| HU-012 Iniciar sesion | HU-E09-02 Iniciar sesion sin perder mi carrito; HU-E09-03 Recuperar el acceso; HU-E09-04 Mantener mi sesion; HU-E09-05 Registrarme para que me avisen | E09-02 y E09-04 cubiertas. E09-03 cubierta de forma simulada (sin correo real). E09-05 cubierta de forma simulada |
| HU-013 Dashboard de cuenta | sin equivalente en el backlog (E16 no define un resumen de cuenta) | Existe en el prototipo; fuera de las historias documentadas |
| HU-014 y HU-015 Pedidos | HU-E15-02 Consultar el estado; HU-E15-03 Seguir el envio; HU-E17-01 Ver mis compras anteriores; HU-E17-02 Volver a pedir; HU-E17-03 Historial por vehiculo | Cubiertas. E15-03 es simulada: no hay integracion con transportador ni notificaciones |
| HU-016 Datos personales | HU-E16-01 Ver y actualizar mis datos; HU-E16-04 Cambiar mi contrasena | Cubiertas |
| HU-017 Direcciones | HU-E16-02 Gestionar mis direcciones; HU-E11-02 | Cubiertas |
| HU-018 Metodos de pago | sin historia propia; relacionada con la epica E12 (Pagos, PayU) | Solo existe la seccion estructural vacia; no hay pago |
| HU-019 a HU-021 Fidelizacion | epica E23 (Fase 2): la pagina esta en blanco, sin historias | No implementada |

Historias de Notion que el prototipo implementa y que este documento no describe todavia como historias propias:

- Asesoria asistida (epica E54, posible funcionalidad): HU-E54-01 Pedir ayuda cuando no se que repuesto necesito; HU-E54-02 Que el asesor ya sepa de que le hablo; HU-E54-03 Describir mi problema con mis propias palabras; HU-E54-04 Retomar mi compra tras la orientacion; HU-E54-05 Distinguir consultas por friccion de las de asesoria. Canal, horario y datos que necesita el asesor son decisiones abiertas: el prototipo los simula.
- Relaciones entre productos (epica E55, posible funcionalidad): HU-E55-01 a 03 y HU-E55-04 (llevar todo lo necesario de una vez, por validar). La viabilidad depende de que exista el dato (curaduria con Posventa).

Observaciones sobre la trazabilidad en el codigo:

- La epica E40 (estados degradados) no tiene historias en Notion: su pagina esta en blanco. Los comentarios del prototipo que citaban `HU-E40` ahora citan HU-E02-04 (catalogo no disponible) y aclaran que E40 no tiene historias.
- Los comentarios del filtro de compatibilidad citan HU-E05-03 junto con HU-E07-01, porque la compatibilidad como filtro opcional esta en E05-03.
- Los demas comentarios de trazabilidad del codigo se contrastaron con los titulos y criterios de Notion y coinciden.
- No hay en el backlog una historia que obligue a mostrar descuentos de fidelizacion; el prototipo ya no los muestra.