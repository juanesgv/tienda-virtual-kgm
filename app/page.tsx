"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, products, formatPrice } from "./data/products";
import { FREE_SHIPPING_THRESHOLD } from "./data/shipping";
import ProductCard from "./components/ProductCard";
import CategoryIcon from "./components/CategoryIcon";
import VehicleModal from "./components/VehicleModal";
import QuickVehicleForm from "./components/QuickVehicleForm";
import { useVehicle } from "./context/VehicleContext";
import { useServiceStatus } from "./context/ServiceStatusContext";
import { useAdvisor } from "./context/AdvisorContext";

// Imagen del banner: MARCADOR (misma fuente que las fotos de producto). Se reemplaza por la imagen real
// cuando exista; debe ser decorativa y sin texto incrustado (el texto va como HTML).
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1697855532251-8102356a2175?auto=format&fit=crop&w=2000&q=70";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openAdvisor } = useAdvisor();
  const { vehicle, isVehicleSaved } = useVehicle();
  const { isInventoryDown } = useServiceStatus();

  // Productos destacados (primeros 4)
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      {/* Punto de partida: la tarea principal es elegir para qué vehículo se compra.
          La imagen del banner es decorativa y por ahora un marcador (HERO_IMAGE). */}
      <section className="home-hero" aria-labelledby="home-title">
        <div
          className="home-hero-media"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          aria-hidden="true"
        />
        <div className="home-hero-inner">
          <div className="vehicle-panel">
            <h1 id="home-title">¿Para qué vehículo compras?</h1>
            <p className="vehicle-panel-lede">
              Elige tu vehículo y te mostramos primero los repuestos que le sirven. Tienda oficial KGM Colombia,
              compatible con SsangYong y KGM.
            </p>

            {isVehicleSaved && vehicle ? (
              <>
                <div className="vehicle-panel-current">
                  <span className="vehicle-panel-current-label">Comprando para</span>
                  <strong>
                    {vehicle.brand} {vehicle.model} {vehicle.year}
                  </strong>
                  {vehicle.engine && <span className="vehicle-panel-current-engine">{vehicle.engine}</span>}
                </div>
                <div className="vehicle-panel-actions">
                  <Link href="/repuestos?compatible=true" className="btn-main">
                    Ver repuestos compatibles
                  </Link>
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(true)}>
                    Cambiar vehículo
                  </button>
                </div>
              </>
            ) : (
              <QuickVehicleForm />
            )}
          </div>
        </div>
      </section>

      {/* HU-E54-01: ayuda de un asesor visible desde la Home, sin competir con el selector del banner */}
      <section className="home-help" aria-labelledby="help-title">
        <aside className="help-card">
          <div className="help-card-text">
            <h2 id="help-title">¿No sabes qué repuesto necesitas?</h2>
            <p>
              Cuéntanos qué le pasa a tu vehículo y un asesor te orienta. Tu búsqueda y tu vehículo viajan con la
              solicitud para que no repitas nada.
            </p>
          </div>
          <button type="button" className="btn-secondary" onClick={() => openAdvisor({ origin: "home" })}>
            Hablar con un asesor
          </button>
        </aside>
      </section>

      {/* Categorías */}
      <section className="categories-section" aria-labelledby="categories-title">
        <div className="section-header">
          <h2 id="categories-title">Categorías</h2>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link key={category.id} href={`/repuestos?categoria=${category.id}`} className="category-card">
              <span className="category-icon">
                <CategoryIcon id={category.id} />
              </span>
              <span className="category-name">{category.name}</span>
              <span className="category-count">
                {category.count === 0
                  ? "Sin productos por ahora"
                  : `${category.count} ${category.count === 1 ? "producto" : "productos"}`}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Repuestos destacados */}
      <section className="featured-section" aria-labelledby="featured-title">
        <div className="section-header">
          <h2 id="featured-title">Repuestos destacados</h2>
          <Link href="/repuestos" className="view-all">
            Ver todos
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </Link>
        </div>

        {/* HU-E02-04: sección de destacados degradada si el inventario no responde (el resto de Home sigue funcionando; E40 no tiene historias en Notion) */}
        {isInventoryDown ? (
          <div className="featured-unavailable">
            <p>No pudimos cargar los repuestos destacados en este momento. El resto de la tienda sigue disponible.</p>
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Ventajas */}
      <section className="benefits-section" aria-label="Ventajas de comprar aquí">
        <div className="benefits-grid">
          <div className="benefit-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            <div>
              <h3>Compatibilidad por vehículo</h3>
              <p>Te mostramos qué le sirve al tuyo</p>
            </div>
          </div>
          <div className="benefit-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
            <div>
              <h3>Sin cobro inmediato</h3>
              <p>Un asesor confirma tu pedido antes de cobrar</p>
            </div>
          </div>
          <div className="benefit-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
            <div>
              <h3>Envío gratis desde {formatPrice(FREE_SHIPPING_THRESHOLD)}</h3>
              <p>Valor de ejemplo, por definir (D3)</p>
            </div>
          </div>
          <div className="benefit-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
              <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.5 8-6.91 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-3.5h-2V7h2v6z" />
            </svg>
            <div>
              <h3>Soporte especializado</h3>
              <p>Canal por definir</p>
            </div>
          </div>
        </div>
      </section>

      <VehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
