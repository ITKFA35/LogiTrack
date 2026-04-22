CREATE DATABASE  IF NOT EXISTS `logitrack` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `logitrack`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: logitrack
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `fahrer`
--

DROP TABLE IF EXISTS `fahrer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fahrer` (
  `Fahrer_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  `Vorname` varchar(100) DEFAULT NULL,
  `Telefon` varchar(50) DEFAULT NULL,
  `Fuehrerschein_Kategorie` varchar(50) DEFAULT NULL,
  `Verfuegbarkeit` varchar(50) DEFAULT NULL,
  `Spezifikationen` text DEFAULT NULL,
  PRIMARY KEY (`Fahrer_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fahrer`
--

LOCK TABLES `fahrer` WRITE;
/*!40000 ALTER TABLE `fahrer` DISABLE KEYS */;
INSERT INTO `fahrer` VALUES (1,'Meier','Hans',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `fahrer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fahrzeuge`
--

DROP TABLE IF EXISTS `fahrzeuge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fahrzeuge` (
  `Fahrzeug_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Kontrollschild` varchar(20) DEFAULT NULL,
  `Seriennummer` varchar(100) DEFAULT NULL,
  `Interne_Nummer` varchar(50) DEFAULT NULL,
  `Fahrzeug_Typ` varchar(50) DEFAULT NULL,
  `Service_Datum` date DEFAULT NULL,
  `MFK_Datum` date DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Fahrzeug_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fahrzeuge`
--

LOCK TABLES `fahrzeuge` WRITE;
/*!40000 ALTER TABLE `fahrzeuge` DISABLE KEYS */;
INSERT INTO `fahrzeuge` VALUES (1,'BE12345',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `fahrzeuge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kunden`
--

DROP TABLE IF EXISTS `kunden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kunden` (
  `Kunden_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Konto_Nr` varchar(50) DEFAULT NULL,
  `Firmenname` varchar(100) DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Vorname` varchar(100) DEFAULT NULL,
  `Adresse` varchar(255) DEFAULT NULL,
  `Ort` varchar(100) DEFAULT NULL,
  `PLZ` varchar(10) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Telefon` varchar(50) DEFAULT NULL,
  `Ansprechperson` varchar(100) DEFAULT NULL,
  `Branche` varchar(100) DEFAULT NULL,
  `Sprache` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Kunden_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kunden`
--

LOCK TABLES `kunden` WRITE;
/*!40000 ALTER TABLE `kunden` DISABLE KEYS */;
INSERT INTO `kunden` VALUES (1,NULL,'Logi AG','Muster','Max',NULL,'Bern',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `kunden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sendungen`
--

DROP TABLE IF EXISTS `sendungen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sendungen` (
  `Sendungen_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Kunden_ID` int(11) DEFAULT NULL,
  `Fahrer_ID` int(11) DEFAULT NULL,
  `Fahrzeug_ID` int(11) DEFAULT NULL,
  `Startadresse` varchar(255) DEFAULT NULL,
  `Zieladresse` varchar(255) DEFAULT NULL,
  `Erfassungsdatum` date DEFAULT NULL,
  `Lieferdatum` date DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `Prioritaet` varchar(50) DEFAULT NULL,
  `Gewicht_Menge` decimal(10,2) DEFAULT NULL,
  `Bemerkung` text DEFAULT NULL,
  `Tracking_Code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Sendungen_ID`),
  KEY `Kunden_ID` (`Kunden_ID`),
  KEY `Fahrer_ID` (`Fahrer_ID`),
  KEY `Fahrzeug_ID` (`Fahrzeug_ID`),
  CONSTRAINT `sendungen_ibfk_1` FOREIGN KEY (`Kunden_ID`) REFERENCES `kunden` (`Kunden_ID`),
  CONSTRAINT `sendungen_ibfk_2` FOREIGN KEY (`Fahrer_ID`) REFERENCES `fahrer` (`Fahrer_ID`),
  CONSTRAINT `sendungen_ibfk_3` FOREIGN KEY (`Fahrzeug_ID`) REFERENCES `fahrzeuge` (`Fahrzeug_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sendungen`
--

LOCK TABLES `sendungen` WRITE;
/*!40000 ALTER TABLE `sendungen` DISABLE KEYS */;
INSERT INTO `sendungen` VALUES (1,1,1,1,'Bern','Zuerich',NULL,NULL,'Geliefert',NULL,NULL,NULL,NULL),(3,1,1,1,'Luzern','Bern',NULL,NULL,'Erfasst',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `sendungen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'logitrack'
--

--
-- Dumping routines for database 'logitrack'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-21 21:18:33
