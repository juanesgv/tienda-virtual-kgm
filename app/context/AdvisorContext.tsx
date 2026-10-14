"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AdvisorModal from "../components/AdvisorModal";
import { ActiveAdvisor, AdvisorOpenOptions, AdvisorRequest, NewAdvisorRequest, ORIGIN_META } from "../types/advisor";

interface AdvisorContextType {
  openAdvisor: (options: AdvisorOpenOptions) => void;
  requests: AdvisorRequest[];
}

const AdvisorContext = createContext<AdvisorContextType | undefined>(undefined);

const STORAGE_KEY = "kgm-advisor-requests";

export function AdvisorProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveAdvisor | null>(null);
  const [requests, setRequests] = useState<AdvisorRequest[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) setRequests(parsed);
    } catch (e) {
      console.error("Error leyendo solicitudes de asesoría:", e);
    }
    setIsLoaded(true);
  }, []);

  // La persistencia vive en un efecto (no dentro del updater de estado) y tolera almacenamiento bloqueado
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error("No se pudo guardar el registro de asesoría:", e);
    }
  }, [requests, isLoaded]);

  const openAdvisor = (options: AdvisorOpenOptions) => {
    // El retorno al flujo original se captura al abrir (HU-E54-04)
    setActive({ ...options, returnTo: `${window.location.pathname}${window.location.search}` });
  };

  const submitRequest = (request: NewAdvisorRequest): AdvisorRequest => {
    const created: AdvisorRequest = {
      ...request,
      id: `ASE-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      kind: ORIGIN_META[request.origin].kind,
    };
    setRequests((current) => [created, ...current]);
    return created;
  };

  return (
    <AdvisorContext.Provider value={{ openAdvisor, requests }}>
      {children}
      {active && <AdvisorModal options={active} onSubmit={submitRequest} onClose={() => setActive(null)} />}
    </AdvisorContext.Provider>
  );
}

export function useAdvisor() {
  const context = useContext(AdvisorContext);
  if (context === undefined) {
    throw new Error("useAdvisor must be used within an AdvisorProvider");
  }
  return context;
}
