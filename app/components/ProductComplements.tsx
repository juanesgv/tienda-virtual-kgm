"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice, getProductRelations, Product, ProductRelationType } from "../data/products";
import { useVehicle } from "../context/VehicleContext";
import { useCart } from "../context/CartContext";
import { useAdvisor } from "../context/AdvisorContext";

// E55 (posible funcionalidad, dato sin dueño definido): complementos necesarios para instalar un repuesto.
// Es CORRECCIÓN, no venta cruzada: por eso se separa lo indispensable de lo recomendado (HU-E55-02) y
// la ausencia de dato nunca se presenta como "no necesitas nada más" (HU-E55-03).
const GROUPS: { type: ProductRelationType; title: string; tag: string }[] = [
  { type: "required", title: "Necesarios para instalar", tag: "Necesario" },
  { type: "replaced_together", title: "Se reemplazan juntos", tag: "Se cambia junto" },
  { type: "recommended", title: "Recomendados", tag: "Recomendado" },
];

export default function ProductComplements({ product }: { product: Product }) {
  const { vehicle, isVehicleSaved } = useVehicle();
  const { addToCart } = useCart();
  const { openAdvisor } = useAdvisor();

  const activeVehicle = isVehicleSaved ? vehicle : null;
  const { hasData, resolved, hiddenCount } = getProductRelations(product, activeVehicle);

  // Solo lo indispensable y disponible viene marcado; lo demás es decisión del cliente (HU-E55-02/04)
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(resolved.filter((r) => r.relation.type === "required" && r.product.stock !== "out_of_stock").map((r) => r.product.id))
  );
  const [notice, setNotice] = useState<string | null>(null);

  const toggle = (id: string) => {
    setNotice(null);
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addSelected = () => {
    const vehicleSnapshot =
      isVehicleSaved && vehicle ? { brand: vehicle.brand, model: vehicle.model, year: vehicle.year } : undefined;
    const added: string[] = [];
    const failed: string[] = [];
    resolved
      .filter((r) => selected.has(r.product.id))
      .forEach((r) => {
        const result = addToCart(r.product, 1, vehicleSnapshot);
        (result.success ? added : failed).push(r.product.name);
      });
    setNotice(
      [
        added.length ? `Agregamos al carrito: ${added.join(", ")}.` : "",
        failed.length ? `No pudimos incluir: ${failed.join(", ")} (sin disponibilidad).` : "",
      ]
        .filter(Boolean)
        .join(" ")
    );
  };

  const askAdvisor = () =>
    openAdvisor({
      origin: "product_complements",
      product: { id: product.id, name: product.name, sku: product.sku },
      prefillMessage: `¿Qué otros repuestos necesito para instalar ${product.name}?`,
    });

  // HU-E55-03: sin información cargada (o sin nada confirmado para el vehículo) no se afirma que no falte nada
  if (resolved.length === 0) {
    return (
      <section className="complements-section complements-empty" aria-labelledby="complements-title">
        <h2 id="complements-title">¿Necesitas algo más para instalarlo?</h2>
        <p>
          {hasData && hiddenCount > 0
            ? "Los complementos que tenemos registrados para este repuesto no están confirmados para tu vehículo."
            : "Todavía no tenemos información sobre otros repuestos que se necesiten para instalar este producto."}{" "}
          <strong>Que no aparezca nada aquí no significa que no haga falta nada más.</strong>
        </p>
        {product.complexInstall && (
          <button type="button" className="link-button" onClick={askAdvisor}>
            Consulta con un asesor qué necesitas para instalarlo
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="complements-section" aria-labelledby="complements-title">
      <div className="complements-header">
        <h2 id="complements-title">Qué más necesitas para instalarlo</h2>
        <span className="simulated-badge">Información de ejemplo · por validar con Posventa</span>
      </div>
      <p className="complements-intro">
        {resolved.some((r) => r.relation.type === "required")
          ? "Lo marcado como necesario es lo que el instalador va a requerir para completar el trabajo; lo demás es opcional."
          : "Por ahora solo tenemos registradas recomendaciones, no requisitos: puedes instalar este repuesto sin ellas."}{" "}
        Puedes comprar solo {product.name} si ya tienes lo demás.
      </p>

      {GROUPS.map((group) => {
        const items = resolved.filter((r) => r.relation.type === group.type);
        if (items.length === 0) return null;
        return (
          <div key={group.type} className="complements-group">
            <h3>{group.title}</h3>
            <ul>
              {items.map(({ relation, product: related, compatibility }) => {
                const outOfStock = related.stock === "out_of_stock";
                const inputId = `complement-${related.id}`;
                return (
                  <li key={related.id} className={`complement-item ${group.type}`}>
                    <input
                      type="checkbox"
                      id={inputId}
                      checked={selected.has(related.id)}
                      disabled={outOfStock}
                      onChange={() => toggle(related.id)}
                    />
                    <div className="complement-body">
                      <label htmlFor={inputId}>
                        <span className={`complement-tag ${group.type}`}>{group.tag}</span> {related.name}
                      </label>
                      <p className="complement-reason">{relation.reason}</p>
                      <p className="complement-meta">
                        {formatPrice(related.price)}
                        {outOfStock ? (
                          <span className="complement-stock out"> · Agotado: no se puede agregar</span>
                        ) : related.stock === "low_stock" ? (
                          <span className="complement-stock low"> · Pocas unidades</span>
                        ) : null}
                        {compatibility === "unknown" && <span className="complement-stock low"> · Verificar compatibilidad</span>}
                        {" · "}
                        <Link href={`/repuestos/${related.id}`}>Ver ficha</Link>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <div className="complements-actions">
        <button type="button" className="btn-outline" onClick={addSelected} disabled={selected.size === 0}>
          Agregar seleccionados al carrito ({selected.size})
        </button>
        <span className="complements-note">La pieza principal se agrega con el botón de arriba.</span>
      </div>
      {notice && (
        <p className="complements-notice" role="status">
          {notice}
        </p>
      )}
    </section>
  );
}
