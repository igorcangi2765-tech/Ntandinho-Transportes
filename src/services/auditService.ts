import { SupabaseAuditLog } from '../models';
import { Role } from '../permissions/rbacConfig';
import { getDeviceInfo } from '../utils/securityUtils';

const AUDIT_STORAGE_KEY = 'ntandinho_audit_logs';

export const getAuditLogs = (): SupabaseAuditLog[] => {
  const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return [];
};

export const saveAuditLog = (
  userId: string,
  userName: string,
  userRole: Role,
  action: string,
  moduleName: string,
  details: string
): SupabaseAuditLog => {
  const device = getDeviceInfo();
  const newLog: SupabaseAuditLog = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    created_at: new Date().toISOString(),
    user_id: userId,
    user_name: userName,
    user_role: userRole,
    action,
    module: moduleName,
    details,
    ip_address: '197.249.12.' + Math.floor(Math.random() * 200 + 10),
    device_info: `${device.device} (${device.os})`,
    browser_info: device.browser
  };

  const logs = getAuditLogs();
  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  return newLog;
};
