import {
  Address,
  CreateOrderInput,
  CustomerOrder,
  LoginInput,
  LoyaltyState,
  RegisterInput,
  UserAccount,
} from "../types/account";

export const USERS_STORAGE_KEY = "kgm-users";
export const CURRENT_USER_STORAGE_KEY = "kgm-current-user-id";
export const LOYALTY_THRESHOLD = 5_000_000;
export const LOYALTY_DISCOUNT_RATE = 0.1;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function calculateRemainingForReward(loyalty: LoyaltyState) {
  if (loyalty.benefitStatus === "available") {
    return 0;
  }

  return Math.max(0, loyalty.threshold - loyalty.progressSpent);
}

export function createInitialLoyaltyState(): LoyaltyState {
  const baseState: LoyaltyState = {
    lifetimeSpent: 0,
    progressSpent: 0,
    threshold: LOYALTY_THRESHOLD,
    discountRate: LOYALTY_DISCOUNT_RATE,
    benefitStatus: "locked",
    nextRewardRemaining: LOYALTY_THRESHOLD,
  };

  return {
    ...baseState,
    nextRewardRemaining: calculateRemainingForReward(baseState),
  };
}

export function createUserAccount(input: RegisterInput): UserAccount {
  return {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    password: input.password,
    phone: input.phone?.trim() || "",
    createdAt: new Date().toISOString(),
    orders: [],
    loyalty: createInitialLoyaltyState(),
    addresses: [],
  };
}

export function findUserByEmail(users: UserAccount[], email: string) {
  const normalizedEmail = normalizeEmail(email);
  return users.find((user) => user.email === normalizedEmail);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegistrationFieldErrors {
  name?: string;
  email?: string;
  password?: string;
  /** Correo ya registrado: se ofrece iniciar sesión en vez de solo mostrar un error. */
  emailTaken?: boolean;
}

// HU-E09-01: errores específicos por campo, no un solo mensaje genérico
export function validateRegistrationInputFields(
  input: RegisterInput,
  users: UserAccount[]
): RegistrationFieldErrors {
  const errors: RegistrationFieldErrors = {};

  if (!input.name.trim()) {
    errors.name = "Ingresa tu nombre.";
  }

  if (!normalizeEmail(input.email)) {
    errors.email = "Ingresa tu correo.";
  } else if (!EMAIL_PATTERN.test(normalizeEmail(input.email))) {
    errors.email = "Ingresa un correo con formato válido.";
  } else if (findUserByEmail(users, input.email)) {
    errors.email = "Ya existe una cuenta con este correo.";
    errors.emailTaken = true;
  }

  if (input.password.trim().length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  return errors;
}

export function createAddress(input: Omit<Address, "id">): Address {
  return {
    ...input,
    id: `addr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  };
}

export function validateLoginInput(input: LoginInput) {
  if (!normalizeEmail(input.email)) {
    return "Ingresa tu correo.";
  }

  if (!input.password) {
    return "Ingresa tu contraseña.";
  }

  return null;
}

export function buildOrderId() {
  return `PED-${Date.now().toString().slice(-8)}`;
}

export function calculateDiscountAmount(subtotal: number, loyalty: LoyaltyState) {
  if (loyalty.benefitStatus !== "available") {
    return 0;
  }

  return Math.round(subtotal * loyalty.discountRate);
}

export function createOrderRecord(
  input: CreateOrderInput,
  loyalty: LoyaltyState
): CustomerOrder {
  const discount = calculateDiscountAmount(input.subtotal, loyalty);
  const total = Math.max(0, input.subtotal + input.shipping - discount);

  return {
    id: buildOrderId(),
    createdAt: new Date().toISOString(),
    status: "pendiente",
    subtotal: input.subtotal,
    shipping: input.shipping,
    discount,
    total,
    items: input.items,
    shippingAddress: input.shippingAddress,
    rewardApplied: discount > 0,
  };
}

export function updateLoyaltyAfterOrder(
  previous: LoyaltyState,
  orderTotal: number,
  rewardApplied: boolean,
  timestamp: string
): LoyaltyState {
  let progressSpent = rewardApplied ? orderTotal : previous.progressSpent + orderTotal;
  let benefitStatus: LoyaltyState["benefitStatus"] = "locked";
  let lastRewardUnlockedAt = previous.lastRewardUnlockedAt;
  let lastRewardUsedAt = previous.lastRewardUsedAt;

  if (!rewardApplied && progressSpent >= previous.threshold) {
    benefitStatus = "available";
    lastRewardUnlockedAt = timestamp;
    progressSpent = previous.threshold;
  }

  if (rewardApplied) {
    lastRewardUsedAt = timestamp;
  }

  const nextState: LoyaltyState = {
    ...previous,
    lifetimeSpent: previous.lifetimeSpent + orderTotal,
    progressSpent,
    benefitStatus,
    lastRewardUnlockedAt,
    lastRewardUsedAt,
    nextRewardRemaining: 0,
  };

  nextState.nextRewardRemaining = calculateRemainingForReward(nextState);

  return nextState;
}
