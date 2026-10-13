"use client";

import { useMemo, useState } from "react";
import { VehicleCompatibility } from "../data/products";

interface Props {
  vehicles: VehicleCompatibility[];
  /** ¿Esta fila aplica de verdad al vehículo activo (modelo, año y motor)? */
  appliesToVehicle: (entry: VehicleCompatibility) => boolean;
}

// "2015 - 2024" → { from: 2015, to: 2024 }; tolera un solo año ("2019")
function parseRange(years: string): { from: number; to: number } | null {
  const nums = years.match(/\d{4}/g)?.map(Number);
  if (!nums || nums.length === 0) return null;
  return { from: Math.min(...nums), to: Math.max(...nums) };
}

const formatYears = (years: string) => years.replace(/\s*-\s*/, " a ");

// HU-E06-03 + modelo de dominio (aplicabilidad ≠ compatibilidad): para qué vehículos sirve la pieza se muestra
// SIEMPRE, con o sin vehículo activo. Primero en lenguaje claro y después como tabla que se puede filtrar.
// El texto se genera a partir de los mismos datos de la tabla para que nunca se contradigan.
export default function VehicleApplicability({ vehicles, appliesToVehicle }: Props) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");

  const options = useMemo(() => {
    const unique = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b, "es"));
    const years = new Set<number>();
    vehicles.forEach((v) => {
      const r = parseRange(v.years);
      if (r) for (let y = r.from; y <= r.to; y++) years.add(y);
    });
    return {
      brands: unique(vehicles.map((v) => v.brand)),
      models: unique(vehicles.filter((v) => !brand || v.brand === brand).map((v) => v.model)),
      years: [...years].sort((a, b) => b - a),
      engines: unique(vehicles.map((v) => v.engine).filter((e): e is string => !!e)),
    };
  }, [vehicles, brand]);

  // Aplicación en lenguaje claro: marca → modelos (años), agrupando las filas que solo cambian de motor
  const summary = useMemo(() => {
    const byBrand = new Map<string, Map<string, string>>();
    vehicles.forEach((v) => {
      const models = byBrand.get(v.brand) ?? new Map<string, string>();
      models.set(`${v.model}|${v.years}`, `${v.model} (${formatYears(v.years)})`);
      byBrand.set(v.brand, models);
    });
    const parts = [...byBrand.entries()].map(([b, models]) => `${b}: ${[...models.values()].join(", ")}`);
    const engines = options.engines;
    return {
      text: parts.join("; "),
      engines: engines.length > 0 ? engines.join(" y ") : null,
      someWithoutEngine: vehicles.some((v) => !v.engine),
    };
  }, [vehicles, options.engines]);

  const rows = useMemo(() => {
    const filtered = vehicles.filter((v) => {
      if (brand && v.brand !== brand) return false;
      if (model && v.model !== model) return false;
      if (engine && v.engine !== engine) return false;
      if (year) {
        const r = parseRange(v.years);
        if (!r || Number(year) < r.from || Number(year) > r.to) return false;
      }
      return true;
    });
    // Lo que aplica a tu vehículo primero; el resto conserva su orden
    return [...filtered].sort((a, b) => Number(appliesToVehicle(b)) - Number(appliesToVehicle(a)));
  }, [vehicles, brand, model, year, engine, appliesToVehicle]);

  const hasFilters = !!(brand || model || year || engine);
  const clear = () => {
    setBrand("");
    setModel("");
    setYear("");
    setEngine("");
  };

  if (vehicles.length === 0) return null;

  return (
    <div className="applicability">
      <div className="application-text">
        <h3>Aplicación</h3>
        <p>
          Este repuesto aplica a <strong>{summary.text}</strong>.
          {summary.engines && (
            <>
              {" "}
              Motor: {summary.engines}
              {summary.someWithoutEngine ? "; en algunas versiones el motor no está especificado" : ""}.
            </>
          )}
        </p>
        <p className="application-source">
          Redactado a partir de la matriz de aplicabilidad (dato de ejemplo, por validar con SIISA).
        </p>
      </div>

      <div className="applicability-table-block">
        <h3>Vehículos compatibles con este repuesto</h3>

        <div className="applicability-filters">
          <div className="form-group">
            <label htmlFor="app-brand">Marca</label>
            <select
              id="app-brand"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setModel("");
              }}
            >
              <option value="">Todas</option>
              {options.brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="app-model">Modelo</label>
            <select id="app-model" value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="">Todos</option>
              {options.models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="app-year">Año</label>
            <select id="app-year" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Todos</option>
              {options.years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          {options.engines.length > 0 && (
            <div className="form-group">
              <label htmlFor="app-engine">Motor</label>
              <select id="app-engine" value={engine} onChange={(e) => setEngine(e.target.value)}>
                <option value="">Todos</option>
                {options.engines.map((en) => (
                  <option key={en} value={en}>
                    {en}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <p className="applicability-count" role="status" aria-live="polite">
          {hasFilters ? `Mostrando ${rows.length} de ${vehicles.length}` : `${vehicles.length} aplicaciones`}
          {hasFilters && (
            <button type="button" className="link-button" onClick={clear}>
              Quitar filtros
            </button>
          )}
        </p>

        {rows.length === 0 ? (
          <p className="compatibility-data-note">
            Ningún vehículo de la lista cumple esos filtros. Eso no significa que el repuesto no sirva para el tuyo:
            quita algún filtro o confírmalo con un asesor.
          </p>
        ) : (
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
                {rows.map((v) => {
                  const mine = appliesToVehicle(v);
                  return (
                    <tr key={`${v.brand}-${v.model}-${v.years}-${v.engine ?? ""}`} className={mine ? "highlight" : ""}>
                      <td>{v.brand}</td>
                      <td>{v.model}</td>
                      <td>{formatYears(v.years)}</td>
                      <td>{v.engine ?? "Sin especificar"}</td>
                      <td>
                        <span className={`badge ${mine ? "compatible" : ""}`}>{mine ? "Tu vehículo" : "Aplica"}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
