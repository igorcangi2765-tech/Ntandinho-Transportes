import { Request, Response, NextFunction } from 'express';
import { AuthService, TokenPayload } from '../services/auth.service';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware para validar o Access Token JWT enviado no cabeçalho Authorization: Bearer <token>
 */
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Não autorizado. Cabeçalho de autorização ausente ou malformatado.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = AuthService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      error: 'Sessão expirada ou token inválido. Por favor, efetue login novamente.',
    });
  }
};

/**
 * Middleware de Controlo de Acesso Baseado em Funções (RBAC)
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
