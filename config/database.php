<?php
// config/database.php

$host     = "localhost";
$db_name  = "db_on_shop";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode([
        "status"  => false,
        "message" => "Koneksi database gagal: " . $e->getMessage()
    ]);
    exit;
}
?>