// D3 (Decisiones pendientes, Comercial, aún SIN dueño ni fecha): umbral de envío gratis y cobro por debajo.
// Hecho documentado en Notion: hoy el envío es gratis desde $100.000 (antes $70.000) y no existe la opción
// de pagar el envío. Estos valores viven aquí para poder reemplazarlos cuando D3 se cierre.
export const FREE_SHIPPING_THRESHOLD = 100_000; // documentado como práctica actual; la decisión sigue abierta
export const FLAT_SHIPPING_FEE = 25_000; // VALOR DE EJEMPLO: la tarifa plana no está definida
export const HIGH_SHIPPING_RATIO = 0.3; // VALOR DE EJEMPLO: "porcentaje alto" de HU-E18-02 sin definir

// La tarifa por ciudad y peso volumétrico depende del contrato con la transportadora (E18): no se simula.
export function getShipping(subtotal: number) {
  const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const cost = isFree || subtotal === 0 ? 0 : FLAT_SHIPPING_FEE;
  return {
    isFree,
    cost,
    remaining: isFree ? 0 : FREE_SHIPPING_THRESHOLD - subtotal,
    progress: Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD),
    // HU-E18-02: advertir si el envío pesa demasiado frente al pedido
    isCostly: cost > 0 && cost / subtotal > HIGH_SHIPPING_RATIO,
    costPercent: subtotal > 0 ? Math.round((cost / subtotal) * 100) : 0,
  };
}
