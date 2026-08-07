"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = require("../services/auth.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const adminRouter = (0, express_1.Router)();
/**
 * Healthcheck protegido do admin ERP
 */
adminRouter.get('/health', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)(['ADMIN', 'GERENTE_FROTA']), (req, res) => {
    res.json({
        status: 'ok',
        scope: 'admin',
        user: req.user,
        timestamp: new Date().toISOString(),
    });
});
/**
 * Endpoint de Login no ERP
 */
adminRouter.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Por favor forneça email e palavra-passe.' });
        }
        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const result = await auth_service_1.AuthService.login(email, password, ipAddress, userAgent);
        return res.json({ success: true, ...result });
    }
    catch (err) {
        return res.status(401).json({ error: err.message || 'Falha na autenticação.' });
    }
});
/**
 * Endpoint para obter os dados do perfil do utilizador autenticado
 */
adminRouter.get('/auth/me', auth_middleware_1.requireAuth, (req, res) => {
    return res.json({
        user: req.user,
    });
});
exports.default = adminRouter;
