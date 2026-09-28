"use client";

import Link from "next/link";
import { useAdvisor } from "../../context/AdvisorContext";
import { CHANNEL_LABEL, ORIGIN_META } from "../../types/advisor";

// Modelo conceptual §7: las solicitudes de ayuda se registran clasificadas por origen.
// Esta pantalla es solo de demo: en producción viviría en el sistema del equipo de asesoría, no en la tienda.
export default function AdvisorRegistryPage() {
  const { requests } = useAdvisor();
  const friction = requests.filter((r) => r.kind === "fricción").length;
  const advice = requests.length - friction;

  return (
    <div className="advisor-registry" style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px 60px" }}>
      <div className="breadcrumb">
        <Link href="/">Inicio</Link> / <span>Registro de solicitudes de asesoría</span>
      </div>
      <span className="simulated-badge">Pantalla de demo · no existe en la tienda real</span>
      <h1>Registro de solicitudes de asesoría</h1>
      <p className="advisor-intro">
        Cada solicitud queda clasificada por su origen: <strong>fricción</strong> (no encontró algo o algo falló) o{" "}
        <strong>asesoría</strong> (necesita criterio experto). Total: {requests.length} · fricción: {friction} · asesoría:{" "}
        {advice}.
      </p>

      {requests.length === 0 ? (
        <p>Aún no hay solicitudes. Abre el asesor desde el buscador sin resultados, una ficha o el pie de página.</p>
      ) : (
        <div className="advisor-registry-scroll">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Origen</th>
                <th>Tipo</th>
                <th>Contexto enviado</th>
                <th>Canal</th>
                <th>Atención</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{new Date(r.createdAt).toLocaleString("es-CO")}</td>
                  <td>{ORIGIN_META[r.origin].label}</td>
                  <td>
                    <span className={`advisor-kind ${r.kind === "fricción" ? "friccion" : "asesoria"}`}>{r.kind}</span>
                  </td>
                  <td>
                    {r.vehicle && (
                      <div>
                        Vehículo: {r.vehicle.brand} {r.vehicle.model} {r.vehicle.year}
                      </div>
                    )}
                    {r.searchQuery && <div>Búsqueda: "{r.searchQuery}"</div>}
                    {r.product && <div>Repuesto: {r.product.name}</div>}
                    {r.cartItems && <div>Carrito: {r.cartItems} producto(s)</div>}
                    {r.message && <div>Mensaje: "{r.message}"</div>}
                    {!r.vehicle && !r.searchQuery && !r.product && !r.cartItems && !r.message && "—"}
                  </td>
                  <td>
                    {CHANNEL_LABEL[r.channel]}
                    <div>{r.contact}</div>
                  </td>
                  <td>{r.withinHours ? "En horario" : "Fuera de horario"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
