"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = void 0;
const finance_service_1 = require("../services/finance.service");
class FinanceController {
    /**
     * GET /api/admin/finance/invoices
     */
    static async getInvoices(req, res) {
        try {
            const invoices = await finance_service_1.FinanceService.getInvoices();
            return res.json({ success: true, data: invoices });
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Erro ao listar faturas.' });
        }
    }
    /**
     * POST /api/admin/finance/payments
     * Registar recibo de pagamento
     */
    static async registerPayment(req, res) {
        try {
            const { invoiceId, amount, paymentMethod, referenceNo, notes } = req.body;
            if (!invoiceId || !amount || !paymentMethod) {
                return res.status(400).json({
                    error: 'Campos obrigatórios: invoiceId, amount, paymentMethod.',
                });
            }
            const payment = await finance_service_1.FinanceService.registerPayment({
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
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Erro ao registar pagamento.' });
        }
    }
    /**
     * GET /api/admin/finance/summary
     */
    static async getSummary(req, res) {
        try {
            const summary = await finance_service_1.FinanceService.getSummary();
            return res.json({ success: true, data: summary });
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Erro ao carregar resumo financeiro.' });
        }
    }
}
exports.FinanceController = FinanceController;
