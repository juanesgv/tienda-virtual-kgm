"use client";

import { useEffect, useMemo, useState } from "react";
import { useVehicle, Vehicle } from "../context/VehicleContext";
import { useDialog } from "../lib/useDialog";

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "placa" | "vin" | "linea";

// Catálogo simulado para la selección guiada (HU-E08-02). No representa el catálogo real de SIISA.
const VEHICLE_CATALOG: Record<string, string[]> = {
  KGM: ["Tivoli", "Tivoli XLV", "Korando", "Rexton", "Musso"],
  SsangYong: ["Tivoli", "Korando", "Rexton"],
};
const YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];
const ENGINES = ["1.6L Gasolina", "1.6L Diésel", "2.2L Diésel", "No estoy seguro"];

// HU-E08-01: simulación de búsqueda por placa/VIN. Nunca llama a un servicio real (RUNT/SIISA).
// Una placa/VIN con un formato claramente inválido simula "no encontrado" para poder mostrar el fallback a manual.
function simulatePlateLookup(plate: string): Vehicle | null {
  if (plate.trim().length < 6) return null;
  return { plate: plate.trim(), brand: "KGM", model: "Tivoli", year: 2023, engine: "1.6L Gasolina" };
}
function simulateVinLookup(vin: string): Vehicle | null {
  if (vin.trim().length < 17) return null;
  return { vin: vin.trim(), brand: "KGM", model: "Tivoli", year: 2023, engine: "1.6L Gasolina" };
}

