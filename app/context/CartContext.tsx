"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getProductById, Product } from "../data/products";
import { OrderItemSnapshot, OrderItemVehicle } from "../types/account";

// HU-E17-02: qué pasó al intentar agregar de nuevo cada línea de un pedido anterior
export interface ReorderSkippedItem {
  name: string;
  reason: string;
}
export interface ReorderResult {
  added: number;
  skipped: ReorderSkippedItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  // HU-E17-03: vehículo activo cuando se agregó (o se volvió a agregar) este producto
  vehicle?: OrderItemVehicle;
}

export interface AddToCartResult {
  success: boolean;
  /** Si la cantidad final quedó limitada por el stock disponible, cuál fue ese límite. */
  limitedTo?: number;
}

// HU-E11-05/E14-04: diferencias entre lo que el carrito tenía guardado y el estado actual del catálogo
export interface CartDiscrepancy {
  productId: string;
  productName: string;
  type: "out_of_stock" | "quantity_reduced" | "price_changed";
  oldQuantity?: number;
  newQuantity?: number;
  oldPrice?: number;
  newPrice?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, vehicle?: OrderItemVehicle) => AddToCartResult;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getShippingCost: () => number;
  getTotal: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  // HU-E11-05: revisar el carrito contra el catálogo actual antes de pagar, y aplicar los ajustes si el cliente lo acepta
  getCartDiscrepancies: () => CartDiscrepancy[];
  applyDiscrepancies: (discrepancies: CartDiscrepancy[]) => void;
  // HU-E17-02: volver a pedir los productos de un pedido anterior
  reorderItems: (orderItems: OrderItemSnapshot[]) => ReorderResult;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SHIPPING_THRESHOLD = 500000; // Envío gratis por compras mayores a $500.000
const SHIPPING_COST = 25000; // Costo de envío estándar

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("kgm-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing saved cart:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("kgm-cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // HU-E06-04/E13-02: la cantidad en el carrito nunca puede superar el stock disponible
  const getStockLimit = (product: Product): number | null => {
    if (product.stock === "out_of_stock") return 0;
    return typeof product.stockQuantity === "number" ? product.stockQuantity : null;
  };

  const addToCart = (product: Product, quantity: number = 1, vehicle?: OrderItemVehicle): AddToCartResult => {
    const limit = getStockLimit(product);
    if (limit === 0) return { success: false };

    let limitedTo: number | undefined;

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id);
      const desiredQty = (existingItem?.quantity ?? 0) + quantity;
      const finalQty = limit !== null ? Math.min(desiredQty, limit) : desiredQty;
      if (limit !== null && finalQty < desiredQty) limitedTo = finalQty;

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: finalQty, vehicle: vehicle ?? item.vehicle } : item
        );
      }

      return [...currentItems, { product, quantity: finalQty, vehicle }];
    });

    return { success: true, limitedTo };
  };

  const removeFromCart = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.product.id !== productId) return item;
        const limit = getStockLimit(item.product);
        return { ...item, quantity: limit !== null ? Math.min(quantity, limit) : quantity };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getShippingCost = () => {
    const subtotal = getSubtotal();
    return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  };

  const getTotal = () => {
    return getSubtotal() + getShippingCost();
  };

  // HU-E11-05: compara cada línea del carrito contra el catálogo actual (fuente de verdad)
  const getCartDiscrepancies = (): CartDiscrepancy[] => {
    const discrepancies: CartDiscrepancy[] = [];

    items.forEach((item) => {
      const live = getProductById(item.product.id);
      if (!live) return;

      if (live.stock === "out_of_stock") {
        discrepancies.push({ productId: item.product.id, productName: live.name, type: "out_of_stock" });
        return;
      }

      if (typeof live.stockQuantity === "number" && live.stockQuantity < item.quantity) {
        discrepancies.push({
          productId: item.product.id,
          productName: live.name,
          type: "quantity_reduced",
          oldQuantity: item.quantity,
          newQuantity: live.stockQuantity,
        });
      }

      if (live.price !== item.product.price) {
        discrepancies.push({
          productId: item.product.id,
          productName: live.name,
          type: "price_changed",
          oldPrice: item.product.price,
          newPrice: live.price,
        });
      }
    });

    return discrepancies;
  };

  // Aplica los ajustes SOLO cuando el cliente los acepta explícitamente; nunca se ejecuta un cobro aquí.
  const applyDiscrepancies = (discrepancies: CartDiscrepancy[]) => {
    setItems((currentItems) => {
      let next = currentItems.filter(
        (item) => !discrepancies.some((d) => d.type === "out_of_stock" && d.productId === item.product.id)
      );

      next = next.map((item) => {
        const qtyFix = discrepancies.find((d) => d.type === "quantity_reduced" && d.productId === item.product.id);
        const priceFix = discrepancies.find((d) => d.type === "price_changed" && d.productId === item.product.id);
        if (!qtyFix && !priceFix) return item;
        return {
          ...item,
          quantity: qtyFix?.newQuantity ?? item.quantity,
          product: priceFix?.newPrice !== undefined ? { ...item.product, price: priceFix.newPrice } : item.product,
        };
      });

      return next;
    });
  };

  // HU-E17-02: reintenta agregar cada línea de un pedido anterior contra el catálogo ACTUAL
  // (precio y disponibilidad de hoy, no los que tenía el pedido original)
  const reorderItems = (orderItems: OrderItemSnapshot[]): ReorderResult => {
    const skipped: ReorderSkippedItem[] = [];
    let added = 0;

    orderItems.forEach((orderItem) => {
      const live = getProductById(orderItem.productId);
      if (!live) {
        skipped.push({ name: orderItem.name, reason: "ya no existe en el catálogo" });
        return;
      }
      if (live.discontinued) {
        skipped.push({ name: orderItem.name, reason: "fue descontinuado" });
        return;
      }
      if (live.stock === "out_of_stock") {
        skipped.push({ name: orderItem.name, reason: "está agotado" });
        return;
      }

      const result = addToCart(live, orderItem.quantity, orderItem.vehicle);
      if (!result.success) {
        skipped.push({ name: orderItem.name, reason: "no se pudo agregar" });
        return;
      }
      added += 1;
      if (result.limitedTo) {
        skipped.push({ name: orderItem.name, reason: `solo agregamos ${result.limitedTo} unidades disponibles` });
      }
    });

    return { added, skipped };
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getCartDiscrepancies,
        applyDiscrepancies,
        reorderItems,
        getSubtotal,
        getShippingCost,
        getTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
