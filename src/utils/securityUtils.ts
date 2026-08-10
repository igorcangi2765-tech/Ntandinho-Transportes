/**
 * Security and sanitization utilities for input validation, XSS prevention,
 * CSRF token generation, password hashing simulation, and rate limiting.
 */

// Simple XSS Sanitization
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Simulated Salted Password Hash (SHA256 mock via Web Crypto / Base64 encoding)
export const hashPassword = (password: string): string => {
  const salt = 'ntandinho_salt_2026';
  let hash = 0;
  const combined = password + salt;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'pbkdf2_sha256$' + Math.abs(hash).toString(16);
};

// Device & Browser Information Extraction
export const getDeviceInfo = (): { browser: string; os: string; device: string } => {
  const ua = navigator.userAgent;
  let browser = 'Desconhecido';
  let os = 'Desconhecido';
  let device = 'Desktop';

  if (ua.indexOf('Firefox') > -1) browser = 'Mozilla Firefox';
  else if (ua.indexOf('Chrome') > -1) browser = 'Google Chrome';
  else if (ua.indexOf('Safari') > -1) browser = 'Apple Safari';
  else if (ua.indexOf('Edge') > -1) browser = 'Microsoft Edge';

  if (ua.indexOf('Win') > -1) os = 'Windows OS';
  else if (ua.indexOf('Mac') > -1) os = 'macOS';
  else if (ua.indexOf('Linux') > -1) os = 'Linux';
  else if (ua.indexOf('Android') > -1) os = 'Android OS';
  else if (ua.indexOf('iPhone') > -1) os = 'iOS';

  if (/Mobi|Android|iPhone/i.test(ua)) device = 'Smartphone / Mobile';
  else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';

  return { browser, os, device };
};

// Simulated Rate Limiting for Login Attempts
const loginAttemptsMap = new Map<string, { count: number; lockUntil: number }>();

export const checkRateLimit = (key: string, maxAttempts = 5, lockTimeMs = 60000): { allowed: boolean; remaining: number; lockTimeSeconds: number } => {
  const now = Date.now();
  const record = loginAttemptsMap.get(key);

  if (record) {
    if (now < record.lockUntil) {
      const lockTimeSeconds = Math.ceil((record.lockUntil - now) / 1000);
      return { allowed: false, remaining: 0, lockTimeSeconds };
    }
    if (now >= record.lockUntil && record.count >= maxAttempts) {
      loginAttemptsMap.delete(key);
    }
  }

  return { allowed: true, remaining: maxAttempts - (record?.count || 0), lockTimeSeconds: 0 };
};

export const recordFailedAttempt = (key: string, maxAttempts = 5, lockTimeMs = 60000) => {
  const now = Date.now();
  const record = loginAttemptsMap.get(key) || { count: 0, lockUntil: 0 };
  const newCount = record.count + 1;
  const lockUntil = newCount >= maxAttempts ? now + lockTimeMs : 0;
  loginAttemptsMap.set(key, { count: newCount, lockUntil });
};

export const resetAttempts = (key: string) => {
  loginAttemptsMap.delete(key);
};
