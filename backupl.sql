/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.22-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: koktajle
-- ------------------------------------------------------
-- Server version	10.6.22-MariaDB-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cocktail_ingredient`
--

DROP TABLE IF EXISTS `cocktail_ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cocktail_ingredient` (
  `cocktail_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `quantity` decimal(10,1) NOT NULL,
  `unit` enum('kg','ml','piece') DEFAULT NULL,
  PRIMARY KEY (`cocktail_id`,`ingredient_id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `cocktail_ingredient_ibfk_1` FOREIGN KEY (`cocktail_id`) REFERENCES `cocktails` (`id`),
  CONSTRAINT `cocktail_ingredient_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cocktail_ingredient`
--

LOCK TABLES `cocktail_ingredient` WRITE;
/*!40000 ALTER TABLE `cocktail_ingredient` DISABLE KEYS */;
INSERT INTO `cocktail_ingredient` VALUES (19,22,30.0,'ml'),(19,23,50.0,'ml'),(19,24,20.0,'ml'),(20,20,50.0,'ml'),(20,21,10.0,'piece'),(20,22,30.0,'ml'),(20,25,10.0,'ml'),(20,26,100.0,'ml'),(21,25,10.0,'ml'),(21,27,50.0,'ml'),(21,28,3.0,'ml'),(22,23,50.0,'ml'),(22,29,100.0,'ml'),(23,20,50.0,'ml'),(23,30,30.0,'ml'),(24,21,10.0,'piece'),(24,22,30.0,'ml'),(24,25,10.0,'ml'),(24,26,100.0,'ml'),(25,20,50.0,'ml'),(25,21,10.0,'piece'),(25,22,30.0,'ml'),(25,25,10.0,'ml'),(25,26,100.0,'ml'),(28,21,10.0,'piece'),(28,22,30.0,'ml'),(28,25,10.0,'ml'),(28,26,100.0,'ml'),(29,20,50.0,'ml'),(29,21,10.0,'piece'),(29,22,30.0,'ml'),(29,25,10.0,'ml'),(29,26,100.0,'ml'),(30,20,50.0,'ml'),(30,21,10.0,'piece'),(30,22,30.0,'ml'),(30,25,10.0,'ml'),(30,26,100.0,'ml'),(32,20,50.0,'ml'),(32,21,10.0,'piece'),(32,22,30.0,'ml'),(32,25,10.0,'ml'),(32,26,100.0,'ml');
/*!40000 ALTER TABLE `cocktail_ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cocktails`
--

DROP TABLE IF EXISTS `cocktails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cocktails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `category` varchar(30) NOT NULL,
  `recipe` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cocktails`
--

LOCK TABLES `cocktails` WRITE;
/*!40000 ALTER TABLE `cocktails` DISABLE KEYS */;
INSERT INTO `cocktails` VALUES (19,'Margarita','Cocktail with Alcohol','Mix tequila, lime, and triple sec with ice and serve in a salted rim glass'),(20,'Mojito','Cocktail with Alcohol','Mix rum, lime, mint leaves, sugar, and soda water'),(21,'Whiskey Sour','Cocktail with Alcohol','Mix whiskey, lemon juice, sugar, and angostura with ice and shake'),(22,'Tequila Sunrise','Cocktail with Alcohol','Mix tequila, orange juice, and grenadine syrup and serve'),(23,'Pina Colada','Cocktail with Alcohol','Blend rum, coconut cream, pineapple juice, and ice'),(24,'Virgin Mojito','Non-Alcoholic','Mix lime, mint leaves, sugar, and soda water (no alcohol)'),(25,'Mojito','Cocktail with Alcohol','Mix rum, lime, mint leaves, sugar, and soda water'),(28,'Mojito no alcohol','Cocktail with Alcohol','Mix rum, lime, mint leaves, sugar, and soda water'),(29,'Mojito','Cocktail with Alcohol','Mix rum, lime, mint leaves, sugar, and soda water'),(30,'Mojito','Cocktail with Alcohol','Mix rum, lime, mint leaves, sugar, and soda water'),(32,'Mojito','Cocktail with Alcohol','Mix rum, lime, mint leaves, sugar, and soda water');
/*!40000 ALTER TABLE `cocktails` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`user123`@`localhost`*/ /*!50003 trigger delete_before_update before update on cocktails for each row begin delete from cocktail_ingredient where cocktail_id = OLD.id;
end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`user123`@`localhost`*/ /*!50003 TRIGGER delete_cocktail_ingredients_before
BEFORE DELETE ON cocktails
FOR EACH ROW
BEGIN
    DELETE FROM cocktail_ingredient where cocktail_id = OLD.id;
end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `isAlcohol` tinyint(1) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (20,'Rum','Alkoholowy składnik koktajlu',1,'https://example.com/rum.jpg\n'),(21,'Mint','Świeża mięta, składnik koktajlu',0,'https://example.com/mint.jpg\n'),(22,'Lime','Świeży sok z limonki',0,'https://example.com/lime.jpg\n'),(23,'Tequila','Alkoholowy składnik koktajlu',1,'https://example.com/tequila.jpg\n'),(24,'Triple Sec','Likier pomarańczowy, składnik koktajlu',1,'https://example.com/triple-sec.jpg\n'),(25,'Sugar','Słodki składnik do koktajli',0,'https://example.com/sugar.jpg\n'),(26,'Soda Water','Woda gazowana, składnik koktajlu',0,'https://example.com/soda-water.jpg\n'),(27,'Whiskey','Alkoholowy składnik koktajlu',1,'https://example.com/whiskey.jpg\n'),(28,'Angostura','Bitters, składnik koktajlu',1,'https://example.com/angostura.jpg\n'),(29,'Orange Juice','Świeży sok pomarańczowy, składnik koktajlu',0,'https://example.com/orange-juice.jpg\n'),(30,'Coconut Cream','Krem kokosowy, składnik koktajlu',0,'https://example.com/coconut-cream.jpg\n'),(31,'Orange Juice','Świeży sok pomarańczowy, składnik koktajlu',0,'https://example.com/orange-juice.jpg\n'),(32,'Orange Juice','Świeży sok pomarańczowy, składnik koktajlu',0,'https://example.com/orange-juice.jpg\n'),(33,'Orange Juice','Świeży sok pomarańczowy, składnik koktajlu',0,'https://example.com/orange-juice.jpg\n');
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'admin@example.com','$2b$10$jl79ixR8ZXYiVaoKxps5GeDXj6PJ/idsL3D9p9XzE74Bnpiv4fWWi','admin','2025-05-13 11:26:25'),(4,'user@example.com','$2b$10$9fmxGhOI4hG7iHOO4MItP.iFDhn6Yy.ggexWlnwrBgFMoewZtm/yK','user','2025-05-13 11:26:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-02 19:40:54
