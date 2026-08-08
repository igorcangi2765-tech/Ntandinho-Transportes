<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Settings Handler
 * GET /api/admin/settings
 * PUT /api/admin/settings
 */

function handleSettings(): void {
    requireAuth(['ADMIN']);
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'GET') {
        try {
            $stmt = $db->query("SELECT * FROM settings");
            $rows = $stmt->fetchAll();
            $settings = [];
            foreach ($rows as $r) {
                $settings[$r['key']] = $r['value'];
            }

            if (empty($settings)) {
                $settings = [
                    'company_name' => "N' Tandinho Transportes S.A.",
                    'nuit' => '400192834',
                    'currency' => 'MZN',
                    'tax_rate_percent' => '16.0',
                    'support_email' => 'suporte@ntandinho.co.mz',
                ];
            }

            jsonResponse(['success' => true, 'data' => $settings]);
        } catch (Exception $e) {
            jsonError('Erro ao consultar configurações: ' . $e->getMessage(), 500);
        }
    }

    if ($method === 'PUT' || $method === 'POST') {
        $input = getJsonInput();
        try {
            $stmt = $db->prepare("
                INSERT INTO settings (id, key, value, updatedAt)
                VALUES (:id, :key, :val, NOW())
                ON DUPLICATE KEY UPDATE value = :val, updatedAt = NOW()
            ");
            foreach ($input as $key => $val) {
                $stmt->execute([
                    'id'  => generateUuid(),
                    'key' => (string)$key,
                    'val' => is_scalar($val) ? (string)$val : json_encode($val),
                ]);
            }

            jsonResponse(['success' => true, 'message' => 'Configurações atualizadas com sucesso.']);
        } catch (Exception $e) {
            jsonError('Erro ao atualizar configurações: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /settings.", 405);
}
