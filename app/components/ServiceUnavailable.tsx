"use client";

import Link from "next/link";
import { useAdvisor } from "../context/AdvisorContext";

interface ServiceUnavailableProps {
  title?: string;
  description?: string;
}

// HU-E40 (épica sin historias redactadas en Notion): comportamiento cuando el catálogo/inventario
// ("SIISA") no responde. Activado desde el interruptor de demo en el pie de página.
export default function ServiceUnavailable({
  title = "No pudimos cargar el catálogo en este momento",
  description = "Estamos teniendo problemas para conectarnos con el sistema de inventario. Tus datos y tu carrito están a salvo — intenta de nuevo en unos minutos.",
}: ServiceUnavailableProps) {
  const { openAdvisor } = useAdvisor();

  return (
    <div className="service-unavailable">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="service-unavailable-actions">
        <button type="button" className="btn-main" onClick={() => window.location.reload()}>
          Reintentar
        </button>
        <Link href="/" className="btn-outline">
          Volver al inicio
        </Link>
      </div>

      <button type="button" className="link-button" onClick={() => openAdvisor({ origin: "service_down" })}>
        ¿Necesitas ayuda ahora? Habla con un asesor
      </button>
    </div>
  );
}
