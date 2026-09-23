"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, CartDiscrepancy } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useVehicle } from "../context/VehicleContext";
import { formatPrice, getCompatibilityStatus } from "../data/products";
import { Address } from "../types/account";
import CartRevalidationModal from "../components/CartRevalidationModal";

const COMPAT_LABEL: Record<string, string> = {
  compatible: "Compatible con tu vehículo",
  not_compatible: "No compatible con tu vehículo",
  unknown: "Verificar compatibilidad",
};

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    getShippingCost,
    clearCart,
    getCartDiscrepancies,
    applyDiscrepancies,
  } = useCart();
  const {
    currentUser,
    isAuthenticated,
    register,
    login,
    createOrderForCurrentUser,
    getAvailableDiscountAmount,
  } = useUser();
  const { vehicle, isVehicleSaved } = useVehicle();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    notas: "",
  });
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  // HU-E11-02: direcciones guardadas seleccionables en el checkout
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  // HU-E11-05: revalidación de disponibilidad/precio justo antes de pagar
  const [pendingDiscrepancies, setPendingDiscrepancies] = useState<CartDiscrepancy[] | null>(null);

  // Preseleccionar la dirección predeterminada del cliente, si tiene una
  useEffect(() => {
    if (currentUser && currentUser.addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = currentUser.addresses.find((a) => a.isDefault) || currentUser.addresses[0];
      applySavedAddress(defaultAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const applySavedAddress = (address: Address) => {
    setSelectedAddressId(address.id);
    setFormData((prev) => ({
      ...prev,
      direccion: address.address,
      ciudad: address.city,
      departamento: address.department,
      telefono: address.phone,
      notas: address.notes || "",
    }));
  };

  const useNewAddress = () => {
    setSelectedAddressId(null);
    setFormData((prev) => ({ ...prev, direccion: "", ciudad: "", departamento: "", notas: "" }));
  };

  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  const loyaltyDiscount = getAvailableDiscountAmount(subtotal);
  const finalTotal = Math.max(0, subtotal + shippingCost - loyaltyDiscount);

  const fullName = isAuthenticated && currentUser ? currentUser.name : formData.nombre;
  const email = isAuthenticated && currentUser ? currentUser.email : formData.email;
  const phone = formData.telefono || currentUser?.phone || "";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // HU-E11-05: nunca se confirma el pedido sin revisar antes disponibilidad y precio actuales
    const discrepancies = getCartDiscrepancies();
    if (discrepancies.length > 0) {
      setPendingDiscrepancies(discrepancies);
      return;
    }

    let targetUserId = currentUser?.id;
    let targetUser = currentUser || undefined;

    if (!isAuthenticated) {
      const authResult =
        authMode === "register"
          ? register({
              name: formData.nombre,
              email: formData.email,
              phone: formData.telefono,
              password,
            })
          : login({
              email: formData.email,
              password,
            });

      if (!authResult.ok) {
        setFormError(authResult.error || "No fue posible validar la cuenta.");
        return;
      }

      targetUserId = authResult.userId;
      targetUser = authResult.user;
    }

    const orderResult = createOrderForCurrentUser({
      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        vehicle: item.vehicle,
      })),
      subtotal,
      shipping: shippingCost,
      shippingAddress: {
        fullName,
        email,
        phone,
        address: formData.direccion,
        city: formData.ciudad,
        department: formData.departamento,
        notes: formData.notas,
      },
    }, targetUserId, targetUser);

    if (!orderResult.ok) {
      setFormError(orderResult.error || "No fue posible crear el pedido.");
      return;
    }

    clearCart();
    // HU-E15-01: página de confirmación real en vez de un alert() del navegador
    router.push(`/pedido/${orderResult.orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page-header">
          <h1>Carrito de compras</h1>
          <p>Revisa tus productos antes de completar la compra</p>
        </div>
        <div className="cart-empty" style={{ textAlign: "center", padding: "80px 20px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="80"
            height="80"
            style={{ color: "var(--color-gray-300)", marginBottom: "24px" }}
          >
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "12px" }}>
            Tu carrito está vacío
          </h2>
          <p style={{ color: "var(--color-gray-600)", marginBottom: "32px" }}>
            Explora nuestro catálogo y encuentra los repuestos que necesitas para tu vehículo.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/repuestos" className="btn-main">
              Ver repuestos
            </Link>
            {/* HU-E10-05: si hay vehículo activo, ofrecer ir directo a lo compatible */}
            {isVehicleSaved && vehicle && (
              <Link href="/repuestos?compatible=true" className="btn-outline">
                Ver compatibles con mi {vehicle.brand} {vehicle.model}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <h1>Carrito de compras</h1>
        <p>Revisa tus productos antes de completar la compra</p>
      </div>

      <div className="cart-page-content">
        <div className="cart-items-section">
          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item.product.id} className="cart-item-large">
                <div className="cart-item-image-large">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} loading="lazy" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="60" height="60">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z" />
                    </svg>
                  )}
                </div>
                <div className="cart-item-info">
                  <Link href={`/repuestos/${item.product.id}`}>
                    <h3>{item.product.name}</h3>
                  </Link>
                  <p className="cart-item-ref">Ref: {item.product.sku}</p>
                  {/* HU-E10-03/E10-04: estado de compatibilidad visible y persistente en el carrito */}
                  {isVehicleSaved && vehicle && (
                    <span className={`cart-item-compat ${getCompatibilityStatus(item.product, vehicle)}`}>
                      {COMPAT_LABEL[getCompatibilityStatus(item.product, vehicle)]}
                    </span>
                  )}
                  <p className="cart-item-price-unit">{formatPrice(item.product.price)} c/u</p>
                </div>

                <div className="cart-item-quantity">
                  <div className="quantity-selector">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input type="number" value={item.quantity} min="1" readOnly />
                    <button className="qty-btn" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>

                <button className="cart-item-remove-btn" onClick={() => removeFromCart(item.product.id)} title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="cart-actions">
            <Link href="/repuestos" className="btn-continue-shopping">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
              Seguir comprando
            </Link>
            <button className="btn-clear-cart" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        </div>

        <div className="cart-summary-section">
          <div className="cart-summary-card">
            <h3>Resumen del pedido</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Envío</span>
                <span>{shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}</span>
              </div>
              {/* HU-E11-02: tiempo estimado, no solo costo. El costo por zona/cobertura sigue siendo decisión abierta (E18). */}
              <p className="shipping-eta">Entrega estimada: 3 a 5 días hábiles</p>
              {shippingCost > 0 && (
                <p className="shipping-promo">
                  Envío gratis en compras mayores a {formatPrice(500000)}
                </p>
              )}
              {loyaltyDiscount > 0 && (
                <div className="summary-row discount">
                  <span>Descuento fidelización</span>
                  <span>-{formatPrice(loyaltyDiscount)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Datos de envío</h3>
            {formError ? <p className="account-message error">{formError}</p> : null}

            <div className="form-group">
              <label htmlFor="nombre">Nombre completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={fullName}
                onChange={handleInputChange}
                required
                placeholder="Tu nombre completo"
                readOnly={isAuthenticated}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Correo electrónico *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  required
                  placeholder="tu@email.com"
                  readOnly={isAuthenticated}
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={phone}
                  onChange={handleInputChange}
                  required
                  placeholder="300 123 4567"
                />
              </div>
            </div>

            <div className="checkout-account-box">
              <div className="checkout-account-header">
                <div>
                  <h4>{isAuthenticated ? "Cuenta vinculada" : "Cuenta de cliente"}</h4>
                  <p>
                    {isAuthenticated
                      ? "Este pedido quedará guardado en tu historial."
                      : "Crea tu cuenta o inicia sesión para guardar pedidos y activar fidelización."}
                  </p>
                </div>
              </div>

              {!isAuthenticated ? (
                <>
                  <div className="account-tabs compact">
                    <button
                      type="button"
                      className={`account-tab ${authMode === "register" ? "active" : ""}`}
                      onClick={() => setAuthMode("register")}
                    >
                      Crear cuenta
                    </button>
                    <button
                      type="button"
                      className={`account-tab ${authMode === "login" ? "active" : ""}`}
                      onClick={() => setAuthMode("login")}
                    >
                      Iniciar sesión
                    </button>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">
                      {authMode === "register" ? "Crea una contraseña *" : "Contraseña *"}
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                </>
              ) : currentUser?.loyalty.benefitStatus === "available" ? (
                <p className="loyalty-badge-message">
                  Se aplicará automáticamente tu 10% de descuento:
                  {" "}
                  <strong>-{formatPrice(loyaltyDiscount)}</strong>
                </p>
              ) : (
                <p className="loyalty-badge-message muted">
                  Te faltan <strong>{formatPrice(currentUser?.loyalty.nextRewardRemaining || 0)}</strong> para
                  obtener 10% en tu próxima compra.
                </p>
              )}
            </div>

            {/* HU-E11-02: reutilizar una dirección ya guardada en vez de escribirla de nuevo */}
            {isAuthenticated && currentUser && currentUser.addresses.length > 0 && (
              <div className="form-group saved-addresses-picker">
                <label>Dirección de envío *</label>
                <div className="saved-address-options">
                  {currentUser.addresses.map((address) => (
                    <button
                      type="button"
                      key={address.id}
                      className={`saved-address-option ${selectedAddressId === address.id ? "selected" : ""}`}
                      onClick={() => applySavedAddress(address)}
                    >
                      <strong>{address.label || "Dirección"}</strong>
                      <span>{address.address}, {address.city}</span>
                      {address.isDefault && <span className="default-tag">Predeterminada</span>}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`saved-address-option ghost ${selectedAddressId === null ? "selected" : ""}`}
                    onClick={useNewAddress}
                  >
                    + Usar otra dirección
                  </button>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="direccion">
                {isAuthenticated && currentUser && currentUser.addresses.length > 0
                  ? "Confirma o ajusta la dirección *"
                  : "Dirección de envío *"}
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                required
                placeholder="Calle, número, apartamento"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ciudad">Ciudad *</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  required
                  placeholder="Bogotá"
                />
              </div>
              <div className="form-group">
                <label htmlFor="departamento">Departamento *</label>
                <select
                  id="departamento"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Amazonas">Amazonas</option>
                  <option value="Antioquia">Antioquia</option>
                  <option value="Arauca">Arauca</option>
                  <option value="Atlántico">Atlántico</option>
                  <option value="Bogotá">Bogotá D.C.</option>
                  <option value="Bolívar">Bolívar</option>
                  <option value="Boyacá">Boyacá</option>
                  <option value="Caldas">Caldas</option>
                  <option value="Caquetá">Caquetá</option>
                  <option value="Casanare">Casanare</option>
                  <option value="Cauca">Cauca</option>
                  <option value="Cesar">Cesar</option>
                  <option value="Chocó">Chocó</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Cundinamarca">Cundinamarca</option>
                  <option value="Guainía">Guainía</option>
                  <option value="Guaviare">Guaviare</option>
                  <option value="Huila">Huila</option>
                  <option value="La Guajira">La Guajira</option>
                  <option value="Magdalena">Magdalena</option>
                  <option value="Meta">Meta</option>
                  <option value="Nariño">Nariño</option>
                  <option value="Norte de Santander">Norte de Santander</option>
                  <option value="Putumayo">Putumayo</option>
                  <option value="Quindío">Quindío</option>
                  <option value="Risaralda">Risaralda</option>
                  <option value="San Andrés">San Andrés y Providencia</option>
                  <option value="Santander">Santander</option>
                  <option value="Sucre">Sucre</option>
                  <option value="Tolima">Tolima</option>
                  <option value="Valle del Cauca">Valle del Cauca</option>
                  <option value="Vaupés">Vaupés</option>
                  <option value="Vichada">Vichada</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notas">Notas adicionales (opcional)</label>
              <textarea
                id="notas"
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                rows={3}
                placeholder="Instrucciones especiales de entrega, referencias de ubicación, etc."
              />
            </div>

            <button type="submit" className="btn-place-order">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Confirmar pedido
            </button>

            <p className="form-note">
              Al confirmar, el pedido se guarda en tu cuenta y te contactaremos para coordinar el pago.
            </p>
          </form>
        </div>
      </div>

      {pendingDiscrepancies && (
        <CartRevalidationModal
          discrepancies={pendingDiscrepancies}
          onCancel={() => setPendingDiscrepancies(null)}
          onUpdateCart={() => {
            applyDiscrepancies(pendingDiscrepancies);
            setPendingDiscrepancies(null);
          }}
        />
      )}
    </div>
  );
}
