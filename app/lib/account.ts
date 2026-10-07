import {
  Address,
  CreateOrderInput,
  CustomerOrder,
  LoginInput,
  RegisterInput,
  UserAccount,
} from "../types/account";

export const USERS_STORAGE_KEY = "kgm-users";
export const CURRENT_USER_STORAGE_KEY = "kgm-current-user-id";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
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

export function createOrderRecord(input: CreateOrderInput): CustomerOrder {
  return {
    id: buildOrderId(),
    createdAt: new Date().toISOString(),
    status: "pendiente",
    subtotal: input.subtotal,
    shipping: input.shipping,
    total: input.subtotal + input.shipping,
    items: input.items,
    shippingAddress: input.shippingAddress,
  };
}