"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const public_routes_1 = __importDefault(require("./routes/public.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const crm_routes_1 = __importDefault(require("./routes/crm.routes"));
const fleet_routes_1 = __importDefault(require("./routes/fleet.routes"));
const finance_routes_1 = __importDefault(require("./routes/finance.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const seed_1 = require("./seed");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const HOST = '0.0.0.0';
// Middlewares de Segurança, CORS e Logging
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
const allowedOrigins = [
    'https://ntandinho.zyphtech.com',
    'http://ntandinho.zyphtech.com',
    'http://localhost:5173',
    'http://localhost:5000',
    'http://localhost:3000',
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
// ROTA DE HEALTHCHECK GLOBAL COM VERIFICAÇÃO REAL DE BASE DE DADOS (ETAPA 8)
app.get(['/api/health', '/health', '/api/public/health'], async (req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        return res.json({
            status: 'ok',
            server: 'running',
            database: 'connected',
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error('[HEALTHCHECK DB ERROR]', err.message || err);
        return res.status(500).json({
            status: 'error',
            server: 'running',
            database: 'disconnected',
            error: err.message || 'Falha na ligação à base de dados MySQL.',
            timestamp: new Date().toISOString(),
        });
    }
});
// ROTAS DA API (Aceita com prefixo /api e sem prefixo se o Hostinger stripper)
app.use(['/api/public', '/public'], public_routes_1.default);
app.use(['/api/admin', '/admin/api'], admin_routes_1.default);
app.use(['/api/admin/crm', '/crm'], crm_routes_1.default);
app.use(['/api/admin/fleet', '/fleet'], fleet_routes_1.default);
app.use(['/api/admin/finance', '/finance'], finance_routes_1.default);
app.use(['/api/admin/analytics', '/analytics'], analytics_routes_1.default);
// Fallback de 404 Exclusivo para a API - NUNCA RETORNAR HTML PARA NENHUM ENDPOINT /api/* (ETAPA 13)
app.use(['/api/*', '/api'], (req, res) => {
    return res.status(404).json({
        success: false,
        endpoint: req.originalUrl,
        error: `Endpoint '${req.originalUrl}' não encontrado na API Node.js.`,
        failureReason: `A rota '${req.method} ${req.originalUrl}' não está registada no servidor backend.`,
    });
});
// Manipulador Global de Erros da API (Sempre Retorna JSON para /api/*)
app.use((err, req, res, next) => {
    console.error(`[EXPRESS ERROR]`, err);
    if (req.originalUrl && req.originalUrl.startsWith('/api')) {
        return res.status(500).json({
            success: false,
            endpoint: req.originalUrl,
            error: 'Erro interno no servidor API.',
            details: err.message || 'Ocorreu um erro inesperado no backend.',
        });
    }
    next(err);
});
// SERVIÇO DE FICHEIROS DE UPLOADS
const uploadsPath = path_1.default.resolve(__dirname, '../../uploads');
app.use('/uploads', express_1.default.static(uploadsPath));
// SERVIÇO DO PAINEL ADMIN ERP (/admin)
const adminDistPath = path_1.default.resolve(__dirname, '../../admin/dist');
app.use('/admin', express_1.default.static(adminDistPath));
// Fallback SPA para navegação client-side do ERP em /admin e /admin/*
app.get(['/admin', '/admin/*'], (req, res) => {
    res.sendFile(path_1.default.join(adminDistPath, 'index.html'), (err) => {
        if (err) {
            res.status(404).send('Painel Admin ERP ainda não compilado. Execute npm run build dentro da pasta /admin.');
        }
    });
});
// SERVIÇO DO SITE PÚBLICO (raiz /) PARA PREVIEW LOCAL
const rootSitePath = path_1.default.resolve(__dirname, '../../');
app.use(express_1.default.static(rootSitePath, { index: 'index.html' }));
app.listen(PORT, HOST, async () => {
    // Garantir que a base de dados tem o utilizador administrador semeado se necessário
    await (0, seed_1.seedDatabase)().catch((err) => console.error('[SEED DB NOTICE]', err.message));
    console.log(`=================================================`);
    console.log(`🚀 N' Tandinho Server & API Ativo em ${HOST}:${PORT}`);
    console.log(`🌐 Site Público: http://${HOST}:${PORT}/`);
    console.log(`🖥️  Painel Admin: http://${HOST}:${PORT}/admin`);
    console.log(`📍 API Health:   http://${HOST}:${PORT}/api/health`);
    console.log(`🔒 API Admin:    http://${HOST}:${PORT}/api/admin/auth/login`);
    console.log(`=================================================`);
});
