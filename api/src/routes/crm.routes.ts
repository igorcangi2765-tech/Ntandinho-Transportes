import { Router } from 'express';
import { CRMController } from '../controllers/crm.controller';
import { requireAuth } from '../middleware/auth.middleware';

const crmRouter = Router();

// Aplica autenticação a todas as rotas do CRM
crmRouter.use(requireAuth);

// Clientes
crmRouter.get('/customers', CRMController.getCustomers);
crmRouter.post('/customers', CRMController.createCustomer);

// Cotações
crmRouter.get('/quotations', CRMController.getQuotations);
crmRouter.post('/quotations', CRMController.createQuotation);

export default crmRouter;
