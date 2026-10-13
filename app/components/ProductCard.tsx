"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, formatPrice, getCompatibilityStatus } from "../data/products";
import { useVehicle } from "../context/VehicleContext";
import { useCart } from "../context/CartContext";
import IncompatibleAddModal from "./IncompatibleAddModal";
import { useEstimatedDelivery } from "../lib/useEstimatedDelivery";

interface ProductCardProps {
  product: Product;
  showCompatibility?: boolean;
}

export default function ProductCard({ product, showCompatibility = true }: ProductCardProps) {
  const { vehicle, isVehicleSaved } = useVehicle();
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [showIncompatibleConfirm, setShowIncompatibleConfirm] = useState(false);
  const delivery = useEstimatedDelivery();

  // HU-E07-02: 3 estados reales (compatible / no compatible / sin confirmar) en vez de solo 2.
  // Sin vehículo guardado, no hay nada que evaluar todavía.
  const compatibilityStatus = isVehicleSaved && vehicle ? getCompatibilityStatus(product, vehicle) : null;

  // HU-E17-03: la asociación producto-vehículo nace aquí, en el momento de agregar al carrito
  const vehicleSnapshot = isVehicleSaved && vehicle ? { brand: vehicle.brand, model: vehicle.model, year: vehicle.year } : undefined;

  // HU-E10-04: pedir confirmación antes de agregar un repuesto confirmado como no compatible
  const handleAddToCart = () => {
    if (compatibilityStatus === "not_compatible") {
      setShowIncompatibleConfirm(true);
      return;
    }
    addToCart(product, 1, vehicleSnapshot);
  };

  const getStockText = () => {
    switch (product.stock) {
      case "in_stock":
        return { text: "En stock", className: "in-stock" };
      case "low_stock":
        return {
          text: product.stockQuantity ? `Pocos disponibles (quedan ${product.stockQuantity})` : "Pocos disponibles",
          className: "low-stock",
        };
      case "out_of_stock":
        return { text: "Agotado", className: "out-stock" };
      default:
        return { text: "Consultar", className: "" };
    }
  };

  const stock = getStockText();
  const isOutOfStock = product.stock === "out_of_stock";

  const badgeClass =
    compatibilityStatus === "compatible"
      ? "compatible"
      : compatibilityStatus === "not_compatible"
      ? "not-compatible"
      : "verify";

  return (
    <article className={`product-card ${showCompatibility && compatibilityStatus === "not_compatible" ? "not-compatible" : ""}`}>
      {/* Insignia de compatibilidad (solo con vehículo activo; sin vehículo no hay nada que evaluar).
          3 estados reales con icono propio, para no depender solo del color. "Sin confirmar" nunca se ve como rechazo. */}
      {showCompatibility && compatibilityStatus !== null && (
        <div className={`product-badge ${badgeClass}`}>
          {compatibilityStatus === "compatible" && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Compatible<span className="visually-hidden"> con tu vehículo</span>
            </>
          )}
          {compatibilityStatus === "not_compatible" && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
              No compatible<span className="visually-hidden"> con tu vehículo</span>
            </>
          )}
          {compatibilityStatus === "unknown" && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
              </svg>
              Verificar<span className="visually-hidden"> compatibilidad con tu vehículo</span>
            </>
          )}
        </div>
      )}

      {/* Imagen */}
      <Link href={`/repuestos/${product.id}`} className="product-image">
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="product-placeholder" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z" />
            </svg>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="product-info">
        <span className="product-sku">REF: {product.sku}</span>
        <Link href={`/repuestos/${product.id}`} className="product-name">
          {product.name}
        </Link>

        {showCompatibility && (
          <div className="product-meta">
            <span className={`stock ${stock.className}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12" aria-hidden="true">
                {product.stock === "out_of_stock" ? (
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                ) : product.stock === "low_stock" ? (
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                ) : (
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                )}
              </svg>
              {stock.text}
            </span>
          </div>
        )}

        {/* HU-E11-02/E18: entrega estimada con fechas (valor de ejemplo; el real depende de E18/D3) */}
        {!isOutOfStock && delivery && (
          <span className="product-delivery" title="Valor de ejemplo: el tiempo real depende de la transportadora">
            Entrega estimada: {delivery.short}
          </span>
        )}

        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          {/* HU-E13-01/E06-01: sin stock no se puede agregar al carrito */}
          <button
            type="button"
            className="btn-add-cart"
            onClick={handleAddToCart}
            aria-label={isOutOfStock ? `${product.name}: agotado` : `Agregar ${product.name} al carrito`}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Agotado" : "Agregar"}
          </button>
        </div>
      </div>

      {showIncompatibleConfirm && vehicle && (
        <IncompatibleAddModal
          productName={product.name}
          vehicleLabel={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
          onCancel={() => setShowIncompatibleConfirm(false)}
          onConfirm={() => {
            addToCart(product, 1, vehicleSnapshot);
            setShowIncompatibleConfirm(false);
          }}
        />
      )}
    </article>
  );
}
