-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 15, 2022 at 05:35 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vocation_followers`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(20) NOT NULL,
  `lastName` varchar(20) NOT NULL,
  `userName` varchar(10) NOT NULL,
  `password` varchar(12) NOT NULL,
  `role` varchar(10) NOT NULL,
  `vacationFollowed` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`vacationFollowed`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `firstName`, `lastName`, `userName`, `password`, `role`, `vacationFollowed`) VALUES
(1, 'Admin', 'Admin', 'Admin', 'Admin1', 'admin', '[]'),
(20, 'just', 'trying', 'justify', 'content', 'user', '[1,7,5]'),
(23, 'Ran', 'Arbook', '121212', '121212', 'user', '[38,2,1,7,6,39]'),
(25, 'Michael', 'Hanegbi', 'michmich', 'mich123', 'user', '[]'),
(29, 'Rafi', 'Reshef', 'rafraf', 'reshresh', 'user', '[6,39,7,1]'),
(30, 'Yuval', 'Ben israel', 'yuvi555', 'yuviyuvi', 'user', '[2,1,39,6,7]'),
(31, 'Daniel', 'Mizrahi', 'danielm664', 'danielmiz', 'user', '[4,6,7,39]');

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationId` int(11) NOT NULL,
  `description` varchar(50) NOT NULL,
  `destination` varchar(20) NOT NULL,
  `imageSrc` varchar(50) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `price` int(11) NOT NULL,
  `followers` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationId`, `description`, `destination`, `imageSrc`, `start`, `end`, `price`, `followers`) VALUES
(1, 'Blue skies, blue ocean, blue cocktails.', 'Aruba', '1232990_aruba.jpg', '2022-09-19', '2022-09-28', 800, 4),
(2, ' Rome was not built in a day', 'Rome', '7780895_rome.jfif', '2022-12-30', '2023-01-04', 210, 2),
(4, 'Visit the holy land, the city of David', 'Jerusalem', '5743598_jerusalem.jpg', '2022-12-09', '2022-12-15', 300, 1),
(5, 'The culture of budha, the monkey temple, Taj Maal', 'India', '4236076_india.jpg', '2023-05-29', '2023-06-14', 441, 1),
(6, 'The sushi country', 'Japan', '840429_japan.jfif', '2022-12-02', '2022-12-08', 730, 4),
(7, 'Beaches, clubs, casinos...', 'Las Vegas', '6179335_las vegas.jfif', '2023-09-06', '2023-09-13', 500, 5),
(39, 'Eiffel and food meet together', 'Paris', '307126_paris.jpg', '2022-12-17', '2023-01-02', 470, 4),
(40, 'The country of the pyramids', 'Egypt', '8537330_egypt.jpg', '2023-02-14', '2023-02-21', 500, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
