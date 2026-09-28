"use client";

import { formatPrice } from "../data/products";
import { FLAT_SHIPPING_FEE, FREE_SHIPPING_THRESHOLD, getShipping } from "../data/shipping";

// HU-E18-02/03: comunicar la condición del envío gratis desde el carrito, cuánto falta, y que por debajo
// del umbral se puede pagar el envío en lugar de verse bloqueado. Reglas de D3 (abierta): valores de ejemplo.
export default function ShippingProgress({ subtotal }: { subtotal: number }) {
  if (subtotal <= 0) return null;
  const shipping = getShipping(subtotal);

  return (
    <div className={`shipping-progress ${shipping.isFree ? "reached" : ""}`}>
      {shipping.isFree ? (
        <p className="shipping-progress-text">
          <strong>Tu envío es gratis.</strong>
        </p>
      ) : (
        <>
          <p className="shipping-progress-text">
            Te faltan <strong>{formatPrice(shipping.remaining)}</strong> para envío gratis.
          </p>
          <div
            className="shipping-progress-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={FREE_SHIPPING_THRESHOLD}
            aria-valuenow={subtotal}
            aria-label="Avance hacia el envío gratis"
          >
            <span style={{ width: `${Math.round(shipping.progress * 100)}%` }} />
          </div>
          <p className="shipping-progress-rule">
            Envío gratis desde {formatPrice(FREE_SHIPPING_THRESHOLD)}. Por debajo, puedes comprar igual pagando una
            tarifa plana de {formatPrice(FLAT_SHIPPING_FEE)}.
          </p>
          {shipping.isCostly && (
            <p className="shipping-progress-warning" role="status">
              Ojo: el envío equivale al {shipping.costPercent}% del valor de tu pedido.
            </p>
          )}
        </>
      )}
      <span className="simulated-badge">Valores de ejemplo · decisión comercial pendiente (D3)</span>
    </div>
  );
}
