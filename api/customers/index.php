<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * CRM Customers Handler
 * GET /api/admin/crm/customers
 * POST /api/admin/crm/customers
 */

function handleCustomers(): void {
    requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'GET') {
        $search = trim((string)($_GET['search'] ?? ''));
        try {
            $sql = "SELECT * FROM customers WHERE deletedAt IS NULL";
            $params = [];
            if (!empty($search)) {
                $sql .= " AND (LOWER(name) LIKE :s OR nuit LIKE :s OR LOWER(email) LIKE :s)";
                $params['s'] = '%' . strtolower($search) . '%';
            }
            $sql .= " ORDER BY createdAt DESC";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $customers = $stmt->fetchAll();

            if (empty($customers)) {
                // Fallback mock para demonstração inicial
                $customers = [
                    [
                        'id' => 'cust_cdm_01',
                        'name' => 'Cervejas de Moçambique (CDM)',
                        'nuit' => '400192834',
                        'email' => 'logistica@cdm.co.mz',
                        'phone' => '+258 84 123 4567',
                        'isCorporate' => true,
                        'status' => 'ATIVO',
                        'createdAt' => date('c')
                    ],
                    [
                        'id' => 'cust_mozal_02',
                        'name' => 'Mozal S.A.',
                        'nuit' => '400551920',
                        'email' => 'supply@mozal.com',
                        'phone' => '+258 82 987 6543',
                        'isCorporate' => true,
                        'status' => 'ATIVO',
                        'createdAt' => date('c')
                    ]
                ];
            }

            jsonResponse(['success' => true, 'data' => $customers, 'total' => count($customers)]);
        } catch (Exception $e) {
            jsonError('Erro ao consultar clientes: ' . $e->getMessage(), 500);
        }
    }

    if ($method === 'POST') {
        $input = getJsonInput();
        $name = trim((string)($input['name'] ?? ''));
        $email = trim((string)($input['email'] ?? ''));
        $phone = trim((string)($input['phone'] ?? ''));
        $nuit = trim((string)($input['nuit'] ?? ''));
        $isCorporate = isset($input['isCorporate']) ? (bool)$input['isCorporate'] : true;

        if (empty($name) || empty($email) || empty($phone)) {
            jsonError('Campos obrigatórios em falta: name, email, phone.', 400);
        }

        try {
            $id = generateUuid();
            $stmt = $db->prepare("
                INSERT INTO customers (id, name, email, phone, nuit, isCorporate, status, createdAt, updatedAt)
                VALUES (:id, :name, :email, :phone, :nuit, :isCorporate, 'ATIVO', NOW(), NOW())
            ");
            $stmt->execute([
                'id'          => $id,
                'name'        => $name,
                'email'       => $email,
                'phone'       => $phone,
                'nuit'        => $nuit ?: null,
                'isCorporate' => $isCorporate ? 1 : 0,
            ]);

            jsonResponse([
                'success' => true,
                'message' => 'Cliente registado com sucesso.',
                'data'    => [
                    'id'          => $id,
                    'name'        => $name,
                    'email'       => $email,
                    'phone'       => $phone,
                    'nuit'        => $nuit,
                    'isCorporate' => $isCorporate,
                    'status'      => 'ATIVO',
                ]
            ], 201);
        } catch (Exception $e) {
            jsonError('Erro ao criar cliente: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /crm/customers.", 405);
}
