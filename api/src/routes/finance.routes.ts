import { Router } from 'express';
import { FinanceController } from '../controllers/finance.controller';
import { requireAuth } from '../middleware/auth.middleware';

const financeRouter = Router();

financeRouter.use(requireAuth);

financeRouter.get('/invoices', FinanceController.getInvoices);
financeRouter.post('/payments', FinanceController.registerPayment);
financeRouter.get('/summary', FinanceController.getSummary);

export default financeRouter;
