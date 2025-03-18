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

-- Dumping structure for table bus_terminal.terminal
CREATE TABLE IF NOT EXISTS `terminal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_terminal` varchar(255) NOT NULL,
  `alamat` text,
  `titik_koordinat` varchar(255) DEFAULT NULL,
  `kabupaten_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `kabupaten_id` (`kabupaten_id`),
  CONSTRAINT `terminal_ibfk_1` FOREIGN KEY (`kabupaten_id`) REFERENCES `kabupaten` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table bus_terminal.terminal: ~127 rows (approximately)
DELETE FROM `terminal`;
INSERT INTO `terminal` (`id`, `nama_terminal`, `alamat`, `titik_koordinat`, `kabupaten_id`) VALUES
	(1, 'Terminal Langsa', 'Jl. Prof. A. Majid Ibrahim, Langsa Barat, Kota Langsa', 'LGS', 1),
	(2, 'Terminal Lhokseumawe', 'Jl. Medan-Banda Aceh, Desa Meunasah Mee, Kec. Muara Dua Kota Lhokseumawe 24355', 'LSW', 2),
	(3, 'Terminal Meulaboh', 'RGM Komplek Terminal Tipe A Meulaboh', 'MLB', 3),
	(4, 'Terminal Batoh', 'Jl. Dr. Ir. T. Moehammad Hasan, Desa Peunyerat, Kec. Banda Raya Kota Banda Aceh 23238', 'BTH', 4),
	(5, 'Terminal Paya Ilang', 'Blang Kolak II, Bebesen, Takengon, Kabupaten Aceh Tengah', 'PYI', 5),
	(6, 'Terminal Tanjung Pinggir', 'Jl. Letda Usmanjah Saragih No.03, Kota Pemantang Siantar 21137', 'TPG', 6),
	(7, 'Terminal Madya Tarutung', 'Jl. Mayjend. D.I. Panjaitan,Hutatoruan X Tarutung,Kab. Tapanuli Utara  22411', 'MTR', 7),
	(8, 'Terminal Sibolga', 'Jl. Sisingamangaraja No.56, Pancuran Gerobak, Sibolga Kota, Kota Sibolga 22513', 'SBG', 8),
	(9, 'Terminal Padang Bulan', 'Jl. Kota H. Adam Malik, Padang Bulan, Rantau Utara, Kabupaten Labuhan Batu', 'PDB', 9),
	(10, 'Terminal Amplas', 'Jl.KH.Rifai A Manaf Lubis Kel. Timbang Deli, Amplas,Kota Medan 20148', 'APS', 10),
	(11, 'Terminal Pinang Baris', 'Jl. Tahi Bonar Simatupang, Lalang, Kec. Medan Sunggal, Kota Medan 20127', 'PNB', 10),
	(12, 'Terminal Anak Air', 'Jl. Anak Air No.20, Lubuk Buaya, Koto Tangah, Kota Padang', 'AAI', 11),
	(13, 'Terminal Kiliran Jao', 'Jln. Lintas Sumatera KM 165 Kiliran Jao, Kab. Sijunjung, Kiliran Jao', 'KJO', 12),
	(14, 'Terminal Bareh Solok', 'Jl. Natsir St. Pamuncak No. 68, Simpang Rumbio Kec.Lubuk Sikarah, Kota Solok, 27316', 'BSL', 13),
	(15, 'Terminal Simpang Aur', 'Jl. Diponegoro No.01 Kel. Tarok Dipo Kec. Guguk Panjang Kota Bukit Tinggi', 'SPA', 14),
	(16, 'Terminal Jati Pariaman', 'Jl. Woltermonginsidi, Ds. Jatimudik, Pariaman Tengah', 'JTP', 15),
	(17, 'Terminal Bangkinang', 'Jl. Prof. Moh. Yamin SH No 281, Kel.Bangkinang, Kec. Bangkinang Kota, Kab.Kampar, 28411', 'BGK', 16),
	(18, 'Terminal Bandar Raya Payung Sekaki', 'Jl. Air Hitam, Kel. Labuh Barat, Kec. Payung Sekaki, Pekanbaru', 'PYK', 17),
	(19, 'Terminal Dumai', 'Jl. Ratu Sima Klakap 7, Kec. Simpang Tetap, Kel. Dumai Barat, Dumai', 'DMI', 18),
	(20, 'Terminal Gerbangsari', 'Jl. Lintas Timur Sumatra, Pematang Reba, Rengat Barat, Kabupaten Indragiri Hulu', 'GBS', 19),
	(21, 'Terminal Alam Barajo', 'Jl. Lingkar Barat III Simpang Rimbo Kota jambi 36124', 'AJO', 20),
	(22, 'Terminal Muara Bungo', 'Jl. Lintas Sumatera KM.04 Arah Padang Kelurahan Manggis Kec. Bathin III Muara Bungo, Kab, Bungo 37215', 'MBU', 21),
	(23, 'Terminal Pulau Tujuh Bangko', 'Jl. Lintas Sumatera KM 07 Desa Langling Kec. Bangko Kab. Merangin  37314', 'BKO', 22),
	(24, 'Terminal Sribulan', 'Jalan Lintas Sumatera KM.05 Desa Bernai Dalam Kec. Sarolangun Kab. Sarolangun 37481', 'SBL', 23),
	(25, 'Terminal Alang-Alang Lebar', 'JL. By Pass Alang-alang Lebar KM.12 Kota Palembang 30154', 'AAL', 24),
	(26, 'Terminal Kayuagung', 'Jl. Kapten H. Sulaiman Raden Anom (Lintas Sumatera) Kab. Ogan Komering Ilir', 'KAG', 25),
	(27, 'Terminal Batu Kuning', 'Jl. Lintas Sumatera No. 61 Kec. Batu Raja Barat Kab. Ogan Komering Ulu 32121', 'BKN', 26),
	(28, 'Terminal Betung', 'Jl. Lintas Palembang-Jambi Kec. Betung, Kabupaten Banyuasin 30958', 'BTG', 27),
	(29, 'Terminal Karya Jaya', 'JL. Sriwijaya Raya KM12 Kel. Karyajaya, Kertapati, Palembang', 'KJY', 24),
	(30, 'Terminal Simpang Periuk', 'Jl. Sultan Mahmud Badarudin II Kel. Simpang Periuk Kec. Lubuk Linggau Selatan II, Kota Lubuk Linggau 31626', 'SPP', 28),
	(31, 'Terminal Batay', 'Jl. Lintas Sumatera KM 14 Batay Kab. Lahat', 'LHT', 29),
	(32, 'Terminal Simpang Nangka', 'Jl. Raya Simpang Nangka,Kec. Selupu Rejang, Rejang Lebong', 'SPN', 30),
	(33, 'Terminal Air Sebakul', 'Jl. Air Sebakul, Pekan Sabtu, Kec. Selebar, Kota Bengkulu', 'ASB', 31),
	(34, 'Terminal Rajabasa', 'Jl ZA Pagar Alam Rajabasa Bandar Lampung', 'RJB', 32),
	(35, 'Terminal Betan Subing', 'Jl. Akses Terminal Betan Subing, Kec. Terbanggi Besar, Lampung Tengah', 'BTS', 33),
	(36, 'Terminal Pakupatan', 'Jl. Raya Jakarta KM. 4 Kel. Banjar Agung Kec. Cipocok Jaya Kota Serang Prov Banten 42124', 'PKT', 34),
	(37, 'Terminal Labuan', 'Jl. Raya Labuan KM 4 Tarogong, Kab. Pandeglang', 'LBN', 35),
	(38, 'Terminal Mandala Lebak', 'Jl. By Pass Soekarno Hatta, Rangkasbitung, Lebak, Banten 42317', 'MLK', 36),
	(39, 'Terminal Merak', 'Jl. RE. Marthadinata Kel. Tamansari, Kec. Pulau Merak, Kota Cilegon', 'MRK', 37),
	(40, 'Terminal Poris Plawad', 'Jl. Benteng Betawi, Kel. Poris Plawad, Kec. Cipondoh, Kota Tangerang, Banten 15141', 'PRP', 38),
	(41, 'Terminal Pondok Cabe', 'Jl. Terminal Pondok Cabe (KH. Salem), Pondok Cabe Udik, Pamulang, Kota Tangerang Selatan', 'PCB', 39),
	(42, 'Terminal KH. Ahmad Sanusi', 'Jl. Lingkar Selatan No.07, Kel. Sudajaya Hilir, Kec. Baros, Kota Sukabumi 43161', 'KAS', 40),
	(43, 'Terminal Ciakar', 'Jl. Prabu Gajah Agung No.10 Desa Jatihurip Kec. Sumedang Utara Kab. Sumedang 45321', 'CKR', 41),
	(44, 'Terminal Guntur Melati Garut', 'Jl. Guntur Sari No.02, Desa Haurpanggung Kec. Tarogong Kidul Kab. Garut 44151', 'GMT', 42),
	(45, 'Terminal Harjamukti', 'Jl. By Pass Jend. Ahmad Yani Kota Cirebon', 'HJM', 43),
	(46, 'Terminal Indihiang', 'Jl. Brigjen Wasita Kusumah Kel. Sukamaju Kidul Kec. Indihiang Kota Tasikmalaya 46151', 'IDH', 44),
	(47, 'Terminal Kertawangunan Kuningan', 'Jl. RE. Martadinata Desa Kertawangunan,Kec. Sindangagung Kab.Kuningan 45573', 'KTW', 45),
	(48, 'Terminal Subang', 'Jl Darmodiharjo 01, Kel. Sukamelang Kec. Subang,Kab Subang 41211', 'SUB', 46),
	(49, 'Terminal Banjar', 'Jl. Mayjen Didi Kartasamita Kel.Banjar Kec. Banjar,Kota Banjar 46311', 'BJR', 47),
	(50, 'Terminal Cikampek', 'Jl. Lingkar Tanjungpura, Palumbonsari, Kab. Karawang', 'CKP', 48),
	(51, 'Terminal Baranangsiang', 'Jl. Raya Pajajaran No.9, Bogor Timur, Kota Bogor', 'BSG', 49),
	(52, 'Terminal Induk Bekasi', 'Jl. Duren Jaya, Bekasi Timur, Kota Bekasi', 'BKS', 50),
	(53, 'Terminal Kalijaya Cikarang', 'Jl. R. Fatahillah, Cikarang Barat, Kabupaten Bekasi', 'CKG', 51),
	(54, 'Terminal Jatijajar', 'Jl. Raya Bogor No.37, Jatijajar, Tapos, Kota Depok', 'JJR', 52),
	(55, 'Terminal Cicaheum', 'Jl. Jendral A Yani Cicaheum Kiaracondong Bandung', 'CHM', 53),
	(56, 'Terminal Leuwipanjang', 'Jl. Soekarno Hatta No. 205 Situsaeur Bojongloa Kidul, Bandung', 'LWP', 53),
	(57, 'Terminal Purworejo', 'Jl. Gajah Mada Desa Candisari Kec. Banyuurip Kab. Purworejo 54171', 'PWJ', 54),
	(58, 'Terminal Cepu', 'Jl. Pramuka By Pass Cepu', 'CPU', 55),
	(59, 'Terminal Bangga Bangun Desa', 'Jl. Jend. Gatot Subroto No. 268 Ds Gunung Simping Kec. Cilacap Tengah Kota Cilacap', 'BBD', 56),
	(60, 'Terminal Giri Adipura', 'Jl. Raya Wonogori-Solo KM.04 Krisak, Selogiri, Kab. Wonogiri 57652', 'GRA', 57),
	(61, 'Terminal Ir. Soekarno', 'Jl. Jombor Indah Tengahan, Buntalan,Kec. Klaten Tengah Kabupaten Klaten 57419', 'SKN', 58),
	(62, 'Terminal Kebumen', 'Jl. Lingkar Selatan KM.01 Kec. Kebumen Kab. Kebumen', 'KBM', 59),
	(63, 'Terminal Mangkang', 'Jl. Urip Sumoharjo KM 17 Kel. Mangkang Kulon, Kec Tugu Kota Semarang 50155', 'MKG', 60),
	(64, 'Terminal Pekalongan', 'Jl. Dr. Sutomo, Desa Gamer Kec. Pekalongan Timur, Kota Pekalongan', 'PKL', 61),
	(65, 'Terminal Induk Pemalang', 'Jl. Slamet Riyadi, Pelutan, Kec. Pemalang, Kab. Pemalang', 'IPM', 62),
	(66, 'Terminal Bulupitu Purwokerto', 'Jl. Suwatio No.48 Kel. Teluk, Kec. Purwokerto Selatan, Kab. Banyumas', 'PWK', 63),
	(67, 'Terminal Mendolo', 'Jl. Bambang Sugeng KM 3 Ds, Mendolo, Kec. Wonosobo Kab. Wonosobo 56311', 'MDL', 64),
	(68, 'Terminal Bawen', 'Jl. Palagan No. 1 Bawen, Kec. Bawen Kab. Semarang', 'BWN', 65),
	(69, 'Terminal Tidar', 'Jl. Soekarno-Hatta Kel. Tidar Utara Kec. Magelang Selatan Kota Magelang', 'TDR', 66),
	(70, 'Terminal Tingkir', 'Jl. Soekarno-Hatta Kel. Tingkir Tengah, Kec. Tingkir, Kota Salatiga', 'TGK', 67),
	(71, 'Terminal Tirtonadi', 'Jl. Ahmad Yani No 262 Kel. Gilingan Kec. Banjarsari Kota Surakarta 57134', 'TTN', 68),
	(72, 'Terminal Jati', 'Jl. AKBP Agil Kusumadya, Jati Wetan, Jati, Kudus', 'JTI', 69),
	(73, 'Terminal Bobot Sari', 'Jl. PP Imam TP Bobotsari, Kec. Purbalingga, Kabupaten Purbalingga', 'BBS', 70),
	(74, 'Terminal Demak', 'Jalan Lingkar Demak, Area Sawah, Jogoloyo, Wonosalam, Kabupaten Demak', 'DMK', 71),
	(75, 'Terminal Tegal', 'Jl. Dr. Cipto Mangunkusumo, Sumurpanggang, Tegal Bar, Kota Tegal', 'TGL', 72),
	(76, 'Terminal Giwangan', 'Jl. Imogiri Timur No. 1 Kel. Giwangan Kec. Umbulharjo Kota Yogyakarta 55163', 'GWN', 73),
	(77, 'Terminal Dhaksinarga', 'Jl. Ir. Darmakun Darmokusumo, Wonosari, Selang, Guningkidul, Kabupaten Gunung Kidul', 'DSG', 74),
	(78, 'Terminal Arjosari', 'Jl. Terusan Raden Intan No.01 Desa Arjosari Kel Arjosari Kec.Blimbing Kota Malang 65126', 'AJS', 75),
	(79, 'Terminal Arya Wiraraja', 'Jl. Arya Wiraraja N0. 10, Kabupaten Sumenep', 'AWJ', 76),
	(80, 'Terminal Bangkalan', 'Jl. Raya Suramadu, Bimas, Burneh, Kabupaten Bangkalan', 'BKL', 77),
	(81, 'Terminal Bayuangga', 'Jl. Raya Bromo, Kel. Triwung Lor, Kec. Pademangan, Probolinggo 67233', 'BYA', 78),
	(82, 'Terminal Gayatri', 'Jl. Yos Sudarso No.117, Kel Karangwaru, Kec. Tulungagung 66217', 'GYT', 79),
	(83, 'Terminal Kertonegoro', 'Jl. Suryo No. 38, Kel. Grudo Kec. Ngawi Kab. Ngawi 63214', 'KNG', 80),
	(84, 'Terminal Pacitan', 'Jl. Gatot Subroto Kel. Baleharjo Kec. Pacitan Kab. Pacitan 63511', 'PCT', 81),
	(85, 'Terminal Patria', 'Jl. Kenari No. 110 Kel. Rembang Kec. Sananwetan Kota Blitar 66135', 'PTR', 82),
	(86, 'Terminal Purboyo', 'Jl.Basuki Rahmat No.01 Kel. Patihan Kec. Manguharjo Kota Madiun 63123', 'PBY', 83),
	(87, 'Terminal Selo Aji', 'Jl.Arief Rahman Hakim No.08 Ponorogo', 'SAJ', 84),
	(88, 'Terminal Tamanan', 'Jl. Semeru No. 55, Kel. Tamanan Kec. Mojoroto Kota Kediri 64116', 'TMN', 85),
	(89, 'Terminal Tawangalun', 'Jl. Dharmawangsa No. 01 Rambi Puji Jember', 'TWA', 86),
	(90, 'Terminal Surodakan', 'Jl. Kimangun Sarkoro, Surodakan, Kab. Trenggalek, Jawa Timur', 'SDK', 87),
	(91, 'Terminal Rajekwesi', 'Jl. Veteran, Sukorejo, Kec. Bojonegoro, Kabupaten Bojonegoro', 'RJW', 88),
	(92, 'Terminal Pandaan Pasuruan', 'Jl. Raya Petungasri No. 08 Kel. Petung Asri, Kec.Pandaan, Kab.Pasuruan Prov. Jawa Timur', 'PSR', 89),
	(93, 'Terminal Kambang Putih', 'Jl. Nasional Tuban Semarang, KM.06, Desa Sugihwaras, Kec. Jenu, Kab. Tuban 62352', 'KPT', 90),
	(94, 'Terminal Sri Tanjung', 'Jl. Raya Situbondo, Kecamatan Situbondo, Bulusan, Kalipuro, Kab. Banyuwangi', 'STJ', 91),
	(95, 'Terminal Osowilangun', 'Jl. Tambak Osowilangun No. 103, Tambak Osowilangun, Benowo, Kota Surabaya', 'OSW', 92),
	(96, 'Terminal Purabaya', 'Jl. Bungurasih Timur, Bungurasih, Waru, Kabupaten Sidoarjo', 'PRB', 93),
	(97, 'Terminal Mengwi', 'Jl. Mengwitani, Badung', 'MGW', 94),
	(98, 'Terminal Mandalika', 'Jl. Sandubaya No.1 Bertais, Kel. Bertais Kec. Sandubaya, Kota Mataram', 'MDK', 95),
	(99, 'Terminal Sumer Payung', 'Jl. Garuda KM 06 Desa Karang Dima Kec. Labuhan Badas Kab. Sumbawa Besar Prov. NTB', 'SPY', 96),
	(100, 'Terminal Dara', 'Jl. Pahlawan Dara Kota Bima', 'DRA', 97),
	(101, 'Terminal Kefamenanu', 'JL Mayjen El Tari Kefamenanu, Kefamenanu Sel, Kota Kefamenanu, Kabupaten Timor Tengah Utara', 'KEF', 98),
	(102, 'Terminal Bimoku', 'Jl. Herman Yohanes Bimoku, Kota Kupang', 'BMK', 99),
	(103, 'Terminal Sei Ambawang', 'Jl. Trans Kalimantan, Sul Ambawang, Kuala, Sungai Ambawang, Kab. Kubu Raya', 'SAB', 100),
	(104, 'Terminal Singkawang', 'Jl. Terminal Induk, Kelurahan Sei Wie Kecamatan Singkawang Tengah, Kota Singkawang', 'SKW', 101),
	(105, 'Terminal W.A. Gara', 'Jl. Mahir Mahar KM.1, Lingkar Luar  Kel Menteng Kec. Jekan Raya, Kota Palangka Raya, Kalimantan Tengah 74874', '-', 102),
	(106, 'Terminal Gambut Barakat', 'Jl. Akses Terminal Gambut Barakat, Kabupaten Banjar', '-', 103),
	(107, 'Terminal Batu Ampar', 'Jl. Pattimura Batu Ampar Balikpapan Utara, Kota Balikpapan', 'BAP', 104),
	(108, 'Terminal Simbuang', 'Jl. Simboro Kecamatan Mamuju Simboro Kec. Simboro Kab. Mamuju', 'SIM', 105),
	(109, 'Terminal Tipalayo', 'Jl. Teuku Umar Rea Timur Desa Rea Kec. Binuang Kab. Polewali Mandar 91311', 'TPL', 106),
	(110, 'Terminal Kasintuwu', 'Jl. P. Diponegoro, Poso Kota Selatan, Kabupaten Poso 94619', 'KSW', 107),
	(111, 'Terminal Mamboro', 'Jl. L. Lanjera, Mamboro, Palu Utara, Kota Palu', 'MBR', 108),
	(112, 'Terminal Boroko', 'Jl. Datoebinangkal Korompot Desa Kuala Kec. Kaidipang Kab. Bolaang Mongondow Utara 95765', 'BRK', 109),
	(113, 'Terminal Liwas', 'Kecamatan Paal Dua, Kota Manado', 'LWS', 110),
	(114, 'Terminal Tangkoko', 'Jl. H. Tumundo, Kel. Manembo-Nembo Atas Kec. Matuari Kota Bitung 95545', 'TKK', 111),
	(115, 'Terminal Bolaang Mongondow', 'Jl. Trans Dulangon km 2 Kab. Bolaang Mongondow', 'MOD', 112),
	(116, 'Terminal Puuwatu', 'Jl. Moh. Yamin, Puuwatu, Kota Kendari', 'PUW', 113),
	(117, 'Terminal Isimu', 'Jl. Amala Mantu Desa Datahu Kec. Tibawa Kab. Gorontalo 96251', 'ISM', 114),
	(118, 'Terminal Dungingi', 'Jl. Beringin, Huangobotu, Dungingi, Kota Gorontalo', 'DII', 115),
	(119, 'Terminal Entrop (ALBN)', 'Jl. Kelapa Dua, Entrop, Kota Jayapura', 'ETR', 116),
	(120, 'Terminal Kampung Rambutan', 'Jl. TB Simatupang No.01, Kel. Rambutan, Kec. Ciracas, Kota Jakarta Timur 13830', 'KPR', 117),
	(121, 'Terminal Kalideres', 'Jl. Daan Mogot No. 15, Kota Jakarta Barat', 'KLD', 118),
	(122, 'Terminal  Pulo Gebang', 'Jl. Pulo Gebang, Cakung, Kota Jakarta Timur, DKI Jakarta', 'PGB', 117),
	(123, 'Terminal Samarinda Seberang', 'Jl. Bung Tomo RT.10 Kel. Baqa Kec. Samarinda Seberang, Kota Samarinda', 'SSB', 119),
	(124, 'Terminal Induk Lumpue', 'Jl. H. Mirdin Kasim Kel. Lumpue Kec. Bacukiki Barat Kota Pare-Pare 91123', 'ILP', 120),
	(125, 'Terminal Latenri Sessu Pekkae', 'Jl. Andi Hajerah No. 1 Kel. Lalolang, Kec. Tanete Rilau, Kab. Barru, Sulawesi Selatan 90761', 'LSP', 121),
	(126, 'Terminal Petta Pongawai', 'Jl. MT. Haryono, Watampone, Kab. Bone', 'PPW', 122),
	(127, 'Terminal Daya', 'Jl. Kapasa Raya, Daya, Biring Kanaya, Kota Makassar', 'DYA', 123);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
