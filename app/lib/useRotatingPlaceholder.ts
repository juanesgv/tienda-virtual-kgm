"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// HU-E04-03: enseñar con ejemplos reales cómo conviene escribir ("pieza + modelo") sin ocupar espacio extra.
// El texto cambia solo cuando el campo está vacío y sin foco; con "reducir movimiento" no rota (queda el texto base).
// Es solo una pista visual: el campo conserva su aria-label fijo, así que los lectores de pantalla no leen la rotación.
export function useRotatingPlaceholder(base: string, examples: string[], paused: boolean, intervalMs = 3500) {
  const [index, setIndex] = useState(-1); // -1 = texto base
  // En el servidor se asume "reducir movimiento" para que el primer render sea siempre el texto base
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true
  );

  useEffect(() => {
    if (paused || reduceMotion || examples.length === 0) return;
    const id = window.setInterval(() => setIndex((current) => (current + 1) % examples.length), intervalMs);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, examples.length, intervalMs]);

  if (paused || reduceMotion || index < 0 || examples.length === 0) return base;
  return `Ej: ${examples[index % examples.length]}`;
}
