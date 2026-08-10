import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Role, Module, hasModuleAccess } from '../permissions/rbacConfig';
import { Unauthorized403Page } from '../pages/Unauthorized403Page';

interface RoleGuardProps {
  module: Module;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ module, children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Unauthorized403Page />;

  const isAllowed = hasModuleAccess(currentUser.role, module);

  if (!isAllowed) {
    return <Unauthorized403Page />;
  }

  return <>{children}</>;
};
