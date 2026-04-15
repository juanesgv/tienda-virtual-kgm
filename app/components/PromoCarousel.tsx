"use client";

import { useEffect, useMemo, useState } from "react";

type PromoSlide = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  /**
   * Si existe, se usa como fondo (arte). Si no, usamos gradiente.
   */
  imageUrl?: string;
  gradient?: string;
  ctaText?: string;
};

export default function PromoCarousel() {
  const slides: PromoSlide[] = useMemo(
    () => [
      {
        id: "bono-10",
        kicker: "Bonos & Descuentos",
        title: "10% OFF con compras desde $2.000.000",
        description:
          "Promoción aplicada en el carrito. Compatible con repuestos genuinos KGM.",
        gradient: "linear-gradient(135deg, #3F3953 0%, #7a5cff 100%)",
        ctaText: "Ver bono",
      },
      {
        id: "promo-mantenimiento",
        kicker: "Campaña Mantenimiento",
        title: "Kit mantenimiento: motor + filtros",
        description:
          "Ahorra en referencias seleccionadas. Consulta disponibilidad por vehículo cuando quieras.",
        gradient:
          "linear-gradient(135deg, rgba(63,57,83,1) 0%, rgba(43,191,123,0.95) 100%)",
        ctaText: "Explorar kits",
      },
      {
        id: "promo-frenos",
        kicker: "Seguridad al volante",
        title: "Oferta en frenos: pastillas y discos",
        description:
          "Encuentra piezas para tu KGM o SsangYong. Luego aplica tu placa/VIN para validar compatibilidad.",
        gradient: "linear-gradient(135deg, #2bbf7b 0%, #3F3953 100%)",
        ctaText: "Ver frenos",
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(t);
  }, [slides.length]);

  const active = slides[activeIndex];

  return (
    <div className="promo-carousel">
      <div className="promo-slide" aria-live="polite">
        {active.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={active.imageUrl}
            alt={active.title}
            className="promo-slide-bg"
            loading="lazy"
          />
        ) : (
          <div
            className="promo-slide-bg promo-slide-bg--gradient"
            style={{ background: active.gradient }}
          />
        )}

        <div className="promo-slide-overlay">
          <div className="promo-kicker">{active.kicker}</div>
          <h2 className="promo-title">{active.title}</h2>
          <p className="promo-description">{active.description}</p>
          <div className="promo-cta-row">
            <button
              type="button"
              className="btn-main promo-cta"
              onClick={() => {
                // Mock: en una implementación real, redirigir a landing/promo
              }}
            >
              {active.ctaText ?? "Ver promoción"}
            </button>
          </div>
        </div>
      </div>

      <div className="promo-controls" aria-label="Controles del carrusel">
        <button
          type="button"
          className="promo-arrow"
          aria-label="Anterior"
          onClick={() =>
            setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
          }
        >
          ‹
        </button>

        <div className="promo-dots">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              className={`promo-dot ${idx === activeIndex ? "active" : ""}`}
              aria-label={`Ir a la promo ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
        </div>

        <button
          type="button"
          className="promo-arrow"
          aria-label="Siguiente"
          onClick={() => setActiveIndex((prev) => (prev + 1) % slides.length)}
        >
          ›
        </button>
      </div>
    </div>
  );
}

