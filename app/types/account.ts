export type OrderStatus = "pendiente" | "completado" | "cancelado";

// HU-E17-03: vehículo activo al momento de agregar el producto al carrito (la asociación nace ahí)
export interface OrderItemVehicle {
  brand: string;
  model: string;
  year: number;
}

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  vehicle?: OrderItemVehicle;
}

export interface OrderShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  notes?: string;
}

export interface CustomerOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  items: OrderItemSnapshot[];
  shippingAddress: OrderShippingAddress;
  rewardApplied: boolean;
}

export interface LoyaltyState {
  lifetimeSpent: number;
  progressSpent: number;
  threshold: number;
  discountRate: number;
  benefitStatus: "locked" | "available";
  nextRewardRemaining: number;
  lastRewardUnlockedAt?: string;
  lastRewardUsedAt?: string;
}

// HU-E16-02: libreta de direcciones editable (independiente del historial de pedidos)
export interface Address {
  id: string;
  label?: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  notes?: string;
  isDefault?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  createdAt: string;
  orders: CustomerOrder[];
  loyalty: LoyaltyState;
  addresses: Address[];
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateOrderInput {
  items: OrderItemSnapshot[];
  shippingAddress: OrderShippingAddress;
  subtotal: number;
  shipping: number;
}
