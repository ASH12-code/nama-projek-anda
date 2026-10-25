<?php
// C:/laragon/www/on-shop/api/buyer/upload_avatar.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once '../../config/database.php';

$userId = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;

if ($userId <= 0 || !isset($_FILES['avatar'])) {
    echo json_encode(["status" => false, "message" => "Data upload tidak lengkap."]);
    exit;
}

$file = $_FILES['avatar'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
$allowedExts  = ['jpg', 'jpeg', 'png', 'webp'];

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($file['type'], $allowedTypes) || !in_array($ext, $allowedExts)) {
    echo json_encode(["status" => false, "message" => "Hanya file JPG, JPEG, PNG, dan WEBP yang diizinkan!"]);
    exit;
}

// Maksimal 3MB
if ($file['size'] > 3 * 1024 * 1024) {
    echo json_encode(["status" => false, "message" => "Ukuran gambar maksimal 3MB."]);
    exit;
}

$targetDir = "../../assets/images/avatars/";
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

$filename = "avatar_" . $userId . "_" . time() . "." . $ext;
$targetPath = $targetDir . $filename;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    $avatarUrl = "/on-shop/assets/images/avatars/" . $filename;

    try {
        $stmt = $conn->prepare("UPDATE users SET avatar_url = :url WHERE user_id = :id");
        $stmt->execute(['url' => $avatarUrl, 'id' => $userId]);

        echo json_encode([
            "status"     => true,
            "message"    => "Foto profil berhasil diperbarui!",
            "avatar_url" => $avatarUrl
        ]);
    } catch (PDOException $e) {
        echo json_encode(["status" => false, "message" => "Gagal update database: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => false, "message" => "Gagal memindahkan file ke server."]);
}
?>