import { Router, Response } from 'express';
import { prisma } from '../db.js';

const router = Router();

// ==========================================
// INVOICES (FACTURAS)
// ==========================================
router.get('/invoices', async (_req, res: Response): Promise<any> => {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: 'desc' },
    include: { client: true, trip: true, payments: true }
  });
  return res.json(invoices);
});

router.post('/invoices', async (req, res: Response): Promise<any> => {
  try {
    const count = await prisma.invoice.count();
    const invoiceNumber = `FT-${new Date().getFullYear()}/${String(count + 1).padStart(4, '0')}`;
    const invoice = await prisma.invoice.create({
      data: { ...req.body, invoiceNumber }
    });
    return res.status(201).json(invoice);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/invoices/:id', async (req, res: Response): Promise<any> => {
  try {
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: req.body
    });
    return res.json(invoice);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// ==========================================
// PAYMENTS (PAGAMENTOS)
// ==========================================
router.get('/payments', async (_req, res: Response): Promise<any> => {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { invoice: { include: { client: true } } }
  });
  return res.json(payments);
});

router.post('/payments', async (req, res: Response): Promise<any> => {
  try {
    const payment = await prisma.payment.create({ data: req.body });
    // Update invoice status if fully paid
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.body.invoiceId },
      include: { payments: true }
    });
    if (invoice) {
      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
      if (totalPaid >= invoice.totalAmount) {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: 'Paga' }
        });
      }
    }
    return res.status(201).json(payment);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// ==========================================
// EXPENSES (DESPESAS)
// ==========================================
router.get('/expenses', async (_req, res: Response): Promise<any> => {
  const expenses = await prisma.expense.findMany({
    orderBy: { date: 'desc' }
  });
  return res.json(expenses);
});

router.post('/expenses', async (req, res: Response): Promise<any> => {
  try {
    const expense = await prisma.expense.create({ data: req.body });
    return res.status(201).json(expense);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
