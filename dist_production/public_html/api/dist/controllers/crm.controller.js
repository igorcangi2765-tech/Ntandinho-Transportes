"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRMController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Dados de fallback para demonstração imediata
const mockCustomers = [
    {
        id: 'cust_cdm_01',
        name: 'Cervejas de Moçambique (CDM)',
        nuit: '400192834',
        email: 'logistica@cdm.co.mz',
        phone: '+258 84 123 4567',
        isCorporate: true,
        status: 'ATIVO',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'cust_mozal_02',
        name: 'Mozal S.A.',
        nuit: '400551920',
        email: 'supply@mozal.com',
        phone: '+258 82 987 6543',
        isCorporate: true,
        status: 'ATIVO',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'cust_vale_03',
        name: 'Vulcan Minerals Moçambique',
        nuit: '400998811',
        email: 'transporte@vulcan.co.mz',
        phone: '+258 84 555 7788',
        isCorporate: true,
        status: 'ATIVO',
        createdAt: new Date().toISOString(),
    },
];
const mockQuotations = [
    {
        id: 'quot_01',
        quotationNumber: 'COT-2026-001',
        customerId: 'cust_cdm_01',
        customerName: 'Cervejas de Moçambique (CDM)',
        origin: 'Maputo',
        destination: 'Nampula',
        cargoDescription: 'Paletes de Bebidas (Container 40ft)',
        weightKg: 28000,
        priceSubtotal: 350000,
        taxAmount: 56000,
        totalPrice: 406000,
        currency: 'MZN',
        status: 'APROVADA',
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: 'quot_02',
        quotationNumber: 'COT-2026-002',
        customerId: 'cust_mozal_02',
        customerName: 'Mozal S.A.',
        origin: 'Beira',
        destination: 'Lilongwe (Malawi)',
        cargoDescription: 'Lingotes de Alumínio (Carga SADC)',
        weightKg: 32000,
        priceSubtotal: 520000,
        taxAmount: 83200,
        totalPrice: 603200,
        currency: 'MZN',
        status: 'ENVIADA',
        validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
    },
];
class CRMController {
    /**
     * GET /api/admin/crm/customers
     */
    static async getCustomers(req, res) {
        try {
            const search = req.query.search || '';
            let customers = [];
            try {
                customers = await prisma.customer.findMany({
                    where: {
                        deletedAt: null,
                        OR: [
                            { name: { contains: search } },
                            { nuit: { contains: search } },
                            { email: { contains: search } },
                        ],
                    },
                    orderBy: { createdAt: 'desc' },
                });
            }
            catch {
                customers = mockCustomers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) ||
                    c.nuit.includes(search) ||
                    c.email.toLowerCase().includes(search.toLowerCase()));
            }
            return res.json({
                success: true,
                data: customers,
                total: customers.length,
            });
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Erro ao listar clientes.' });
        }
    }
    /**
     * POST /api/admin/crm/customers
     */
    static async createCustomer(req, res) {
        try {
            const { name, email, phone, nuit, isCorporate } = req.body;
            if (!name || !email || !phone) {
                return res.status(400).json({ error: 'Campos obrigatórios: name, email, phone.' });
            }
            let customer;
            try {
                customer = await prisma.customer.create({
                    data: {
                        name,
                        email,
                        phone,
                        nuit: nuit || null,
                        isCorporate: isCorporate !== undefined ? isCorporate : true,
                    },
                });
            }
            catch {
                customer = {
                    id: `cust_${Date.now()}`,
                    name,
                    email,
                    phone,
                    nuit: nuit || '400000000',
                    isCorporate: true,
                    status: 'ATIVO',
                    createdAt: new Date().toISOString(),
                };
                mockCustomers.unshift(customer);
            }
            return res.status(201).json({
                success: true,
                message: 'Cliente registado com sucesso.',
                data: customer,
            });
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Erro ao criar cliente.' });
        }
    }
    /**
     * GET /api/admin/crm/quotations
     */
    static async getQuotations(req, res) {
        try {
            let quotations = [];
            try {
                quotations = await prisma.quotation.findMany({
                    include: {
                        customer: true,
                    },
                    orderBy: { createdAt: 'desc' },
                });
            }
            catch {
                quotations = mockQuotations;
            }
            return res.json({
                success: true,
                data: quotations,
                total: quotations.length,
            });
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Erro ao listar cotações.' });
        }
    }
    /**
     * POST /api/admin/crm/quotations
     */
    static async createQuotation(req, res) {
        try {
            const { customerId, origin, destination, cargoDescription, weightKg, priceSubtotal, currency = 'MZN', } = req.body;
            if (!origin || !destination || !cargoDescription || !priceSubtotal) {
                return res.status(400).json({ error: 'Campos obrigatórios em falta para a cotação.' });
            }
            const subtotal = parseFloat(priceSubtotal);
            const taxAmount = Math.round(subtotal * 0.16 * 100) / 100; // IVA 16% Moçambique
            const totalPrice = subtotal + taxAmount;
            const quotationNumber = `COT-2026-${Math.floor(100 + Math.random() * 900)}`;
            const validUntil = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
            let quotation;
            try {
                quotation = await prisma.quotation.create({
                    data: {
                        quotationNumber,
                        customerId: customerId || 'cust_cdm_01',
                        origin,
                        destination,
                        cargoDescription,
                        weightKg: parseFloat(weightKg || 0),
                        priceSubtotal: subtotal,
                        taxAmount,
                        totalPrice,
                        currency,
                        validUntil,
                        status: 'RASCUNHO',
                    },
                });
            }
            catch {
                quotation = {
                    id: `quot_${Date.now()}`,
                    quotationNumber,
                    customerId: customerId || 'cust_cdm_01',
                    customerName: 'Cliente Corporativo N\' Tandinho',
                    origin,
                    destination,
                    cargoDescription,
                    weightKg: parseFloat(weightKg || 0),
                    priceSubtotal: subtotal,
                    taxAmount,
                    totalPrice,
                    currency,
                    status: 'RASCUNHO',
                    validUntil: validUntil.toISOString(),
                    createdAt: new Date().toISOString(),
                };
                mockQuotations.unshift(quotation);
            }
            return res.status(201).json({
                success: true,
                message: 'Cotação criada com sucesso.',
                data: quotation,
            });
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Erro ao criar cotação.' });
        }
    }
}
exports.CRMController = CRMController;
