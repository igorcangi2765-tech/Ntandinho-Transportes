import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import publicRoutes from './routes/public.routes';
import adminRoutes from './routes/admin.routes';
import crmRoutes from './routes/crm.routes';
import fleetRoutes from './routes/fleet.routes';
import financeRoutes from './routes/finance.routes';
import analyticsRoutes from './routes/analytics.routes';
import { seedDatabase } from './seed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de Segurança, CORS e Logging
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ROTAS DA API
// 1. Endpoints Públicos (ex: cotações do site público)
app.use('/api/public', publicRoutes);

// 2. Endpoints Protegidos do ERP / CRM
app.use('/api/admin', adminRoutes);
app.use('/api/admin/crm', crmRoutes);
app.use('/api/admin/fleet', fleetRoutes);
app.use('/api/admin/finance', financeRoutes);
app.use('/api/admin/analytics', analyticsRoutes);

// 3. Fallback de 404 Exclusivo para a API - NUNCA RETORNAR HTML PARA NENHUM ENDPOINT /api/*
app.use('/api/*', (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    endpoint: req.originalUrl,
    error: `Endpoint '${req.originalUrl}' não encontrado na API Node.js.`,
    failureReason: `A rota '${req.method} ${req.originalUrl}' não está registada no servidor backend.`,
  });
});

// Manipulador Global de Erros da API (Sempre Retorna JSON para /api/*)
app.use((err: any, req: Request, res: Response, next: any) => {
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
const uploadsPath = path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsPath));

// SERVIÇO DO PAINEL ADMIN ERP (/admin)
const adminDistPath = path.resolve(__dirname, '../../admin/dist');
app.use('/admin', express.static(adminDistPath));

// Fallback SPA para navegação client-side do ERP em /admin e /admin/*
app.get(['/admin', '/admin/*'], (req: Request, res: Response) => {
  res.sendFile(path.join(adminDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Painel Admin ERP ainda não compilado. Execute npm run build dentro da pasta /admin.');
    }
  });
});

// SERVIÇO DO SITE PÚBLICO (raiz /) PARA PREVIEW LOCAL
const rootSitePath = path.resolve(__dirname, '../../');
app.use(express.static(rootSitePath, { index: 'index.html' }));

app.listen(PORT, async () => {
  // Garantir que a base de dados tem o utilizador administrador semeado
  await seedDatabase().catch(console.error);

  console.log(`=================================================`);
  console.log(`🚀 N' Tandinho Server & API Ativo na Porta: ${PORT}`);
  console.log(`🌐 Site Público: http://localhost:${PORT}/`);
  console.log(`🖥️  Painel Admin: http://localhost:${PORT}/admin`);
  console.log(`📍 API Pública:  http://localhost:${PORT}/api/public/health`);
  console.log(`🔒 API Admin:    http://localhost:${PORT}/api/admin/health`);
  console.log(`=================================================`);
});
