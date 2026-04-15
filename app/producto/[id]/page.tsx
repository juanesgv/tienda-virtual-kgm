"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "../../components/Header";
import { useVehicle } from "../../VehicleContext";
import { products, formatCurrency, isProductCompatible } from "../../data";

export default function ProductDetailPage() {
  const params = useParams();
  const { vehicle, compatibilityFilterOn } = useVehicle();

  const idParam = params?.id;
  const product = products.find((p) => p.id === idParam);

  if (!product) {
    notFound();
  }

  const compatible = compatibilityFilterOn && isProductCompatible(product!, vehicle);

  return (
    <>
      <Header />
      <main className="wrapper">
        <nav className="breadcrumbs">
          <Link href="/">Inicio</Link> /{" "}
          <Link href="/listado">Repuestos</Link> /{" "}
          <strong>{product?.name}</strong>
        </nav>

        <section className="product-layout">
          <div className="product-media-card">
            <div className="product-media-main" />
            <div className="product-media-thumbs">
              <div className="product-media-thumb" />
              <div className="product-media-thumb" />
              <div className="product-media-thumb" />
            </div>
            <p className="section-subtitle">
              Imágenes referenciales. En la implementación real se conectan al
              catálogo de medios del CRM.
            </p>
          </div>

          <article className="product-info-card">
            <div>
              <div className="tagline">Repuesto original KGM</div>
              <h1 className="product-title-main">{product?.name}</h1>
              <div className="product-subcode">
                Código interno CRM: KGM-{product?.id.toString().toUpperCase()}
              </div>
            </div>

            <div>
              <div className="product-price-main">
                {formatCurrency(product!.price)}
              </div>
              <div className="product-meta-row">
                <span className="pill-mini">Garantía KGM 12 meses</span>
                <span className="pill-mini">Instalación en red de talleres</span>
              </div>
            </div>

            <div>
              <h2 className="section-title">Descripción</h2>
              <p className="section-subtitle">{product?.description}</p>
            </div>

            <section className="compatibility-card">
              <header className="compatibility-header-row">
                <div>
                  <div className="compatibility-title">
                    Compatibilidad por vehículo
                  </div>
                  <p className="compatibility-desc">
                    Aplica tu placa o VIN para validar si este repuesto es 100%
                    compatible antes de agregar al carrito.
                  </p>
                </div>
                <span className="compat-tag">Flujo opcional</span>
              </header>

              <div className="compatibility-list">
                <strong>Ejemplo de reglas desde el CRM:</strong>
                <ul>
                  {product?.compatibility.map((rule) => (
                    <li key={`${rule.model}-${rule.fromYear}-${rule.toYear}`}>
                      ✔ {rule.model} {rule.fromYear}–{rule.toYear}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="compatibility-list">
                {compatibilityFilterOn && vehicle?.model && vehicle.year ? (
                  compatible ? (
                    <span>
                      ✔ Este repuesto es compatible con tu{" "}
                      <strong>
                        {vehicle.model} {vehicle.year}
                      </strong>
                      .
                    </span>
                  ) : (
                    <span>
                      ✖ El CRM no marca este repuesto como compatible con tu{" "}
                      <strong>
                        {vehicle.model} {vehicle.year}
                      </strong>
                      .
                    </span>
                  )
                ) : (
                  <span>
                    Aplica tu vehículo en la cabecera para ver un mensaje de
                    compatibilidad personalizado.
                  </span>
                )}
              </div>
            </section>

            <div className="cta-row">
              <button className="btn-primary">Agregar al carrito</button>
              <button className="btn-secondary">
                Guardar para cotización en concesionario
              </button>
              <p className="trust-text">
                La compatibilidad se validaría en tiempo real contra el CRM antes
                de confirmar tu compra.
              </p>
            </div>
          </article>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span>© 2026 KGM Colombia.</span>
          <span>Prototipo de ficha de producto con compatibilidad.</span>
        </div>
      </footer>
    </>
  );
}

