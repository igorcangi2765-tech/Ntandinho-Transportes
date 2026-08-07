"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crm_controller_1 = require("../controllers/crm.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const crmRouter = (0, express_1.Router)();
// Aplica autenticação a todas as rotas do CRM
crmRouter.use(auth_middleware_1.requireAuth);
// Clientes
crmRouter.get('/customers', crm_controller_1.CRMController.getCustomers);
crmRouter.post('/customers', crm_controller_1.CRMController.createCustomer);
// Cotações
crmRouter.get('/quotations', crm_controller_1.CRMController.getQuotations);
crmRouter.post('/quotations', crm_controller_1.CRMController.createQuotation);
exports.default = crmRouter;
