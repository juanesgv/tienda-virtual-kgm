// E54 / E21 / E22: asesoría asistida. El canal real está por definir en Notion; todo este flujo es una simulación.

export type AdvisorOrigin =
  | "home"
  | "footer"
  | "empty_search"
  | "service_down"
  | "product_compat"
  | "product_no_alternatives"
  | "product_complements";

export type AdvisorKind = "fricción" | "asesoría";

// Modelo conceptual §7: cada solicitud queda clasificada desde su origen.
// "fricción" = no encontró algo que sí existía o algo falló; "asesoría" = necesita criterio experto.
export const ORIGIN_META: Record<AdvisorOrigin, { label: string; kind: AdvisorKind }> = {
  home: { label: "Inicio", kind: "asesoría" },
  footer: { label: "Pie de página", kind: "asesoría" },
  empty_search: { label: "Búsqueda sin resultados", kind: "fricción" },
  service_down: { label: "Catálogo no disponible", kind: "fricción" },
  product_compat: { label: "Duda de compatibilidad en la ficha", kind: "asesoría" },
  product_no_alternatives: { label: "Repuesto sin alternativas", kind: "fricción" },
  product_complements: { label: "Consulta de complementos en la ficha", kind: "asesoría" },
};

export type AdvisorChannel = "whatsapp" | "llamada" | "correo";

export const CHANNEL_LABEL: Record<AdvisorChannel, string> = {
  whatsapp: "WhatsApp",
  llamada: "Llamada",
  correo: "Correo",
};

export interface AdvisorOpenOptions {
  origin: AdvisorOrigin;
  searchQuery?: string;
  product?: { id: string; name: string; sku: string };
  prefillMessage?: string;
}

export interface AdvisorRequest {
  id: string;
  createdAt: string;
  origin: AdvisorOrigin;
  kind: AdvisorKind;
  returnTo: string;
  vehicle?: { brand: string; model: string; year: number; engine?: string };
  searchQuery?: string;
  product?: { id: string; name: string; sku: string };
  cartItems?: number;
  message: string;
  channel: AdvisorChannel;
  contact: string;
  withinHours: boolean;
}

export type NewAdvisorRequest = Omit<AdvisorRequest, "id" | "createdAt" | "kind">;

export interface ActiveAdvisor extends AdvisorOpenOptions {
  returnTo: string;
}
