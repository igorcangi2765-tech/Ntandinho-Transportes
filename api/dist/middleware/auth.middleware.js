"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const auth_service_1 = require("../services/auth.service");
/**
 * Middleware para validar o Access Token JWT enviado no cabeçalho Authorization: Bearer <token>
 */
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Não autorizado. Cabeçalho de autorização ausente ou malformatado.',
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = auth_service_1.AuthService.verifyAccessToken(token);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({
            error: 'Sessão expirada ou token inválido. Por favor, efetue login novamente.',
        });
    }
};
exports.requireAuth = requireAuth;
/**
 * Middleware de Controlo de Acesso Baseado em Funções (RBAC)
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado.' });
        }
        // Administradores têm acesso universal
        if (req.user.role === 'ADMIN' || allowedRoles.includes(req.user.role)) {
            return next();
        }
        return res.status(403).json({
            error: 'Acesso negado. O seu perfil de utilizador não possui permissões para este recurso.',
            requiredRoles: allowedRoles,
            userRole: req.user.role,
        });
    };
};
exports.requireRole = requireRole;
