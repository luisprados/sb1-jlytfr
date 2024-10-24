-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Volcando datos para la tabla app_noe.customers: ~3 rows (aproximadamente)
DELETE FROM `customers`;
INSERT INTO `customers` (`id`, `name`, `phone`, `dni`, `created_at`, `updated_at`) VALUES
	(1, 'cliente 1saasas', '666666666', '77777777Q', NULL, '2024-10-15 16:21:26'),
	(2, 'nuevo cliente editado', '123456789', '12345678k', '2024-10-15 16:36:46', '2024-10-15 16:37:06');

-- Volcando datos para la tabla app_noe.failed_jobs: ~0 rows (aproximadamente)
DELETE FROM `failed_jobs`;

-- Volcando datos para la tabla app_noe.migrations: ~8 rows (aproximadamente)
DELETE FROM `migrations`;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '2014_10_12_000000_create_users_table', 1),
	(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
	(3, '2019_08_19_000000_create_failed_jobs_table', 1),
	(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(5, '2024_10_12_163009_create_products_table', 2),
	(6, '2024_10_12_163032_create_customers_table', 2),
	(7, '2024_10_12_163110_create_treatments_table', 2),
	(8, '2024_10_12_175749_create_sessions_table', 2);

-- Volcando datos para la tabla app_noe.password_reset_tokens: ~0 rows (aproximadamente)
DELETE FROM `password_reset_tokens`;

-- Volcando datos para la tabla app_noe.personal_access_tokens: ~0 rows (aproximadamente)
DELETE FROM `personal_access_tokens`;

-- Volcando datos para la tabla app_noe.products: ~43 rows (aproximadamente)
DELETE FROM `products`;
INSERT INTO `products` (`id`, `name`, `cost_price`, `price`, `created_at`, `updated_at`) VALUES
	(7, 'Youth Complex - 30ml', 100.00, 202.00, NULL, NULL),
	(8, 'Youth Eye Complex – 15ml', 70.00, 139.00, NULL, NULL),
	(9, 'Youth Serum - 30ml', 96.00, 192.00, NULL, NULL),
	(10, 'Youth Intensive Crème - 50ml', 142.00, 284.00, NULL, NULL),
	(11, 'Youth Intensive Crème - 100ml', 233.00, 465.00, NULL, NULL),
	(12, 'Lip Polish 15g', 23.00, 46.00, NULL, NULL),
	(13, 'Youth Lip Elixir 3,5g', 36.00, 72.00, NULL, NULL),
	(14, 'Youth Body Serum - 200ml', 72.00, 145.00, NULL, NULL),
	(15, 'Youth Body Serum - 15ml', 17.00, 34.00, NULL, NULL),
	(16, 'Active Serum - 15ml', 54.50, 110.00, NULL, NULL),
	(17, 'Active Serum - 30ml', 87.00, 171.00, NULL, NULL),
	(18, 'Active Peel System', 55.00, 111.00, NULL, NULL),
	(19, 'Brightening Complex – 30ml', 94.00, 184.00, NULL, NULL),
	(20, 'Brightening Serum – 15ml', 50.00, 100.00, NULL, NULL),
	(21, 'Brightening Serum – 30ml', 79.00, 168.00, NULL, NULL),
	(22, 'Poly-Vitamin Serum - 15ml', 44.00, 87.00, NULL, NULL),
	(23, 'Poly-Vitamin Serum - 30ml', 71.00, 139.00, NULL, NULL),
	(24, 'Hydra-Cool Serum - 15ml', 39.00, 78.00, NULL, NULL),
	(25, 'Hydra-Cool Serum - 30ml', 60.00, 120.00, NULL, NULL),
	(26, 'Super Serum Advance+ - 15ml', 58.00, 114.00, NULL, NULL),
	(27, 'Super Serum Advance+ - 30ml', 96.00, 191.00, NULL, NULL),
	(28, 'Pro-Heal Serum Advance+ - 15ml', 58.00, 114.00, NULL, NULL),
	(29, 'Pro-Heal Serum Advance+ - 30ml', 96.00, 191.00, NULL, NULL),
	(30, 'Genex C Serum - 15ml', 64.00, 127.00, NULL, NULL),
	(31, 'Genex C Serum - 30ml', 104.00, 205.00, NULL, NULL),
	(32, 'C Eye Advance+ - 15ml', 42.00, 82.00, NULL, NULL),
	(33, 'Eye Complex - 15ml', 55.00, 108.00, NULL, NULL),
	(34, 'Firming Complex - 50ml', 85.00, 167.00, NULL, NULL),
	(35, 'Moisturizing Complex - 50ml', 60.00, 119.00, NULL, NULL),
	(36, 'Reparative Moisture Emulsion - 50ml', 64.00, 127.00, NULL, NULL),
	(37, 'Sheald Recovery Balm - 60g', 49.00, 96.00, NULL, NULL),
	(38, 'Extrem Protect SPF 30 - 100g', 49.00, 97.00, NULL, NULL),
	(39, 'Extrem Protect SPF 40 - 100g', 49.75, 99.00, NULL, NULL),
	(40, 'Extrem Protect SPF 40 BEIGE - 100g', 49.75, 99.00, NULL, NULL),
	(41, 'Extrem Protect SPF 40 BRONZE - 100g', 49.75, 99.00, NULL, NULL),
	(42, 'Eclipse SPF 50 Traslucida - 100g', 30.00, 60.00, NULL, NULL),
	(43, 'Eclipse SPF 50 PerfecTint Beige - 100g', 30.00, 60.00, NULL, NULL),
	(44, 'LiProtect SPF 35', 15.00, 29.00, NULL, NULL),
	(45, 'PerfecTint Powder SPF 40 - Ivory', 46.00, 91.00, NULL, NULL),
	(46, 'PerfecTint Powder SPF 40 - Cream', 46.00, 91.00, NULL, NULL),
	(47, 'PerfecTint Powder SPF 40 - Beige', 46.00, 91.00, NULL, NULL),
	(48, 'PerfecTint Powder SPF 40 - Bronze', 46.00, 91.00, NULL, NULL),
	(49, 'PerfecTint Powder SPF 40 - Deep', 46.00, 91.00, NULL, NULL);

-- Volcando datos para la tabla app_noe.product_session: ~0 rows (aproximadamente)
DELETE FROM `product_session`;

-- Volcando datos para la tabla app_noe.sessions: ~11 rows (aproximadamente)
DELETE FROM `sessions`;
INSERT INTO `sessions` (`id`, `customer_id`, `created_at`, `updated_at`) VALUES
	(1, 1, '2024-10-18 15:43:07', '2024-10-18 15:43:07'),
	(2, 1, '2024-10-18 15:44:46', '2024-10-18 15:44:46'),
	(3, 1, '2024-10-18 15:50:15', '2024-10-18 15:50:15'),
	(4, 1, '2024-10-18 15:53:30', '2024-10-18 15:53:30'),
	(5, 2, '2024-10-19 04:42:00', '2024-10-19 04:42:00'),
	(6, 2, '2024-10-19 04:46:04', '2024-10-19 04:46:04'),
	(7, 2, '2024-10-20 04:59:43', '2024-10-20 04:59:43'),
	(8, 1, '2024-10-20 05:12:32', '2024-10-20 05:12:32'),
	(9, 1, '2024-10-20 05:19:30', '2024-10-20 05:19:30'),
	(10, 2, '2024-10-20 05:28:50', '2024-10-20 05:28:50'),
	(11, 2, '2024-10-20 05:44:22', '2024-10-20 05:44:22'),
	(12, 2, '2024-10-20 05:47:14', '2024-10-20 05:47:14'),
	(13, 2, '2024-10-20 05:52:16', '2024-10-20 05:52:16'),
	(14, 2, '2024-10-20 08:12:42', '2024-10-20 08:12:42');

-- Volcando datos para la tabla app_noe.session_treatment: ~8 rows (aproximadamente)
DELETE FROM `session_treatment`;
INSERT INTO `session_treatment` (`id`, `session_id`, `treatment_id`, `created_at`, `updated_at`) VALUES
	(1, 2, 2, NULL, NULL),
	(2, 3, 2, NULL, NULL),
	(3, 4, 2, NULL, NULL),
	(4, 6, 3, NULL, NULL),
	(5, 13, 2, NULL, NULL),
	(6, 13, 3, NULL, NULL),
	(7, 14, 2, NULL, NULL),
	(8, 14, 3, NULL, NULL);

-- Volcando datos para la tabla app_noe.treatments: ~7 rows (aproximadamente)
DELETE FROM `treatments`;
INSERT INTO `treatments` (`id`, `name`, `price`, `created_at`, `updated_at`) VALUES
	(1, 'Indiba', 188.00, '2024-10-13 09:13:41', '2024-10-16 15:17:53'),
	(2, 'tratamiento nuevo', 222.00, '2024-10-16 15:44:41', '2024-10-16 15:44:41'),
	(3, 'tratamiento otro', 110.00, '2024-10-16 15:48:21', '2024-10-16 15:48:21'),
	(4, 'y otro mas', 78.00, '2024-10-16 15:53:31', '2024-10-16 15:53:31'),
	(5, 'limpieza facial', 69.00, '2024-10-16 15:58:45', '2024-10-16 15:58:45'),
	(6, 'rtrrtrtrtr', 44.00, '2024-10-16 16:04:26', '2024-10-16 16:04:26'),
	(7, 'fgdfgdfgdfgdfgfgf', 99.00, '2024-10-16 16:08:30', '2024-10-16 16:08:30'),
	(8, 'sasasas', 33.00, '2024-10-16 16:25:59', '2024-10-16 16:25:59');

-- Volcando datos para la tabla app_noe.users: ~0 rows (aproximadamente)
DELETE FROM `users`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
