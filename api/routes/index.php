<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Routes Handler
 * GET /api/admin/routes
 * POST /api/admin/routes
 */

function handleRoutes(): void {
    requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'GET') {
        try {
            $stmt = $db->query("SELECT * FROM routes ORDER BY createdAt DESC");
            $routes = $stmt->fetchAll();
            jsonResponse(['success' => true, 'data' => $routes, 'total' => count($routes)]);
        } catch (Exception $e) {
            jsonError('Erro ao listar rotas: ' . $e->getMessage(), 500);
        }
    }

    if ($method === 'POST') {
        $input = getJsonInput();
        $name = trim((string)($input['name'] ?? ''));
        $origin = trim((string)($input['origin'] ?? ''));
        $destination = trim((string)($input['destination'] ?? ''));
        $distanceKm = (float)($input['distanceKm'] ?? 0);
        $estDurationHours = (float)($input['estDurationHours'] ?? 0);

        if (empty($name) || empty($origin) || empty($destination)) {
            jsonError('Campos obrigatórios: name, origin, destination.', 400);
        }

        try {
            $id = generateUuid();
            $stmt = $db->prepare("
                INSERT INTO routes (id, name, origin, destination, distanceKm, estDurationHours, createdAt)
                VALUES (:id, :name, :orig, :dest, :dist, :dur, NOW())
            ");
            $stmt->execute([
                'id'   => $id,
                'name' => $name,
                'orig' => $origin,
                'dest' => $destination,
                'dist' => $distanceKm,
                'dur'  => $estDurationHours,
            ]);

            jsonResponse(['success' => true, 'message' => 'Rota adicionada com sucesso.', 'data' => ['id' => $id, 'name' => $name]], 201);
        } catch (Exception $e) {
            jsonError('Erro ao criar rota: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /routes.", 405);
}
