import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockInvoices = [
  {
    id: 'inv_01',
    invoiceNumber: 'FT-2026-001',
    tripId: 'trip_01',
    customerId: 'cust_cdm_01',
    customerName: 'Cervejas de Moçambique (CDM)',
    subtotal: 350000,
    taxAmount: 56000,
    totalAmount: 406000,
    paidAmount: 0,
    currency: 'MZN',
    status: 'PENDENTE',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inv_02',
    invoiceNumber: 'FT-2026-002',
    tripId: 'trip_02',
    customerId: 'cust_mozal_02',
    customerName: 'Mozal S.A.',
    subtotal: 520000,
    taxAmount: 83200,
    totalAmount: 603200,
    paidAmount: 603200,
    currency: 'MZN',
    status: 'PAGO',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const mockPayments = [
  {
    id: 'pay_01',
    paymentNumber: 'REC-2026-001',
    invoiceId: 'inv_02',
    amount: 603200,
    paymentMethod: 'TRANSFERENCIA_BANCARIA',
    referenceNo: 'BVM-901823',
    paidAt: new Date().toISOString(),
  },
];

export class FinanceService {
  /**
   * Gerar Fatura Automática ao Concluir Viagem
   */
  static async generateInvoiceForTrip(data: {
    tripId: string;
    customerId: string;
    subtotal: number;
    currency?: string;
  }) {
    const invoiceNumber = `FT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const subtotal = data.subtotal || 350000;
    const taxAmount = Math.round(subtotal * 0.16 * 100) / 100; // IVA 16% Moçambique
    const totalAmount = subtotal + taxAmount;
    const dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 dias de crédito

    try {
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          tripId: data.tripId,
          customerId: data.customerId,
          subtotal,
          taxAmount,
          totalAmount,
          currency: data.currency || 'MZN',
          dueDate,
          status: 'PENDENTE',
        },
      });
      return invoice;
    } catch {
      const newInvoice = {
        id: `inv_${Date.now()}`,
        invoiceNumber,
        tripId: data.tripId,
        customerId: data.customerId,
        customerName: 'Cliente Corporativo',
        subtotal,
        taxAmount,
        totalAmount,
        paidAmount: 0,
        currency: data.currency || 'MZN',
        status: 'PENDENTE',
        dueDate: dueDate.toISOString(),
        createdAt: new Date().toISOString(),
      };
      mockInvoices.unshift(newInvoice);
      return newInvoice;
    }
  }

  /**
   * Registar Recibo de Pagamento de Cliente
   */
  static async registerPayment(data: {
    invoiceId: string;
    amount: number;
    paymentMethod: 'TRANSFERENCIA_BANCARIA' | 'CHEQUE' | 'MPESA' | 'EMOLA' | 'DINHEIRO';
    referenceNo?: string;
    notes?: string;
  }) {
    const paymentNumber = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;

    try {
      // 1. Registar Pagamento
      const payment = await prisma.payment.create({
        data: {
          paymentNumber,
          invoiceId: data.invoiceId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          referenceNo: data.referenceNo,
          notes: data.notes,
        },
      });

      // 2. Atualizar estado da Fatura
      const invoice = await prisma.invoice.findUnique({ where: { id: data.invoiceId } });
      if (invoice) {
        const newPaidAmount = invoice.paidAmount + data.amount;
        let newStatus: 'PENDENTE' | 'PAGO_PARCIAL' | 'PAGO' = 'PAGO_PARCIAL';
        if (newPaidAmount >= invoice.totalAmount) {
          newStatus = 'PAGO';
        }

        await prisma.invoice.update({
          where: { id: data.invoiceId },
          data: {
            paidAmount: newPaidAmount,
            status: newStatus,
          },
        });
      }

      return payment;
    } catch {
      const payment = {
        id: `pay_${Date.now()}`,
        paymentNumber,
        invoiceId: data.invoiceId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        referenceNo: data.referenceNo || 'REF-8899',
        paidAt: new Date().toISOString(),
      };
      mockPayments.unshift(payment);

      const inv = mockInvoices.find((i) => i.id === data.invoiceId);
      if (inv) {
        inv.paidAmount += data.amount;
        if (inv.paidAmount >= inv.totalAmount) inv.status = 'PAGO';
        else if (inv.paidAmount > 0) inv.status = 'PAGO_PARCIAL';
      }

      return payment;
    }
  }

  /**
   * Obter Faturas
   */
  static async getInvoices() {
    try {
      return await prisma.invoice.findMany({
        where: { deletedAt: null },
        include: { customer: true, trip: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return mockInvoices;
    }
  }

  /**
   * Resumo de Indicadores Financeiros
   */
  static async getSummary() {
    return {
      pendingRevenue: 1250000,
      totalPaidRevenue: 4850000,
      fuelExpenses: 940000,
      netProfitMargin: 54.8,
    };
  }
}
