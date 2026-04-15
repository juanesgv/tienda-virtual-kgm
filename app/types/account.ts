export type OrderStatus = "pendiente" | "completado" | "cancelado";

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
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

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  createdAt: string;
  orders: CustomerOrder[];
  loyalty: LoyaltyState;
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
