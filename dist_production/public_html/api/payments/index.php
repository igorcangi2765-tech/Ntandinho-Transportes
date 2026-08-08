<?php
declare(strict_types=1);

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

/**
 * Finance Payments Handler
 * POST /api/admin/finance/payments
 */

function handlePayments(): void {
    requireAuth();
    $method = $_SERVER['REQUEST_METHOD'];
    $db = Database::getConnection();

    if ($method === 'POST') {
        $input = getJsonInput();
        $invoiceId = trim((string)($input['invoiceId'] ?? ''));
        $amount = (float)($input['amount'] ?? 0);
        $paymentMethod = trim((string)($input['paymentMethod'] ?? 'TRANSFERENCIA_BANCARIA'));
        $referenceNo = trim((string)($input['referenceNo'] ?? ''));
        $notes = trim((string)($input['notes'] ?? ''));

        if (empty($invoiceId) || $amount <= 0 || empty($paymentMethod)) {
            jsonError('Campos obrigatórios: invoiceId, amount, paymentMethod.', 400);
        }

        try {
            $db->beginTransaction();

            $paymentId = generateUuid();
            $paymentNumber = 'REC-2026-' . rand(100, 999);

            // 1. Registar Pagamento
            $stmt = $db->prepare("
                INSERT INTO payments (id, paymentNumber, invoiceId, amount, paymentMethod, referenceNo, notes, paidAt, createdAt)
                VALUES (:id, :pNo, :invId, :amt, :method, :ref, :notes, NOW(), NOW())
            ");
            $stmt->execute([
                'id'     => $paymentId,
                'pNo'    => $paymentNumber,
                'invId'  => $invoiceId,
                'amt'    => $amount,
                'method' => $paymentMethod,
                'ref'    => $referenceNo ?: null,
                'notes'  => $notes ?: null,
            ]);

            // 2. Atualizar estado da Fatura
            $invStmt = $db->prepare("SELECT totalAmount, paidAmount FROM invoices WHERE id = :id LIMIT 1");
            $invStmt->execute(['id' => $invoiceId]);
            $inv = $invStmt->fetch();

            if ($inv) {
                $newPaid = (float)$inv['paidAmount'] + $amount;
                $tot = (float)$inv['totalAmount'];
                $newStatus = ($newPaid >= $tot) ? 'PAGO' : (($newPaid > 0) ? 'PAGO_PARCIAL' : 'PENDENTE');

                $uInv = $db->prepare("UPDATE invoices SET paidAmount = :paid, status = :st WHERE id = :id");
                $uInv->execute(['paid' => $newPaid, 'st' => $newStatus, 'id' => $invoiceId]);
            }

            $db->commit();

            jsonResponse([
                'success' => true,
                'message' => 'Recibo de pagamento registado com sucesso.',
                'data'    => [
                    'id'            => $paymentId,
                    'paymentNumber' => $paymentNumber,
                    'invoiceId'     => $invoiceId,
                    'amount'        => $amount,
                    'paymentMethod' => $paymentMethod,
                    'referenceNo'   => $referenceNo,
                ]
            ], 201);

        } catch (Exception $e) {
            if ($db->inTransaction()) $db->rollBack();
            jsonError('Erro ao registar pagamento: ' . $e->getMessage(), 500);
        }
    }

    jsonError("Método {$method} não permitido em /finance/payments.", 405);
}
