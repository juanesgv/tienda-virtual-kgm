"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, formatPrice, getCompatibilityStatus } from "../data/products";
import { useVehicle } from "../context/VehicleContext";
import { useCart } from "../context/CartContext";
import IncompatibleAddModal from "./IncompatibleAddModal";

interface ProductCardProps {
  product: Product;
  showCompatibility?: boolean;
}

export default function ProductCard({ product, showCompatibility = true }: ProductCardProps) {
  const { vehicle, isVehicleSaved } = useVehicle();
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [showIncompatibleConfirm, setShowIncompatibleConfirm] = useState(false);

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
      {/* Badge de compatibilidad: 3 estados reales, "sin confirmar" nunca se ve como un rechazo */}
      {showCompatibility && (
        <div className={`product-badge ${badgeClass}`}>
          {compatibilityStatus === "compatible" && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Compatible con tu vehículo
            </>
          )}
          {compatibilityStatus === "not_compatible" && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              No compatible con tu vehículo
            </>
          )}
          {compatibilityStatus === "unknown" && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z" />
              </svg>
              <span>Debe verificarse para tu vehículo</span>
            </>
          )}
          {compatibilityStatus === null && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z" />
              </svg>
              <span>Verificar compatibilidad</span>
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
        <p className="product-desc">{product.description}</p>

        {showCompatibility && (
          <div className="product-meta">
            <span className={`stock ${stock.className}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              {stock.text}
            </span>
          </div>
        )}

        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          {/* HU-E13-01/E06-01: sin stock no se puede agregar al carrito */}
          <button
            className="btn-add-cart"
            onClick={handleAddToCart}
            title={isOutOfStock ? "Agotado" : "Agregar al carrito"}
            disabled={isOutOfStock}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
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
