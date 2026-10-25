-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 06, 2026 at 02:34 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_on_shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `address_id` int NOT NULL,
  `user_id` int NOT NULL,
  `label` varchar(50) DEFAULT 'Rumah',
  `recipient_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `street_address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`address_id`, `user_id`, `label`, `recipient_name`, `phone`, `street_address`, `city`, `province`, `postal_code`, `is_default`) VALUES
(5, 12, 'jl. angrek 2', 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', 0),
(6, 6, 'budi angrek', 'budi1', '081234567891', 'anggrek 123', 'bangka', 'Kepulauan Bangka Belitung', '12344', 1),
(7, 12, 'jl. angrek 1', 'budi4', '081234567894', 'jalan anggrek 1231', 'bangka', 'Kepulauan Bangka Belitung', '1231', 1),
(9, 205, 'jl. angrek', 'iyahel', '081234567899', 'jl angrek iyahel', 'bangka', 'Kepulauan Bangka Belitung', '12344', 1),
(10, 206, 'jl balunijuk', 'Dicky Chandra', '081438081537', 'jl balunijuk 123', 'bangka', 'Kepulauan Bangka Belitung', '1231', 1),
(11, 206, 'jl. angrek', 'ibu Dicky', '081111111', 'jl anggrek', 'bangka', 'Kepulauan Bangka Belitung', '1231', 0);

-- --------------------------------------------------------

--
-- Table structure for table `admin_audit_logs`
--

CREATE TABLE `admin_audit_logs` (
  `log_id` int NOT NULL,
  `admin_id` int NOT NULL,
  `action_type` enum('RESOLVE_DISPUTE','SUSPEND_SHOP','ACTIVATE_SHOP','UPDATE_PLATFORM_SETTING','DELETE_PRODUCT') NOT NULL,
  `target_id` int NOT NULL,
  `description` text NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `qty` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `user_id`, `product_id`, `variant_id`, `qty`, `created_at`, `updated_at`) VALUES
(19, 10, 5, 52, 1, '2026-09-26 11:05:02', '2026-09-26 11:05:02'),
(20, 10, 24, 57, 1, '2026-09-26 11:08:26', '2026-09-26 11:08:26'),
(27, 12, 40, 122, 1, '2026-09-27 07:35:39', '2026-09-27 07:35:39'),
(28, 12, 40, 120, 1, '2026-09-27 07:37:07', '2026-09-27 07:37:07'),
(33, 206, 40, 119, 1, '2026-10-02 05:55:47', '2026-10-02 05:56:01'),
(35, 207, 40, 119, 1, '2026-10-02 06:08:23', '2026-10-02 06:08:23');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `parent_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `parent_id`) VALUES
(1, 'Elektronik & Komputer', NULL),
(2, 'Pakaian Pria', NULL),
(3, 'Pakaian Wanita', NULL),
(4, 'Sepatu & Alas Kaki', NULL),
(5, 'Tas & Ransel', NULL),
(6, 'Peralatan Rumah Tangga', NULL),
(7, 'Perawatan & Kecantikan', NULL),
(8, 'Makanan & Minuman', NULL),
(9, 'Olahraga & Outdoor', NULL),
(10, 'Buku & Alat Tulis', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `chat_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` text NOT NULL,
  `product_id` int DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`chat_id`, `sender_id`, `receiver_id`, `message`, `product_id`, `is_read`, `created_at`) VALUES
(1, 12, 10, 'Halo kak, apakah barang ini masih ready stok?', 37, 1, '2026-09-26 18:28:48'),
(2, 12, 10, 'Halo kak, apakah barang ini masih ready stok?', 37, 1, '2026-09-26 18:32:11'),
(3, 12, 10, 'Bisa kirim hari ini pakai kurir instan/reguler?', 37, 1, '2026-09-26 18:32:13'),
(4, 12, 10, 'Apakah produk ini bergaransi resmi?', 37, 1, '2026-09-26 18:32:13'),
(5, 10, 2, 'Apakah produk ini bergaransi resmi?', 24, 0, '2026-09-26 22:18:58'),
(6, 10, 12, 'Halo kak, barang ini ready stok dan siap dikirim ya!', NULL, 1, '2026-09-26 22:33:49'),
(7, 12, 10, 'terimakasih kak', NULL, 0, '2026-09-26 22:34:33'),
(8, 205, 205, 'beli mas', 40, 1, '2026-09-26 23:30:45'),
(9, 206, 205, '(Rp 500.000) ini masih ready stok?', 40, 1, '2026-10-02 13:13:39'),
(10, 205, 206, 'ada', NULL, 0, '2026-10-02 13:27:04');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `message_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`message_id`, `sender_id`, `receiver_id`, `message`, `is_read`, `created_at`) VALUES
(1, 201, 10, 'Halo kak, apakah keyboard AULA-F75 ready stok?', 1, '2026-09-25 03:15:00'),
(2, 10, 201, 'Halo kak Siti, ready siap kirim hari ini ya!', 1, '2026-09-25 03:16:30'),
(3, 201, 10, 'Baik kak, pesanan ORD-20260925-001 sudah dibayar tolong segera diproses.', 1, '2026-09-25 03:20:00'),
(4, 202, 10, 'Kak, sepatu sneaker merah hitam ukuran 42 solnya empuk tidak ya?', 1, '2026-09-25 06:00:00'),
(5, 10, 202, 'Empuk banget kak Hendra, bahannya fleksibel anti slip.', 1, '2026-09-25 06:02:00'),
(6, 202, 10, 'Oke kak, sudah saya checkout ya!', 1, '2026-09-25 06:45:00'),
(7, 10, 202, 'baik kak saya akan melakukan pengemasan sekarang', 0, '2026-09-25 23:57:54'),
(8, 10, 201, 'Terima kasih banyak atas pesanannya kak, ditunggu bintang 5-nya!', 0, '2026-09-25 23:58:01');

-- --------------------------------------------------------

--
-- Table structure for table `disputes`
--

