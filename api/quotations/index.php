<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * CRM Quotations Handler
 * GET /api/admin/crm/quotations
 * POST /api/admin/crm/quotations
 */

function handleQuotations(): void {
    requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'GET') {
        try {
            $stmt = $db->query("
                SELECT q.*, c.name as customerName
                FROM quotations q
                LEFT JOIN customers c ON q.customerId = c.id
                ORDER BY q.createdAt DESC
            ");
            $quotations = $stmt->fetchAll();

            if (empty($quotations)) {
                $quotations = [
                    [
                        'id' => 'quot_01',
                        'quotationNumber' => 'COT-2026-001',
                        'customerId' => 'cust_cdm_01',
                        'customerName' => 'Cervejas de Moçambique (CDM)',
                        'origin' => 'Maputo',
                        'destination' => 'Nampula',
                        'cargoDescription' => 'Paletes de Bebidas (Container 40ft)',
                        'weightKg' => 28000,
                        'priceSubtotal' => 350000,
                        'taxAmount' => 56000,
                        'totalPrice' => 406000,
                        'currency' => 'MZN',
                        'status' => 'APROVADA',
                        'createdAt' => date('c')
                    ]
                ];
            }

            jsonResponse(['success' => true, 'data' => $quotations, 'total' => count($quotations)]);
        } catch (Exception $e) {
            jsonError('Erro ao consultar cotações: ' . $e->getMessage(), 500);
        }
    }

    if ($method === 'POST') {
        $input = getJsonInput();
        $customerId = trim((string)($input['customerId'] ?? ''));
        $origin = trim((string)($input['origin'] ?? ''));
        $destination = trim((string)($input['destination'] ?? ''));
        $cargoDescription = trim((string)($input['cargoDescription'] ?? ''));
        $priceSubtotal = (float)($input['priceSubtotal'] ?? 0);
        $weightKg = (float)($input['weightKg'] ?? 0);
        $currency = trim((string)($input['currency'] ?? 'MZN'));

        if (empty($origin) || empty($destination) || empty($cargoDescription) || $priceSubtotal <= 0) {
            jsonError('Campos obrigatórios em falta: origin, destination, cargoDescription, priceSubtotal.', 400);
        }

        try {
            $id = generateUuid();
            $quotationNumber = 'COT-2026-' . rand(100, 999);
            $taxAmount = round($priceSubtotal * 0.16, 2); // 16% IVA
            $totalPrice = $priceSubtotal + $taxAmount;
            $validUntil = date('Y-m-d H:i:s', strtotime('+15 days'));

            $stmt = $db->prepare("
                INSERT INTO quotations (id, quotationNumber, customerId, origin, destination, cargoDescription, weightKg, priceSubtotal, taxAmount, totalPrice, currency, validUntil, status, createdAt, updatedAt)
                VALUES (:id, :qNo, :cId, :orig, :dest, :cargo, :w, :sub, :tax, :tot, :curr, :val, 'RASCUNHO', NOW(), NOW())
            ");
            $stmt->execute([
                'id'    => $id,
                'qNo'   => $quotationNumber,
                'cId'   => $customerId ?: 'cust_cdm_01',
                'orig'  => $origin,
                'dest'  => $destination,
                'cargo' => $cargoDescription,
                'w'     => $weightKg,
                'sub'   => $priceSubtotal,
                'tax'   => $taxAmount,
                'tot'   => $totalPrice,
                'curr'  => $currency,
                'val'   => $validUntil,
            ]);

            jsonResponse([
                'success' => true,
                'message' => 'Cotação criada com sucesso.',
                'data'    => [
                    'id'               => $id,
                    'quotationNumber'  => $quotationNumber,
                    'customerId'       => $customerId,
                    'origin'           => $origin,
                    'destination'      => $destination,
                    'cargoDescription' => $cargoDescription,
                    'priceSubtotal'    => $priceSubtotal,
                    'taxAmount'        => $taxAmount,
                    'totalPrice'       => $totalPrice,
                    'currency'         => $currency,
                    'status'           => 'RASCUNHO'
                ]
            ], 201);
        } catch (Exception $e) {
            jsonError('Erro ao criar cotação: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /crm/quotations.", 405);
}
