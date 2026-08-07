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
   * Compara a palavra-passe em texto limpo com o hash ou valor armazenado
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) return false;
    if (password === hash) return true;
    try {
      return await bcrypt.compare(password, hash);
    } catch {
      return false;
    }
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
    const cleanPassword = password || '';

    if (!cleanEmail || !cleanPassword) {
      console.warn(`[AUTH FAIL] Tentativa de login sem e-mail ou palavra-passe.`);
      throw new Error('E-mail e palavra-passe são obrigatórios.');
    }

    let user;
    try {
      user = await prisma.user.findFirst({
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
    } catch (dbErr: any) {
      console.error(`[AUTH DATABASE ERROR] Falha na ligação à base de dados:`, dbErr.message || dbErr);
      throw new Error(`Erro na base de dados: ${dbErr.message || 'Não foi possível ligar ao servidor MySQL/SQLite.'}`);
    }

    if (!user) {
      console.warn(`[AUTH FAIL] Utilizador não encontrado para o e-mail: ${cleanEmail}`);
      throw new Error(`Utilizador com o e-mail '${cleanEmail}' não foi encontrado na base de dados.`);
    }

    if (!user.isActive || user.deletedAt) {
      console.warn(`[AUTH FAIL] Conta inativa ou eliminada para o e-mail: ${cleanEmail}`);
      throw new Error(`A conta de acesso associada a '${cleanEmail}' encontra-se inativa ou desativada.`);
    }

    const isPlainTextMatch = user.password === cleanPassword;
    const isValidPassword = isPlainTextMatch || (await this.comparePassword(cleanPassword, user.password));
    if (!isValidPassword) {
      console.warn(`[AUTH FAIL] Palavra-passe incorreta para o e-mail: ${cleanEmail}`);
      throw new Error(`A palavra-passe introduzida para '${cleanEmail}' está incorreta.`);
    }

    // Se a password na BD estava armazenada em texto limpo (ex: inserida no phpMyAdmin), atualiza-a para hash bcrypt
    if (isPlainTextMatch) {
      const secureHash = await this.hashPassword(cleanPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: secureHash },
      }).catch((err) => console.error('[AUTH AUTO-HASH FAIL]', err));
      console.log(`[AUTH AUTO-HASH SUCCESS] Palavra-passe em texto limpo do utilizador ${cleanEmail} foi convertida para hash bcrypt.`);
    }

    const permissions = user.role?.permissions ? user.role.permissions.map(
      (rp) => `${rp.permission.resource}:${rp.permission.action}`
    ) : [];

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role?.name || 'ADMIN',
      permissions,
    });

    let sessionCreated = false;
    try {
      await prisma.session.create({
        data: {
          userId: user.id,
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          ipAddress: ipAddress || '127.0.0.1',
          userAgent: userAgent || 'Unknown',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      sessionCreated = true;
    } catch (sessionErr: any) {
      console.error(`[AUTH SESSION WARNING] Não foi possível registar a sessão na BD:`, sessionErr.message || sessionErr);
    }

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN',
          entity: 'USER',
          entityId: user.id,
          ipAddress: ipAddress || '127.0.0.1',
          details: 'Login efetuado com sucesso via API ERP',
        },
      });
    } catch (auditErr: any) {
      console.error(`[AUTH AUDIT WARNING] Não foi possível criar AuditLog:`, auditErr.message || auditErr);
    }

    console.log(`[AUTH SUCCESS] Login bem-sucedido para o utilizador: ${user.email} (ID: ${user.id})`);

    return {
      userFound: true,
      passwordValid: true,
      sessionCreated,
      tokenCreated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role?.name || 'ADMIN',
        permissions,
      },
      tokens,
    };
  }
}
