/**
 * FASE 1 — DESIGN SYSTEM GLOBAL N'TANDINHO TRANSPORTES S.A.
 * Definição centralizada de tokens de design para Dark e Light mode.
 */

export const DESIGN_TOKENS = {
  colors: {
    // Amarelo / Dourado Institucional (Destaque Marca)
    primary: '#F6A823',
    primaryHover: '#D08500',
    primarySoft: 'rgba(246, 168, 35, 0.15)',

    // Navy & Estruturais
    navy: '#0B132B',
    navyDark: '#070D1F',
    navySecondary: '#111D33',
    blue: '#16223B',
    blueSupport: '#1E3A8A',

    // Semânticas
    success: '#16A34A',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#0EA5E9',
  },
  theme: {
    light: {
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceHover: '#F1F5F9',
      border: '#E2E8F0',
      textPrimary: '#0B132B',
      textSecondary: '#64748B',
      textMuted: '#94A3B8',
    },
    dark: {
      background: '#0B132B',
      surface: '#111D33',
      surfaceHover: '#16223B',
      border: '#1C2A48',
      textPrimary: '#FFFFFF',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
    },
  },
} as const;

export type DesignTheme = 'dark' | 'light';
