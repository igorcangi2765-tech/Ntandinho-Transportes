import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  /**
   * GET /api/admin/analytics/dashboard
   */
  static async getDashboard(req: Request, res: Response) {
    try {
      const data = await AnalyticsService.getDashboardMetrics();
      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Erro ao carregar métricas do dashboard.' });
    }
  }

  /**
   * GET /api/admin/analytics/audit-logs
   */
  static async getAuditLogs(req: Request, res: Response) {
    try {
      const logs = await AnalyticsService.getAuditLogs();
      return res.json({ success: true, data: logs });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Erro ao carregar registos de auditoria.' });
    }
  }
}
