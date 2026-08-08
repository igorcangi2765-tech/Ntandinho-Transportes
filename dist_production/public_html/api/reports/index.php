<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Reports Handler
 * GET /api/admin/reports
 */

function handleReports(): void {
    requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'GET') {
        try {
            $reportType = trim((string)($_GET['type'] ?? 'monthly_summary'));

            $data = [
                'type' => $reportType,
                'period' => date('Y-m'),
                'generatedAt' => date('c'),
                'summary' => [
                    'totalTrips' => 142,
                    'totalVolumeTons' => 4520,
                    'grossRevenueMZN' => 6100000,
                    'operatingExpensesMZN' => 2450000,
                    'netIncomeMZN' => 3650000,
                ]
            ];

            jsonResponse(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            jsonError('Erro ao gerar relatório: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /reports.", 405);
}
