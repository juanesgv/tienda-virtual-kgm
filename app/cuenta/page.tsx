"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import { formatPrice } from "../data/products";
import { useUser } from "../context/UserContext";

type AccountSection = "overview" | "orders" | "profile" | "addresses" | "payments";

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
  const { currentUser, isAuthenticated, login, logout, register } = useUser();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [activeSection, setActiveSection] = useState<AccountSection>("overview");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const addresses = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    const uniqueAddresses = new Map<string, {
      address: string;
      city: string;
      department: string;
      fullName: string;
      phone: string;
      notes?: string;
    }>();

    currentUser.orders.forEach((order) => {
      const key = `${order.shippingAddress.address}-${order.shippingAddress.city}-${order.shippingAddress.department}`;
      if (!uniqueAddresses.has(key)) {
        uniqueAddresses.set(key, order.shippingAddress);
      }
    });

    return Array.from(uniqueAddresses.values());
  }, [currentUser]);

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
      setError(result.error || "No fue posible crear la cuenta.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Cuenta creada correctamente.");
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
          <div className="account-tabs">
            <button
              className={`account-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
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
              }}
              type="button"
            >
              Crear cuenta
            </button>
          </div>

          {error ? <p className="account-message error">{error}</p> : null}
          {success ? <p className="account-message success">{success}</p> : null}

          {mode === "login" ? (
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
              <button type="submit" className="btn-main account-submit-btn">
                Entrar a mi cuenta
              </button>
            </form>
          ) : (
            <form className="account-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="register-name">Nombre completo</label>
                <input
                  id="register-name"
                  type="text"
                  value={registerData.name}
                  onChange={(event) =>
                    setRegisterData((current) => ({ ...current, name: event.target.value }))
                  }
                  required
                />
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
                    required
                  />
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
                  required
                />
              </div>
              <button type="submit" className="btn-main account-submit-btn">
                Crear cuenta
              </button>
            </form>
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
                    value={String(addresses.length)}
                    description="Tomadas de tus pedidos para reutilizarlas en próximas compras."
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

              {currentUser.orders.length === 0 ? (
                <EmptyPanel
                  title="Todavía no tienes pedidos"
                  description="Cuando completes tu primera compra, aparecerá aquí con fecha, estado y detalle."
                  action={<Link href="/repuestos" className="btn-main">Explorar repuestos</Link>}
                />
              ) : (
                <div className="orders-list">
                  {currentUser.orders.map((order) => (
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
                        <div className="order-breakdown-grid">
                          <div><span>Subtotal</span><strong>{formatPrice(order.subtotal)}</strong></div>
                          <div><span>Envío</span><strong>{formatPrice(order.shipping)}</strong></div>
                          <div><span>Descuento</span><strong>{order.discount > 0 ? `-${formatPrice(order.discount)}` : "No aplica"}</strong></div>
                        </div>

                        <div className="order-products">
                          {order.items.map((item) => (
                            <div key={`${order.id}-${item.productId}`} className="order-product-row">
                              <div className="order-product-copy">
                                <strong>{item.name}</strong>
                                <p>Ref: {item.sku}</p>
                              </div>
                              <div className="order-product-meta">
                                <span>{item.quantity} x {formatPrice(item.price)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeSection === "profile" && (
            <section className="account-panel">
              <div className="account-panel-heading">
                <div>
                  <p className="account-panel-kicker">Perfil</p>
                  <h2>Datos personales</h2>
                </div>
              </div>

              <div className="account-detail-grid">
                <article className="account-detail-card">
                  <span>Nombre</span>
                  <strong>{currentUser.name}</strong>
                </article>
                <article className="account-detail-card">
                  <span>Correo</span>
                  <strong>{currentUser.email}</strong>
                </article>
                <article className="account-detail-card">
                  <span>Teléfono</span>
                  <strong>{currentUser.phone || "Aún no registrado"}</strong>
                </article>
                <article className="account-detail-card">
                  <span>Miembro desde</span>
                  <strong>{formatDate(currentUser.createdAt)}</strong>
                </article>
              </div>
            </section>
          )}

          {activeSection === "addresses" && (
            <section className="account-panel">
              <div className="account-panel-heading">
                <div>
                  <p className="account-panel-kicker">Direcciones</p>
                  <h2>Direcciones recientes</h2>
                </div>
              </div>

              {addresses.length === 0 ? (
                <EmptyPanel
                  title="No tienes direcciones guardadas"
                  description="Se irán registrando automáticamente con cada pedido confirmado."
                />
              ) : (
                <div className="account-detail-grid">
                  {addresses.map((address, index) => (
                    <article key={`${address.address}-${index}`} className="account-address-card">
                      <div className="account-address-top">
                        <span className="account-address-badge">Dirección {index + 1}</span>
                      </div>
                      <strong>{address.fullName}</strong>
                      <p>{address.address}</p>
                      <p>{address.city}, {address.department}</p>
                      <p>{address.phone}</p>
                      {address.notes ? <span className="account-note-pill">{address.notes}</span> : null}
                    </article>
                  ))}
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
