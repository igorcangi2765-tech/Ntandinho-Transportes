import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { requireAuth } from '../middleware/auth.middleware';

const analyticsRouter = Router();

analyticsRouter.use(requireAuth);

analyticsRouter.get('/dashboard', AnalyticsController.getDashboard);
analyticsRouter.get('/audit-logs', AnalyticsController.getAuditLogs);

export default analyticsRouter;
