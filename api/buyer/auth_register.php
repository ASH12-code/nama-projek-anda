<?php
// C:/laragon/www/on-shop/api/buyer/auth_register.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once '../../config/database.php';

$input = json_decode(file_get_contents("php://input"), true);

$name     = isset($input['name']) ? trim($input['name']) : '';
$email    = isset($input['email']) ? trim($input['email']) : '';
$phone    = isset($input['phone']) ? trim($input['phone']) : '';
$password = isset($input['password']) ? trim($input['password']) : '';

// 1. Validasi Nama & Password wajib ada
if (empty($name) || empty($password)) {
    echo json_encode(["status" => false, "message" => "Nama lengkap dan kata sandi wajib diisi!"]);
    exit;
}

// 2. Minimal salah satu dari Email atau Telepon wajib terisi
if (empty($email) && empty($phone)) {
    echo json_encode(["status" => false, "message" => "Harap isi minimal salah satu: Email atau Nomor Telepon!"]);
    exit;
}

try {
    // 3. Cek duplikasi email jika diisi
    if (!empty($email)) {
        $stmtCheckEmail = $conn->prepare("SELECT user_id FROM users WHERE email = :email LIMIT 1");
        $stmtCheckEmail->execute(['email' => $email]);
        if ($stmtCheckEmail->fetch()) {
            echo json_encode(["status" => false, "message" => "Email tersebut sudah terdaftar!"]);
            exit;
        }
    }

    // 4. Cek duplikasi nomor telepon jika diisi
    if (!empty($phone)) {
        $stmtCheckPhone = $conn->prepare("SELECT user_id FROM users WHERE phone = :phone LIMIT 1");
        $stmtCheckPhone->execute(['phone' => $phone]);
        if ($stmtCheckPhone->fetch()) {
            echo json_encode(["status" => false, "message" => "Nomor telepon tersebut sudah terdaftar!"]);
            exit;
        }
    }

    // 5. Generate User Code unik (USR-001, USR-002, dst)
    $countQuery = $conn->query("SELECT COUNT(*) FROM users");
    $totalUser = (int)$countQuery->fetchColumn() + 1;
    $userCode = "USR-" . str_pad($totalUser, 3, "0", STR_PAD_LEFT);

    // KUNCI PERBAIKAN: Jika kosong, simpan sebagai NULL agar tidak melanggar batasan UNIQUE
    $saveEmail = !empty($email) ? $email : null;
    $savePhone = !empty($phone) ? $phone : null;

    // 6. Simpan ke database
    $insertSql = "INSERT INTO users (user_code, name, email, phone, password, role, has_shop) 
                  VALUES (:code, :name, :email, :phone, :pass, 'buyer', 0)";
    
    $stmt = $conn->prepare($insertSql);
    $stmt->execute([
        'code'  => $userCode,
        'name'  => $name,
        'email' => $saveEmail,
        'phone' => $savePhone,
        'pass'  => $password
    ]);

    $newUserId = (int)$conn->lastInsertId();

    // 7. Data sesi login
    $userData = [
        "user_id"   => $newUserId,
        "user_code" => $userCode,
        "name"      => $name,
        "email"     => $saveEmail,
        "phone"     => $savePhone,
        "role"      => "buyer",
        "has_shop"  => 0
    ];

    echo json_encode([
        "status"  => true,
        "message" => "Pendaftaran berhasil!",
        "user"    => $userData
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => false, "message" => "Database Error: " . $e->getMessage()]);
}
?>