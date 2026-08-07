"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'ntandinho_secret_jwt_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'ntandinho_refresh_secret_key_2026';
class AuthService {
    /**
     * Encripta a palavra-passe com bcryptjs (10 rondas de sal)
     */
    static async hashPassword(password) {
        const salt = await bcryptjs_1.default.genSalt(10);
        return bcryptjs_1.default.hash(password, salt);
    }
    /**
     * Compara a palavra-passe em texto limpo com o hash armazenado
     */
    static async comparePassword(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    }
    /**
     * Gera Access Token (1h) e Refresh Token (7d)
     */
    static generateTokens(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: payload.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
    /**
     * Valida o Access Token JWT
     */
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    /**
     * Valida o Refresh Token JWT
     */
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
    }
    /**
     * Serviço principal de Login com verificação de credenciais e criação de sessão na base de dados
     */
    static async login(email, password, ipAddress, userAgent) {
        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanPassword = (password || '').trim();
        const user = await prisma.user.findFirst({
            where: { email: cleanEmail },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: { permission: true },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new Error('Credenciais de acesso inválidas.');
        }
        if (!user.isActive || user.deletedAt) {
            throw new Error('Conta desativada ou inativa.');
        }
        const isValidPassword = await this.comparePassword(cleanPassword, user.password);
        if (!isValidPassword) {
            throw new Error('Credenciais de acesso inválidas.');
        }
        const permissions = user.role.permissions.map((rp) => `${rp.permission.resource}:${rp.permission.action}`);
        const tokens = this.generateTokens({
            id: user.id,
            email: user.email,
            role: user.role.name,
            permissions,
        });
        // Registar sessão na base de dados
        await prisma.session.create({
            data: {
                userId: user.id,
                token: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                ipAddress,
                userAgent,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        }).catch(() => null);
        // Registar Audit Log na base de dados
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'LOGIN',
                entity: 'USER',
                entityId: user.id,
                ipAddress,
            },
        }).catch(() => null);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role.name,
                permissions,
            },
            tokens,
        };
    }
}
exports.AuthService = AuthService;