export default function VehicleModal({ isOpen, onClose }: VehicleModalProps) {
  const { vehicle, vehicles, setVehicle, activateVehicle, removeVehicle } = useVehicle();
  const [activeTab, setActiveTab] = useState<Tab>("placa");
  const [plate, setPlate] = useState("");
  const [vin, setVin] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");

  // HU-E08-01: paso de confirmación antes de guardar lo que devolvió la búsqueda por placa/VIN
  const [pendingVehicle, setPendingVehicle] = useState<Vehicle | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const dialogRef = useDialog<HTMLDivElement>(onClose, isOpen);

  const availableModels = useMemo(() => (brand ? VEHICLE_CATALOG[brand] ?? [] : []), [brand]);

  useEffect(() => {
    if (!isOpen) {
      // Limpiar el formulario cada vez que se cierra, para no arrastrar datos de una búsqueda anterior
      setPlate("");
      setVin("");
      setBrand("");
      setModel("");
      setYear("");
      setEngine("");
      setPendingVehicle(null);
      setLookupError(null);
      setActiveTab("placa");
    }
  }, [isOpen]);

  const handlePlateSearch = () => {
    const result = simulatePlateLookup(plate);
    if (result) {
      setLookupError(null);
      setPendingVehicle(result);
    } else {
      setLookupError("No pudimos identificar un vehículo con esa placa.");
      setPendingVehicle(null);
    }
  };

  const handleVinSearch = () => {
    const result = simulateVinLookup(vin);
    if (result) {
      setLookupError(null);
      setPendingVehicle(result);
    } else {
      setLookupError("El VIN debe tener 17 caracteres. No pudimos identificarlo.");
      setPendingVehicle(null);
    }
  };

  const confirmPendingVehicle = () => {
    if (pendingVehicle) {
      setVehicle(pendingVehicle);
      onClose();
    }
  };

  const goToManualFallback = () => {
    setPendingVehicle(null);
    setLookupError(null);
    setActiveTab("linea");
  };

  const handleManualSave = () => {
    if (!brand || !model || !year) return;
    setVehicle({
      brand,
      model,
      year: parseInt(year),
      engine: engine && engine !== "No estoy seguro" ? engine : undefined,
      approximateMatch: !engine || engine === "No estoy seguro",
    });
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="vehicle-modal active" role="dialog" aria-modal="true" aria-label="Selecciona tu vehículo" ref={dialogRef}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <div className="modal-header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
          </svg>
          <h2>Encuentra repuestos para tu vehículo</h2>
          <p>
            Selecciona tu vehículo para ver compatibilidad de repuestos. <strong>Este paso es opcional</strong> - puedes explorar todos los productos sin identificar tu vehículo.
          </p>
        </div>

        {/* HU-E08-03: Mi Garaje — vehículos ya guardados */}
        {vehicles.length > 0 && (
          <div className="my-garage">
            <h3>Mi garaje</h3>
            <div className="garage-list">
              {vehicles.map((v) => (
                <div key={v.id} className={`garage-item ${vehicle?.plate === v.plate && vehicle?.vin === v.vin && vehicle?.brand === v.brand && vehicle?.model === v.model && vehicle?.year === v.year ? "active" : ""}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                  </svg>
                  <div className="garage-item-info">
                    <span className="garage-item-name">{v.brand} {v.model} {v.year}</span>
                    {v.approximateMatch && <span className="garage-item-note">Versión sin confirmar</span>}
                  </div>
                  {vehicle?.brand === v.brand && vehicle?.model === v.model && vehicle?.year === v.year && vehicle?.plate === v.plate && vehicle?.vin === v.vin ? (
                    <span className="garage-item-active-badge">Activo</span>
                  ) : (
                    <button type="button" className="garage-item-action" onClick={() => { activateVehicle(v.id); onClose(); }}>
                      Usar
                    </button>
                  )}
                  <button
                    type="button"
                    className="garage-item-remove"
                    onClick={() => removeVehicle(v.id)}
                    aria-label={`Quitar ${v.brand} ${v.model} del garaje`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <p className="my-garage-hint">O agrega otro vehículo:</p>
          </div>
        )}

        <div className="vehicle-search-tabs">
          <button
            className={`tab-btn ${activeTab === "placa" ? "active" : ""}`}
            onClick={() => { setActiveTab("placa"); setPendingVehicle(null); setLookupError(null); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12zM9 10h6v2H9v-2zm0-3h6v2H9V7z" />
            </svg>
            Por placa
          </button>
          <button
            className={`tab-btn ${activeTab === "vin" ? "active" : ""}`}
            onClick={() => { setActiveTab("vin"); setPendingVehicle(null); setLookupError(null); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z" />
            </svg>
            Por VIN
          </button>
          <button
            className={`tab-btn ${activeTab === "linea" ? "active" : ""}`}
            onClick={() => { setActiveTab("linea"); setPendingVehicle(null); setLookupError(null); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
            </svg>
            Por línea
          </button>
        </div>

        {activeTab === "placa" && !pendingVehicle && (
          <div className="tab-content active">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Ej: ABC123"
                maxLength={6}
                className="plate-input"
                value={plate}
                onChange={(e) => { setPlate(e.target.value.toUpperCase()); setLookupError(null); }}
              />
              <button className="btn-primary" onClick={handlePlateSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                Buscar por placa
              </button>
            </div>
            <p className="search-hint">
              Ingresa la placa de tu vehículo KGM para encontrar repuestos compatibles.
            </p>
            {lookupError && (
              <div className="lookup-error">
                <p>{lookupError}</p>
                <button type="button" className="link-button" onClick={goToManualFallback}>
                  Seleccionar mi vehículo manualmente
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "vin" && !pendingVehicle && (
          <div className="tab-content active">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Ej: KNAMT81BBM1234567"
                maxLength={17}
                className="vin-input"
                value={vin}
                onChange={(e) => { setVin(e.target.value.toUpperCase()); setLookupError(null); }}
              />
              <button className="btn-primary" onClick={handleVinSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                Buscar por VIN
              </button>
            </div>
            <p className="search-hint">
              El VIN (Vehicle Identification Number) se encuentra en la tarjeta de propiedad o en el parabrisas del vehículo.
            </p>
            {lookupError && (
              <div className="lookup-error">
                <p>{lookupError}</p>
                <button type="button" className="link-button" onClick={goToManualFallback}>
                  Seleccionar mi vehículo manualmente
                </button>
              </div>
            )}
          </div>
        )}

        {/* HU-E08-01: confirmar los datos encontrados antes de guardar */}
        {(activeTab === "placa" || activeTab === "vin") && pendingVehicle && (
          <div className="tab-content active">
            <div className="vehicle-confirm-card">
              <span className="simulated-badge">Búsqueda simulada</span>
              <p className="vehicle-confirm-title">¿Es este tu vehículo?</p>
              <div className="vehicle-confirm-details">
                <strong>{pendingVehicle.brand} {pendingVehicle.model} {pendingVehicle.year}</strong>
                {pendingVehicle.plate && <span>Placa {pendingVehicle.plate}</span>}
                {pendingVehicle.vin && <span>VIN {pendingVehicle.vin}</span>}
              </div>
              <div className="vehicle-confirm-actions">
                <button className="btn-primary" onClick={confirmPendingVehicle}>
                  Sí, es mi vehículo
                </button>
                <button type="button" className="link-button" onClick={goToManualFallback}>
                  No es mi vehículo, buscar manualmente
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "linea" && (
          <div className="tab-content active">
            <div className="select-group">
              <select
                className="select-field"
                value={brand}
                onChange={(e) => { setBrand(e.target.value); setModel(""); }}
              >
                <option value="">Marca</option>
                {Object.keys(VEHICLE_CATALOG).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <select
                className="select-field"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!brand}
              >
                <option value="">Modelo</option>
                {availableModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                className="select-field"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={!model}
              >
                <option value="">Año</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="select-group">
              <select
                className="select-field"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                disabled={!year}
              >
                <option value="">Motor / versión (opcional)</option>
                {ENGINES.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
              <button className="btn-primary" onClick={handleManualSave} disabled={!brand || !model || !year}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Guardar vehículo
              </button>
            </div>
            {/* HU-E08-02: continuar sin versión exacta es válido, pero se advierte que la compatibilidad será aproximada */}
            {year && (!engine || engine === "No estoy seguro") && (
              <p className="search-hint approximate-hint">
                Sin confirmar el motor/versión, la compatibilidad que te mostremos será aproximada.
              </p>
            )}
          </div>
        )}

        <div className="modal-footer">
          <button className="btn-skip" onClick={handleSkip}>
            Explorar sin identificar vehículo →
          </button>
        </div>
      </div>
    </div>
  );
}
