"use client";

import { useSyncExternalStore } from "react";
import { EstimatedDelivery, getEstimatedDelivery } from "../data/delivery";

const noopSubscribe = () => () => {};
const SEPARATOR = "|";

// La fecha depende del reloj del navegador, así que no se puede pintar en el servidor sin riesgo de desajuste:
// en el servidor devuelve null (no se muestra) y en el cliente la fecha de hoy. El valor intermedio es un texto
// estable (no un objeto nuevo en cada lectura) para que useSyncExternalStore no re-renderice sin parar.
export function useEstimatedDelivery(): EstimatedDelivery | null {
  const key = useSyncExternalStore(
    noopSubscribe,
    () => {
      const { short, long } = getEstimatedDelivery();
      return `${short}${SEPARATOR}${long}`;
    },
    () => ""
  );
  if (!key) return null;
  const [short, long] = key.split(SEPARATOR);
  return { short, long };
}
