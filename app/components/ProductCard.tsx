"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, formatPrice, isProductCompatible } from "../data/products";
import { useVehicle } from "../context/VehicleContext";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  showCompatibility?: boolean;
}

export default function ProductCard({ product, showCompatibility = true }: ProductCardProps) {
  const { vehicle, isVehicleSaved } = useVehicle();
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);

  const isCompatible = vehicle ? isProductCompatible(product, vehicle) : false;

  const getStockText = () => {
    switch (product.stock) {
      case "in_stock":
        return { text: "En stock", className: "in-stock" };
      case "low_stock":
        return { text: "Pocos disponibles", className: "low-stock" };
      case "out_of_stock":
        return { text: "Agotado", className: "out-stock" };
      default:
        return { text: "Consultar", className: "" };
    }
  };

  const stock = getStockText();

  return (
    <article className={`product-card ${showCompatibility && isVehicleSaved && !isCompatible ? "not-compatible" : ""}`}>
      {/* Badge de compatibilidad */}
      {showCompatibility && (
        <div className={`product-badge ${isVehicleSaved ? (isCompatible ? "compatible" : "not-compatible") : "verify"}`}>
          {isVehicleSaved ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d={isCompatible ? "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"} />
              </svg>
              {isCompatible ? "Compatible con tu vehículo" : "No compatible con tu vehículo"}
            </>
          ) : (
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
          <button className="btn-add-cart" onClick={() => addToCart(product)} title="Agregar al carrito">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
