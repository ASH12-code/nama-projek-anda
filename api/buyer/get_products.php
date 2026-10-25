<?php
// C:/laragon/www/on-shop/api/buyer/get_products.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once '../../config/database.php';

// Pastikan variabel koneksi database konsisten
$db = isset($pdo) ? $pdo : (isset($conn) ? $conn : null);

if (!$db) {
    http_response_code(500);
    echo json_encode([
        "status" => false,
        "message" => "Koneksi database tidak terinisialisasi dengan benar."
    ]);
    exit;
}

try {
    // 1. Tangkap Parameter Filter
    $shopId     = isset($_GET['shop_id']) ? (int)$_GET['shop_id'] : null;
    $categoryId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;
    $keyword    = isset($_GET['search']) ? trim($_GET['search']) : null;
    $limit      = isset($_GET['limit']) ? (int)$_GET['limit'] : 30;

    // 2. Susun Kondisi WHERE Dinamis (Hanya produk yang tidak diarsipkan)
    $conditions = ["p.is_archived = 0"];
    $params = [];

    if (!empty($shopId)) {
        $conditions[] = "p.shop_id = :shop_id";
        $params[':shop_id'] = $shopId;
    }

    if (!empty($categoryId)) {
        $conditions[] = "p.category_id = :category_id";
        $params[':category_id'] = $categoryId;
    }

    if (!empty($keyword)) {
        $conditions[] = "(p.name LIKE :kw OR p.description LIKE :kw OR s.shop_name LIKE :kw)";
        $params[':kw'] = "%{$keyword}%";
    }

    $whereSql = implode(" AND ", $conditions);

    // 3. Kueri dengan Subquery Cerdas untuk Mengambil Gambar & Harga Terendah
    $query = "
        SELECT 
            p.product_id,
            p.shop_id,
            p.name AS product_name,
            p.description AS product_description,
            p.category_id,
            c.name AS category_name,
            s.shop_name,
            s.pickup_city AS shop_city,
            COALESCE(
                (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.product_id AND pi.is_primary = 1 LIMIT 1),
                (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.product_id ORDER BY pi.sort_order ASC, pi.image_id ASC LIMIT 1),
                (SELECT pv.image_url FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.image_url IS NOT NULL AND pv.image_url != '' LIMIT 1),
                'https://placehold.co/300x300/e2e8f0/475569?text=No+Image'
            ) AS image_url,
            COALESCE((SELECT MIN(pv.price) FROM product_variants pv WHERE pv.product_id = p.product_id), 0) AS display_price,
            COALESCE((SELECT SUM(pv.stock) FROM product_variants pv WHERE pv.product_id = p.product_id), 0) AS total_stock,
            COALESCE(ROUND((SELECT AVG(r.rating) FROM reviews r WHERE r.product_id = p.product_id), 1), 5.0) AS rating_avg,
            COALESCE((SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.product_id), 0) AS total_reviews
        FROM products p
        JOIN shops s ON p.shop_id = s.shop_id
        JOIN categories c ON p.category_id = c.category_id
        WHERE {$whereSql}
        ORDER BY p.is_pinned DESC, p.product_id DESC
        LIMIT {$limit}
    ";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format tipe data numerik
    foreach ($products as &$p) {
        $p['product_id']    = (int)$p['product_id'];
        $p['shop_id']       = (int)$p['shop_id'];
        $p['category_id']   = (int)$p['category_id'];
        $p['display_price'] = (float)$p['display_price'];
        $p['total_stock']   = (int)$p['total_stock'];
        $p['rating_avg']    = (float)$p['rating_avg'];
        $p['total_reviews'] = (int)$p['total_reviews'];
    }

    echo json_encode([
        "status" => true,
        "total"  => count($products),
        "data"   => $products
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Database Query Error: " . $e->getMessage()
    ]);
}