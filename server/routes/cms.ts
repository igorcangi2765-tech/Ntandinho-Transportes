import { Router, Response } from 'express';
import { prisma } from '../db.js';

const router = Router();

// HERO
router.get('/hero', async (_req, res: Response): Promise<any> => {
  const hero = await prisma.hero.findFirst();
  return res.json(hero || {});
});

router.put('/hero', async (req, res: Response): Promise<any> => {
  const first = await prisma.hero.findFirst();
  if (first) {
    const updated = await prisma.hero.update({ where: { id: first.id }, data: req.body });
    return res.json(updated);
  }
  const created = await prisma.hero.create({ data: req.body });
  return res.json(created);
});

// ABOUT
router.get('/about', async (_req, res: Response): Promise<any> => {
  const about = await prisma.about.findFirst();
  return res.json(about || {});
});

router.put('/about', async (req, res: Response): Promise<any> => {
  const first = await prisma.about.findFirst();
  if (first) {
    const updated = await prisma.about.update({ where: { id: first.id }, data: req.body });
    return res.json(updated);
  }
  const created = await prisma.about.create({ data: req.body });
  return res.json(created);
});

// SERVICES
router.get('/services', async (_req, res: Response): Promise<any> => {
  const services = await prisma.service.findMany({ orderBy: { createdAt: 'asc' } });
  return res.json(services);
});

router.post('/services', async (req, res: Response): Promise<any> => {
  const service = await prisma.service.create({ data: req.body });
  return res.status(201).json(service);
});

router.put('/services/:id', async (req, res: Response): Promise<any> => {
  const service = await prisma.service.update({ where: { id: req.params.id }, data: req.body });
  return res.json(service);
});

router.delete('/services/:id', async (req, res: Response): Promise<any> => {
  await prisma.service.delete({ where: { id: req.params.id } });
  return res.json({ success: true });
});

// FAQ & TESTIMONIALS & BLOG & PARTNERS & CONTACTS
router.get('/faq', async (_req, res: Response): Promise<any> => {
  const items = await prisma.fAQ.findMany({ orderBy: { order: 'asc' } });
  return res.json(items);
});

router.post('/faq', async (req, res: Response): Promise<any> => {
  const item = await prisma.fAQ.create({ data: req.body });
  return res.status(201).json(item);
});

router.get('/blog', async (_req, res: Response): Promise<any> => {
  const items = await prisma.blog.findMany({ orderBy: { createdAt: 'desc' } });
  return res.json(items);
});

router.get('/contacts', async (_req, res: Response): Promise<any> => {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  return res.json(contacts);
});

router.post('/contacts', async (req, res: Response): Promise<any> => {
  const contact = await prisma.contact.create({ data: req.body });
  return res.status(201).json(contact);
});

// WEBSITE SETTINGS & SEO
router.get('/settings', async (_req, res: Response): Promise<any> => {
  const settings = await prisma.websiteSettings.findFirst();
  return res.json(settings || {});
});

router.put('/settings', async (req, res: Response): Promise<any> => {
  const first = await prisma.websiteSettings.findFirst();
  if (first) {
    const updated = await prisma.websiteSettings.update({ where: { id: first.id }, data: req.body });
    return res.json(updated);
  }
  const created = await prisma.websiteSettings.create({ data: req.body });
  return res.json(created);
});

export default router;
