// HU-E13-04 (criterio 3) y modelo de dominio §6: una búsqueda sin resultados queda registrada AUNQUE el cliente no deje
// sus datos. Es analítica agregada, sin identidad: solo el término, la fecha y, si hay, el vehículo activo.
// En el prototipo vive en localStorage; en producción iría a la analítica (E33) y al back-office (E43).
export const UNMET_SEARCHES_KEY = "kgm-unmet-searches";

export interface UnmetSearch {
  term: string;
  at: string;
  vehicle?: string;
}

export function parseUnmetSearches(raw: string): UnmetSearch[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UnmetSearch[]) : [];
  } catch {
    return [];
  }
}

export function logUnmetSearch(rawTerm: string, vehicle?: string) {
  const term = rawTerm.trim().toLowerCase();
  if (term.length < 2) return;
  try {
    const list = parseUnmetSearches(localStorage.getItem(UNMET_SEARCHES_KEY) ?? "");
    const last = list[list.length - 1];
    // Recargar la misma búsqueda no la cuenta dos veces seguidas
    if (last && last.term === term && Date.now() - new Date(last.at).getTime() < 60_000) return;
    list.push({ term, at: new Date().toISOString(), ...(vehicle ? { vehicle } : {}) });
    localStorage.setItem(UNMET_SEARCHES_KEY, JSON.stringify(list.slice(-200)));
  } catch {
    // Sin almacenamiento disponible: el registro es solo una ayuda de analítica, nunca bloquea la búsqueda
  }
}
