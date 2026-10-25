<?php
// C:/laragon/www/on-shop/api/buyer/get_shop_profile.php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once '../../config/database.php';

$shopId = isset($_GET['shop_id']) ? (int)$_GET['shop_id'] : (isset($_GET['id']) ? (int)$_GET['id'] : 0);

if (!$shopId) {
    echo json_encode(["status" => false, "message" => "ID Toko tidak valid."]);
    exit;
}

try {
    // 1. Ambil Profil Toko
    $stmtShop = $conn->prepare("
        SELECT 
            s.shop_id, 
            s.user_id, 
            s.shop_name, 
            s.description, 
            s.logo_url, 
            s.pickup_city, 
            s.status, 
            s.is_official,
            u.name AS owner_name
        FROM shops s
        JOIN users u ON u.user_id = s.user_id
        WHERE s.shop_id = :sid
        LIMIT 1
    ");
    $stmtShop->execute(['sid' => $shopId]);
    $shop = $stmtShop->fetch(PDO::FETCH_ASSOC);

    if (!$shop) {
        echo json_encode(["status" => false, "message" => "Toko tidak ditemukan."]);
        exit;
    }

    // 2. Ambil Semua Produk Milik Toko Ini
    $stmtProducts = $conn->prepare("
        SELECT 
            p.product_id,
            p.name,
            p.category_id,
            p.is_pinned,
            COALESCE(
                (SELECT price FROM product_variants WHERE product_id = p.product_id ORDER BY price ASC LIMIT 1),
                0
            ) AS price,
            COALESCE(
                (SELECT image_url FROM product_images WHERE product_id = p.product_id ORDER BY is_primary DESC, sort_order ASC LIMIT 1),
                'https://placehold.co/300x300/e2e8f0/333333?text=Produk'
            ) AS image_url
        FROM products p
        WHERE p.shop_id = :sid AND p.is_archived = 0
        ORDER BY p.is_pinned DESC, p.product_id DESC
    ");
    $stmtProducts->execute(['sid' => $shopId]);
    $products = $stmtProducts->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => true,
        "data" => [
            "shop" => $shop,
            "products" => $products
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => false, "message" => "Database Error: " . $e->getMessage()]);
}
?>