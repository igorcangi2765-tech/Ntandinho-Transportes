import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'DRIVER';
  avatarUrl?: string;
  company?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const TOKEN_KEY = 'ntandinho_token';
const USER_KEY = 'ntandinho_user';

const defaultAdminUser: User = {
  id: 'usr-admin-1',
  name: 'Administrador Geral',
  email: 'admin@ntandinho.co.mz',
  role: 'ADMIN',
  company: "N' Tandinho Transportes S.A.",
};

const getInitialUser = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : defaultAdminUser;
  } catch {
    return defaultAdminUser;
  }
};

const getInitialToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || 'demo_token_ntandinho_2026';
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: true,
  isLoading: false,

  login: (user: User, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const isAuth = !!token;
    if (get().isAuthenticated !== isAuth) {
      set({ isAuthenticated: isAuth, token });
    }
    return isAuth;
  },
}));
