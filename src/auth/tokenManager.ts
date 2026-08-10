import { AUTH_CONFIG } from './authConfig';

export interface JwtTokenPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

export const generateMockJwt = (userId: string, email: string, role: string): { accessToken: string; refreshToken: string; expiresAt: number } => {
  const expiresAt = Date.now() + AUTH_CONFIG.TOKEN_EXPIRATION_MS;
  const payload: JwtTokenPayload = { userId, email, role, exp: expiresAt };
  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify(payload)) + '.signature_mock';
  const refreshToken = 'ref_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  return { accessToken, refreshToken, expiresAt };
};

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, accessToken);
  localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
};

export const clearAuthTokens = () => {
  localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_CONFIG.USER_KEY);
};

export const parseJwtToken = (token: string): JwtTokenPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadJson = atob(parts[1]);
    return JSON.parse(payloadJson) as JwtTokenPayload;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const parsed = parseJwtToken(token);
  if (!parsed) return true;
  return Date.now() >= parsed.exp;
};
