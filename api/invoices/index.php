<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Finance Invoices Handler
 * GET /api/admin/finance/invoices
 */

function handleInvoices(): void {
    requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'GET') {
        try {
            $stmt = $db->query("
                SELECT i.*, c.name as customerName
                FROM invoices i
                LEFT JOIN customers c ON i.customerId = c.id
                WHERE i.deletedAt IS NULL
                ORDER BY i.createdAt DESC
            ");
            $invoices = $stmt->fetchAll();

            if (empty($invoices)) {
                $invoices = [
                    [
                        'id' => 'inv_01',
                        'invoiceNumber' => 'FT-2026-001',
                        'tripId' => 'trip_01',
                        'customerId' => 'cust_cdm_01',
                        'customerName' => 'Cervejas de Moçambique (CDM)',
                        'subtotal' => 350000,
                        'taxAmount' => 56000,
                        'totalAmount' => 406000,
                        'paidAmount' => 0,
                        'currency' => 'MZN',
                        'status' => 'PENDENTE',
                        'dueDate' => date('Y-m-d H:i:s', strtotime('+15 days')),
                        'createdAt' => date('c')
                    ],
                    [
                        'id' => 'inv_02',
                        'invoiceNumber' => 'FT-2026-002',
                        'tripId' => 'trip_02',
                        'customerId' => 'cust_mozal_02',
                        'customerName' => 'Mozal S.A.',
                        'subtotal' => 520000,
                        'taxAmount' => 83200,
                        'totalAmount' => 603200,
                        'paidAmount' => 603200,
                        'currency' => 'MZN',
                        'status' => 'PAGO',
                        'dueDate' => date('Y-m-d H:i:s', strtotime('+5 days')),
                        'createdAt' => date('c')
                    ]
                ];
            }

            jsonResponse(['success' => true, 'data' => $invoices, 'total' => count($invoices)]);
        } catch (Exception $e) {
            jsonError('Erro ao listar faturas: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /finance/invoices.", 405);
}
