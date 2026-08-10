export type Role = 'ADMIN' | 'GESTOR' | 'FINANCEIRO' | 'OPERADOR';

export type Module =
  | 'dashboard'
  | 'pedidos'
  | 'viagens'
  | 'clientes'
  | 'frota'
  | 'motoristas'
  | 'servicos'
  | 'financeiro'
  | 'relatorios'
  | 'utilizadores'
  | 'configuracoes'
  | 'auditoria';

export interface RolePermissions {
  role: Role;
  label: string;
  allowedModules: Module[];
  canManageUsers: boolean;
  canManageSettings: boolean;
  canViewAuditLogs: boolean;
  canViewFinancials: boolean;
  canViewFleet: boolean;
  canViewDrivers: boolean;
  canViewReports: boolean;
}

export const ROLE_PERMISSIONS_MATRIX: Record<Role, RolePermissions> = {
  ADMIN: {
    role: 'ADMIN',
    label: 'Administrador Geral',
    allowedModules: [
      'dashboard',
      'pedidos',
      'viagens',
      'clientes',
      'frota',
      'motoristas',
      'servicos',
      'financeiro',
      'relatorios',
      'utilizadores',
      'configuracoes',
      'auditoria'
    ],
    canManageUsers: true,
    canManageSettings: true,
    canViewAuditLogs: true,
    canViewFinancials: true,
    canViewFleet: true,
    canViewDrivers: true,
    canViewReports: true
  },
  GESTOR: {
    role: 'GESTOR',
    label: 'Gestor Operacional',
    allowedModules: [
      'dashboard',
      'pedidos',
      'viagens',
      'clientes',
      'frota',
      'motoristas',
      'servicos',
      'relatorios'
    ],
    canManageUsers: false,
    canManageSettings: false,
    canViewAuditLogs: false,
    canViewFinancials: false,
    canViewFleet: true,
    canViewDrivers: true,
    canViewReports: true
  },
  FINANCEIRO: {
    role: 'FINANCEIRO',
    label: 'Gestor Financeiro',
    allowedModules: [
      'dashboard',
      'financeiro',
      'relatorios'
    ],
    canManageUsers: false,
    canManageSettings: false,
    canViewAuditLogs: false,
    canViewFinancials: true,
    canViewFleet: false,
    canViewDrivers: false,
    canViewReports: true
  },
  OPERADOR: {
    role: 'OPERADOR',
    label: 'Operador de Campo',
    allowedModules: [
      'dashboard',
      'pedidos',
      'viagens',
      'clientes'
    ],
    canManageUsers: false,
    canManageSettings: false,
    canViewAuditLogs: false,
    canViewFinancials: false,
    canViewFleet: false,
    canViewDrivers: false,
    canViewReports: false
  }
};

export const hasModuleAccess = (role: Role, module: Module): boolean => {
  const config = ROLE_PERMISSIONS_MATRIX[role];
  if (!config) return false;
  return config.allowedModules.includes(module);
};
