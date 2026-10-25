<?php
// C:/laragon/www/on-shop/api/seller/get_unread_counters.php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/seller_auth.php'; // Proteksi sesi multi-seller

try {
    // 1. Hitung Produk Habis (Stok 0 dan Tidak Diarsipkan)
    $stmtStock = $db->prepare("
        SELECT COUNT(*) FROM (
            SELECT p.product_id, COALESCE(SUM(pv.stock), 0) AS total_stock
            FROM products p
            LEFT JOIN product_variants pv ON p.product_id = pv.product_id
            WHERE p.shop_id = :shop_id AND p.is_archived = 0
            GROUP BY p.product_id
            HAVING total_stock = 0
        ) AS empty_prods
    ");
    $stmtStock->execute([':shop_id' => $shop_id]);
    $emptyStockCount = (int)$stmtStock->fetchColumn();

    // 2. Hitung Pesanan yang Perlu Diproses (DIKEMAS atau MENUNGGU_BAYAR)
    $stmtOrders = $db->prepare("
        SELECT COUNT(*) 
        FROM sub_orders 
        WHERE shop_id = :shop_id 
          AND order_status IN ('DIKEMAS', 'MENUNGGU_BAYAR')
    ");
    $stmtOrders->execute([':shop_id' => $shop_id]);
    $pendingOrdersCount = (int)$stmtOrders->fetchColumn();

    // 3. Hitung Pesan Belum Dibaca
    $stmtChats = $db->prepare("
        SELECT COUNT(*) 
        FROM chat_messages 
        WHERE receiver_id = :user_id 
          AND is_read = 0
    ");
    $stmtChats->execute([':user_id' => $user_id]);
    $unreadChatsCount = (int)$stmtChats->fetchColumn();

    echo json_encode([
        "status"         => true,
        "empty_stock"    => $emptyStockCount,
        "pending_orders" => $pendingOrdersCount,
        "unread_chats"   => $unreadChatsCount
    ]);
    exit;

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Gagal mengambil counters: " . $e->getMessage()
    ]);
    exit;
}