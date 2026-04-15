"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "../components/Header";
import { useVehicle } from "../VehicleContext";
import { products, formatCurrency, isProductCompatible } from "../data";

type SystemFilter = "Frenos" | "Motor" | "Suspensión" | "Accesorios" | "Todos";
type TypeFilter = "Todos" | "Repuesto original" | "Accesorio" | "Mantenimiento" | "Kit";

export default function ListingPage() {
  const { vehicle, compatibilityFilterOn } = useVehicle();
  const searchParams = useSearchParams();
  const initialSystem = (searchParams.get("system") as SystemFilter) || "Todos";

  const [system, setSystem] = useState<SystemFilter>(initialSystem);
  const [type, setType] = useState<TypeFilter>("Todos");
  const [showOnlyCompatible, setShowOnlyCompatible] = useState(false);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        if (system !== "Todos" && product.system !== system) return false;
        if (type !== "Todos" && product.type !== type) return false;

        if (showOnlyCompatible && compatibilityFilterOn) {
          return isProductCompatible(product, vehicle);
        }
        return true;
      }),
    [system, type, showOnlyCompatible, compatibilityFilterOn, vehicle]
  );

  const resultText =
    filteredProducts.length === 1
      ? "1 resultado"
      : `${filteredProducts.length} resultados`;

  return (
    <>
      <Header />
      <main className="wrapper">
        <section className="layout-shell">
          <aside className="filter-panel">
            <header>
              <div className="filter-header-title">Filtrar resultados</div>
              <div className="filter-header-meta">
                Explora primero. Activa la compatibilidad cuando estés listo.
              </div>
            </header>

            <div className="filter-group">
              <div className="filter-section-title">Sistema del vehículo</div>
              <div className="filter-options">
                {["Todos", "Frenos", "Motor", "Suspensión", "Accesorios"].map(
                  (s) => (
                    <label key={s}>
                      <input
                        type="radio"
                        name="system"
                        checked={system === s}
                        onChange={() => setSystem(s as SystemFilter)}
                      />{" "}
                      {s}
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-section-title">Tipo de repuesto</div>
              <div className="filter-chip-row">
                {["Todos", "Repuesto original", "Accesorio", "Mantenimiento", "Kit"].map(
                  (t) => (
                    <button
                      key={t}
                      type="button"
                      className={`filter-chip ${type === t ? "is-active" : ""}`}
                      onClick={() => setType(t as TypeFilter)}
                    >
                      {t}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-section-title">Compatibilidad</div>
              <div className="filter-options">
                <label>
                  <input
                    type="checkbox"
                    checked={showOnlyCompatible}
                    onChange={(e) => setShowOnlyCompatible(e.target.checked)}
                    disabled={!compatibilityFilterOn}
                  />{" "}
                  Ver solo compatibles con mi vehículo
                </label>
                {!compatibilityFilterOn && (
                  <span className="section-subtitle">
                    Aplica tu vehículo en la cabecera para activar este filtro.
                  </span>
                )}
              </div>
            </div>

            <div className="filter-footer">
              <button
                className="btn-outline"
                type="button"
                onClick={() => {
                  setSystem("Todos");
                  setType("Todos");
                  setShowOnlyCompatible(false);
                }}
              >
                Limpiar filtros
              </button>
              <span>Resultados en tiempo real</span>
            </div>
          </aside>

          <section>
            <header className="product-shell-header">
              <div>
                <div className="breadcrumbs">
                  Inicio / Repuestos{" "}
                  {system !== "Todos" && (
                    <>
                      / <strong>{system}</strong>
                    </>
                  )}
                </div>
                <div className="result-summary">
                  {resultText}
                  {compatibilityFilterOn && showOnlyCompatible && vehicle?.model && (
                    <> compatibles con {vehicle.model} {vehicle.year}</>
                  )}
                </div>
              </div>
            </header>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/producto/${product.id}`}
                  className="product-card"
                >
                  <div className="product-image-ghost" />
                  <div className="product-name">{product.name}</div>
                  <div className="product-fit">
                    {compatibilityFilterOn && vehicle
                      ? isProductCompatible(product, vehicle)
                        ? "Compatible con tu vehículo seleccionado"
                        : "No aparece como compatible para tu vehículo"
                      : "Ver compatibilidad al aplicar tu vehículo"}
                  </div>
                  <div className="product-footer">
                    <span className="product-price">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="product-cta">Ver detalles →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <span>© 2026 KGM Colombia.</span>
          <span>Prototipo de experiencia de listado con filtros.</span>
        </div>
      </footer>
    </>
  );
}

