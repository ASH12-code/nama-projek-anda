<?php
// C:/laragon/www/on-shop/api/buyer/help_ticket.php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once '../../config/database.php';

$rawInput = file_get_contents("php://input");
$postData = json_decode($rawInput, true) ?: [];

// Ambil ID user dari request atau sesi
$userId = isset($postData['user_id']) ? (int)$postData['user_id'] : (isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0);
$category = isset($postData['category']) ? trim($postData['category']) : '';
$subject = isset($postData['subject']) ? trim($postData['subject']) : '';
$message = isset($postData['message']) ? trim($postData['message']) : '';

if (!$userId) {
    echo json_encode(["status" => false, "message" => "Sesi tidak valid. Silakan login terlebih dahulu."]);
    exit;
}

if (empty($category) || empty($subject) || empty($message)) {
    echo json_encode(["status" => false, "message" => "Harap lengkapi semua kolom laporan masalah!"]);
    exit;
}

try {
    $conn->beginTransaction();

    // Buat kode tiket unik (Contoh: TKT-202609-XXXX)
    $ticketCode = 'TKT-' . date('Ym') . '-' . strtoupper(substr(uniqid(), -4));

    // 1. Simpan ke tabel help_tickets
    $stmtTicket = $conn->prepare("
        INSERT INTO help_tickets (ticket_code, user_id, category, subject, priority, status, created_at)
        VALUES (:code, :uid, :cat, :subj, 'MEDIUM', 'OPEN', NOW())
    ");
    $stmtTicket->execute([
        'code' => $ticketCode,
        'uid'  => $userId,
        'cat'  => $category,
        'subj' => $subject
    ]);

    $ticketId = $conn->lastInsertId();

    // 2. Simpan pesan pertama ke tabel help_ticket_messages
    $stmtMsg = $conn->prepare("
        INSERT INTO help_ticket_messages (ticket_id, sender_id, message, created_at)
        VALUES (:tid, :sid, :msg, NOW())
    ");
    $stmtMsg->execute([
        'tid' => $ticketId,
        'sid' => $userId,
        'msg' => $message
    ]);

    $conn->commit();

    echo json_encode([
        "status" => true,
        "message" => "Laporan masalah berhasil dikirim ke Admin!",
        "ticket_code" => $ticketCode
    ]);
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode(["status" => false, "message" => "Database Error: " . $e->getMessage()]);
}
?>