<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Fleet Drivers Handler
 * GET /api/admin/fleet/drivers
 */

function handleDrivers(): void {
    requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'GET') {
        try {
            $stmt = $db->query("SELECT * FROM drivers WHERE deletedAt IS NULL ORDER BY createdAt DESC");
            $drivers = $stmt->fetchAll();

            if (empty($drivers)) {
                $drivers = [
                    [
                        'id' => 'drv_01',
                        'name' => 'João Mucavel',
                        'licenseNumber' => 'C-901823',
                        'phone' => '+258 84 901 8822',
                        'status' => 'EM_VIAGEM',
                        'isAvailable' => false
                    ],
                    [
                        'id' => 'drv_02',
                        'name' => 'Mateus Sitoe',
                        'licenseNumber' => 'C-445129',
                        'phone' => '+258 82 445 1199',
                        'status' => 'EM_VIAGEM',
                        'isAvailable' => false
                    ],
                    [
                        'id' => 'drv_03',
                        'name' => 'Carlos Alberto',
                        'licenseNumber' => 'C-772910',
                        'phone' => '+258 84 772 9900',
                        'status' => 'DISPONIVEL',
                        'isAvailable' => true
                    ]
                ];
            }

            jsonResponse(['success' => true, 'data' => $drivers, 'total' => count($drivers)]);
        } catch (Exception $e) {
            jsonError('Erro ao listar motoristas: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /fleet/drivers.", 405);
}
