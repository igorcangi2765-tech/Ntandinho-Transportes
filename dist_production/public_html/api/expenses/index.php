<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Expenses Handler
 * GET /api/admin/expenses
 * POST /api/admin/expenses
 */

function handleExpenses(): void {
    requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'GET') {
        try {
            $stmt = $db->query("SELECT * FROM expenses ORDER BY date DESC");
            $expenses = $stmt->fetchAll();
            jsonResponse(['success' => true, 'data' => $expenses, 'total' => count($expenses)]);
        } catch (Exception $e) {
            jsonError('Erro ao listar despesas: ' . $e->getMessage(), 500);
        }
    }

    if ($method === 'POST') {
        $input = getJsonInput();
        $category = trim((string)($input['category'] ?? 'COMBUSTIVEL'));
        $description = trim((string)($input['description'] ?? ''));
        $amount = (float)($input['amount'] ?? 0);
        $vehicleId = trim((string)($input['vehicleId'] ?? ''));

        if (empty($description) || $amount <= 0) {
            jsonError('Campos obrigatórios: description, amount.', 400);
        }

        try {
            $id = generateUuid();
            $stmt = $db->prepare("
                INSERT INTO expenses (id, category, description, amount, vehicleId, date, createdAt)
                VALUES (:id, :cat, :desc, :amt, :vId, NOW(), NOW())
            ");
            $stmt->execute([
                'id'   => $id,
                'cat'  => $category,
                'desc' => $description,
                'amt'  => $amount,
                'vId'  => $vehicleId ?: null,
            ]);

            jsonResponse(['success' => true, 'message' => 'Despesa registada com sucesso.', 'data' => ['id' => $id, 'amount' => $amount]], 201);
        } catch (Exception $e) {
            jsonError('Erro ao registar despesa: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /expenses.", 405);
}
