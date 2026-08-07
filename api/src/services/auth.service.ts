import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'ntandinho_secret_jwt_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'ntandinho_refresh_secret_key_2026';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  permissions?: string[];
}

export class AuthService {
  /**
   * Encripta a palavra-passe com bcryptjs (10 rondas de sal)
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compara a palavra-passe em texto limpo com o hash armazenado
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Gera Access Token (1h) e Refresh Token (7d)
   */
  static generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: payload.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  /**
   * Valida o Access Token JWT
   */
  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  }

  /**
   * Valida o Refresh Token JWT
   */
  static verifyRefreshToken(token: string): { id: string } {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
  }

  /**
   * Serviço principal de Login com verificação de credenciais e criação de sessão na base de dados
   */
  static async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
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

    const permissions = user.role.permissions.map(
      (rp) => `${rp.permission.resource}:${rp.permission.action}`
    );

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
