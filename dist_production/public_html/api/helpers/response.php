<?php
declare(strict_types=1);

/**
 * Funções Auxiliares de Resposta JSON e Input
 * ERP N'Tandinho Transportes S.A.
 */

if (!function_exists('jsonResponse')) {
    function jsonResponse(array $data, int $statusCode = 200): void {
        if (headers_sent()) {
            echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            exit;
        }

        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');

        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}

if (!function_exists('jsonError')) {
    function jsonError(string $message, int $statusCode = 400, ?array $extra = null): void {
        $response = [
            'success' => false,
            'error'   => $message,
        ];
        if ($extra !== null) {
            $response = array_merge($response, $extra);
        }
        jsonResponse($response, $statusCode);
    }
}

if (!function_exists('getJsonInput')) {
    function getJsonInput(): array {
        $raw = file_get_contents('php://input');
        if (empty($raw)) {
            return $_POST ?: [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : ($_POST ?: []);
    }
}

if (!function_exists('generateUuid')) {
    function generateUuid(): string {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // version 4
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // variant RFC 4122
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}
