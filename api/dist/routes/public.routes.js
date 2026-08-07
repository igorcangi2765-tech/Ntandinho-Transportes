"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicRouter = (0, express_1.Router)();
// Healthcheck público
publicRouter.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        scope: 'public',
        timestamp: new Date().toISOString(),
    });
});
// Exemplo: Formulário de solicitação de cotação vindo do site público
publicRouter.post('/quote-request', (req, res) => {
    const { name, email, phone, details } = req.body;
    res.status(201).json({
        success: true,
        message: 'Solicitação de cotação recebida com sucesso.',
        data: { name, email, phone, details },
    });
});
exports.default = publicRouter;
