"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  calculateDiscountAmount,
  createAddress,
  createOrderRecord,
  createUserAccount,
  CURRENT_USER_STORAGE_KEY,
  findUserByEmail,
  RegistrationFieldErrors,
  updateLoyaltyAfterOrder,
  USERS_STORAGE_KEY,
  validateLoginInput,
  validateRegistrationInputFields,
} from "../lib/account";
import {
  Address,
  CreateOrderInput,
  LoginInput,
  RegisterInput,
  UserAccount,
} from "../types/account";

interface AuthResult {
  ok: boolean;
  error?: string;
  fieldErrors?: RegistrationFieldErrors;
  userId?: string;
  user?: UserAccount;
}

interface UserContextType {
  currentUser: UserAccount | null;
  users: UserAccount[];
  isAuthenticated: boolean;
  isLoaded: boolean;
  register: (input: RegisterInput) => AuthResult;
  login: (input: LoginInput) => AuthResult;
  logout: () => void;
  createOrderForCurrentUser: (
    input: CreateOrderInput,
    userIdOverride?: string,
    userOverride?: UserAccount
  ) => {
    ok: boolean;
    error?: string;
    orderId?: string;
  };
  getAvailableDiscountAmount: (subtotal: number) => number;
  // HU-E16-01
  updateProfile: (input: { name?: string; phone?: string }) => AuthResult;
  // HU-E16-04: requiere confirmar la contraseña actual
  changePassword: (currentPassword: string, newPassword: string) => AuthResult;
  // HU-E09-03: recuperación de contraseña (simulada, sin envío real de correo)
  resetPassword: (email: string, newPassword: string) => AuthResult;
  // HU-E16-02: libreta de direcciones
  addAddress: (input: Omit<Address, "id" | "isDefault">) => AuthResult;
  updateAddress: (id: string, patch: Partial<Omit<Address, "id">>) => AuthResult;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function readUsersFromStorage() {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    return [] as UserAccount[];
  }

