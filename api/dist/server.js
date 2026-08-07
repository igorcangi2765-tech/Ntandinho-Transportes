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
const public_routes_1 = __importDefault(require("./routes/public.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const crm_routes_1 = __importDefault(require("./routes/crm.routes"));
const fleet_routes_1 = __importDefault(require("./routes/fleet.routes"));
const finance_routes_1 = __importDefault(require("./routes/finance.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const seed_1 = require("./seed");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlewares de Segurança e Logging
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// ROTAS DA API
// 1. Endpoints Públicos (ex: cotações do site público)
app.use('/api/public', public_routes_1.default);
// 2. Endpoints Protegidos do ERP / CRM
app.use('/api/admin', admin_routes_1.default);
app.use('/api/admin/crm', crm_routes_1.default);
app.use('/api/admin/fleet', fleet_routes_1.default);
app.use('/api/admin/finance', finance_routes_1.default);
app.use('/api/admin/analytics', analytics_routes_1.default);
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
app.listen(PORT, async () => {
    // Garantir que a base de dados tem o utilizador administrador semeado
    await (0, seed_1.seedDatabase)().catch(console.error);
    console.log(`=================================================`);
    console.log(`🚀 N' Tandinho Server & API Ativo na Porta: ${PORT}`);
    console.log(`🌐 Site Público: http://localhost:${PORT}/`);
    console.log(`🖥️  Painel Admin: http://localhost:${PORT}/admin`);
    console.log(`📍 API Pública:  http://localhost:${PORT}/api/public/health`);
    console.log(`🔒 API Admin:    http://localhost:${PORT}/api/admin/health`);
    console.log(`=================================================`);
});
