'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Vehicle {
  plate?: string;
  vin?: string;
  brand: string;
  model: string;
  year: number;
  engine?: string;
  // HU-E08-02: el usuario continuó sin confirmar la versión/motor exacto.
  approximateMatch?: boolean;
}

export interface SavedVehicle extends Vehicle {
  id: string;
}

interface VehicleContextType {
  /** Vehículo activo (o null si no hay ninguno activo en este momento). */
  vehicle: Vehicle | null;
  /** HU-E08-03: todos los vehículos guardados en el garaje del usuario. */
  vehicles: SavedVehicle[];
  /** Agrega (o activa, si ya existe) un vehículo y lo deja como activo. */
  setVehicle: (vehicle: Vehicle | null) => void;
  isVehicleSaved: boolean;
  /** HU-E08-05: quita el vehículo activo sin borrarlo del garaje. */
  clearVehicle: () => void;
  /** HU-E08-03: activa un vehículo ya guardado en el garaje. */
  activateVehicle: (id: string) => void;
  /** HU-E08-03: elimina un vehículo del garaje. */
  removeVehicle: (id: string) => void;
  /** HU-E07-01: el filtro "solo compatibles" persiste entre catálogo, búsqueda y categorías. Quitarlo no borra el vehículo. */
  compatibleOnly: boolean;
  setCompatibleOnly: (value: boolean) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

const GARAGE_KEY = 'kgm-garage';
const ACTIVE_ID_KEY = 'kgm-active-vehicle-id';
const LEGACY_VEHICLE_KEY = 'kgm-vehicle';
const COMPATIBLE_ONLY_KEY = 'kgm-compatible-only';

function sameVehicle(a: Vehicle, b: Vehicle): boolean {
  if (a.plate && b.plate) return a.plate.toUpperCase() === b.plate.toUpperCase();
  if (a.vin && b.vin) return a.vin.toUpperCase() === b.vin.toUpperCase();
  return (
    a.brand.toLowerCase() === b.brand.toLowerCase() &&
    a.model.toLowerCase() === b.model.toLowerCase() &&
    a.year === b.year
  );
}

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<SavedVehicle[]>([]);
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  const [compatibleOnly, setCompatibleOnlyState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const setCompatibleOnly = (value: boolean) => {
    setCompatibleOnlyState(value);
    localStorage.setItem(COMPATIBLE_ONLY_KEY, String(value));
  };

  // Cargar garaje desde localStorage al iniciar (con migración desde el formato anterior de un solo vehículo)
  useEffect(() => {
    setCompatibleOnlyState(localStorage.getItem(COMPATIBLE_ONLY_KEY) === 'true');
    try {
      const savedGarage = localStorage.getItem(GARAGE_KEY);
      const savedActiveId = localStorage.getItem(ACTIVE_ID_KEY);

      if (savedGarage) {
        setVehicles(JSON.parse(savedGarage));
        setActiveVehicleId(savedActiveId || null);
      } else {
        // Migración: versión anterior solo guardaba un vehículo activo, sin garaje.
        const legacy = localStorage.getItem(LEGACY_VEHICLE_KEY);
        if (legacy) {
          const parsed: Vehicle = JSON.parse(legacy);
          const migrated: SavedVehicle = { ...parsed, id: `veh-${Date.now()}` };
          setVehicles([migrated]);
          setActiveVehicleId(migrated.id);
          localStorage.setItem(GARAGE_KEY, JSON.stringify([migrated]));
          localStorage.setItem(ACTIVE_ID_KEY, migrated.id);
          localStorage.removeItem(LEGACY_VEHICLE_KEY);
        }
      }
    } catch (e) {
      console.error('Error cargando el garaje guardado:', e);
    }
    setIsLoaded(true);
  }, []);

  const persist = (nextVehicles: SavedVehicle[], nextActiveId: string | null) => {
    setVehicles(nextVehicles);
    setActiveVehicleId(nextActiveId);
    localStorage.setItem(GARAGE_KEY, JSON.stringify(nextVehicles));
    if (nextActiveId) {
      localStorage.setItem(ACTIVE_ID_KEY, nextActiveId);
    } else {
      localStorage.removeItem(ACTIVE_ID_KEY);
    }
  };

  // Agrega un vehículo nuevo o activa uno ya existente en el garaje (evita duplicados)
  const setVehicle = (newVehicle: Vehicle | null) => {
    if (!newVehicle) {
      persist(vehicles, null);
      return;
    }

    const existing = vehicles.find((v) => sameVehicle(v, newVehicle));
    if (existing) {
      const merged: SavedVehicle = { ...existing, ...newVehicle, id: existing.id };
      persist(vehicles.map((v) => (v.id === existing.id ? merged : v)), existing.id);
      return;
    }

    const created: SavedVehicle = { ...newVehicle, id: `veh-${Date.now()}` };
    persist([...vehicles, created], created.id);
  };

  const clearVehicle = () => {
    persist(vehicles, null);
    setCompatibleOnly(false);
  };

  const activateVehicle = (id: string) => {
    if (vehicles.some((v) => v.id === id)) {
      persist(vehicles, id);
    }
  };

  const removeVehicle = (id: string) => {
    const remaining = vehicles.filter((v) => v.id !== id);
    persist(remaining, activeVehicleId === id ? null : activeVehicleId);
  };

  const vehicle = vehicles.find((v) => v.id === activeVehicleId) ?? null;

  // No renderizar hasta que se haya cargado el estado inicial
  if (!isLoaded) {
    return null;
  }

  return (
    <VehicleContext.Provider
      value={{
        vehicle,
        vehicles,
        setVehicle,
        isVehicleSaved: !!vehicle,
        clearVehicle,
        activateVehicle,
        removeVehicle,
        compatibleOnly,
        setCompatibleOnly,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicle() {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
}
