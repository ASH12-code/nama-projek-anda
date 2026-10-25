<?php
// C:/laragon/www/on-shop/api/buyer/auth_login.php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once '../../config/database.php';

$input = json_decode(file_get_contents("php://input"), true);

$username = isset($input['username']) ? trim($input['username']) : '';
$password = isset($input['password']) ? trim($input['password']) : '';

if (empty($username) || empty($password)) {
    echo json_encode(["status" => false, "message" => "Kontak/Email dan Password wajib diisi!"]);
    exit;
}

try {
    // Cari pengguna berdasarkan email, nomor hp, atau kode user
    $sql = "SELECT user_id, user_code, name, email, phone, password, role, has_shop, is_banned, banned_reason 
            FROM users 
            WHERE email = :u OR phone = :u OR user_code = :u 
            LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['u' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["status" => false, "message" => "Akun tidak ditemukan!"]);
        exit;
    }

    // Cek apakah akun sedang diblokir oleh Admin
    if (!empty($user['is_banned']) && (int)$user['is_banned'] === 1) {
        $reason = !empty($user['banned_reason']) ? $user['banned_reason'] : "Pelanggaran pedoman layanan.";
        echo json_encode(["status" => false, "message" => "Akun Anda ditangguhkan: " . $reason]);
        exit;
    }

    // Verifikasi password (mendukung kecocokan teks langsung maupun enkripsi hash)
    $isPasswordMatch = ($password === $user['password']) || password_verify($password, $user['password']);

    if (!$isPasswordMatch) {
        echo json_encode(["status" => false, "message" => "Password yang Anda masukkan salah!"]);
        exit;
    }

    // 1. Kunci Identitas Pengguna di Sesi Server PHP
    $_SESSION['user_id']   = (int)$user['user_id'];
    $_SESSION['role']      = $user['role'];
    $_SESSION['has_shop']  = (int)$user['has_shop'];

    // 2. Kunci Data Toko jika akun sudah memiliki toko aktif
    $stmtShop = $conn->prepare("SELECT shop_id, shop_name FROM shops WHERE user_id = :uid LIMIT 1");
    $stmtShop->execute(['uid' => $user['user_id']]);
    $shop = $stmtShop->fetch(PDO::FETCH_ASSOC);

    if ($shop) {
        $_SESSION['shop_id']   = (int)$shop['shop_id'];
        $_SESSION['shop_name'] = $shop['shop_name'];
        $user['shop_id']       = (int)$shop['shop_id'];
        $user['shop_name']     = $shop['shop_name'];
    } else {
        unset($_SESSION['shop_id']);
        unset($_SESSION['shop_name']);
        $user['shop_id']       = null;
        $user['shop_name']     = null;
    }

    unset($user['password']); // Hapus password dari objek sebelum dikirim ke frontend

    // 3. Tentukan Arah Redirect (Admin ke Dasbor Super Admin, selain itu ke Halaman Pembeli)
    $redirectUrl = "../buyer/index.html";
    if (strtolower($user['role'] ?? '') === 'admin') {
        $redirectUrl = "../admin/index.html";
    }

    echo json_encode([
        "status"   => true,
        "message"  => "Login berhasil!",
        "redirect" => $redirectUrl,
        "user"     => $user
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => false, "message" => "Database Error: " . $e->getMessage()]);
}
?>