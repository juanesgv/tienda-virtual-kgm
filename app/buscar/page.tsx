"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories, searchProductsSmart, searchProductsFull, isProductCompatible } from "../data/products";
import ProductCard from "../components/ProductCard";
import VehicleModal from "../components/VehicleModal";
import ServiceUnavailable from "../components/ServiceUnavailable";
import { useVehicle } from "../context/VehicleContext";
import { useServiceStatus } from "../context/ServiceStatusContext";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { vehicle, isVehicleSaved } = useVehicle();
  const { isInventoryDown } = useServiceStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnlyCompatible, setShowOnlyCompatible] = useState(false);
  const [sortBy, setSortBy] = useState("relevancia");
  const [showAdvisorPreview, setShowAdvisorPreview] = useState(false);
  const [forceOriginalTerm, setForceOriginalTerm] = useState(false);

  // HU-E04-01/02/04: búsqueda general con tolerancia a errores tipográficos.
  // "forceOriginalTerm" permite al usuario forzar el término literal que escribió (HU-E04-02).
  const smartSearch = useMemo(() => searchProductsSmart(query), [query]);
  const searchResults = forceOriginalTerm ? searchProductsFull(query) : smartSearch.results;
  const correctedQuery = forceOriginalTerm ? null : smartSearch.correctedQuery;

  // Aplicar filtros adicionales
  const filteredResults = useMemo(() => {
    let result = [...searchResults];

    // Filtrar por compatibilidad
    if (showOnlyCompatible && vehicle) {
      result = result.filter((p) => isProductCompatible(p, vehicle));
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
    return searchResults.filter((p) => isProductCompatible(p, vehicle)).length;
  }, [searchResults, vehicle]);

  // HU-E04-05: perdí todos los resultados solo por el filtro de compatibilidad activo
  const hiddenByVehicleFilter =
    showOnlyCompatible && searchResults.length > 0 && filteredResults.length === 0;

  // Scroll to top y limpiar estado de UI cuando cambia el término de búsqueda
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setForceOriginalTerm(false);
    setShowAdvisorPreview(false);
  }, [query]);

  // HU-E40: catálogo/búsqueda caídos (activado desde el interruptor de demo en el pie de página)
  if (isInventoryDown) {
    return (
      <ServiceUnavailable
        title="No pudimos completar tu búsqueda"
        description="Estamos teniendo problemas para conectarnos con el sistema de inventario. Intenta de nuevo en unos minutos."
      />
    );
  }

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
            {filteredResults.length > 0 && !correctedQuery ? (
              <>
                Se encontraron <strong>{filteredResults.length}</strong> productos para "<strong>{query}</strong>"
              </>
            ) : filteredResults.length === 0 && !correctedQuery && !hiddenByVehicleFilter ? (
              <>
                No se encontraron productos para "<strong>{query}</strong>"
              </>
            ) : null}
          </p>
        )}

        {/* HU-E04-02: término corregido por tolerancia a errores tipográficos (simulado) */}
        {correctedQuery && (
          <div className="corrected-query-banner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
            </svg>
            <span>
              No encontramos "<strong>{query}</strong>", mostrando resultados para "<strong>{correctedQuery}</strong>".{" "}
              <button type="button" className="link-button" onClick={() => setForceOriginalTerm(true)}>
                Buscar "{query}" tal como lo escribí
              </button>
            </span>
          </div>
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
          ) : hiddenByVehicleFilter ? (
            // HU-E04-05: la búsqueda sí tiene resultados, pero el filtro de vehículo los oculta todos
            <div className="search-no-results">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
              <h3>Ninguno de estos resultados es compatible con tu vehículo</h3>
              <p>
                Encontramos <strong>{searchResults.length}</strong> productos para "<strong>{query}</strong>",
                pero ninguno está confirmado como compatible con tu <strong>{vehicle?.brand} {vehicle?.model}</strong>.
              </p>
              <button className="btn-main" onClick={() => setShowOnlyCompatible(false)}>
                Ver los {searchResults.length} resultados de todas formas
              </button>
            </div>
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

              {/* HU-E04-05: contactar a un asesor como último recurso.
                  El canal real (E21/E22/E54) aún no está definido en Notion, así que esto
                  es una vista previa simulada, no una integración funcional. */}
              <div className="advisor-fallback">
                {!showAdvisorPreview ? (
                  <button type="button" className="link-button" onClick={() => setShowAdvisorPreview(true)}>
                    ¿Sigues sin encontrarlo? Habla con un asesor
                  </button>
                ) : (
                  <div className="advisor-preview-card">
                    <span className="simulated-badge">Vista previa simulada · Bloque 7</span>
                    <p>
                      En la versión conectada, aquí se abriría un canal de asesoría enviando ya tu búsqueda
                      "<strong>{query}</strong>"{isVehicleSaved && vehicle ? <> y tu vehículo <strong>{vehicle.brand} {vehicle.model} {vehicle.year}</strong></> : null} como
                      contexto, para que el asesor no tenga que preguntarlo de nuevo.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <VehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
