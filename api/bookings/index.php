<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Bookings Handler
 * GET /api/admin/bookings
 * POST /api/admin/bookings
 */

function handleBookings(): void {
    requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'GET') {
        try {
            $stmt = $db->query("SELECT * FROM bookings ORDER BY createdAt DESC");
            $bookings = $stmt->fetchAll();
            jsonResponse(['success' => true, 'data' => $bookings, 'total' => count($bookings)]);
        } catch (Exception $e) {
            jsonError('Erro ao consultar reservas: ' . $e->getMessage(), 500);
        }
    }

    if ($method === 'POST') {
        $input = getJsonInput();
        $origin = trim((string)($input['origin'] ?? ''));
        $destination = trim((string)($input['destination'] ?? ''));
        $cargoDetails = trim((string)($input['cargoDetails'] ?? ''));
        $totalPrice = (float)($input['totalPrice'] ?? 0);

        if (empty($origin) || empty($destination)) {
            jsonError('Campos obrigatórios: origin, destination.', 400);
        }

        try {
            $id = generateUuid();
            $bookingNumber = 'RES-2026-' . rand(100, 999);
            $stmt = $db->prepare("
                INSERT INTO bookings (id, bookingNumber, origin, destination, cargoDetails, scheduledDate, status, totalPrice, createdAt, updatedAt)
                VALUES (:id, :bNo, :orig, :dest, :cargo, NOW(), 'PENDENTE', :price, NOW(), NOW())
            ");
            $stmt->execute([
                'id'    => $id,
                'bNo'   => $bookingNumber,
                'orig'  => $origin,
                'dest'  => $destination,
                'cargo' => $cargoDetails,
                'price' => $totalPrice,
            ]);

            jsonResponse(['success' => true, 'message' => 'Reserva criada com sucesso.', 'data' => ['id' => $id, 'bookingNumber' => $bookingNumber]], 201);
        } catch (Exception $e) {
            jsonError('Erro ao criar reserva: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /bookings.", 405);
}
