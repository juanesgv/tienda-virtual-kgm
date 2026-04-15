"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, products } from "./data/products";
import ProductCard from "./components/ProductCard";
import VehicleModal from "./components/VehicleModal";
import { useVehicle } from "./context/VehicleContext";
import PromoCarousel from "./components/PromoCarousel";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { vehicle, isVehicleSaved } = useVehicle();

  // Productos destacados (primeros 4)
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Tienda Oficial KGM Colombia
          </div>
          <h1>Repuestos originales para tu camioneta</h1>
          <p className="hero-description">
            Explora nuestro catálogo completo de repuestos genuinos KGM.
            <strong>Compatible con SsangYong y KGM.</strong>
          </p>

          <div className="hero-cta">
            <Link href="/repuestos" className="btn-main">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm-6 0h4v-4h-4v4z" />
              </svg>
              Ver todos los repuestos
            </Link>
            <button className="btn-secondary" onClick={() => setIsModalOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
              Buscar por mi vehículo
            </button>
          </div>

          {/* Notificación de vehículo guardado */}
          {isVehicleSaved && vehicle && (
            <div className="vehicle-notification">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>
                Mostrando repuestos compatibles con:{" "}
                <strong>{vehicle.brand} {vehicle.model} {vehicle.year}</strong>
              </span>
              <Link href="/repuestos?compatible=true" className="link-filter">
                Ver solo compatibles →
              </Link>
            </div>
          )}
        </div>
        <div className="hero-image">
          <div className="hero-visual">
            <PromoCarousel />
          </div>
        </div>
      </section>

      {/* Categorías Populares */}
      <section className="categories-section">
        <div className="section-header">
          <div>
            <h2>Categorías populares</h2>
            <p>Explora por tipo de repuesto</p>
          </div>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/repuestos?categoria=${category.id}`}
              className="category-card"
            >
              <div className="category-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="28"
                  height="28"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="category-count">{category.count} productos</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Repuestos Destacados */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Repuestos destacados</h2>
          <Link href="/repuestos" className="view-all">
            Ver todos
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </Link>
        </div>

        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Búsqueda por Vehículo Banner */}
      <section className="vehicle-search-banner">
        <div className="banner-content">
          <div className="banner-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
          <div className="banner-text">
            <h2>¿Ya sabes qué repuesto necesitas?</h2>
            <p>Busca directamente por referencia o identifica tu vehículo para ver compatibilidad</p>
          </div>
          <div className="banner-actions">
            <button className="btn-outline" onClick={() => setIsModalOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
              Buscar por vehículo
            </button>
          </div>
        </div>
      </section>

      {/* Ventajas */}
      <section className="benefits-section">
        <div className="benefits-grid">
          <div className="benefit-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            <h4>Repuestos originales</h4>
            <p>100% genuinos KGM</p>
          </div>
          <div className="benefit-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
            <h4>Garantía incluida</h4>
            <p>En todos los productos</p>
          </div>
          <div className="benefit-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
            <h4>Envío a todo Colombia</h4>
            <p>Rápido y seguro</p>
          </div>
          <div className="benefit-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
              <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.5 8-6.91 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-3.5h-2V7h2v6z" />
            </svg>
            <h4>Soporte especializado</h4>
            <p>Asesores técnicos</p>
          </div>
        </div>
      </section>

      <VehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
