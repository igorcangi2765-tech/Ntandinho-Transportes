<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Middleware de Autenticação e Controlo de Acesso (RBAC)
 * ERP N'Tandinho Transportes S.A.
 */

function getAuthUser(): ?array {
    if (isset($GLOBALS['auth_user'])) {
        return $GLOBALS['auth_user'];
    }

    $token = null;
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!empty($authHeader) && strpos($authHeader, 'Bearer ') === 0) {
        $token = trim(substr($authHeader, 7));
    }

    $db = Database::getConnection();

    // 1. Tentar Autenticação via Token de Sessão (tabela `sessions`)
    if (!empty($token)) {
        try {
            $stmt = $db->prepare("
                SELECT s.*, u.id as user_id, u.email, u.name, u.isActive, u.deletedAt, r.name as role_name
                FROM sessions s
                JOIN users u ON s.userId = u.id
                LEFT JOIN roles r ON u.roleId = r.id
                WHERE (s.token = :t OR s.id = :t)
                  AND s.revoked = 0
                  AND s.expiresAt > NOW()
                LIMIT 1
            ");
            $stmt->execute(['t' => $token]);
            $sessionData = $stmt->fetch();

            if ($sessionData && $sessionData['isActive'] && empty($sessionData['deletedAt'])) {
                $user = [
                    'id'          => $sessionData['user_id'],
                    'email'       => $sessionData['email'],
                    'name'        => $sessionData['name'],
                    'role'        => $sessionData['role_name'] ?: 'ADMIN',
                    'permissions' => ['*:*']
                ];
                $GLOBALS['auth_user'] = $user;
                return $user;
            }
        } catch (Exception $e) {
            // Ignora falha temporária de BD em fallback
        }
    }

    // 2. Tentar Autenticação via PHP Native Session
    if (session_status() === PHP_SESSION_NONE) {
        @session_start();
    }

    if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) {
        try {
            $stmt = $db->prepare("
                SELECT u.id, u.email, u.name, u.isActive, u.deletedAt, r.name as role_name
                FROM users u
                LEFT JOIN roles r ON u.roleId = r.id
                WHERE u.id = :id
                LIMIT 1
            ");
            $stmt->execute(['id' => $_SESSION['user_id']]);
            $userData = $stmt->fetch();

            if ($userData && $userData['isActive'] && empty($userData['deletedAt'])) {
                $user = [
                    'id'          => $userData['id'],
                    'email'       => $userData['email'],
                    'name'        => $userData['name'],
                    'role'        => $userData['role_name'] ?: 'ADMIN',
                    'permissions' => ['*:*']
                ];
                $GLOBALS['auth_user'] = $user;
                return $user;
            }
        } catch (Exception $e) {
            // Ignorar falhas de sessão
        }
    }

    return null;
}

function requireAuth(array $allowedRoles = []): array {
    $user = getAuthUser();

    if (!$user) {
        jsonError('Não autorizado. Sessão expirada ou token ausente/inválido.', 401);
    }

    if (!empty($allowedRoles)) {
        if ($user['role'] !== 'ADMIN' && !in_array($user['role'], $allowedRoles, true)) {
            jsonError('Acesso negado. O seu perfil não possui permissão para aceder a este recurso.', 403, [
                'requiredRoles' => $allowedRoles,
                'userRole'      => $user['role'],
            ]);
        }
    }

    return $user;
}
