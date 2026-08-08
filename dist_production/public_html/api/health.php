<?php
declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/helpers/response.php';

/**
 * Health Check Endpoint
 * GET /api/health & GET /api/public/health
 */

function handleHealthCheck(): void {
    try {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT 1");
        $stmt->fetch();

        jsonResponse([
            'status'    => 'ok',
            'server'    => 'php',
            'database'  => 'connected',
            'timestamp' => date('c'),
        ], 200);

    } catch (Exception $e) {
        jsonResponse([
            'status'    => 'error',
            'server'    => 'php',
            'database'  => 'disconnected',
            'error'     => 'Falha na ligação à base de dados MySQL: ' . $e->getMessage(),
            'timestamp' => date('c'),
        ], 503);
    }
}
