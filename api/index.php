<?php
declare(strict_types=1);

/**
 * Main Entry Point & Router for PHP 8.3 Backend API
 * ERP N'Tandinho Transportes S.A.
 */

// Desativar a apresentação direta de erros HTML para garantir que a resposta seja SEMPRE JSON
ini_set('display_errors', '0');
error_reporting(E_ALL);

require_once __DIR__ . '/middleware/cors.php';
require_once __DIR__ . '/helpers/response.php';

// Tratar CORS antes de qualquer lógica
handleCors();

// Manipulador global de exceções para garantir formato 100% JSON
set_exception_handler(function (Throwable $e) {
    jsonResponse([
        'success'   => false,
        'endpoint'  => $_SERVER['REQUEST_URI'] ?? '/api',
        'error'     => 'Erro interno no servidor API PHP: ' . $e->getMessage(),
        'details'   => $e->getMessage(),
        'timestamp' => date('c'),
    ], 500);
});

// Registrar erro fatal para capturar qualquer shutdown incompleto
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        jsonResponse([
            'success'  => false,
            'endpoint' => $_SERVER['REQUEST_URI'] ?? '/api',
            'error'    => 'Erro crítico de execução PHP.',
            'details'  => $error['message'],
        ], 500);
    }
});

// Normalização do caminho da requisição
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

// Remover o prefixo /api caso presente para facilitar a correspondência de rotas
$path = preg_replace('#^/api#', '', $uri);
if (empty($path)) {
    $path = '/';
}

// ------------------------------------------------------------------
// ROUTING DISPATCHER
// ------------------------------------------------------------------

// 1. Healthcheck Endpoints
if ($path === '/health' || $path === '/public/health' || $path === '/admin/health' || $path === '/') {
    require_once __DIR__ . '/health.php';
    handleHealthCheck();
}

// 2. Public Endpoints
if ($path === '/public/quote-request') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = getJsonInput();
        jsonResponse([
            'success' => true,
            'message' => 'Solicitação de cotação recebida com sucesso.',
            'data'    => $input
        ], 201);
    } else {
        jsonError('Utilize POST para solicitar cotações.', 405);
    }
}

// 3. Autenticação Admin
if ($path === '/admin/auth/login' || $path === '/auth/login') {
    require_once __DIR__ . '/auth/login.php';
    handleLogin();
}

if ($path === '/admin/auth/me' || $path === '/auth/me') {
    require_once __DIR__ . '/auth/me.php';
    handleAuthMe();
}

if ($path === '/admin/auth/logout' || $path === '/auth/logout') {
    require_once __DIR__ . '/auth/logout.php';
    handleLogout();
}

// 4. CRM (Clientes & Cotações)
if (strpos($path, '/crm/customers') !== false || strpos($path, '/customers') !== false) {
    require_once __DIR__ . '/customers/index.php';
    handleCustomers();
}

if (strpos($path, '/crm/quotations') !== false || strpos($path, '/quotations') !== false) {
    require_once __DIR__ . '/quotations/index.php';
    handleQuotations();
}

// 5. Frota (Viagens, Veículos, Motoristas)
if (strpos($path, '/fleet/trips') !== false || strpos($path, '/trips') !== false) {
    require_once __DIR__ . '/trips/index.php';
    handleTrips();
}

if (strpos($path, '/fleet/vehicles') !== false || strpos($path, '/vehicles') !== false) {
    require_once __DIR__ . '/vehicles/index.php';
    handleVehicles();
}

if (strpos($path, '/fleet/drivers') !== false || strpos($path, '/drivers') !== false) {
    require_once __DIR__ . '/drivers/index.php';
    handleDrivers();
}

// 6. Finanças (Faturas, Pagamentos, Resumo)
if (strpos($path, '/finance/invoices') !== false || strpos($path, '/invoices') !== false) {
    require_once __DIR__ . '/invoices/index.php';
    handleInvoices();
}

if (strpos($path, '/finance/payments') !== false || strpos($path, '/payments') !== false) {
    require_once __DIR__ . '/payments/index.php';
    handlePayments();
}

if (strpos($path, '/finance/summary') !== false || strpos($path, '/summary') !== false) {
    require_once __DIR__ . '/finance/summary.php';
    handleFinanceSummary();
}

// 7. Analytics & Audit Logs
if (strpos($path, '/analytics') !== false) {
    require_once __DIR__ . '/analytics/index.php';
    handleAnalytics();
}

// 8. Reservas, Rotas, Despesas, Manutenção, Stock, Notificações, Relatórios, Definições
if (strpos($path, '/bookings') !== false) {
    require_once __DIR__ . '/bookings/index.php';
    handleBookings();
}

if (strpos($path, '/routes') !== false) {
    require_once __DIR__ . '/routes/index.php';
    handleRoutes();
}

if (strpos($path, '/expenses') !== false) {
    require_once __DIR__ . '/expenses/index.php';
    handleExpenses();
}

if (strpos($path, '/maintenance') !== false) {
    require_once __DIR__ . '/maintenance/index.php';
    handleMaintenance();
}

if (strpos($path, '/stock') !== false) {
    require_once __DIR__ . '/stock/index.php';
    handleStock();
}

if (strpos($path, '/notifications') !== false) {
    require_once __DIR__ . '/notifications/index.php';
    handleNotifications();
}

if (strpos($path, '/reports') !== false) {
    require_once __DIR__ . '/reports/index.php';
    handleReports();
}

if (strpos($path, '/settings') !== false) {
    require_once __DIR__ . '/settings/index.php';
    handleSettings();
}

// Fallback 404 Exclusivo da API (Nunca devolve HTML!)
jsonResponse([
    'success'       => false,
    'endpoint'      => $uri,
    'error'         => "Endpoint '{$uri}' não encontrado na API PHP.",
    'failureReason' => "A rota '{$_SERVER['REQUEST_METHOD']} {$uri}' não está registada na API."
], 404);
