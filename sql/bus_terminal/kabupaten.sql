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

-- Dumping structure for table bus_terminal.kabupaten
CREATE TABLE IF NOT EXISTS `kabupaten` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provinsi_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `provinsi_id` (`provinsi_id`),
  CONSTRAINT `kabupaten_ibfk_1` FOREIGN KEY (`provinsi_id`) REFERENCES `provinsi` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table bus_terminal.kabupaten: ~123 rows (approximately)
DELETE FROM `kabupaten`;
INSERT INTO `kabupaten` (`id`, `provinsi_id`, `name`) VALUES
	(1, 1, 'Kota Langsa'),
	(2, 1, 'Kota Lhokseumawe'),
	(3, 1, 'Kabupaten Aceh Barat'),
	(4, 1, 'Kota Banda Aceh'),
	(5, 1, 'Kabupaten Aceh Tengah'),
	(6, 2, 'Kota Pemantang Siantar'),
	(7, 2, 'Kabupaten Tapanuli Utara'),
	(8, 2, 'Kota Sibolga'),
	(9, 2, 'Kabupaten Labuhan Batu'),
	(10, 2, 'Kota Medan'),
	(11, 3, 'Kota Padang'),
	(12, 3, 'Kabupaten Sijunjung'),
	(13, 3, 'Kota Solok'),
	(14, 3, 'Kota Bukit Tinggi'),
	(15, 3, 'Kota Pariaman'),
	(16, 4, 'Kabupaten Kampar'),
	(17, 4, 'Kota Pekanbaru'),
	(18, 4, 'Kota Dumai'),
	(19, 4, 'Kabupaten Indragiri Hulu'),
	(20, 5, 'Kota Jambi'),
	(21, 5, 'Kabupaten Bungo'),
	(22, 5, 'Kabupaten  Merangin'),
	(23, 5, 'Kabupaten Sorolangun'),
	(24, 6, 'Kota Palembang'),
	(25, 6, 'Kabupaten OKI'),
	(26, 6, 'Kabupaten OKU'),
	(27, 6, 'Kabupaten Banyuasin'),
	(28, 6, 'Kota Lubuk Linggau'),
	(29, 6, 'Kabupaten Lahat'),
	(30, 7, 'Kabupaten Rejang Lebong'),
	(31, 7, 'Kota Bengkulu'),
	(32, 7, 'Kota Bandar Lampung'),
	(33, 7, 'Kabupaten Lampung Tengah'),
	(34, 8, 'Kota Serang'),
	(35, 8, 'Kabupaten Pandeglang'),
	(36, 8, 'Kabupaten Lebak'),
	(37, 8, 'Kota Cilegon'),
	(38, 8, 'Kota Tangerang'),
	(39, 8, 'Kota Tangerang Selatan'),
	(40, 9, 'Kota Sukabumi'),
	(41, 9, 'Kabupaten Sumedang'),
	(42, 9, 'Kabupaten Garut'),
	(43, 9, 'Kota Cirebon'),
	(44, 9, 'Kota Tasikmalaya'),
	(45, 9, 'Kabupaten Kuningan'),
	(46, 9, 'Kabupaten Subang'),
	(47, 9, 'Kota Banjar'),
	(48, 9, 'Kabupaten Karawang'),
	(49, 9, 'Kota Bogor'),
	(50, 9, 'Kota Bekasi'),
	(51, 9, 'Kabupaten Bekasi'),
	(52, 9, 'Kota Depok'),
	(53, 9, 'Kota Bandung'),
	(54, 10, 'Kabupaten Purworejo'),
	(55, 10, 'Kabupaten Blora'),
	(56, 10, 'Kabupaten Cilacap'),
	(57, 10, 'Kabupaten Wonogiri'),
	(58, 10, 'Kabupaten Klaten'),
	(59, 10, 'Kabupaten Kebumen'),
	(60, 10, 'Kota Semarang'),
	(61, 10, 'Kota Pekalongan'),
	(62, 10, 'Kabupaten Pemalang'),
	(63, 10, 'Kabupaten Banyumas'),
	(64, 10, 'Kabupaten Wonosobo'),
	(65, 10, 'Kabupaten Semarang'),
	(66, 10, 'Kota Magelang'),
	(67, 10, 'Kota Salatiga'),
	(68, 10, 'Kota  Surakarta'),
	(69, 10, 'Kabupaten Kudus'),
	(70, 10, 'Kabupaten Purbalingga'),
	(71, 10, 'Kabupaten Demak'),
	(72, 10, 'Kota Tegal'),
	(73, 11, 'Kota Yogyakarta'),
	(74, 11, 'Kabupaten Gunung Kidul'),
	(75, 12, 'Kota Malang'),
	(76, 12, 'Kabupaten Sumenep'),
	(77, 12, 'Kabupaten Bangkalan'),
	(78, 12, 'Kota  Probolinggo'),
	(79, 12, 'Kabupaten Tulungagung'),
	(80, 12, 'Kabupaten Ngawi'),
	(81, 12, 'Kabupaten Pacitan'),
	(82, 12, 'Kota Blitar'),
	(83, 12, 'Kota Madiun'),
	(84, 12, 'Kabupaten Ponorogo'),
	(85, 12, 'Kota Kediri'),
	(86, 12, 'Kabupaten  Jember'),
	(87, 12, 'Kabupaten Trenggalek'),
	(88, 12, 'Kabupaten Bojonegoro'),
	(89, 12, 'Kabupaten Pasuruan'),
	(90, 12, 'Kabupaten Tuban'),
	(91, 12, 'Kabupaten Banyuwangi'),
	(92, 12, 'Kota Surabaya'),
	(93, 12, 'Kabupaten Sidoarjo'),
	(94, 13, 'Kabupaten Badung'),
	(95, 13, 'Kota Mataram'),
	(96, 13, 'Kabupaten Sumbawa'),
	(97, 13, 'Kota Bima'),
	(98, 14, 'Kabupaten Timor Tengah Utara'),
	(99, 14, 'Kota Kupang'),
	(100, 15, 'Kabupaten Kubu Raya'),
	(101, 15, 'Kota Singkawang'),
	(102, 16, 'Kota Palangkaraya'),
	(103, 17, 'Kabupaten Banjar'),
	(104, 18, 'Kota Balikpapan'),
	(105, 19, 'Kabupaten Mamuju'),
	(106, 19, 'Kabupaten Polewali Mandar'),
	(107, 20, 'Kabupaten Poso'),
	(108, 20, 'Kota Palu'),
	(109, 21, 'Kabupaten Bolaang Mongondow Utara'),
	(110, 21, 'Kota Manado'),
	(111, 21, 'Kota Bitung'),
	(112, 21, 'Kabupaten Bolaang Mongondow'),
	(113, 22, 'Kota Kendari'),
	(114, 23, 'Kabupaten Gorontalo'),
	(115, 23, 'Kota Gorontalo'),
	(116, 24, 'Kota Jayapura'),
	(117, 25, 'Kota Jakarta Timur'),
	(118, 25, 'Kota Jakarta Barat'),
	(119, 18, 'Kota Samarinda'),
	(120, 19, 'Kota Pare-Pare'),
	(121, 19, 'Kabupaten Barru'),
	(122, 19, 'Kabupaten Bone'),
	(123, 19, 'Kota Makasar');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
