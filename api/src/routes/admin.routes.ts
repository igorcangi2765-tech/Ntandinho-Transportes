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
adminRouter.post('/auth/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Por favor forneça email e palavra-passe.' });
    }

    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await AuthService.login(email, password, ipAddress, userAgent);
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(401).json({ error: err.message || 'Falha na autenticação.' });
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
