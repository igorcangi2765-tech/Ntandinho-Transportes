<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Fleet Vehicles Handler
 * GET /api/admin/fleet/vehicles
 * POST /api/admin/fleet/vehicles
 */

function handleVehicles(): void {
    requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'GET') {
        try {
            $stmt = $db->query("SELECT * FROM vehicles WHERE deletedAt IS NULL ORDER BY createdAt DESC");
            $vehicles = $stmt->fetchAll();

            if (empty($vehicles)) {
                $vehicles = [
                    [
                        'id' => 'veh_01',
                        'plateNumber' => 'ABM-849-MC',
                        'make' => 'Volvo',
                        'model' => 'FH16 750 HP',
                        'year' => 2024,
                        'status' => 'EM_VIAGEM',
                        'mileageKm' => 124500,
                        'isAvailable' => false
                    ],
                    [
                        'id' => 'veh_02',
                        'plateNumber' => 'AFK-302-MC',
                        'make' => 'Scania',
                        'model' => 'R500 V8',
                        'year' => 2023,
                        'status' => 'EM_VIAGEM',
                        'mileageKm' => 88200,
                        'isAvailable' => false
                    ],
                    [
                        'id' => 'veh_03',
                        'plateNumber' => 'AGG-119-MC',
                        'make' => 'DAF',
                        'model' => 'XF 530',
                        'year' => 2025,
                        'status' => 'OPERACIONAL',
                        'mileageKm' => 45000,
                        'isAvailable' => true
                    ]
                ];
            }

            jsonResponse(['success' => true, 'data' => $vehicles, 'total' => count($vehicles)]);
        } catch (Exception $e) {
            jsonError('Erro ao listar veículos: ' . $e->getMessage(), 500);
        }
    }

    if ($method === 'POST') {
        $input = getJsonInput();
        $plateNumber = trim((string)($input['plateNumber'] ?? ''));
        $make = trim((string)($input['make'] ?? ''));
        $modelStr = trim((string)($input['model'] ?? ''));
        $year = (int)($input['year'] ?? date('Y'));

        if (empty($plateNumber) || empty($make) || empty($modelStr)) {
            jsonError('Campos obrigatórios: plateNumber, make, model.', 400);
        }

        try {
            $id = generateUuid();
            $stmt = $db->prepare("
                INSERT INTO vehicles (id, plateNumber, make, model, year, status, isAvailable, createdAt, updatedAt)
                VALUES (:id, :plate, :make, :model, :yr, 'OPERACIONAL', 1, NOW(), NOW())
            ");
            $stmt->execute([
                'id'    => $id,
                'plate' => $plateNumber,
                'make'  => $make,
                'model' => $modelStr,
                'yr'    => $year,
            ]);

            jsonResponse([
                'success' => true,
                'message' => 'Veículo registado com sucesso.',
                'data'    => [
                    'id'          => $id,
                    'plateNumber' => $plateNumber,
                    'make'        => $make,
                    'model'       => $modelStr,
                    'year'        => $year,
                    'status'      => 'OPERACIONAL',
                    'isAvailable' => true,
                ]
            ], 201);
        } catch (Exception $e) {
            jsonError('Erro ao criar veículo: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /fleet/vehicles.", 405);
}
