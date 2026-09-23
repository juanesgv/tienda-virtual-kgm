"use client";

import { CartDiscrepancy } from "../context/CartContext";
import { formatPrice } from "../data/products";

interface CartRevalidationModalProps {
  discrepancies: CartDiscrepancy[];
  onUpdateCart: () => void;
  onCancel: () => void;
}

// HU-E11-05/E14-04: antes de pagar, se revisa el carrito contra el catálogo actual.
// Nunca se ejecuta el cobro/confirmación automáticamente: el cliente decide si actualiza o cancela.
export default function CartRevalidationModal({ discrepancies, onUpdateCart, onCancel }: CartRevalidationModalProps) {
  return (
    <div className="vehicle-modal active">
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal-content revalidation-content">
        <div className="incompatible-confirm-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        </div>
        <h2>Algo cambió en tu carrito</h2>
        <p className="revalidation-intro">
          Antes de continuar, revisamos tu pedido contra la disponibilidad y precios actuales. Esto fue lo que encontramos:
        </p>

        <ul className="revalidation-list">
          {discrepancies.map((d) => (
            <li key={`${d.productId}-${d.type}`} className={`revalidation-item ${d.type}`}>
              <strong>{d.productName}</strong>
              {d.type === "out_of_stock" && <span>Ya no está disponible — se quitará de tu carrito.</span>}
              {d.type === "quantity_reduced" && (
                <span>
                  Solo quedan {d.newQuantity} unidades (tenías {d.oldQuantity}) — ajustaremos la cantidad.
                </span>
              )}
              {d.type === "price_changed" && (
                <span>
                  El precio cambió de {formatPrice(d.oldPrice || 0)} a <strong>{formatPrice(d.newPrice || 0)}</strong>.
                </span>
              )}
            </li>
          ))}
        </ul>

        <p className="revalidation-note">
          No se ha realizado ningún cobro. Actualiza tu pedido para reflejar estos cambios y luego confirma de nuevo.
        </p>

        <div className="incompatible-confirm-actions">
          <button type="button" className="btn-outline" onClick={onCancel}>
            Revisar mi carrito
          </button>
          <button type="button" className="btn-main" onClick={onUpdateCart}>
            Actualizar mi pedido
          </button>
        </div>
      </div>
    </div>
  );
}
