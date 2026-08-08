<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Endpoint POST /api/admin/auth/login
 * Autenticação de Administradores e Utilizadores ERP N'Tandinho
 */

function handleLogin(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonError('O método HTTP ' . $_SERVER['REQUEST_METHOD'] . ' não é permitido. Utilize POST.', 405);
    }

    $input = getJsonInput();
    $email = strtolower(trim((string)($input['email'] ?? '')));
    $password = (string)($input['password'] ?? '');

    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

    if (empty($email) || empty($password)) {
        jsonError('Por favor forneça e-mail e palavra-passe.', 400, [
            'userFound'      => false,
            'passwordValid'  => false,
            'sessionCreated' => false,
            'tokenCreated'   => false,
            'failureReason'  => 'Campos de e-mail ou palavra-passe ausentes no corpo da requisição.'
        ]);
    }

    $db = Database::getConnection();

    try {
        $stmt = $db->prepare("
            SELECT u.*, r.name as role_name
            FROM users u
            LEFT JOIN roles r ON u.roleId = r.id
            WHERE LOWER(u.email) = :email
              AND u.deletedAt IS NULL
            LIMIT 1
        ");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if (!$user) {
            jsonError("Credenciais de acesso incorretas.", 401, [
                'userFound' => false,
                'failureReason' => 'Credenciais incorretas ou utilizador inexistente.'
            ]);
        }

        if (empty($user['isActive'])) {
            jsonError("A conta de acesso associada a '{$email}' encontra-se inativa ou desativada.", 401, [
                'userFound' => true,
                'failureReason' => 'Conta inativa.'
            ]);
        }

        // Verificação de Palavra-Passe com bcrypt (password_verify)
        $isPlainTextMatch = ($user['password'] === $password);
        $isValidPassword = $isPlainTextMatch || password_verify($password, $user['password']);

        if (!$isValidPassword) {
            jsonError("A palavra-passe introduzida para '{$email}' está incorreta.", 401, [
                'userFound'     => true,
                'passwordValid' => false,
                'failureReason' => 'Palavra-passe incorreta.'
            ]);
        }

        // Se a palavra-passe estava em texto limpo no banco de dados, converte-a para hash bcrypt
        if ($isPlainTextMatch) {
            $newHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
            $updateStmt = $db->prepare("UPDATE users SET password = :hash WHERE id = :id");
            $updateStmt->execute(['hash' => $newHash, 'id' => $user['id']]);
        }

        // Gerar Tokens de Acesso & Refresh
        $accessToken = generateUuid();
        $refreshToken = generateUuid();
        $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));

        // Criar Registo de Sessão na Base de Dados (`sessions`)
        $sessionCreated = false;
        try {
            $sessStmt = $db->prepare("
                INSERT INTO sessions (id, userId, token, refreshToken, ipAddress, userAgent, expiresAt, revoked, createdAt)
                VALUES (:id, :userId, :token, :refreshToken, :ipAddress, :userAgent, :expiresAt, 0, NOW())
            ");
            $sessStmt->execute([
                'id'           => generateUuid(),
                'userId'       => $user['id'],
                'token'        => $accessToken,
                'refreshToken' => $refreshToken,
                'ipAddress'    => $ipAddress,
                'userAgent'    => $userAgent,
                'expiresAt'    => $expiresAt,
            ]);
            $sessionCreated = true;
        } catch (Exception $sessErr) {
            // Ignorar erro se tabela de sessões não bloquear o login
        }

        // Iniciar Sessão nativa em PHP com cookies seguros
        if (session_status() === PHP_SESSION_NONE) {
            $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['SERVER_PORT'] ?? 80) == 443;
            session_set_cookie_params([
                'lifetime' => 86400 * 7,
                'path'     => '/',
                'domain'   => '',
                'secure'   => $isHttps,
                'httponly' => true,
                'samesite' => 'Lax'
            ]);
            @session_start();
        }

        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $user['role_name'] ?: 'ADMIN';

        // Registar AuditLog na Base de Dados
        try {
            $auditStmt = $db->prepare("
                INSERT INTO audit_logs (id, userId, action, entity, entityId, details, ipAddress, createdAt)
                VALUES (:id, :userId, 'LOGIN', 'USER', :entityId, 'Login efetuado com sucesso via API PHP', :ipAddress, NOW())
            ");
            $auditStmt->execute([
                'id'       => generateUuid(),
                'userId'   => $user['id'],
                'entityId' => $user['id'],
                'ipAddress'=> $ipAddress,
            ]);
        } catch (Exception $auditErr) {
            // Ignorar se audit logs falhar
        }

        jsonResponse([
            'success'        => true,
            'endpoint'       => '/api/admin/auth/login',
            'userFound'      => true,
            'passwordValid'  => true,
            'sessionCreated' => $sessionCreated,
            'tokenCreated'   => true,
            'user' => [
                'id'          => $user['id'],
                'email'       => $user['email'],
                'name'        => $user['name'],
                'role'        => $user['role_name'] ?: 'ADMIN',
                'permissions' => ['*:*']
            ],
            'tokens' => [
                'accessToken'  => $accessToken,
                'refreshToken' => $refreshToken,
            ]
        ], 200);

    } catch (Exception $e) {
        jsonError("Erro interno durante a verificação de login: " . $e->getMessage(), 500);
    }
}
