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
  createOrderRecord,
  createUserAccount,
  CURRENT_USER_STORAGE_KEY,
  findUserByEmail,
  updateLoyaltyAfterOrder,
  USERS_STORAGE_KEY,
  validateLoginInput,
  validateRegistrationInput,
} from "../lib/account";
import {
  CreateOrderInput,
  LoginInput,
  RegisterInput,
  UserAccount,
} from "../types/account";

interface AuthResult {
  ok: boolean;
  error?: string;
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function readUsersFromStorage() {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    return [] as UserAccount[];
  }

  try {
    return JSON.parse(raw) as UserAccount[];
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
    const error = validateRegistrationInput(input, users);
    if (error) {
      return { ok: false, error };
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
