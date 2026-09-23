"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatPrice } from "../data/products";
import { useUser } from "../context/UserContext";
import { useVehicle } from "../context/VehicleContext";
import { useCart } from "../context/CartContext";
import { RegistrationFieldErrors } from "../lib/account";
import { Address, CustomerOrder, OrderItemSnapshot } from "../types/account";
import OrderStatusTimeline from "../components/OrderStatusTimeline";

type AccountSection = "overview" | "orders" | "profile" | "addresses" | "garage" | "payments";
type AuthMode = "login" | "register" | "recover";

function generateSimulatedCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const RECOVERY_CODE_TTL_MS = 5 * 60 * 1000;

const emptyAddressForm = {
  label: "",
  fullName: "",
  phone: "",
  address: "",
  city: "",
  department: "",
  notes: "",
};

// HU-E17-03: clave simple para comparar el vehículo de una línea de pedido contra un vehículo del garaje
function vehicleFilterKey(v: { brand: string; model: string; year: number }) {
  return `${v.brand}|${v.model}|${v.year}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusLabel(status: string) {
  switch (status) {
    case "completado":
      return "Completado";
    case "cancelado":
      return "Cancelado";
    default:
      return "Pendiente";
  }
}

function getSectionIcon(section: AccountSection) {
  switch (section) {
    case "orders":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14h9.45c.75 0 1.41-.41 1.75-1.03L21.7 6.9A1 1 0 0020.84 5H6.21l-.94-2H1v2h3l3.6 7.59L6.25 15c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H8.42l.74-1.96z" />
        </svg>
      );
    case "profile":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
        </svg>
      );
    case "addresses":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 119.5 9a2.5 2.5 0 012.5 2.5z" />
        </svg>
      );
    case "payments":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M20 4H4c-1.11 0-2 .89-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6c0-1.11-.89-2-2-2zm0 4H4V6h16v2zm-6 8H6v-2h8v2z" />
        </svg>
      );
    case "garage":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      );
  }
}

function SectionButton({
  section,
  activeSection,
  onClick,
  label,
}: {
  section: AccountSection;
  activeSection: AccountSection;
  onClick: (section: AccountSection) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`account-nav-item ${activeSection === section ? "active" : ""}`}
      onClick={() => onClick(section)}
    >
      {getSectionIcon(section)}
      <span>{label}</span>
    </button>
  );
}

function InfoCard({
  title,
  value,
  description,
  accent = "default",
}: {
  title: string;
  value: string;
  description: string;
  accent?: "default" | "success" | "warm";
}) {
  return (
    <article className={`account-stat-card ${accent}`}>
      <span className="account-stat-label">{title}</span>
      <strong>{value}</strong>
      <p>{description}</p>
    </article>
  );
}

function EmptyPanel({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="account-empty-panel">
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export default function AccountPage() {
  const {
    currentUser,
    users,
    isAuthenticated,
    login,
    logout,
    register,
    resetPassword,
    updateProfile,
    changePassword,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
  } = useUser();
  const { vehicles, vehicle: activeVehicle, activateVehicle, removeVehicle } = useVehicle();
  const { reorderItems } = useCart();
  const [mode, setMode] = useState<AuthMode>("login");
  // HU-E17-03: filtro de historial por vehículo del garaje ("" = todos)
  const [orderVehicleFilter, setOrderVehicleFilter] = useState("");
  // HU-E17-02: mensaje de resultado al volver a pedir, ligado al pedido que lo generó
  const [reorderMessage, setReorderMessage] = useState<{ orderId: string; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<AccountSection>("overview");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<RegistrationFieldErrors>({});
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // HU-E09-03: recuperación de contraseña (simulada — no hay envío real de correo)
  const [recoverStep, setRecoverStep] = useState<"request" | "confirm" | "done">("request");
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverCode, setRecoverCode] = useState("");
  const [recoverCodeInput, setRecoverCodeInput] = useState("");
  const [recoverExpiresAt, setRecoverExpiresAt] = useState<number | null>(null);
  const [recoverNewPassword, setRecoverNewPassword] = useState("");

  // HU-E16-01/E16-04: edición de perfil y cambio de contraseña
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // HU-E16-02: libreta de direcciones
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const startRecovery = () => {
    setMode("recover");
    setRecoverStep("request");
    setRecoverEmail("");
    setRecoverCodeInput("");
    setRecoverNewPassword("");
    setError("");
    setSuccess("");
  };

  const requestRecoveryCode = () => {
    const code = generateSimulatedCode();
    setRecoverCode(code);
    setRecoverExpiresAt(Date.now() + RECOVERY_CODE_TTL_MS);
  };

  const handleRequestRecovery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = users.some((u) => u.email === recoverEmail.trim().toLowerCase());
    if (!found) {
      setError("No encontramos una cuenta con ese correo.");
      return;
    }
    setError("");
    requestRecoveryCode();
    setRecoverStep("confirm");
  };

  const handleConfirmRecovery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!recoverExpiresAt || Date.now() > recoverExpiresAt) {
      setError("Este código venció. Solicita uno nuevo.");
      return;
    }
    if (recoverCodeInput.trim() !== recoverCode) {
      setError("El código no coincide.");
      return;
    }
    const result = resetPassword(recoverEmail, recoverNewPassword);
    if (!result.ok) {
      setError(result.error || "No se pudo actualizar la contraseña.");
      return;
    }
    setError("");
    setRecoverStep("done");
  };

  // HU-E17-03: pedidos filtrados por vehículo, mostrando solo las líneas asociadas a él
  const filteredOrders = useMemo(() => {
    if (!currentUser) return [];

    return currentUser.orders
      .map((order: CustomerOrder) => {
        if (!orderVehicleFilter) {
          return { order, displayedItems: order.items, hiddenCount: 0 };
        }
        const displayedItems = order.items.filter(
          (item) => item.vehicle && vehicleFilterKey(item.vehicle) === orderVehicleFilter
        );
        return { order, displayedItems, hiddenCount: order.items.length - displayedItems.length };
      })
      .filter((entry) => entry.displayedItems.length > 0);
  }, [currentUser, orderVehicleFilter]);

  const handleReorder = (orderId: string, orderItems: OrderItemSnapshot[]) => {
    const result = reorderItems(orderItems);
    if (result.added === 0) {
      setReorderMessage({ orderId, text: "Ninguno de estos productos está disponible en este momento." });
      return;
    }
    const skippedNote =
      result.skipped.length > 0
        ? ` ${result.skipped.length} no se pudo agregar tal cual: ${result.skipped.map((s) => `${s.name} (${s.reason})`).join(", ")}.`
        : "";
    setReorderMessage({ orderId, text: `Agregamos ${result.added} producto(s) a tu carrito con el precio actual.${skippedNote}` });
  };

  const nextRewardMessage = useMemo(() => {
    if (!currentUser) {
      return null;
    }

    if (currentUser.loyalty.benefitStatus === "available") {
      return "Tu 10% de descuento ya está listo para aplicarse en la próxima compra.";
    }

    return `Te faltan ${formatPrice(currentUser.loyalty.nextRewardRemaining)} para desbloquear el beneficio.`;
  }, [currentUser]);

  const completionRate = useMemo(() => {
    if (!currentUser) {
      return 0;
    }

    return currentUser.loyalty.benefitStatus === "available"
      ? 100
      : Math.min(
          100,
          (currentUser.loyalty.progressSpent / currentUser.loyalty.threshold) * 100
        );
  }, [currentUser]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = login(loginData);

    if (!result.ok) {
      setError(result.error || "No fue posible iniciar sesión.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Sesión iniciada correctamente.");
  };

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = register(registerData);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors || {});
      setSuccess("");
      return;
    }

    setFieldErrors({});
    setSuccess("Cuenta creada correctamente.");
  };

  const switchToLoginWithEmail = (email: string) => {
    setMode("login");
    setLoginData({ email, password: "" });
    setFieldErrors({});
    setError("");
  };

  // Mantener el formulario de perfil sincronizado con los datos guardados
  useEffect(() => {
    if (currentUser) {
      setProfileForm({ name: currentUser.name, phone: currentUser.phone || "" });
    }
  }, [currentUser?.id, currentUser?.name, currentUser?.phone]);

  const handleProfileSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = updateProfile(profileForm);
    setProfileMessage(result.ok ? "Datos actualizados correctamente." : result.error || "No se pudo actualizar.");
  };

  const handlePasswordSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("La confirmación no coincide con la nueva contraseña.");
      setPasswordSuccess("");
      return;
    }
    const result = changePassword(passwordForm.current, passwordForm.next);
    if (!result.ok) {
      setPasswordError(result.error || "No se pudo cambiar la contraseña.");
      setPasswordSuccess("");
      return;
    }
    setPasswordError("");
    setPasswordSuccess("Contraseña actualizada correctamente.");
    setPasswordForm({ current: "", next: "", confirm: "" });
  };

  const openNewAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddressForm);
    setShowAddressForm(true);
  };

  const openEditAddressForm = (address: Address) => {
    setEditingAddressId(address.id);
    setAddressForm({
      label: address.label || "",
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      department: address.department,
      notes: address.notes || "",
    });
    setShowAddressForm(true);
  };

  const handleAddressSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingAddressId) {
      updateAddress(editingAddressId, addressForm);
    } else {
      addAddress(addressForm);
    }
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm(emptyAddressForm);
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="account-page account-auth-shell">
        <section className="account-auth-hero">
          <div className="account-auth-copy">
            <p className="account-eyebrow">Cuenta KGM Repuestos</p>
            <h1>Todo tu historial, beneficios y datos en un solo lugar</h1>
            <p>
              Accede a tus pedidos, guarda direcciones, revisa tu progreso de fidelización
              y mantén tu información lista para comprar más rápido.
            </p>

            <div className="account-auth-benefits">
              <div className="account-benefit-chip">
                {getSectionIcon("orders")}
                <span>Pedidos organizados</span>
              </div>
              <div className="account-benefit-chip">
                {getSectionIcon("addresses")}
                <span>Direcciones listas</span>
              </div>
              <div className="account-benefit-chip">
                {getSectionIcon("payments")}
                <span>Beneficios visibles</span>
              </div>
            </div>
          </div>

          <div className="account-auth-highlight">
            <div className="account-highlight-card">
              <span className="account-highlight-kicker">Fidelización</span>
              <strong>10% en tu próxima compra</strong>
              <p>Al superar {formatPrice(5000000)} activas un descuento único para el siguiente pedido.</p>
              <div className="account-highlight-meter" aria-hidden="true">
                <span />
              </div>
            </div>
          </div>
        </section>

        <section className="account-auth-card">
          {mode !== "recover" && (
            <div className="account-tabs">
              <button
                className={`account-tab ${mode === "login" ? "active" : ""}`}
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccess("");
                  setFieldErrors({});
                }}
                type="button"
              >
                Iniciar sesión
              </button>
              <button
                className={`account-tab ${mode === "register" ? "active" : ""}`}
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccess("");
                  setFieldErrors({});
                }}
                type="button"
              >
                Crear cuenta
              </button>
            </div>
          )}

          {error ? <p className="account-message error">{error}</p> : null}
          {success ? <p className="account-message success">{success}</p> : null}

          {mode === "login" && (
            <form className="account-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="login-email">Correo</label>
                <input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(event) =>
                    setLoginData((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Contraseña</label>
                <input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(event) =>
                    setLoginData((current) => ({ ...current, password: event.target.value }))
                  }
                  required
                />
              </div>
              <button type="button" className="link-button account-forgot-link" onClick={startRecovery}>
                ¿Olvidaste tu contraseña?
              </button>
              <button type="submit" className="btn-main account-submit-btn">
                Entrar a mi cuenta
              </button>
            </form>
          )}

          {mode === "register" && (
            <form className="account-form" onSubmit={handleRegister} noValidate>
              <div className="form-group">
                <label htmlFor="register-name">Nombre completo</label>
                <input
                  id="register-name"
                  type="text"
                  value={registerData.name}
                  onChange={(event) =>
                    setRegisterData((current) => ({ ...current, name: event.target.value }))
                  }
                  aria-invalid={!!fieldErrors.name}
                />
                {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="register-email">Correo</label>
                  <input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(event) =>
                      setRegisterData((current) => ({ ...current, email: event.target.value }))
                    }
                    aria-invalid={!!fieldErrors.email}
                  />
                  {fieldErrors.email && (
                    <span className="field-error">
                      {fieldErrors.email}
                      {fieldErrors.emailTaken && (
                        <>
                          {" "}
                          <button
                            type="button"
                            className="link-button"
                            onClick={() => switchToLoginWithEmail(registerData.email)}
                          >
                            Inicia sesión en su lugar
                          </button>
                        </>
                      )}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="register-phone">Teléfono</label>
                  <input
                    id="register-phone"
                    type="tel"
                    value={registerData.phone}
                    onChange={(event) =>
                      setRegisterData((current) => ({ ...current, phone: event.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="register-password">Contraseña</label>
                <input
                  id="register-password"
                  type="password"
                  value={registerData.password}
                  onChange={(event) =>
                    setRegisterData((current) => ({ ...current, password: event.target.value }))
                  }
                  aria-invalid={!!fieldErrors.password}
                />
                {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
              </div>
              <button type="submit" className="btn-main account-submit-btn">
                Crear cuenta
              </button>
            </form>
          )}

          {mode === "recover" && (
            <div className="account-form">
              <h2 className="account-recover-title">Recuperar acceso</h2>

              {recoverStep === "request" && (
                <form onSubmit={handleRequestRecovery}>
                  <div className="form-group">
                    <label htmlFor="recover-email">Correo de tu cuenta</label>
                    <input
                      id="recover-email"
                      type="email"
                      value={recoverEmail}
                      onChange={(event) => setRecoverEmail(event.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-main account-submit-btn">
                    Enviar código de recuperación
                  </button>
                  <button type="button" className="link-button account-back-link" onClick={() => setMode("login")}>
                    Volver a iniciar sesión
                  </button>
                </form>
              )}

              {recoverStep === "confirm" && (
                <form onSubmit={handleConfirmRecovery}>
                  <div className="simulated-recovery-note">
                    <span className="simulated-badge">Simulado — sin envío real de correo</span>
                    <p>
                      En la versión conectada, este código llegaría a <strong>{recoverEmail}</strong>. Como este es
                      un prototipo sin servicio de correo, aquí está directamente:
                    </p>
                    <p className="simulated-recovery-code">{recoverCode}</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="recover-code">Código de recuperación</label>
                    <input
                      id="recover-code"
                      type="text"
                      value={recoverCodeInput}
                      onChange={(event) => setRecoverCodeInput(event.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="recover-new-password">Nueva contraseña</label>
                    <input
                      id="recover-new-password"
                      type="password"
                      value={recoverNewPassword}
                      onChange={(event) => setRecoverNewPassword(event.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-main account-submit-btn">
                    Cambiar contraseña
                  </button>
                  <button type="button" className="link-button account-back-link" onClick={requestRecoveryCode}>
                    Reenviar código
                  </button>
                </form>
              )}

              {recoverStep === "done" && (
                <div className="account-recover-done">
                  <p>Tu contraseña se actualizó correctamente.</p>
                  <button type="button" className="btn-main account-submit-btn" onClick={() => switchToLoginWithEmail(recoverEmail)}>
                    Iniciar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="account-page">
      <section className="account-hero">
        <div className="account-hero-copy">
          <p className="account-eyebrow">Dashboard del cliente</p>
          <h1>Hola, {currentUser.name.split(" ")[0]}</h1>
          <p>
            Administra tus pedidos, datos de contacto y beneficios sin perder de vista tu
            progreso de compra.
          </p>
          <div className="account-hero-tags">
            <span className="account-hero-tag">{currentUser.orders.length} pedidos</span>
            <span className={`account-hero-tag ${currentUser.loyalty.benefitStatus === "available" ? "success" : ""}`}>
              {currentUser.loyalty.benefitStatus === "available" ? "Beneficio disponible" : "Beneficio en progreso"}
            </span>
          </div>
        </div>

        <div className="account-hero-panel">
          <div className="account-hero-panel-top">
            <span>Acumulado actual</span>
            <strong>{formatPrice(currentUser.loyalty.progressSpent)}</strong>
          </div>
          <div className="account-progress-bar" aria-hidden="true">
            <span style={{ width: `${completionRate}%` }} />
          </div>
          <p>{nextRewardMessage}</p>
        </div>
      </section>

      <div className="account-layout">
        <aside className="account-sidebar">
          <div className="account-sidebar-card">
            <div className="account-avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
            <h2>{currentUser.name}</h2>
            <p>{currentUser.email}</p>
            <button type="button" className="btn-outline full-width" onClick={logout}>
              Cerrar sesión
            </button>
          </div>

          <nav className="account-nav">
            <SectionButton section="overview" activeSection={activeSection} onClick={setActiveSection} label="Resumen" />
            <SectionButton section="orders" activeSection={activeSection} onClick={setActiveSection} label="Mis pedidos" />
            <SectionButton section="profile" activeSection={activeSection} onClick={setActiveSection} label="Datos personales" />
            <SectionButton section="addresses" activeSection={activeSection} onClick={setActiveSection} label="Direcciones" />
            <SectionButton section="garage" activeSection={activeSection} onClick={setActiveSection} label="Mi garaje" />
            <SectionButton section="payments" activeSection={activeSection} onClick={setActiveSection} label="Métodos de pago" />
          </nav>
        </aside>

        <main className="account-content">
          {activeSection === "overview" && (
            <>
              <section className="account-panel">
                <div className="account-panel-heading">
                  <div>
                    <p className="account-panel-kicker">Resumen</p>
                    <h2>Vista general de tu cuenta</h2>
                  </div>
                </div>

                <div className="account-stats-grid">
                  <InfoCard
                    title="Total acumulado"
                    value={formatPrice(currentUser.loyalty.lifetimeSpent)}
                    description="Histórico de compras registradas en esta cuenta."
                  />
                  <InfoCard
                    title="Estado del beneficio"
                    value={currentUser.loyalty.benefitStatus === "available" ? "Disponible" : "En progreso"}
                    description={nextRewardMessage || ""}
                    accent={currentUser.loyalty.benefitStatus === "available" ? "success" : "warm"}
                  />
                  <InfoCard
                    title="Direcciones guardadas"
                    value={String(currentUser.addresses.length)}
                    description="Gestiónalas desde la sección Direcciones."
                  />
                </div>
              </section>

              <section className="account-grid-duo">
                <article className="account-panel">
                  <div className="account-panel-heading">
                    <div>
                      <p className="account-panel-kicker">Fidelización</p>
                      <h2>Tu progreso hacia el descuento</h2>
                    </div>
                  </div>
                  <div className="account-loyalty-card">
                    <div className="account-loyalty-row">
                      <span>Meta</span>
                      <strong>{formatPrice(currentUser.loyalty.threshold)}</strong>
                    </div>
                    <div className="account-progress-bar" aria-hidden="true">
                      <span style={{ width: `${completionRate}%` }} />
                    </div>
                    <p>{nextRewardMessage}</p>
                  </div>
                </article>

                <article className="account-panel">
                  <div className="account-panel-heading">
                    <div>
                      <p className="account-panel-kicker">Actividad</p>
                      <h2>Último pedido</h2>
                    </div>
                  </div>
                  {currentUser.orders[0] ? (
                    <div className="account-spotlight-card">
                      <div className="account-spotlight-top">
                        <strong>{currentUser.orders[0].id}</strong>
                        <span className={`order-status ${currentUser.orders[0].status}`}>
                          {getStatusLabel(currentUser.orders[0].status)}
                        </span>
                      </div>
                      <p>{formatDate(currentUser.orders[0].createdAt)}</p>
                      <strong className="account-spotlight-total">
                        {formatPrice(currentUser.orders[0].total)}
                      </strong>
                    </div>
                  ) : (
                    <EmptyPanel
                      title="Aún no hay actividad"
                      description="Tu próximo pedido aparecerá aquí como resumen rápido."
                    />
                  )}
                </article>
              </section>
            </>
          )}

          {activeSection === "orders" && (
            <section className="account-panel">
              <div className="account-panel-heading">
                <div>
                  <p className="account-panel-kicker">Pedidos</p>
                  <h2>Mis pedidos</h2>
                </div>
                <span className="account-panel-badge">{currentUser.orders.length} registrados</span>
              </div>

              {/* HU-E17-03: filtrar el historial por vehículo del garaje */}
              {vehicles.length > 0 && currentUser.orders.length > 0 && (
                <div className="form-group orders-vehicle-filter">
                  <label htmlFor="orders-vehicle-filter">Filtrar por vehículo</label>
                  <select
                    id="orders-vehicle-filter"
                    value={orderVehicleFilter}
                    onChange={(e) => setOrderVehicleFilter(e.target.value)}
                  >
                    <option value="">Todos los pedidos</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={vehicleFilterKey(v)}>
                        {v.brand} {v.model} {v.year}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {currentUser.orders.length === 0 ? (
                <EmptyPanel
                  title="Todavía no tienes pedidos"
                  description="Cuando completes tu primera compra, aparecerá aquí con fecha, estado y detalle."
                  action={<Link href="/repuestos" className="btn-main">Explorar repuestos</Link>}
                />
              ) : filteredOrders.length === 0 ? (
                <EmptyPanel
                  title="Ningún pedido asociado a este vehículo"
                  description="Los productos que agregues al carrito con este vehículo activo aparecerán aquí en tu próxima compra."
                />
              ) : (
                <div className="orders-list">
                  {filteredOrders.map(({ order, displayedItems, hiddenCount }) => (
                    <details key={order.id} className="order-card">
                      <summary>
                        <div className="order-summary-main">
                          <strong>{order.id}</strong>
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="order-summary-meta">
                          <span className={`order-status ${order.status}`}>{getStatusLabel(order.status)}</span>
                          <strong>{formatPrice(order.total)}</strong>
                        </div>
                      </summary>

                      <div className="order-card-body">
                        <OrderStatusTimeline status={order.status} orderId={order.id} />

                        <div className="order-breakdown-grid">
                          <div><span>Subtotal</span><strong>{formatPrice(order.subtotal)}</strong></div>
                          <div><span>Envío</span><strong>{formatPrice(order.shipping)}</strong></div>
                          <div><span>Descuento</span><strong>{order.discount > 0 ? `-${formatPrice(order.discount)}` : "No aplica"}</strong></div>
                        </div>

                        {hiddenCount > 0 && (
                          <p className="orders-vehicle-filter-note">
                            Este pedido incluye {hiddenCount} producto(s) más no asociados a este vehículo.
                          </p>
                        )}

                        <div className="order-products">
                          {displayedItems.map((item) => (
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

                        {reorderMessage?.orderId === order.id && (
                          <p className="account-message success">{reorderMessage.text}</p>
                        )}
                        <button type="button" className="btn-outline" onClick={() => handleReorder(order.id, displayedItems)}>
                          Volver a pedir {hiddenCount > 0 ? "estos productos" : ""}
                        </button>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeSection === "profile" && (
            <>
              {/* HU-E16-01: editar datos personales. El correo no es editable aquí (se marca explícitamente). */}
              <section className="account-panel">
                <div className="account-panel-heading">
                  <div>
                    <p className="account-panel-kicker">Perfil</p>
                    <h2>Datos personales</h2>
                  </div>
                </div>

                <form className="account-form" onSubmit={handleProfileSave}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="profile-name">Nombre</label>
                      <input
                        id="profile-name"
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-phone">Teléfono</label>
                      <input
                        id="profile-phone"
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-email">Correo</label>
                    <input id="profile-email" type="email" value={currentUser.email} disabled readOnly />
                    <span className="field-note">
                      El correo no se puede cambiar desde aquí. Escríbenos a soporte si necesitas actualizarlo.
                    </span>
                  </div>
                  <div className="form-group">
                    <label>Miembro desde</label>
                    <input type="text" value={formatDate(currentUser.createdAt)} disabled readOnly />
                  </div>
                  {profileMessage && (
                    <p className={`account-message ${profileMessage.startsWith("Datos") ? "success" : "error"}`}>
                      {profileMessage}
                    </p>
                  )}
                  <button type="submit" className="btn-main account-submit-btn">
                    Guardar cambios
                  </button>
                </form>
              </section>

              {/* HU-E16-04: exige confirmar la contraseña actual */}
              <section className="account-panel">
                <div className="account-panel-heading">
                  <div>
                    <p className="account-panel-kicker">Seguridad</p>
                    <h2>Cambiar contraseña</h2>
                  </div>
                </div>

                <form className="account-form" onSubmit={handlePasswordSave}>
                  <div className="form-group">
                    <label htmlFor="current-password">Contraseña actual</label>
                    <input
                      id="current-password"
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="new-password">Nueva contraseña</label>
                      <input
                        id="new-password"
                        type="password"
                        value={passwordForm.next}
                        onChange={(e) => setPasswordForm((f) => ({ ...f, next: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirm-password">Confirmar nueva contraseña</label>
                      <input
                        id="confirm-password"
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  {passwordError && <p className="account-message error">{passwordError}</p>}
                  {passwordSuccess && <p className="account-message success">{passwordSuccess}</p>}
                  <button type="submit" className="btn-main account-submit-btn">
                    Actualizar contraseña
                  </button>
                </form>
              </section>
            </>
          )}

          {activeSection === "addresses" && (
            <section className="account-panel">
              <div className="account-panel-heading">
                <div>
                  <p className="account-panel-kicker">Direcciones</p>
                  <h2>Mis direcciones</h2>
                </div>
                {!showAddressForm && (
                  <button type="button" className="btn-main" onClick={openNewAddressForm}>
                    Agregar dirección
                  </button>
                )}
              </div>

              {showAddressForm && (
                <form className="account-form" onSubmit={handleAddressSave}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="addr-label">Nombre de la dirección (ej. Casa, Oficina)</label>
                      <input
                        id="addr-label"
                        type="text"
                        value={addressForm.label}
                        onChange={(e) => setAddressForm((f) => ({ ...f, label: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="addr-fullname">Nombre de quien recibe</label>
                      <input
                        id="addr-fullname"
                        type="text"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm((f) => ({ ...f, fullName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="addr-address">Dirección</label>
                    <input
                      id="addr-address"
                      type="text"
                      value={addressForm.address}
                      onChange={(e) => setAddressForm((f) => ({ ...f, address: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="addr-city">Ciudad</label>
                      <input
                        id="addr-city"
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="addr-department">Departamento</label>
                      <input
                        id="addr-department"
                        type="text"
                        value={addressForm.department}
                        onChange={(e) => setAddressForm((f) => ({ ...f, department: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="addr-phone">Teléfono de contacto</label>
                      <input
                        id="addr-phone"
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm((f) => ({ ...f, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="addr-notes">Notas de entrega (opcional)</label>
                    <input
                      id="addr-notes"
                      type="text"
                      value={addressForm.notes}
                      onChange={(e) => setAddressForm((f) => ({ ...f, notes: e.target.value }))}
                    />
                  </div>
                  <div className="account-form-actions">
                    <button type="submit" className="btn-main account-submit-btn">
                      {editingAddressId ? "Guardar cambios" : "Guardar dirección"}
                    </button>
                    <button type="button" className="btn-outline" onClick={() => setShowAddressForm(false)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              {!showAddressForm && currentUser.addresses.length === 0 && (
                <EmptyPanel
                  title="No tienes direcciones guardadas"
                  description="Agrega una dirección para usarla más rápido en tus próximos pedidos."
                  action={<button type="button" className="btn-main" onClick={openNewAddressForm}>Agregar dirección</button>}
                />
              )}

              {!showAddressForm && currentUser.addresses.length > 0 && (
                <div className="account-detail-grid">
                  {currentUser.addresses.map((address) => (
                    <article key={address.id} className={`account-address-card ${address.isDefault ? "default" : ""}`}>
                      <div className="account-address-top">
                        <span className="account-address-badge">{address.label || "Dirección"}</span>
                        {address.isDefault && <span className="account-address-default-badge">Predeterminada</span>}
                      </div>
                      <strong>{address.fullName}</strong>
                      <p>{address.address}</p>
                      <p>{address.city}, {address.department}</p>
                      <p>{address.phone}</p>
                      {address.notes ? <span className="account-note-pill">{address.notes}</span> : null}
                      <div className="account-address-actions">
                        <button type="button" className="link-button" onClick={() => openEditAddressForm(address)}>
                          Editar
                        </button>
                        {!address.isDefault && (
                          <button type="button" className="link-button" onClick={() => setDefaultAddress(address.id)}>
                            Marcar predeterminada
                          </button>
                        )}
                        <button type="button" className="link-button account-address-remove" onClick={() => removeAddress(address.id)}>
                          Eliminar
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeSection === "garage" && (
            <section className="account-panel">
              <div className="account-panel-heading">
                <div>
                  <p className="account-panel-kicker">Vehículos</p>
                  <h2>Mi garaje</h2>
                </div>
              </div>

              {vehicles.length === 0 ? (
                <EmptyPanel
                  title="No tienes vehículos guardados"
                  description="Identifica tu vehículo desde cualquier página para verlo aquí y consultar compatibilidad más rápido."
                  action={<Link href="/repuestos" className="btn-main">Explorar repuestos</Link>}
                />
              ) : (
                <div className="account-detail-grid">
                  {vehicles.map((v) => {
                    const isActive =
                      activeVehicle?.brand === v.brand &&
                      activeVehicle?.model === v.model &&
                      activeVehicle?.year === v.year &&
                      activeVehicle?.plate === v.plate &&
                      activeVehicle?.vin === v.vin;
                    return (
                      <article key={v.id} className={`account-address-card ${isActive ? "default" : ""}`}>
                        <div className="account-address-top">
                          <span className="account-address-badge">{v.brand} {v.model}</span>
                          {isActive && <span className="account-address-default-badge">Activo</span>}
                        </div>
                        <strong>{v.brand} {v.model} {v.year}</strong>
                        {v.plate && <p>Placa {v.plate}</p>}
                        {v.approximateMatch && <span className="account-note-pill">Versión sin confirmar</span>}
                        <div className="account-address-actions">
                          {!isActive && (
                            <button type="button" className="link-button" onClick={() => activateVehicle(v.id)}>
                              Usar
                            </button>
                          )}
                          <button type="button" className="link-button account-address-remove" onClick={() => removeVehicle(v.id)}>
                            Quitar del garaje
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {activeSection === "payments" && (
            <section className="account-panel">
              <div className="account-panel-heading">
                <div>
                  <p className="account-panel-kicker">Pagos</p>
                  <h2>Métodos de pago</h2>
                </div>
              </div>

              <EmptyPanel
                title="Aún no guardas métodos de pago"
                description="La estructura ya está lista para integrar tarjetas o medios guardados cuando conectemos un backend o pasarela."
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