  try {
    const parsed = JSON.parse(raw) as UserAccount[];
    // Compatibilidad con cuentas guardadas antes de que existiera la libreta de direcciones
    return parsed.map((user) => ({ ...user, addresses: user.addresses ?? [] }));
  } catch (error) {
    console.error("Error parsing saved users:", error);
    return [];
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUsers = readUsersFromStorage();
    const savedCurrentUserId = localStorage.getItem(CURRENT_USER_STORAGE_KEY);

    setUsers(savedUsers);
    setCurrentUserId(savedCurrentUserId);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users, isLoaded]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (currentUserId) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, currentUserId);
      return;
    }

    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }, [currentUserId, isLoaded]);

  const currentUser = useMemo(
    () => users.find((user) => user.id === currentUserId) ?? null,
    [users, currentUserId]
  );

  const register = (input: RegisterInput): AuthResult => {
    const fieldErrors = validateRegistrationInputFields(input, users);
    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }

    const newUser = createUserAccount(input);
    setUsers((currentUsers) => [...currentUsers, newUser]);
    setCurrentUserId(newUser.id);

    return { ok: true, userId: newUser.id, user: newUser };
  };

  const login = (input: LoginInput): AuthResult => {
    const validationError = validateLoginInput(input);
    if (validationError) {
      return { ok: false, error: validationError };
    }

    const user = findUserByEmail(users, input.email);
    if (!user || user.password !== input.password) {
      return { ok: false, error: "Correo o contraseña incorrectos." };
    }

    setCurrentUserId(user.id);
    return { ok: true, userId: user.id, user };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const createOrderForCurrentUser = (
    input: CreateOrderInput,
    userIdOverride?: string,
    userOverride?: UserAccount
  ) => {
    const targetUserId = userIdOverride || currentUser?.id;
    const targetUser =
      userOverride || users.find((user) => user.id === targetUserId);

    if (!targetUserId || !targetUser) {
      return { ok: false, error: "Debes iniciar sesión para completar el pedido." };
    }

    const order = createOrderRecord(input, targetUser.loyalty);

    setUsers((currentUsers) =>
      currentUsers.map((user) => {
        if (user.id !== targetUserId) {
          return user;
        }

        const loyalty = updateLoyaltyAfterOrder(
          user.loyalty,
          order.total,
          order.rewardApplied,
          order.createdAt
        );

        return {
          ...user,
          phone: input.shippingAddress.phone || user.phone,
          orders: [order, ...user.orders],
          loyalty,
        };
      })
    );

    return { ok: true, orderId: order.id };
  };

  const getAvailableDiscountAmount = (subtotal: number) => {
    if (!currentUser) {
      return 0;
    }

    return calculateDiscountAmount(subtotal, currentUser.loyalty);
  };

  // HU-E16-01: editar datos personales (el correo no es editable aquí, ver UI)
  const updateProfile = (input: { name?: string; phone?: string }): AuthResult => {
    if (!currentUser) {
      return { ok: false, error: "Debes iniciar sesión." };
    }
    if (input.name !== undefined && !input.name.trim()) {
      return { ok: false, error: "El nombre no puede quedar vacío." };
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === currentUser.id
          ? {
              ...user,
              name: input.name !== undefined ? input.name.trim() : user.name,
              phone: input.phone !== undefined ? input.phone.trim() : user.phone,
            }
          : user
      )
    );
    return { ok: true };
  };

  // HU-E16-04: exige confirmar la contraseña actual antes de guardar la nueva
  const changePassword = (currentPassword: string, newPassword: string): AuthResult => {
    if (!currentUser) {
      return { ok: false, error: "Debes iniciar sesión." };
    }
    if (currentUser.password !== currentPassword) {
      return { ok: false, error: "La contraseña actual no es correcta." };
    }
    if (newPassword.trim().length < 6) {
      return { ok: false, error: "La nueva contraseña debe tener al menos 6 caracteres." };
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) => (user.id === currentUser.id ? { ...user, password: newPassword } : user))
    );
    return { ok: true };
  };

  // HU-E09-03: recuperación de contraseña. El código/enlace se simula en la UI (sin envío real de correo);
  // esta función solo aplica el cambio una vez la UI ya validó ese código simulado.
  const resetPassword = (email: string, newPassword: string): AuthResult => {
    const user = findUserByEmail(users, email);
    if (!user) {
      return { ok: false, error: "No encontramos una cuenta con ese correo." };
    }
    if (newPassword.trim().length < 6) {
      return { ok: false, error: "La nueva contraseña debe tener al menos 6 caracteres." };
    }

    setUsers((currentUsers) =>
      currentUsers.map((u) => (u.id === user.id ? { ...u, password: newPassword } : u))
    );
    return { ok: true };
  };

  // HU-E16-02: libreta de direcciones
  const addAddress = (input: Omit<Address, "id" | "isDefault">): AuthResult => {
    if (!currentUser) {
      return { ok: false, error: "Debes iniciar sesión." };
    }
    const isFirst = currentUser.addresses.length === 0;
    const newAddress = createAddress({ ...input, isDefault: isFirst });

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === currentUser.id ? { ...user, addresses: [...user.addresses, newAddress] } : user
      )
    );
    return { ok: true };
  };

  const updateAddress = (id: string, patch: Partial<Omit<Address, "id">>): AuthResult => {
    if (!currentUser) {
      return { ok: false, error: "Debes iniciar sesión." };
    }
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === currentUser.id
          ? { ...user, addresses: user.addresses.map((a) => (a.id === id ? { ...a, ...patch } : a)) }
          : user
      )
    );
    return { ok: true };
  };

  const removeAddress = (id: string) => {
    if (!currentUser) return;
    setUsers((currentUsers) =>
      currentUsers.map((user) => {
        if (user.id !== currentUser.id) return user;
        const remaining = user.addresses.filter((a) => a.id !== id);
        // Si se elimina la dirección predeterminada, la siguiente pasa a serlo
        if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
          remaining[0] = { ...remaining[0], isDefault: true };
        }
        return { ...user, addresses: remaining };
      })
    );
  };

  const setDefaultAddress = (id: string) => {
    if (!currentUser) return;
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === currentUser.id
          ? { ...user, addresses: user.addresses.map((a) => ({ ...a, isDefault: a.id === id })) }
          : user
      )
    );
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        users,
        isAuthenticated: !!currentUser,
        isLoaded,
        register,
        login,
        logout,
        createOrderForCurrentUser,
        getAvailableDiscountAmount,
        updateProfile,
        changePassword,
        resetPassword,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
