"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProductById, formatPrice, getCompatibilityStatus, getCompatibilityDetail } from "../../data/products";
import { useVehicle } from "../../context/VehicleContext";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import VehicleModal from "../../components/VehicleModal";
import ProductCard from "../../components/ProductCard";
import IncompatibleAddModal from "../../components/IncompatibleAddModal";
import ProductComplements from "../../components/ProductComplements";
import ServiceUnavailable from "../../components/ServiceUnavailable";
import { products } from "../../data/products";
import { useServiceStatus } from "../../context/ServiceStatusContext";
import { useAdvisor } from "../../context/AdvisorContext";

export default function ProductDetailPage() {
  const params = useParams();
  const { vehicle, isVehicleSaved } = useVehicle();
  const { openAdvisor } = useAdvisor();
  const { addToCart } = useCart();
  const { isAuthenticated } = useUser();
  const { isInventoryDown } = useServiceStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("descripcion");
  const [quantity, setQuantity] = useState(1);
  const [mainImageError, setMainImageError] = useState(false);
  const [notifyRequested, setNotifyRequested] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const [showIncompatibleConfirm, setShowIncompatibleConfirm] = useState(false);

  const product = getProductById(params.id as string);

  // Al navegar entre productos, no arrastrar la cantidad/estado del producto anterior
  useEffect(() => {
    setQuantity(1);
    setNotifyRequested(false);
    setAddedNotice(null);
  }, [product?.id]);

  // Productos relacionados (misma categoría, excluyendo el actual)
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 3);

  // HU-E40: si el inventario está caído, ni siquiera podemos confirmar si el producto existe
  if (isInventoryDown) {
    return (
      <ServiceUnavailable
        title="No pudimos cargar este repuesto"
        description="Estamos teniendo problemas para conectarnos con el sistema de inventario. Intenta de nuevo en unos minutos."
      />
    );
  }

  if (!product) {
    return (
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <h1>Producto no encontrado</h1>
        <Link href="/repuestos" style={{ color: "var(--color-primary)" }}>
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // HU-E13-01: referencia descontinuada — accesible por enlace directo, pero no se vende
  if (product.discontinued) {
    const sameCategoryAlternatives = products.filter((p) => p.category === product.category).slice(0, 3);
    return (
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <h1>Esta referencia ya no está disponible</h1>
        <p style={{ color: "var(--color-gray-600)", marginTop: "12px", marginBottom: "32px" }}>
          <strong>{product.name} ({product.sku})</strong> fue descontinuada y ya no se vende. Si buscabas este
          repuesto para tu vehículo, aquí tienes otras opciones de la misma categoría.
        </p>
        {sameCategoryAlternatives.length > 0 && (
          <div className="products-grid" style={{ marginBottom: "32px" }}>
            {sameCategoryAlternatives.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <Link href="/repuestos" className="btn-main">
          Ver todos los repuestos
        </Link>
      </div>
    );
  }

  // HU-E07-02: 3 estados — compatible / no compatible / sin confirmar (nunca se trata como rechazo)
  // El motivo viene del dato (año, motor, aplicabilidad), no de una etiqueta: así el cliente ve por qué.
  const compatibilityDetail = vehicle ? getCompatibilityDetail(product, vehicle) : null;
  const compatibilityStatus = compatibilityDetail?.status ?? null;
  const isCompatible = compatibilityStatus === "compatible";
  const isUnknownCompatibility = compatibilityStatus === "unknown";
  const reasonText = (() => {
    switch (compatibilityDetail?.reason) {
      case "no_data":
        return "Todavía no hay información de aplicabilidad cargada para este repuesto.";
      case "engine_unconfirmed":
        return "Aplica a tu modelo y año, pero depende del motor y no has indicado el tuyo.";
      case "year_out_of_range":
        return `Este repuesto aplica a ${compatibilityDetail.applicableYears}; tu vehículo es ${vehicle?.year}.`;
      case "engine_mismatch":
        return "Aplica a tu modelo y año, pero con otro motor.";
      case "model_not_listed":
        return "Tu modelo no está entre los vehículos a los que aplica.";
      default:
        return null;
    }
  })();

  // HU-E07-04: si este repuesto no sirve para el vehículo, ofrecer alternativas que sí sirvan
  const compatibleAlternatives =
    compatibilityStatus === "not_compatible" && vehicle
      ? products
          .filter((p) => p.category === product.category && p.id !== product.id && getCompatibilityStatus(p, vehicle) === "compatible")
          .slice(0, 3)
      : [];
  const showingAlternatives = compatibilityStatus === "not_compatible" && compatibleAlternatives.length > 0;
  const displayedRelatedProducts = showingAlternatives ? compatibleAlternatives : relatedProducts;

  const performAddToCart = () => {
    // HU-E17-03: la asociación producto-vehículo nace aquí, en el momento de agregar al carrito
    const vehicleSnapshot = isVehicleSaved && vehicle ? { brand: vehicle.brand, model: vehicle.model, year: vehicle.year } : undefined;
    const result = addToCart(product, quantity, vehicleSnapshot);
    setAddedNotice(
      result.limitedTo
        ? `Solo agregamos ${result.limitedTo} unidades: es lo máximo disponible.`
        : `${quantity} ${quantity === 1 ? "unidad agregada" : "unidades agregadas"} al carrito.`
    );
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="page-header product-page">
        <div className="breadcrumb">
          <Link href="/">Inicio</Link>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
          <Link href="/repuestos">Repuestos</Link>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
          <span>{product.name}</span>
        </div>
      </div>

      {/* Producto Principal */}
      <div className="product-detail-layout">
        {/* Galería */}
        <div className="product-gallery">
          <div className="main-image">
            <div className="product-image-large">
              {product.image && !mainImageError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  onError={() => setMainImageError(true)}
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="160" height="160">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Info del Producto */}
        <div className="product-info-detail">
          {/* Banner de compatibilidad: 3 estados reales */}
          {isVehicleSaved && (
            <div className={`compatibility-banner ${isCompatible ? "compatible" : isUnknownCompatibility ? "unknown" : "not-compatible"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path
                  d={
                    isCompatible
                      ? "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      : isUnknownCompatibility
                      ? "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"
                      : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  }
                />
              </svg>
              <div className="banner-content">
                <span className="banner-title">
                  {isCompatible
                    ? "Compatible con tu vehículo"
                    : isUnknownCompatibility
                    ? "Debe verificarse con tu vehículo"
                    : "No compatible con tu vehículo"}
                </span>
                <span className="banner-text">
                  {isCompatible && (
                    <>Este repuesto es compatible con tu <strong>{vehicle?.brand} {vehicle?.model} {vehicle?.year}</strong>.</>
                  )}
                  {isUnknownCompatibility && (
                    <>
                      No tenemos confirmado si este repuesto sirve para tu <strong>{vehicle?.brand} {vehicle?.model} {vehicle?.year}</strong>.
                      No significa que no sea compatible — significa que aún debe verificarse. {reasonText}
                    </>
                  )}
                  {!isCompatible && !isUnknownCompatibility && (
                    <>Este repuesto no es compatible con tu <strong>{vehicle?.brand} {vehicle?.model} {vehicle?.year}</strong>. {reasonText}</>
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="product-header">
            <span className="product-category">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              {" > "}
              {product.subcategory}
            </span>
            <h1>{product.name}</h1>
            <div className="product-meta-header">
              <span className="sku">Referencia: {product.sku}</span>
              <span className="separator">|</span>
              <span className="brand">Marca: KGM Original</span>
            </div>
          </div>

          <div className="product-price-section">
            <span className="price">{formatPrice(product.price)}</span>
            <span className="price-note">IVA incluido</span>
          </div>

          <div className="product-stock">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>
              {product.stock === "in_stock"
                ? "En stock - Disponible para envío inmediato"
                : product.stock === "low_stock"
                ? product.stockQuantity
                  ? `Pocos disponibles - quedan ${product.stockQuantity} unidades`
                  : "Pocos disponibles"
                : "Agotado"}
            </span>
          </div>

          {/* HU-E06-01/E06-04/E13-01/E13-02: sin stock no se puede agregar; la cantidad no puede superar lo disponible */}
          {product.stock !== "out_of_stock" ? (
            <div className="product-actions">
              <div className="quantity-selector">
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  -
                </button>
                <input type="number" value={quantity} min="1" readOnly />
                <button
                  className="qty-btn"
                  onClick={() => setQuantity((q) => (product.stockQuantity ? Math.min(product.stockQuantity, q + 1) : q + 1))}
                  disabled={!!product.stockQuantity && quantity >= product.stockQuantity}
                >
                  +
                </button>
              </div>
              <button
                className="btn-add-to-cart"
                onClick={() => {
                  // HU-E10-04: pedir confirmación antes de agregar un repuesto no compatible
                  if (compatibilityStatus === "not_compatible") {
                    setShowIncompatibleConfirm(true);
                    return;
                  }
                  performAddToCart();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
                Agregar al carrito
              </button>
            </div>
          ) : (
            // HU-E13-03: producto agotado — ofrecer avisar cuando vuelva a haber stock
            <div className="product-actions out-of-stock-actions">
              {!notifyRequested ? (
                isAuthenticated ? (
                  <button className="btn-add-to-cart" onClick={() => setNotifyRequested(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                    </svg>
                    Avísame cuando esté disponible
                  </button>
                ) : (
                  <div className="notify-login-hint">
                    <p>Este repuesto está agotado. Inicia sesión para que te avisemos cuando vuelva a haber stock.</p>
                    <Link href="/cuenta" className="btn-outline">
                      Iniciar sesión
                    </Link>
                  </div>
                )
              ) : (
                <div className="notify-confirmed">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>Te avisaremos por correo cuando este repuesto vuelva a estar disponible.</span>
                </div>
              )}
            </div>
          )}

          {addedNotice && (
            <p className={`added-to-cart-notice ${addedNotice.startsWith("Solo") ? "limited" : ""}`}>{addedNotice}</p>
          )}

          <div className="product-benefits">
            <div className="benefit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <span>Garantía de 12 meses</span>
            </div>
            <div className="benefit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" />
              </svg>
              <span>Envío a todo Colombia</span>
            </div>
            <div className="benefit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
              </svg>
              <span>Devolución en 30 días</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Compatibilidad */}
      <section className="compatibility-section">
        <div className="section-header-with-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
          </svg>
          <h2>Compatibilidad</h2>
        </div>

        <div className="compatibility-content">
          {/* Estado actual: 3 estados reales */}
          <div className={`compatibility-status ${isCompatible ? "compatible" : ""} ${isUnknownCompatibility ? "unknown" : ""}`}>
            <div className="status-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                <path
                  d={
                    isCompatible
                      ? "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      : isUnknownCompatibility
                      ? "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"
                      : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  }
                />
              </svg>
            </div>
            <div className="status-text">
              <h3>
                {!isVehicleSaved
                  ? "Verifica la compatibilidad con tu vehículo"
                  : isCompatible
                  ? "Este repuesto es compatible con tu vehículo"
                  : isUnknownCompatibility
                  ? "Aún no podemos confirmar la compatibilidad"
                  : "Este repuesto no es compatible con tu vehículo"}
              </h3>
              <p>
                {!isVehicleSaved && "Guarda tu vehículo para verificar si este repuesto es compatible."}
                {isVehicleSaved && isCompatible && (
                  <>
                    Hemos verificado que el <strong>{product.name} ({product.sku})</strong> es compatible con tu{" "}
                    <strong>{vehicle?.brand} {vehicle?.model} {vehicle?.year}</strong>.
                  </>
                )}
                {isVehicleSaved && isUnknownCompatibility && (
                  <>
                    Nuestros datos para el <strong>{product.name} ({product.sku})</strong> todavía no confirman ni
                    descartan que sirva para tu <strong>{vehicle?.brand} {vehicle?.model} {vehicle?.year}</strong>.
                    {reasonText} Te recomendamos confirmarlo con un asesor antes de instalarlo.
                  </>
                )}
                {isVehicleSaved && !isCompatible && !isUnknownCompatibility && (
                  <>
                    Hemos verificado que el <strong>{product.name} ({product.sku})</strong> no es compatible con tu{" "}
                    <strong>{vehicle?.brand} {vehicle?.model} {vehicle?.year}</strong>. {reasonText}
                  </>
                )}
              </p>
              {isVehicleSaved && !isCompatible && (
                <button
                  type="button"
                  className="link-button advisor-cta"
                  onClick={() => openAdvisor({ origin: "product_compat", product: { id: product.id, name: product.name, sku: product.sku } })}
                >
                  Confirmar compatibilidad con un asesor
                </button>
              )}
            </div>
          </div>

          {/* Lista de vehículos compatibles */}
          <div className="compatible-vehicles">
            <h3>Vehículos compatibles con este repuesto</h3>
            {product.compatibleVehicles.length === 0 && (
              <p className="compatibility-data-note">
                Todavía no hay información de aplicabilidad cargada para este repuesto. Revisa la descripción o
                confírmalo con un asesor antes de comprarlo.
              </p>
            )}
            <div className="vehicles-grid">
              {product.compatibleVehicles.map((v, index) => (
                <div
                  key={index}
                  className={`vehicle-card ${
                    vehicle?.brand === v.brand && vehicle?.model === v.model ? "highlighted" : ""
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span className="vehicle-name">{v.brand} {v.model}</span>
                  <span className="vehicle-years">{v.years}</span>
                  {vehicle?.brand === v.brand && vehicle?.model === v.model && (
                    <span className="your-vehicle-badge">Tu vehículo</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Verificar otro vehículo */}
          <div className="verify-another-vehicle">
            <h4>¿Quieres verificar compatibilidad con otro vehículo?</h4>
            <div className="verify-actions">
              <button className="btn-outline" onClick={() => setIsModalOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
                </svg>
                Cambiar vehículo guardado
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs de Detalles */}
      <section className="product-details-tabs">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "descripcion" ? "active" : ""}`}
            onClick={() => setActiveTab("descripcion")}
          >
            Descripción
          </button>
          <button
            className={`tab-btn ${activeTab === "especificaciones" ? "active" : ""}`}
            onClick={() => setActiveTab("especificaciones")}
          >
            Especificaciones
          </button>
          <button
            className={`tab-btn ${activeTab === "compatibilidad" ? "active" : ""}`}
            onClick={() => setActiveTab("compatibilidad")}
          >
            Compatibilidad completa
          </button>
        </div>

        {activeTab === "descripcion" && (
          <div className="tab-panel active">
            <div className="description-content">
              <h3>{product.name} original KGM</h3>
              <p>{product.description}</p>
              <p>
                Este repuesto es fabricado con los más altos estándares de calidad para garantizar
                el óptimo funcionamiento de tu vehículo. Todos nuestros productos cuentan con garantía
                oficial KGM.
              </p>

              <div className="recommendation-box">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <p>
                  <strong>Recomendación:</strong> Consulta el manual de tu vehículo para conocer los
                  intervalos de mantenimiento recomendados.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "especificaciones" && (
          <div className="tab-panel active">
            <table className="specs-table">
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <th>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "compatibilidad" && (
          <div className="tab-panel active">
            <div className="full-compatibility">
              <h4>Lista completa de vehículos compatibles</h4>
              {product.compatibleVehicles.length === 0 && (
                <p className="compatibility-data-note">
                  Todavía no hay información de aplicabilidad cargada para este repuesto.
                </p>
              )}
              <div className="compatibility-table-wrapper">
                <table className="compatibility-table">
                  <thead>
                    <tr>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>Años</th>
                      <th>Motor</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.compatibleVehicles.map((v, index) => (
                      <tr
                        key={index}
                        className={
                          vehicle?.brand === v.brand && vehicle?.model === v.model ? "highlight" : ""
                        }
                      >
                        <td>{v.brand}</td>
                        <td>{v.model}</td>
                        <td>{v.years}</td>
                        <td>{v.engine || "N/A"}</td>
                        <td>
                          <span
                            className={`badge ${
                              vehicle?.brand === v.brand && vehicle?.model === v.model
                                ? "compatible"
                                : ""
                            }`}
                          >
                            {vehicle?.brand === v.brand && vehicle?.model === v.model
                              ? "Tu vehículo"
                              : "Compatible"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* HU-E07-04: si el producto no es compatible, priorizar alternativas que sí lo sean.
          Sin alternativas, se ofrece asesor — vista simulada, el canal real aún no está definido (E21/E22/E54). */}
      {compatibilityStatus === "not_compatible" && !showingAlternatives && (
        <section className="related-products">
          <div className="section-header">
            <h2>No encontramos alternativas compatibles</h2>
            <p>
              No tenemos otro repuesto de esta categoría confirmado como compatible con tu{" "}
              {vehicle?.brand} {vehicle?.model} en este momento.
            </p>
          </div>
          <button
            type="button"
            className="link-button"
            onClick={() => openAdvisor({ origin: "product_no_alternatives", product: { id: product.id, name: product.name, sku: product.sku } })}
          >
            Habla con un asesor sobre este repuesto
          </button>
        </section>
      )}

      {/* E55: complementos para instalar (corrección, no venta cruzada). Distinto de "otros repuestos" (E28). */}
      {!product.discontinued && (
        <ProductComplements key={`${product.id}-${vehicle ? `${vehicle.brand}${vehicle.model}${vehicle.year}${vehicle.engine ?? ""}` : "sin-vehiculo"}`} product={product} />
      )}

      {/* Productos Relacionados / Alternativas compatibles */}
      {displayedRelatedProducts.length > 0 && (
        <section className="related-products">
          <div className="section-header">
            <h2>{showingAlternatives ? "Alternativas compatibles con tu vehículo" : "Otros repuestos de esta categoría"}</h2>
            <p>
              {showingAlternatives
                ? `Estas sí están confirmadas para tu ${vehicle?.brand} ${vehicle?.model}`
                : "Para comparar opciones; no son complementos de instalación"}
            </p>
          </div>

          <div className="products-grid">
            {displayedRelatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}

      <VehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {showIncompatibleConfirm && vehicle && (
        <IncompatibleAddModal
          productName={product.name}
          vehicleLabel={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
          onCancel={() => setShowIncompatibleConfirm(false)}
          onConfirm={() => {
            performAddToCart();
            setShowIncompatibleConfirm(false);
          }}
        />
      )}
    </>
  );
}