CREATE TABLE `disputes` (
  `dispute_id` int NOT NULL,
  `ticket_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_order_id` int NOT NULL,
  `buyer_id` int NOT NULL,
  `shop_id` int NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `buyer_complaint` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `evidence_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','IN_REVIEW','REFUNDED','RELEASED_TO_SELLER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `admin_verdict_notes` text COLLATE utf8mb4_unicode_ci,
  `resolved_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `disputes`
--

INSERT INTO `disputes` (`dispute_id`, `ticket_code`, `sub_order_id`, `buyer_id`, `shop_id`, `amount`, `reason`, `buyer_complaint`, `evidence_image`, `status`, `admin_verdict_notes`, `resolved_at`, `created_at`) VALUES
(1, 'TKT-20260926-01', 31, 1, 5, 650000.00, 'Barang Rusak / Switch Tombol Patah', 'Paket diterima dalam kondisi switch keyboard patah di tombol enter, kemasan luar penyok parah tanpa bubble wrap tebal.', 'https://placehold.co/900x700/fee2e2/dc2626?text=Bukti+Keyboard+Rusak+Patah', 'PENDING', NULL, NULL, '2026-09-26 11:20:00'),
(2, 'TKT-20260925-02', 30, 202, 1, 175000.00, 'Ukuran Tidak Sesuai Pesanan', 'Pesan jaket ukuran L yang dikirim malah ukuran S, mohon refund atau tukar barang.', 'https://placehold.co/900x700/e0f2fe/0369a1?text=Bukti+Tag+Baju+Size+S', 'RELEASED_TO_SELLER', 'pihak toko yang benar', '2026-09-27 19:36:32', '2026-09-25 14:10:00'),
(3, 'TKT-DISP-20261002-6ADA', 45, 205, 5, 765000.00, 'Produk tidak sesuai spesifikasi / salah varian', 'produk tidak sesuai yang di pesan', NULL, 'REFUNDED', 'pihak pembeli yang benar', '2026-10-02 10:42:14', '2026-10-02 10:41:25'),
(4, 'TKT-DISP-20261002-04B7', 46, 205, 5, 765000.00, 'Barang rusak / cacat fisik saat diterima', 'tidak bisa click', NULL, 'REFUNDED', 'oke kami memutuskan pembeli benar', '2026-10-02 11:12:20', '2026-10-02 11:11:32'),
(5, 'TKT-DISP-20261002-E38A', 48, 205, 8, 90000.00, 'Produk tidak sesuai spesifikasi / salah varian', 'produk tidak sesuai yang saya pesan', NULL, 'PENDING', NULL, NULL, '2026-10-02 13:38:51');

-- --------------------------------------------------------

--
-- Table structure for table `help_tickets`
--

CREATE TABLE `help_tickets` (
  `ticket_id` int NOT NULL,
  `ticket_code` varchar(50) NOT NULL,
  `user_id` int NOT NULL,
  `category` enum('KENDALA_PEMBAYARAN','LAPORAN_PENIPUAN_TOKO','KEAMANAN_AKUN','PENGIRIMAN_KURIR','LAINNYA') NOT NULL,
  `subject` varchar(200) NOT NULL,
  `priority` enum('LOW','MEDIUM','HIGH') DEFAULT 'MEDIUM',
  `status` enum('OPEN','IN_PROGRESS','RESOLVED','CLOSED') DEFAULT 'OPEN',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `help_tickets`
--

INSERT INTO `help_tickets` (`ticket_id`, `ticket_code`, `user_id`, `category`, `subject`, `priority`, `status`, `created_at`, `updated_at`) VALUES
(1, 'TKT-202609-4850', 6, 'KENDALA_PEMBAYARAN', 'qris', 'MEDIUM', 'OPEN', '2026-09-20 23:37:54', '2026-09-20 23:37:54'),
(2, 'TKT-202609-9F7B', 12, 'KENDALA_PEMBAYARAN', 'QRIS tidak bisa terdeteksi', 'MEDIUM', 'OPEN', '2026-09-26 12:29:13', '2026-09-26 12:29:13'),
(3, 'TKT-202610-EC8A', 206, 'KENDALA_PEMBAYARAN', 'VA BCA nya tidak bisa', 'MEDIUM', 'OPEN', '2026-10-02 06:15:11', '2026-10-02 06:15:11');

-- --------------------------------------------------------

--
-- Table structure for table `help_ticket_messages`
--

CREATE TABLE `help_ticket_messages` (
  `message_id` int NOT NULL,
  `ticket_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `message` text NOT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `help_ticket_messages`
--

INSERT INTO `help_ticket_messages` (`message_id`, `ticket_id`, `sender_id`, `message`, `attachment_url`, `created_at`) VALUES
(1, 1, 6, 'error', NULL, '2026-09-20 23:37:54'),
(2, 2, 12, 'saat saya memebeli keyboard dan memilih metode qris terjadi error', NULL, '2026-09-26 12:29:13'),
(3, 3, 206, 'error pada va bca', NULL, '2026-10-02 06:15:11');

-- --------------------------------------------------------

--
-- Table structure for table `market_trend_reports`
--

CREATE TABLE `market_trend_reports` (
  `trend_id` int NOT NULL,
  `category_id` int NOT NULL,
  `report_year` int NOT NULL,
  `report_month` int NOT NULL,
  `total_units_sold` int NOT NULL,
  `total_gross_turnover` decimal(15,2) NOT NULL,
  `top_selling_product_name` varchar(255) NOT NULL,
  `top_selling_product_units` int NOT NULL,
  `generated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_orders`
--

CREATE TABLE `master_orders` (
  `master_order_id` int NOT NULL,
  `buyer_id` int NOT NULL,
  `invoice_number` varchar(100) NOT NULL,
  `total_product_amount` decimal(12,2) NOT NULL,
  `total_shipping_fee` decimal(12,2) NOT NULL,
  `total_voucher_discount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_shipping_discount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `service_fee` decimal(12,2) DEFAULT '1000.00',
  `grand_total` decimal(12,2) NOT NULL,
  `shipping_recipient_name` varchar(100) NOT NULL,
  `shipping_phone` varchar(20) NOT NULL,
  `shipping_street_address` text NOT NULL,
  `shipping_city` varchar(100) NOT NULL,
  `shipping_province` varchar(100) NOT NULL,
  `shipping_postal_code` varchar(10) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_orders`
--

INSERT INTO `master_orders` (`master_order_id`, `buyer_id`, `invoice_number`, `total_product_amount`, `total_shipping_fee`, `total_voucher_discount`, `total_shipping_discount`, `service_fee`, `grand_total`, `shipping_recipient_name`, `shipping_phone`, `shipping_street_address`, `shipping_city`, `shipping_province`, `shipping_postal_code`, `created_at`) VALUES
(1, 1, 'INV-20260920-001', 350000.00, 15000.00, 0.00, 0.00, 1000.00, 366000.00, 'Kevin Sanjaya', '08123456789', 'Jl. Merdeka No. 45', 'Pangkalpinang', 'Bangka Belitung', '33111', '2026-09-20 07:33:28'),
(2, 12, 'INV-20260920-6F103', 700000.00, 15000.00, 0.00, 0.00, 1000.00, 716000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-20 14:37:53'),
(3, 12, 'INV-20260920-53CA7', 350000.00, 15000.00, 0.00, 0.00, 1000.00, 366000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-20 14:38:27'),
(4, 12, 'INV-20260920-BE7DE', 525000.00, 15000.00, 0.00, 0.00, 1000.00, 541000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-20 14:45:18'),
(5, 6, 'INV-20260921-2204B', 175000.00, 15000.00, 0.00, 0.00, 1000.00, 191000.00, 'budi1', '081234567891', 'anggrek 123', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-21 00:15:06'),
(6, 12, 'INV-20260921-87FB1', 65000.00, 15000.00, 0.00, 0.00, 1000.00, 81000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-21 12:12:46'),
(7, 12, 'INV-20260921-1B8EE', 175000.00, 15000.00, 0.00, 0.00, 1000.00, 191000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-21 12:22:09'),
(8, 12, 'INV-20260921-505DB', 175000.00, 15000.00, 0.00, 0.00, 1000.00, 191000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-21 12:22:32'),
(9, 12, 'INV-20260921-7BC1D', 175000.00, 15000.00, 0.00, 0.00, 1000.00, 191000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-21 12:23:58'),
(10, 12, 'INV-20260921-5A61A', 175000.00, 15000.00, 0.00, 0.00, 1000.00, 191000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-21 12:38:35'),
(11, 12, 'INV-20260921-02A1E', 65000.00, 15000.00, 0.00, 0.00, 1000.00, 81000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-21 12:38:54'),
(101, 201, 'INV-20260925-001', 750000.00, 15000.00, 0.00, 0.00, 1000.00, 766000.00, 'Siti Aminah', '081234567801', 'Jl. Merdeka No. 10', 'Pangkalpinang', 'Kepulauan Bangka Belitung', '33111', '2026-09-24 02:30:00'),
(102, 202, 'INV-20260925-002', 300000.00, 15000.00, 0.00, 0.00, 1000.00, 316000.00, 'Hendra Wijaya', '081234567802', 'Jl. Sudirman No. 45', 'Pangkalpinang', 'Kepulauan Bangka Belitung', '33112', '2026-09-24 07:15:00'),
(103, 203, 'INV-20260925-003', 145000.00, 15000.00, 0.00, 0.00, 1000.00, 161000.00, 'Rian Pratama', '081234567803', 'Jl. Mentok No. 8', 'Pangkalpinang', 'Kepulauan Bangka Belitung', '33113', '2026-09-25 01:00:00'),
(104, 201, 'INV-20260925-004', 650000.00, 15000.00, 0.00, 0.00, 1000.00, 666000.00, 'Siti Aminah', '081234567801', 'Jl. Merdeka No. 10', 'Pangkalpinang', 'Kepulauan Bangka Belitung', '33111', '2026-09-25 04:20:00'),
(105, 202, 'INV-20260925-005', 89000.00, 15000.00, 0.00, 0.00, 1000.00, 105000.00, 'Hendra Wijaya', '081234567802', 'Jl. Sudirman No. 45', 'Pangkalpinang', 'Kepulauan Bangka Belitung', '33112', '2026-09-25 06:45:00'),
(106, 12, 'INV-20260926-13617', 650000.00, 15000.00, 0.00, 0.00, 1000.00, 666000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-26 02:57:40'),
(107, 12, 'INV-20260926-C4EAD', 650000.00, 15000.00, 0.00, 0.00, 1000.00, 666000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-26 03:03:30'),
(108, 12, 'INV-20260926-07204', 650000.00, 15000.00, 0.00, 0.00, 1000.00, 666000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-26 03:09:09'),
(109, 201, 'INV-20260926-TRX01', 750000.00, 15000.00, 0.00, 0.00, 1000.00, 766000.00, 'Siti Aminah', '081234567801', 'Jl. Merdeka No. 10', 'Pangkalpinang', 'Kepulauan Bangka Belitung', '33111', '2026-09-26 06:00:00'),
(110, 202, 'INV-20260926-TRX02', 350000.00, 15000.00, 0.00, 0.00, 1000.00, 366000.00, 'Hendra Wijaya', '081234567802', 'Jl. Sudirman No. 45', 'Pangkalpinang', 'Kepulauan Bangka Belitung', '33112', '2026-09-26 06:10:00'),
(111, 1, 'INV-20260926-TRX03', 650000.00, 15000.00, 0.00, 0.00, 1000.00, 666000.00, 'Kevin Sanjaya', '08123456789', 'Jl. Merdeka No. 45', 'Pangkalpinang', 'Bangka Belitung', '33111', '2026-09-26 06:30:00'),
(112, 12, 'INV-20260926-8B6F2', 650000.00, 15000.00, 0.00, 0.00, 1000.00, 666000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-26 12:30:03'),
(113, 12, 'INV-20260926-82858', 650000.00, 15000.00, 0.00, 0.00, 1000.00, 666000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-26 12:39:41'),
(114, 12, 'INV-20260926-5CBB1', 750000.00, 15000.00, 0.00, 0.00, 1000.00, 766000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-26 12:39:51'),
(115, 12, 'INV-20260926-172EE', 750000.00, 15000.00, 0.00, 0.00, 1000.00, 766000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-26 12:40:10'),
(116, 12, 'INV-20260926-C2DD7', 750000.00, 15000.00, 0.00, 0.00, 1000.00, 766000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-26 12:56:50'),
(117, 12, 'INV-20260926-371AA', 29000.00, 15000.00, 0.00, 0.00, 1000.00, 45000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-26 13:23:59'),
(118, 12, 'INV-20260926-CBCBB', 650000.00, 15000.00, 0.00, 0.00, 1000.00, 666000.00, 'budi4', '081234567894', 'jl. anggrek 42', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-09-26 14:45:05'),
(119, 12, 'INV-20260927-ED1CD', 1650000.00, 15000.00, 0.00, 0.00, 1000.00, 1666000.00, 'budi4', '081234567894', 'jalan anggrek 1231', 'bangka', 'Kepulauan Bangka Belitung', '1231', '2026-09-27 07:23:06'),
(120, 12, 'INV-20260927-C901C', 1520000.00, 15000.00, 0.00, 0.00, 1000.00, 1536000.00, 'budi4', '081234567894', 'jalan anggrek 1231', 'bangka', 'Kepulauan Bangka Belitung', '1231', '2026-09-27 07:33:25'),
(121, 12, 'INV-20260927-49805', 29000.00, 15000.00, 0.00, 0.00, 1000.00, 45000.00, 'budi4', '081234567894', 'jalan anggrek 1231', 'bangka', 'Kepulauan Bangka Belitung', '1231', '2026-09-27 07:34:12'),
(122, 12, 'INV-20260927-2F527', 6500000.00, 15000.00, 0.00, 0.00, 1000.00, 6516000.00, 'budi4', '081234567894', 'jalan anggrek 1231', 'bangka', 'Kepulauan Bangka Belitung', '1231', '2026-09-27 12:37:48'),
(123, 205, 'INV-20261002-DE4D7', 29000.00, 15000.00, 0.00, 0.00, 1000.00, 45000.00, 'iyahel', '081234567899', 'jl angrek iyahel', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-10-02 03:00:33'),
(124, 205, 'INV-20261002-9DABF', 62000.00, 15000.00, 0.00, 0.00, 1000.00, 78000.00, 'iyahel', '081234567899', 'jl angrek iyahel', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-10-02 03:40:18'),
(125, 205, 'INV-20261002-29D4E', 750000.00, 15000.00, 0.00, 0.00, 1000.00, 766000.00, 'iyahel', '081234567899', 'jl angrek iyahel', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-10-02 03:41:02'),
(126, 205, 'INV-20261002-05FA2', 750000.00, 15000.00, 0.00, 0.00, 1000.00, 766000.00, 'iyahel', '081234567899', 'jl angrek iyahel', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-10-02 04:10:57'),
(127, 206, 'INV-20261002-1EE93', 1650000.00, 15000.00, 0.00, 0.00, 1000.00, 1666000.00, 'Dicky Chandra', '081438081537', 'jl balunijuk 123', 'bangka', 'Kepulauan Bangka Belitung', '1231', '2026-10-02 06:11:15'),
(128, 205, 'INV-20261002-D1CF8', 75000.00, 15000.00, 0.00, 0.00, 1000.00, 91000.00, 'iyahel', '081234567899', 'jl angrek iyahel', 'bangka', 'Kepulauan Bangka Belitung', '12344', '2026-10-02 06:37:19');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL,
  `sub_order_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `variant_id` int DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `variant_name` varchar(150) NOT NULL,
  `product_image_url` varchar(255) NOT NULL,
  `price_at_purchase` decimal(12,2) NOT NULL,
  `quantity` int NOT NULL,
  `total_price` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `sub_order_id`, `product_id`, `variant_id`, `product_name`, `variant_name`, `product_image_url`, `price_at_purchase`, `quantity`, `total_price`) VALUES
(1, 2, 1, 32, 'Jaket Parka Pria Parasut Casual Waterproof', 'Hitam - L', 'https://placehold.co/300x300/2e8b57/ffffff?text=Jaket+Parka', 175000.00, 4, 700000.00),
(2, 3, 1, 32, 'Jaket Parka Pria Parasut Casual Waterproof', 'Hitam - L', 'https://placehold.co/300x300/2e8b57/ffffff?text=Jaket+Parka', 175000.00, 2, 350000.00),
(3, 4, 1, 32, 'Jaket Parka Pria Parasut Casual Waterproof', 'Hitam - L', 'https://placehold.co/300x300/2e8b57/ffffff?text=Jaket+Parka', 175000.00, 3, 525000.00),
(4, 5, 1, 32, 'Jaket Parka Pria Parasut Casual Waterproof', 'Hitam - L', 'https://placehold.co/300x300/2e8b57/ffffff?text=Jaket+Parka', 175000.00, 1, 175000.00),
(5, 6, 23, 47, 'Kaos Polos Oversize Katun Combed 24s', 'Putih Solid - M', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', 65000.00, 1, 65000.00),
(6, 7, 1, 32, 'Jaket Parka Pria Parasut Casual Waterproof', 'Hitam - L', 'https://placehold.co/300x300/2e8b57/ffffff?text=Jaket+Parka', 175000.00, 1, 175000.00),
(7, 8, 24, 53, 'Sepatu Sneakers Pria Low Top Klasik Canvas', 'Hitam Putih - 41', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80', 175000.00, 1, 175000.00),
(8, 9, 24, 53, 'Sepatu Sneakers Pria Low Top Klasik Canvas', 'Hitam Putih - 41', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80', 175000.00, 1, 175000.00),
(9, 10, 24, 53, 'Sepatu Sneakers Pria Low Top Klasik Canvas', 'Hitam Putih - 41', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80', 175000.00, 1, 175000.00),
(10, 11, 23, 47, 'Kaos Polos Oversize Katun Combed 24s', 'Putih Solid - M', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', 65000.00, 1, 65000.00),
(21, 21, 36, NULL, 'keyboard AULA-F75', 'Standar - AULA-75', '/on-shop/assets/images/products/prod_36_83e6062a0a09.webp', 750000.00, 1, 750000.00),
(22, 22, 28, NULL, 'Sepatu Sneaker Sporty Running Sol Karet', 'Merah Hitam - 42', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', 300000.00, 1, 300000.00),
(23, 23, 25, 58, 'Mouse Gaming Wireless RGB Silent Click', 'Hitam Doff', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80', 145000.00, 1, 145000.00),
(24, 24, 37, NULL, 'keyboard Essential75', 'Essential75', '/on-shop/assets/images/products/prod_37_c695593a4ca3.webp', 650000.00, 1, 650000.00),
(25, 25, 27, 62, 'Cardigan Rajut Wanita Korean Oversize Knit', 'Cream - All Size', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80', 89000.00, 1, 89000.00),
(26, 26, 37, NULL, 'keyboard Essential75', 'Essential75', '/on-shop/assets/images/products/prod_37_c695593a4ca3.webp', 650000.00, 1, 650000.00),
(27, 27, 37, 88, 'keyboard Essential75', 'Essential75', 'https://placehold.co/100x100/2e8b57/ffffff?text=Produk', 650000.00, 1, 650000.00),
(28, 28, 37, 88, 'keyboard Essential75', 'Essential75', 'https://placehold.co/100x100/2e8b57/ffffff?text=Produk', 650000.00, 1, 650000.00),
(30, 29, 36, 87, 'keyboard AULA-F75', 'Standar - AULA-75', '/on-shop/assets/images/products/prod_36_83e6062a0a09.webp', 750000.00, 1, 750000.00),
(31, 30, 1, 32, 'Jaket Parka Pria Parasut Casual Waterproof', 'Hitam - L', 'https://placehold.co/300x300/2e8b57/ffffff?text=Jaket+Parka', 175000.00, 2, 350000.00),
(32, 31, 37, 88, 'keyboard Essential75', 'Essential75', 'https://placehold.co/100x100/2e8b57/ffffff?text=Produk', 650000.00, 1, 650000.00),
(33, 32, 37, 88, 'keyboard Essential75', 'Essential75', '/on-shop/assets/images/products/prod_37_c695593a4ca3.webp', 650000.00, 1, 650000.00),
(34, 33, 37, 88, 'keyboard Essential75', 'Essential75', 'https://placehold.co/100x100/2e8b57/ffffff?text=Produk', 650000.00, 1, 650000.00),
(35, 34, 36, 87, 'keyboard AULA-F75', 'Standar - AULA-75', 'https://placehold.co/100x100/2e8b57/ffffff?text=Produk', 750000.00, 1, 750000.00),
(36, 35, 36, 87, 'keyboard AULA-F75', 'Standar - AULA-75', 'https://placehold.co/100x100/2e8b57/ffffff?text=Produk', 750000.00, 1, 750000.00),
(37, 36, 36, 87, 'keyboard AULA-F75', 'Standar - AULA-75', 'https://placehold.co/100x100/2e8b57/ffffff?text=Produk', 750000.00, 1, 750000.00),
(38, 37, 34, 85, 'Buku Catatan Spiral Hardcover Garis A5', 'Cover Kraft - A5', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', 29000.00, 1, 29000.00),
(39, 38, 37, 88, 'keyboard Essential75', 'Essential75', 'https://placehold.co/100x100/2e8b57/ffffff?text=Produk', 650000.00, 1, 650000.00),
(40, 39, 40, 119, 'IEM varian banyak', 'MoonDrop4 - MD4', '/on-shop/assets/images/products/var_40_c1a164610b01.webp', 1650000.00, 1, 1650000.00),
(41, 40, 40, 120, 'IEM varian banyak', 'MoonDrop3 - MD3', '/on-shop/assets/images/products/var_40_9f5ec03def7e.webp', 1520000.00, 1, 1520000.00),
(42, 41, 34, 85, 'Buku Catatan Spiral Hardcover Garis A5', 'Cover Kraft - A5', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', 29000.00, 1, 29000.00),
(43, 42, 40, 121, 'IEM varian banyak', 'Tanngzu 4 - TZ4', '/on-shop/assets/images/products/var_40_84d929a7fe3d.webp', 6500000.00, 1, 6500000.00),
(44, 43, 34, 85, 'Buku Catatan Spiral Hardcover Garis A5', 'Cover Kraft - A5', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', 29000.00, 1, 29000.00),
(45, 44, 32, 69, 'Kopi Arabika Gayo Bubuk Medium Roast 200g', 'Bubuk Halus 200g', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80', 62000.00, 1, 62000.00),
(46, 45, 36, 87, 'keyboard AULA-F75', 'Standar - AULA-75', '/on-shop/assets/images/products/prod_36_83e6062a0a09.webp', 750000.00, 1, 750000.00),
(47, 46, 36, 87, 'keyboard AULA-F75', 'Standar - AULA-75', '/on-shop/assets/images/products/prod_36_83e6062a0a09.webp', 750000.00, 1, 750000.00),
(48, 47, 40, 119, 'IEM varian banyak', 'MoonDrop4 - MD4', '/on-shop/assets/images/products/var_40_c1a164610b01.webp', 1650000.00, 1, 1650000.00),
(49, 48, 43, 129, 'T-shirt', 't-shirt - blue t-shirt', '/on-shop/assets/images/products/var_43_d2e11920a82c.webp', 75000.00, 1, 75000.00);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int NOT NULL,
  `master_order_id` int NOT NULL,
  `payment_method` enum('VA_MANDIRI','VA_BCA','VA_BRI','COD','QRIS') NOT NULL,
  `va_number` varchar(50) DEFAULT NULL,
  `payment_status` enum('PENDING','PAID','EXPIRED','FAILED') DEFAULT 'PENDING',
  `paid_at` datetime DEFAULT NULL,
  `expired_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `master_order_id`, `payment_method`, `va_number`, `payment_status`, `paid_at`, `expired_at`) VALUES
(1, 2, 'COD', NULL, 'PENDING', NULL, '2026-09-21 14:37:53'),
(2, 3, 'QRIS', 'QRIS20260920143827327', 'PAID', '2026-09-20 21:49:25', '2026-09-21 14:38:27'),
(3, 4, 'COD', NULL, 'PENDING', NULL, '2026-09-21 14:45:18'),
(4, 5, 'COD', NULL, 'PENDING', NULL, '2026-09-22 00:15:06'),
(5, 6, 'QRIS', 'QRIS20260921121246739', 'PAID', '2026-09-21 19:13:00', '2026-09-22 12:12:46'),
(6, 7, 'QRIS', 'QRIS20260921122209941', 'PAID', '2026-09-21 19:22:17', '2026-09-22 12:22:09'),
(7, 8, 'QRIS', 'QRIS20260921122232229', 'PENDING', NULL, '2026-09-22 12:22:32'),
(8, 9, 'VA_BCA', '8800122358178', 'PENDING', NULL, '2026-09-22 12:23:58'),
(9, 10, 'QRIS', 'QRIS20260921123835883', 'PAID', '2026-09-21 19:38:39', '2026-09-22 12:38:35'),
(10, 11, 'VA_MANDIRI', '8900123854548', 'PAID', '2026-09-21 19:39:00', '2026-09-22 12:38:54'),
(106, 106, 'COD', NULL, 'PAID', '2026-09-26 09:58:11', '2026-09-27 02:57:40'),
(107, 107, 'VA_BCA', '8800030330722', 'PAID', '2026-09-26 10:03:37', '2026-09-27 03:03:30'),
(108, 108, 'VA_BCA', '8800030909239', 'PAID', '2026-09-26 10:09:15', '2026-09-27 03:09:09'),
(109, 109, 'VA_BCA', '8800092613001', 'PAID', '2026-09-26 13:05:00', '2026-09-27 13:00:00'),
(110, 110, 'QRIS', 'QRIS2026092613100088', 'PAID', '2026-09-26 13:12:00', '2026-09-27 13:10:00'),
(111, 111, 'VA_MANDIRI', '8900092613303', 'PAID', '2026-09-26 13:35:00', '2026-09-27 13:30:00'),
(112, 112, 'QRIS', 'QRIS20260926123003734', 'PAID', '2026-09-26 19:30:09', '2026-09-27 12:30:03'),
(113, 113, 'COD', NULL, 'PENDING', NULL, '2026-09-27 12:39:41'),
(114, 114, 'COD', NULL, 'PENDING', NULL, '2026-09-27 12:39:51'),
(115, 115, 'QRIS', 'QRIS20260926124010412', 'PAID', '2026-09-26 19:40:12', '2026-09-27 12:40:10'),
(116, 116, 'QRIS', 'QRIS20260926125650992', 'PAID', '2026-09-26 19:56:59', '2026-09-27 12:56:50'),
(117, 117, 'VA_BCA', '8800132359758', 'PAID', '2026-09-26 20:24:05', '2026-09-27 13:23:59'),
(118, 118, 'QRIS', 'QRIS20260926144505155', 'PAID', '2026-09-26 21:45:07', '2026-09-27 14:45:05'),
(119, 119, 'QRIS', 'QRIS20260927072306541', 'PAID', '2026-09-27 14:23:13', '2026-09-28 07:23:06'),
(120, 120, 'VA_BCA', '8800073325771', 'PAID', '2026-09-27 14:33:32', '2026-09-28 07:33:25'),
(121, 121, 'VA_BCA', '8800073412848', 'PAID', '2026-09-27 14:34:17', '2026-09-28 07:34:12'),
(122, 122, 'COD', NULL, 'PENDING', NULL, '2026-09-28 12:37:48'),
(123, 123, 'VA_BCA', '8800030034231', 'PAID', '2026-10-02 10:00:41', '2026-10-03 03:00:34'),
(124, 124, 'VA_BCA', '8800034018784', 'PAID', '2026-10-02 10:40:24', '2026-10-03 03:40:18'),
(125, 125, 'QRIS', 'QRIS20261002034102666', 'PAID', '2026-10-02 10:41:06', '2026-10-03 03:41:02'),
(126, 126, 'VA_BCA', '8800041057727', 'PAID', '2026-10-02 11:11:02', '2026-10-03 04:10:57'),
(127, 127, 'VA_BCA', '8800061115364', 'PAID', '2026-10-02 13:11:52', '2026-10-03 06:11:15'),
(128, 128, 'QRIS', 'QRIS20261002063719318', 'PAID', '2026-10-02 13:37:26', '2026-10-03 06:37:19');

-- --------------------------------------------------------

--
-- Table structure for table `platform_settings`
--

CREATE TABLE `platform_settings` (
  `setting_key` varchar(50) NOT NULL,
  `setting_value` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `platform_settings`
--

INSERT INTO `platform_settings` (`setting_key`, `setting_value`, `description`, `updated_at`) VALUES
('seller_commission_percentage', '5.00', 'Potongan komisi platform dari penjualan produk', '2026-09-13 06:40:08');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int NOT NULL,
  `shop_id` int NOT NULL,
  `category_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `weight_grams` int NOT NULL DEFAULT '500',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_pinned` tinyint(1) DEFAULT '0',
  `is_archived` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `shop_id`, `category_id`, `name`, `description`, `weight_grams`, `created_at`, `is_pinned`, `is_archived`) VALUES
(1, 1, 2, 'Jaket Parka Pria Parasut Casual Waterproof', 'Jaket parka anti angin dan air, cocok untuk harian maupun berkendara.', 650, '2026-09-20 07:57:39', 0, 0),
(2, 1, 2, 'Kemeja Flanel Pria Lengan Panjang Casual', 'Kemeja flanel bahan katun wol premium, lembut dan tidak panas. Cocok untuk kuliah maupun santai.', 350, '2026-09-20 15:34:27', 0, 0),
(3, 1, 2, 'Celana Chino Slim Fit Pria Stretch', 'Celana chino panjang model slim fit dengan bahan katun twill stretch elastis yang nyaman dipakai seharian.', 450, '2026-09-20 15:34:27', 0, 0),
(4, 1, 2, 'Kaos Polos Oversize Katun Combed 24s', 'Kaos model oversized gaya streetwear Korea bahan 100% Cotton Combed 24s sejuk.', 250, '2026-09-20 15:34:27', 0, 0),
(5, 1, 4, 'Sepatu Sneakers Pria Low Top Klasik Canvas', 'Sepatu sneakers tali klasik bahan kanvas premium dengan insole empuk dan sol karet anti-slip.', 750, '2026-09-20 15:34:27', 0, 0),
(21, 1, 2, 'Kemeja Flanel Pria Lengan Panjang Casual', 'Kemeja flanel bahan katun wol premium, lembut dan tidak panas. Cocok untuk kuliah maupun santai.', 350, '2026-09-20 15:35:08', 0, 0),
(22, 1, 2, 'Celana Chino Slim Fit Pria Stretch', 'Celana chino panjang model slim fit dengan bahan katun twill stretch elastis yang nyaman dipakai seharian.', 450, '2026-09-20 15:35:08', 0, 0),
(23, 1, 2, 'Kaos Polos Oversize Katun Combed 24s', 'Kaos model oversized gaya streetwear Korea bahan 100% Cotton Combed 24s sejuk.', 250, '2026-09-20 15:35:08', 0, 0),
(24, 1, 4, 'Sepatu Sneakers Pria Low Top Klasik Canvas', 'Sepatu sneakers tali klasik bahan kanvas premium dengan insole empuk dan sol karet anti-slip.', 750, '2026-09-20 15:35:08', 0, 0),
(25, 5, 1, 'Mouse Gaming Wireless RGB Silent Click', 'Mouse gaming dual koneksi 2.4GHz dan Bluetooth, switch hening, sensitivitas hingga 3200 DPI.', 150, '2026-09-25 08:29:20', 0, 0),
(26, 5, 2, 'Kemeja Formal Pria Katun Lengan Panjang', 'Kemeja kantor reguler fit bahan katun sejuk dan rapi, nyaman digunakan seharian.', 250, '2026-09-25 08:29:20', 0, 0),
(27, 5, 3, 'Cardigan Rajut Wanita Korean Oversize Knit', 'Cardigan rajut tebal halus gaya kasual kekinian ala Korea.', 350, '2026-09-25 08:29:20', 0, 0),
(28, 5, 4, 'Sepatu Sneaker Sporty Running Sol Karet', 'Sepatu kasual santai sol anti slip empuk dengan bahan mesh berongga sirkulasi udara.', 250, '2026-09-25 08:29:20', 1, 0),
(29, 5, 5, 'Ransel Laptop Waterproof USB Port Charger', 'Ransel tahan percikan air dengan kompartemen laptop hingga 15.6 inch.', 500, '2026-09-25 08:29:20', 0, 0),
(30, 5, 6, 'Botol Minum Termos Stainless Steel 500ml', 'Vacuum flask tahan suhu panas dan dingin hingga 12 jam bahan stainless food-grade.', 300, '2026-09-25 08:29:20', 0, 0),
(31, 5, 7, 'Sunscreen UV Shield Gel SPF 50 PA++++', 'Perlindungan sinar UV harian tekstur ringan tidak lengket cocok untuk semua jenis kulit.', 80, '2026-09-25 08:29:20', 0, 0),
(32, 5, 8, 'Kopi Arabika Gayo Bubuk Medium Roast 200g', 'Biji kopi murni pilihan dataran tinggi Gayo Aceh, wangi harum alami.', 220, '2026-09-25 08:29:20', 0, 0),
(33, 5, 9, 'Tali Skipping Jump Rope Bearing Baja Anti Slip', 'Tali lompat berbahan baja dilapisi pelindung lentur, handle busa nyaman.', 180, '2026-09-25 08:29:20', 0, 0),
(34, 5, 10, 'Buku Catatan Spiral Hardcover Garis A5', 'Buku agenda isi kertas bookpaper 80 gsm tidak tembus tinta dengan jilid kawat.', 250, '2026-09-25 08:29:20', 1, 0),
(36, 5, 1, 'keyboard AULA-F75', 'keren', 250, '2026-09-25 10:03:34', 1, 0),
(37, 5, 1, 'keyboard Essential75', 'keyboard Essential75', 250, '2026-09-25 10:33:30', 0, 0),
(39, 6, 1, 'IEM terbaik', 'iem', 250, '2026-09-26 16:18:49', 0, 0),
(40, 6, 1, 'IEM varian banyak', 'wow', 250, '2026-09-26 16:30:20', 1, 0),
(41, 6, 1, 'keyboard warna warni', 'hebat kuat dan berwarna', 250, '2026-09-27 13:28:44', 0, 0),
(42, 6, 1, 'key warna', 'warna terbaru', 250, '2026-09-27 13:42:25', 0, 0),
(43, 8, 2, 'T-shirt', 'produk t-shirt yang nyaman dan berbahan kualitas', 200, '2026-10-02 06:22:19', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `image_id` int NOT NULL,
  `product_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `sort_order` tinyint NOT NULL DEFAULT '1',
  `is_primary` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`image_id`, `product_id`, `image_url`, `sort_order`, `is_primary`) VALUES
(21, 1, 'https://placehold.co/300x300/2e8b57/ffffff?text=Jaket+Parka', 1, 1),
(22, 2, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80', 1, 1),
(23, 21, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80', 1, 1),
(24, 2, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80', 2, 0),
(25, 21, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80', 2, 0),
(26, 3, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80', 1, 1),
(27, 22, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80', 1, 1),
(28, 3, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80', 2, 0),
(29, 22, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80', 2, 0),
(30, 4, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', 1, 1),
(31, 23, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', 1, 1),
(32, 4, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80', 2, 0),
(33, 23, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80', 2, 0),
(34, 5, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80', 1, 1),
(35, 24, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80', 1, 1),
(36, 5, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80', 2, 0),
(37, 24, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80', 2, 0),
(38, 25, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80', 1, 1),
(39, 26, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80', 1, 1),
(40, 27, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80', 1, 1),
(42, 29, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', 1, 1),
(43, 30, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80', 1, 1),
(44, 31, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80', 1, 1),
(45, 32, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80', 1, 1),
(46, 33, 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=600&q=80', 1, 1),
(56, 28, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', 1, 1),
(57, 34, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', 1, 1),
(59, 36, '/on-shop/assets/images/products/prod_36_83e6062a0a09.webp', 1, 1),
(60, 37, '/on-shop/assets/images/products/prod_37_c695593a4ca3.webp', 1, 1),
(65, 39, '/on-shop/assets/images/products/prod_39_a90ef8c6f171.webp', 1, 1),
(67, 40, '/on-shop/assets/images/products/prod_40_c8f568b54099.webp', 1, 1),
(68, 41, '/on-shop/assets/images/products/prod_41_7b9d9e7694b4.webp', 1, 1),
(69, 41, '/on-shop/assets/images/products/prod_41_67ef18598e95.webp', 2, 0),
(70, 41, '/on-shop/assets/images/products/prod_41_63caf22fed4b.webp', 3, 0),
(71, 42, '/on-shop/assets/images/products/prod_42_a331655d8f03.webp', 1, 1),
(72, 43, '/on-shop/assets/images/products/prod_43_568276b67005.webp', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `variant_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_combination` varchar(150) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `sku` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`variant_id`, `product_id`, `variant_combination`, `price`, `stock`, `sku`, `image_url`) VALUES
(32, 1, 'Hitam - L', 175000.00, 25, 'JKT-BLK-L', NULL),
(33, 1, 'Navy - XL', 185000.00, 15, 'JKT-NVY-XL', NULL),
(34, 2, 'Merah Hitam - M', 115000.00, 20, 'FLN-RED-M', NULL),
(35, 21, 'Merah Hitam - M', 115000.00, 20, 'FLN-RED-M', NULL),
(36, 2, 'Merah Hitam - L', 115000.00, 25, 'FLN-RED-L', NULL),
(37, 21, 'Merah Hitam - L', 115000.00, 25, 'FLN-RED-L', NULL),
(38, 2, 'Navy Putih - L', 115000.00, 15, 'FLN-NAV-L', NULL),
(39, 21, 'Navy Putih - L', 115000.00, 15, 'FLN-NAV-L', NULL),
(40, 3, 'Hitam - Size 30', 135000.00, 15, 'CHN-BLK-30', NULL),
(41, 22, 'Hitam - Size 30', 135000.00, 15, 'CHN-BLK-30', NULL),
(42, 3, 'Hitam - Size 32', 135000.00, 18, 'CHN-BLK-32', NULL),
(43, 22, 'Hitam - Size 32', 135000.00, 18, 'CHN-BLK-32', NULL),
(44, 3, 'Khaki - Size 32', 135000.00, 12, 'CHN-KHK-32', NULL),
(45, 22, 'Khaki - Size 32', 135000.00, 12, 'CHN-KHK-32', NULL),
(46, 4, 'Putih Solid - M', 65000.00, 40, 'KOS-WHT-M', NULL),
(47, 23, 'Putih Solid - M', 65000.00, 40, 'KOS-WHT-M', NULL),
(48, 4, 'Putih Solid - L', 65000.00, 50, 'KOS-WHT-L', NULL),
(49, 23, 'Putih Solid - L', 65000.00, 50, 'KOS-WHT-L', NULL),
(50, 4, 'Hitam Solid - L', 65000.00, 35, 'KOS-BLK-L', NULL),
(51, 23, 'Hitam Solid - L', 65000.00, 35, 'KOS-BLK-L', NULL),
(52, 5, 'Hitam Putih - 41', 175000.00, 10, 'SNK-BW-41', NULL),
(53, 24, 'Hitam Putih - 41', 175000.00, 10, 'SNK-BW-41', NULL),
(54, 5, 'Hitam Putih - 42', 175000.00, 14, 'SNK-BW-42', NULL),
(55, 24, 'Hitam Putih - 42', 175000.00, 14, 'SNK-BW-42', NULL),
(56, 5, 'All White - 42', 175000.00, 8, 'SNK-WHT-42', NULL),
(57, 24, 'All White - 42', 175000.00, 8, 'SNK-WHT-42', NULL),
(58, 25, 'Hitam Doff', 145000.00, 35, 'MSE-BLK', NULL),
(59, 25, 'Putih Bersih', 145000.00, 20, 'MSE-WHT', NULL),
(60, 26, 'Biru Muda - L', 125000.00, 40, 'KMJ-BLU-L', NULL),
(61, 26, 'Putih - L', 125000.00, 30, 'KMJ-WHT-L', NULL),
(62, 27, 'Cream - All Size', 89000.00, 50, 'CDG-CRM', NULL),
(63, 27, 'Sage Green - All Size', 89000.00, 45, 'CDG-SGE', NULL),
(66, 29, 'Abu Gelap', 165000.00, 30, 'BAG-GRY', NULL),
(67, 30, 'Matte Black - 500ml', 75000.00, 60, 'TMS-BLK', NULL),
(68, 31, 'Tube 50ml', 58000.00, 80, 'SKN-SUN50', NULL),
(69, 32, 'Bubuk Halus 200g', 62000.00, 39, 'KOP-GYO-200', NULL),
(70, 33, 'Hitam - 3 Meter', 35000.00, 75, 'SKP-BLK-3M', NULL),
(83, 28, 'Merah Hitam - 42', 300000.00, 0, 'SNK-RED-42', NULL),
(84, 28, 'Merah Hitam - 43', 210000.00, 0, 'SNK-RED-43', NULL),
(85, 34, 'Cover Kraft - A5', 29000.00, 98, 'NBK-A5-BRN', NULL),
(87, 36, 'Standar - AULA-75', 750000.00, 28, 'RAK-01', NULL),
(88, 37, 'Essential75', 650000.00, 10, 'RAK-01', NULL),
(109, 39, '1', 300000.00, 10, 'RAK-01', '/on-shop/assets/images/products/var_39_220b71f45a39.webp'),
(110, 39, '2', 300000.00, 10, 'RAK-01', '/on-shop/assets/images/products/var_39_ca262270464d.webp'),
(111, 39, '3', 300000.00, 10, 'RAK-01', '/on-shop/assets/images/products/var_39_1ec21863fcb5.webp'),
(112, 39, '4', 300000.00, 10, 'RAK-01', '/on-shop/assets/images/products/var_39_3c2496a83bc6.webp'),
(113, 39, '5', 300000.00, 10, 'RAK-01', '/on-shop/assets/images/products/var_39_79a41b7f8e61.webp'),
(119, 40, 'MoonDrop4 - MD4', 1650000.00, 10, 'RAK-01', '/on-shop/assets/images/products/var_40_c1a164610b01.webp'),
(120, 40, 'MoonDrop3 - MD3', 1520000.00, 10, 'RAK-01', '/on-shop/assets/images/products/var_40_9f5ec03def7e.webp'),
(121, 40, 'Tanngzu 4 - TZ4', 6500000.00, 4, 'RAK-01', '/on-shop/assets/images/products/var_40_84d929a7fe3d.webp'),
(122, 40, 'MoonDrop2 - MD2', 650000.00, 10, 'RAK-01', '/on-shop/assets/images/products/var_40_eaa835b5439b.webp'),
(123, 40, 'MoonDrop1 - MD1', 500000.00, 4, 'RAK-01', '/on-shop/assets/images/products/var_40_c9531a435692.webp'),
(124, 41, 'KEY - V1', 230000.00, 90, 'RAK-01', '/on-shop/assets/images/products/var_41_582073fea9e4.webp'),
(125, 41, 'KEY - V2', 400000.00, 20, 'RAK-01', '/on-shop/assets/images/products/var_41_c80df588e9a4.webp'),
(126, 41, 'KEY - V3', 200000.00, 9, 'RAK-01', '/on-shop/assets/images/products/var_41_60b41973da37.webp'),
(127, 42, 'KEY - 1', 100000.00, 12, 'RAK-01', '/on-shop/assets/images/products/var_42_b7e180081532.webp'),
(128, 42, 'KEY - 2', 100000.00, 12, 'RAK-01', '/on-shop/assets/images/products/var_42_4a6d5e715dcd.webp'),
(129, 43, 't-shirt - blue t-shirt', 75000.00, 99, 'RAK-01', '/on-shop/assets/images/products/var_43_d2e11920a82c.webp'),
(130, 43, 't-shirt - green  t-shirt', 75000.00, 100, 'RAK-01', '/on-shop/assets/images/products/var_43_e19a9e12ea31.webp'),
(131, 43, 't-shirt - yellow  t-shirt', 75000.00, 100, 'RAK-01', '/on-shop/assets/images/products/var_43_461835f84072.webp'),
(132, 43, 't-shirt - red  t-shirt', 75000.00, 100, 'RAK-01', '/on-shop/assets/images/products/var_43_c7d0e329da3d.webp');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int NOT NULL,
  `sub_order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text,
  `review_image_url` varchar(255) DEFAULT NULL,
  `seller_reply` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `sub_order_id`, `product_id`, `user_id`, `rating`, `comment`, `review_image_url`, `seller_reply`, `created_at`) VALUES
(1, 26, 37, 12, 5, 'barang luar biasa mantap kuat keren', NULL, 'terimakasih ya', '2026-09-26 02:58:23'),
(2, 28, 37, 12, 5, 'keyboard terbaik', NULL, NULL, '2026-09-26 13:04:49'),
(3, 41, 34, 12, 5, 'Buku nya sangat mantap', NULL, NULL, '2026-09-27 12:38:14'),
(4, 40, 40, 12, 5, 'suaranya sangat jernih', NULL, NULL, '2026-09-27 12:38:22'),
(5, 39, 40, 12, 5, 'Kesukaan ku', NULL, 'terimakasih sudah membeli produk dari kami', '2026-09-27 12:38:27'),
(6, 37, 34, 12, 4, 'agar lecet', NULL, NULL, '2026-09-27 12:38:37'),
(7, 43, 34, 205, 5, 'mantap', NULL, NULL, '2026-10-02 03:02:48'),
(8, 47, 40, 206, 5, 'produk ini sangat bagus', NULL, 'terimakasih banyak kak', '2026-10-02 06:13:20');

-- --------------------------------------------------------

--
-- Table structure for table `shipping_tracking`
--

CREATE TABLE `shipping_tracking` (
  `tracking_id` int NOT NULL,
  `sub_order_id` int NOT NULL,
  `status_description` varchar(255) NOT NULL,
  `location` varchar(100) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shops`
--

CREATE TABLE `shops` (
  `shop_id` int NOT NULL,
  `user_id` int NOT NULL,
  `shop_name` varchar(100) NOT NULL,
  `description` text,
  `logo_url` varchar(255) DEFAULT NULL,
  `pickup_address` text NOT NULL,
  `pickup_city` varchar(100) NOT NULL,
  `pickup_province` varchar(100) NOT NULL,
  `bank_name` varchar(50) NOT NULL,
  `bank_account_number` varchar(50) NOT NULL,
  `status` enum('pending','verified','suspended','rejected') NOT NULL DEFAULT 'verified',
  `is_official` tinyint(1) NOT NULL DEFAULT '0',
  `ktp_image_url` varchar(255) DEFAULT NULL,
  `suspended_until` datetime DEFAULT NULL,
  `suspension_reason` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `shops`
--

INSERT INTO `shops` (`shop_id`, `user_id`, `shop_name`, `description`, `logo_url`, `pickup_address`, `pickup_city`, `pickup_province`, `bank_name`, `bank_account_number`, `status`, `is_official`, `ktp_image_url`, `suspended_until`, `suspension_reason`, `created_at`) VALUES
(1, 2, 'Fashion Murah Meriah', NULL, NULL, 'Jl. Jenderal Sudirman No. 12', 'Pangkalpinang', 'Bangka Belitung', 'BCA', '1234567890', 'verified', 0, NULL, NULL, NULL, '2026-09-20 07:33:28'),
(3, 6, 'Toko petualang', 'menjual semua peralatan buat bertualang di alam liar', NULL, 'jl. petualang 3', 'Pangkalpinang', 'Bangka Belitung', 'Mandiri', '12345671', 'verified', 0, NULL, NULL, NULL, '2026-09-20 23:28:28'),
(4, 13, 'toko nandu', 'menjual rok', NULL, 'mentok', 'bangka barat', 'bangka belitung', 'Mandiri', '12345671', 'verified', 0, NULL, NULL, NULL, '2026-09-22 07:55:43'),
(5, 10, 'Toko Budi2 Official', 'Toko resmi aneka kebutuhan dan fashion terpercaya.', '/on-shop/assets/images/shops/shop_5_1790383567.webp', 'Jl. Jenderal Sudirman No. 10', 'Pangkalpinang', 'Kepulauan Bangka Belitung', 'BCA', '1234567892', 'verified', 1, NULL, NULL, NULL, '2026-09-25 08:29:02'),
(6, 205, 'Toko IEM IYAHEL', 'Jual berbagai iem', '/on-shop/assets/images/shops/shop_6_1790918867.webp', 'Balunijuk 2', 'Pangkalpinang', 'Bangka Belitung', 'Mandiri', '12345672', 'verified', 1, NULL, NULL, NULL, '2026-09-26 15:42:50'),
(7, 12, 'Toko Budi4 Official', 'Lapak resmi budi4.', NULL, 'jl. anggrek 42', 'Pangkalpinang', 'Kepulauan Bangka Belitung', 'BCA', '081234567894', 'verified', 0, NULL, NULL, NULL, '2026-09-27 09:48:06'),
(8, 206, 'toko baju dicky', 'toko yang menjual berbagai baju', '/on-shop/assets/images/shops/shop_8_1790921819.webp', 'jl balun ijuk .....', 'Pangkalpinang', 'Bangka Belitung', 'Mandiri', '12345671', 'verified', 1, NULL, NULL, NULL, '2026-10-02 06:16:25');

-- --------------------------------------------------------

--
-- Table structure for table `sub_orders`
--

CREATE TABLE `sub_orders` (
  `sub_order_id` int NOT NULL,
  `master_order_id` int NOT NULL,
  `shop_id` int NOT NULL,
  `sub_order_number` varchar(100) NOT NULL,
  `courier_name` varchar(50) NOT NULL,
  `courier_service` varchar(50) NOT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `shipping_cost` decimal(12,2) NOT NULL,
  `shop_voucher_discount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `platform_discount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `shipping_discount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `order_status` enum('MENUNGGU_BAYAR','DIKEMAS','DIKIRIM','SELESAI','DIKOMPLAIN','BATAL') DEFAULT 'MENUNGGU_BAYAR',
  `shipped_at` datetime DEFAULT NULL,
  `shipping_deadline` datetime DEFAULT NULL,
  `delivered_at` datetime DEFAULT NULL,
  `gross_product_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `platform_commission_rate` decimal(5,2) NOT NULL DEFAULT '5.00',
  `platform_fee` decimal(12,2) NOT NULL DEFAULT '0.00',
  `net_seller_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sub_orders`
--

INSERT INTO `sub_orders` (`sub_order_id`, `master_order_id`, `shop_id`, `sub_order_number`, `courier_name`, `courier_service`, `tracking_number`, `shipping_cost`, `shop_voucher_discount`, `platform_discount`, `shipping_discount`, `order_status`, `shipped_at`, `shipping_deadline`, `delivered_at`, `gross_product_amount`, `platform_commission_rate`, `platform_fee`, `net_seller_amount`, `created_at`) VALUES
(1, 1, 1, 'ORD-2026-004', 'JNE', 'REG', NULL, 15000.00, 0.00, 0.00, 0.00, 'DIKOMPLAIN', NULL, NULL, NULL, 350000.00, 5.00, 0.00, 0.00, '2026-09-20 07:33:28'),
(2, 2, 1, 'ORD-20260920-001-C60', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 700000.00, 5.00, 0.00, 0.00, '2026-09-20 14:37:53'),
(3, 3, 1, 'ORD-20260920-001-11B', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 350000.00, 5.00, 0.00, 0.00, '2026-09-20 14:38:27'),
(4, 4, 1, 'ORD-20260920-001-C4F', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 525000.00, 5.00, 0.00, 0.00, '2026-09-20 14:45:18'),
(5, 5, 1, 'ORD-20260921-001-B1B', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'DIKEMAS', NULL, NULL, NULL, 175000.00, 5.00, 0.00, 0.00, '2026-09-21 00:15:06'),
(6, 6, 1, 'ORD-20260921-001-24D', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 65000.00, 5.00, 0.00, 0.00, '2026-09-21 12:12:46'),
(7, 7, 1, 'ORD-20260921-001-C21', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 175000.00, 5.00, 0.00, 0.00, '2026-09-21 12:22:09'),
(8, 8, 1, 'ORD-20260921-001-90F', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 175000.00, 5.00, 0.00, 0.00, '2026-09-21 12:22:32'),
(9, 9, 1, 'ORD-20260921-001-F45', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 175000.00, 5.00, 0.00, 0.00, '2026-09-21 12:23:58'),
(10, 10, 1, 'ORD-20260921-001-7D6', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 175000.00, 5.00, 0.00, 0.00, '2026-09-21 12:38:35'),
(11, 11, 1, 'ORD-20260921-001-D4C', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 65000.00, 5.00, 0.00, 0.00, '2026-09-21 12:38:54'),
(21, 101, 5, 'ORD-20260925-001', 'JNE', 'Reguler', 'JNE-ID-881920', 15000.00, 0.00, 0.00, 0.00, 'SELESAI', NULL, NULL, NULL, 750000.00, 5.00, 37500.00, 712500.00, '2026-09-24 02:30:00'),
(22, 102, 5, 'ORD-20260925-002', 'JNE', 'Reguler', 'JNE-ID-881921', 15000.00, 0.00, 0.00, 0.00, 'SELESAI', NULL, NULL, NULL, 300000.00, 5.00, 15000.00, 285000.00, '2026-09-24 07:15:00'),
(23, 103, 5, 'ORD-20260925-003', 'JNE', 'Reguler', 'JNE-ID-881922', 15000.00, 0.00, 0.00, 0.00, 'DIKIRIM', NULL, NULL, NULL, 145000.00, 5.00, 7250.00, 137750.00, '2026-09-25 01:00:00'),
(24, 104, 5, 'ORD-20260925-004', 'JNE', 'Reguler', NULL, 15000.00, 0.00, 0.00, 0.00, 'DIKEMAS', NULL, NULL, NULL, 650000.00, 5.00, 32500.00, 617500.00, '2026-09-25 04:20:00'),
(25, 105, 5, 'ORD-20260925-005', 'JNE', 'Reguler', 'JNE-BOOK-8099474', 15000.00, 0.00, 0.00, 0.00, 'DIKIRIM', '2026-09-25 21:39:00', NULL, NULL, 89000.00, 5.00, 4450.00, 84550.00, '2026-09-25 06:45:00'),
(26, 106, 5, 'ORD-20260926-001-58C', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'SELESAI', NULL, NULL, '2026-09-26 09:58:11', 650000.00, 5.00, 0.00, 0.00, '2026-09-26 02:57:40'),
(27, 107, 1, 'ORD-20260926-001-2E9', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 650000.00, 5.00, 0.00, 0.00, '2026-09-26 03:03:30'),
(28, 108, 1, 'ORD-20260926-001-3AD', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'SELESAI', NULL, NULL, '2026-09-26 20:04:35', 650000.00, 5.00, 32500.00, 617500.00, '2026-09-26 03:09:09'),
(29, 109, 5, 'ORD-20260926-001-A01', 'JNE', 'Reguler (2-3 Hari)', 'JNE-ID-992001', 15000.00, 0.00, 0.00, 0.00, 'SELESAI', '2026-09-26 13:15:00', NULL, '2026-09-26 13:45:00', 750000.00, 5.00, 37500.00, 712500.00, '2026-09-26 06:00:00'),
(30, 110, 1, 'ORD-20260926-001-B02', 'JNE', 'Reguler (2-3 Hari)', 'JNE-ID-992002', 15000.00, 0.00, 0.00, 0.00, 'SELESAI', '2026-09-26 13:20:00', NULL, '2026-09-27 19:36:32', 350000.00, 5.00, 17500.00, 332500.00, '2026-09-26 06:10:00'),
(31, 111, 5, 'ORD-20260926-001-C03', 'JNE', 'Reguler (2-3 Hari)', 'JNE-ID-992003', 15000.00, 0.00, 0.00, 0.00, 'DIKIRIM', '2026-09-26 13:55:00', NULL, NULL, 650000.00, 5.00, 32500.00, 617500.00, '2026-09-26 06:30:00'),
(32, 112, 5, 'ORD-20260926-001-679', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 650000.00, 5.00, 0.00, 0.00, '2026-09-26 12:30:03'),
(33, 113, 1, 'ORD-20260926-001-03C', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 650000.00, 5.00, 0.00, 0.00, '2026-09-26 12:39:41'),
(34, 114, 1, 'ORD-20260926-001-DC9', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 750000.00, 5.00, 0.00, 0.00, '2026-09-26 12:39:51'),
(35, 115, 1, 'ORD-20260926-001-120', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 750000.00, 5.00, 0.00, 0.00, '2026-09-26 12:40:10'),
(36, 116, 1, 'ORD-20260926-001-003', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 750000.00, 5.00, 0.00, 0.00, '2026-09-26 12:56:50'),
(37, 117, 5, 'ORD-20260926-001-554', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'SELESAI', NULL, NULL, '2026-09-26 20:24:12', 29000.00, 5.00, 1450.00, 27550.00, '2026-09-26 13:23:59'),
(38, 118, 1, 'ORD-20260926-001-93C', 'JNE', 'Reguler (2-3 Hari)', NULL, 15000.00, 0.00, 0.00, 0.00, 'BATAL', NULL, NULL, NULL, 650000.00, 5.00, 0.00, 0.00, '2026-09-26 14:45:05'),
(39, 119, 6, 'ORD-20260927-001-808', 'JNE', 'Reguler (2-3 Hari)', 'JNE-481330311', 15000.00, 0.00, 0.00, 0.00, 'SELESAI', '2026-09-27 14:24:35', NULL, '2026-09-27 14:26:55', 1650000.00, 5.00, 82500.00, 1567500.00, '2026-09-27 07:23:06'),
(40, 120, 1, 'ORD-20260927-001-28D', 'JNE', 'Reguler (2-3 Hari)', 'JNE1698996356', 15000.00, 0.00, 0.00, 0.00, 'SELESAI', '2026-09-27 14:33:36', NULL, '2026-09-27 14:33:51', 1520000.00, 5.00, 76000.00, 1444000.00, '2026-09-27 07:33:25'),
(41, 121, 5, 'ORD-20260927-001-B8D', 'JNE', 'Reguler (2-3 Hari)', 'JNE6546454747', 15000.00, 0.00, 0.00, 0.00, 'SELESAI', '2026-09-27 14:34:24', NULL, '2026-09-27 14:34:35', 29000.00, 5.00, 1450.00, 27550.00, '2026-09-27 07:34:12'),
(42, 122, 6, 'ORD-20260927-001-737', 'JNE', 'Reguler (2-3 Hari)', 'JNE5342768853', 15000.00, 0.00, 0.00, 0.00, 'DIKIRIM', '2026-09-27 19:37:54', NULL, '2026-09-27 19:37:57', 6500000.00, 5.00, 0.00, 0.00, '2026-09-27 12:37:48'),
(43, 123, 5, 'ORD-20261002-001-A4D', 'JNE', 'Reguler (2-3 Hari)', 'JNE8632663486', 15000.00, 0.00, 0.00, 0.00, 'SELESAI', '2026-10-02 10:02:29', NULL, '2026-10-02 10:02:30', 29000.00, 5.00, 1450.00, 27550.00, '2026-10-02 03:00:34'),
(44, 124, 5, 'ORD-20261002-001-CEA', 'JNE', 'Reguler (2-3 Hari)', 'JNE9648924144', 15000.00, 0.00, 0.00, 0.00, 'SELESAI', '2026-10-02 10:40:34', NULL, '2026-10-02 10:40:35', 62000.00, 5.00, 3100.00, 58900.00, '2026-10-02 03:40:18'),
(45, 125, 5, 'ORD-20261002-001-F84', 'JNE', 'Reguler (2-3 Hari)', 'JNE5985098458', 15000.00, 0.00, 0.00, 0.00, 'BATAL', '2026-10-02 10:41:08', NULL, '2026-10-02 10:41:13', 750000.00, 5.00, 0.00, 0.00, '2026-10-02 03:41:02'),
(46, 126, 5, 'ORD-20261002-001-13A', 'JNE', 'Reguler (2-3 Hari)', 'JNE8942192491', 15000.00, 0.00, 0.00, 0.00, 'BATAL', '2026-10-02 11:11:06', NULL, '2026-10-02 11:11:07', 750000.00, 5.00, 0.00, 0.00, '2026-10-02 04:10:57'),
(47, 127, 6, 'ORD-20261002-001-343', 'JNE', 'Reguler (2-3 Hari)', 'JNE1412043560', 15000.00, 0.00, 0.00, 0.00, 'SELESAI', '2026-10-02 13:12:04', NULL, '2026-10-02 13:12:14', 1650000.00, 5.00, 82500.00, 1567500.00, '2026-10-02 06:11:15'),
(48, 128, 8, 'ORD-20261002-001-10C', 'JNE', 'Reguler (2-3 Hari)', 'JNE6593050338', 15000.00, 0.00, 0.00, 0.00, 'DIKOMPLAIN', '2026-10-02 13:37:39', NULL, '2026-10-02 13:38:12', 75000.00, 5.00, 0.00, 0.00, '2026-10-02 06:37:19');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `user_code` char(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('buyer','seller','admin') DEFAULT 'buyer',
  `has_shop` tinyint(1) DEFAULT '0',
  `avatar_url` varchar(255) DEFAULT NULL,
  `is_banned` tinyint(1) NOT NULL DEFAULT '0',
  `banned_reason` text,
  `banned_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_code`, `name`, `email`, `phone`, `password`, `role`, `has_shop`, `avatar_url`, `is_banned`, `banned_reason`, `banned_at`, `created_at`) VALUES
(1, 'USR-001', 'Kevin Sanjaya', 'kevin@example.com', '08123456789', 'hash123', 'buyer', 0, NULL, 0, NULL, NULL, '2026-09-20 07:33:28'),
(2, 'USR-002', 'Owner Toko Fashion', 'toko@example.com', '08987654321', 'hash123', 'seller', 0, NULL, 0, NULL, NULL, '2026-09-20 07:33:28'),
(6, 'USR-003', 'budi1', '', '081234567891', 'budi1', 'seller', 1, NULL, 0, NULL, NULL, '2026-09-20 10:21:31'),
(10, 'USR-004', 'budi2', NULL, '081234567892', 'budi2', 'seller', 1, NULL, 0, NULL, NULL, '2026-09-20 10:28:35'),
(11, 'USR-005', 'budi3', 'budi3@gmail.com', NULL, 'budi3', 'buyer', 0, NULL, 0, NULL, NULL, '2026-09-20 10:41:22'),
(12, 'USR-006', 'budi4', 'budi4@gmail.com', '081234567894', 'budi4', 'seller', 1, '/on-shop/assets/images/avatars/avatar_12_1789903425.webp', 0, NULL, NULL, '2026-09-20 10:42:33'),
(13, 'USR-007', 'Nandu', 'nandu123@gmail.com', NULL, 'nandu1', 'seller', 1, NULL, 0, NULL, NULL, '2026-09-21 00:17:29'),
(201, 'USR-201', 'Siti Aminah', 'siti@example.com', '081234567801', 'hash123', 'buyer', 0, NULL, 0, NULL, NULL, '2026-09-25 11:58:17'),
(202, 'USR-202', 'Hendra Wijaya', 'hendra@example.com', '081234567802', 'hash123', 'buyer', 0, NULL, 0, NULL, NULL, '2026-09-25 11:58:17'),
(203, 'USR-203', 'Rian Pratama', 'rian@example.com', '081234567803', 'hash123', 'buyer', 0, NULL, 0, NULL, NULL, '2026-09-25 11:58:17'),
(204, 'USR-ADMIN-01', 'Super Admin ON Shop', 'admin@onshop.com', '081122334455', 'admin123', 'admin', 0, NULL, 0, NULL, NULL, '2026-09-26 08:45:20'),
(205, 'USR-012', 'Iyahel', 'iyahel1@gmail.com', NULL, 'iyahel1', 'seller', 1, NULL, 0, NULL, NULL, '2026-09-26 15:35:14'),
(206, 'USR-013', 'dicky', 'dicky@gmail.com', '081438081537', 'dicky123', 'seller', 1, NULL, 0, NULL, NULL, '2026-10-02 05:55:38'),
(207, 'USR-014', 'dicky chandra', 'dicky1@gmail.com', NULL, 'dicky1234', 'buyer', 0, NULL, 0, NULL, NULL, '2026-10-02 06:08:00');

-- --------------------------------------------------------

--
-- Table structure for table `user_vouchers`
--

CREATE TABLE `user_vouchers` (
  `user_voucher_id` int NOT NULL,
  `user_id` int NOT NULL,
  `voucher_id` int NOT NULL,
  `status` enum('UNUSED','USED','EXPIRED') NOT NULL DEFAULT 'UNUSED',
  `source_type` enum('CLAIMED','EVENT_GIFT') NOT NULL DEFAULT 'CLAIMED',
  `claimed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `used_at` datetime DEFAULT NULL,
  `order_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_vouchers`
--

INSERT INTO `user_vouchers` (`user_voucher_id`, `user_id`, `voucher_id`, `status`, `source_type`, `claimed_at`, `used_at`, `order_id`) VALUES
(1, 1, 1, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(2, 1, 4, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(3, 1, 3, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(4, 1, 2, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(5, 11, 1, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(6, 11, 4, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(7, 11, 3, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(8, 11, 2, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(9, 201, 1, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(10, 201, 4, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(11, 201, 3, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(12, 201, 2, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(13, 202, 1, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(14, 202, 4, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(15, 202, 3, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(16, 202, 2, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(17, 203, 1, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(18, 203, 4, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(19, 203, 3, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(20, 203, 2, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(21, 207, 1, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(22, 207, 4, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(23, 207, 3, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL),
(24, 207, 2, 'UNUSED', 'EVENT_GIFT', '2026-10-06 09:27:46', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `variant_options`
--

CREATE TABLE `variant_options` (
  `option_id` int NOT NULL,
  `type_id` int NOT NULL,
  `value` varchar(50) NOT NULL,
  `variant_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `variant_types`
--

CREATE TABLE `variant_types` (
  `type_id` int NOT NULL,
  `product_id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `level_order` tinyint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `voucher_id` int NOT NULL,
  `shop_id` int DEFAULT NULL,
  `voucher_code` varchar(50) NOT NULL,
  `voucher_name` varchar(100) NOT NULL,
  `voucher_category` enum('PRODUCT_DISCOUNT','FREE_SHIPPING') NOT NULL DEFAULT 'PRODUCT_DISCOUNT',
  `discount_type` enum('FIXED','PERCENTAGE') NOT NULL DEFAULT 'FIXED',
  `discount_value` decimal(12,2) NOT NULL,
  `min_purchase` decimal(12,2) NOT NULL DEFAULT '0.00',
  `max_discount` decimal(12,2) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `total_quota` int NOT NULL DEFAULT '100',
  `used_quota` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `vouchers`
--

INSERT INTO `vouchers` (`voucher_id`, `shop_id`, `voucher_code`, `voucher_name`, `voucher_category`, `discount_type`, `discount_value`, `min_purchase`, `max_discount`, `start_date`, `end_date`, `total_quota`, `used_quota`, `is_active`, `created_at`) VALUES
(1, NULL, 'ONGKIRGRATIS', 'Gratis Ongkir Seluruh Toko', 'FREE_SHIPPING', 'FIXED', 15000.00, 0.00, NULL, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 100, 0, 1, '2026-10-06 02:27:46'),
(2, NULL, 'ONSHOPHEMAT10', 'Diskon Platform 10%', 'PRODUCT_DISCOUNT', 'PERCENTAGE', 10.00, 20000.00, 50000.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 100, 0, 1, '2026-10-06 02:27:46'),
(3, 1, 'TOKOFASHION5K', 'Diskon Spesial Toko Fashion Rp 5rb', 'PRODUCT_DISCOUNT', 'FIXED', 5000.00, 30000.00, NULL, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 100, 0, 1, '2026-10-06 02:27:46'),
(4, 5, 'BUDI50PERSEN', 'Diskon Toko Budi 50%', 'PRODUCT_DISCOUNT', 'PERCENTAGE', 50.00, 10000.00, 100000.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 100, 0, 1, '2026-10-06 02:27:46');

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `wallet_id` int NOT NULL,
  `user_id` int NOT NULL,
  `available_balance` decimal(12,2) DEFAULT '0.00',
  `pending_balance` decimal(12,2) DEFAULT '0.00',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`wallet_id`, `user_id`, `available_balance`, `pending_balance`, `updated_at`) VALUES
(6, 6, 0.00, 0.00, '2026-09-20 23:28:28'),
(7, 13, 0.00, 0.00, '2026-09-22 07:55:43'),
(8, 10, 969550.00, 1500000.00, '2026-10-02 04:11:02'),
(10, 2, 2726500.00, 0.00, '2026-09-27 12:36:32'),
(13, 205, 4163000.00, 0.00, '2026-10-02 06:29:20'),
(20, 12, 0.00, 0.00, '2026-09-27 09:48:06'),
(22, 204, 0.00, 0.00, '2026-09-27 12:59:50'),
(33, 206, 0.00, 75000.00, '2026-10-02 06:37:26');

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `transaction_id` int NOT NULL,
  `wallet_id` int NOT NULL,
  `type` enum('INCOME_SALES','REFUND','WITHDRAW') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `wallet_transactions`
--

INSERT INTO `wallet_transactions` (`transaction_id`, `wallet_id`, `type`, `amount`, `description`, `created_at`) VALUES
(1, 8, 'INCOME_SALES', 712500.00, 'Pelepasan dana penjualan ORD-20260926-001-A01 (Net setelah komisi 5%)', '2026-09-26 06:45:00'),
(2, 10, 'INCOME_SALES', 332500.00, 'Pelepasan dana penjualan ORD-20260926-001-B02 (Net setelah komisi 5%)', '2026-09-26 06:50:00'),
(3, 8, 'WITHDRAW', 500000.00, 'Pencairan saldo ke rekening BCA - 1234567892', '2026-09-26 07:09:37'),
(4, 10, 'INCOME_SALES', 617500.00, 'Pelepasan dana penjualan ORD-20260926-001-3AD (Net setelah komisi 5%)', '2026-09-26 13:04:35'),
(5, 8, 'INCOME_SALES', 27550.00, 'Pelepasan dana penjualan ORD-20260926-001-554 (Net setelah komisi 5%)', '2026-09-26 13:24:12'),
(6, 13, 'INCOME_SALES', 1567500.00, 'Pelepasan dana pesanan ORD-20260927-001-808 (Net setelah komisi 5%)', '2026-09-27 07:26:55'),
(7, 10, 'INCOME_SALES', 1444000.00, 'Pelepasan dana pesanan ORD-20260927-001-28D (Net setelah komisi 5%)', '2026-09-27 07:33:57'),
(8, 8, 'INCOME_SALES', 27550.00, 'Pelepasan dana pesanan ORD-20260927-001-B8D (Net setelah komisi 5%)', '2026-09-27 07:34:36'),
(9, 10, 'WITHDRAW', 200000.00, 'Pencairan saldo ke rekening BCA - 1234567890', '2026-09-27 12:36:05'),
(10, 10, 'INCOME_SALES', 332500.00, 'Pelepasan dana mediasi tiket TKT-20260925-02 ke toko Fashion Murah Meriah', '2026-09-27 12:36:32'),
(11, 13, 'WITHDRAW', 100000.00, 'Pencairan saldo ke rekening Mandiri - 12345672', '2026-09-27 13:01:08'),
(12, 8, 'INCOME_SALES', 27550.00, 'Pelepasan dana pesanan ORD-20261002-001-A4D (Net setelah komisi 5%)', '2026-10-02 03:02:38'),
(13, 8, 'INCOME_SALES', 58900.00, 'Pelepasan dana pesanan ORD-20261002-001-CEA (Net setelah komisi 5%)', '2026-10-02 03:40:45'),
(14, 13, 'REFUND', 765000.00, 'Pengembalian dana sengketa TKT-DISP-20261002-6ADA: pihak pembeli yang benar', '2026-10-02 03:42:14'),
(15, 13, 'REFUND', 765000.00, 'Pengembalian dana sengketa TKT-DISP-20261002-04B7: oke kami memutuskan pembeli benar', '2026-10-02 04:12:20'),
(16, 13, 'INCOME_SALES', 1567500.00, 'Pelepasan dana pesanan ORD-20261002-001-343 (Net komisi 5%)', '2026-10-02 06:12:45'),
(17, 13, 'WITHDRAW', 100000.00, 'Pencairan saldo ke rekening Mandiri - 12345672', '2026-10-02 06:35:11'),
(18, 13, 'WITHDRAW', 200000.00, 'Pencairan saldo ke rekening Mandiri - 12345672', '2026-10-02 06:35:27');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `wishlist_id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `withdrawals`
--

CREATE TABLE `withdrawals` (
  `withdrawal_id` int NOT NULL,
  `shop_id` int NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `bank_name` varchar(50) NOT NULL,
  `bank_account_number` varchar(50) NOT NULL,
  `status` enum('PENDING','SUCCESS','REJECTED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `withdrawals`
--

INSERT INTO `withdrawals` (`withdrawal_id`, `shop_id`, `amount`, `bank_name`, `bank_account_number`, `status`, `created_at`) VALUES
(1, 5, 500000.00, 'BCA', '1234567892', 'SUCCESS', '2026-09-26 07:00:00'),
(2, 1, 200000.00, 'BCA', '1234567890', 'SUCCESS', '2026-09-26 07:05:00'),
(3, 6, 100000.00, 'Mandiri', '12345672', 'SUCCESS', '2026-09-27 13:00:29'),
(4, 6, 100000.00, 'Mandiri', '12345672', 'SUCCESS', '2026-10-02 06:29:00'),
(5, 6, 200000.00, 'Mandiri', '12345672', 'SUCCESS', '2026-10-02 06:29:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `admin_audit_logs`
--
ALTER TABLE `admin_audit_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD UNIQUE KEY `user_prod_variant_unique` (`user_id`,`product_id`,`variant_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`chat_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `disputes`
--
ALTER TABLE `disputes`
  ADD PRIMARY KEY (`dispute_id`),
  ADD UNIQUE KEY `ticket_code` (`ticket_code`),
  ADD KEY `sub_order_id` (`sub_order_id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `shop_id` (`shop_id`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `help_tickets`
--
ALTER TABLE `help_tickets`
  ADD PRIMARY KEY (`ticket_id`),
  ADD UNIQUE KEY `ticket_code` (`ticket_code`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `help_ticket_messages`
--
ALTER TABLE `help_ticket_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `ticket_id` (`ticket_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `market_trend_reports`
--
ALTER TABLE `market_trend_reports`
  ADD PRIMARY KEY (`trend_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `master_orders`
--
ALTER TABLE `master_orders`
  ADD PRIMARY KEY (`master_order_id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `buyer_id` (`buyer_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `sub_order_id` (`sub_order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `master_order_id` (`master_order_id`);

--
-- Indexes for table `platform_settings`
--
ALTER TABLE `platform_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `shop_id` (`shop_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`variant_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `sub_order_id` (`sub_order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `shipping_tracking`
--
ALTER TABLE `shipping_tracking`
  ADD PRIMARY KEY (`tracking_id`),
  ADD KEY `sub_order_id` (`sub_order_id`);

--
-- Indexes for table `shops`
--
ALTER TABLE `shops`
  ADD PRIMARY KEY (`shop_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `sub_orders`
--
ALTER TABLE `sub_orders`
  ADD PRIMARY KEY (`sub_order_id`),
  ADD UNIQUE KEY `sub_order_number` (`sub_order_number`),
  ADD KEY `master_order_id` (`master_order_id`),
  ADD KEY `shop_id` (`shop_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_code` (`user_code`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `user_vouchers`
--
ALTER TABLE `user_vouchers`
  ADD PRIMARY KEY (`user_voucher_id`),
  ADD UNIQUE KEY `user_voucher_unique` (`user_id`,`voucher_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `voucher_id` (`voucher_id`);

--
-- Indexes for table `variant_options`
--
ALTER TABLE `variant_options`
  ADD PRIMARY KEY (`option_id`),
  ADD KEY `type_id` (`type_id`);

--
-- Indexes for table `variant_types`
--
ALTER TABLE `variant_types`
  ADD PRIMARY KEY (`type_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`voucher_id`),
  ADD UNIQUE KEY `voucher_code` (`voucher_code`),
  ADD KEY `shop_id` (`shop_id`),
  ADD KEY `voucher_category` (`voucher_category`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`wallet_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `wallet_id` (`wallet_id`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`wishlist_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `withdrawals`
--
ALTER TABLE `withdrawals`
  ADD PRIMARY KEY (`withdrawal_id`),
  ADD KEY `shop_id` (`shop_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `address_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `admin_audit_logs`
--
ALTER TABLE `admin_audit_logs`
  MODIFY `log_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `chat_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `message_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `disputes`
--
ALTER TABLE `disputes`
  MODIFY `dispute_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `help_tickets`
--
ALTER TABLE `help_tickets`
  MODIFY `ticket_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `help_ticket_messages`
--
ALTER TABLE `help_ticket_messages`
  MODIFY `message_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `market_trend_reports`
--
ALTER TABLE `market_trend_reports`
  MODIFY `trend_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_orders`
--
ALTER TABLE `master_orders`
  MODIFY `master_order_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `image_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `variant_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shipping_tracking`
--
ALTER TABLE `shipping_tracking`
  MODIFY `tracking_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shops`
--
ALTER TABLE `shops`
  MODIFY `shop_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `sub_orders`
--
ALTER TABLE `sub_orders`
  MODIFY `sub_order_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=208;

--
-- AUTO_INCREMENT for table `user_vouchers`
--
ALTER TABLE `user_vouchers`
  MODIFY `user_voucher_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `variant_options`
--
ALTER TABLE `variant_options`
  MODIFY `option_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `variant_types`
--
ALTER TABLE `variant_types`
  MODIFY `type_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `voucher_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `wallets`
--
ALTER TABLE `wallets`
  MODIFY `wallet_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `transaction_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `wishlist_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `withdrawals`
--
ALTER TABLE `withdrawals`
  MODIFY `withdrawal_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `admin_audit_logs`
--
ALTER TABLE `admin_audit_logs`
  ADD CONSTRAINT `admin_audit_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `help_tickets`
--
ALTER TABLE `help_tickets`
  ADD CONSTRAINT `help_tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `help_ticket_messages`
--
ALTER TABLE `help_ticket_messages`
  ADD CONSTRAINT `help_ticket_messages_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `help_tickets` (`ticket_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `help_ticket_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `market_trend_reports`
--
ALTER TABLE `market_trend_reports`
  ADD CONSTRAINT `market_trend_reports_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `master_orders`
--
ALTER TABLE `master_orders`
  ADD CONSTRAINT `master_orders_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`sub_order_id`) REFERENCES `sub_orders` (`sub_order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`master_order_id`) REFERENCES `master_orders` (`master_order_id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`shop_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`sub_order_id`) REFERENCES `sub_orders` (`sub_order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `shipping_tracking`
--
ALTER TABLE `shipping_tracking`
  ADD CONSTRAINT `shipping_tracking_ibfk_1` FOREIGN KEY (`sub_order_id`) REFERENCES `sub_orders` (`sub_order_id`) ON DELETE CASCADE;

--
-- Constraints for table `shops`
--
ALTER TABLE `shops`
  ADD CONSTRAINT `shops_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `sub_orders`
--
ALTER TABLE `sub_orders`
  ADD CONSTRAINT `sub_orders_ibfk_1` FOREIGN KEY (`master_order_id`) REFERENCES `master_orders` (`master_order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sub_orders_ibfk_2` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`shop_id`);

--
-- Constraints for table `variant_options`
--
ALTER TABLE `variant_options`
  ADD CONSTRAINT `variant_options_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `variant_types` (`type_id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_types`
--
ALTER TABLE `variant_types`
  ADD CONSTRAINT `variant_types_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD CONSTRAINT `wallet_transactions_ibfk_1` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`wallet_id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `withdrawals`
--
ALTER TABLE `withdrawals`
  ADD CONSTRAINT `withdrawals_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`shop_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
