import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Module, hasModuleAccess } from '../permissions/rbacConfig';

interface PermissionGuardProps {
  module: Module;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ module, children, fallback = null }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <>{fallback}</>;

  const allowed = hasModuleAccess(currentUser.role, module);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
