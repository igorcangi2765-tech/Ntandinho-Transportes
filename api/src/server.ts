import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import publicRoutes from './routes/public.routes';
import adminRoutes from './routes/admin.routes';
import crmRoutes from './routes/crm.routes';
import fleetRoutes from './routes/fleet.routes';
import financeRoutes from './routes/finance.routes';
import analyticsRoutes from './routes/analytics.routes';
import { seedDatabase } from './seed';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const HOST = '0.0.0.0';

// Middlewares de Segurança, CORS e Logging
app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = [
  'https://ntandinho.zyphtech.com',
  'http://ntandinho.zyphtech.com',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ROTA DE HEALTHCHECK GLOBAL COM VERIFICAÇÃO REAL DE BASE DE DADOS (ETAPA 8)
app.get(['/api/health', '/health', '/api/public/health'], async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({
      status: 'ok',
      server: 'running',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
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
app.use(['/api/public', '/public'], publicRoutes);
app.use(['/api/admin', '/admin/api'], adminRoutes);
app.use(['/api/admin/crm', '/crm'], crmRoutes);
app.use(['/api/admin/fleet', '/fleet'], fleetRoutes);
app.use(['/api/admin/finance', '/finance'], financeRoutes);
app.use(['/api/admin/analytics', '/analytics'], analyticsRoutes);

// Fallback de 404 Exclusivo para a API - NUNCA RETORNAR HTML PARA NENHUM ENDPOINT /api/* (ETAPA 13)
app.use(['/api/*', '/api'], (req: Request, res: Response) => {
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

app.listen(PORT, HOST, async () => {
  // Garantir que a base de dados tem o utilizador administrador semeado se necessário
  await seedDatabase().catch((err) => console.error('[SEED DB NOTICE]', err.message));

  console.log(`=================================================`);
  console.log(`🚀 N' Tandinho Server & API Ativo em ${HOST}:${PORT}`);
  console.log(`🌐 Site Público: http://${HOST}:${PORT}/`);
  console.log(`🖥️  Painel Admin: http://${HOST}:${PORT}/admin`);
  console.log(`📍 API Health:   http://${HOST}:${PORT}/api/health`);
  console.log(`🔒 API Admin:    http://${HOST}:${PORT}/api/admin/auth/login`);
  console.log(`=================================================`);
});

