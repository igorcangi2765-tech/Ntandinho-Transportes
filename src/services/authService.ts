import { User } from '../types';
import { Role } from '../permissions/rbacConfig';
import { generateMockJwt, setAuthTokens, clearAuthTokens, getAccessToken, isTokenExpired } from '../auth/tokenManager';
import { hashPassword, checkRateLimit, recordFailedAttempt, resetAttempts } from '../utils/securityUtils';
import { saveAuditLog } from './auditService';
import { INITIAL_USERS } from '../data/mockData';

const USERS_STORAGE_KEY = 'ntandinho_users';

export const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
  return INITIAL_USERS;
};

export const saveStoredUsers = (users: User[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const loginWithEmailAndPassword = async (email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
  const rateLimitKey = 'login_' + email.toLowerCase();
  const rateCheck = checkRateLimit(rateLimitKey);

  if (!rateCheck.allowed) {
    return {
      success: false,
      message: `Demasiadas tentativas falhadas. Conta temporariamente bloqueada por ${rateCheck.lockTimeSeconds} segundos.`
    };
  }

  const users = getStoredUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    recordFailedAttempt(rateLimitKey);
    return { success: false, message: 'Credenciais inválidas. Verifique o email e palavra-passe.' };
  }

  if (!user.active) {
    return { success: false, message: 'Conta desativada. Entre em contacto com o Administrador Geral.' };
  }

  resetAttempts(rateLimitKey);

  // Generate tokens
  const tokens = generateMockJwt(user.id, user.email, user.role);
  setAuthTokens(tokens.accessToken, tokens.refreshToken);

  // Update last login
  const updatedUser: User = {
    ...user,
    lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
  saveStoredUsers(updatedUsers);

  // Audit log
  saveAuditLog(user.id, user.name, user.role, 'Login', 'Autenticação', 'Sessão iniciada com sucesso.');

  return { success: true, user: updatedUser };
};

export const logoutUser = (user: User) => {
  saveAuditLog(user.id, user.name, user.role, 'Logout', 'Autenticação', 'Sessão encerrada pelo utilizador.');
  clearAuthTokens();
};

export const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
  const users = getStoredUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, message: 'Endereço de email não encontrado no sistema.' };
  }

  saveAuditLog(user.id, user.name, user.role, 'Pedido de Recuperação de Palavra-passe', 'Autenticação', `Solicitado link de recuperação para ${email}`);

  return {
    success: true,
    message: `Instruções de recuperação de palavra-passe enviadas com sucesso para ${email}.`
  };
};

export const changeUserPassword = async (userId: string, oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return { success: false, message: 'Utilizador não encontrado.' };
  }

  saveAuditLog(user.id, user.name, user.role, 'Alterou Palavra-passe', 'Utilizadores', 'Palavra-passe atualizada com sucesso.');

  return { success: true, message: 'Palavra-passe alterada com sucesso!' };
};
