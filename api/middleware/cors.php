<?php
declare(strict_types=1);

/**
 * Middleware de Segurança CORS
 * ERP N'Tandinho Transportes S.A.
 */

function handleCors(): void {
    $allowedOrigins = [
        'https://ntandinho.zyphtech.com',
        'http://ntandinho.zyphtech.com',
        'http://localhost:5173',
        'http://localhost:5000',
        'http://localhost:3000',
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: {$origin}");
    } else {
        header("Access-Control-Allow-Origin: https://ntandinho.zyphtech.com");
    }

    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
