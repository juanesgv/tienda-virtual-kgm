"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products, categories, formatPrice, isProductCompatible } from "../data/products";
import ProductCard from "../components/ProductCard";
import VehicleModal from "../components/VehicleModal";
import { useVehicle } from "../context/VehicleContext";

export default function RepuestosPage() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get("categoria");
  const { vehicle, isVehicleSaved } = useVehicle();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnlyCompatible, setShowOnlyCompatible] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000000 });
  const [sortBy, setSortBy] = useState("relevancia");

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filtrar por categoría
    if (categoriaParam) {
      result = result.filter((p) => p.category === categoriaParam);
    }

    // Filtrar por compatibilidad
    if (showOnlyCompatible && vehicle) {
      result = result.filter((p) => isProductCompatible(p, vehicle));
    }

    // Filtrar por precio
    result = result.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);

    // Ordenar
    switch (sortBy) {
      case "precio-menor":
        result.sort((a, b) => a.price - b.price);
        break;
      case "precio-mayor":
        result.sort((a, b) => b.price - a.price);
        break;
      case "nombre":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [categoriaParam, showOnlyCompatible, vehicle, priceRange, sortBy]);

  // Contar productos compatibles
  const compatibleCount = useMemo(() => {
    if (!vehicle) return 0;
    return products.filter((p) => isProductCompatible(p, vehicle)).length;
  }, [vehicle]);

  const currentCategory = categoriaParam
    ? categories.find((c) => c.id === categoriaParam)
    : null;

  return (
    <>
      {/* Header de página */}
      <div className="page-header">
        <div className="breadcrumb">
          <Link href="/">Inicio</Link>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
          <span>{currentCategory ? currentCategory.name : "Todos los repuestos"}</span>
        </div>
        <h1>{currentCategory ? currentCategory.name : "Repuestos KGM"}</h1>
        <p className="results-count">
          Mostrando <strong>{filteredProducts.length}</strong> productos
        </p>
      </div>

      {/* Filtros activos */}
      <div className="active-filters-bar">
        {/* Filtro de compatibilidad */}
        {isVehicleSaved && vehicle && (
          <div className="compatibility-filter">
            <div className="compatibility-toggle">
              <input
                type="checkbox"
                id="compatFilter"
                checked={showOnlyCompatible}
                onChange={(e) => setShowOnlyCompatible(e.target.checked)}
              />
              <label htmlFor="compatFilter">
                <span className="toggle-switch"></span>
                <span className="toggle-text">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Solo compatibles con <strong>{vehicle.brand} {vehicle.model} {vehicle.year}</strong>
                </span>
              </label>
            </div>
            <span className="compatibility-count">{compatibleCount} productos compatibles</span>
          </div>
        )}

        {/* Filtros activos */}
        <div className="filters-tags">
          {categoriaParam && (
            <span className="filter-tag">
              Categoría: {currentCategory?.name}
              <Link href="/repuestos">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </Link>
            </span>
          )}
          {(categoriaParam || showOnlyCompatible) && (
            <Link href="/repuestos" className="clear-filters">
              Limpiar filtros
            </Link>
          )}
        </div>
      </div>

      {/* Layout principal */}
      <div className="catalog-layout">
        {/* Sidebar de filtros */}
        <aside className="filters-sidebar">
          <div className="filter-section">
            <div className="filter-header">
              <h3>Categorías</h3>
            </div>
            <div className="filter-content">
              {categories.map((category) => (
                <label key={category.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={categoriaParam === category.id}
                    onChange={() => {}}
                  />
                  <span className="checkmark"></span>
                  <span className="label-text">{category.name}</span>
                  <span className="count">({category.count})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-header">
              <h3>Precio</h3>
            </div>
            <div className="filter-content">
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="price-slider"
                />
                <div className="price-inputs">
                  <div className="price-field">
                    <span>$</span>
                    <input type="number" value={priceRange.min} placeholder="Min" readOnly />
                  </div>
                  <span className="separator">-</span>
                  <div className="price-field">
                    <span>$</span>
                    <input type="number" value={priceRange.max} placeholder="Max" readOnly />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isVehicleSaved && vehicle && (
            <div className="filter-section">
              <div className="filter-header">
                <h3>Compatibilidad</h3>
              </div>
              <div className="filter-content">
                <p className="filter-description">Filtrar por compatibilidad con tu vehículo:</p>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={showOnlyCompatible}
                    onChange={(e) => setShowOnlyCompatible(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span className="label-text">Solo compatibles</span>
                  <span className="count">({compatibleCount})</span>
                </label>
              </div>
            </div>
          )}
        </aside>

        {/* Grid de productos */}
        <div className="products-container">
          {/* Barra de ordenamiento */}
          <div className="sort-bar">
            <div className="view-toggle">
              <button className="view-btn active" title="Vista grid">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm-6 0h4v-4h-4v4z" />
                </svg>
              </button>
              <button className="view-btn" title="Vista lista">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                </svg>
              </button>
            </div>
            <div className="sort-select">
              <label>Ordenar por:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="relevancia">Relevancia</option>
                <option value="precio-menor">Precio: Menor a mayor</option>
                <option value="precio-mayor">Precio: Mayor a menor</option>
                <option value="nombre">Nombre</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="products-grid large">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Paginación */}
          {filteredProducts.length > 0 && (
            <div className="pagination">
              <button className="page-btn" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <span className="page-dots">...</span>
              <button className="page-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            </div>
          )}

          {/* Sin resultados */}
          {filteredProducts.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64" style={{ color: "var(--color-gray-400)", marginBottom: "16px" }}>
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>No se encontraron productos</h3>
              <p style={{ color: "var(--color-gray-600)" }}>Intenta ajustar los filtros o buscar con otros términos.</p>
            </div>
          )}
        </div>
      </div>

      <VehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
