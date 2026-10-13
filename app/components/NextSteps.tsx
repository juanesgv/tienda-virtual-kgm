import { WARRANTY_AND_RETURNS_SUMMARY } from "../data/policies";

// Mejora A5 del análisis de iMotriz: hacer visible que alguien revisa la compatibilidad antes de despachar (E19: un
// error de compatibilidad genera devolución; E19 admite empezar manual en el MVP). Es una PROPUESTA de proceso:
// depende de que Posventa tenga capacidad para validar cada pedido, y así se rotula en pantalla.
export default function NextSteps({ hasVehicle }: { hasVehicle: boolean }) {
  return (
    <section className="next-steps" aria-labelledby="next-steps-title">
      <h4 id="next-steps-title">¿Qué pasa después de confirmar?</h4>
      <ol>
        <li>
          <strong>Revisamos la compatibilidad.</strong> Un asesor valida que cada repuesto sirva para tu vehículo
          {hasVehicle ? "." : "; si aún no lo identificaste, te preguntamos cuál es."}
        </li>
        <li>
          <strong>Coordinamos el pago.</strong> Te contactamos; no se cobra nada antes de eso.
        </li>
        <li>
          <strong>Despachamos y te avisamos.</strong> Recibes el aviso del envío con la fecha estimada.
        </li>
      </ol>
      <p className="next-steps-policy">{WARRANTY_AND_RETURNS_SUMMARY}.</p>
      <span className="simulated-badge">Proceso propuesto · por validar con Posventa</span>
    </section>
  );
}
