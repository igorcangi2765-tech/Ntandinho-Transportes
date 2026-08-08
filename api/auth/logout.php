<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Endpoint POST /api/admin/auth/logout
 * Encerra a sessão ativa do utilizador no ERP
 */

function handleLogout(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonError('O método HTTP ' . $_SERVER['REQUEST_METHOD'] . ' não é permitido. Utilize POST.', 405);
    }

    $user = getAuthUser();

    if ($user && isset($user['id'])) {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("UPDATE sessions SET revoked = 1 WHERE userId = :userId");
            $stmt->execute(['userId' => $user['id']]);
        } catch (Exception $e) {
            // Ignora falha de BD no encerramento de sessão
        }
    }

    if (session_status() === PHP_SESSION_NONE) {
        @session_start();
    }
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    @session_destroy();

    jsonResponse([
        'success' => true,
        'message' => 'Sessão encerrada com sucesso.'
    ], 200);
}
