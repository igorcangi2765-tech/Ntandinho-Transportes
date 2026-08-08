<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Endpoint GET /api/admin/auth/me
 * Retorna os dados do perfil do utilizador autenticado
 */

function handleAuthMe(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        jsonError('O método HTTP ' . $_SERVER['REQUEST_METHOD'] . ' não é permitido. Utilize GET.', 405);
    }

    $user = requireAuth();

    jsonResponse([
        'success' => true,
        'user'    => $user,
        'data'    => $user,
    ], 200);
}
