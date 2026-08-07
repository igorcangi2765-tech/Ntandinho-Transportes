import { create } from 'zustand';
import { AuthState, User } from '../types/auth.types';

const TOKEN_KEY = 'ntandinho_token';
const USER_KEY = 'ntandinho_user';

const getInitialUser = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getInitialToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
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
