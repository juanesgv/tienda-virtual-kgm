"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products, categories, formatPrice } from "../data/products";
import ProductCard from "../components/ProductCard";
import VehicleModal from "../components/VehicleModal";
import { useVehicle } from "../context/VehicleContext";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { vehicle, isVehicleSaved } = useVehicle();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnlyCompatible, setShowOnlyCompatible] = useState(false);
  const [sortBy, setSortBy] = useState("relevancia");

  // Realizar búsqueda
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.sku.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.subcategory.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  // Aplicar filtros adicionales
  const filteredResults = useMemo(() => {
    let result = [...searchResults];

    // Filtrar por compatibilidad
    if (showOnlyCompatible && vehicle) {
      result = result.filter((p) =>
        p.compatibleVehicles.some(
          (v) =>
            v.brand.toLowerCase() === vehicle.brand.toLowerCase() &&
            v.model.toLowerCase() === vehicle.model.toLowerCase()
        )
      );
    }

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
  }, [searchResults, showOnlyCompatible, vehicle, sortBy]);

  // Contar productos compatibles
  const compatibleCount = useMemo(() => {
    if (!vehicle) return 0;
    return searchResults.filter((p) =>
      p.compatibleVehicles.some(
        (v) =>
          v.brand.toLowerCase() === vehicle.brand.toLowerCase() &&
          v.model.toLowerCase() === vehicle.model.toLowerCase()
      )
    ).length;
  }, [searchResults, vehicle]);

  // Scroll to top cuando cambia la búsqueda
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [query]);

  return (
    <>
      {/* Header de página */}
      <div className="page-header">
        <div className="breadcrumb">
          <Link href="/">Inicio</Link>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
          <span>Búsqueda</span>
        </div>
        <h1>Resultados de búsqueda</h1>
        {query && (
          <p className="results-count">
            {filteredResults.length > 0 ? (
              <>
                Se encontraron <strong>{filteredResults.length}</strong> productos para "<strong>{query}</strong>"
              </>
            ) : (
              <>
                No se encontraron productos para "<strong>{query}</strong>"
              </>
            )}
          </p>
        )}
      </div>

      {/* Filtros activos */}
      {isVehicleSaved && vehicle && (
        <div className="active-filters-bar">
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
        </div>
      )}

      {/* Layout principal */}
      <div className="catalog-layout">
        {/* Sidebar con categorías sugeridas */}
        <aside className="filters-sidebar">
          <div className="filter-section">
            <div className="filter-header">
              <h3>Categorías</h3>
            </div>
            <div className="filter-content">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/repuestos?categoria=${category.id}`}
                  className="filter-category-link"
                >
                  <span>{category.name}</span>
                  <span className="count">({category.count})</span>
                </Link>
              ))}
            </div>          </div>

          <div className="filter-section">
            <div className="filter-header">
              <h3>Buscar por vehículo</h3>
            </div>
            <div className="filter-content">
              <p className="filter-description">
                {isVehicleSaved && vehicle
                  ? `Mostrando resultados compatibles con ${vehicle.brand} ${vehicle.model}`
                  : "Guarda tu vehículo para ver compatibilidad de repuestos"}
              </p>
              <button className="btn-outline full-width" onClick={() => setIsModalOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                </svg>
                {isVehicleSaved ? "Cambiar vehículo" : "Agregar vehículo"}
              </button>
            </div>
          </div>
        </aside>

        {/* Resultados */}
        <div className="products-container">
          {filteredResults.length > 0 ? (
            <>
              {/* Barra de ordenamiento */}
              <div className="sort-bar">
                <div className="view-toggle">
                  <button className="view-btn active" title="Vista grid">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm-6 0h4v-4h-4v4z" />
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

              {/* Grid de productos */}
              <div className="products-grid large">
                {filteredResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="search-no-results">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="80"
                height="80"
              >
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <h3>No se encontraron resultados</h3>
              <p>Intenta con otros términos de búsqueda o explora por categorías:</p>
              <div className="suggested-categories">
                {categories.slice(0, 4).map((cat) => (
                  <Link key={cat.id} href={`/repuestos?categoria=${cat.id}`} className="suggested-category">
                    {cat.name}
                  </Link>
                ))}
              </div>
              <Link href="/repuestos" className="btn-main">
                Ver todos los repuestos
              </Link>
            </div>
          )}
        </div>
      </div>

      <VehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
