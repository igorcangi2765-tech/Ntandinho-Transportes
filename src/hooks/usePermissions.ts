import { useAuth } from '../context/AuthContext';
import { Module, ROLE_PERMISSIONS_MATRIX, hasModuleAccess } from '../permissions/rbacConfig';

export const usePermissions = () => {
  const { currentUser } = useAuth();

  const userRole = currentUser?.role || 'OPERADOR';

  const canAccess = (module: Module): boolean => {
    return hasModuleAccess(userRole, module);
  };

  const roleConfig = ROLE_PERMISSIONS_MATRIX[userRole];

  return {
    userRole,
    roleConfig,
    canAccess,
    canManageUsers: roleConfig.canManageUsers,
    canManageSettings: roleConfig.canManageSettings,
    canViewAuditLogs: roleConfig.canViewAuditLogs,
    canViewFinancials: roleConfig.canViewFinancials,
    canViewFleet: roleConfig.canViewFleet,
    canViewDrivers: roleConfig.canViewDrivers,
    canViewReports: roleConfig.canViewReports
  };
};
