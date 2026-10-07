"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVehicle } from "../context/VehicleContext";
import { VEHICLE_CATALOG, YEARS } from "./VehicleModal";

// Selector rápido de la portada (marca / modelo / año): la tarea principal de la tienda a un paso.
// Placa y VIN siguen en VehicleModal (onOpenModal). Sin motor, la compatibilidad queda como "sin confirmar".
export default function QuickVehicleForm({ onOpenModal }: { onOpenModal: () => void }) {
  const router = useRouter();
  const { setVehicle } = useVehicle();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const models = useMemo(() => (brand ? VEHICLE_CATALOG[brand] ?? [] : []), [brand]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !year) return;
    setVehicle({ brand, model, year: parseInt(year), approximateMatch: true });
    router.push("/repuestos?compatible=true");
  };

  return (
    <form className="quick-vehicle-form" onSubmit={submit}>
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
        <button type="button" className="btn-secondary" onClick={onOpenModal}>
          Buscar por placa o VIN
        </button>
        <Link href="/repuestos" className="btn-secondary">
          Ver todos los repuestos
        </Link>
      </div>
    </form>
  );
}