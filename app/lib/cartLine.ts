import { getCompatibilityStatus, CompatibilityStatus, VehicleLike } from "../data/products";
import type { CartItem } from "../context/CartContext";

// HU-E10-03/E10-04: la compatibilidad de una línea se evalúa contra el vehículo con el que se agregó
// (si lo hay). Si es el mismo que el activo, se usa el activo porque conserva el motor.
export function getLineCompatibility(
  item: CartItem,
  activeVehicle: VehicleLike | null
): { status: CompatibilityStatus; vehicle: VehicleLike } | null {
  const snapshot = item.vehicle;
  const sameAsActive =
    !!activeVehicle &&
    !!snapshot &&
    activeVehicle.brand === snapshot.brand &&
    activeVehicle.model === snapshot.model &&
    activeVehicle.year === snapshot.year;
  const vehicle = sameAsActive ? activeVehicle : snapshot ?? activeVehicle;
  if (!vehicle) return null;
  return { status: getCompatibilityStatus(item.product, vehicle), vehicle };
}
