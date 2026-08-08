<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Stock & Inventory Handler
 * GET /api/admin/stock
 * POST /api/admin/stock
 */

function handleStock(): void {
    requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'GET') {
        try {
            $stmt = $db->query("SELECT * FROM stock ORDER BY name ASC");
            $items = $stmt->fetchAll();
            jsonResponse(['success' => true, 'data' => $items, 'total' => count($items)]);
        } catch (Exception $e) {
            jsonError('Erro ao consultar stock: ' . $e->getMessage(), 500);
        }
    }

    if ($method === 'POST') {
        $input = getJsonInput();
        $code = trim((string)($input['code'] ?? ''));
        $name = trim((string)($input['name'] ?? ''));
        $category = trim((string)($input['category'] ?? 'PECAS'));
        $quantity = (int)($input['quantity'] ?? 0);
        $unitPrice = (float)($input['unitPrice'] ?? 0);

        if (empty($code) || empty($name)) {
            jsonError('Campos obrigatórios: code, name.', 400);
        }

        try {
            $id = generateUuid();
            $stmt = $db->prepare("
                INSERT INTO stock (id, code, name, category, quantity, minQuantity, unitPrice, createdAt, updatedAt)
                VALUES (:id, :code, :name, :cat, :qty, 5, :price, NOW(), NOW())
            ");
            $stmt->execute([
                'id'    => $id,
                'code'  => $code,
                'name'  => $name,
                'cat'   => $category,
                'qty'   => $quantity,
                'price' => $unitPrice,
            ]);

            jsonResponse(['success' => true, 'message' => 'Item de stock adicionado com sucesso.', 'data' => ['id' => $id, 'code' => $code]], 201);
        } catch (Exception $e) {
            jsonError('Erro ao adicionar item de stock: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /stock.", 405);
}
