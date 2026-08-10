import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';
import { generateTokens, authenticateJWT, AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e palavra-passe são obrigatórios.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: { include: { permissions: true } } }
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({ error: 'Utilizador suspenso ou inativo. Contacte o Administrador.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        entity: 'User',
        entityId: user.id,
        action: 'LOGIN',
        newValues: `Utilizador ${user.name} efetuou login com sucesso.`
      }
    });

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name
    });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role.name,
        permissions: user.role.permissions.map(p => p.permission)
      },
      ...tokens
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Erro interno no servidor ao processar o login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateJWT, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { role: { include: { permissions: true } } }
    });

    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role.name,
        permissions: user.role.permissions.map(p => p.permission)
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao obter dados do utilizador.' });
  }
});

export default router;
