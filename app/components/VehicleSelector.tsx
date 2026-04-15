"use client";

import { FormEvent, useState } from "react";
import { useVehicle } from "../VehicleContext";
import type { VehicleModel } from "../data";

type Tab = "placa" | "vin" | "linea" | "repuesto";

export function VehicleSelector() {
  const { vehicle, setVehicle, setCompatibilityFilterOn } = useVehicle();
  const [activeTab, setActiveTab] = useState<Tab>("placa");
  const [plate, setPlate] = useState(vehicle?.plate ?? "");
  const [model, setModel] = useState<VehicleModel | "">(
    (vehicle?.model as VehicleModel) ?? ""
  );
  const [year, setYear] = useState<number | "">(
    vehicle?.year ? vehicle.year : ""
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setVehicle({
      plate: plate || undefined,
      model: model || undefined,
      year: typeof year === "number" ? year : undefined,
    });
    setCompatibilityFilterOn(true);
  }

  function clearVehicle() {
    setVehicle(null);
    setCompatibilityFilterOn(false);
    setPlate("");
    setModel("");
    setYear("");
  }

  return (
    <aside className="hero-side-card" id="compatibilidad">
      <div className="hero-side-header">
        <div>
          <div className="hero-side-title">Tu vehículo KGM</div>
          <div className="hero-side-subtitle">
            Opcional: úsalo para validar compatibilidad sin bloquear tu
            navegación.
          </div>
        </div>
        <div className="hero-side-tag">Modo compatible activable</div>
      </div>

      <div>
        <div className="vehicle-search-tabs">
          <button
            type="button"
            className={`vehicle-tab ${activeTab === "placa" ? "is-active" : ""}`}
            onClick={() => setActiveTab("placa")}
          >
            Placa
          </button>
          <button
            type="button"
            className={`vehicle-tab ${activeTab === "vin" ? "is-active" : ""}`}
            onClick={() => setActiveTab("vin")}
          >
            VIN
          </button>
          <button
            type="button"
            className={`vehicle-tab ${activeTab === "linea" ? "is-active" : ""}`}
            onClick={() => setActiveTab("linea")}
          >
            Línea
          </button>
          <button
            type="button"
            className={`vehicle-tab ${
              activeTab === "repuesto" ? "is-active" : ""
            }`}
            onClick={() => setActiveTab("repuesto")}
          >
            Ref. repuesto
          </button>
        </div>

        <form className="vehicle-form" onSubmit={handleSubmit}>
          {activeTab === "placa" && (
            <>
              <div>
                <label className="field-label" htmlFor="placa">
                  Placa del vehículo
                </label>
                <input
                  id="placa"
                  type="text"
                  className="field-input"
                  placeholder="ABC123"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                />
              </div>
            </>
          )}

          {(activeTab === "placa" || activeTab === "linea") && (
            <>
              <div>
                <label className="field-label" htmlFor="modelo">
                  Modelo
                </label>
                <select
                  id="modelo"
                  className="field-select"
                  value={model}
                  onChange={(e) => setModel(e.target.value as VehicleModel)}
                >
                  <option value="">Selecciona modelo</option>
                  <option value="Tivoli">Tivoli</option>
                  <option value="Korando">Korando</option>
                  <option value="Rexton">Rexton</option>
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="anio">
                  Año
                </label>
                <select
                  id="anio"
                  className="field-select"
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value ? Number(e.target.value) : "")
                  }
                >
                  <option value="">Selecciona año</option>
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                  <option value={2022}>2022</option>
                  <option value={2021}>2021</option>
                  <option value={2020}>2020</option>
                </select>
              </div>
            </>
          )}

          {activeTab === "vin" && (
            <div>
              <label className="field-label" htmlFor="vin">
                VIN
              </label>
              <input
                id="vin"
                type="text"
                className="field-input"
                placeholder="KGM123VIN4567890"
              />
            </div>
          )}

          {activeTab === "repuesto" && (
            <div>
              <label className="field-label" htmlFor="ref">
                Referencia del repuesto
              </label>
              <input
                id="ref"
                type="text"
                className="field-input"
                placeholder="Código interno CRM"
              />
            </div>
          )}

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
            <button type="submit" className="btn-primary">
              Aplicar compatibilidad
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={clearVehicle}
            >
              Limpiar
            </button>
          </div>
        </form>

        <div className="vehicle-meta">
          <span>
            {vehicle?.model && vehicle.year
              ? `Aplicado: ${vehicle.model} ${vehicle.year}`
              : "Sin vehículo aplicado"}
          </span>
          <span className="compat-tag">Filtrado por compatibilidad opcional</span>
        </div>
      </div>
    </aside>
  );
}

