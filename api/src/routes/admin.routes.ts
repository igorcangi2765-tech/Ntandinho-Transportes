import { Router, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';

const adminRouter = Router();

/**
 * Healthcheck protegido do admin ERP
 */
adminRouter.get('/health', requireAuth, requireRole(['ADMIN', 'GERENTE_FROTA']), (req: AuthenticatedRequest, res: Response) => {
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
adminRouter.all('/auth/login', (req: AuthenticatedRequest, res: Response, next) => {
  if (req.method === 'POST') return next();
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return res.status(405).json({
    success: false,
    endpoint: '/api/admin/auth/login',
    error: `O método ${req.method} não é permitido. Utilize POST.`,
    failureReason: 'Este endpoint aceita apenas requisições HTTP POST.',
  });
});

adminRouter.post('/auth/login', async (req: AuthenticatedRequest, res: Response) => {
  const ipAddress = (req.ip || req.socket.remoteAddress || '127.0.0.1').toString();
  const userAgent = (req.headers['user-agent'] || 'Unknown').toString();
  const { email, password } = req.body || {};

  console.log(`[API REQUEST] POST /api/admin/auth/login | Target Email: '${email}' | IP: ${ipAddress}`);

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      endpoint: '/api/admin/auth/login',
      error: 'Por favor forneça e-mail e palavra-passe.',
      userFound: false,
      passwordValid: false,
      sessionCreated: false,
      tokenCreated: false,
      failureReason: 'Campos de e-mail ou palavra-passe ausentes no corpo da requisição.',
    });
  }

  try {
    const result = await AuthService.login(email, password, ipAddress, userAgent);
    return res.json({
      success: true,
      endpoint: '/api/admin/auth/login',
      ...result,
    });
  } catch (err: any) {
    console.error(`[API LOGIN ERROR] POST /api/admin/auth/login falhou:`, err.message);
    return res.status(401).json({
      success: false,
      endpoint: '/api/admin/auth/login',
      error: err.message || 'Falha na autenticação.',
      failureReason: err.message || 'Credenciais de acesso incorretas ou utilizador inexistente.',
    });
  }
});

/**
 * Endpoint para obter os dados do perfil do utilizador autenticado
 */
adminRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    user: req.user,
  });
});

export default adminRouter;
