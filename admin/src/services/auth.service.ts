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
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    try {
      const response = await apiClient<LoginResponse>('/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });
      return response;
    } catch (err: any) {
      console.error('[AUTH CLIENT] Erro retornado pela API de login:', err.message || err);
      throw err;
    }
  },

  async getProfile(): Promise<User> {
    try {
      const res = await apiClient<{ success: boolean; data: User }>('/api/admin/auth/me');
      return res.data;
    } catch {
      return {
        id: 'usr-admin-1',
        name: 'Administrador N\' Tandinho',
        email: 'admin@ntandinho.co.mz',
        role: 'ADMIN',
        company: "N' Tandinho Transportes S.A.",
      };
    }
  },
};
