<?php
// pages/seller/index.php
session_start();
require_once '../../config/database.php';

// 1. Tangani kompatibilitas nama variabel PDO ($conn vs $pdo)
$db = isset($conn) ? $conn : (isset($pdo) ? $pdo : null);

if (!$db) {
    http_response_code(500);
    die("Koneksi database gagal dimuat.");
}

// 2. Lapisan Pertama: Cek Autentikasi Pengguna
if (empty($_SESSION['user_id']) && !empty($_GET['auth_user_id'])) {
    $_SESSION['user_id'] = (int)$_GET['auth_user_id'];
}

if (empty($_SESSION['user_id'])) {
    // Belum login -> Arahkan ke halaman login pembeli
    header("Location: ../buyer/login.html?redirect=buka-toko.html");
    exit;
}

$user_id = (int)$_SESSION['user_id'];

try {
    // 3. Lapisan Kedua: Cek integritas toko langsung ke database via $db
    $stmt = $db->prepare("
        SELECT s.shop_id, s.shop_name, u.role, u.has_shop 
        FROM users u 
        LEFT JOIN shops s ON u.user_id = s.user_id 
        WHERE u.user_id = ?
        LIMIT 1
    ");
    $stmt->execute([$user_id]);
    $account = $stmt->fetch(PDO::FETCH_ASSOC);

    // Jika user belum memiliki toko di database
    if (!$account || empty($account['shop_id']) || (int)$account['has_shop'] === 0) {
        $_SESSION['has_shop'] = 0;
        unset($_SESSION['shop_id']);
        unset($_SESSION['shop_name']);

        // Arahkan ke formulir buka toko
        header("Location: ../buyer/buka-toko.html");
        exit;
    }

    // 4. Lapisan Ketiga: Kunci hak akses toko valid ke Session Server PHP
    $_SESSION['shop_id']   = (int)$account['shop_id'];
    $_SESSION['shop_name'] = $account['shop_name'];
    $_SESSION['role']      = 'seller';
    $_SESSION['has_shop']  = 1;

    // 5. Berhasil -> Arahkan ke halaman utama Katalog / Etalase Produk Seller yang valid
    header("Location: index.html");
    exit;

} catch (Exception $e) {
    http_response_code(500);
    echo "Terjadi kesalahan otorisasi keamanan: " . htmlspecialchars($e->getMessage());
    exit;
}
?>