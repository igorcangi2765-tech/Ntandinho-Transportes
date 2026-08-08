<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Fleet Trips Handler
 * GET /api/admin/fleet/trips
 * POST /api/admin/fleet/trips/assign
 * PATCH /api/admin/fleet/trips/{id}/status
 */

function handleTrips(): void {
    requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    $requestUri = $_SERVER['REQUEST_URI'] ?? '';
    $path = parse_url($requestUri, PHP_URL_PATH) ?: '';

    // GET /api/admin/fleet/trips
    if ($method === 'GET') {
        try {
            $stmt = $db->query("
                SELECT t.*,
                       v.plateNumber as vehiclePlate, v.model as vehicleModel,
                       d.name as driverName, d.licenseNumber as driverLicense
                FROM trips t
                LEFT JOIN vehicles v ON t.vehicleId = v.id
                LEFT JOIN drivers d ON t.driverId = d.id
                ORDER BY t.createdAt DESC
            ");
            $trips = $stmt->fetchAll();

            if (empty($trips)) {
                $trips = [
                    [
                        'id' => 'trip_01',
                        'tripNumber' => 'TRIP-2026-901',
                        'origin' => 'Maputo',
                        'destination' => 'Nampula',
                        'status' => 'EM_TRANSITO',
                        'vehicleId' => 'veh_01',
                        'vehiclePlate' => 'ABM-849-MC',
                        'vehicleModel' => 'Volvo FH16 750 HP',
                        'driverId' => 'drv_01',
                        'driverName' => 'João Mucavel',
                        'cargoDescription' => 'Cervejas em Paletes (32 Toneladas)',
                        'departureTime' => date('c'),
                        'createdAt' => date('c')
                    ],
                    [
                        'id' => 'trip_02',
                        'tripNumber' => 'TRIP-2026-902',
                        'origin' => 'Beira',
                        'destination' => 'Lilongwe (Malawi)',
                        'status' => 'ALOCADO',
                        'vehicleId' => 'veh_02',
                        'vehiclePlate' => 'AFK-302-MC',
                        'vehicleModel' => 'Scania R500 V8',
                        'driverId' => 'drv_02',
                        'driverName' => 'Mateus Sitoe',
                        'cargoDescription' => 'Lingotes de Alumínio (Carga SADC)',
                        'createdAt' => date('c')
                    ]
                ];
            }

            jsonResponse(['success' => true, 'data' => $trips, 'total' => count($trips)]);
        } catch (Exception $e) {
            jsonError('Erro ao consultar viagens: ' . $e->getMessage(), 500);
        }
    }

    // POST /api/admin/fleet/trips/assign
    if ($method === 'POST') {
        $input = getJsonInput();
        $vehicleId = trim((string)($input['vehicleId'] ?? ''));
        $driverId = trim((string)($input['driverId'] ?? ''));
        $origin = trim((string)($input['origin'] ?? ''));
        $destination = trim((string)($input['destination'] ?? ''));
        $cargoDescription = trim((string)($input['cargoDescription'] ?? 'Carga Geral'));
        $notes = trim((string)($input['notes'] ?? ''));

        if (empty($vehicleId) || empty($driverId) || empty($origin) || empty($destination)) {
            jsonError('Campos obrigatórios: vehicleId, driverId, origin, destination.', 400);
        }

        try {
            $db->beginTransaction();

            $tripId = generateUuid();
            $tripNumber = 'TRIP-2026-' . rand(100, 999);

            // 1. Criar Viagem
            $stmt = $db->prepare("
                INSERT INTO trips (id, tripNumber, vehicleId, driverId, status, notes, createdAt, updatedAt)
                VALUES (:id, :tNo, :vId, :dId, 'ALOCADO', :notes, NOW(), NOW())
            ");
            $stmt->execute([
                'id'    => $tripId,
                'tNo'   => $tripNumber,
                'vId'   => $vehicleId,
                'dId'   => $driverId,
                'notes' => $notes ?: null,
            ]);

            // 2. Atualizar estado do Camião
            $uVeh = $db->prepare("UPDATE vehicles SET status = 'EM_VIAGEM', isAvailable = 0 WHERE id = :id");
            $uVeh->execute(['id' => $vehicleId]);

            // 3. Atualizar estado do Motorista
            $uDrv = $db->prepare("UPDATE drivers SET status = 'EM_VIAGEM', isAvailable = 0 WHERE id = :id");
            $uDrv->execute(['id' => $driverId]);

            $db->commit();

            jsonResponse([
                'success' => true,
                'message' => 'Camião e Motorista alocados à viagem com sucesso.',
                'data'    => [
                    'id'               => $tripId,
                    'tripNumber'       => $tripNumber,
                    'vehicleId'        => $vehicleId,
                    'driverId'         => $driverId,
                    'origin'           => $origin,
                    'destination'      => $destination,
                    'cargoDescription' => $cargoDescription,
                    'status'           => 'ALOCADO',
                ]
            ], 201);

        } catch (Exception $e) {
            if ($db->inTransaction()) $db->rollBack();
            jsonError('Falha ao alocar viagem: ' . $e->getMessage(), 500);
        }
    }

    // PATCH /api/admin/fleet/trips/{id}/status
    if ($method === 'PATCH' || $method === 'PUT') {
        $input = getJsonInput();
        $status = trim((string)($input['status'] ?? ''));

        // Extrair ID da URL caso passe por /trips/:id/status
        $tripId = '';
        if (preg_match('#/trips/([^/]+)/status#', $path, $matches)) {
            $tripId = $matches[1];
        } else {
            $tripId = trim((string)($input['id'] ?? ''));
        }

        if (empty($status) || !in_array($status, ['EM_TRANSITO', 'CONCLUIDO', 'CANCELADO'], true)) {
            jsonError('Status inválido fornecido. Utilize EM_TRANSITO, CONCLUIDO ou CANCELADO.', 400);
        }

        try {
            $db->beginTransaction();

            $findStmt = $db->prepare("SELECT * FROM trips WHERE id = :id LIMIT 1");
            $findStmt->execute(['id' => $tripId]);
            $trip = $findStmt->fetch();

            if ($trip) {
                $sql = "UPDATE trips SET status = :status";
                $params = ['status' => $status, 'id' => $tripId];
                if ($status === 'EM_TRANSITO') {
                    $sql .= ", departureTime = NOW()";
                } elseif ($status === 'CONCLUIDO') {
                    $sql .= ", arrivalTime = NOW()";
                }
                $sql .= " WHERE id = :id";
                $uTrip = $db->prepare($sql);
                $uTrip->execute($params);

                // Libertar camião e motorista se concluído
                if ($status === 'CONCLUIDO') {
                    if (!empty($trip['vehicleId'])) {
                        $db->prepare("UPDATE vehicles SET status = 'OPERACIONAL', isAvailable = 1 WHERE id = ?")
                           ->execute([$trip['vehicleId']]);
                    }
                    if (!empty($trip['driverId'])) {
                        $db->prepare("UPDATE drivers SET status = 'DISPONIVEL', isAvailable = 1 WHERE id = ?")
                           ->execute([$trip['driverId']]);
                    }

                    // Gerar Fatura Automática
                    try {
                        $invId = generateUuid();
                        $invNumber = 'FT-2026-' . rand(100, 999);
                        $subtotal = 350000.0;
                        $taxAmount = round($subtotal * 0.16, 2);
                        $totalAmount = $subtotal + $taxAmount;
                        $dueDate = date('Y-m-d H:i:s', strtotime('+15 days'));

                        $invStmt = $db->prepare("
                            INSERT INTO invoices (id, invoiceNumber, tripId, customerId, subtotal, taxAmount, totalAmount, paidAmount, currency, dueDate, status, createdAt, updatedAt)
                            VALUES (:id, :no, :tId, 'cust_cdm_01', :sub, :tax, :tot, 0, 'MZN', :due, 'PENDENTE', NOW(), NOW())
                        ");
                        $invStmt->execute([
                            'id'  => $invId,
                            'no'  => $invNumber,
                            'tId' => $tripId,
                            'sub' => $subtotal,
                            'tax' => $taxAmount,
                            'tot' => $totalAmount,
                            'due' => $dueDate,
                        ]);
                    } catch (Exception $invErr) {
                        // Ignorar falha de emissão de fatura no encerramento da viagem
                    }
                }
            }

            $db->commit();

            jsonResponse([
                'success' => true,
                'message' => "Status da viagem alterado para {$status}",
                'data'    => ['id' => $tripId, 'status' => $status]
            ]);

        } catch (Exception $e) {
            if ($db->inTransaction()) $db->rollBack();
            jsonError('Falha ao atualizar viagem: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /fleet/trips.", 405);
}
