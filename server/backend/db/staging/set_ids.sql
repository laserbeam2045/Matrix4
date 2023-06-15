-- phpMyAdmin SQL Dump
-- version 4.0.10.18
-- https://www.phpmyadmin.net
--
-- ホスト: mysql101.phy.lolipop.lan
-- 生成日時: 2021 年 12 月 18 日 20:18
-- サーバのバージョン: 5.6.23-log
-- PHP のバージョン: 5.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- データベース: `LAA0723421-database`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `set_ids`
--

CREATE TABLE IF NOT EXISTS `set_ids` (
  `id` int(255) NOT NULL AUTO_INCREMENT COMMENT '主キー',
  `set_id` varchar(16) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (`id`),
  UNIQUE KEY `set_id` (`set_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='setsテーブルのidを持つテーブル' AUTO_INCREMENT=81 ;

--
-- テーブルのデータのダンプ `set_ids`
--

INSERT INTO `set_ids` (`id`, `set_id`, `createdAt`, `updatedAt`) VALUES
(74, 'ozmkiRCEBnh7ZT83', '2021-12-09 00:45:04', '2021-12-09 00:45:04'),
(78, 'GEO0PuwvgrXdnXVx', '2021-12-09 02:13:42', '2021-12-09 02:13:42'),
(80, 'SiEBuCsBGkm/UUUe', '2021-12-09 02:13:49', '2021-12-09 02:13:49');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
