import { Router, Response } from 'express';
import { prisma } from '../db.js';

const router = Router();

// ==========================================
// VEHICLES (FROTA)
// ==========================================
router.get('/vehicles', async (_req, res: Response): Promise<any> => {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { trips: true, maintenances: true } } }
  });
  return res.json(vehicles);
});

router.post('/vehicles', async (req, res: Response): Promise<any> => {
  try {
    const vehicle = await prisma.vehicle.create({ data: req.body });
    return res.status(201).json(vehicle);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/vehicles/:id', async (req, res: Response): Promise<any> => {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: req.body
    });
    return res.json(vehicle);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.delete('/vehicles/:id', async (req, res: Response): Promise<any> => {
  await prisma.vehicle.delete({ where: { id: req.params.id } });
  return res.json({ success: true });
});

// ==========================================
// DRIVERS (MOTORISTAS)
// ==========================================
router.get('/drivers', async (_req, res: Response): Promise<any> => {
  const drivers = await prisma.driver.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { trips: true } } }
  });
  return res.json(drivers);
});

router.post('/drivers', async (req, res: Response): Promise<any> => {
  try {
    const driver = await prisma.driver.create({ data: req.body });
    return res.status(201).json(driver);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/drivers/:id', async (req, res: Response): Promise<any> => {
  try {
    const driver = await prisma.driver.update({
      where: { id: req.params.id },
      data: req.body
    });
    return res.json(driver);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.delete('/drivers/:id', async (req, res: Response): Promise<any> => {
  await prisma.driver.delete({ where: { id: req.params.id } });
  return res.json({ success: true });
});

// ==========================================
// CLIENTS (CLIENTES)
// ==========================================
router.get('/clients', async (_req, res: Response): Promise<any> => {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { bookings: true, invoices: true } } }
  });
  return res.json(clients);
});

router.post('/clients', async (req, res: Response): Promise<any> => {
  try {
    const client = await prisma.client.create({ data: req.body });
    return res.status(201).json(client);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/clients/:id', async (req, res: Response): Promise<any> => {
  try {
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: req.body
    });
    return res.json(client);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.delete('/clients/:id', async (req, res: Response): Promise<any> => {
  await prisma.client.delete({ where: { id: req.params.id } });
  return res.json({ success: true });
});

// ==========================================
// BOOKINGS (RESERVAS)
// ==========================================
router.get('/bookings', async (_req, res: Response): Promise<any> => {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: { client: true }
  });
  return res.json(bookings);
});

router.post('/bookings', async (req, res: Response): Promise<any> => {
  try {
    const booking = await prisma.booking.create({ data: req.body });
    return res.status(201).json(booking);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/bookings/:id', async (req, res: Response): Promise<any> => {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: req.body
    });
    return res.json(booking);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.delete('/bookings/:id', async (req, res: Response): Promise<any> => {
  await prisma.booking.delete({ where: { id: req.params.id } });
  return res.json({ success: true });
});

// ==========================================
// TRIPS (VIAGENS)
// ==========================================
router.get('/trips', async (_req, res: Response): Promise<any> => {
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: 'desc' },
    include: { driver: true, vehicle: true, booking: { include: { client: true } } }
  });
  return res.json(trips);
});

router.get('/trips/track/:code', async (req, res: Response): Promise<any> => {
  const trip = await prisma.trip.findUnique({
    where: { trackingCode: req.params.code },
    include: { vehicle: true, driver: true, booking: { include: { client: true } } }
  });
  if (!trip) return res.status(404).json({ error: 'Código de rastreio não encontrado' });
  return res.json(trip);
});

router.post('/trips', async (req, res: Response): Promise<any> => {
  try {
    const trackingCode = `NT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const trip = await prisma.trip.create({
      data: { ...req.body, trackingCode }
    });
    return res.status(201).json(trip);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/trips/:id', async (req, res: Response): Promise<any> => {
  try {
    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: req.body
    });
    return res.json(trip);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.delete('/trips/:id', async (req, res: Response): Promise<any> => {
  await prisma.trip.delete({ where: { id: req.params.id } });
  return res.json({ success: true });
});


// ==========================================
// MAINTENANCE & FUEL LOGS
// ==========================================
router.get('/maintenance', async (_req, res: Response): Promise<any> => {
  const items = await prisma.maintenance.findMany({
    orderBy: { createdAt: 'desc' },
    include: { vehicle: true }
  });
  return res.json(items);
});

router.post('/maintenance', async (req, res: Response): Promise<any> => {
  const item = await prisma.maintenance.create({ data: req.body });
  return res.status(201).json(item);
});

router.get('/fuel', async (_req, res: Response): Promise<any> => {
  const logs = await prisma.fuelLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: { vehicle: true }
  });
  return res.json(logs);
});

router.post('/fuel', async (req, res: Response): Promise<any> => {
  const log = await prisma.fuelLog.create({ data: req.body });
  return res.status(201).json(log);
});

export default router;
