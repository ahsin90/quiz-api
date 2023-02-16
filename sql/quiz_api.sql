-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Feb 16, 2023 at 10:40 AM
-- Server version: 8.0.31
-- PHP Version: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quiz_api`
--

-- --------------------------------------------------------

--
-- Table structure for table `answersOpt`
--

CREATE TABLE `answersOpt` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRight` tinyint(1) DEFAULT NULL,
  `questionId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int NOT NULL,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `title` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `isMandatory` tinyint(1) NOT NULL DEFAULT '0',
  `quizId` int NOT NULL,
  `order` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `id` int NOT NULL,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('PUBLISH','DRAFT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userAnswers`
--

CREATE TABLE `userAnswers` (
  `id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `quizId` int DEFAULT NULL,
  `questionId` int DEFAULT NULL,
  `answersOptId` int DEFAULT NULL,
  `userId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uuid`, `name`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
(1, '20045bb8-556c-4c36-aec5-c36131cf3fc2', 'John Doe', 'user1@mail.com', '$2b$10$8trCS.0JGLFSuGBKAa9iPuNajIxXJv7o6OS7BSOrh7NBTgd.ceAL.', '2023-02-16 10:39:55', '2023-02-16 10:39:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answersOpt`
--
ALTER TABLE `answersOpt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questionId` (`questionId`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD KEY `quizId` (`quizId`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`);

--
-- Indexes for table `userAnswers`
--
ALTER TABLE `userAnswers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quizId` (`quizId`),
  ADD KEY `questionId` (`questionId`),
  ADD KEY `answersOptId` (`answersOptId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answersOpt`
--
ALTER TABLE `answersOpt`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userAnswers`
--
ALTER TABLE `userAnswers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answersOpt`
--
ALTER TABLE `answersOpt`
  ADD CONSTRAINT `answersOpt_ibfk_1` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quizId`) REFERENCES `quiz` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `userAnswers`
--
ALTER TABLE `userAnswers`
  ADD CONSTRAINT `userAnswers_ibfk_1` FOREIGN KEY (`quizId`) REFERENCES `quiz` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `userAnswers_ibfk_2` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `userAnswers_ibfk_3` FOREIGN KEY (`answersOptId`) REFERENCES `answersOpt` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `userAnswers_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
