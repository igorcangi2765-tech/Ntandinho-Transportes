import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ntandinho_super_secret_jwt_key_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido ou expirado' });
      }
      req.user = user as AuthRequest['user'];
      next();
    });
  } else {
    res.status(401).json({ error: 'Autorização necessária (Bearer Token ausente)' });
  }
}

export function generateTokens(userPayload: { id: string; email: string; name: string; role: string }) {
  const accessToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '8h' });
  const refreshToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}
