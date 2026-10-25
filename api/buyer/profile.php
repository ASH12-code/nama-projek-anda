<?php
// C:/laragon/www/on-shop/api/buyer/profile.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once '../../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
    if ($userId <= 0) {
        echo json_encode(["status" => false, "message" => "ID Pengguna tidak valid."]);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT user_id, user_code, name, email, phone, role, has_shop, avatar_url, created_at FROM users WHERE user_id = :id");
        $stmt->execute(['id' => $userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            echo json_encode(["status" => false, "message" => "Pengguna tidak ditemukan."]);
            exit;
        }

        echo json_encode(["status" => true, "data" => $user]);
    } catch (PDOException $e) {
        echo json_encode(["status" => false, "message" => "Database Error: " . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $userId = isset($input['user_id']) ? intval($input['user_id']) : 0;
    $name = isset($input['name']) ? trim($input['name']) : '';
    $email = isset($input['email']) ? trim($input['email']) : null;
    $phone = isset($input['phone']) ? trim($input['phone']) : null;

    if ($userId <= 0 || empty($name)) {
        echo json_encode(["status" => false, "message" => "Nama lengkap wajib diisi."]);
        exit;
    }

    $emailVal = !empty($email) ? $email : null;
    $phoneVal = !empty($phone) ? $phone : null;

    try {
        // Cek duplikasi email pada user lain
        if ($emailVal) {
            $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = :email AND user_id != :id LIMIT 1");
            $stmt->execute(['email' => $emailVal, 'id' => $userId]);
            if ($stmt->fetch()) {
                echo json_encode(["status" => false, "message" => "Email sudah digunakan oleh akun lain!"]);
                exit;
            }
        }

        // Cek duplikasi no hp pada user lain
        if ($phoneVal) {
            $stmt = $conn->prepare("SELECT user_id FROM users WHERE phone = :phone AND user_id != :id LIMIT 1");
            $stmt->execute(['phone' => $phoneVal, 'id' => $userId]);
            if ($stmt->fetch()) {
                echo json_encode(["status" => false, "message" => "Nomor telepon sudah digunakan oleh akun lain!"]);
                exit;
            }
        }

        $sql = "UPDATE users SET name = :name, email = :email, phone = :phone WHERE user_id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            'name' => $name,
            'email' => $emailVal,
            'phone' => $phoneVal,
            'id' => $userId
        ]);

        echo json_encode(["status" => true, "message" => "Biodata berhasil diperbarui!"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => false, "message" => "Database Error: " . $e->getMessage()]);
    }
}
?>