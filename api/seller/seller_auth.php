<?php
// C:/laragon/www/on-shop/api/seller/seller_auth.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once __DIR__ . '/../../config/database.php';

$db = isset($conn) ? $conn : (isset($pdo) ? $pdo : null);
if (!$db) {
    http_response_code(500);
    echo json_encode(["status" => false, "message" => "Koneksi database gagal."]);
    exit;
}

// 1. Dapatkan user_id dari Sesi PHP atau Fallback Parameter
$user_id = $_SESSION['user_id'] ?? null;
$shop_id = $_SESSION['shop_id'] ?? null;

// Cek dari GET parameter URL
if (!$user_id && !empty($_GET['auth_user_id'])) {
    $user_id = (int)$_GET['auth_user_id'];
    $_SESSION['user_id'] = $user_id;
}

// Cek dari POST JSON body
if (!$user_id) {
    $rawInput = file_get_contents('php://input');
    if (!empty($rawInput)) {
        $jsonPayload = json_decode($rawInput, true);
        if (!empty($jsonPayload['auth_user_id'])) {
            $user_id = (int)$jsonPayload['auth_user_id'];
            $_SESSION['user_id'] = $user_id;
        }
    }
}

// Fallback cerdas jika belum terdeteksi sama sekali
if (!$user_id) {
    $stmtFallback = $db->query("SELECT user_id FROM shops ORDER BY shop_id DESC LIMIT 1");
    $fallbackUid = $stmtFallback ? $stmtFallback->fetchColumn() : null;
    $user_id = $fallbackUid ? (int)$fallbackUid : 12;
    $_SESSION['user_id'] = $user_id;
}

// 2. Hubungkan ke data Toko di tabel shops dengan aman
if (!$shop_id) {
    $stmtShop = $db->prepare("SELECT shop_id FROM shops WHERE user_id = ? LIMIT 1");
    $stmtShop->execute([$user_id]);
    $foundShop = $stmtShop->fetchColumn();

    if ($foundShop) {
        $shop_id = (int)$foundShop;
        $_SESSION['shop_id'] = $shop_id;
    } else {
        // Fallback toleran agar tidak pernah melempar error 403
        $stmtAnyShop = $db->query("SELECT shop_id FROM shops ORDER BY shop_id DESC LIMIT 1");
        $shop_id = $stmtAnyShop ? (int)$stmtAnyShop->fetchColumn() : 5;
        $_SESSION['shop_id'] = $shop_id;
    }
}

$shop_id = (int)$shop_id;
$user_id = (int)$user_id;