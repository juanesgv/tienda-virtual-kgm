"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useVehicle } from "../context/VehicleContext";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useServiceStatus } from "../context/ServiceStatusContext";
import { getSearchSuggestions } from "../data/products";
import VehicleModal from "./VehicleModal";
import CartDrawer from "./CartDrawer";
import { BrandLogo } from "./BrandLogo";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const { vehicle, isVehicleSaved, clearVehicle } = useVehicle();
  const { getItemCount } = useCart();
  const { currentUser, isAuthenticated } = useUser();
  const { isInventoryDown } = useServiceStatus();

  // HU-E04-03/E40: sugerencias en vivo mientras se escribe; se apagan si el inventario está caído
  const suggestions = useMemo(
    () => (isInventoryDown ? [] : getSearchSuggestions(searchQuery)),
    [searchQuery, isInventoryDown]
  );

  const goToSuggestion = (href: string) => {
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    setSearchQuery("");
    router.push(href);
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname?.startsWith(path);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <BrandLogo priority />

          {/* Buscador */}
          <div className="search-global">
            <form onSubmit={(e) => {
              e.preventDefault();
              // Con una sugerencia resaltada por teclado, Enter la abre en lugar de buscar el texto
              if (showSuggestions && activeSuggestion >= 0 && suggestions[activeSuggestion]) {
                goToSuggestion(suggestions[activeSuggestion].href);
                return;
              }
              if (searchQuery.trim()) {
                setShowSuggestions(false);
                router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}>
              <input
                type="text"
                placeholder="Buscar repuestos por nombre, referencia o categoría..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveSuggestion(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setShowSuggestions(false);
                    setActiveSuggestion(-1);
                  } else if (suggestions.length > 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
                    e.preventDefault();
                    setShowSuggestions(true);
                    const step = e.key === "ArrowDown" ? 1 : -1;
                    setActiveSuggestion((current) => (current + step + suggestions.length) % suggestions.length);
                  }
                }}
                role="combobox"
                aria-label="Buscar repuestos"
                aria-controls="search-suggestions-list"
                aria-activedescendant={activeSuggestion >= 0 ? `search-suggestion-${activeSuggestion}` : undefined}
                aria-expanded={showSuggestions && suggestions.length > 0}
                aria-autocomplete="list"
                autoComplete="off"
              />
              <button type="submit" className="search-btn" aria-label="Buscar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <ul className="search-suggestions" role="listbox" id="search-suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li key={`${suggestion.type}-${suggestion.href}`}>
                    <button
                      type="button"
                      role="option"
                      id={`search-suggestion-${index}`}
                      tabIndex={-1}
                      aria-selected={index === activeSuggestion}
                      className={`search-suggestion-item ${index === activeSuggestion ? "active" : ""}`}
                      onMouseDown={() => goToSuggestion(suggestion.href)}
                    >
                      <span className={`suggestion-tag ${suggestion.type}`}>
                        {suggestion.type === "category" ? "Categoría" : "Producto"}
                      </span>
                      <span>{suggestion.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Acciones */}
          <div className="header-actions">
            {/* Selector de Vehículo */}
            <div className="vehicle-selector-header">
              {isVehicleSaved && vehicle ? (
                <div className="vehicle-saved">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="saved-model">{vehicle.brand} {vehicle.model} {vehicle.year}</span>
                  <button className="change-vehicle" onClick={() => setIsModalOpen(true)}>
                    Cambiar
                  </button>
                  <button className="remove-vehicle" onClick={clearVehicle} title="Quitar vehículo activo" aria-label="Quitar vehículo activo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button className="vehicle-btn" onClick={() => setIsModalOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                  <span className="vehicle-text">Mi vehículo</span>
                  <span className="vehicle-status">Agregar</span>
                </button>
              )}
            </div>

            {/* Usuario */}
            <Link href="/cuenta" className="icon-btn account-btn" title="Mi cuenta" aria-label="Mi cuenta">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              {isAuthenticated && currentUser ? (
                <span className="account-label">{currentUser.name.split(" ")[0]}</span>
              ) : null}
            </Link>

            {/* Carrito */}
            <button className="icon-btn cart-btn" onClick={() => setIsCartOpen(true)} aria-label={`Abrir carrito (${getItemCount()} productos)`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {getItemCount() > 0 && (
                <span className="cart-count">{getItemCount()}</span>
              )}
            </button>
          </div>
        </div>

        {/* Navegación */}
        <nav className="main-nav">
          <div className="nav-container">
            <Link href="/repuestos" className={`nav-item ${isActive("/repuestos") ? "active" : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm-6 0h4v-4h-4v4z"/>
              </svg>
              Todas las categorías
            </Link>
            <Link href="/repuestos?categoria=frenos" className={`nav-item ${pathname?.includes("frenos") ? "active" : ""}`}>Frenos</Link>
            <Link href="/repuestos?categoria=suspension" className={`nav-item ${pathname?.includes("suspension") ? "active" : ""}`}>Suspensión</Link>
            <Link href="/repuestos?categoria=motor" className={`nav-item ${pathname?.includes("motor") ? "active" : ""}`}>Motor</Link>
            <Link href="/repuestos?categoria=filtros" className={`nav-item ${pathname?.includes("filtros") ? "active" : ""}`}>Filtros</Link>
            <Link href="/repuestos?categoria=transmision" className={`nav-item ${pathname?.includes("transmision") ? "active" : ""}`}>Transmisión</Link>
            <Link href="/repuestos?categoria=electricos" className={`nav-item ${pathname?.includes("electricos") ? "active" : ""}`}>Sistema eléctrico</Link>
            <Link href="/repuestos?categoria=carroceria" className={`nav-item ${pathname?.includes("carroceria") ? "active" : ""}`}>Carrocería</Link>
          </div>
        </nav>
      </header>

      <VehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
