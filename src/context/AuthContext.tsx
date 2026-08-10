import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { Role } from '../permissions/rbacConfig';
import { INITIAL_USERS } from '../data/mockData';
import {
  getStoredUsers,
  saveStoredUsers,
  loginWithEmailAndPassword,
  logoutUser,
  changeUserPassword
} from '../services/authService';
import { getAccessToken, clearAuthTokens } from '../auth/tokenManager';
import { useInactivityTimer } from '../hooks/useInactivityTimer';

interface AuthContextType {
  currentUser: User;
  usersList: User[];
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRole: (role: Role) => void;
  addUser: (userData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  updateUserRole: (userId: string, role: Role) => void;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usersList, setUsersList] = useState<User[]>(() => getStoredUsers());
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const stored = getStoredUsers();
    return stored[0] || INITIAL_USERS[0];
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Logged in by default

  // Session Inactivity Timer (Automatic Logout after 15 mins inactivity)
  useInactivityTimer({
    enabled: isAuthenticated,
    onTimeout: () => {
      logout();
    }
  });

  const login = async (email: string, pass: string) => {
    const res = await loginWithEmailAndPassword(email, pass);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setIsAuthenticated(true);
      setUsersList(getStoredUsers());
    }
    return res;
  };

  const logout = () => {
    logoutUser(currentUser);
    setIsAuthenticated(false);
  };

  const switchRole = (role: Role) => {
    const targetUser = usersList.find((u) => u.role === role) || {
      ...currentUser,
      role
    };
    setCurrentUser(targetUser);
  };

  const addUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: 'usr-' + (usersList.length + 1),
      name: userData.name || 'Novo Utilizador',
      email: userData.email || 'novo@ntandinho.co.mz',
      role: userData.role || 'OPERADOR',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      phone: userData.phone || '+258 84 000 0000',
      department: userData.department || 'Operações',
      active: true,
      lastLogin: '-'
    };
    const updated = [newUser, ...usersList];
    setUsersList(updated);
    saveStoredUsers(updated);
  };

  const deleteUser = (userId: string) => {
    const updated = usersList.filter((u) => u.id !== userId);
    setUsersList(updated);
    saveStoredUsers(updated);
  };

  const updateUserRole = (userId: string, role: Role) => {
    const updated = usersList.map((u) => (u.id === userId ? { ...u, role } : u));
    setUsersList(updated);
    saveStoredUsers(updated);
    if (currentUser.id === userId) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    return changeUserPassword(currentUser.id, oldPass, newPass);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        usersList,
        isAuthenticated,
        login,
        logout,
        switchRole,
        addUser,
        deleteUser,
        updateUserRole,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
