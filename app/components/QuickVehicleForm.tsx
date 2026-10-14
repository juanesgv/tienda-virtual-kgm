"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVehicle, Vehicle } from "../context/VehicleContext";
import { simulatePlateLookup, simulateVinLookup, VEHICLE_BRAND, VEHICLE_MODELS, YEARS } from "./VehicleModal";

type Method = "placa" | "modelo" | "vin";

const METHODS: { id: Method; label: string }[] = [
  { id: "placa", label: "Placa" },
  { id: "modelo", label: "Modelo" },
  { id: "vin", label: "VIN" },
];

// Identificador rápido de la portada (HU-E01-02 / HU-E08-01 / HU-E08-02): el cliente escribe o elige, sin pasar por
// fotos ni por el modal. La placa es el método por defecto; el modelo (modelo y año, sin preguntar marca) es para quien no la tiene
// a mano; el VIN está disponible pero es el de menor uso (17 caracteres). Placa y VIN son búsquedas SIMULADAS:
// nunca llaman a RUNT ni a SIISA. Sin motor, la compatibilidad queda "sin confirmar".
export default function QuickVehicleForm() {
  const router = useRouter();
  const { setVehicle } = useVehicle();
  const [method, setMethod] = useState<Method>("placa");
  const [plate, setPlate] = useState("");
  const [vin, setVin] = useState("");
  const [pending, setPending] = useState<Vehicle | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const goToCompatible = () => router.push("/repuestos?compatible=true");

  const changeMethod = (next: Method) => {
    setMethod(next);
    setPending(null);
    setLookupError(null);
  };

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const result = method === "vin" ? simulateVinLookup(vin) : simulatePlateLookup(plate);
    if (result) {
      setLookupError(null);
      setPending(result);
    } else {
      setPending(null);
      setLookupError(
        method === "vin"
          ? "El VIN debe tener 17 caracteres. Revísalo o busca por placa o por modelo."
          : "No pudimos identificar un vehículo con esa placa. Revisa que tenga 6 caracteres o busca por modelo."
      );
    }
  };

  const confirmPending = () => {
    if (!pending) return;
    setVehicle(pending);
    goToCompatible();
  };

  const saveModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !year) return;
    setVehicle({ brand: VEHICLE_BRAND, model, year: parseInt(year), approximateMatch: true });
    goToCompatible();
  };

  const switcher = (
    <div className="id-method" role="group" aria-label="Cómo quieres identificar tu vehículo">
      <span className="id-method-label">Buscar por</span>
      {METHODS.map((m) => (
        <button
          key={m.id}
          type="button"
          className={`id-method-btn ${method === m.id ? "active" : ""}`}
          aria-pressed={method === m.id}
          onClick={() => changeMethod(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );

  // Resultado de la búsqueda por placa o VIN: se confirma antes de guardar (HU-E08-01)
  if (pending && method !== "modelo") {
    return (
      <div className="quick-vehicle-form">
        <div className="vehicle-confirm-card">
          <span className="simulated-badge">Búsqueda simulada</span>
          <p className="vehicle-confirm-title">¿Es este tu vehículo?</p>
          <div className="vehicle-confirm-details">
            <strong>
              {pending.brand} {pending.model} {pending.year}
            </strong>
            {pending.plate && <span>Placa {pending.plate}</span>}
            {pending.vin && <span>VIN {pending.vin}</span>}
          </div>
          <div className="vehicle-confirm-actions">
            <button type="button" className="btn-main" onClick={confirmPending}>
              Sí, es mi vehículo
            </button>
            <button type="button" className="link-button" onClick={() => changeMethod("modelo")}>
              No es mi vehículo, buscarlo por modelo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quick-vehicle-form">
      {switcher}

      {method === "modelo" ? (
        <form onSubmit={saveModel} className="quick-vehicle-form">
          <div className="quick-vehicle-fields">
            <div className="form-group">
              <label htmlFor="qv-model">Modelo</label>
              <select
                id="qv-model"
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  setYear("");
                }}
              >
                <option value="">Elige</option>
                {VEHICLE_MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="qv-year">Año</label>
              <select id="qv-year" value={year} onChange={(e) => setYear(e.target.value)} disabled={!model}>
                <option value="">Elige</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="vehicle-panel-actions">
            <button type="submit" className="btn-main" disabled={!model || !year}>
              Ver repuestos compatibles
            </button>
          </div>
          <p className="quick-vehicle-hint">Sin el motor, la compatibilidad de algunos repuestos quedará por confirmar.</p>
        </form>
      ) : (
        <form onSubmit={search} noValidate>
          <div className="quick-plate-row">
            <div className="form-group">
              <label htmlFor={method === "vin" ? "qv-vin" : "qv-plate"}>
                {method === "vin" ? "VIN de tu vehículo (17 caracteres)" : "Placa de tu vehículo"}
              </label>
              {method === "vin" ? (
                <input
                  id="qv-vin"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  maxLength={17}
                  placeholder="Ej: KPTA0A1KSKP123456"
                  value={vin}
                  aria-describedby={lookupError ? "qv-error" : "qv-hint"}
                  aria-invalid={lookupError ? true : undefined}
                  onChange={(e) => {
                    setVin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
                    setLookupError(null);
                  }}
                />
              ) : (
                <input
                  id="qv-plate"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  maxLength={6}
                  placeholder="Ej: ABC123"
                  value={plate}
                  aria-describedby={lookupError ? "qv-error" : "qv-hint"}
                  aria-invalid={lookupError ? true : undefined}
                  onChange={(e) => {
                    setPlate(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
                    setLookupError(null);
                  }}
                />
              )}
            </div>
            <button type="submit" className="btn-main">
              {method === "vin" ? "Buscar por VIN" : "Buscar por placa"}
            </button>
          </div>
          {lookupError ? (
            <p id="qv-error" className="field-error" role="alert">
              {lookupError}
            </p>
          ) : (
            <p id="qv-hint" className="quick-vehicle-hint">
              {method === "vin"
                ? "El VIN está en la tarjeta de propiedad o en el parabrisas. Si no lo tienes, busca por placa o por modelo."
                : "Con la placa te mostramos primero los repuestos que le sirven."}
            </p>
          )}
        </form>
      )}

      <Link href="/repuestos" className="link-button">
        Ver todos los repuestos sin elegir vehículo
      </Link>
    </div>
  );
}
