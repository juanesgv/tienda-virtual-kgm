"use client";

import { useState } from "react";
import { useVehicle } from "../context/VehicleContext";

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "placa" | "vin" | "linea";

export default function VehicleModal({ isOpen, onClose }: VehicleModalProps) {
  const { setVehicle } = useVehicle();
  const [activeTab, setActiveTab] = useState<Tab>("placa");
  const [plate, setPlate] = useState("");
  const [vin, setVin] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const handleSave = () => {
    if (activeTab === "linea" && brand && model && year) {
      setVehicle({
        brand,
        model,
        year: parseInt(year),
      });
      onClose();
    } else if (activeTab === "placa" && plate) {
      // Simulación: asignar un vehículo basado en la placa
      setVehicle({
        plate,
        brand: "KGM",
        model: "Tivoli",
        year: 2023,
      });
      onClose();
    } else if (activeTab === "vin" && vin) {
      // Simulación: asignar un vehículo basado en VIN
      setVehicle({
        vin,
        brand: "KGM",
        model: "Tivoli",
        year: 2023,
      });
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="vehicle-modal active">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
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

        <div className="vehicle-search-tabs">
          <button
            className={`tab-btn ${activeTab === "placa" ? "active" : ""}`}
            onClick={() => setActiveTab("placa")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12zM9 10h6v2H9v-2zm0-3h6v2H9V7z" />
            </svg>
            Por placa
          </button>
          <button
            className={`tab-btn ${activeTab === "vin" ? "active" : ""}`}
            onClick={() => setActiveTab("vin")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z" />
            </svg>
            Por VIN
          </button>
          <button
            className={`tab-btn ${activeTab === "linea" ? "active" : ""}`}
            onClick={() => setActiveTab("linea")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
            </svg>
            Por línea
          </button>
        </div>

        {activeTab === "placa" && (
          <div className="tab-content active">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Ej: ABC123"
                maxLength={6}
                className="plate-input"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
              />
              <button className="btn-primary" onClick={handleSave}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                Buscar por placa
              </button>
            </div>
            <p className="search-hint">
              Ingresa la placa de tu vehículo KGM para encontrar repuestos compatibles.
            </p>
          </div>
        )}

        {activeTab === "vin" && (
          <div className="tab-content active">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Ej: KNAMT81BBM1234567"
                maxLength={17}
                className="vin-input"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
              />
              <button className="btn-primary" onClick={handleSave}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                Buscar por VIN
              </button>
            </div>
            <p className="search-hint">
              El VIN (Vehicle Identification Number) se encuentra en la tarjeta de propiedad o en el parabrisas del vehículo.
            </p>
          </div>
        )}

        {activeTab === "linea" && (
          <div className="tab-content active">
            <div className="select-group">
              <select className="select-field" value={brand} onChange={(e) => setBrand(e.target.value)}>
                <option value="">Marca</option>
                <option value="KGM">KGM</option>
                <option value="SsangYong">SsangYong</option>
              </select>
              <select className="select-field" value={model} onChange={(e) => setModel(e.target.value)}>
                <option value="">Modelo</option>
                <option value="Tivoli">Tivoli</option>
                <option value="Tivoli XLV">Tivoli XLV</option>
                <option value="Korando">Korando</option>
                <option value="Rexton">Rexton</option>
                <option value="Musso">Musso</option>
              </select>
              <select className="select-field" value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Año</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
                <option value="2015">2015</option>
              </select>
              <button className="btn-primary" onClick={handleSave}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Guardar vehículo
              </button>
            </div>
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
