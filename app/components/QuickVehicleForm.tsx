"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVehicle, Vehicle } from "../context/VehicleContext";
import { simulatePlateLookup, VEHICLE_CATALOG, VehicleModalTab, YEARS } from "./VehicleModal";

type Mode = "placa" | "manual";

// Identificador rápido de la portada. La placa es el primer camino (HU-E01-02 / HU-E08-01); si el cliente no la
// tiene a mano o no se reconoce, pasa a marca / modelo / año (HU-E08-02). El VIN y el garaje siguen en VehicleModal.
// La búsqueda por placa es simulada: nunca llama a RUNT ni a SIISA. Sin motor, la compatibilidad queda "sin confirmar".
export default function QuickVehicleForm({ onOpenModal }: { onOpenModal: (tab?: VehicleModalTab) => void }) {
  const router = useRouter();
  const { setVehicle } = useVehicle();
  const [mode, setMode] = useState<Mode>("placa");
  const [plate, setPlate] = useState("");
  const [pending, setPending] = useState<Vehicle | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const models = useMemo(() => (brand ? VEHICLE_CATALOG[brand] ?? [] : []), [brand]);

  const goToCompatible = () => router.push("/repuestos?compatible=true");

  const searchPlate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = simulatePlateLookup(plate);
    if (result) {
      setLookupError(null);
      setPending(result);
    } else {
      setPending(null);
      setLookupError("No pudimos identificar un vehículo con esa placa. Revisa que tenga 6 caracteres.");
    }
  };

  const confirmPending = () => {
    if (!pending) return;
    setVehicle(pending);
    goToCompatible();
  };

  const switchToManual = () => {
    setPending(null);
    setLookupError(null);
    setMode("manual");
  };

  const saveManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !year) return;
    setVehicle({ brand, model, year: parseInt(year), approximateMatch: true });
    goToCompatible();
  };

  // El VIN sigue disponible, pero como camino de menor uso (número largo): enlace discreto que abre VehicleModal
  const vinLink = (
    <button type="button" className="link-button" onClick={() => onOpenModal("vin")}>
      Buscar por VIN
    </button>
  );

  if (mode === "manual") {
    return (
      <form className="quick-vehicle-form" onSubmit={saveManual}>
        <div className="quick-vehicle-fields">
          <div className="form-group">
            <label htmlFor="qv-brand">Marca</label>
            <select
              id="qv-brand"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setModel("");
                setYear("");
              }}
            >
              <option value="">Elige</option>
              {Object.keys(VEHICLE_CATALOG).map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="qv-model">Modelo</label>
            <select
              id="qv-model"
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                setYear("");
              }}
              disabled={!brand}
            >
              <option value="">Elige</option>
              {models.map((m) => (
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
          <button type="submit" className="btn-main" disabled={!brand || !model || !year}>
            Ver repuestos compatibles
          </button>
          <button type="button" className="btn-secondary" onClick={() => setMode("placa")}>
            Buscar por placa
          </button>
        </div>
        <p className="quick-vehicle-hint">Sin el motor, la compatibilidad de algunos repuestos quedará por confirmar.</p>
        {vinLink}
      </form>
    );
  }

  // Resultado de la búsqueda por placa: se confirma antes de guardar (HU-E08-01)
  if (pending) {
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
          </div>
          <div className="vehicle-confirm-actions">
            <button type="button" className="btn-main" onClick={confirmPending}>
              Sí, es mi vehículo
            </button>
            <button type="button" className="link-button" onClick={switchToManual}>
              No es mi vehículo, elegirlo manualmente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quick-vehicle-form">
      <form onSubmit={searchPlate} noValidate>
        <div className="quick-plate-row">
          <div className="form-group">
            <label htmlFor="qv-plate">Placa de tu vehículo</label>
            <input
              id="qv-plate"
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={6}
              placeholder="Ej: ABC123"
              value={plate}
              aria-describedby={lookupError ? "qv-plate-error" : "qv-plate-hint"}
              aria-invalid={lookupError ? true : undefined}
              onChange={(e) => {
                setPlate(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
                setLookupError(null);
              }}
            />
          </div>
          <button type="submit" className="btn-main">
            Buscar por placa
          </button>
        </div>
        {lookupError ? (
          <p id="qv-plate-error" className="field-error" role="alert">
            {lookupError}
          </p>
        ) : (
          <p id="qv-plate-hint" className="quick-vehicle-hint">
            Con la placa te mostramos primero los repuestos que le sirven.
          </p>
        )}
      </form>

      <div className="vehicle-panel-actions">
        <button type="button" className="btn-secondary" onClick={switchToManual}>
          Buscar por modelo
        </button>
        <Link href="/repuestos" className="btn-secondary">
          Ver todos los repuestos
        </Link>
      </div>

      {vinLink}
    </div>
  );
}
