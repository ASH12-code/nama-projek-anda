<?php
// C:/laragon/www/on-shop/api/buyer/get_product_detail.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

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

$productId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($productId <= 0) {
    echo json_encode([
        "status"  => false,
        "message" => "ID produk tidak valid atau tidak disertakan."
    ]);
    exit;
}

try {
    // 1. Data Utama Produk & Toko (Gunakan Subquery Rating agar tidak crash saat produk baru)
    $prodQuery = "
        SELECT 
            p.product_id,
            p.name AS product_name,
            p.description,
            p.weight_grams,
            c.name AS category_name,
            s.shop_id,
            s.user_id AS seller_id,
            s.shop_name,
            s.pickup_city AS shop_city,
            COALESCE(ROUND((SELECT AVG(r.rating) FROM reviews r WHERE r.product_id = p.product_id), 1), 5.0) AS rating_avg,
            COALESCE((SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.product_id), 0) AS total_reviews
        FROM products p
        JOIN shops s ON p.shop_id = s.shop_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE p.product_id = :id
        LIMIT 1
    ";
    $stmt = $db->prepare($prodQuery);
    $stmt->execute(['id' => $productId]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        echo json_encode([
            "status"  => false,
            "message" => "Produk tidak ditemukan di database."
        ]);
        exit;
    }
    $product['rating_avg'] = number_format((float)$product['rating_avg'], 1);

    // 2. Galeri Foto Utama
    $imgQuery = "
        SELECT image_id, image_url, is_primary 
        FROM product_images 
        WHERE product_id = :id 
        ORDER BY is_primary DESC, sort_order ASC, image_id ASC
    ";
    $stmt = $db->prepare($imgQuery);
    $stmt->execute(['id' => $productId]);
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Varian Produk (Beserta image_url)
    $varQuery = "
        SELECT variant_id, variant_combination, price, stock, sku, image_url 
        FROM product_variants 
        WHERE product_id = :id 
        ORDER BY variant_id ASC
    ";
    $stmt = $db->prepare($varQuery);
    $stmt->execute(['id' => $productId]);
    $variants = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. Ulasan Pembeli
    $revQuery = "
        SELECT 
            r.review_id,
            r.rating,
            r.comment,
            r.seller_reply,
            DATE_FORMAT(r.created_at, '%d %b %Y') AS created_at,
            u.name AS buyer_name
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.product_id = :id
        ORDER BY r.review_id DESC
    ";
    $stmt = $db->prepare($revQuery);
    $stmt->execute(['id' => $productId]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => true,
        "data"   => [
            "product"  => $product,
            "images"   => $images,
            "variants" => $variants,
            "reviews"  => $reviews
        ]
    ]);
    exit;

} catch (PDOException $e) {
    echo json_encode([
        "status"  => false,
        "message" => "Database Query Error: " . $e->getMessage()
    ]);
    exit;
}