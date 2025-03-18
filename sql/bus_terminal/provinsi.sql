-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table bus_terminal.provinsi
CREATE TABLE IF NOT EXISTS `provinsi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table bus_terminal.provinsi: ~25 rows (approximately)
DELETE FROM `provinsi`;
INSERT INTO `provinsi` (`id`, `name`) VALUES
	(1, 'Aceh'),
	(13, 'Bali dan Nusa Tenggara Barat'),
	(8, 'Banten'),
	(7, 'Bengkulu dan Lampung'),
	(11, 'D.I. Yogyakarta'),
	(25, 'DKI Jakarta'),
	(23, 'Gorontalo'),
	(5, 'Jambi'),
	(9, 'Jawa Barat'),
	(10, 'Jawa Tengah'),
	(12, 'Jawa Timur'),
	(15, 'Kalimantan Barat'),
	(17, 'Kalimantan Selatan'),
	(16, 'Kalimantan Tengah'),
	(18, 'Kalimantan Timur'),
	(14, 'Nusa Tenggara Timur'),
	(24, 'Papua'),
	(4, 'Riau'),
	(19, 'Sulawesi Selatan dan Sulawesi Barat'),
	(20, 'Sulawesi Tengah'),
	(22, 'Sulawesi Tenggara'),
	(21, 'Sulawesi Utara'),
	(3, 'Sumatera Barat'),
	(6, 'Sumatera Selatan dan Bangka Belitung'),
	(2, 'Sumatera Utara');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
