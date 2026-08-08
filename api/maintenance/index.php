<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Maintenance Handler
 * GET /api/admin/maintenance
 * POST /api/admin/maintenance
 */

function handleMaintenance(): void {
    requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'GET') {
        try {
            $stmt = $db->query("
                SELECT m.*, v.plateNumber as vehiclePlate, v.make as vehicleMake, v.model as vehicleModel
                FROM maintenances m
                LEFT JOIN vehicles v ON m.vehicleId = v.id
                ORDER BY m.createdAt DESC
            ");
            $maintenances = $stmt->fetchAll();
            jsonResponse(['success' => true, 'data' => $maintenances, 'total' => count($maintenances)]);
        } catch (Exception $e) {
            jsonError('Erro ao listar manutenções: ' . $e->getMessage(), 500);
        }
    }

    if ($method === 'POST') {
        $input = getJsonInput();
        $vehicleId = trim((string)($input['vehicleId'] ?? ''));
        $description = trim((string)($input['description'] ?? ''));
        $cost = (float)($input['cost'] ?? 0);
        $workshop = trim((string)($input['workshop'] ?? ''));

        if (empty($vehicleId) || empty($description) || $cost <= 0) {
            jsonError('Campos obrigatórios: vehicleId, description, cost.', 400);
        }

        try {
            $id = generateUuid();
            $stmt = $db->prepare("
                INSERT INTO maintenances (id, vehicleId, description, cost, status, scheduledDate, workshop, createdAt, updatedAt)
                VALUES (:id, :vId, :desc, :cost, 'AGENDADO', NOW(), :shop, NOW(), NOW())
            ");
            $stmt->execute([
                'id'   => $id,
                'vId'  => $vehicleId,
                'desc' => $description,
                'cost' => $cost,
                'shop' => $workshop ?: null,
            ]);

            jsonResponse(['success' => true, 'message' => 'Manutenção agendada com sucesso.', 'data' => ['id' => $id, 'cost' => $cost]], 201);
        } catch (Exception $e) {
            jsonError('Erro ao agendar manutenção: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /maintenance.", 405);
}
