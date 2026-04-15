"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import type { VehicleSelection } from "./data";

type VehicleContextValue = {
  vehicle: VehicleSelection | null;
  setVehicle: Dispatch<SetStateAction<VehicleSelection | null>>;
  compatibilityFilterOn: boolean;
  setCompatibilityFilterOn: Dispatch<SetStateAction<boolean>>;
};

const VehicleContext = createContext<VehicleContextValue | undefined>(
  undefined
);

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicle, setVehicle] = useState<VehicleSelection | null>(null);
  const [compatibilityFilterOn, setCompatibilityFilterOn] =
    useState<boolean>(false);

  return (
    <VehicleContext.Provider
      value={{ vehicle, setVehicle, compatibilityFilterOn, setCompatibilityFilterOn }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicle() {
  const ctx = useContext(VehicleContext);
  if (!ctx) {
    throw new Error("useVehicle debe usarse dentro de VehicleProvider");
  }
  return ctx;
}

