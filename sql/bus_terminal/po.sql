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

-- Dumping structure for table bus_terminal.po
CREATE TABLE IF NOT EXISTS `po` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_PO` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nama_PO` (`nama_PO`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table bus_terminal.po: ~100 rows (approximately)
DELETE FROM `po`;
INSERT INTO `po` (`id`, `nama_PO`) VALUES
	(68, 'Koperasi Prasojo Margo Rejeki'),
	(97, 'Koperasi Prasojo Mugi Raharjo'),
	(21, 'Koperasi Sapta Manunggal'),
	(28, 'Koperasi Sari Manunggal'),
	(64, 'Koperasi Yosawa'),
	(83, 'Koprasi Sapta Manunggal'),
	(70, 'Koprasi Sari Manunggal'),
	(91, 'Perum Damri'),
	(85, 'Perum Damri Kantor Cabang Jakarta'),
	(72, 'Perum Damri Kc Purworejo'),
	(95, 'Po. Birowo'),
	(41, 'Po. Jaya Sehati'),
	(100, 'Po. Pulung Sari'),
	(29, 'Po. Rawit Mulyo'),
	(62, 'Po. Siswantoro'),
	(98, 'Pt . Eka Mira Prima Sentosa'),
	(53, 'Pt. Adibuzz Mitra Gemilang'),
	(46, 'Pt. Almira Putri Harum'),
	(65, 'Pt. Andry Febiola Transportasi'),
	(9, 'Pt. Anindya Mitra Internasional'),
	(69, 'Pt. Antar Jaya Prima'),
	(44, 'Pt. Anugerah Karya Utami Gemilang'),
	(71, 'Pt. Anugerah Mas'),
	(6, 'Pt. Anugerah Mas Cab. Bekasi'),
	(78, 'Pt. Anugerah Mas Cab. Kerawang'),
	(84, 'Pt. Anugerah Mas Cab.Karawang'),
	(55, 'Pt. Arsyad Niaga Trans'),
	(1, 'Pt. Asli Prima Inti Karya'),
	(50, 'Pt. Baja Samudera Transportasi'),
	(23, 'Pt. Bintang Estu Terang'),
	(56, 'Pt. Bumi Rencong Abadi'),
	(75, 'Pt. Cempaka Jaya Swatama'),
	(27, 'Pt. Citra Adi Lancar'),
	(80, 'Pt. Citra Yudha Utama'),
	(14, 'Pt. Efisiensi Putra Utama'),
	(5, 'Pt. Eka Mira Prima Sentosa'),
	(39, 'Pt. Ervin Ayu Sejahtera'),
	(94, 'Pt. Family Raya Ceria Sejati'),
	(42, 'Pt. Gilang Sembilan Sembilan'),
	(16, 'Pt. Gunung Harta'),
	(92, 'Pt. Gunung Harta Surabaya'),
	(88, 'Pt. Harapan Jaya Prima'),
	(12, 'Pt. Haryanto Motor Indonesia'),
	(99, 'Pt. Haryanto Motor Indonesia Cb. Kuddus'),
	(31, 'Pt. Haryanto Motor Indonesia Cb. Kudus'),
	(51, 'Pt. Hidup Baru Putra'),
	(7, 'Pt. Hs Budiman 45'),
	(48, 'Pt. Indo Transport Abdimas'),
	(19, 'Pt. Jogja Tugu Trans'),
	(36, 'Pt. Karya Sari Bumen'),
	(54, 'Pt. Kramatdjati Asri Sejati Cabang Jakarta'),
	(13, 'Pt. Langsung Jaya Abadi'),
	(76, 'Pt. Mahardhika Jaya Santoso'),
	(34, 'Pt. Maju Lancar Prima'),
	(15, 'Pt. Mansion Transportasi'),
	(57, 'Pt. Matabean Putra Perkasa'),
	(10, 'Pt. Mila Sejahtera'),
	(96, 'Pt. Muji Jaya Citra Mandiri Gh'),
	(82, 'Pt. Mulyo Indah'),
	(24, 'Pt. Mulyo Trans Sakonda'),
	(11, 'Pt. Murni Anugrah Jaya Usaha'),
	(18, 'Pt. Mustika Transindo Prima'),
	(38, 'Pt. Nusantara Transindo'),
	(52, 'Pt. Pandawa Wolu Tujuh'),
	(63, 'Pt. Pratama Baru Indah'),
	(37, 'Pt. Prayogo Mugi Hartono'),
	(32, 'Pt. Purwo Widodo Rahayu'),
	(49, 'Pt. Puspa Jaya Transport'),
	(59, 'Pt. Putra Gunung Asih'),
	(22, 'Pt. Putra Gunung Kidul'),
	(40, 'Pt. Putra Remaja Sentosa'),
	(61, 'Pt. Rafflesia Putra Prima'),
	(58, 'Pt. Rajawali Bus Transport'),
	(2, 'Pt. Ramayana Indo Transport'),
	(67, 'Pt. Restu Mulya Mandiri'),
	(47, 'Pt. Riyan Agung Abadi'),
	(74, 'Pt. Rosalia Indah Transport'),
	(90, 'Pt. Rosalia Indah Transport Cb. Srt'),
	(33, 'Pt. San Putra Sejahtera'),
	(43, 'Pt. San Putra Sejahtera Cab. Pekanbaru'),
	(77, 'Pt. Santoso Kencana Sakti'),
	(26, 'Pt. Sedya Tama Laksana'),
	(3, 'Pt. Selamat Sugeng Rahayu'),
	(25, 'Pt. Semeru Putra Transindo'),
	(86, 'Pt. Setia Negara'),
	(93, 'Pt. Sinar Aladdin Putra Ciamis'),
	(8, 'Pt. Sinar Jaya Megah Langgeng'),
	(87, 'Pt. Sinar Jaya Megah Langgeng Cb. Bk'),
	(4, 'Pt. Sinar Jaya Megah Langgeng Cb. Bks'),
	(81, 'Pt. Sinar Jaya Megah Lng. Cb. Karanganyar'),
	(89, 'Pt. Sindoro Satriamas'),
	(60, 'Pt. Sudiro Tungga Jaya'),
	(35, 'Pt. Suharno Ragil Putra'),
	(20, 'Pt. Sumber Alam Ekspress'),
	(30, 'Pt. Sumber Waras Putra'),
	(66, 'Pt. Sumber Waras Putra Cb. Yogyakarta'),
	(45, 'Pt. Surya Bali'),
	(17, 'Pt. Tividi Putera Sarana'),
	(79, 'Pt. Wisata Komodo Kencana');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
