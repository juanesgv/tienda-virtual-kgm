"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { formatPrice as formatProductPrice, getCompatibilityStatus } from "../data/products";
import { useVehicle } from "../context/VehicleContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMPAT_LABEL: Record<string, string> = {
  compatible: "Compatible",
  not_compatible: "No compatible",
  unknown: "Verificar",
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getSubtotal, getShippingCost, getTotal, clearCart } = useCart();
  const { vehicle, isVehicleSaved } = useVehicle();

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            Tu carrito
          </h2>
          <button className="cart-drawer-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="cart-drawer-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <p>Tu carrito está vacío</p>
              <Link href="/repuestos" className="btn-primary" onClick={onClose}>
                Explorar repuestos
              </Link>
              {/* HU-E10-05: si hay vehículo activo, ofrecer ir directo a lo compatible */}
              {isVehicleSaved && vehicle && (
                <Link href="/repuestos?compatible=true" className="link-button cart-empty-compat-link" onClick={onClose}>
                  Ver repuestos compatibles con tu {vehicle.brand} {vehicle.model}
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.product.id} className="cart-item">
                    <div className="cart-item-image">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} loading="lazy" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/>
                        </svg>
                      )}
                    </div>
                    <div className="cart-item-details">
                      <Link href={`/repuestos/${item.product.id}`} onClick={onClose}>
                        <h4>{item.product.name}</h4>
                      </Link>
                      <p className="cart-item-sku">Ref: {item.product.sku}</p>
                      {/* HU-E10-03/E10-04: estado de compatibilidad visible y persistente en el carrito */}
                      {isVehicleSaved && vehicle && (
                        <span className={`cart-item-compat ${getCompatibilityStatus(item.product, vehicle)}`}>
                          {COMPAT_LABEL[getCompatibilityStatus(item.product, vehicle)]}
                        </span>
                      )}
                      <p className="cart-item-unit-price">{formatProductPrice(item.product.price)} c/u</p>
                      <div className="cart-item-actions">
                        <div className="quantity-selector small">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <span className="cart-item-price">
                          {formatProductPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.product.id)}
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {items.length > 0 && (
                <button className="clear-cart-btn" onClick={clearCart}>
                  Vaciar carrito
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatProductPrice(getSubtotal())}</span>
              </div>
              <div className="summary-row">
                <span>Envío</span>
                <span>
                  {getShippingCost() === 0 ? (
                    <span className="free-shipping">Gratis</span>
                  ) : (
                    formatProductPrice(getShippingCost())
                  )}
                </span>
              </div>
              {getShippingCost() > 0 && (
                <p className="shipping-note">
                  Envío gratis en compras mayores a {formatProductPrice(500000)}
                </p>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatProductPrice(getTotal())}</span>
              </div>
            </div>
            <Link href="/carrito" className="btn-checkout" onClick={onClose}>
              Proceder al pago
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </Link>
            <button className="btn-continue" onClick={onClose}>
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
