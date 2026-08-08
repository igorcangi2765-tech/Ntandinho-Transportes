<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Notifications Handler
 * GET /api/admin/notifications
 */

function handleNotifications(): void {
    $user = requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'GET') {
        try {
            $stmt = $db->prepare("SELECT * FROM notifications WHERE userId = :uId OR userId IS NULL ORDER BY createdAt DESC LIMIT 20");
            $stmt->execute(['uId' => $user['id']]);
            $notifications = $stmt->fetchAll();

            if (empty($notifications)) {
                $notifications = [
                    [
                        'id' => 'notif_01',
                        'title' => 'Manutenção Agendada',
                        'message' => 'O veículo ABM-849-MC tem revisão agendada para os 125,000 km.',
                        'type' => 'WARNING',
                        'isRead' => false,
                        'createdAt' => date('c')
                    ]
                ];
            }

            jsonResponse(['success' => true, 'data' => $notifications, 'total' => count($notifications)]);
        } catch (Exception $e) {
            jsonError('Erro ao consultar notificações: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /notifications.", 405);
}
