"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ServiceStatusContextType {
  /** HU-E40 (épica sin historias redactadas en Notion, referenciada como dependencia de E02/E55):
   *  simula que el servicio de catálogo/inventario ("SIISA") no está respondiendo. */
  isInventoryDown: boolean;
  toggleInventoryDown: () => void;
}

const ServiceStatusContext = createContext<ServiceStatusContextType | undefined>(undefined);

const STORAGE_KEY = "kgm-demo-inventory-down";

export function ServiceStatusProvider({ children }: { children: ReactNode }) {
  const [isInventoryDown, setIsInventoryDown] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsInventoryDown(localStorage.getItem(STORAGE_KEY) === "true");
    setIsLoaded(true);
  }, []);

  const toggleInventoryDown = () => {
    setIsInventoryDown((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ServiceStatusContext.Provider value={{ isInventoryDown, toggleInventoryDown }}>
      {children}
    </ServiceStatusContext.Provider>
  );
}

export function useServiceStatus() {
  const context = useContext(ServiceStatusContext);
  if (context === undefined) {
    throw new Error("useServiceStatus must be used within a ServiceStatusProvider");
  }
  return context;
}
