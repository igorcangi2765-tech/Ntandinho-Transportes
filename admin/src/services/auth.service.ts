import { apiClient } from './apiClient';
import { User } from '../types/auth.types';

interface LoginResponse {
  success: boolean;
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient<LoginResponse>('/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return response;
    } catch (err: any) {
      // Direct offline fallback for admin demo login if backend offline
      if (email === 'admin@ntandinho.co.mz' && password === 'Admin2026!') {
        return {
          success: true,
          user: {
            id: 'usr-admin-1',
            name: 'Admin Tandinho',
            email: 'admin@ntandinho.co.mz',
            role: 'ADMIN',
            company: "N' Tandinho Transportes S.A.",
          },
          tokens: {
            accessToken: 'demo_token_ntandinho_2026',
            refreshToken: 'demo_refresh_token_2026',
          },
        };
      }
      throw err;
    }
  },

  async getProfile(): Promise<User> {
    const res = await apiClient<{ success: boolean; data: User }>('/api/admin/auth/me');
    return res.data;
  },
};
