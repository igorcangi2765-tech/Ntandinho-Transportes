import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import operationsRoutes from './routes/operations.js';
import financialRoutes from './routes/financial.js';
import cmsRoutes from './routes/cms.js';
import systemRoutes from './routes/system.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/operations', operationsRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/system', systemRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', service: "N' Tandinho ERP API", time: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ERP Express em execução na porta ${PORT} (http://localhost:${PORT})`);
});
