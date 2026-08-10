import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';

const router = Router();

// USERS & ROLES
router.get('/users', async (_req, res: Response): Promise<any> => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      status: true,
      lastLogin: true,
      role: true,
      createdAt: true
    }
  });
  return res.json(users);
});

router.post('/users', async (req, res: Response): Promise<any> => {
  try {
    const { name, email, password, roleId, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'ntandinho123', 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        roleId
      }
    });
    return res.status(201).json(user);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.get('/roles', async (_req, res: Response): Promise<any> => {
  const roles = await prisma.role.findMany({
    include: { permissions: true, _count: { select: { users: true } } }
  });
  return res.json(roles);
});

// AUDIT LOGS & ACTIVITY LOGS
router.get('/audit-logs', async (_req, res: Response): Promise<any> => {
  const logs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });
  return res.json(logs);
});

// COMPANY INFO
router.get('/company', async (_req, res: Response): Promise<any> => {
  const company = await prisma.company.findFirst();
  return res.json(company || {});
});

router.put('/company', async (req, res: Response): Promise<any> => {
  const first = await prisma.company.findFirst();
  if (first) {
    const updated = await prisma.company.update({ where: { id: first.id }, data: req.body });
    return res.json(updated);
  }
  const created = await prisma.company.create({ data: req.body });
  return res.json(created);
});

export default router;
