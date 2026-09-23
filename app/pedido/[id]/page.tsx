"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../data/products";
import OrderStatusTimeline from "../../components/OrderStatusTimeline";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeStyle: "short" }).format(new Date(value));
}

// HU-E15-01: página de confirmación real (antes esto era solo un alert() del navegador)
export default function OrderConfirmationPage() {
  const params = useParams();
  const { currentUser, isAuthenticated } = useUser();
  const { reorderItems } = useCart();
  const [reorderMessage, setReorderMessage] = useState<string | null>(null);

  const order = currentUser?.orders.find((o) => o.id === params.id);

  if (!isAuthenticated || !currentUser) {
    return (
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <h1>Inicia sesión para ver este pedido</h1>
        <Link href="/cuenta" className="btn-main" style={{ marginTop: "16px", display: "inline-flex" }}>
          Ir a mi cuenta
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <h1>No encontramos este pedido</h1>
        <p style={{ color: "var(--color-gray-600)", marginTop: "8px", marginBottom: "24px" }}>
          Puede que el enlace sea incorrecto o que el pedido pertenezca a otra cuenta.
        </p>
        <Link href="/cuenta" className="btn-main">
          Ver mis pedidos
        </Link>
      </div>
    );
  }

  const handleReorder = () => {
    const result = reorderItems(order.items);
    if (result.added === 0) {
      setReorderMessage("Ninguno de estos productos está disponible en este momento.");
      return;
    }
    const skippedNote =
      result.skipped.length > 0
        ? ` ${result.skipped.length} no se pudo agregar tal cual: ${result.skipped.map((s) => `${s.name} (${s.reason})`).join(", ")}.`
        : "";
    setReorderMessage(`Agregamos ${result.added} producto(s) a tu carrito con el precio actual.${skippedNote}`);
  };

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-header">
        <div className="order-confirmation-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <h1>¡Gracias! Tu pedido quedó registrado</h1>
        <p>
          Pedido <strong>{order.id}</strong> · {formatDate(order.createdAt)}
        </p>
        <p className="order-confirmation-note">
          Te contactaremos a <strong>{order.shippingAddress.email}</strong> para coordinar el pago. También queda
          guardado en tu cuenta.
        </p>
      </div>

      <div className="order-confirmation-layout">
        <div className="order-confirmation-main">
          <section className="account-panel">
            <div className="account-panel-heading">
              <div>
                <p className="account-panel-kicker">Seguimiento</p>
                <h2>Estado de tu pedido</h2>
              </div>
            </div>
            <OrderStatusTimeline status={order.status} orderId={order.id} />
          </section>

          <section className="account-panel">
            <div className="account-panel-heading">
              <div>
                <p className="account-panel-kicker">Productos</p>
                <h2>Resumen del pedido</h2>
              </div>
            </div>
            <div className="order-products">
              {order.items.map((item) => (
                <div key={`${order.id}-${item.productId}`} className="order-product-row">
                  <div className="order-product-copy">
                    <strong>{item.name}</strong>
                    <p>Ref: {item.sku}</p>
                    {item.vehicle && (
                      <span className="account-note-pill">
                        Para {item.vehicle.brand} {item.vehicle.model} {item.vehicle.year}
                      </span>
                    )}
                  </div>
                  <div className="order-product-meta">
                    <span>{item.quantity} x {formatPrice(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>

            {reorderMessage && <p className="account-message success">{reorderMessage}</p>}
            <button type="button" className="btn-outline" onClick={handleReorder}>
              Volver a pedir estos productos
            </button>
          </section>
        </div>

        <aside className="order-confirmation-side">
          <section className="account-panel">
            <div className="account-panel-heading">
              <div>
                <h2>Total</h2>
              </div>
            </div>
            <div className="order-breakdown-grid">
              <div><span>Subtotal</span><strong>{formatPrice(order.subtotal)}</strong></div>
              <div><span>Envío</span><strong>{formatPrice(order.shipping)}</strong></div>
              <div><span>Descuento</span><strong>{order.discount > 0 ? `-${formatPrice(order.discount)}` : "No aplica"}</strong></div>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </section>

          <section className="account-panel">
            <div className="account-panel-heading">
              <div>
                <h2>Dirección de entrega</h2>
              </div>
            </div>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.department}</p>
            <p>{order.shippingAddress.phone}</p>
          </section>

          <div className="order-confirmation-actions">
            <Link href="/cuenta" className="btn-outline full-width">
              Ver mis pedidos
            </Link>
            <Link href="/repuestos" className="btn-main full-width">
              Seguir comprando
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
