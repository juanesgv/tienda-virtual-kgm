import { OrderStatus } from "../types/account";

interface OrderStatusTimelineProps {
  status: OrderStatus;
  orderId: string;
}

const STAGES = [
  { key: "recibido", label: "Pedido recibido" },
  { key: "preparando", label: "Preparando" },
  { key: "enviado", label: "Enviado" },
  { key: "entregado", label: "Entregado" },
];

// HU-E15-03: seguimiento del envío. No hay integración real de transportador todavía —
// el estado disponible hoy (pendiente/completado/cancelado) se traduce a esta línea de tiempo.
export default function OrderStatusTimeline({ status, orderId }: OrderStatusTimelineProps) {
  if (status === "cancelado") {
    return (
      <div className="order-status-timeline cancelled">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        <span>Este pedido fue cancelado.</span>
      </div>
    );
  }

  // "pendiente" = recién recibido; "completado" = todo el recorrido hasta entregado (simulado)
  const activeIndex = status === "completado" ? STAGES.length - 1 : 0;

  return (
    <div className="order-status-timeline">
      <div className="timeline-stages">
        {STAGES.map((stage, index) => (
          <div key={stage.key} className={`timeline-stage ${index <= activeIndex ? "done" : ""}`}>
            <span className="timeline-dot" />
            <span className="timeline-label">{stage.label}</span>
          </div>
        ))}
      </div>
      {status === "completado" ? (
        <p className="timeline-tracking">
          <span className="simulated-badge">Guía simulada</span> N.º de seguimiento: TRK-{Math.abs(hashCode(orderId)).toString().slice(0, 8)}
        </p>
      ) : (
        <p className="timeline-hint">Te avisaremos aquí cuando tu pedido sea despachado.</p>
      )}
    </div>
  );
}

function hashCode(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
