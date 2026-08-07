import { Request, Response } from 'express';
import { FinanceService } from '../services/finance.service';

export class FinanceController {
  /**
   * GET /api/admin/finance/invoices
   */
  static async getInvoices(req: Request, res: Response) {
    try {
      const invoices = await FinanceService.getInvoices();
      return res.json({ success: true, data: invoices });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Erro ao listar faturas.' });
    }
  }

  /**
   * POST /api/admin/finance/payments
   * Registar recibo de pagamento
   */
  static async registerPayment(req: Request, res: Response) {
    try {
      const { invoiceId, amount, paymentMethod, referenceNo, notes } = req.body;

      if (!invoiceId || !amount || !paymentMethod) {
        return res.status(400).json({
          error: 'Campos obrigatórios: invoiceId, amount, paymentMethod.',
        });
      }

      const payment = await FinanceService.registerPayment({
        invoiceId,
        amount: parseFloat(amount),
        paymentMethod,
        referenceNo,
        notes,
      });

      return res.status(201).json({
        success: true,
        message: 'Recibo de pagamento registado com sucesso.',
        data: payment,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Erro ao registar pagamento.' });
    }
  }

  /**
   * GET /api/admin/finance/summary
   */
  static async getSummary(req: Request, res: Response) {
    try {
      const summary = await FinanceService.getSummary();
      return res.json({ success: true, data: summary });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Erro ao carregar resumo financeiro.' });
    }
  }
}
