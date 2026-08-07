"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("../services/analytics.service");
class AnalyticsController {
    /**
     * GET /api/admin/analytics/dashboard
     */
    static async getDashboard(req, res) {
        try {
            const data = await analytics_service_1.AnalyticsService.getDashboardMetrics();
            return res.json({ success: true, data });
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Erro ao carregar métricas do dashboard.' });
        }
    }
    /**
     * GET /api/admin/analytics/audit-logs
     */
    static async getAuditLogs(req, res) {
        try {
            const logs = await analytics_service_1.AnalyticsService.getAuditLogs();
            return res.json({ success: true, data: logs });
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Erro ao carregar registos de auditoria.' });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
