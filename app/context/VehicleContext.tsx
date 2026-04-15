'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Vehicle {
  plate?: string;
  vin?: string;
  brand: string;
  model: string;
  year: number;
}

interface VehicleContextType {
  vehicle: Vehicle | null;
  setVehicle: (vehicle: Vehicle | null) => void;
  isVehicleSaved: boolean;
  clearVehicle: () => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicle, setVehicleState] = useState<Vehicle | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar vehículo desde localStorage al iniciar
  useEffect(() => {
    const savedVehicle = localStorage.getItem('kgm-vehicle');
    if (savedVehicle) {
      try {
        setVehicleState(JSON.parse(savedVehicle));
      } catch (e) {
        console.error('Error parsing saved vehicle:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar vehículo en localStorage cuando cambie
  const setVehicle = (newVehicle: Vehicle | null) => {
    setVehicleState(newVehicle);
    if (newVehicle) {
      localStorage.setItem('kgm-vehicle', JSON.stringify(newVehicle));
    } else {
      localStorage.removeItem('kgm-vehicle');
    }
  };

  const clearVehicle = () => {
    setVehicleState(null);
    localStorage.removeItem('kgm-vehicle');
  };

  // No renderizar hasta que se haya cargado el estado inicial
  if (!isLoaded) {
    return null;
  }

  return (
    <VehicleContext.Provider
      value={{
        vehicle,
        setVehicle,
        isVehicleSaved: !!vehicle,
        clearVehicle,
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
