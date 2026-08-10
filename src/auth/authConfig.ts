/**
 * Authentication configuration settings.
 */

export const AUTH_CONFIG = {
  TOKEN_KEY: 'ntandinho_jwt_token',
  REFRESH_TOKEN_KEY: 'ntandinho_refresh_token',
  USER_KEY: 'ntandinho_user_session',
  INACTIVITY_TIMEOUT_MS: 15 * 60 * 1000, // 15 minutes
  TOKEN_EXPIRATION_MS: 60 * 60 * 1000, // 1 hour
};
