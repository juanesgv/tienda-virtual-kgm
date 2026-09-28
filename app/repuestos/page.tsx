"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { products, categories, formatPrice, isProductCompatible, sortByCompatibility } from "../data/products";
import ProductCard from "../components/ProductCard";
import VehicleModal from "../components/VehicleModal";
import ServiceUnavailable from "../components/ServiceUnavailable";
import { useVehicle } from "../context/VehicleContext";
import { useServiceStatus } from "../context/ServiceStatusContext";

const PAGE_SIZE = 8;
const PRICE_MIN = 0;
const PRICE_MAX = 2000000;

export default function RepuestosPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoriaParam = searchParams.get("categoria");
  const subcategoriaParam = searchParams.get("subcategoria");
  const { vehicle, isVehicleSaved, compatibleOnly, setCompatibleOnly } = useVehicle();
  const { isInventoryDown } = useServiceStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // HU-E07-01: el filtro persiste entre pantallas; solo tiene efecto si hay vehículo activo
  const showOnlyCompatible = compatibleOnly && isVehicleSaved;
  const setShowOnlyCompatible = setCompatibleOnly;
  // HU-E10-05: enlaces como "Ver solo compatibles" (Home, carrito vacío) llegan con ?compatible=true
  const compatibleParam = searchParams.get("compatible") === "true";
  useEffect(() => {
    if (compatibleParam) setCompatibleOnly(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compatibleParam]);
  const [priceRange, setPriceRange] = useState({ min: PRICE_MIN, max: PRICE_MAX });
  const [sortBy, setSortBy] = useState("relevancia");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const isPriceFiltered = priceRange.min > PRICE_MIN || priceRange.max < PRICE_MAX;

  // Productos de la categoría activa (antes de filtrar por precio/compatibilidad),
  // usados para derivar subcategorías y para saber si el filtro de vehículo vació los resultados.
  const categoryProducts = useMemo(() => {
    if (!categoriaParam) return products;
    return products.filter((p) => p.category === categoriaParam);
  }, [categoriaParam]);

  // HU-E03-01: subcategorías disponibles dentro de la categoría seleccionada
  const subcategories = useMemo(() => {
    if (!categoriaParam) return [];
    const seen = new Map<string, number>();
    categoryProducts.forEach((p) => seen.set(p.subcategory, (seen.get(p.subcategory) || 0) + 1));
    return Array.from(seen.entries()).map(([id, count]) => ({ id, count }));
  }, [categoriaParam, categoryProducts]);

  const preVehicleFilterProducts = useMemo(() => {
    let result = subcategoriaParam
      ? categoryProducts.filter((p) => p.subcategory === subcategoriaParam)
      : categoryProducts;
    result = result.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
    return result;
  }, [categoryProducts, subcategoriaParam, priceRange]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    let result = [...preVehicleFilterProducts];

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
      default:
        // Relevancia: con vehículo activo, los compatibles van primero (Modelo conceptual §1)
        result = sortByCompatibility(result, isVehicleSaved ? vehicle : null);
    }

    return result;
  }, [preVehicleFilterProducts, showOnlyCompatible, vehicle, isVehicleSaved, sortBy]);

  // HU-E05-04 / HU-E03-03: los filtros de precio/subcategoría sí dejaron resultados,
  // pero el filtro de compatibilidad de vehículo los ocultó todos
  const hiddenByVehicleFilter =
    showOnlyCompatible && preVehicleFilterProducts.length > 0 && filteredProducts.length === 0;

  // Contar productos compatibles (dentro del recorte de categoría/subcategoría/precio actual)
  const compatibleCount = useMemo(() => {
    if (!vehicle) return 0;
    return preVehicleFilterProducts.filter((p) => isProductCompatible(p, vehicle)).length;
  }, [preVehicleFilterProducts, vehicle]);

  const currentCategory = categoriaParam
    ? categories.find((c) => c.id === categoriaParam)
    : null;

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pagedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Volver a la página 1 cuando cambian los filtros o el orden
  useEffect(() => {
    setPage(1);
  }, [categoriaParam, subcategoriaParam, showOnlyCompatible, priceRange, sortBy]);

  const currentSubcategory = subcategoriaParam
    ? subcategories.find((s) => s.id === subcategoriaParam)
    : null;

  function repuestosUrl(overrides: { categoria?: string | null; subcategoria?: string | null }) {
    const nextCategoria = "categoria" in overrides ? overrides.categoria : categoriaParam;
    const nextSubcategoria = "subcategoria" in overrides ? overrides.subcategoria : subcategoriaParam;
    const params = new URLSearchParams();
    if (nextCategoria) params.set("categoria", nextCategoria);
    if (nextSubcategoria) params.set("subcategoria", nextSubcategoria);
    const qs = params.toString();
    return qs ? `/repuestos?${qs}` : "/repuestos";
  }

  const hasActiveFilters = Boolean(categoriaParam || subcategoriaParam || showOnlyCompatible || isPriceFiltered);

  function clearAllFilters() {
    router.push("/repuestos");
    setShowOnlyCompatible(false);
    setPriceRange({ min: PRICE_MIN, max: PRICE_MAX });
    setSortBy("relevancia");
  }

  // HU-E40: catálogo caído (activado desde el interruptor de demo en el pie de página)
  if (isInventoryDown) {
    return <ServiceUnavailable />;
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
          {currentCategory ? (
            <>
              <Link href={repuestosUrl({ subcategoria: null })}>{currentCategory.name}</Link>
              {currentSubcategory && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                  <span>{currentSubcategory.id}</span>
                </>
              )}
            </>
          ) : (
            <span>Todos los repuestos</span>
          )}
        </div>
        <h1>{currentCategory ? currentCategory.name : "Repuestos KGM"}</h1>
        {/* HU-E05-04: contador de resultados siempre visible */}
        <p className="results-count">
          Mostrando <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "producto" : "productos"}
          {filteredProducts.length > 0 && ` (página ${page} de ${totalPages})`}
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

        {/* HU-E05-02: cada filtro activo se ve y se puede quitar individualmente */}
        {hasActiveFilters && (
          <div className="filters-tags">
            {categoriaParam && (
              <span className="filter-tag">
                Categoría: {currentCategory?.name}
                <Link href={repuestosUrl({ categoria: null, subcategoria: null })} aria-label="Quitar filtro de categoría">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </Link>
              </span>
            )}
            {subcategoriaParam && (
              <span className="filter-tag">
                Subcategoría: {subcategoriaParam}
                <Link href={repuestosUrl({ subcategoria: null })} aria-label="Quitar filtro de subcategoría">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </Link>
              </span>
            )}
            {showOnlyCompatible && (
              <span className="filter-tag">
                Solo compatibles
                <button type="button" onClick={() => setShowOnlyCompatible(false)} aria-label="Quitar filtro de compatibilidad">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </span>
            )}
            {isPriceFiltered && (
              <span className="filter-tag">
                Precio: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                <button
                  type="button"
                  onClick={() => setPriceRange({ min: PRICE_MIN, max: PRICE_MAX })}
                  aria-label="Quitar filtro de precio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </span>
            )}
            <button type="button" className="clear-filters" onClick={clearAllFilters}>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Layout principal */}
      <div className="catalog-layout">
        {/* Botón de filtros solo visible en móvil/tablet: el panel se oculta por completo por debajo de 1024px */}
        <button
          type="button"
          className="mobile-filters-toggle"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
          </svg>
          Filtros {hasActiveFilters && <span className="filters-badge" aria-label="Filtros activos" />}
        </button>

        {/* Sidebar de filtros */}
        <aside className={`filters-sidebar ${mobileFiltersOpen ? "mobile-open" : ""}`}>
          <div className="mobile-filters-header">
            <h3>Filtros</h3>
            <button type="button" className="mobile-filters-close" onClick={() => setMobileFiltersOpen(false)} aria-label="Cerrar filtros">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
          <div className="filter-section">
            <div className="filter-header">
              <h3>Categorías</h3>
            </div>
            <div className="filter-content">
              {/* HU-E03-01/HU-E05-01: filtro de categoría funcional (antes eran casillas decorativas) */}
              {categories.map((category) => (
                <label key={category.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={categoriaParam === category.id}
                    onChange={() =>
                      router.push(
                        categoriaParam === category.id
                          ? "/repuestos"
                          : repuestosUrl({ categoria: category.id, subcategoria: null })
                      )
                    }
                  />
                  <span className="checkmark"></span>
                  <span className="label-text">{category.name}</span>
                  <span className="count">({category.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* HU-E03-01: subcategorías de la categoría seleccionada */}
          {currentCategory && subcategories.length > 1 && (
            <div className="filter-section">
              <div className="filter-header">
                <h3>Subcategoría</h3>
              </div>
              <div className="filter-content">
                {subcategories.map((sub) => (
                  <label key={sub.id} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={subcategoriaParam === sub.id}
                      onChange={() =>
                        router.push(
                          subcategoriaParam === sub.id
                            ? repuestosUrl({ subcategoria: null })
                            : repuestosUrl({ subcategoria: sub.id })
                        )
                      }
                    />
                    <span className="checkmark"></span>
                    <span className="label-text">{sub.id}</span>
                    <span className="count">({sub.count})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="filter-section">
            <div className="filter-header">
              <h3>Precio</h3>
            </div>
            <div className="filter-content">
              <div className="price-range">
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      max: Math.max(prev.min, parseInt(e.target.value)),
                    }))
                  }
                  className="price-slider"
                />
                {/* HU-E05-01: rango de precio realmente editable (antes los campos eran de solo lectura) */}
                <div className="price-inputs">
                  <div className="price-field">
                    <span>$</span>
                    <input
                      type="number"
                      value={priceRange.min}
                      placeholder="Min"
                      min={PRICE_MIN}
                      max={priceRange.max}
                      onChange={(e) => {
                        const raw = parseInt(e.target.value);
                        const val = Number.isNaN(raw) ? PRICE_MIN : raw;
                        setPriceRange((prev) => ({
                          ...prev,
                          min: Math.min(Math.max(val, PRICE_MIN), prev.max),
                        }));
                      }}
                    />
                  </div>
                  <span className="separator">-</span>
                  <div className="price-field">
                    <span>$</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      placeholder="Max"
                      min={priceRange.min}
                      max={PRICE_MAX}
                      onChange={(e) => {
                        const raw = parseInt(e.target.value);
                        const val = Number.isNaN(raw) ? PRICE_MAX : raw;
                        setPriceRange((prev) => ({
                          ...prev,
                          max: Math.max(Math.min(val, PRICE_MAX), prev.min),
                        }));
                      }}
                    />
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

          <button type="button" className="mobile-filters-apply" onClick={() => setMobileFiltersOpen(false)}>
            Ver {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
          </button>
        </aside>

        {/* Grid de productos */}
        <div className="products-container">
          {/* Barra de ordenamiento */}
          <div className="sort-bar">
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

          {filteredProducts.length > 0 && (
            <>
              {/* Grid */}
              <div className="products-grid large">
                {pagedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Paginación real: solo aparece cuando hay más de una página */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    className="page-btn"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Página anterior"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`page-btn ${p === page ? "active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="page-btn"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Página siguiente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}

          {/* HU-E05-04/HU-E03-03: el catálogo sí tiene productos, pero el filtro de vehículo los ocultó todos */}
          {filteredProducts.length === 0 && hiddenByVehicleFilter && (
            <div className="search-no-results">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
              <h3>Ninguno de estos productos es compatible con tu vehículo</h3>
              <p>
                Hay <strong>{preVehicleFilterProducts.length}</strong> productos con estos filtros, pero ninguno está
                confirmado como compatible con tu <strong>{vehicle?.brand} {vehicle?.model}</strong>.
              </p>
              <button className="btn-main" onClick={() => setShowOnlyCompatible(false)}>
                Ver los {preVehicleFilterProducts.length} productos de todas formas
              </button>
            </div>
          )}

          {/* Sin resultados por categoría/subcategoría/precio, sin relación con el vehículo */}
          {filteredProducts.length === 0 && !hiddenByVehicleFilter && (
            <div className="search-no-results">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <h3>No se encontraron productos</h3>
              <p>Ningún repuesto cumple con esta combinación de filtros.</p>
              {hasActiveFilters && (
                <button className="btn-main" onClick={clearAllFilters}>
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <VehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
