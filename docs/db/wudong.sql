-- MySQL dump 10.13  Distrib 5.7.10, for osx10.9 (x86_64)
--
-- Host: 127.0.0.1    Database: cool
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `base_sys_conf`
--

DROP TABLE IF EXISTS `base_sys_conf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `base_sys_conf` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `cKey` varchar(255) NOT NULL COMMENT '配置键',
  `cValue` varchar(255) NOT NULL COMMENT '配置值',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_9be195d27767b4485417869c3a` (`cKey`),
  KEY `IDX_905208f206a3ff9fd513421971` (`createTime`),
  KEY `IDX_4c6f27f6ecefe51a5a196a047a` (`updateTime`),
  KEY `IDX_03fc424a2f8093a538730a7ff2` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_conf`
--

LOCK TABLES `base_sys_conf` WRITE;
/*!40000 ALTER TABLE `base_sys_conf` DISABLE KEYS */;
INSERT INTO `base_sys_conf` VALUES (1,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'logKeep','31'),(2,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'recycleKeep','31'),(3,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'init_db_base','time consuming：54ms'),(4,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'init_db_dict','time consuming：27ms'),(5,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'init_db_task','time consuming：4ms'),(6,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'init_menu_base','success');
/*!40000 ALTER TABLE `base_sys_conf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_department`
--

DROP TABLE IF EXISTS `base_sys_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `base_sys_department` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) NOT NULL COMMENT '部门名称',
  `userId` int DEFAULT NULL COMMENT '创建者ID',
  `parentId` int DEFAULT NULL COMMENT '上级部门ID',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `IDX_be4c53cd671384fa588ca9470a` (`createTime`),
  KEY `IDX_ca1473a793961ec55bc0c8d268` (`updateTime`),
  KEY `IDX_f19e8ffd9c62ddb17e76c8b9d7` (`tenantId`),
  KEY `IDX_f5fb5ac30b3609c27af3517727` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_department`
--

LOCK TABLES `base_sys_department` WRITE;
/*!40000 ALTER TABLE `base_sys_department` DISABLE KEYS */;
INSERT INTO `base_sys_department` VALUES (1,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'COOL',NULL,NULL,0),(11,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'开发',NULL,12,2),(12,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'测试',NULL,1,1),(13,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'游客',NULL,1,3);
/*!40000 ALTER TABLE `base_sys_department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_log`
--

DROP TABLE IF EXISTS `base_sys_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `base_sys_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int DEFAULT NULL COMMENT '用户ID',
  `action` varchar(255) NOT NULL COMMENT '行为',
  `ip` varchar(255) DEFAULT NULL COMMENT 'ip',
  `params` json DEFAULT NULL COMMENT '参数',
  PRIMARY KEY (`id`),
  KEY `IDX_c9382b76219a1011f7b8e7bcd1` (`createTime`),
  KEY `IDX_bfd44e885b470da43bcc39aaa7` (`updateTime`),
  KEY `IDX_384bde153859845bf0dcdc00f6` (`tenantId`),
  KEY `IDX_51a2caeb5713efdfcb343a8772` (`userId`),
  KEY `IDX_938f886fb40e163db174b7f6c3` (`action`),
  KEY `IDX_24e18767659f8c7142580893f2` (`ip`)
) ENGINE=InnoDB AUTO_INCREMENT=3637 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_log`
--

LOCK TABLES `base_sys_log` WRITE;
/*!40000 ALTER TABLE `base_sys_log` DISABLE KEYS */;
INSERT INTO `base_sys_log` VALUES (1,'2026-06-21 22:40:34','2026-06-21 22:40:34',NULL,NULL,'/','127.0.0.1','{}'),(2,'2026-06-21 22:42:16','2026-06-21 22:42:16',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3,'2026-06-21 22:42:16','2026-06-21 22:42:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(4,'2026-06-21 22:42:18','2026-06-21 22:42:18',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(5,'2026-06-21 22:42:18','2026-06-21 22:42:18',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(6,'2026-06-21 22:42:18','2026-06-21 22:42:18',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(7,'2026-06-21 22:42:25','2026-06-21 22:42:25',NULL,NULL,'/admin/base/open/refreshToken','127.0.0.1','{\"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsInJvbGVJZHMiOlsxXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjo3LCJ0ZW5hbnRJZCI6bnVsbCwiaWF0IjoxNzgxOTQwNjg3LCJleHAiOjE3ODMyMzY2ODd9.y5uCfBmDiOyMBL-9KUSQndLKzv0HjxkDHrF1Ytvslxg\"}'),(8,'2026-06-21 22:43:19','2026-06-21 22:43:19',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(9,'2026-06-21 22:43:19','2026-06-21 22:43:19',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(10,'2026-06-21 22:43:19','2026-06-21 22:43:19',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(11,'2026-06-21 22:43:20','2026-06-21 22:43:20',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(12,'2026-06-21 22:43:34','2026-06-21 22:43:34',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"8c1c38d0-6d7f-11f1-ba7a-ab84348dc3be\", \"verifyCode\": \"weqi\"}'),(13,'2026-06-21 22:43:34','2026-06-21 22:43:34',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(14,'2026-06-21 22:43:39','2026-06-21 22:43:39',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"944378c0-6d7f-11f1-ba7a-ab84348dc3be\", \"verifyCode\": \"c7jy\"}'),(15,'2026-06-21 22:43:39','2026-06-21 22:43:39',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(16,'2026-06-21 22:43:39','2026-06-21 22:43:39',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(17,'2026-06-21 22:43:39','2026-06-21 22:43:39',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(18,'2026-06-21 22:43:51','2026-06-21 22:43:51',NULL,1,'/admin/dict/type/page','127.0.0.1','{\"page\": 1, \"size\": 50, \"sort\": \"asc\", \"order\": \"createTime\", \"keyWord\": \"\"}'),(19,'2026-06-21 22:43:51','2026-06-21 22:43:51',NULL,1,'/admin/dict/info/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"orderNum\", \"typeId\": 19}'),(20,'2026-06-21 22:43:51','2026-06-21 22:43:51',NULL,1,'/admin/dict/info/data','127.0.0.1','{\"types\": [\"brand\"]}'),(21,'2026-06-21 22:43:52','2026-06-21 22:43:52',NULL,1,'/admin/space/type/page','127.0.0.1','{\"page\": 1, \"size\": 50, \"sort\": \"asc\", \"order\": \"createTime\", \"keyWord\": \"\"}'),(22,'2026-06-21 22:44:17','2026-06-21 22:44:17',NULL,1,'/admin/space/type/add','127.0.0.1','{\"name\": \"商品图片\"}'),(23,'2026-06-21 22:44:17','2026-06-21 22:44:17',NULL,1,'/admin/space/type/page','127.0.0.1','{\"page\": 1, \"size\": 50, \"sort\": \"asc\", \"order\": \"createTime\", \"keyWord\": \"\"}'),(24,'2026-06-21 22:44:17','2026-06-21 22:44:17',NULL,1,'/admin/space/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"total\": 0, \"classifyId\": 1}'),(25,'2026-06-21 22:44:22','2026-06-21 22:44:22',NULL,1,'/admin/base/comm/uploadMode','127.0.0.1','{}'),(26,'2026-06-21 22:44:22','2026-06-21 22:44:22',NULL,1,'/admin/base/comm/upload','127.0.0.1','{}'),(27,'2026-06-21 22:44:22','2026-06-21 22:44:22',NULL,1,'/admin/space/info/add','127.0.0.1','{\"key\": \"%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260616164039_100_137_8def19dc40e14d7db822bb5ab7b0340d.jpg\", \"uid\": 1782053062598, \"url\": \"http://127.0.0.1:8001/upload/20260621/微信图片_20260616164039_100_137_8def19dc40e14d7db822bb5ab7b0340d.jpg\", \"name\": \"微信图片_20260616164039_100_137.jpg\", \"size\": 2388725, \"type\": \"image\", \"error\": \"\", \"fileId\": \"8def19dc40e14d7db822bb5ab7b0340d\", \"preload\": \"blob:http://localhost:9000/66279277-1a6a-4e77-ac90-f610b54037ed\", \"progress\": 100, \"classifyId\": 1}'),(28,'2026-06-21 22:44:29','2026-06-21 22:44:29',NULL,1,'/admin/space/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"total\": 0, \"classifyId\": 1}'),(29,'2026-06-21 22:44:32','2026-06-21 22:44:32',NULL,1,'/admin/recycle/data/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(30,'2026-06-21 22:44:37','2026-06-21 22:44:37',NULL,1,'/admin/task/info/page','127.0.0.1','{\"page\": 1, \"size\": 100}'),(31,'2026-06-21 22:45:07','2026-06-21 22:45:07',NULL,1,'/admin/recycle/data/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(32,'2026-06-22 00:15:21','2026-06-22 00:15:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(33,'2026-06-22 00:15:21','2026-06-22 00:15:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(34,'2026-06-22 00:15:21','2026-06-22 00:15:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(35,'2026-06-22 07:02:45','2026-06-22 07:02:45',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(36,'2026-06-22 07:02:45','2026-06-22 07:02:45',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(37,'2026-06-22 07:02:45','2026-06-22 07:02:45',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(38,'2026-06-22 07:02:45','2026-06-22 07:02:45',NULL,NULL,'/admin/base/open/refreshToken','127.0.0.1','{\"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsInJvbGVJZHMiOlsxXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjo3LCJ0ZW5hbnRJZCI6bnVsbCwiaWF0IjoxNzgyMDUzMDE5LCJleHAiOjE3ODMzNDkwMTl9.WlG10pfdCnk6R_4e9tnDzhjPmrGxZzxZ9PLH_lwilvY\"}'),(39,'2026-06-22 07:02:45','2026-06-22 07:02:45',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(40,'2026-06-22 07:02:45','2026-06-22 07:02:45',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(41,'2026-06-22 07:02:45','2026-06-22 07:02:45',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(42,'2026-06-22 07:21:21','2026-06-22 07:21:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(43,'2026-06-22 07:21:21','2026-06-22 07:21:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(44,'2026-06-22 07:21:21','2026-06-22 07:21:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(45,'2026-06-22 07:21:21','2026-06-22 07:21:21',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(46,'2026-06-22 07:21:21','2026-06-22 07:21:21',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(47,'2026-06-22 07:21:22','2026-06-22 07:21:22',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(48,'2026-06-22 07:21:39','2026-06-22 07:21:39',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(49,'2026-06-22 07:21:42','2026-06-22 07:21:42',NULL,1,'/admin/plugin/info/page','127.0.0.1','{\"size\": 1000}'),(50,'2026-06-22 07:21:44','2026-06-22 07:21:44',NULL,1,'/admin/dict/type/page','127.0.0.1','{\"page\": 1, \"size\": 50, \"sort\": \"asc\", \"order\": \"createTime\", \"keyWord\": \"\"}'),(51,'2026-06-22 07:21:44','2026-06-22 07:21:44',NULL,1,'/admin/dict/info/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"orderNum\", \"typeId\": 19}'),(52,'2026-06-22 07:21:44','2026-06-22 07:21:44',NULL,1,'/admin/dict/info/data','127.0.0.1','{\"types\": [\"brand\"]}'),(53,'2026-06-22 07:21:46','2026-06-22 07:21:46',NULL,1,'/admin/space/type/page','127.0.0.1','{\"page\": 1, \"size\": 50, \"sort\": \"asc\", \"order\": \"createTime\", \"keyWord\": \"\"}'),(54,'2026-06-22 07:21:46','2026-06-22 07:21:46',NULL,1,'/admin/space/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"total\": 0, \"classifyId\": 1}'),(55,'2026-06-22 07:21:47','2026-06-22 07:21:47',NULL,1,'/admin/recycle/data/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(56,'2026-06-22 07:21:50','2026-06-22 07:21:50',NULL,1,'/admin/base/sys/department/list','127.0.0.1','{}'),(57,'2026-06-22 07:21:50','2026-06-22 07:21:50',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [1, 12, 11, 13]}'),(58,'2026-06-22 07:21:51','2026-06-22 07:21:51',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(59,'2026-06-22 07:21:51','2026-06-22 07:21:51',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(60,'2026-06-22 07:21:51','2026-06-22 07:21:51',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(61,'2026-06-22 07:21:52','2026-06-22 07:21:52',NULL,1,'/admin/base/sys/role/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(62,'2026-06-22 07:21:54','2026-06-22 07:21:54',NULL,1,'/admin/base/sys/param/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(63,'2026-06-22 07:21:55','2026-06-22 07:21:55',NULL,1,'/admin/base/sys/log/getKeep','127.0.0.1','{}'),(64,'2026-06-22 07:21:55','2026-06-22 07:21:55',NULL,1,'/admin/base/sys/log/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(65,'2026-06-22 07:22:34','2026-06-22 07:22:34',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [12, 11]}'),(66,'2026-06-22 07:22:35','2026-06-22 07:22:35',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [11]}'),(67,'2026-06-22 07:22:36','2026-06-22 07:22:36',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [13]}'),(68,'2026-06-22 07:22:38','2026-06-22 07:22:38',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [12, 11]}'),(69,'2026-06-22 07:22:39','2026-06-22 07:22:39',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [11]}'),(70,'2026-06-22 07:22:40','2026-06-22 07:22:40',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [13]}'),(71,'2026-06-22 07:22:40','2026-06-22 07:22:40',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [11]}'),(72,'2026-06-22 07:22:41','2026-06-22 07:22:41',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [12, 11]}'),(73,'2026-06-22 07:22:42','2026-06-22 07:22:42',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [11]}'),(74,'2026-06-22 07:22:43','2026-06-22 07:22:43',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [13]}'),(75,'2026-06-22 07:22:43','2026-06-22 07:22:43',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [12, 11]}'),(76,'2026-06-22 07:22:44','2026-06-22 07:22:44',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [11]}'),(77,'2026-06-22 07:22:45','2026-06-22 07:22:45',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [13]}'),(78,'2026-06-22 07:22:45','2026-06-22 07:22:45',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [12, 11]}'),(79,'2026-06-22 07:22:46','2026-06-22 07:22:46',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [11]}'),(80,'2026-06-22 07:22:47','2026-06-22 07:22:47',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [13]}'),(81,'2026-06-22 08:01:52','2026-06-22 08:01:52',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(82,'2026-06-22 08:01:52','2026-06-22 08:01:52',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(83,'2026-06-22 08:01:52','2026-06-22 08:01:52',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(84,'2026-06-22 08:01:52','2026-06-22 08:01:52',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(85,'2026-06-22 08:01:52','2026-06-22 08:01:52',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(86,'2026-06-22 08:01:52','2026-06-22 08:01:52',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(87,'2026-06-22 09:07:55','2026-06-22 09:07:55',NULL,NULL,'/api/merchant/page','::1','{\"pageNo\": \"1\", \"pageSize\": \"10\"}'),(88,'2026-06-22 09:08:21','2026-06-22 09:08:21',NULL,NULL,'/api/sys/swagger','::1','{}'),(89,'2026-06-22 09:08:21','2026-06-22 09:08:21',NULL,NULL,'/api/merchant/list','::1','{}'),(90,'2026-06-22 09:08:35','2026-06-22 09:08:35',NULL,NULL,'/api/demo/goods/page','::1','{\"pageNo\": \"1\", \"pageSize\": \"1\"}'),(91,'2026-06-22 09:08:52','2026-06-22 09:08:52',NULL,NULL,'/','::1','{}'),(92,'2026-06-22 09:09:25','2026-06-22 09:09:25',NULL,NULL,'/api/admin/merchant/page','::1','{}'),(93,'2026-06-22 09:10:13','2026-06-22 09:10:13',NULL,NULL,'/open/login','::1','{\"password\": \"admin123\", \"username\": \"admin\"}'),(94,'2026-06-22 09:10:38','2026-06-22 09:10:38',NULL,NULL,'/open/login','::1','{\"password\": \"admin123\", \"username\": \"admin\"}'),(95,'2026-06-22 09:12:44','2026-06-22 09:12:44',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"admin123\", \"username\": \"admin\"}'),(96,'2026-06-22 09:13:17','2026-06-22 09:13:17',NULL,NULL,'/admin/base/open/captcha','::1','{\"color\": \"#fff\", \"width\": \"150\", \"height\": \"50\"}'),(97,'2026-06-22 09:15:15','2026-06-22 09:15:15',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"width\": \"150\", \"height\": \"50\"}'),(98,'2026-06-22 09:15:28','2026-06-22 09:15:28',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"width\": \"150\", \"height\": \"50\"}'),(99,'2026-06-22 09:16:19','2026-06-22 09:16:19',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"width\": \"150\", \"height\": \"50\"}'),(100,'2026-06-22 09:17:33','2026-06-22 09:17:33',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"width\": \"150\", \"height\": \"50\"}'),(101,'2026-06-22 09:17:33','2026-06-22 09:17:33',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"admin123\", \"username\": \"admin\", \"captchaId\": \"25c99f10-6dd8-11f1-8a0d-31440824481e\", \"verifyCode\": 1234}'),(102,'2026-06-22 09:17:34','2026-06-22 09:17:34',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"admin123\", \"username\": \"admin\", \"captchaId\": \"25c99f10-6dd8-11f1-8a0d-31440824481e\", \"verifyCode\": 5678}'),(103,'2026-06-22 09:17:34','2026-06-22 09:17:34',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"admin123\", \"username\": \"admin\", \"captchaId\": \"25c99f10-6dd8-11f1-8a0d-31440824481e\", \"verifyCode\": 0}'),(104,'2026-06-22 09:17:34','2026-06-22 09:17:34',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"admin123\", \"username\": \"admin\", \"captchaId\": \"25c99f10-6dd8-11f1-8a0d-31440824481e\", \"verifyCode\": 1111}'),(105,'2026-06-22 09:17:46','2026-06-22 09:17:46',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"width\": \"150\", \"height\": \"50\"}'),(106,'2026-06-22 09:17:46','2026-06-22 09:17:46',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"admin123\", \"username\": \"admin\", \"captchaId\": \"2d6085e0-6dd8-11f1-8a0d-31440824481e\", \"verifyCode\": \"0\"}'),(107,'2026-06-22 09:18:41','2026-06-22 09:18:41',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"width\": \"150\", \"height\": \"50\"}'),(108,'2026-06-22 09:19:10','2026-06-22 09:19:10',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"width\": \"150\", \"height\": \"50\"}'),(109,'2026-06-22 09:26:21','2026-06-22 09:26:21',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"width\": \"150\", \"height\": \"50\"}'),(110,'2026-06-22 09:27:10','2026-06-22 09:27:10',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"any\", \"verifyCode\": \"0\"}'),(111,'2026-06-22 09:27:26','2026-06-22 09:27:26',NULL,1,'/admin/merchant/page','::1','{\"pageNo\": 1, \"pageSize\": 10}'),(112,'2026-06-22 09:27:52','2026-06-22 09:27:52',NULL,1,'/admin/merchant/page','::1','{}'),(113,'2026-06-22 09:42:33','2026-06-22 09:42:33',NULL,NULL,'/','::1','{}'),(114,'2026-06-22 09:42:54','2026-06-22 09:42:54',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"any\", \"verifyCode\": \"0\"}'),(115,'2026-06-22 09:42:55','2026-06-22 09:42:55',NULL,1,'/admin/merchant/page','::1','{\"pageNo\": 1, \"pageSize\": 10}'),(116,'2026-06-22 09:45:21','2026-06-22 09:45:21',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"x\", \"verifyCode\": \"x\"}'),(117,'2026-06-22 09:45:21','2026-06-22 09:45:21',NULL,1,'/admin/demo/goods/page','::1','{\"pageNo\": 1, \"pageSize\": 1}'),(118,'2026-06-22 09:45:22','2026-06-22 09:45:22',NULL,1,'/admin/dict/type/page','::1','{\"pageNo\": \"1\", \"pageSize\": \"1\"}'),(119,'2026-06-22 09:50:40','2026-06-22 09:50:40',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"x\", \"verifyCode\": \"x\"}'),(120,'2026-06-22 09:50:40','2026-06-22 09:50:40',NULL,1,'/admin/merchant/page','::1','{\"pageNo\": 1, \"pageSize\": 10}'),(121,'2026-06-22 09:53:12','2026-06-22 09:53:12',NULL,NULL,'/','::1','{}'),(122,'2026-06-22 09:53:28','2026-06-22 09:53:28',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"x\", \"verifyCode\": \"x\"}'),(123,'2026-06-22 09:53:29','2026-06-22 09:53:29',NULL,1,'/admin/merchant/page','::1','{\"pageNo\": 1, \"pageSize\": 10}'),(124,'2026-06-22 09:53:29','2026-06-22 09:53:29',NULL,1,'/admin/merchant/list','::1','{}'),(125,'2026-06-22 09:55:16','2026-06-22 09:55:16',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"x\", \"verifyCode\": \"x\"}'),(126,'2026-06-22 09:55:16','2026-06-22 09:55:16',NULL,1,'/admin/merchant/page','::1','{\"pageNo\": 1, \"pageSize\": 10}'),(127,'2026-06-22 09:55:55','2026-06-22 09:55:55',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"x\", \"verifyCode\": \"x\"}'),(128,'2026-06-22 09:55:55','2026-06-22 09:55:55',NULL,1,'/admin/merchant/add','::1','{\"shopName\": \"测试商店\", \"moduleType\": 1, \"contactName\": \"张三\", \"contactPhone\": \"13800138000\"}'),(129,'2026-06-22 09:55:55','2026-06-22 09:55:55',NULL,1,'/admin/merchant/page','::1','{\"pageNo\": 1, \"pageSize\": 10}'),(130,'2026-06-22 09:55:55','2026-06-22 09:55:55',NULL,1,'/admin/merchant/info','::1','{\"id\": \"1\"}'),(131,'2026-06-22 09:55:56','2026-06-22 09:55:56',NULL,1,'/admin/merchant/update','::1','{\"id\": 1, \"shopName\": \"更新后的店铺名\"}'),(132,'2026-06-22 09:55:56','2026-06-22 09:55:56',NULL,1,'/admin/merchant/delete','::1','{\"ids\": [1]}'),(133,'2026-06-22 09:55:56','2026-06-22 09:55:56',NULL,1,'/admin/merchant/page','::1','{\"pageNo\": 1, \"pageSize\": 10}'),(134,'2026-06-22 09:57:10','2026-06-22 09:57:10',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"x\", \"verifyCode\": \"x\"}'),(135,'2026-06-22 09:57:10','2026-06-22 09:57:10',NULL,1,'/admin/merchant/add','::1','{\"shopName\": \"测试商店\", \"moduleType\": 1, \"contactName\": \"张三\", \"contactPhone\": \"13800138000\"}'),(136,'2026-06-22 09:57:34','2026-06-22 09:57:34',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"x\", \"verifyCode\": \"x\"}'),(137,'2026-06-22 09:57:34','2026-06-22 09:57:34',NULL,1,'/admin/merchant/page','::1','{\"pageNo\": 1, \"pageSize\": 10}'),(138,'2026-06-22 09:57:34','2026-06-22 09:57:34',NULL,1,'/admin/merchant/info','::1','{\"id\": \"1\"}'),(139,'2026-06-22 09:57:34','2026-06-22 09:57:34',NULL,1,'/admin/merchant/update','::1','{\"id\": 1, \"status\": 0, \"shopName\": \"新店铺名称\"}'),(140,'2026-06-22 09:57:34','2026-06-22 09:57:34',NULL,1,'/admin/merchant/page','::1','{\"pageNo\": 1, \"keyWord\": \"店铺\", \"pageSize\": 10}'),(141,'2026-06-22 09:57:34','2026-06-22 09:57:34',NULL,1,'/admin/merchant/page','::1','{\"pageNo\": 1, \"pageSize\": 10, \"moduleType\": 1}'),(142,'2026-06-22 09:57:34','2026-06-22 09:57:34',NULL,1,'/admin/merchant/delete','::1','{\"ids\": [1]}'),(143,'2026-06-22 09:57:34','2026-06-22 09:57:34',NULL,1,'/admin/merchant/page','::1','{\"pageNo\": 1, \"pageSize\": 10}'),(144,'2026-06-22 09:59:37','2026-06-22 09:59:37',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"x\", \"verifyCode\": \"x\"}'),(145,'2026-06-22 10:05:18','2026-06-22 10:05:18',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(146,'2026-06-22 10:05:18','2026-06-22 10:05:18',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(147,'2026-06-22 10:05:18','2026-06-22 10:05:18',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(148,'2026-06-22 10:05:19','2026-06-22 10:05:19',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(149,'2026-06-22 10:05:19','2026-06-22 10:05:19',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(150,'2026-06-22 10:05:19','2026-06-22 10:05:19',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(151,'2026-06-22 10:05:20','2026-06-22 10:05:20',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(152,'2026-06-22 10:05:30','2026-06-22 10:05:30',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"d25ec6f0-6dde-11f1-8994-5fc560b3d761\", \"verifyCode\": \"vuvz\"}'),(153,'2026-06-22 10:05:30','2026-06-22 10:05:30',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(154,'2026-06-22 10:05:30','2026-06-22 10:05:30',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(155,'2026-06-22 10:05:30','2026-06-22 10:05:30',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(156,'2026-06-22 10:16:55','2026-06-22 10:16:55',NULL,NULL,'/','::1','{}'),(157,'2026-06-22 13:08:59','2026-06-22 13:08:59',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(158,'2026-06-22 13:08:59','2026-06-22 13:08:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(159,'2026-06-22 13:09:05','2026-06-22 13:09:05',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(160,'2026-06-22 13:09:05','2026-06-22 13:09:05',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(161,'2026-06-22 13:09:05','2026-06-22 13:09:05',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(162,'2026-06-22 13:09:05','2026-06-22 13:09:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(163,'2026-06-22 13:09:11','2026-06-22 13:09:11',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(164,'2026-06-22 13:09:30','2026-06-22 13:09:30',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"819dde80-6df8-11f1-8e4e-23bbb825eebb\", \"verifyCode\": \"zx8o\"}'),(165,'2026-06-22 13:09:30','2026-06-22 13:09:30',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(166,'2026-06-22 13:09:30','2026-06-22 13:09:30',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(167,'2026-06-22 13:09:30','2026-06-22 13:09:30',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(168,'2026-06-22 13:13:43','2026-06-22 13:13:43',NULL,1,'/admin/plugin/info/page','127.0.0.1','{\"size\": 1000}'),(169,'2026-06-22 13:13:54','2026-06-22 13:13:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(170,'2026-06-22 13:13:54','2026-06-22 13:13:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(171,'2026-06-22 13:13:54','2026-06-22 13:13:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(172,'2026-06-22 13:16:48','2026-06-22 13:16:48',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(173,'2026-06-22 13:16:48','2026-06-22 13:16:48',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(174,'2026-06-22 13:16:48','2026-06-22 13:16:48',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(175,'2026-06-22 13:18:10','2026-06-22 13:18:10',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(176,'2026-06-22 13:18:10','2026-06-22 13:18:10',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(177,'2026-06-22 13:18:10','2026-06-22 13:18:10',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(178,'2026-06-22 13:20:36','2026-06-22 13:20:36',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(179,'2026-06-22 13:20:36','2026-06-22 13:20:36',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(180,'2026-06-22 13:20:36','2026-06-22 13:20:36',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(181,'2026-06-22 13:20:39','2026-06-22 13:20:39',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(182,'2026-06-22 13:20:39','2026-06-22 13:20:39',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(183,'2026-06-22 13:20:39','2026-06-22 13:20:39',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(184,'2026-06-22 13:20:39','2026-06-22 13:20:39',NULL,1,'/admin/plugin/info/page','127.0.0.1','{\"size\": 1000}'),(185,'2026-06-22 13:22:35','2026-06-22 13:22:35',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(186,'2026-06-22 13:22:35','2026-06-22 13:22:35',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(187,'2026-06-22 13:22:35','2026-06-22 13:22:35',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(188,'2026-06-22 13:22:39','2026-06-22 13:22:39',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(189,'2026-06-22 13:22:39','2026-06-22 13:22:39',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(190,'2026-06-22 13:22:39','2026-06-22 13:22:39',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(191,'2026-06-22 13:22:39','2026-06-22 13:22:39',NULL,1,'/admin/plugin/info/page','127.0.0.1','{\"size\": 1000}'),(192,'2026-06-22 13:23:58','2026-06-22 13:23:58',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(193,'2026-06-22 13:23:58','2026-06-22 13:23:58',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(194,'2026-06-22 13:23:58','2026-06-22 13:23:58',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(195,'2026-06-22 13:24:29','2026-06-22 13:24:29',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(196,'2026-06-22 13:24:29','2026-06-22 13:24:29',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(197,'2026-06-22 13:24:29','2026-06-22 13:24:29',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(198,'2026-06-22 13:24:29','2026-06-22 13:24:29',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(199,'2026-06-22 13:24:29','2026-06-22 13:24:29',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(200,'2026-06-22 13:24:29','2026-06-22 13:24:29',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(201,'2026-06-22 13:24:36','2026-06-22 13:24:36',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(202,'2026-06-22 13:24:36','2026-06-22 13:24:36',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(203,'2026-06-22 13:24:36','2026-06-22 13:24:36',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(204,'2026-06-22 13:24:40','2026-06-22 13:24:40',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(205,'2026-06-22 13:24:40','2026-06-22 13:24:40',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(206,'2026-06-22 13:24:40','2026-06-22 13:24:40',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(207,'2026-06-22 13:24:40','2026-06-22 13:24:40',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(208,'2026-06-22 13:24:40','2026-06-22 13:24:40',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(209,'2026-06-22 13:24:40','2026-06-22 13:24:40',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(210,'2026-06-22 13:25:17','2026-06-22 13:25:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(211,'2026-06-22 13:25:17','2026-06-22 13:25:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(212,'2026-06-22 13:25:17','2026-06-22 13:25:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(213,'2026-06-22 13:25:17','2026-06-22 13:25:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(214,'2026-06-22 13:25:17','2026-06-22 13:25:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(215,'2026-06-22 13:25:17','2026-06-22 13:25:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(216,'2026-06-22 13:26:38','2026-06-22 13:26:38',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(217,'2026-06-22 13:26:38','2026-06-22 13:26:38',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(218,'2026-06-22 13:26:38','2026-06-22 13:26:38',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(219,'2026-06-22 13:27:16','2026-06-22 13:27:16',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(220,'2026-06-22 13:27:16','2026-06-22 13:27:16',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(221,'2026-06-22 13:27:16','2026-06-22 13:27:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(222,'2026-06-22 13:27:20','2026-06-22 13:27:20',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(223,'2026-06-22 13:27:20','2026-06-22 13:27:20',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(224,'2026-06-22 13:27:20','2026-06-22 13:27:20',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(225,'2026-06-22 13:27:20','2026-06-22 13:27:20',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(226,'2026-06-22 13:27:20','2026-06-22 13:27:20',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(227,'2026-06-22 13:27:20','2026-06-22 13:27:20',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(228,'2026-06-22 13:27:35','2026-06-22 13:27:35',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(229,'2026-06-22 13:27:35','2026-06-22 13:27:35',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(230,'2026-06-22 13:27:35','2026-06-22 13:27:35',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(231,'2026-06-22 13:28:43','2026-06-22 13:28:43',NULL,1,'/admin/base/comm/logout','127.0.0.1','{}'),(232,'2026-06-22 13:28:43','2026-06-22 13:28:43',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(233,'2026-06-22 13:29:05','2026-06-22 13:29:05',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"3bba4cc0-6dfb-11f1-8e4e-23bbb825eebb\", \"verifyCode\": \"fw81\"}'),(234,'2026-06-22 13:29:05','2026-06-22 13:29:05',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(235,'2026-06-22 13:29:10','2026-06-22 13:29:10',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"490a0b90-6dfb-11f1-8e4e-23bbb825eebb\", \"verifyCode\": \"yihg\"}'),(236,'2026-06-22 13:29:10','2026-06-22 13:29:10',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(237,'2026-06-22 13:29:10','2026-06-22 13:29:10',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(238,'2026-06-22 13:29:10','2026-06-22 13:29:10',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(239,'2026-06-22 13:29:48','2026-06-22 13:29:48',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(240,'2026-06-22 13:29:48','2026-06-22 13:29:48',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(241,'2026-06-22 13:29:48','2026-06-22 13:29:48',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(242,'2026-06-22 13:31:04','2026-06-22 13:31:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(243,'2026-06-22 13:31:04','2026-06-22 13:31:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(244,'2026-06-22 13:31:04','2026-06-22 13:31:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(245,'2026-06-22 13:31:08','2026-06-22 13:31:08',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(246,'2026-06-22 13:31:08','2026-06-22 13:31:08',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(247,'2026-06-22 13:31:08','2026-06-22 13:31:08',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(248,'2026-06-22 13:31:08','2026-06-22 13:31:08',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(249,'2026-06-22 13:31:08','2026-06-22 13:31:08',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(250,'2026-06-22 13:31:08','2026-06-22 13:31:08',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(251,'2026-06-22 13:31:25','2026-06-22 13:31:25',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(252,'2026-06-22 13:31:25','2026-06-22 13:31:25',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(253,'2026-06-22 13:31:25','2026-06-22 13:31:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(254,'2026-06-22 13:31:36','2026-06-22 13:31:36',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{}'),(255,'2026-06-22 13:31:57','2026-06-22 13:31:57',NULL,1,'/admin/base/comm/logout','127.0.0.1','{}'),(256,'2026-06-22 13:31:57','2026-06-22 13:31:57',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(257,'2026-06-22 13:32:09','2026-06-22 13:32:09',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(258,'2026-06-22 13:32:09','2026-06-22 13:32:09',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(259,'2026-06-22 13:32:09','2026-06-22 13:32:09',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(260,'2026-06-22 13:32:13','2026-06-22 13:32:13',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(261,'2026-06-22 13:35:28','2026-06-22 13:35:28',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(262,'2026-06-22 13:35:28','2026-06-22 13:35:28',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(263,'2026-06-22 13:35:28','2026-06-22 13:35:28',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(264,'2026-06-22 14:29:04','2026-06-22 14:29:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(265,'2026-06-22 14:29:04','2026-06-22 14:29:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(266,'2026-06-22 14:29:04','2026-06-22 14:29:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(267,'2026-06-22 14:29:07','2026-06-22 14:29:07',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(268,'2026-06-22 14:29:21','2026-06-22 14:29:21',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(269,'2026-06-22 14:29:23','2026-06-22 14:29:23',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"b43efc60-6e03-11f1-8e4e-23bbb825eebb\", \"verifyCode\": \"iurl\"}'),(270,'2026-06-22 14:29:23','2026-06-22 14:29:23',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(271,'2026-06-22 14:29:23','2026-06-22 14:29:23',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(272,'2026-06-22 14:29:23','2026-06-22 14:29:23',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(273,'2026-06-22 14:31:24','2026-06-22 14:31:24',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(274,'2026-06-22 14:31:24','2026-06-22 14:31:24',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(275,'2026-06-22 14:31:24','2026-06-22 14:31:24',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(276,'2026-06-22 14:33:42','2026-06-22 14:33:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(277,'2026-06-22 14:33:42','2026-06-22 14:33:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(278,'2026-06-22 14:33:42','2026-06-22 14:33:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(279,'2026-06-22 14:33:46','2026-06-22 14:33:46',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(280,'2026-06-22 14:33:46','2026-06-22 14:33:46',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(281,'2026-06-22 14:33:46','2026-06-22 14:33:46',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(282,'2026-06-22 14:33:46','2026-06-22 14:33:46',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(283,'2026-06-22 14:33:46','2026-06-22 14:33:46',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(284,'2026-06-22 14:33:46','2026-06-22 14:33:46',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(285,'2026-06-22 14:38:09','2026-06-22 14:38:09',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(286,'2026-06-22 14:38:09','2026-06-22 14:38:09',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(287,'2026-06-22 14:38:09','2026-06-22 14:38:09',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(288,'2026-06-22 14:41:23','2026-06-22 14:41:23',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(289,'2026-06-22 14:41:23','2026-06-22 14:41:23',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(290,'2026-06-22 14:41:23','2026-06-22 14:41:23',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(291,'2026-06-22 14:43:05','2026-06-22 14:43:05',NULL,1,'/admin/base/sys/department/list','127.0.0.1','{}'),(292,'2026-06-22 14:43:05','2026-06-22 14:43:05',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [1, 12, 11, 13]}'),(293,'2026-06-22 14:44:35','2026-06-22 14:44:35',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(294,'2026-06-22 14:44:35','2026-06-22 14:44:35',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(295,'2026-06-22 14:44:35','2026-06-22 14:44:35',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(296,'2026-06-22 14:46:03','2026-06-22 14:46:03',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(297,'2026-06-22 14:46:03','2026-06-22 14:46:03',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(298,'2026-06-22 14:46:03','2026-06-22 14:46:03',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(299,'2026-06-22 14:54:29','2026-06-22 14:54:29',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(300,'2026-06-22 14:54:29','2026-06-22 14:54:29',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(301,'2026-06-22 14:54:33','2026-06-22 14:54:33',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(302,'2026-06-22 14:54:33','2026-06-22 14:54:33',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(303,'2026-06-22 14:54:33','2026-06-22 14:54:33',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(304,'2026-06-22 14:54:39','2026-06-22 14:54:39',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(305,'2026-06-22 14:54:39','2026-06-22 14:54:39',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(306,'2026-06-22 14:54:39','2026-06-22 14:54:39',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(307,'2026-06-22 14:58:10','2026-06-22 14:58:10',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(308,'2026-06-22 14:58:10','2026-06-22 14:58:10',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(309,'2026-06-22 15:01:28','2026-06-22 15:01:28',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(310,'2026-06-22 15:01:28','2026-06-22 15:01:28',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(311,'2026-06-22 15:01:28','2026-06-22 15:01:28',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(312,'2026-06-22 15:01:34','2026-06-22 15:01:34',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(313,'2026-06-22 15:02:28','2026-06-22 15:02:28',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(314,'2026-06-22 15:02:28','2026-06-22 15:02:28',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(315,'2026-06-22 15:04:52','2026-06-22 15:04:52',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(316,'2026-06-22 15:04:52','2026-06-22 15:04:52',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(317,'2026-06-22 15:07:11','2026-06-22 15:07:11',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(318,'2026-06-22 15:07:11','2026-06-22 15:07:11',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(319,'2026-06-22 15:07:11','2026-06-22 15:07:11',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(320,'2026-06-22 15:07:17','2026-06-22 15:07:17',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(321,'2026-06-22 15:07:30','2026-06-22 15:07:30',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"01132930-6e09-11f1-8e4e-23bbb825eebb\", \"verifyCode\": \"vm2m\"}'),(322,'2026-06-22 15:07:30','2026-06-22 15:07:30',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(323,'2026-06-22 15:07:30','2026-06-22 15:07:30',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(324,'2026-06-22 15:07:30','2026-06-22 15:07:30',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(325,'2026-06-22 15:08:10','2026-06-22 15:08:10',NULL,1,'/admin/base/comm/logout','127.0.0.1','{}'),(326,'2026-06-22 15:08:10','2026-06-22 15:08:10',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(327,'2026-06-22 15:12:42','2026-06-22 15:12:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(328,'2026-06-22 15:12:42','2026-06-22 15:12:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(329,'2026-06-22 15:12:43','2026-06-22 15:12:43',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(330,'2026-06-22 15:12:47','2026-06-22 15:12:47',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(331,'2026-06-22 15:12:53','2026-06-22 15:12:53',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"c56dbb60-6e09-11f1-8e4e-23bbb825eebb\", \"verifyCode\": \"wpxe\"}'),(332,'2026-06-22 15:12:54','2026-06-22 15:12:54',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(333,'2026-06-22 15:12:54','2026-06-22 15:12:54',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(334,'2026-06-22 15:12:54','2026-06-22 15:12:54',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(335,'2026-06-22 15:42:23','2026-06-22 15:42:23',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(336,'2026-06-22 15:42:23','2026-06-22 15:42:23',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(337,'2026-06-22 15:42:23','2026-06-22 15:42:23',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(338,'2026-06-22 15:42:26','2026-06-22 15:42:26',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(339,'2026-06-22 15:42:26','2026-06-22 15:42:26',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(340,'2026-06-22 15:42:26','2026-06-22 15:42:26',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(341,'2026-06-22 15:42:35','2026-06-22 15:42:35',NULL,1,'/admin/base/comm/logout','127.0.0.1','{}'),(342,'2026-06-22 15:42:35','2026-06-22 15:42:35',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(343,'2026-06-22 15:42:42','2026-06-22 15:42:42',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"ef596740-6e0d-11f1-8e4e-23bbb825eebb\", \"verifyCode\": \"1nzv\"}'),(344,'2026-06-22 15:42:42','2026-06-22 15:42:42',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(345,'2026-06-22 15:42:46','2026-06-22 15:42:46',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"f3a5b6f0-6e0d-11f1-8e4e-23bbb825eebb\", \"verifyCode\": \"sodq\"}'),(346,'2026-06-22 15:42:46','2026-06-22 15:42:46',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(347,'2026-06-22 15:42:52','2026-06-22 15:42:52',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"f5d9adf0-6e0d-11f1-8e4e-23bbb825eebb\", \"verifyCode\": \"qj3u\"}'),(348,'2026-06-22 15:42:52','2026-06-22 15:42:52',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(349,'2026-06-22 15:42:52','2026-06-22 15:42:52',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(350,'2026-06-22 15:42:53','2026-06-22 15:42:53',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(351,'2026-06-22 15:43:57','2026-06-22 15:43:57',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(352,'2026-06-22 15:43:57','2026-06-22 15:43:57',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(353,'2026-06-22 15:43:57','2026-06-22 15:43:57',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(354,'2026-06-22 15:44:04','2026-06-22 15:44:04',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(355,'2026-06-22 15:44:04','2026-06-22 15:44:04',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(356,'2026-06-22 15:44:04','2026-06-22 15:44:04',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(357,'2026-06-22 16:11:39','2026-06-22 16:11:39',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(358,'2026-06-22 16:11:39','2026-06-22 16:11:39',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(359,'2026-06-22 16:11:39','2026-06-22 16:11:39',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(360,'2026-06-22 16:11:43','2026-06-22 16:11:43',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(361,'2026-06-22 16:11:43','2026-06-22 16:11:43',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(362,'2026-06-22 16:11:43','2026-06-22 16:11:43',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(363,'2026-06-22 16:12:29','2026-06-22 16:12:29',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(364,'2026-06-22 16:12:29','2026-06-22 16:12:29',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(365,'2026-06-22 16:12:29','2026-06-22 16:12:29',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(366,'2026-06-22 16:12:34','2026-06-22 16:12:34',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(367,'2026-06-22 16:12:34','2026-06-22 16:12:34',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(368,'2026-06-22 16:12:34','2026-06-22 16:12:34',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(369,'2026-06-22 16:19:14','2026-06-22 16:19:14',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(370,'2026-06-22 16:19:14','2026-06-22 16:19:14',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(371,'2026-06-22 16:19:14','2026-06-22 16:19:14',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(372,'2026-06-22 16:19:19','2026-06-22 16:19:19',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(373,'2026-06-22 16:19:19','2026-06-22 16:19:19',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(374,'2026-06-22 16:19:19','2026-06-22 16:19:19',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(375,'2026-06-22 16:32:05','2026-06-22 16:32:05',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(376,'2026-06-22 16:32:05','2026-06-22 16:32:05',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(377,'2026-06-22 16:32:05','2026-06-22 16:32:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(378,'2026-06-22 16:32:09','2026-06-22 16:32:09',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(379,'2026-06-22 16:32:09','2026-06-22 16:32:09',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(380,'2026-06-22 16:32:09','2026-06-22 16:32:09',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(381,'2026-06-22 16:41:41','2026-06-22 16:41:41',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(382,'2026-06-22 16:41:41','2026-06-22 16:41:41',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(383,'2026-06-22 16:41:41','2026-06-22 16:41:41',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(384,'2026-06-22 16:41:45','2026-06-22 16:41:45',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(385,'2026-06-22 16:41:45','2026-06-22 16:41:45',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(386,'2026-06-22 16:41:46','2026-06-22 16:41:46',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(387,'2026-06-22 16:43:16','2026-06-22 16:43:16',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(388,'2026-06-22 16:43:16','2026-06-22 16:43:16',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(389,'2026-06-22 16:43:16','2026-06-22 16:43:16',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(390,'2026-06-22 16:43:24','2026-06-22 16:43:24',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(391,'2026-06-22 16:43:24','2026-06-22 16:43:24',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(392,'2026-06-22 16:44:35','2026-06-22 16:44:35',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(393,'2026-06-22 16:44:35','2026-06-22 16:44:35',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(394,'2026-06-22 16:44:35','2026-06-22 16:44:35',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(395,'2026-06-22 16:44:39','2026-06-22 16:44:39',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(396,'2026-06-22 16:44:39','2026-06-22 16:44:39',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(397,'2026-06-22 16:44:39','2026-06-22 16:44:39',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(398,'2026-06-22 16:44:39','2026-06-22 16:44:39',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(399,'2026-06-22 16:44:39','2026-06-22 16:44:39',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(400,'2026-06-22 16:44:39','2026-06-22 16:44:39',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(401,'2026-06-22 16:46:25','2026-06-22 16:46:25',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{}'),(402,'2026-06-22 16:46:25','2026-06-22 16:46:25',NULL,1,'/admin/base/sys/menu/info','127.0.0.1','{\"id\": \"77\"}'),(403,'2026-06-22 16:46:37','2026-06-22 16:46:37',NULL,1,'/admin/base/sys/menu/update','127.0.0.1','{\"id\": 77, \"icon\": \"icon-map\", \"name\": \"衣模块\", \"type\": 0, \"isShow\": true, \"orderNum\": 1, \"parentId\": null, \"tenantId\": null, \"createTime\": \"2026-06-22 14:33:30\", \"updateTime\": \"2026-06-22 14:33:30\"}'),(404,'2026-06-22 16:46:38','2026-06-22 16:46:38',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(405,'2026-06-22 16:46:38','2026-06-22 16:46:38',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(406,'2026-06-22 16:46:44','2026-06-22 16:46:44',NULL,1,'/admin/base/sys/menu/info','127.0.0.1','{\"id\": \"83\"}'),(407,'2026-06-22 16:46:44','2026-06-22 16:46:44',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{}'),(408,'2026-06-22 16:46:56','2026-06-22 16:46:56',NULL,1,'/admin/base/sys/menu/update','127.0.0.1','{\"id\": 83, \"icon\": \"icon-iot\", \"name\": \"食模块\", \"type\": 0, \"isShow\": true, \"orderNum\": 2, \"parentId\": null, \"tenantId\": null, \"createTime\": \"2026-06-22 14:33:30\", \"updateTime\": \"2026-06-22 14:33:30\"}'),(409,'2026-06-22 16:46:56','2026-06-22 16:46:56',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(410,'2026-06-22 16:46:56','2026-06-22 16:46:56',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(411,'2026-06-22 16:47:15','2026-06-22 16:47:15',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{}'),(412,'2026-06-22 16:47:15','2026-06-22 16:47:15',NULL,1,'/admin/base/sys/menu/info','127.0.0.1','{\"id\": \"98\"}'),(413,'2026-06-22 16:47:29','2026-06-22 16:47:29',NULL,1,'/admin/base/sys/menu/update','127.0.0.1','{\"id\": 98, \"icon\": \"icon-info\", \"name\": \"行模块\", \"type\": 0, \"isShow\": true, \"orderNum\": 4, \"parentId\": null, \"tenantId\": null, \"createTime\": \"2026-06-22 14:33:30\", \"updateTime\": \"2026-06-22 14:33:30\"}'),(414,'2026-06-22 16:47:29','2026-06-22 16:47:29',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(415,'2026-06-22 16:47:29','2026-06-22 16:47:29',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(416,'2026-06-22 16:47:31','2026-06-22 16:47:31',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{}'),(417,'2026-06-22 16:47:31','2026-06-22 16:47:31',NULL,1,'/admin/base/sys/menu/info','127.0.0.1','{\"id\": \"107\"}'),(418,'2026-06-22 16:47:36','2026-06-22 16:47:36',NULL,1,'/admin/base/sys/menu/update','127.0.0.1','{\"id\": 107, \"icon\": \"icon-dept\", \"name\": \"社区模块\", \"type\": 0, \"isShow\": true, \"orderNum\": 5, \"parentId\": null, \"tenantId\": null, \"createTime\": \"2026-06-22 14:33:30\", \"updateTime\": \"2026-06-22 14:33:30\"}'),(419,'2026-06-22 16:47:36','2026-06-22 16:47:36',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(420,'2026-06-22 16:47:36','2026-06-22 16:47:36',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(421,'2026-06-22 16:47:38','2026-06-22 16:47:38',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{}'),(422,'2026-06-22 16:47:38','2026-06-22 16:47:38',NULL,1,'/admin/base/sys/menu/info','127.0.0.1','{\"id\": \"118\"}'),(423,'2026-06-22 16:47:52','2026-06-22 16:47:52',NULL,1,'/admin/base/sys/menu/update','127.0.0.1','{\"id\": 118, \"icon\": \"icon-news\", \"name\": \"平台管理\", \"type\": 0, \"isShow\": true, \"orderNum\": 6, \"parentId\": null, \"tenantId\": null, \"createTime\": \"2026-06-22 14:33:30\", \"updateTime\": \"2026-06-22 14:33:30\"}'),(424,'2026-06-22 16:47:52','2026-06-22 16:47:52',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(425,'2026-06-22 16:47:52','2026-06-22 16:47:52',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(426,'2026-06-22 16:52:49','2026-06-22 16:52:49',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(427,'2026-06-22 16:52:49','2026-06-22 16:52:49',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(428,'2026-06-22 16:52:49','2026-06-22 16:52:49',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(429,'2026-06-22 16:52:49','2026-06-22 16:52:49',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(430,'2026-06-22 16:52:49','2026-06-22 16:52:49',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(431,'2026-06-22 16:52:49','2026-06-22 16:52:49',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(432,'2026-06-22 16:52:49','2026-06-22 16:52:49',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(433,'2026-06-22 16:52:49','2026-06-22 16:52:49',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(434,'2026-06-22 16:52:49','2026-06-22 16:52:49',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(435,'2026-06-22 16:52:49','2026-06-22 16:52:49',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(436,'2026-06-22 16:52:49','2026-06-22 16:52:49',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(437,'2026-06-22 16:52:49','2026-06-22 16:52:49',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(438,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(439,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(440,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(441,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(442,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(443,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(444,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(445,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(446,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(447,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(448,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(449,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(450,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(451,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(452,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(453,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(454,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(455,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(456,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(457,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(458,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(459,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(460,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(461,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(462,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(463,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(464,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(465,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(466,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(467,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(468,'2026-06-22 16:56:15','2026-06-22 16:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(469,'2026-06-22 16:56:19','2026-06-22 16:56:19',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(470,'2026-06-22 16:56:19','2026-06-22 16:56:19',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(471,'2026-06-22 16:56:19','2026-06-22 16:56:19',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(472,'2026-06-22 16:58:48','2026-06-22 16:58:48',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(473,'2026-06-22 16:58:48','2026-06-22 16:58:48',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(474,'2026-06-22 16:58:48','2026-06-22 16:58:48',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(475,'2026-06-22 16:58:52','2026-06-22 16:58:52',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(476,'2026-06-22 16:58:52','2026-06-22 16:58:52',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(477,'2026-06-22 16:58:52','2026-06-22 16:58:52',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(478,'2026-06-22 17:05:05','2026-06-22 17:05:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(479,'2026-06-22 17:05:05','2026-06-22 17:05:05',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(480,'2026-06-22 17:05:05','2026-06-22 17:05:05',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(481,'2026-06-22 17:05:09','2026-06-22 17:05:09',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(482,'2026-06-22 17:05:09','2026-06-22 17:05:09',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(483,'2026-06-22 17:05:09','2026-06-22 17:05:09',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(484,'2026-06-22 17:07:10','2026-06-22 17:07:10',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(485,'2026-06-22 17:07:10','2026-06-22 17:07:10',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(486,'2026-06-22 17:07:10','2026-06-22 17:07:10',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(487,'2026-06-22 17:07:10','2026-06-22 17:07:10',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(488,'2026-06-22 17:07:10','2026-06-22 17:07:10',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(489,'2026-06-22 17:07:10','2026-06-22 17:07:10',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(490,'2026-06-22 17:07:10','2026-06-22 17:07:10',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(491,'2026-06-22 17:07:10','2026-06-22 17:07:10',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(492,'2026-06-22 17:07:10','2026-06-22 17:07:10',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(493,'2026-06-22 17:07:10','2026-06-22 17:07:10',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(494,'2026-06-22 17:07:10','2026-06-22 17:07:10',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(495,'2026-06-22 17:07:10','2026-06-22 17:07:10',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(496,'2026-06-22 17:08:03','2026-06-22 17:08:03',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(497,'2026-06-22 17:08:03','2026-06-22 17:08:03',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(498,'2026-06-22 17:08:03','2026-06-22 17:08:03',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(499,'2026-06-22 17:08:03','2026-06-22 17:08:03',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(500,'2026-06-22 17:08:03','2026-06-22 17:08:03',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(501,'2026-06-22 17:08:03','2026-06-22 17:08:03',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(502,'2026-06-22 17:08:03','2026-06-22 17:08:03',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(503,'2026-06-22 17:08:03','2026-06-22 17:08:03',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(504,'2026-06-22 17:08:03','2026-06-22 17:08:03',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(505,'2026-06-22 17:08:03','2026-06-22 17:08:03',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(506,'2026-06-22 17:08:03','2026-06-22 17:08:03',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(507,'2026-06-22 17:08:03','2026-06-22 17:08:03',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(508,'2026-06-22 17:08:54','2026-06-22 17:08:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(509,'2026-06-22 17:08:54','2026-06-22 17:08:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(510,'2026-06-22 17:08:54','2026-06-22 17:08:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(511,'2026-06-22 17:08:54','2026-06-22 17:08:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(512,'2026-06-22 17:08:54','2026-06-22 17:08:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(513,'2026-06-22 17:08:54','2026-06-22 17:08:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(514,'2026-06-22 17:08:54','2026-06-22 17:08:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(515,'2026-06-22 17:08:54','2026-06-22 17:08:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(516,'2026-06-22 17:08:54','2026-06-22 17:08:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(517,'2026-06-22 17:08:54','2026-06-22 17:08:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(518,'2026-06-22 17:08:54','2026-06-22 17:08:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(519,'2026-06-22 17:08:54','2026-06-22 17:08:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(520,'2026-06-22 17:09:26','2026-06-22 17:09:26',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(521,'2026-06-22 17:09:26','2026-06-22 17:09:26',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(522,'2026-06-22 17:09:26','2026-06-22 17:09:26',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(523,'2026-06-22 17:09:31','2026-06-22 17:09:31',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{}'),(524,'2026-06-22 17:09:31','2026-06-22 17:09:31',NULL,1,'/admin/base/sys/menu/info','127.0.0.1','{\"id\": \"1\"}'),(525,'2026-06-22 17:09:40','2026-06-22 17:09:40',NULL,1,'/admin/base/sys/menu/update','127.0.0.1','{\"id\": 1, \"icon\": \"icon-set\", \"name\": \"系统管理\", \"type\": 0, \"isShow\": true, \"orderNum\": 99, \"parentId\": null, \"tenantId\": null, \"createTime\": \"2026-06-21 22:40:32\", \"updateTime\": \"2026-06-21 22:40:32\"}'),(526,'2026-06-22 17:09:40','2026-06-22 17:09:40',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(527,'2026-06-22 17:09:40','2026-06-22 17:09:40',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(528,'2026-06-22 17:09:47','2026-06-22 17:09:47',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(529,'2026-06-22 17:09:47','2026-06-22 17:09:47',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(530,'2026-06-22 17:09:47','2026-06-22 17:09:47',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(531,'2026-06-22 17:09:47','2026-06-22 17:09:47',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(532,'2026-06-22 17:09:47','2026-06-22 17:09:47',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(533,'2026-06-22 17:09:47','2026-06-22 17:09:47',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(534,'2026-06-22 17:09:47','2026-06-22 17:09:47',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(535,'2026-06-22 17:09:47','2026-06-22 17:09:47',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(536,'2026-06-22 17:09:47','2026-06-22 17:09:47',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(537,'2026-06-22 17:09:47','2026-06-22 17:09:47',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(538,'2026-06-22 17:09:47','2026-06-22 17:09:47',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(539,'2026-06-22 17:09:47','2026-06-22 17:09:47',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(540,'2026-06-22 17:10:38','2026-06-22 17:10:38',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(541,'2026-06-22 17:10:38','2026-06-22 17:10:38',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(542,'2026-06-22 17:10:38','2026-06-22 17:10:38',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(543,'2026-06-22 17:10:38','2026-06-22 17:10:38',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(544,'2026-06-22 17:10:38','2026-06-22 17:10:38',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(545,'2026-06-22 17:10:38','2026-06-22 17:10:38',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(546,'2026-06-22 17:10:38','2026-06-22 17:10:38',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(547,'2026-06-22 17:10:38','2026-06-22 17:10:38',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(548,'2026-06-22 17:10:38','2026-06-22 17:10:38',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(549,'2026-06-22 17:10:38','2026-06-22 17:10:38',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(550,'2026-06-22 17:10:38','2026-06-22 17:10:38',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(551,'2026-06-22 17:10:38','2026-06-22 17:10:38',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(552,'2026-06-22 17:28:43','2026-06-22 17:28:43',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(553,'2026-06-22 17:28:43','2026-06-22 17:28:43',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(554,'2026-06-22 17:28:43','2026-06-22 17:28:43',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(555,'2026-06-22 17:28:43','2026-06-22 17:28:43',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(556,'2026-06-22 17:28:43','2026-06-22 17:28:43',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(557,'2026-06-22 17:28:43','2026-06-22 17:28:43',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(558,'2026-06-22 17:28:43','2026-06-22 17:28:43',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(559,'2026-06-22 17:28:43','2026-06-22 17:28:43',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(560,'2026-06-22 17:28:43','2026-06-22 17:28:43',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(561,'2026-06-22 17:28:43','2026-06-22 17:28:43',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(562,'2026-06-22 17:28:43','2026-06-22 17:28:43',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(563,'2026-06-22 17:28:43','2026-06-22 17:28:43',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(564,'2026-06-22 17:28:57','2026-06-22 17:28:57',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(565,'2026-06-22 17:28:57','2026-06-22 17:28:57',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(566,'2026-06-22 17:28:57','2026-06-22 17:28:57',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(567,'2026-06-22 17:28:57','2026-06-22 17:28:57',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(568,'2026-06-22 17:28:57','2026-06-22 17:28:57',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(569,'2026-06-22 17:28:57','2026-06-22 17:28:57',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(570,'2026-06-22 17:28:57','2026-06-22 17:28:57',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(571,'2026-06-22 17:28:57','2026-06-22 17:28:57',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(572,'2026-06-22 17:28:57','2026-06-22 17:28:57',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(573,'2026-06-22 17:28:57','2026-06-22 17:28:57',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(574,'2026-06-22 17:28:57','2026-06-22 17:28:57',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(575,'2026-06-22 17:28:57','2026-06-22 17:28:57',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(576,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(577,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(578,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(579,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(580,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(581,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(582,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(583,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(584,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(585,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(586,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(587,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(588,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(589,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(590,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(591,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(592,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(593,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(594,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(595,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(596,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(597,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(598,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(599,'2026-06-22 17:29:22','2026-06-22 17:29:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(600,'2026-06-22 17:30:00','2026-06-22 17:30:00',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(601,'2026-06-22 17:30:00','2026-06-22 17:30:00',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(602,'2026-06-22 17:30:00','2026-06-22 17:30:00',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(603,'2026-06-22 17:30:00','2026-06-22 17:30:00',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(604,'2026-06-22 17:30:00','2026-06-22 17:30:00',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(605,'2026-06-22 17:30:00','2026-06-22 17:30:00',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(606,'2026-06-22 17:30:00','2026-06-22 17:30:00',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(607,'2026-06-22 17:30:00','2026-06-22 17:30:00',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(608,'2026-06-22 17:30:00','2026-06-22 17:30:00',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(609,'2026-06-22 17:30:00','2026-06-22 17:30:00',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(610,'2026-06-22 17:30:01','2026-06-22 17:30:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(611,'2026-06-22 17:30:01','2026-06-22 17:30:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(612,'2026-06-22 17:30:15','2026-06-22 17:30:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(613,'2026-06-22 17:30:15','2026-06-22 17:30:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(614,'2026-06-22 17:30:15','2026-06-22 17:30:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(615,'2026-06-22 17:30:15','2026-06-22 17:30:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(616,'2026-06-22 17:30:15','2026-06-22 17:30:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(617,'2026-06-22 17:30:15','2026-06-22 17:30:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(618,'2026-06-22 17:30:15','2026-06-22 17:30:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(619,'2026-06-22 17:30:15','2026-06-22 17:30:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(620,'2026-06-22 17:30:16','2026-06-22 17:30:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(621,'2026-06-22 17:30:16','2026-06-22 17:30:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(622,'2026-06-22 17:30:16','2026-06-22 17:30:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(623,'2026-06-22 17:30:16','2026-06-22 17:30:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(624,'2026-06-22 17:31:01','2026-06-22 17:31:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(625,'2026-06-22 17:31:01','2026-06-22 17:31:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(626,'2026-06-22 17:31:01','2026-06-22 17:31:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(627,'2026-06-22 17:31:01','2026-06-22 17:31:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(628,'2026-06-22 17:31:01','2026-06-22 17:31:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(629,'2026-06-22 17:31:01','2026-06-22 17:31:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(630,'2026-06-22 17:31:01','2026-06-22 17:31:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(631,'2026-06-22 17:31:01','2026-06-22 17:31:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(632,'2026-06-22 17:31:01','2026-06-22 17:31:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(633,'2026-06-22 17:31:01','2026-06-22 17:31:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(634,'2026-06-22 17:31:01','2026-06-22 17:31:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(635,'2026-06-22 17:31:02','2026-06-22 17:31:02',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(636,'2026-06-22 17:31:10','2026-06-22 17:31:10',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(637,'2026-06-22 17:31:10','2026-06-22 17:31:10',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(638,'2026-06-22 17:31:10','2026-06-22 17:31:10',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(639,'2026-06-22 17:31:10','2026-06-22 17:31:10',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(640,'2026-06-22 17:31:10','2026-06-22 17:31:10',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(641,'2026-06-22 17:31:10','2026-06-22 17:31:10',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(642,'2026-06-22 17:31:10','2026-06-22 17:31:10',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(643,'2026-06-22 17:31:10','2026-06-22 17:31:10',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(644,'2026-06-22 17:31:10','2026-06-22 17:31:10',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(645,'2026-06-22 17:31:10','2026-06-22 17:31:10',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(646,'2026-06-22 17:31:10','2026-06-22 17:31:10',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(647,'2026-06-22 17:31:10','2026-06-22 17:31:10',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(648,'2026-06-22 17:31:16','2026-06-22 17:31:16',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(649,'2026-06-22 17:31:16','2026-06-22 17:31:16',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(650,'2026-06-22 17:31:16','2026-06-22 17:31:16',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(651,'2026-06-22 17:31:16','2026-06-22 17:31:16',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(652,'2026-06-22 17:31:16','2026-06-22 17:31:16',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(653,'2026-06-22 17:31:16','2026-06-22 17:31:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(654,'2026-06-22 17:31:16','2026-06-22 17:31:16',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(655,'2026-06-22 17:31:16','2026-06-22 17:31:16',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(656,'2026-06-22 17:31:16','2026-06-22 17:31:16',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(657,'2026-06-22 17:31:16','2026-06-22 17:31:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(658,'2026-06-22 17:31:16','2026-06-22 17:31:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(659,'2026-06-22 17:31:16','2026-06-22 17:31:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(660,'2026-06-22 17:31:26','2026-06-22 17:31:26',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(661,'2026-06-22 17:31:26','2026-06-22 17:31:26',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(662,'2026-06-22 17:31:26','2026-06-22 17:31:26',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(663,'2026-06-22 17:31:26','2026-06-22 17:31:26',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(664,'2026-06-22 17:31:26','2026-06-22 17:31:26',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(665,'2026-06-22 17:31:26','2026-06-22 17:31:26',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(666,'2026-06-22 17:31:26','2026-06-22 17:31:26',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(667,'2026-06-22 17:31:26','2026-06-22 17:31:26',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(668,'2026-06-22 17:31:26','2026-06-22 17:31:26',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(669,'2026-06-22 17:31:26','2026-06-22 17:31:26',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(670,'2026-06-22 17:31:26','2026-06-22 17:31:26',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(671,'2026-06-22 17:31:26','2026-06-22 17:31:26',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(672,'2026-06-22 17:31:37','2026-06-22 17:31:37',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(673,'2026-06-22 17:31:37','2026-06-22 17:31:37',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(674,'2026-06-22 17:31:37','2026-06-22 17:31:37',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(675,'2026-06-22 17:31:37','2026-06-22 17:31:37',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(676,'2026-06-22 17:31:37','2026-06-22 17:31:37',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(677,'2026-06-22 17:31:37','2026-06-22 17:31:37',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(678,'2026-06-22 17:31:37','2026-06-22 17:31:37',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(679,'2026-06-22 17:31:37','2026-06-22 17:31:37',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(680,'2026-06-22 17:31:37','2026-06-22 17:31:37',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(681,'2026-06-22 17:31:37','2026-06-22 17:31:37',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(682,'2026-06-22 17:31:37','2026-06-22 17:31:37',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(683,'2026-06-22 17:31:37','2026-06-22 17:31:37',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(684,'2026-06-22 17:31:42','2026-06-22 17:31:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(685,'2026-06-22 17:31:42','2026-06-22 17:31:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(686,'2026-06-22 17:31:42','2026-06-22 17:31:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(687,'2026-06-22 17:31:42','2026-06-22 17:31:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(688,'2026-06-22 17:31:42','2026-06-22 17:31:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(689,'2026-06-22 17:31:42','2026-06-22 17:31:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(690,'2026-06-22 17:31:42','2026-06-22 17:31:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(691,'2026-06-22 17:31:42','2026-06-22 17:31:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(692,'2026-06-22 17:31:42','2026-06-22 17:31:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(693,'2026-06-22 17:31:42','2026-06-22 17:31:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(694,'2026-06-22 17:31:42','2026-06-22 17:31:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(695,'2026-06-22 17:31:42','2026-06-22 17:31:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(696,'2026-06-22 17:31:46','2026-06-22 17:31:46',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(697,'2026-06-22 17:31:46','2026-06-22 17:31:46',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(698,'2026-06-22 17:31:46','2026-06-22 17:31:46',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(699,'2026-06-22 17:31:46','2026-06-22 17:31:46',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(700,'2026-06-22 17:31:46','2026-06-22 17:31:46',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(701,'2026-06-22 17:31:46','2026-06-22 17:31:46',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(702,'2026-06-22 17:31:46','2026-06-22 17:31:46',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(703,'2026-06-22 17:31:46','2026-06-22 17:31:46',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(704,'2026-06-22 17:31:46','2026-06-22 17:31:46',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(705,'2026-06-22 17:31:46','2026-06-22 17:31:46',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(706,'2026-06-22 17:31:46','2026-06-22 17:31:46',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(707,'2026-06-22 17:31:46','2026-06-22 17:31:46',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(708,'2026-06-22 17:32:25','2026-06-22 17:32:25',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(709,'2026-06-22 17:32:25','2026-06-22 17:32:25',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(710,'2026-06-22 17:32:25','2026-06-22 17:32:25',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(711,'2026-06-22 17:32:25','2026-06-22 17:32:25',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(712,'2026-06-22 17:32:25','2026-06-22 17:32:25',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(713,'2026-06-22 17:32:25','2026-06-22 17:32:25',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(714,'2026-06-22 17:32:25','2026-06-22 17:32:25',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(715,'2026-06-22 17:32:25','2026-06-22 17:32:25',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(716,'2026-06-22 17:32:25','2026-06-22 17:32:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(717,'2026-06-22 17:32:25','2026-06-22 17:32:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(718,'2026-06-22 17:32:25','2026-06-22 17:32:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(719,'2026-06-22 17:32:25','2026-06-22 17:32:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(720,'2026-06-22 17:32:29','2026-06-22 17:32:29',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(721,'2026-06-22 17:32:29','2026-06-22 17:32:29',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(722,'2026-06-22 17:32:29','2026-06-22 17:32:29',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(723,'2026-06-22 17:32:29','2026-06-22 17:32:29',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(724,'2026-06-22 17:32:29','2026-06-22 17:32:29',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(725,'2026-06-22 17:32:29','2026-06-22 17:32:29',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(726,'2026-06-22 17:32:29','2026-06-22 17:32:29',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(727,'2026-06-22 17:32:29','2026-06-22 17:32:29',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(728,'2026-06-22 17:32:29','2026-06-22 17:32:29',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(729,'2026-06-22 17:32:29','2026-06-22 17:32:29',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(730,'2026-06-22 17:32:29','2026-06-22 17:32:29',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(731,'2026-06-22 17:32:29','2026-06-22 17:32:29',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(732,'2026-06-22 17:32:38','2026-06-22 17:32:38',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(733,'2026-06-22 17:32:38','2026-06-22 17:32:38',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(734,'2026-06-22 17:32:38','2026-06-22 17:32:38',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(735,'2026-06-22 17:32:38','2026-06-22 17:32:38',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(736,'2026-06-22 17:32:38','2026-06-22 17:32:38',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(737,'2026-06-22 17:32:38','2026-06-22 17:32:38',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(738,'2026-06-22 17:32:38','2026-06-22 17:32:38',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(739,'2026-06-22 17:32:38','2026-06-22 17:32:38',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(740,'2026-06-22 17:32:38','2026-06-22 17:32:38',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(741,'2026-06-22 17:32:38','2026-06-22 17:32:38',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(742,'2026-06-22 17:32:38','2026-06-22 17:32:38',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(743,'2026-06-22 17:32:38','2026-06-22 17:32:38',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(744,'2026-06-22 17:32:52','2026-06-22 17:32:52',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(745,'2026-06-22 17:32:52','2026-06-22 17:32:52',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(746,'2026-06-22 17:32:52','2026-06-22 17:32:52',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(747,'2026-06-22 17:32:52','2026-06-22 17:32:52',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(748,'2026-06-22 17:32:52','2026-06-22 17:32:52',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(749,'2026-06-22 17:32:52','2026-06-22 17:32:52',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(750,'2026-06-22 17:32:52','2026-06-22 17:32:52',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(751,'2026-06-22 17:32:52','2026-06-22 17:32:52',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(752,'2026-06-22 17:32:52','2026-06-22 17:32:52',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(753,'2026-06-22 17:32:52','2026-06-22 17:32:52',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(754,'2026-06-22 17:32:52','2026-06-22 17:32:52',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(755,'2026-06-22 17:32:52','2026-06-22 17:32:52',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(756,'2026-06-22 17:33:12','2026-06-22 17:33:12',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(757,'2026-06-22 17:33:12','2026-06-22 17:33:12',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(758,'2026-06-22 17:33:12','2026-06-22 17:33:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(759,'2026-06-22 17:33:12','2026-06-22 17:33:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(760,'2026-06-22 17:33:12','2026-06-22 17:33:12',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(761,'2026-06-22 17:33:12','2026-06-22 17:33:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(762,'2026-06-22 17:33:12','2026-06-22 17:33:12',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(763,'2026-06-22 17:33:12','2026-06-22 17:33:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(764,'2026-06-22 17:33:12','2026-06-22 17:33:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(765,'2026-06-22 17:33:12','2026-06-22 17:33:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(766,'2026-06-22 17:33:12','2026-06-22 17:33:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(767,'2026-06-22 17:33:12','2026-06-22 17:33:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(768,'2026-06-22 17:33:40','2026-06-22 17:33:40',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(769,'2026-06-22 17:33:40','2026-06-22 17:33:40',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(770,'2026-06-22 17:33:40','2026-06-22 17:33:40',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(771,'2026-06-22 17:33:40','2026-06-22 17:33:40',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(772,'2026-06-22 17:33:40','2026-06-22 17:33:40',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(773,'2026-06-22 17:33:40','2026-06-22 17:33:40',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(774,'2026-06-22 17:33:40','2026-06-22 17:33:40',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(775,'2026-06-22 17:33:40','2026-06-22 17:33:40',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(776,'2026-06-22 17:33:40','2026-06-22 17:33:40',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(777,'2026-06-22 17:33:40','2026-06-22 17:33:40',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(778,'2026-06-22 17:33:40','2026-06-22 17:33:40',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(779,'2026-06-22 17:33:40','2026-06-22 17:33:40',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(780,'2026-06-22 17:33:44','2026-06-22 17:33:44',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(781,'2026-06-22 17:33:44','2026-06-22 17:33:44',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(782,'2026-06-22 17:33:45','2026-06-22 17:33:45',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(783,'2026-06-22 17:33:45','2026-06-22 17:33:45',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(784,'2026-06-22 17:33:45','2026-06-22 17:33:45',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(785,'2026-06-22 17:33:45','2026-06-22 17:33:45',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(786,'2026-06-22 17:33:45','2026-06-22 17:33:45',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(787,'2026-06-22 17:33:45','2026-06-22 17:33:45',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(788,'2026-06-22 17:33:45','2026-06-22 17:33:45',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(789,'2026-06-22 17:33:45','2026-06-22 17:33:45',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(790,'2026-06-22 17:33:45','2026-06-22 17:33:45',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(791,'2026-06-22 17:33:45','2026-06-22 17:33:45',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(792,'2026-06-22 17:33:54','2026-06-22 17:33:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(793,'2026-06-22 17:33:54','2026-06-22 17:33:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(794,'2026-06-22 17:33:54','2026-06-22 17:33:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(795,'2026-06-22 17:33:54','2026-06-22 17:33:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(796,'2026-06-22 17:33:54','2026-06-22 17:33:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(797,'2026-06-22 17:33:54','2026-06-22 17:33:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(798,'2026-06-22 17:33:54','2026-06-22 17:33:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(799,'2026-06-22 17:33:54','2026-06-22 17:33:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(800,'2026-06-22 17:33:54','2026-06-22 17:33:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(801,'2026-06-22 17:33:54','2026-06-22 17:33:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(802,'2026-06-22 17:33:54','2026-06-22 17:33:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(803,'2026-06-22 17:33:54','2026-06-22 17:33:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(804,'2026-06-22 17:34:07','2026-06-22 17:34:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(805,'2026-06-22 17:34:07','2026-06-22 17:34:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(806,'2026-06-22 17:34:07','2026-06-22 17:34:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(807,'2026-06-22 17:34:07','2026-06-22 17:34:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(808,'2026-06-22 17:34:07','2026-06-22 17:34:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(809,'2026-06-22 17:34:07','2026-06-22 17:34:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(810,'2026-06-22 17:34:07','2026-06-22 17:34:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(811,'2026-06-22 17:34:07','2026-06-22 17:34:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(812,'2026-06-22 17:34:07','2026-06-22 17:34:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(813,'2026-06-22 17:34:07','2026-06-22 17:34:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(814,'2026-06-22 17:34:07','2026-06-22 17:34:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(815,'2026-06-22 17:34:07','2026-06-22 17:34:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(816,'2026-06-22 17:34:12','2026-06-22 17:34:12',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(817,'2026-06-22 17:34:12','2026-06-22 17:34:12',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(818,'2026-06-22 17:34:12','2026-06-22 17:34:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(819,'2026-06-22 17:34:12','2026-06-22 17:34:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(820,'2026-06-22 17:34:12','2026-06-22 17:34:12',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(821,'2026-06-22 17:34:12','2026-06-22 17:34:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(822,'2026-06-22 17:34:12','2026-06-22 17:34:12',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(823,'2026-06-22 17:34:12','2026-06-22 17:34:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(824,'2026-06-22 17:34:12','2026-06-22 17:34:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(825,'2026-06-22 17:34:12','2026-06-22 17:34:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(826,'2026-06-22 17:34:12','2026-06-22 17:34:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(827,'2026-06-22 17:34:12','2026-06-22 17:34:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(828,'2026-06-22 17:34:55','2026-06-22 17:34:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(829,'2026-06-22 17:34:55','2026-06-22 17:34:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(830,'2026-06-22 17:34:55','2026-06-22 17:34:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(831,'2026-06-22 17:34:55','2026-06-22 17:34:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(832,'2026-06-22 17:34:55','2026-06-22 17:34:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(833,'2026-06-22 17:34:55','2026-06-22 17:34:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(834,'2026-06-22 17:34:55','2026-06-22 17:34:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(835,'2026-06-22 17:34:55','2026-06-22 17:34:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(836,'2026-06-22 17:34:55','2026-06-22 17:34:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(837,'2026-06-22 17:34:55','2026-06-22 17:34:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(838,'2026-06-22 17:34:55','2026-06-22 17:34:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(839,'2026-06-22 17:34:55','2026-06-22 17:34:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(840,'2026-06-22 17:35:00','2026-06-22 17:35:00',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(841,'2026-06-22 17:35:00','2026-06-22 17:35:00',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(842,'2026-06-22 17:35:00','2026-06-22 17:35:00',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(843,'2026-06-22 17:35:00','2026-06-22 17:35:00',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(844,'2026-06-22 17:35:00','2026-06-22 17:35:00',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(845,'2026-06-22 17:35:00','2026-06-22 17:35:00',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(846,'2026-06-22 17:35:00','2026-06-22 17:35:00',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(847,'2026-06-22 17:35:00','2026-06-22 17:35:00',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(848,'2026-06-22 17:35:00','2026-06-22 17:35:00',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(849,'2026-06-22 17:35:00','2026-06-22 17:35:00',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(850,'2026-06-22 17:35:00','2026-06-22 17:35:00',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(851,'2026-06-22 17:35:00','2026-06-22 17:35:00',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(852,'2026-06-22 17:35:03','2026-06-22 17:35:03',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(853,'2026-06-22 17:35:03','2026-06-22 17:35:03',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(854,'2026-06-22 17:35:03','2026-06-22 17:35:03',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(855,'2026-06-22 17:35:03','2026-06-22 17:35:03',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(856,'2026-06-22 17:35:03','2026-06-22 17:35:03',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(857,'2026-06-22 17:35:04','2026-06-22 17:35:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(858,'2026-06-22 17:35:04','2026-06-22 17:35:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(859,'2026-06-22 17:35:04','2026-06-22 17:35:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(860,'2026-06-22 17:35:04','2026-06-22 17:35:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(861,'2026-06-22 17:35:04','2026-06-22 17:35:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(862,'2026-06-22 17:35:04','2026-06-22 17:35:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(863,'2026-06-22 17:35:04','2026-06-22 17:35:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(864,'2026-06-22 17:35:08','2026-06-22 17:35:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(865,'2026-06-22 17:35:08','2026-06-22 17:35:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(866,'2026-06-22 17:35:08','2026-06-22 17:35:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(867,'2026-06-22 17:35:08','2026-06-22 17:35:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(868,'2026-06-22 17:35:08','2026-06-22 17:35:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(869,'2026-06-22 17:35:09','2026-06-22 17:35:09',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(870,'2026-06-22 17:35:09','2026-06-22 17:35:09',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(871,'2026-06-22 17:35:09','2026-06-22 17:35:09',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(872,'2026-06-22 17:35:09','2026-06-22 17:35:09',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(873,'2026-06-22 17:35:09','2026-06-22 17:35:09',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(874,'2026-06-22 17:35:09','2026-06-22 17:35:09',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(875,'2026-06-22 17:35:09','2026-06-22 17:35:09',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(876,'2026-06-22 17:35:13','2026-06-22 17:35:13',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(877,'2026-06-22 17:35:13','2026-06-22 17:35:13',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(878,'2026-06-22 17:35:13','2026-06-22 17:35:13',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(879,'2026-06-22 17:35:13','2026-06-22 17:35:13',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(880,'2026-06-22 17:35:13','2026-06-22 17:35:13',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(881,'2026-06-22 17:35:13','2026-06-22 17:35:13',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(882,'2026-06-22 17:35:17','2026-06-22 17:35:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(883,'2026-06-22 17:35:17','2026-06-22 17:35:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(884,'2026-06-22 17:35:17','2026-06-22 17:35:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(885,'2026-06-22 17:35:17','2026-06-22 17:35:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(886,'2026-06-22 17:35:17','2026-06-22 17:35:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(887,'2026-06-22 17:35:17','2026-06-22 17:35:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(888,'2026-06-22 17:35:17','2026-06-22 17:35:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(889,'2026-06-22 17:35:17','2026-06-22 17:35:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(890,'2026-06-22 17:35:17','2026-06-22 17:35:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(891,'2026-06-22 17:35:17','2026-06-22 17:35:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(892,'2026-06-22 17:35:17','2026-06-22 17:35:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(893,'2026-06-22 17:35:17','2026-06-22 17:35:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(894,'2026-06-22 17:35:21','2026-06-22 17:35:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(895,'2026-06-22 17:35:21','2026-06-22 17:35:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(896,'2026-06-22 17:35:21','2026-06-22 17:35:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(897,'2026-06-22 17:35:26','2026-06-22 17:35:26',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(898,'2026-06-22 17:35:26','2026-06-22 17:35:26',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(899,'2026-06-22 17:35:26','2026-06-22 17:35:26',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(900,'2026-06-22 17:35:26','2026-06-22 17:35:26',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(901,'2026-06-22 17:35:26','2026-06-22 17:35:26',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(902,'2026-06-22 17:35:26','2026-06-22 17:35:26',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(903,'2026-06-22 17:35:26','2026-06-22 17:35:26',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(904,'2026-06-22 17:35:26','2026-06-22 17:35:26',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(905,'2026-06-22 17:35:26','2026-06-22 17:35:26',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(906,'2026-06-22 17:35:26','2026-06-22 17:35:26',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(907,'2026-06-22 17:35:26','2026-06-22 17:35:26',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(908,'2026-06-22 17:35:26','2026-06-22 17:35:26',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(909,'2026-06-22 17:35:30','2026-06-22 17:35:30',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(910,'2026-06-22 17:35:30','2026-06-22 17:35:30',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(911,'2026-06-22 17:35:30','2026-06-22 17:35:30',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(912,'2026-06-22 17:35:30','2026-06-22 17:35:30',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(913,'2026-06-22 17:35:30','2026-06-22 17:35:30',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(914,'2026-06-22 17:35:30','2026-06-22 17:35:30',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(915,'2026-06-22 17:35:30','2026-06-22 17:35:30',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(916,'2026-06-22 17:35:30','2026-06-22 17:35:30',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(917,'2026-06-22 17:35:30','2026-06-22 17:35:30',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(918,'2026-06-22 17:35:34','2026-06-22 17:35:34',NULL,NULL,'/admin/base/open/refreshToken','127.0.0.1','{\"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsInJvbGVJZHMiOlsxXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjo3LCJ0ZW5hbnRJZCI6bnVsbCwiaWF0IjoxNzgyMTA5NzYzLCJleHAiOjE3ODM0MDU3NjN9.c_kTiBZBLBwnsdw03f9IruL0-Xq19Cy0OIeYDVvesgo\"}'),(919,'2026-06-22 17:35:34','2026-06-22 17:35:34',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(920,'2026-06-22 17:35:34','2026-06-22 17:35:34',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(921,'2026-06-22 17:35:34','2026-06-22 17:35:34',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(922,'2026-06-22 17:35:38','2026-06-22 17:35:38',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(923,'2026-06-22 17:35:38','2026-06-22 17:35:38',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(924,'2026-06-22 17:35:38','2026-06-22 17:35:38',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(925,'2026-06-22 17:35:38','2026-06-22 17:35:38',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(926,'2026-06-22 17:35:38','2026-06-22 17:35:38',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(927,'2026-06-22 17:35:38','2026-06-22 17:35:38',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(928,'2026-06-22 17:35:40','2026-06-22 17:35:40',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(929,'2026-06-22 17:35:40','2026-06-22 17:35:40',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(930,'2026-06-22 17:35:40','2026-06-22 17:35:40',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(931,'2026-06-22 17:36:23','2026-06-22 17:36:23',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(932,'2026-06-22 17:36:23','2026-06-22 17:36:23',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(933,'2026-06-22 17:36:23','2026-06-22 17:36:23',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(934,'2026-06-22 17:36:23','2026-06-22 17:36:23',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(935,'2026-06-22 17:36:23','2026-06-22 17:36:23',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(936,'2026-06-22 17:36:23','2026-06-22 17:36:23',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(937,'2026-06-22 17:36:23','2026-06-22 17:36:23',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(938,'2026-06-22 17:36:23','2026-06-22 17:36:23',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(939,'2026-06-22 17:36:23','2026-06-22 17:36:23',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(940,'2026-06-22 17:36:23','2026-06-22 17:36:23',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(941,'2026-06-22 17:36:23','2026-06-22 17:36:23',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(942,'2026-06-22 17:36:24','2026-06-22 17:36:24',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(943,'2026-06-22 17:36:24','2026-06-22 17:36:24',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(944,'2026-06-22 17:36:24','2026-06-22 17:36:24',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(945,'2026-06-22 17:36:24','2026-06-22 17:36:24',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(946,'2026-06-22 17:36:27','2026-06-22 17:36:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(947,'2026-06-22 17:36:27','2026-06-22 17:36:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(948,'2026-06-22 17:36:27','2026-06-22 17:36:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(949,'2026-06-22 17:36:27','2026-06-22 17:36:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(950,'2026-06-22 17:36:27','2026-06-22 17:36:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(951,'2026-06-22 17:36:27','2026-06-22 17:36:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(952,'2026-06-22 17:36:27','2026-06-22 17:36:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(953,'2026-06-22 17:36:27','2026-06-22 17:36:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(954,'2026-06-22 17:36:27','2026-06-22 17:36:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(955,'2026-06-22 17:36:31','2026-06-22 17:36:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(956,'2026-06-22 17:36:31','2026-06-22 17:36:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(957,'2026-06-22 17:37:24','2026-06-22 17:37:24',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(958,'2026-06-22 17:37:24','2026-06-22 17:37:24',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(959,'2026-06-22 17:37:24','2026-06-22 17:37:24',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(960,'2026-06-22 17:37:24','2026-06-22 17:37:24',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(961,'2026-06-22 17:37:24','2026-06-22 17:37:24',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(962,'2026-06-22 17:37:24','2026-06-22 17:37:24',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(963,'2026-06-22 17:37:24','2026-06-22 17:37:24',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(964,'2026-06-22 17:37:24','2026-06-22 17:37:24',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(965,'2026-06-22 17:37:24','2026-06-22 17:37:24',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(966,'2026-06-22 17:37:24','2026-06-22 17:37:24',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(967,'2026-06-22 17:37:24','2026-06-22 17:37:24',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(968,'2026-06-22 17:37:24','2026-06-22 17:37:24',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(969,'2026-06-22 17:37:51','2026-06-22 17:37:51',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(970,'2026-06-22 17:37:51','2026-06-22 17:37:51',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(971,'2026-06-22 17:37:51','2026-06-22 17:37:51',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(972,'2026-06-22 17:37:51','2026-06-22 17:37:51',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(973,'2026-06-22 17:37:51','2026-06-22 17:37:51',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(974,'2026-06-22 17:37:51','2026-06-22 17:37:51',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(975,'2026-06-22 17:37:51','2026-06-22 17:37:51',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(976,'2026-06-22 17:37:51','2026-06-22 17:37:51',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(977,'2026-06-22 17:37:51','2026-06-22 17:37:51',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(978,'2026-06-22 17:37:51','2026-06-22 17:37:51',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(979,'2026-06-22 17:37:51','2026-06-22 17:37:51',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(980,'2026-06-22 17:37:51','2026-06-22 17:37:51',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(981,'2026-06-22 17:39:43','2026-06-22 17:39:43',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(982,'2026-06-22 17:39:43','2026-06-22 17:39:43',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(983,'2026-06-22 17:39:43','2026-06-22 17:39:43',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(984,'2026-06-22 17:39:43','2026-06-22 17:39:43',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(985,'2026-06-22 17:39:43','2026-06-22 17:39:43',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(986,'2026-06-22 17:39:43','2026-06-22 17:39:43',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(987,'2026-06-22 17:39:43','2026-06-22 17:39:43',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(988,'2026-06-22 17:39:43','2026-06-22 17:39:43',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(989,'2026-06-22 17:39:43','2026-06-22 17:39:43',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(990,'2026-06-22 17:39:43','2026-06-22 17:39:43',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(991,'2026-06-22 17:39:43','2026-06-22 17:39:43',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(992,'2026-06-22 17:39:43','2026-06-22 17:39:43',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(993,'2026-06-22 17:39:47','2026-06-22 17:39:47',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(994,'2026-06-22 17:39:47','2026-06-22 17:39:47',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(995,'2026-06-22 17:39:47','2026-06-22 17:39:47',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(996,'2026-06-22 17:39:47','2026-06-22 17:39:47',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(997,'2026-06-22 17:39:47','2026-06-22 17:39:47',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(998,'2026-06-22 17:39:47','2026-06-22 17:39:47',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(999,'2026-06-22 17:39:47','2026-06-22 17:39:47',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1000,'2026-06-22 17:39:47','2026-06-22 17:39:47',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1001,'2026-06-22 17:39:47','2026-06-22 17:39:47',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1002,'2026-06-22 17:39:47','2026-06-22 17:39:47',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1003,'2026-06-22 17:39:47','2026-06-22 17:39:47',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1004,'2026-06-22 17:39:47','2026-06-22 17:39:47',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1005,'2026-06-22 17:40:33','2026-06-22 17:40:33',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1006,'2026-06-22 17:40:33','2026-06-22 17:40:33',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1007,'2026-06-22 17:40:33','2026-06-22 17:40:33',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1008,'2026-06-22 17:40:33','2026-06-22 17:40:33',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1009,'2026-06-22 17:40:33','2026-06-22 17:40:33',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1010,'2026-06-22 17:40:33','2026-06-22 17:40:33',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1011,'2026-06-22 17:40:33','2026-06-22 17:40:33',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1012,'2026-06-22 17:40:33','2026-06-22 17:40:33',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1013,'2026-06-22 17:40:33','2026-06-22 17:40:33',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1014,'2026-06-22 17:40:33','2026-06-22 17:40:33',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1015,'2026-06-22 17:40:33','2026-06-22 17:40:33',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1016,'2026-06-22 17:40:33','2026-06-22 17:40:33',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1017,'2026-06-22 17:40:53','2026-06-22 17:40:53',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1018,'2026-06-22 17:40:53','2026-06-22 17:40:53',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1019,'2026-06-22 17:40:53','2026-06-22 17:40:53',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1020,'2026-06-22 17:40:53','2026-06-22 17:40:53',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1021,'2026-06-22 17:40:53','2026-06-22 17:40:53',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1022,'2026-06-22 17:40:53','2026-06-22 17:40:53',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1023,'2026-06-22 17:40:53','2026-06-22 17:40:53',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1024,'2026-06-22 17:40:53','2026-06-22 17:40:53',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1025,'2026-06-22 17:40:53','2026-06-22 17:40:53',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1026,'2026-06-22 17:40:53','2026-06-22 17:40:53',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1027,'2026-06-22 17:40:53','2026-06-22 17:40:53',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1028,'2026-06-22 17:40:53','2026-06-22 17:40:53',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1029,'2026-06-22 17:41:01','2026-06-22 17:41:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1030,'2026-06-22 17:41:01','2026-06-22 17:41:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1031,'2026-06-22 17:41:01','2026-06-22 17:41:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1032,'2026-06-22 17:41:01','2026-06-22 17:41:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1033,'2026-06-22 17:41:01','2026-06-22 17:41:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1034,'2026-06-22 17:41:01','2026-06-22 17:41:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1035,'2026-06-22 17:41:01','2026-06-22 17:41:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1036,'2026-06-22 17:41:01','2026-06-22 17:41:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1037,'2026-06-22 17:41:01','2026-06-22 17:41:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1038,'2026-06-22 17:41:01','2026-06-22 17:41:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1039,'2026-06-22 17:41:01','2026-06-22 17:41:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1040,'2026-06-22 17:41:01','2026-06-22 17:41:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1041,'2026-06-22 17:41:07','2026-06-22 17:41:07',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"sheet\": true}'),(1042,'2026-06-22 17:41:08','2026-06-22 17:41:08',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"sheet\": true}'),(1043,'2026-06-22 17:41:08','2026-06-22 17:41:08',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"sheet\": true}'),(1044,'2026-06-22 17:41:11','2026-06-22 17:41:11',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1045,'2026-06-22 17:41:11','2026-06-22 17:41:11',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1046,'2026-06-22 17:41:11','2026-06-22 17:41:11',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1047,'2026-06-22 17:41:15','2026-06-22 17:41:15',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1048,'2026-06-22 17:41:15','2026-06-22 17:41:15',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1049,'2026-06-22 17:41:15','2026-06-22 17:41:15',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1050,'2026-06-22 17:41:20','2026-06-22 17:41:20',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1051,'2026-06-22 17:41:20','2026-06-22 17:41:20',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1052,'2026-06-22 17:41:20','2026-06-22 17:41:20',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1053,'2026-06-22 17:41:20','2026-06-22 17:41:20',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1054,'2026-06-22 17:41:20','2026-06-22 17:41:20',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1055,'2026-06-22 17:41:20','2026-06-22 17:41:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1056,'2026-06-22 17:41:20','2026-06-22 17:41:20',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1057,'2026-06-22 17:41:20','2026-06-22 17:41:20',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1058,'2026-06-22 17:41:20','2026-06-22 17:41:20',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1059,'2026-06-22 17:41:20','2026-06-22 17:41:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1060,'2026-06-22 17:41:20','2026-06-22 17:41:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1061,'2026-06-22 17:41:20','2026-06-22 17:41:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1062,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1063,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1064,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1065,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1066,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1067,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1068,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1069,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1070,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"sheet\": true}'),(1071,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"sheet\": true}'),(1072,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1073,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"sheet\": true}'),(1074,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1075,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1076,'2026-06-22 17:41:27','2026-06-22 17:41:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1077,'2026-06-22 17:41:32','2026-06-22 17:41:32',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"sheet\": true}'),(1078,'2026-06-22 17:41:32','2026-06-22 17:41:32',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"sheet\": true}'),(1079,'2026-06-22 17:41:32','2026-06-22 17:41:32',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1080,'2026-06-22 17:41:32','2026-06-22 17:41:32',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1081,'2026-06-22 17:41:32','2026-06-22 17:41:32',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1082,'2026-06-22 17:41:32','2026-06-22 17:41:32',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1083,'2026-06-22 17:41:32','2026-06-22 17:41:32',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1084,'2026-06-22 17:41:32','2026-06-22 17:41:32',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1085,'2026-06-22 17:41:36','2026-06-22 17:41:36',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1086,'2026-06-22 17:41:36','2026-06-22 17:41:36',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1087,'2026-06-22 17:41:36','2026-06-22 17:41:36',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1088,'2026-06-22 17:41:36','2026-06-22 17:41:36',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1089,'2026-06-22 17:41:36','2026-06-22 17:41:36',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1090,'2026-06-22 17:41:36','2026-06-22 17:41:36',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1091,'2026-06-22 17:41:40','2026-06-22 17:41:40',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1092,'2026-06-22 17:41:40','2026-06-22 17:41:40',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1093,'2026-06-22 17:41:40','2026-06-22 17:41:40',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1094,'2026-06-22 17:41:40','2026-06-22 17:41:40',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1095,'2026-06-22 17:41:40','2026-06-22 17:41:40',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1096,'2026-06-22 17:41:40','2026-06-22 17:41:40',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1097,'2026-06-22 17:41:42','2026-06-22 17:41:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1098,'2026-06-22 17:41:42','2026-06-22 17:41:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1099,'2026-06-22 17:41:42','2026-06-22 17:41:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1100,'2026-06-22 17:41:42','2026-06-22 17:41:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1101,'2026-06-22 17:41:42','2026-06-22 17:41:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1102,'2026-06-22 17:41:42','2026-06-22 17:41:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1103,'2026-06-22 17:41:42','2026-06-22 17:41:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1104,'2026-06-22 17:41:42','2026-06-22 17:41:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1105,'2026-06-22 17:41:42','2026-06-22 17:41:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1106,'2026-06-22 17:41:42','2026-06-22 17:41:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1107,'2026-06-22 17:41:42','2026-06-22 17:41:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1108,'2026-06-22 17:41:42','2026-06-22 17:41:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1109,'2026-06-22 17:41:46','2026-06-22 17:41:46',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1110,'2026-06-22 17:41:46','2026-06-22 17:41:46',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1111,'2026-06-22 17:41:46','2026-06-22 17:41:46',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1112,'2026-06-22 17:41:46','2026-06-22 17:41:46',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1113,'2026-06-22 17:41:46','2026-06-22 17:41:46',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1114,'2026-06-22 17:41:46','2026-06-22 17:41:46',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1115,'2026-06-22 17:41:46','2026-06-22 17:41:46',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1116,'2026-06-22 17:41:46','2026-06-22 17:41:46',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"sheet\": true}'),(1117,'2026-06-22 17:41:46','2026-06-22 17:41:46',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1118,'2026-06-22 17:41:46','2026-06-22 17:41:46',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1119,'2026-06-22 17:41:46','2026-06-22 17:41:46',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1120,'2026-06-22 17:41:46','2026-06-22 17:41:46',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1121,'2026-06-22 17:41:46','2026-06-22 17:41:46',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1122,'2026-06-22 17:42:14','2026-06-22 17:42:14',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1123,'2026-06-22 17:42:14','2026-06-22 17:42:14',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1124,'2026-06-22 17:42:14','2026-06-22 17:42:14',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1125,'2026-06-22 17:42:14','2026-06-22 17:42:14',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1126,'2026-06-22 17:42:14','2026-06-22 17:42:14',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1127,'2026-06-22 17:42:14','2026-06-22 17:42:14',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1128,'2026-06-22 17:42:14','2026-06-22 17:42:14',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1129,'2026-06-22 17:42:14','2026-06-22 17:42:14',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1130,'2026-06-22 17:42:14','2026-06-22 17:42:14',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1131,'2026-06-22 17:42:14','2026-06-22 17:42:14',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1132,'2026-06-22 17:42:14','2026-06-22 17:42:14',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1133,'2026-06-22 17:42:14','2026-06-22 17:42:14',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1134,'2026-06-22 17:42:34','2026-06-22 17:42:34',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1135,'2026-06-22 17:42:34','2026-06-22 17:42:34',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1136,'2026-06-22 17:42:34','2026-06-22 17:42:34',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1137,'2026-06-22 17:42:34','2026-06-22 17:42:34',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1138,'2026-06-22 17:42:34','2026-06-22 17:42:34',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1139,'2026-06-22 17:42:34','2026-06-22 17:42:34',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1140,'2026-06-22 17:42:34','2026-06-22 17:42:34',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1141,'2026-06-22 17:42:34','2026-06-22 17:42:34',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1142,'2026-06-22 17:42:34','2026-06-22 17:42:34',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1143,'2026-06-22 17:42:34','2026-06-22 17:42:34',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1144,'2026-06-22 17:42:34','2026-06-22 17:42:34',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1145,'2026-06-22 17:42:34','2026-06-22 17:42:34',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1146,'2026-06-22 17:42:37','2026-06-22 17:42:37',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1147,'2026-06-22 17:42:37','2026-06-22 17:42:37',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1148,'2026-06-22 17:42:37','2026-06-22 17:42:37',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1149,'2026-06-22 17:42:37','2026-06-22 17:42:37',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1150,'2026-06-22 17:42:37','2026-06-22 17:42:37',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1151,'2026-06-22 17:42:37','2026-06-22 17:42:37',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1152,'2026-06-22 17:42:37','2026-06-22 17:42:37',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1153,'2026-06-22 17:42:37','2026-06-22 17:42:37',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1154,'2026-06-22 17:42:37','2026-06-22 17:42:37',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1155,'2026-06-22 17:42:37','2026-06-22 17:42:37',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1156,'2026-06-22 17:42:37','2026-06-22 17:42:37',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1157,'2026-06-22 17:42:37','2026-06-22 17:42:37',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1158,'2026-06-22 17:42:45','2026-06-22 17:42:45',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1159,'2026-06-22 17:42:45','2026-06-22 17:42:45',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1160,'2026-06-22 17:42:45','2026-06-22 17:42:45',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1161,'2026-06-22 17:42:45','2026-06-22 17:42:45',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1162,'2026-06-22 17:42:45','2026-06-22 17:42:45',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1163,'2026-06-22 17:42:45','2026-06-22 17:42:45',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1164,'2026-06-22 17:42:45','2026-06-22 17:42:45',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1165,'2026-06-22 17:42:45','2026-06-22 17:42:45',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1166,'2026-06-22 17:42:45','2026-06-22 17:42:45',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1167,'2026-06-22 17:42:45','2026-06-22 17:42:45',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1168,'2026-06-22 17:42:45','2026-06-22 17:42:45',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1169,'2026-06-22 17:42:45','2026-06-22 17:42:45',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1170,'2026-06-22 17:43:30','2026-06-22 17:43:30',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1171,'2026-06-22 17:43:30','2026-06-22 17:43:30',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1172,'2026-06-22 17:43:30','2026-06-22 17:43:30',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1173,'2026-06-22 17:43:30','2026-06-22 17:43:30',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1174,'2026-06-22 17:43:30','2026-06-22 17:43:30',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1175,'2026-06-22 17:43:30','2026-06-22 17:43:30',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1176,'2026-06-22 17:43:30','2026-06-22 17:43:30',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1177,'2026-06-22 17:43:30','2026-06-22 17:43:30',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1178,'2026-06-22 17:43:30','2026-06-22 17:43:30',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1179,'2026-06-22 17:43:30','2026-06-22 17:43:30',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1180,'2026-06-22 17:43:30','2026-06-22 17:43:30',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1181,'2026-06-22 17:43:30','2026-06-22 17:43:30',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1182,'2026-06-22 17:43:50','2026-06-22 17:43:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1183,'2026-06-22 17:43:50','2026-06-22 17:43:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1184,'2026-06-22 17:43:50','2026-06-22 17:43:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1185,'2026-06-22 17:43:50','2026-06-22 17:43:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1186,'2026-06-22 17:43:50','2026-06-22 17:43:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1187,'2026-06-22 17:43:50','2026-06-22 17:43:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1188,'2026-06-22 17:43:50','2026-06-22 17:43:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1189,'2026-06-22 17:43:50','2026-06-22 17:43:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1190,'2026-06-22 17:43:50','2026-06-22 17:43:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1191,'2026-06-22 17:43:50','2026-06-22 17:43:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1192,'2026-06-22 17:43:50','2026-06-22 17:43:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1193,'2026-06-22 17:43:50','2026-06-22 17:43:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1194,'2026-06-22 17:43:55','2026-06-22 17:43:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1195,'2026-06-22 17:43:55','2026-06-22 17:43:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1196,'2026-06-22 17:43:55','2026-06-22 17:43:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1197,'2026-06-22 17:43:55','2026-06-22 17:43:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1198,'2026-06-22 17:43:55','2026-06-22 17:43:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1199,'2026-06-22 17:43:55','2026-06-22 17:43:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1200,'2026-06-22 17:43:55','2026-06-22 17:43:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1201,'2026-06-22 17:43:55','2026-06-22 17:43:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1202,'2026-06-22 17:43:55','2026-06-22 17:43:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1203,'2026-06-22 17:43:55','2026-06-22 17:43:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1204,'2026-06-22 17:43:55','2026-06-22 17:43:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1205,'2026-06-22 17:43:55','2026-06-22 17:43:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1206,'2026-06-22 17:44:04','2026-06-22 17:44:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1207,'2026-06-22 17:44:04','2026-06-22 17:44:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1208,'2026-06-22 17:44:04','2026-06-22 17:44:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1209,'2026-06-22 17:44:09','2026-06-22 17:44:09',NULL,NULL,'/admin/base/open/refreshToken','127.0.0.1','{\"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsInJvbGVJZHMiOlsxXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjo3LCJ0ZW5hbnRJZCI6bnVsbCwiaWF0IjoxNzgyMTE0MTcyLCJleHAiOjE3ODM0MTAxNzJ9.JBHMqVPZyz5ZCrrIGkDSabuq92h1Jnz3MOp0Kbvhuow\"}'),(1210,'2026-06-22 17:44:10','2026-06-22 17:44:10',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1211,'2026-06-22 17:44:10','2026-06-22 17:44:10',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1212,'2026-06-22 17:44:10','2026-06-22 17:44:10',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1213,'2026-06-22 19:25:59','2026-06-22 19:25:59',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1214,'2026-06-22 19:26:00','2026-06-22 19:26:00',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1215,'2026-06-22 19:26:22','2026-06-22 19:26:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1216,'2026-06-22 19:26:22','2026-06-22 19:26:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1217,'2026-06-22 19:26:22','2026-06-22 19:26:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1218,'2026-06-22 19:26:28','2026-06-22 19:26:28',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1219,'2026-06-22 19:26:28','2026-06-22 19:26:28',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1220,'2026-06-22 19:26:28','2026-06-22 19:26:28',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1221,'2026-06-22 19:26:34','2026-06-22 19:26:34',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1222,'2026-06-22 19:26:34','2026-06-22 19:26:34',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1223,'2026-06-22 19:26:34','2026-06-22 19:26:34',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1224,'2026-06-22 19:26:38','2026-06-22 19:26:38',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1225,'2026-06-22 19:26:38','2026-06-22 19:26:38',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1226,'2026-06-22 19:26:38','2026-06-22 19:26:38',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1227,'2026-06-22 19:26:49','2026-06-22 19:26:49',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1228,'2026-06-22 19:26:49','2026-06-22 19:26:49',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1229,'2026-06-22 19:26:49','2026-06-22 19:26:49',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1230,'2026-06-22 19:26:52','2026-06-22 19:26:52',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1231,'2026-06-22 19:26:52','2026-06-22 19:26:52',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1232,'2026-06-22 19:26:52','2026-06-22 19:26:52',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1233,'2026-06-22 19:42:11','2026-06-22 19:42:11',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1234,'2026-06-22 19:42:11','2026-06-22 19:42:11',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1235,'2026-06-22 19:42:11','2026-06-22 19:42:11',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1236,'2026-06-22 19:42:15','2026-06-22 19:42:15',NULL,NULL,'/admin/base/open/refreshToken','127.0.0.1','{\"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsInJvbGVJZHMiOlsxXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjo3LCJ0ZW5hbnRJZCI6bnVsbCwiaWF0IjoxNzgyMTIwOTM0LCJleHAiOjE3ODM0MTY5MzR9.MFXpvisMAKeRZicb-7LEM9Y_n8alitNIxbpPsLg58Gc\"}'),(1237,'2026-06-22 19:42:15','2026-06-22 19:42:15',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1238,'2026-06-22 19:42:15','2026-06-22 19:42:15',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1239,'2026-06-22 19:42:15','2026-06-22 19:42:15',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1240,'2026-06-22 19:42:15','2026-06-22 19:42:15',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1241,'2026-06-22 19:43:01','2026-06-22 19:43:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1242,'2026-06-22 19:43:01','2026-06-22 19:43:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1243,'2026-06-22 19:43:01','2026-06-22 19:43:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1244,'2026-06-22 19:43:05','2026-06-22 19:43:05',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1245,'2026-06-22 19:43:05','2026-06-22 19:43:05',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1246,'2026-06-22 19:43:05','2026-06-22 19:43:05',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1247,'2026-06-22 19:43:05','2026-06-22 19:43:05',NULL,1,'/admin/base/sys/department/list','127.0.0.1','{}'),(1248,'2026-06-22 19:43:05','2026-06-22 19:43:05',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [1, 12, 11, 13]}'),(1249,'2026-06-22 19:43:11','2026-06-22 19:43:11',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(1250,'2026-06-22 19:43:11','2026-06-22 19:43:11',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(1251,'2026-06-22 19:43:11','2026-06-22 19:43:11',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1252,'2026-06-22 19:43:13','2026-06-22 19:43:13',NULL,1,'/admin/base/sys/role/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1253,'2026-06-22 19:43:20','2026-06-22 19:43:20',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1254,'2026-06-22 19:43:20','2026-06-22 19:43:20',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1255,'2026-06-22 19:43:20','2026-06-22 19:43:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1256,'2026-06-22 19:43:24','2026-06-22 19:43:24',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1257,'2026-06-22 19:43:24','2026-06-22 19:43:24',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1258,'2026-06-22 19:43:24','2026-06-22 19:43:24',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1259,'2026-06-22 19:43:24','2026-06-22 19:43:24',NULL,1,'/admin/base/sys/department/list','127.0.0.1','{}'),(1260,'2026-06-22 19:43:24','2026-06-22 19:43:24',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [1, 12, 11, 13]}'),(1261,'2026-06-22 19:43:26','2026-06-22 19:43:26',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(1262,'2026-06-22 19:43:26','2026-06-22 19:43:26',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(1263,'2026-06-22 19:43:27','2026-06-22 19:43:27',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1264,'2026-06-22 19:43:29','2026-06-22 19:43:29',NULL,1,'/admin/base/sys/param/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(1265,'2026-06-22 19:43:31','2026-06-22 19:43:31',NULL,1,'/admin/base/sys/log/getKeep','127.0.0.1','{}'),(1266,'2026-06-22 19:43:31','2026-06-22 19:43:31',NULL,1,'/admin/base/sys/log/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1267,'2026-06-22 19:43:34','2026-06-22 19:43:34',NULL,1,'/admin/task/info/page','127.0.0.1','{\"page\": 1, \"size\": 100}'),(1268,'2026-06-22 19:43:39','2026-06-22 19:43:39',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1269,'2026-06-22 19:43:42','2026-06-22 19:43:42',NULL,1,'/admin/plugin/info/page','127.0.0.1','{\"size\": 1000}'),(1270,'2026-06-22 19:43:44','2026-06-22 19:43:44',NULL,1,'/admin/dict/type/page','127.0.0.1','{\"page\": 1, \"size\": 50, \"sort\": \"asc\", \"order\": \"createTime\", \"keyWord\": \"\"}'),(1271,'2026-06-22 19:43:44','2026-06-22 19:43:44',NULL,1,'/admin/dict/info/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"orderNum\", \"typeId\": 19}'),(1272,'2026-06-22 19:43:44','2026-06-22 19:43:44',NULL,1,'/admin/dict/info/data','127.0.0.1','{\"types\": [\"brand\"]}'),(1273,'2026-06-22 19:46:22','2026-06-22 19:46:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1274,'2026-06-22 19:46:22','2026-06-22 19:46:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1275,'2026-06-22 19:46:22','2026-06-22 19:46:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1276,'2026-06-22 19:46:26','2026-06-22 19:46:26',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1277,'2026-06-22 19:46:26','2026-06-22 19:46:26',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1278,'2026-06-22 19:46:26','2026-06-22 19:46:26',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1279,'2026-06-22 19:46:26','2026-06-22 19:46:26',NULL,1,'/admin/base/open/eps','127.0.0.1','{}'),(1280,'2026-06-22 19:46:26','2026-06-22 19:46:26',NULL,1,'/admin/base/sys/menu/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(1281,'2026-06-22 19:46:26','2026-06-22 19:46:26',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1282,'2026-06-22 19:46:31','2026-06-22 19:46:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1283,'2026-06-22 19:46:31','2026-06-22 19:46:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1284,'2026-06-22 19:46:31','2026-06-22 19:46:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1285,'2026-06-22 19:46:35','2026-06-22 19:46:35',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1286,'2026-06-22 19:46:35','2026-06-22 19:46:35',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1287,'2026-06-22 19:46:35','2026-06-22 19:46:35',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1288,'2026-06-22 19:46:39','2026-06-22 19:46:39',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1289,'2026-06-22 19:46:39','2026-06-22 19:46:39',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1290,'2026-06-22 19:46:39','2026-06-22 19:46:39',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1291,'2026-06-22 19:46:49','2026-06-22 19:46:49',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1292,'2026-06-22 19:46:49','2026-06-22 19:46:49',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1293,'2026-06-22 19:46:49','2026-06-22 19:46:49',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1294,'2026-06-22 19:46:52','2026-06-22 19:46:52',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1295,'2026-06-22 19:46:52','2026-06-22 19:46:52',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1296,'2026-06-22 19:46:52','2026-06-22 19:46:52',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1297,'2026-06-22 19:46:56','2026-06-22 19:46:56',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1298,'2026-06-22 19:46:56','2026-06-22 19:46:56',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1299,'2026-06-22 19:46:56','2026-06-22 19:46:56',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1300,'2026-06-22 19:51:18','2026-06-22 19:51:18',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1301,'2026-06-22 19:51:18','2026-06-22 19:51:18',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1302,'2026-06-22 19:51:18','2026-06-22 19:51:18',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1303,'2026-06-22 19:51:53','2026-06-22 19:51:53',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1304,'2026-06-22 19:51:53','2026-06-22 19:51:53',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1305,'2026-06-22 19:51:53','2026-06-22 19:51:53',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1306,'2026-06-22 19:53:04','2026-06-22 19:53:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1307,'2026-06-22 19:53:04','2026-06-22 19:53:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1308,'2026-06-22 19:53:04','2026-06-22 19:53:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1309,'2026-06-22 19:53:16','2026-06-22 19:53:16',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1310,'2026-06-22 19:53:16','2026-06-22 19:53:16',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1311,'2026-06-22 19:53:16','2026-06-22 19:53:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1312,'2026-06-22 19:53:19','2026-06-22 19:53:19',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1313,'2026-06-22 19:53:19','2026-06-22 19:53:19',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1314,'2026-06-22 19:53:19','2026-06-22 19:53:19',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1315,'2026-06-22 20:04:07','2026-06-22 20:04:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1316,'2026-06-22 20:04:07','2026-06-22 20:04:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1317,'2026-06-22 20:04:07','2026-06-22 20:04:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1318,'2026-06-22 20:04:49','2026-06-22 20:04:49',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1319,'2026-06-22 20:04:49','2026-06-22 20:04:49',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1320,'2026-06-22 20:04:49','2026-06-22 20:04:49',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1321,'2026-06-22 20:05:08','2026-06-22 20:05:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1322,'2026-06-22 20:05:08','2026-06-22 20:05:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1323,'2026-06-22 20:05:08','2026-06-22 20:05:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1324,'2026-06-22 20:05:12','2026-06-22 20:05:12',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1325,'2026-06-22 20:05:12','2026-06-22 20:05:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1326,'2026-06-22 20:05:12','2026-06-22 20:05:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1327,'2026-06-22 20:05:16','2026-06-22 20:05:16',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1328,'2026-06-22 20:05:16','2026-06-22 20:05:16',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1329,'2026-06-22 20:05:16','2026-06-22 20:05:16',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1330,'2026-06-22 20:05:31','2026-06-22 20:05:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1331,'2026-06-22 20:05:31','2026-06-22 20:05:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1332,'2026-06-22 20:05:31','2026-06-22 20:05:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1333,'2026-06-22 20:05:35','2026-06-22 20:05:35',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1334,'2026-06-22 20:05:35','2026-06-22 20:05:35',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1335,'2026-06-22 20:05:35','2026-06-22 20:05:35',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1336,'2026-06-22 20:05:39','2026-06-22 20:05:39',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1337,'2026-06-22 20:05:39','2026-06-22 20:05:39',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1338,'2026-06-22 20:05:39','2026-06-22 20:05:39',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1339,'2026-06-22 20:05:43','2026-06-22 20:05:43',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1340,'2026-06-22 20:05:43','2026-06-22 20:05:43',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1341,'2026-06-22 20:05:43','2026-06-22 20:05:43',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1342,'2026-06-22 20:06:27','2026-06-22 20:06:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1343,'2026-06-22 20:06:27','2026-06-22 20:06:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1344,'2026-06-22 20:06:27','2026-06-22 20:06:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1345,'2026-06-22 21:04:27','2026-06-22 21:04:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1346,'2026-06-22 21:04:27','2026-06-22 21:04:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1347,'2026-06-22 21:04:27','2026-06-22 21:04:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1348,'2026-06-22 21:04:39','2026-06-22 21:04:39',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1349,'2026-06-22 21:04:39','2026-06-22 21:04:39',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1350,'2026-06-22 21:04:39','2026-06-22 21:04:39',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1351,'2026-06-22 21:04:49','2026-06-22 21:04:49',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1352,'2026-06-22 21:04:49','2026-06-22 21:04:49',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1353,'2026-06-22 21:04:49','2026-06-22 21:04:49',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1354,'2026-06-22 21:04:52','2026-06-22 21:04:52',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1355,'2026-06-22 21:04:52','2026-06-22 21:04:52',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1356,'2026-06-22 21:04:52','2026-06-22 21:04:52',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1357,'2026-06-22 21:04:52','2026-06-22 21:04:52',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1358,'2026-06-22 21:05:57','2026-06-22 21:05:57',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1359,'2026-06-22 21:05:57','2026-06-22 21:05:57',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1360,'2026-06-22 21:05:57','2026-06-22 21:05:57',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1361,'2026-06-22 21:06:01','2026-06-22 21:06:01',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1362,'2026-06-22 21:06:01','2026-06-22 21:06:01',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1363,'2026-06-22 21:06:01','2026-06-22 21:06:01',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1364,'2026-06-22 21:06:01','2026-06-22 21:06:01',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1365,'2026-06-22 21:25:13','2026-06-22 21:25:13',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1366,'2026-06-22 21:25:13','2026-06-22 21:25:13',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1367,'2026-06-22 21:25:13','2026-06-22 21:25:13',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1368,'2026-06-22 21:25:18','2026-06-22 21:25:18',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1369,'2026-06-22 21:25:18','2026-06-22 21:25:18',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1370,'2026-06-22 21:25:18','2026-06-22 21:25:18',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1371,'2026-06-22 21:25:28','2026-06-22 21:25:28',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1372,'2026-06-22 21:25:28','2026-06-22 21:25:28',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1373,'2026-06-22 21:25:28','2026-06-22 21:25:28',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1374,'2026-06-22 21:25:33','2026-06-22 21:25:33',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1375,'2026-06-22 21:25:33','2026-06-22 21:25:33',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1376,'2026-06-22 21:25:33','2026-06-22 21:25:33',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1377,'2026-06-22 21:26:17','2026-06-22 21:26:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1378,'2026-06-22 21:26:17','2026-06-22 21:26:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1379,'2026-06-22 21:26:17','2026-06-22 21:26:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1380,'2026-06-22 21:26:21','2026-06-22 21:26:21',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1381,'2026-06-22 21:26:21','2026-06-22 21:26:21',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1382,'2026-06-22 21:26:22','2026-06-22 21:26:22',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1383,'2026-06-22 21:26:27','2026-06-22 21:26:27',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1384,'2026-06-22 21:26:31','2026-06-22 21:26:31',NULL,1,'/admin/plugin/info/page','127.0.0.1','{\"size\": 1000}'),(1385,'2026-06-22 21:27:42','2026-06-22 21:27:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1386,'2026-06-22 21:27:42','2026-06-22 21:27:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1387,'2026-06-22 21:27:42','2026-06-22 21:27:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1388,'2026-06-22 21:29:27','2026-06-22 21:29:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1389,'2026-06-22 21:29:27','2026-06-22 21:29:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1390,'2026-06-22 21:29:27','2026-06-22 21:29:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1391,'2026-06-22 21:29:55','2026-06-22 21:29:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1392,'2026-06-22 21:29:55','2026-06-22 21:29:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1393,'2026-06-22 21:29:55','2026-06-22 21:29:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1394,'2026-06-22 21:30:32','2026-06-22 21:30:32',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1395,'2026-06-22 21:30:32','2026-06-22 21:30:32',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1396,'2026-06-22 21:30:40','2026-06-22 21:30:40',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1397,'2026-06-22 21:30:40','2026-06-22 21:30:40',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1398,'2026-06-22 21:30:41','2026-06-22 21:30:41',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1399,'2026-06-22 21:32:13','2026-06-22 21:32:13',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1400,'2026-06-22 21:32:13','2026-06-22 21:32:13',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1401,'2026-06-22 21:32:33','2026-06-22 21:32:33',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1402,'2026-06-22 21:32:33','2026-06-22 21:32:33',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1403,'2026-06-22 21:32:33','2026-06-22 21:32:33',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1404,'2026-06-22 21:33:31','2026-06-22 21:33:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1405,'2026-06-22 21:33:31','2026-06-22 21:33:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1406,'2026-06-22 21:33:31','2026-06-22 21:33:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1407,'2026-06-22 21:33:34','2026-06-22 21:33:34',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1408,'2026-06-22 21:33:35','2026-06-22 21:33:35',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1409,'2026-06-22 21:33:35','2026-06-22 21:33:35',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1410,'2026-06-22 21:35:11','2026-06-22 21:35:11',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1411,'2026-06-22 21:35:11','2026-06-22 21:35:11',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1412,'2026-06-22 21:35:11','2026-06-22 21:35:11',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1413,'2026-06-22 21:35:15','2026-06-22 21:35:15',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1414,'2026-06-22 21:35:15','2026-06-22 21:35:15',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1415,'2026-06-22 21:35:15','2026-06-22 21:35:15',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1416,'2026-06-22 21:35:16','2026-06-22 21:35:16',NULL,1,'/admin/plugin/info/page','127.0.0.1','{\"size\": 1000}'),(1417,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1418,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1419,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1420,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1421,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1422,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1423,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1424,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1425,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1426,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1427,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1428,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1429,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1430,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1431,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1432,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1433,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1434,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1435,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1436,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1437,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1438,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1439,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1440,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1441,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1442,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1443,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1444,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1445,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1446,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1447,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1448,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1449,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1450,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1451,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1452,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1453,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1454,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1455,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1456,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1457,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1458,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1459,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1460,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1461,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1462,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1463,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1464,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1465,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1466,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1467,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1468,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1469,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1470,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1471,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1472,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1473,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1474,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1475,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1476,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1477,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1478,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1479,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1480,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1481,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1482,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1483,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1484,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1485,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1486,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1487,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1488,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1489,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1490,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1491,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1492,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1493,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1494,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1495,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1496,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1497,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1498,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1499,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1500,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1501,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1502,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1503,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1504,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1505,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1506,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1507,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1508,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1509,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1510,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1511,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1512,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1513,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1514,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1515,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1516,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1517,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1518,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1519,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1520,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1521,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1522,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1523,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1524,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1525,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1526,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1527,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1528,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1529,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1530,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1531,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1532,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1533,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1534,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1535,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1536,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1537,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1538,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1539,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1540,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1541,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1542,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1543,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1544,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1545,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1546,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1547,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1548,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1549,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1550,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1551,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1552,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1553,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1554,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1555,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1556,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1557,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1558,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1559,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1560,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1561,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1562,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1563,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1564,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1565,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1566,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1567,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1568,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1569,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1570,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1571,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1572,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1573,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1574,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1575,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1576,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1577,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1578,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1579,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1580,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1581,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1582,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1583,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1584,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1585,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1586,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1587,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1588,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1589,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1590,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1591,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1592,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1593,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1594,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1595,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1596,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1597,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1598,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1599,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1600,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1601,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1602,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1603,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1604,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1605,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1606,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1607,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1608,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1609,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1610,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1611,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1612,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1613,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1614,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1615,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1616,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1617,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1618,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1619,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1620,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1621,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1622,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1623,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1624,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1625,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1626,'2026-06-22 21:35:31','2026-06-22 21:35:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1627,'2026-06-22 21:35:35','2026-06-22 21:35:35',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1628,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1629,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1630,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1631,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1632,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1633,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1634,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1635,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1636,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1637,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1638,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1639,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1640,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1641,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1642,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1643,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1644,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1645,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1646,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1647,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1648,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1649,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1650,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1651,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1652,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1653,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1654,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1655,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1656,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1657,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1658,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1659,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1660,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1661,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1662,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1663,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1664,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1665,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1666,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1667,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1668,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1669,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1670,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1671,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1672,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1673,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1674,'2026-06-22 21:38:05','2026-06-22 21:38:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1675,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1676,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1677,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1678,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1679,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1680,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1681,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1682,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1683,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1684,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1685,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1686,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1687,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1688,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1689,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1690,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1691,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1692,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1693,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1694,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1695,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1696,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1697,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1698,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1699,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1700,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1701,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1702,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1703,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1704,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1705,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1706,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1707,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1708,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1709,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1710,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1711,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1712,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1713,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1714,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1715,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1716,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1717,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1718,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1719,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1720,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1721,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1722,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1723,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1724,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1725,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1726,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1727,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1728,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1729,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1730,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1731,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1732,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1733,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1734,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1735,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1736,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1737,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1738,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1739,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1740,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1741,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1742,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1743,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1744,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1745,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1746,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1747,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1748,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1749,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1750,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1751,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1752,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1753,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1754,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1755,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1756,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1757,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1758,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1759,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1760,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1761,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1762,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1763,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1764,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1765,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1766,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1767,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1768,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1769,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1770,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1771,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1772,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1773,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1774,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1775,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1776,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1777,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1778,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1779,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1780,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1781,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1782,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1783,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1784,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1785,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1786,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1787,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1788,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1789,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1790,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1791,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1792,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1793,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1794,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1795,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1796,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1797,'2026-06-22 21:38:06','2026-06-22 21:38:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1798,'2026-06-22 21:39:21','2026-06-22 21:39:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1799,'2026-06-22 21:39:21','2026-06-22 21:39:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1800,'2026-06-22 21:39:21','2026-06-22 21:39:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1801,'2026-06-22 21:39:26','2026-06-22 21:39:26',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1802,'2026-06-22 21:39:26','2026-06-22 21:39:26',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1803,'2026-06-22 21:39:26','2026-06-22 21:39:26',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1804,'2026-06-22 21:39:26','2026-06-22 21:39:26',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1805,'2026-06-22 21:40:02','2026-06-22 21:40:02',NULL,1,'/admin/clothing/goods/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(1806,'2026-06-22 21:40:04','2026-06-22 21:40:04',NULL,1,'/admin/clothing/goods/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(1807,'2026-06-22 21:40:05','2026-06-22 21:40:05',NULL,1,'/admin/clothing/goods/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(1808,'2026-06-22 21:40:35','2026-06-22 21:40:35',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1809,'2026-06-22 21:40:35','2026-06-22 21:40:35',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1810,'2026-06-22 21:40:35','2026-06-22 21:40:35',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1811,'2026-06-22 21:40:35','2026-06-22 21:40:35',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1812,'2026-06-22 21:40:35','2026-06-22 21:40:35',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1813,'2026-06-22 21:40:35','2026-06-22 21:40:35',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1814,'2026-06-22 21:40:35','2026-06-22 21:40:35',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1815,'2026-06-22 21:40:35','2026-06-22 21:40:35',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1816,'2026-06-22 21:40:35','2026-06-22 21:40:35',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1817,'2026-06-22 21:40:35','2026-06-22 21:40:35',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1818,'2026-06-22 21:40:35','2026-06-22 21:40:35',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1819,'2026-06-22 21:40:35','2026-06-22 21:40:35',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1820,'2026-06-22 21:40:54','2026-06-22 21:40:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1821,'2026-06-22 21:40:55','2026-06-22 21:40:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1822,'2026-06-22 21:40:55','2026-06-22 21:40:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1823,'2026-06-22 21:40:55','2026-06-22 21:40:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1824,'2026-06-22 21:40:55','2026-06-22 21:40:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1825,'2026-06-22 21:40:55','2026-06-22 21:40:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1826,'2026-06-22 21:41:10','2026-06-22 21:41:10',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1827,'2026-06-22 21:41:11','2026-06-22 21:41:11',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1828,'2026-06-22 21:41:11','2026-06-22 21:41:11',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1829,'2026-06-22 21:41:15','2026-06-22 21:41:15',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1830,'2026-06-22 21:41:15','2026-06-22 21:41:15',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1831,'2026-06-22 21:41:15','2026-06-22 21:41:15',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1832,'2026-06-22 21:42:01','2026-06-22 21:42:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1833,'2026-06-22 21:42:01','2026-06-22 21:42:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1834,'2026-06-22 21:42:01','2026-06-22 21:42:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1835,'2026-06-22 21:42:01','2026-06-22 21:42:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1836,'2026-06-22 21:42:01','2026-06-22 21:42:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1837,'2026-06-22 21:42:01','2026-06-22 21:42:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1838,'2026-06-22 21:42:05','2026-06-22 21:42:05',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1839,'2026-06-22 21:42:05','2026-06-22 21:42:05',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1840,'2026-06-22 21:42:05','2026-06-22 21:42:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1841,'2026-06-22 21:42:09','2026-06-22 21:42:09',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1842,'2026-06-22 21:42:09','2026-06-22 21:42:09',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1843,'2026-06-22 21:42:09','2026-06-22 21:42:09',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1844,'2026-06-22 21:42:10','2026-06-22 21:42:10',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1845,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1846,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1847,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1848,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1849,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1850,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1851,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1852,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1853,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1854,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1855,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1856,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1857,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1858,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1859,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1860,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1861,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1862,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1863,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1864,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1865,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1866,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1867,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1868,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1869,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1870,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1871,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1872,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1873,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1874,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1875,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1876,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1877,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1878,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1879,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1880,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1881,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1882,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1883,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1884,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1885,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1886,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1887,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1888,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1889,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1890,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1891,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1892,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1893,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1894,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1895,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1896,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1897,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1898,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1899,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1900,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1901,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1902,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1903,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1904,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1905,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1906,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1907,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1908,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1909,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1910,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1911,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1912,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1913,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1914,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1915,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1916,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1917,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1918,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1919,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1920,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1921,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1922,'2026-06-22 21:45:21','2026-06-22 21:45:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1923,'2026-06-22 21:45:25','2026-06-22 21:45:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1924,'2026-06-22 21:45:25','2026-06-22 21:45:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1925,'2026-06-22 21:45:25','2026-06-22 21:45:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1926,'2026-06-22 21:45:25','2026-06-22 21:45:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1927,'2026-06-22 21:45:25','2026-06-22 21:45:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1928,'2026-06-22 21:45:25','2026-06-22 21:45:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1929,'2026-06-22 21:45:25','2026-06-22 21:45:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1930,'2026-06-22 21:45:25','2026-06-22 21:45:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1931,'2026-06-22 21:45:25','2026-06-22 21:45:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1932,'2026-06-22 21:45:25','2026-06-22 21:45:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1933,'2026-06-22 21:45:25','2026-06-22 21:45:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1934,'2026-06-22 21:45:25','2026-06-22 21:45:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1935,'2026-06-22 21:45:25','2026-06-22 21:45:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1936,'2026-06-22 21:45:42','2026-06-22 21:45:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1937,'2026-06-22 21:45:42','2026-06-22 21:45:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1938,'2026-06-22 21:45:47','2026-06-22 21:45:47',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1939,'2026-06-22 21:45:47','2026-06-22 21:45:47',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1940,'2026-06-22 21:45:47','2026-06-22 21:45:47',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1941,'2026-06-22 21:46:27','2026-06-22 21:46:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1942,'2026-06-22 21:46:27','2026-06-22 21:46:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1943,'2026-06-22 21:46:27','2026-06-22 21:46:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1944,'2026-06-22 21:46:31','2026-06-22 21:46:31',NULL,NULL,'/admin/base/open/refreshToken','127.0.0.1','{\"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsInJvbGVJZHMiOlsxXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjo3LCJ0ZW5hbnRJZCI6bnVsbCwiaWF0IjoxNzgyMTI4NTM1LCJleHAiOjE3ODM0MjQ1MzV9.c9VVjJ68ry0gmOHFVsnPwoNYyXyyji9fqKYU1tXQnqk\"}'),(1945,'2026-06-22 21:46:31','2026-06-22 21:46:31',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(1946,'2026-06-22 21:46:31','2026-06-22 21:46:31',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(1947,'2026-06-22 21:46:31','2026-06-22 21:46:31',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(1948,'2026-06-22 21:46:31','2026-06-22 21:46:31',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1949,'2026-06-22 21:48:16','2026-06-22 21:48:16',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1950,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1951,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1952,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1953,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1954,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1955,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1956,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1957,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1958,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1959,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1960,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1961,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1962,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1963,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1964,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1965,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1966,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1967,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1968,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1969,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1970,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1971,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1972,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1973,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1974,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1975,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1976,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1977,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1978,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1979,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1980,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1981,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1982,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1983,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1984,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1985,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1986,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1987,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1988,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1989,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1990,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1991,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1992,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1993,'2026-06-22 21:48:17','2026-06-22 21:48:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1994,'2026-06-22 21:48:32','2026-06-22 21:48:32',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1995,'2026-06-22 21:48:32','2026-06-22 21:48:32',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1996,'2026-06-22 21:48:36','2026-06-22 21:48:36',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1997,'2026-06-22 21:48:36','2026-06-22 21:48:36',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1998,'2026-06-22 21:48:36','2026-06-22 21:48:36',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1999,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2000,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2001,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2002,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2003,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2004,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2005,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2006,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2007,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2008,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2009,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2010,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2011,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2012,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2013,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2014,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2015,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2016,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2017,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2018,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2019,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2020,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2021,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2022,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2023,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2024,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2025,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2026,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2027,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2028,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2029,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2030,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2031,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2032,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2033,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2034,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2035,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2036,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2037,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2038,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2039,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2040,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2041,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2042,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2043,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2044,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2045,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2046,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2047,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2048,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2049,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2050,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2051,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2052,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2053,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2054,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2055,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2056,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2057,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2058,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2059,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2060,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2061,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2062,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2063,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2064,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2065,'2026-06-22 21:49:54','2026-06-22 21:49:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2066,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2067,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2068,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2069,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2070,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2071,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2072,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2073,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2074,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2075,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2076,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2077,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2078,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2079,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2080,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2081,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2082,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2083,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2084,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2085,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2086,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2087,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2088,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2089,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2090,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2091,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2092,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2093,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2094,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2095,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2096,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2097,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2098,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2099,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2100,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2101,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2102,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2103,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2104,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2105,'2026-06-22 21:49:55','2026-06-22 21:49:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2106,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2107,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2108,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2109,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2110,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2111,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2112,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2113,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2114,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2115,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2116,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2117,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2118,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2119,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2120,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2121,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2122,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2123,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2124,'2026-06-22 21:49:59','2026-06-22 21:49:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2125,'2026-06-22 21:50:32','2026-06-22 21:50:32',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2126,'2026-06-22 21:50:32','2026-06-22 21:50:32',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2127,'2026-06-22 21:50:41','2026-06-22 21:50:41',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2128,'2026-06-22 21:50:42','2026-06-22 21:50:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2129,'2026-06-22 21:50:42','2026-06-22 21:50:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2130,'2026-06-22 21:52:49','2026-06-22 21:52:49',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2131,'2026-06-22 21:52:49','2026-06-22 21:52:49',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2132,'2026-06-22 21:52:59','2026-06-22 21:52:59',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2133,'2026-06-22 21:52:59','2026-06-22 21:52:59',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2134,'2026-06-22 21:52:59','2026-06-22 21:52:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2135,'2026-06-22 21:53:02','2026-06-22 21:53:02',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2136,'2026-06-22 21:53:02','2026-06-22 21:53:02',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2137,'2026-06-22 21:53:02','2026-06-22 21:53:02',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2138,'2026-06-22 21:53:08','2026-06-22 21:53:08',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2139,'2026-06-22 21:53:08','2026-06-22 21:53:08',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2140,'2026-06-22 21:53:09','2026-06-22 21:53:09',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2141,'2026-06-22 21:53:09','2026-06-22 21:53:09',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2142,'2026-06-22 21:54:32','2026-06-22 21:54:32',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2143,'2026-06-22 21:54:40','2026-06-22 21:54:40',NULL,1,'/admin/base/sys/department/list','127.0.0.1','{}'),(2144,'2026-06-22 21:54:40','2026-06-22 21:54:40',NULL,1,'/admin/base/sys/user/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [1, 12, 11, 13]}'),(2145,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2146,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2147,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2148,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2149,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2150,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2151,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2152,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2153,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2154,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2155,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2156,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2157,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2158,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2159,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2160,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2161,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2162,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2163,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2164,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2165,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2166,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2167,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2168,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2169,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2170,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2171,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2172,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2173,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2174,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2175,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2176,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2177,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2178,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2179,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2180,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2181,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2182,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2183,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2184,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2185,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2186,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2187,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2188,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2189,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2190,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2191,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2192,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2193,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2194,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2195,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2196,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2197,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2198,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2199,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2200,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2201,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2202,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2203,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2204,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2205,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2206,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2207,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2208,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2209,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2210,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2211,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2212,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2213,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2214,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2215,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2216,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2217,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2218,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2219,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2220,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2221,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2222,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2223,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2224,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2225,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2226,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2227,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2228,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2229,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2230,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2231,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2232,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2233,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2234,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2235,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2236,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2237,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2238,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2239,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2240,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2241,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2242,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2243,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2244,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2245,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2246,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2247,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2248,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2249,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2250,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2251,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2252,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2253,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2254,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2255,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2256,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2257,'2026-06-22 21:56:15','2026-06-22 21:56:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2258,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2259,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2260,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2261,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2262,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2263,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2264,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2265,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2266,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2267,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2268,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2269,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2270,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2271,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2272,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2273,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2274,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2275,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2276,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2277,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2278,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2279,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2280,'2026-06-22 21:56:16','2026-06-22 21:56:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2281,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2282,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2283,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2284,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2285,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2286,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2287,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2288,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2289,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2290,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2291,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2292,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2293,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2294,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2295,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2296,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2297,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2298,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2299,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2300,'2026-06-22 21:56:20','2026-06-22 21:56:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2301,'2026-06-22 21:57:17','2026-06-22 21:57:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2302,'2026-06-22 21:57:17','2026-06-22 21:57:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2303,'2026-06-22 21:57:22','2026-06-22 21:57:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2304,'2026-06-22 21:57:22','2026-06-22 21:57:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2305,'2026-06-22 21:57:22','2026-06-22 21:57:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2306,'2026-06-22 21:57:57','2026-06-22 21:57:57',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2307,'2026-06-22 21:57:57','2026-06-22 21:57:57',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2308,'2026-06-22 21:57:57','2026-06-22 21:57:57',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2309,'2026-06-22 21:57:59','2026-06-22 21:57:59',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2310,'2026-06-22 21:57:59','2026-06-22 21:57:59',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2311,'2026-06-22 21:57:59','2026-06-22 21:57:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2312,'2026-06-22 21:58:03','2026-06-22 21:58:03',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2313,'2026-06-22 21:58:03','2026-06-22 21:58:03',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2314,'2026-06-22 21:58:03','2026-06-22 21:58:03',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2315,'2026-06-22 21:58:38','2026-06-22 21:58:38',NULL,1,'/admin/clothing/category/list','127.0.0.1','{}'),(2316,'2026-06-22 21:58:38','2026-06-22 21:58:38',NULL,1,'/admin/merchant/list','127.0.0.1','{}'),(2317,'2026-06-22 21:59:04','2026-06-22 21:59:04',NULL,1,'/admin/merchant/list','127.0.0.1','{}'),(2318,'2026-06-22 21:59:18','2026-06-22 21:59:18',NULL,1,'/admin/dict/type/page','127.0.0.1','{\"page\": 1, \"size\": 50, \"sort\": \"asc\", \"order\": \"createTime\", \"keyWord\": \"\"}'),(2319,'2026-06-22 21:59:18','2026-06-22 21:59:18',NULL,1,'/admin/dict/info/list','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"orderNum\", \"typeId\": 19}'),(2320,'2026-06-22 21:59:18','2026-06-22 21:59:18',NULL,1,'/admin/dict/info/data','127.0.0.1','{\"types\": [\"brand\"]}'),(2321,'2026-06-22 21:59:19','2026-06-22 21:59:19',NULL,1,'/admin/space/type/page','127.0.0.1','{\"page\": 1, \"size\": 50, \"sort\": \"asc\", \"order\": \"createTime\", \"keyWord\": \"\"}'),(2322,'2026-06-22 21:59:19','2026-06-22 21:59:19',NULL,1,'/admin/space/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"total\": 0, \"classifyId\": 1}'),(2323,'2026-06-22 22:00:10','2026-06-22 22:00:10',NULL,1,'/admin/food/agricultureCategory/list','127.0.0.1','{}'),(2324,'2026-06-22 22:00:27','2026-06-22 22:00:27',NULL,1,'/admin/clothing/category/list','127.0.0.1','{}'),(2325,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2326,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2327,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2328,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2329,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2330,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2331,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2332,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2333,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2334,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2335,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2336,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2337,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2338,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2339,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2340,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2341,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2342,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2343,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2344,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2345,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2346,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2347,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2348,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2349,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2350,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2351,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2352,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2353,'2026-06-22 22:01:58','2026-06-22 22:01:58',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2354,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2355,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2356,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2357,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2358,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2359,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2360,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2361,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2362,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2363,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2364,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2365,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2366,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2367,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2368,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2369,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2370,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2371,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2372,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2373,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2374,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2375,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2376,'2026-06-22 22:03:04','2026-06-22 22:03:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2377,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2378,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2379,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2380,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2381,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2382,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2383,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2384,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2385,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2386,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2387,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2388,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2389,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2390,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2391,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2392,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2393,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2394,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2395,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2396,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2397,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2398,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2399,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2400,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2401,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2402,'2026-06-22 22:04:01','2026-06-22 22:04:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2403,'2026-06-22 22:04:02','2026-06-22 22:04:02',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2404,'2026-06-22 22:04:02','2026-06-22 22:04:02',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2405,'2026-06-22 22:04:02','2026-06-22 22:04:02',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2406,'2026-06-22 22:04:05','2026-06-22 22:04:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2407,'2026-06-22 22:05:21','2026-06-22 22:05:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2408,'2026-06-22 22:05:21','2026-06-22 22:05:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2409,'2026-06-22 22:05:21','2026-06-22 22:05:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2410,'2026-06-22 22:05:21','2026-06-22 22:05:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2411,'2026-06-22 22:05:21','2026-06-22 22:05:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2412,'2026-06-22 22:05:21','2026-06-22 22:05:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2413,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2414,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2415,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2416,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2417,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2418,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2419,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2420,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2421,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2422,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2423,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2424,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2425,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2426,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2427,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2428,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2429,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2430,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2431,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2432,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2433,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2434,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2435,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2436,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2437,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2438,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2439,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2440,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2441,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2442,'2026-06-22 22:05:22','2026-06-22 22:05:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2443,'2026-06-22 22:05:45','2026-06-22 22:05:45',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2444,'2026-06-22 22:05:45','2026-06-22 22:05:45',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2445,'2026-06-22 22:05:49','2026-06-22 22:05:49',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2446,'2026-06-22 22:05:49','2026-06-22 22:05:49',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2447,'2026-06-22 22:05:49','2026-06-22 22:05:49',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2448,'2026-06-22 22:07:44','2026-06-22 22:07:44',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2449,'2026-06-22 22:07:44','2026-06-22 22:07:44',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2450,'2026-06-22 22:07:49','2026-06-22 22:07:49',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2451,'2026-06-22 22:07:49','2026-06-22 22:07:49',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2452,'2026-06-22 22:07:49','2026-06-22 22:07:49',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2453,'2026-06-22 22:09:38','2026-06-22 22:09:38',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2454,'2026-06-22 22:09:38','2026-06-22 22:09:38',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2455,'2026-06-22 22:09:38','2026-06-22 22:09:38',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2456,'2026-06-22 22:09:42','2026-06-22 22:09:42',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2457,'2026-06-22 22:10:25','2026-06-22 22:10:25',NULL,NULL,'/admin/base/open/captcha','::1','{\"width\": \"150\", \"height\": \"50\"}'),(2458,'2026-06-22 22:12:17','2026-06-22 22:12:17',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"5fd5bab0-6e44-11f1-bef0-8fb21d71874f\", \"verifyCode\": \"1crq\"}'),(2459,'2026-06-22 22:12:16','2026-06-22 22:12:16',NULL,NULL,'/admin/base/open/captcha','::1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2460,'2026-06-22 22:12:18','2026-06-22 22:12:18',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2461,'2026-06-22 22:12:18','2026-06-22 22:12:18',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2462,'2026-06-22 22:12:18','2026-06-22 22:12:18',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2463,'2026-06-22 22:12:21','2026-06-22 22:12:21',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2464,'2026-06-22 22:12:22','2026-06-22 22:12:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2465,'2026-06-22 22:12:22','2026-06-22 22:12:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2466,'2026-06-22 22:12:22','2026-06-22 22:12:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2467,'2026-06-22 22:12:26','2026-06-22 22:12:26',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2468,'2026-06-22 22:12:26','2026-06-22 22:12:26',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2469,'2026-06-22 22:12:26','2026-06-22 22:12:26',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2470,'2026-06-22 22:12:28','2026-06-22 22:12:28',NULL,1,'/admin/clothing/category/list','127.0.0.1','{}'),(2471,'2026-06-22 22:12:28','2026-06-22 22:12:28',NULL,1,'/admin/merchant/list','127.0.0.1','{}'),(2472,'2026-06-22 22:12:30','2026-06-22 22:12:30',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2473,'2026-06-22 22:12:30','2026-06-22 22:12:30',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2474,'2026-06-22 22:12:30','2026-06-22 22:12:30',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2475,'2026-06-22 22:12:33','2026-06-22 22:12:33',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2476,'2026-06-22 22:12:33','2026-06-22 22:12:33',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2477,'2026-06-22 22:12:33','2026-06-22 22:12:33',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2478,'2026-06-22 22:12:33','2026-06-22 22:12:33',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2479,'2026-06-22 22:12:37','2026-06-22 22:12:37',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2480,'2026-06-22 22:12:37','2026-06-22 22:12:37',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2481,'2026-06-22 22:12:37','2026-06-22 22:12:37',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2482,'2026-06-22 22:12:40','2026-06-22 22:12:40',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2483,'2026-06-22 22:12:40','2026-06-22 22:12:40',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2484,'2026-06-22 22:12:40','2026-06-22 22:12:40',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2485,'2026-06-22 22:12:40','2026-06-22 22:12:40',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2486,'2026-06-22 22:12:43','2026-06-22 22:12:43',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2487,'2026-06-22 22:12:43','2026-06-22 22:12:43',NULL,1,'/admin/food/agricultureGoods/list','127.0.0.1','{}'),(2488,'2026-06-22 22:12:44','2026-06-22 22:12:44',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2489,'2026-06-22 22:12:44','2026-06-22 22:12:44',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2490,'2026-06-22 22:12:44','2026-06-22 22:12:44',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2491,'2026-06-22 22:12:47','2026-06-22 22:12:47',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2492,'2026-06-22 22:12:47','2026-06-22 22:12:47',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2493,'2026-06-22 22:12:47','2026-06-22 22:12:47',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2494,'2026-06-22 22:12:48','2026-06-22 22:12:48',NULL,1,'/admin/food/dish/list','127.0.0.1','{}'),(2495,'2026-06-22 22:12:48','2026-06-22 22:12:48',NULL,1,'/admin/food/restaurant/list','127.0.0.1','{}'),(2496,'2026-06-22 22:12:48','2026-06-22 22:12:48',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2497,'2026-06-22 22:12:50','2026-06-22 22:12:50',NULL,1,'/admin/food/restaurant/list','127.0.0.1','{}'),(2498,'2026-06-22 22:12:50','2026-06-22 22:12:50',NULL,1,'/admin/food/dish/list','127.0.0.1','{}'),(2499,'2026-06-22 22:12:50','2026-06-22 22:12:50',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2500,'2026-06-22 22:12:51','2026-06-22 22:12:51',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2501,'2026-06-22 22:12:51','2026-06-22 22:12:51',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2502,'2026-06-22 22:12:51','2026-06-22 22:12:51',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2503,'2026-06-22 22:12:55','2026-06-22 22:12:55',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2504,'2026-06-22 22:12:55','2026-06-22 22:12:55',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2505,'2026-06-22 22:12:55','2026-06-22 22:12:55',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2506,'2026-06-22 22:12:55','2026-06-22 22:12:55',NULL,1,'/admin/lodging/hostel/list','127.0.0.1','{}'),(2507,'2026-06-22 22:12:55','2026-06-22 22:12:55',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2508,'2026-06-22 22:12:57','2026-06-22 22:12:57',NULL,1,'/admin/lodging/hostel/list','127.0.0.1','{}'),(2509,'2026-06-22 22:12:57','2026-06-22 22:12:57',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2510,'2026-06-22 22:12:58','2026-06-22 22:12:58',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2511,'2026-06-22 22:12:58','2026-06-22 22:12:58',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2512,'2026-06-22 22:12:58','2026-06-22 22:12:58',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2513,'2026-06-22 22:13:02','2026-06-22 22:13:02',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2514,'2026-06-22 22:13:02','2026-06-22 22:13:02',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2515,'2026-06-22 22:13:02','2026-06-22 22:13:02',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2516,'2026-06-22 22:13:02','2026-06-22 22:13:02',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2517,'2026-06-22 22:13:02','2026-06-22 22:13:02',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(2518,'2026-06-22 22:13:04','2026-06-22 22:13:04',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(2519,'2026-06-22 22:13:04','2026-06-22 22:13:04',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2520,'2026-06-22 22:13:04','2026-06-22 22:13:04',NULL,1,'/admin/community/comment/list','127.0.0.1','{}'),(2521,'2026-06-22 22:13:04','2026-06-22 22:13:04',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2522,'2026-06-22 22:13:06','2026-06-22 22:13:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2523,'2026-06-22 22:13:06','2026-06-22 22:13:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2524,'2026-06-22 22:13:06','2026-06-22 22:13:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2525,'2026-06-22 22:13:09','2026-06-22 22:13:09',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2526,'2026-06-22 22:13:09','2026-06-22 22:13:09',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2527,'2026-06-22 22:13:09','2026-06-22 22:13:09',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2528,'2026-06-22 22:13:11','2026-06-22 22:13:11',NULL,1,'/admin/travel/scenic/list','127.0.0.1','{}'),(2529,'2026-06-22 22:13:45','2026-06-22 22:13:45',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"94a07050-6e44-11f1-bef0-8fb21d71874f\", \"verifyCode\": \"pqrj\"}'),(2530,'2026-06-22 22:13:45','2026-06-22 22:13:45',NULL,NULL,'/admin/base/open/captcha','::1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2531,'2026-06-22 22:13:46','2026-06-22 22:13:46',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2532,'2026-06-22 22:13:46','2026-06-22 22:13:46',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2533,'2026-06-22 22:13:46','2026-06-22 22:13:46',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2534,'2026-06-22 22:13:50','2026-06-22 22:13:50',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2535,'2026-06-22 22:13:51','2026-06-22 22:13:51',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2536,'2026-06-22 22:13:51','2026-06-22 22:13:51',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2537,'2026-06-22 22:13:51','2026-06-22 22:13:51',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2538,'2026-06-22 22:13:54','2026-06-22 22:13:54',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2539,'2026-06-22 22:13:54','2026-06-22 22:13:54',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2540,'2026-06-22 22:13:54','2026-06-22 22:13:54',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2541,'2026-06-22 22:13:56','2026-06-22 22:13:56',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2542,'2026-06-22 22:13:56','2026-06-22 22:13:56',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2543,'2026-06-22 22:13:56','2026-06-22 22:13:56',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2544,'2026-06-22 22:13:59','2026-06-22 22:13:59',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2545,'2026-06-22 22:13:59','2026-06-22 22:13:59',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2546,'2026-06-22 22:13:59','2026-06-22 22:13:59',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2547,'2026-06-22 22:14:01','2026-06-22 22:14:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2548,'2026-06-22 22:14:01','2026-06-22 22:14:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2549,'2026-06-22 22:14:01','2026-06-22 22:14:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2550,'2026-06-22 22:14:04','2026-06-22 22:14:04',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2551,'2026-06-22 22:14:04','2026-06-22 22:14:04',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2552,'2026-06-22 22:14:04','2026-06-22 22:14:04',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2553,'2026-06-22 22:14:06','2026-06-22 22:14:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2554,'2026-06-22 22:14:06','2026-06-22 22:14:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2555,'2026-06-22 22:14:06','2026-06-22 22:14:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2556,'2026-06-22 22:14:09','2026-06-22 22:14:09',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2557,'2026-06-22 22:14:09','2026-06-22 22:14:09',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2558,'2026-06-22 22:14:09','2026-06-22 22:14:09',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2559,'2026-06-22 22:14:09','2026-06-22 22:14:09',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2560,'2026-06-22 22:14:09','2026-06-22 22:14:09',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}'),(2561,'2026-06-22 22:14:11','2026-06-22 22:14:11',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2562,'2026-06-22 22:14:11','2026-06-22 22:14:11',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2563,'2026-06-22 22:14:11','2026-06-22 22:14:11',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2564,'2026-06-22 22:14:14','2026-06-22 22:14:14',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2565,'2026-06-22 22:14:14','2026-06-22 22:14:14',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2566,'2026-06-22 22:14:14','2026-06-22 22:14:14',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2567,'2026-06-22 22:14:15','2026-06-22 22:14:15',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2568,'2026-06-22 22:14:15','2026-06-22 22:14:15',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}'),(2569,'2026-06-22 22:14:16','2026-06-22 22:14:16',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2570,'2026-06-22 22:14:16','2026-06-22 22:14:16',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2571,'2026-06-22 22:14:16','2026-06-22 22:14:16',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2572,'2026-06-22 22:14:19','2026-06-22 22:14:19',NULL,1,'/admin/clothing/category/list','127.0.0.1','{}'),(2573,'2026-06-22 22:14:19','2026-06-22 22:14:19',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2574,'2026-06-22 22:14:19','2026-06-22 22:14:19',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2575,'2026-06-22 22:14:20','2026-06-22 22:14:20',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2576,'2026-06-22 22:14:21','2026-06-22 22:14:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2577,'2026-06-22 22:14:21','2026-06-22 22:14:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2578,'2026-06-22 22:14:21','2026-06-22 22:14:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2579,'2026-06-22 22:14:24','2026-06-22 22:14:24',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2580,'2026-06-22 22:14:24','2026-06-22 22:14:24',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2581,'2026-06-22 22:14:24','2026-06-22 22:14:24',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2582,'2026-06-22 22:14:26','2026-06-22 22:14:26',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2583,'2026-06-22 22:14:26','2026-06-22 22:14:26',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2584,'2026-06-22 22:14:26','2026-06-22 22:14:26',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2585,'2026-06-22 22:14:29','2026-06-22 22:14:29',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2586,'2026-06-22 22:14:29','2026-06-22 22:14:29',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2587,'2026-06-22 22:14:29','2026-06-22 22:14:29',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2588,'2026-06-22 22:14:31','2026-06-22 22:14:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2589,'2026-06-22 22:14:31','2026-06-22 22:14:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2590,'2026-06-22 22:14:31','2026-06-22 22:14:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2591,'2026-06-22 22:14:34','2026-06-22 22:14:34',NULL,1,'/admin/clothing/category/list','127.0.0.1','{}'),(2592,'2026-06-22 22:14:34','2026-06-22 22:14:34',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2593,'2026-06-22 22:14:34','2026-06-22 22:14:34',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2594,'2026-06-22 22:14:34','2026-06-22 22:14:34',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2595,'2026-06-22 22:14:36','2026-06-22 22:14:36',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2596,'2026-06-22 22:14:36','2026-06-22 22:14:36',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2597,'2026-06-22 22:14:36','2026-06-22 22:14:36',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2598,'2026-06-22 22:14:39','2026-06-22 22:14:39',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2599,'2026-06-22 22:14:39','2026-06-22 22:14:39',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2600,'2026-06-22 22:14:39','2026-06-22 22:14:39',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2601,'2026-06-22 22:14:41','2026-06-22 22:14:41',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2602,'2026-06-22 22:14:41','2026-06-22 22:14:41',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2603,'2026-06-22 22:14:41','2026-06-22 22:14:41',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2604,'2026-06-22 22:14:45','2026-06-22 22:14:45',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2605,'2026-06-22 22:14:45','2026-06-22 22:14:45',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2606,'2026-06-22 22:14:45','2026-06-22 22:14:45',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2607,'2026-06-22 22:14:45','2026-06-22 22:14:45',NULL,1,'/admin/food/dish/list','127.0.0.1','{}'),(2608,'2026-06-22 22:14:45','2026-06-22 22:14:45',NULL,1,'/admin/food/restaurant/list','127.0.0.1','{}'),(2609,'2026-06-22 22:14:45','2026-06-22 22:14:45',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2610,'2026-06-22 22:14:46','2026-06-22 22:14:46',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2611,'2026-06-22 22:14:46','2026-06-22 22:14:46',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2612,'2026-06-22 22:14:46','2026-06-22 22:14:46',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2613,'2026-06-22 22:14:50','2026-06-22 22:14:50',NULL,1,'/admin/clothing/category/add','127.0.0.1','{\"name\": \"11\", \"sort\": 1, \"status\": 1}'),(2614,'2026-06-22 22:14:50','2026-06-22 22:14:50',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(2615,'2026-06-22 22:14:50','2026-06-22 22:14:50',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2616,'2026-06-22 22:14:50','2026-06-22 22:14:50',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2617,'2026-06-22 22:14:50','2026-06-22 22:14:50',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2618,'2026-06-22 22:14:50','2026-06-22 22:14:50',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2619,'2026-06-22 22:14:51','2026-06-22 22:14:51',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2620,'2026-06-22 22:14:51','2026-06-22 22:14:51',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2621,'2026-06-22 22:14:51','2026-06-22 22:14:51',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2622,'2026-06-22 22:14:55','2026-06-22 22:14:55',NULL,1,'/admin/clothing/category/list','127.0.0.1','{}'),(2623,'2026-06-22 22:14:55','2026-06-22 22:14:55',NULL,1,'/admin/clothing/category/info','127.0.0.1','{\"id\": \"1\"}'),(2624,'2026-06-22 22:14:55','2026-06-22 22:14:55',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2625,'2026-06-22 22:14:55','2026-06-22 22:14:55',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2626,'2026-06-22 22:14:55','2026-06-22 22:14:55',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2627,'2026-06-22 22:14:56','2026-06-22 22:14:56',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2628,'2026-06-22 22:14:56','2026-06-22 22:14:56',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2629,'2026-06-22 22:14:56','2026-06-22 22:14:56',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2630,'2026-06-22 22:15:00','2026-06-22 22:15:00',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2631,'2026-06-22 22:15:00','2026-06-22 22:15:00',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2632,'2026-06-22 22:15:00','2026-06-22 22:15:00',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2633,'2026-06-22 22:15:01','2026-06-22 22:15:01',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2634,'2026-06-22 22:15:01','2026-06-22 22:15:01',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2635,'2026-06-22 22:15:01','2026-06-22 22:15:01',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2636,'2026-06-22 22:15:05','2026-06-22 22:15:05',NULL,1,'/admin/clothing/category/list','127.0.0.1','{}'),(2637,'2026-06-22 22:15:05','2026-06-22 22:15:05',NULL,1,'/admin/clothing/category/info','127.0.0.1','{\"id\": \"1\"}'),(2638,'2026-06-22 22:15:05','2026-06-22 22:15:05',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2639,'2026-06-22 22:15:05','2026-06-22 22:15:05',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2640,'2026-06-22 22:15:05','2026-06-22 22:15:05',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2641,'2026-06-22 22:15:07','2026-06-22 22:15:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2642,'2026-06-22 22:15:07','2026-06-22 22:15:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2643,'2026-06-22 22:15:07','2026-06-22 22:15:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2644,'2026-06-22 22:15:10','2026-06-22 22:15:10',NULL,1,'/admin/clothing/category/list','127.0.0.1','{}'),(2645,'2026-06-22 22:15:10','2026-06-22 22:15:10',NULL,1,'/admin/clothing/category/info','127.0.0.1','{\"id\": \"1\"}'),(2646,'2026-06-22 22:15:10','2026-06-22 22:15:10',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2647,'2026-06-22 22:15:10','2026-06-22 22:15:10',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2648,'2026-06-22 22:15:10','2026-06-22 22:15:10',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2649,'2026-06-22 22:15:12','2026-06-22 22:15:12',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2650,'2026-06-22 22:15:12','2026-06-22 22:15:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2651,'2026-06-22 22:15:12','2026-06-22 22:15:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2652,'2026-06-22 22:15:15','2026-06-22 22:15:15',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2653,'2026-06-22 22:15:15','2026-06-22 22:15:15',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2654,'2026-06-22 22:15:15','2026-06-22 22:15:15',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2655,'2026-06-22 22:15:15','2026-06-22 22:15:15',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2656,'2026-06-22 22:15:15','2026-06-22 22:15:15',NULL,1,'/admin/lodging/hostel/list','127.0.0.1','{}'),(2657,'2026-06-22 22:15:15','2026-06-22 22:15:15',NULL,1,'/admin/clothing/category/list','127.0.0.1','{}'),(2658,'2026-06-22 22:15:15','2026-06-22 22:15:15',NULL,1,'/admin/merchant/list','127.0.0.1','{}'),(2659,'2026-06-22 22:15:17','2026-06-22 22:15:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2660,'2026-06-22 22:15:17','2026-06-22 22:15:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2661,'2026-06-22 22:15:17','2026-06-22 22:15:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2662,'2026-06-22 22:15:20','2026-06-22 22:15:20',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2663,'2026-06-22 22:15:20','2026-06-22 22:15:20',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2664,'2026-06-22 22:15:20','2026-06-22 22:15:20',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2665,'2026-06-22 22:15:22','2026-06-22 22:15:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2666,'2026-06-22 22:15:22','2026-06-22 22:15:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2667,'2026-06-22 22:15:22','2026-06-22 22:15:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2668,'2026-06-22 22:15:25','2026-06-22 22:15:25',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2669,'2026-06-22 22:15:25','2026-06-22 22:15:25',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2670,'2026-06-22 22:15:25','2026-06-22 22:15:25',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2671,'2026-06-22 22:15:27','2026-06-22 22:15:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2672,'2026-06-22 22:15:27','2026-06-22 22:15:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2673,'2026-06-22 22:15:27','2026-06-22 22:15:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2674,'2026-06-22 22:15:30','2026-06-22 22:15:30',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2675,'2026-06-22 22:15:30','2026-06-22 22:15:30',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2676,'2026-06-22 22:15:30','2026-06-22 22:15:30',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2677,'2026-06-22 22:15:32','2026-06-22 22:15:32',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2678,'2026-06-22 22:15:32','2026-06-22 22:15:32',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2679,'2026-06-22 22:15:32','2026-06-22 22:15:32',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2680,'2026-06-22 22:15:35','2026-06-22 22:15:35',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2681,'2026-06-22 22:15:35','2026-06-22 22:15:35',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2682,'2026-06-22 22:15:35','2026-06-22 22:15:35',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2683,'2026-06-22 22:15:37','2026-06-22 22:15:37',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2684,'2026-06-22 22:15:37','2026-06-22 22:15:37',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2685,'2026-06-22 22:15:37','2026-06-22 22:15:37',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2686,'2026-06-22 22:15:40','2026-06-22 22:15:40',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2687,'2026-06-22 22:15:40','2026-06-22 22:15:40',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2688,'2026-06-22 22:15:40','2026-06-22 22:15:40',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2689,'2026-06-22 22:15:42','2026-06-22 22:15:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2690,'2026-06-22 22:15:42','2026-06-22 22:15:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2691,'2026-06-22 22:15:42','2026-06-22 22:15:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2692,'2026-06-22 22:15:45','2026-06-22 22:15:45',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2693,'2026-06-22 22:15:45','2026-06-22 22:15:45',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2694,'2026-06-22 22:15:45','2026-06-22 22:15:45',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2695,'2026-06-22 22:15:47','2026-06-22 22:15:47',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2696,'2026-06-22 22:15:47','2026-06-22 22:15:47',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2697,'2026-06-22 22:15:47','2026-06-22 22:15:47',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2698,'2026-06-22 22:15:50','2026-06-22 22:15:50',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2699,'2026-06-22 22:15:50','2026-06-22 22:15:50',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2700,'2026-06-22 22:15:50','2026-06-22 22:15:50',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2701,'2026-06-22 22:15:52','2026-06-22 22:15:52',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2702,'2026-06-22 22:15:52','2026-06-22 22:15:52',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2703,'2026-06-22 22:15:52','2026-06-22 22:15:52',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2704,'2026-06-22 22:15:55','2026-06-22 22:15:55',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2705,'2026-06-22 22:15:55','2026-06-22 22:15:55',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2706,'2026-06-22 22:15:55','2026-06-22 22:15:55',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2707,'2026-06-22 22:15:55','2026-06-22 22:15:55',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2708,'2026-06-22 22:15:57','2026-06-22 22:15:57',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2709,'2026-06-22 22:15:57','2026-06-22 22:15:57',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2710,'2026-06-22 22:15:57','2026-06-22 22:15:57',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2711,'2026-06-22 22:16:00','2026-06-22 22:16:00',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2712,'2026-06-22 22:16:00','2026-06-22 22:16:00',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2713,'2026-06-22 22:16:00','2026-06-22 22:16:00',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2714,'2026-06-22 22:16:00','2026-06-22 22:16:00',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2715,'2026-06-22 22:16:02','2026-06-22 22:16:02',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2716,'2026-06-22 22:16:02','2026-06-22 22:16:02',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2717,'2026-06-22 22:16:02','2026-06-22 22:16:02',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2718,'2026-06-22 22:16:05','2026-06-22 22:16:05',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2719,'2026-06-22 22:16:05','2026-06-22 22:16:05',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2720,'2026-06-22 22:16:05','2026-06-22 22:16:05',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2721,'2026-06-22 22:16:07','2026-06-22 22:16:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2722,'2026-06-22 22:16:07','2026-06-22 22:16:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2723,'2026-06-22 22:16:07','2026-06-22 22:16:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2724,'2026-06-22 22:16:10','2026-06-22 22:16:10',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2725,'2026-06-22 22:16:10','2026-06-22 22:16:10',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2726,'2026-06-22 22:16:10','2026-06-22 22:16:10',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2727,'2026-06-22 22:16:10','2026-06-22 22:16:10',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(2728,'2026-06-22 22:16:10','2026-06-22 22:16:10',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2729,'2026-06-22 22:16:12','2026-06-22 22:16:12',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2730,'2026-06-22 22:16:12','2026-06-22 22:16:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2731,'2026-06-22 22:16:12','2026-06-22 22:16:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2732,'2026-06-22 22:16:15','2026-06-22 22:16:15',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2733,'2026-06-22 22:16:15','2026-06-22 22:16:15',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2734,'2026-06-22 22:16:15','2026-06-22 22:16:15',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2735,'2026-06-22 22:16:17','2026-06-22 22:16:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2736,'2026-06-22 22:16:17','2026-06-22 22:16:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2737,'2026-06-22 22:16:17','2026-06-22 22:16:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2738,'2026-06-22 22:16:20','2026-06-22 22:16:20',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2739,'2026-06-22 22:16:20','2026-06-22 22:16:20',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2740,'2026-06-22 22:16:20','2026-06-22 22:16:20',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2741,'2026-06-22 22:16:22','2026-06-22 22:16:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2742,'2026-06-22 22:16:22','2026-06-22 22:16:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2743,'2026-06-22 22:16:22','2026-06-22 22:16:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2744,'2026-06-22 22:16:25','2026-06-22 22:16:25',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2745,'2026-06-22 22:16:25','2026-06-22 22:16:25',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2746,'2026-06-22 22:16:25','2026-06-22 22:16:25',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2747,'2026-06-22 22:16:27','2026-06-22 22:16:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2748,'2026-06-22 22:16:27','2026-06-22 22:16:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2749,'2026-06-22 22:16:27','2026-06-22 22:16:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2750,'2026-06-22 22:16:30','2026-06-22 22:16:30',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2751,'2026-06-22 22:16:30','2026-06-22 22:16:30',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2752,'2026-06-22 22:16:30','2026-06-22 22:16:30',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2753,'2026-06-22 22:16:30','2026-06-22 22:16:30',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(2754,'2026-06-22 22:16:32','2026-06-22 22:16:32',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2755,'2026-06-22 22:16:32','2026-06-22 22:16:32',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2756,'2026-06-22 22:16:32','2026-06-22 22:16:32',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2757,'2026-06-22 22:16:35','2026-06-22 22:16:35',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2758,'2026-06-22 22:16:35','2026-06-22 22:16:35',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2759,'2026-06-22 22:16:35','2026-06-22 22:16:35',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2760,'2026-06-22 22:16:37','2026-06-22 22:16:37',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2761,'2026-06-22 22:16:37','2026-06-22 22:16:37',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2762,'2026-06-22 22:16:37','2026-06-22 22:16:37',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2763,'2026-06-22 22:16:40','2026-06-22 22:16:40',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2764,'2026-06-22 22:16:40','2026-06-22 22:16:40',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2765,'2026-06-22 22:16:40','2026-06-22 22:16:40',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2766,'2026-06-22 22:16:41','2026-06-22 22:16:41',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(2767,'2026-06-22 22:16:42','2026-06-22 22:16:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2768,'2026-06-22 22:16:42','2026-06-22 22:16:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2769,'2026-06-22 22:16:42','2026-06-22 22:16:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2770,'2026-06-22 22:17:15','2026-06-22 22:17:15',NULL,NULL,'/admin/base/open/captcha','::1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2771,'2026-06-22 22:17:15','2026-06-22 22:17:15',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"11dd4a70-6e45-11f1-bef0-8fb21d71874f\", \"verifyCode\": \"elgg\"}'),(2772,'2026-06-22 22:17:17','2026-06-22 22:17:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2773,'2026-06-22 22:17:17','2026-06-22 22:17:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2774,'2026-06-22 22:17:17','2026-06-22 22:17:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2775,'2026-06-22 22:17:21','2026-06-22 22:17:21',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2776,'2026-06-22 22:17:21','2026-06-22 22:17:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2777,'2026-06-22 22:17:21','2026-06-22 22:17:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2778,'2026-06-22 22:17:21','2026-06-22 22:17:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2779,'2026-06-22 22:17:24','2026-06-22 22:17:24',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2780,'2026-06-22 22:17:24','2026-06-22 22:17:24',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2781,'2026-06-22 22:17:24','2026-06-22 22:17:24',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2782,'2026-06-22 22:17:25','2026-06-22 22:17:25',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2783,'2026-06-22 22:17:25','2026-06-22 22:17:25',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2784,'2026-06-22 22:17:25','2026-06-22 22:17:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2785,'2026-06-22 22:17:29','2026-06-22 22:17:29',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2786,'2026-06-22 22:17:29','2026-06-22 22:17:29',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2787,'2026-06-22 22:17:29','2026-06-22 22:17:29',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2788,'2026-06-22 22:17:30','2026-06-22 22:17:30',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2789,'2026-06-22 22:17:30','2026-06-22 22:17:30',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2790,'2026-06-22 22:17:30','2026-06-22 22:17:30',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2791,'2026-06-22 22:17:33','2026-06-22 22:17:33',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2792,'2026-06-22 22:17:33','2026-06-22 22:17:33',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2793,'2026-06-22 22:17:33','2026-06-22 22:17:33',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2794,'2026-06-22 22:17:34','2026-06-22 22:17:34',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2795,'2026-06-22 22:17:34','2026-06-22 22:17:34',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2796,'2026-06-22 22:17:34','2026-06-22 22:17:34',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2797,'2026-06-22 22:17:37','2026-06-22 22:17:37',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2798,'2026-06-22 22:17:37','2026-06-22 22:17:37',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2799,'2026-06-22 22:17:38','2026-06-22 22:17:38',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2800,'2026-06-22 22:17:38','2026-06-22 22:17:38',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2801,'2026-06-22 22:17:41','2026-06-22 22:17:41',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2802,'2026-06-22 22:17:41','2026-06-22 22:17:41',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2803,'2026-06-22 22:17:41','2026-06-22 22:17:41',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2804,'2026-06-22 22:17:41','2026-06-22 22:17:41',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2805,'2026-06-22 22:17:41','2026-06-22 22:17:41',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}'),(2806,'2026-06-22 22:17:42','2026-06-22 22:17:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2807,'2026-06-22 22:17:42','2026-06-22 22:17:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2808,'2026-06-22 22:17:42','2026-06-22 22:17:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2809,'2026-06-22 22:17:45','2026-06-22 22:17:45',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2810,'2026-06-22 22:17:45','2026-06-22 22:17:45',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2811,'2026-06-22 22:17:45','2026-06-22 22:17:45',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2812,'2026-06-22 22:17:46','2026-06-22 22:17:46',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2813,'2026-06-22 22:17:46','2026-06-22 22:17:46',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2814,'2026-06-22 22:17:46','2026-06-22 22:17:46',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2815,'2026-06-22 22:17:50','2026-06-22 22:17:50',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2816,'2026-06-22 22:17:50','2026-06-22 22:17:50',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2817,'2026-06-22 22:17:50','2026-06-22 22:17:50',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2818,'2026-06-22 22:17:51','2026-06-22 22:17:51',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2819,'2026-06-22 22:17:51','2026-06-22 22:17:51',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2820,'2026-06-22 22:17:51','2026-06-22 22:17:51',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2821,'2026-06-22 22:17:54','2026-06-22 22:17:54',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2822,'2026-06-22 22:17:54','2026-06-22 22:17:54',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2823,'2026-06-22 22:17:54','2026-06-22 22:17:54',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2824,'2026-06-22 22:17:55','2026-06-22 22:17:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2825,'2026-06-22 22:17:55','2026-06-22 22:17:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2826,'2026-06-22 22:17:55','2026-06-22 22:17:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2827,'2026-06-22 22:17:59','2026-06-22 22:17:59',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2828,'2026-06-22 22:17:59','2026-06-22 22:17:59',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2829,'2026-06-22 22:17:59','2026-06-22 22:17:59',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2830,'2026-06-22 22:18:00','2026-06-22 22:18:00',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2831,'2026-06-22 22:18:00','2026-06-22 22:18:00',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2832,'2026-06-22 22:18:00','2026-06-22 22:18:00',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2833,'2026-06-22 22:18:03','2026-06-22 22:18:03',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2834,'2026-06-22 22:18:03','2026-06-22 22:18:03',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2835,'2026-06-22 22:18:03','2026-06-22 22:18:03',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2836,'2026-06-22 22:18:04','2026-06-22 22:18:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2837,'2026-06-22 22:18:04','2026-06-22 22:18:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2838,'2026-06-22 22:18:04','2026-06-22 22:18:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2839,'2026-06-22 22:18:08','2026-06-22 22:18:08',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2840,'2026-06-22 22:18:08','2026-06-22 22:18:08',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2841,'2026-06-22 22:18:08','2026-06-22 22:18:08',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2842,'2026-06-22 22:18:08','2026-06-22 22:18:08',NULL,1,'/admin/food/restaurant/list','127.0.0.1','{}'),(2843,'2026-06-22 22:18:08','2026-06-22 22:18:08',NULL,1,'/admin/food/dish/list','127.0.0.1','{}'),(2844,'2026-06-22 22:18:08','2026-06-22 22:18:08',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2845,'2026-06-22 22:18:09','2026-06-22 22:18:09',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2846,'2026-06-22 22:18:09','2026-06-22 22:18:09',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2847,'2026-06-22 22:18:09','2026-06-22 22:18:09',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2848,'2026-06-22 22:18:12','2026-06-22 22:18:12',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2849,'2026-06-22 22:18:12','2026-06-22 22:18:12',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2850,'2026-06-22 22:18:12','2026-06-22 22:18:12',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2851,'2026-06-22 22:18:13','2026-06-22 22:18:13',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2852,'2026-06-22 22:18:13','2026-06-22 22:18:13',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2853,'2026-06-22 22:18:13','2026-06-22 22:18:13',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2854,'2026-06-22 22:18:13','2026-06-22 22:18:13',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2855,'2026-06-22 22:18:17','2026-06-22 22:18:17',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2856,'2026-06-22 22:18:17','2026-06-22 22:18:17',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2857,'2026-06-22 22:18:17','2026-06-22 22:18:17',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2858,'2026-06-22 22:18:18','2026-06-22 22:18:18',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2859,'2026-06-22 22:18:18','2026-06-22 22:18:18',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2860,'2026-06-22 22:18:18','2026-06-22 22:18:18',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2861,'2026-06-22 22:18:21','2026-06-22 22:18:21',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2862,'2026-06-22 22:18:21','2026-06-22 22:18:21',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2863,'2026-06-22 22:18:21','2026-06-22 22:18:21',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2864,'2026-06-22 22:18:25','2026-06-22 22:18:25',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2865,'2026-06-22 22:18:25','2026-06-22 22:18:25',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2866,'2026-06-22 22:18:25','2026-06-22 22:18:25',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2867,'2026-06-22 22:18:26','2026-06-22 22:18:26',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2868,'2026-06-22 22:18:26','2026-06-22 22:18:26',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2869,'2026-06-22 22:18:26','2026-06-22 22:18:26',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2870,'2026-06-22 22:18:29','2026-06-22 22:18:29',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2871,'2026-06-22 22:18:29','2026-06-22 22:18:29',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2872,'2026-06-22 22:18:29','2026-06-22 22:18:29',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2873,'2026-06-22 22:18:30','2026-06-22 22:18:30',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2874,'2026-06-22 22:18:30','2026-06-22 22:18:30',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2875,'2026-06-22 22:18:30','2026-06-22 22:18:30',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2876,'2026-06-22 22:18:34','2026-06-22 22:18:34',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2877,'2026-06-22 22:18:34','2026-06-22 22:18:34',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2878,'2026-06-22 22:18:34','2026-06-22 22:18:34',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2879,'2026-06-22 22:18:34','2026-06-22 22:18:34',NULL,1,'/admin/lodging/hostel/list','127.0.0.1','{}'),(2880,'2026-06-22 22:18:34','2026-06-22 22:18:34',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2881,'2026-06-22 22:18:35','2026-06-22 22:18:35',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2882,'2026-06-22 22:18:35','2026-06-22 22:18:35',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2883,'2026-06-22 22:18:35','2026-06-22 22:18:35',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2884,'2026-06-22 22:18:38','2026-06-22 22:18:38',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2885,'2026-06-22 22:18:38','2026-06-22 22:18:38',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2886,'2026-06-22 22:18:38','2026-06-22 22:18:38',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2887,'2026-06-22 22:18:44','2026-06-22 22:18:44',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(2888,'2026-06-22 22:18:48','2026-06-22 22:18:48',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(2889,'2026-06-22 22:18:53','2026-06-22 22:18:53',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(2890,'2026-06-22 22:19:05','2026-06-22 22:19:05',NULL,NULL,'/admin/base/open/captcha','::1','{\"width\": \"150\", \"height\": \"45\"}'),(2891,'2026-06-22 22:19:06','2026-06-22 22:19:06',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2892,'2026-06-22 22:19:06','2026-06-22 22:19:06',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2893,'2026-06-22 22:19:06','2026-06-22 22:19:06',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2894,'2026-06-22 22:19:10','2026-06-22 22:19:10',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2895,'2026-06-22 22:19:10','2026-06-22 22:19:10',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2896,'2026-06-22 22:19:10','2026-06-22 22:19:10',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2897,'2026-06-22 22:19:10','2026-06-22 22:19:10',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2898,'2026-06-22 22:19:13','2026-06-22 22:19:13',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2899,'2026-06-22 22:19:13','2026-06-22 22:19:13',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2900,'2026-06-22 22:19:13','2026-06-22 22:19:13',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2901,'2026-06-22 22:19:14','2026-06-22 22:19:14',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}'),(2902,'2026-06-22 22:19:14','2026-06-22 22:19:14',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2903,'2026-06-22 22:19:17','2026-06-22 22:19:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2904,'2026-06-22 22:19:17','2026-06-22 22:19:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2905,'2026-06-22 22:19:17','2026-06-22 22:19:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2906,'2026-06-22 22:19:20','2026-06-22 22:19:20',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2907,'2026-06-22 22:19:20','2026-06-22 22:19:20',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2908,'2026-06-22 22:19:20','2026-06-22 22:19:20',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2909,'2026-06-22 22:19:51','2026-06-22 22:19:51',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2910,'2026-06-22 22:19:51','2026-06-22 22:19:51',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2911,'2026-06-22 22:19:51','2026-06-22 22:19:51',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2912,'2026-06-22 22:19:55','2026-06-22 22:19:55',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2913,'2026-06-22 22:19:55','2026-06-22 22:19:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2914,'2026-06-22 22:19:55','2026-06-22 22:19:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2915,'2026-06-22 22:19:55','2026-06-22 22:19:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2916,'2026-06-22 22:19:58','2026-06-22 22:19:58',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2917,'2026-06-22 22:19:58','2026-06-22 22:19:58',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2918,'2026-06-22 22:19:58','2026-06-22 22:19:58',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2919,'2026-06-22 22:20:00','2026-06-22 22:20:00',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2920,'2026-06-22 22:20:00','2026-06-22 22:20:00',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2921,'2026-06-22 22:20:00','2026-06-22 22:20:00',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2922,'2026-06-22 22:20:03','2026-06-22 22:20:03',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2923,'2026-06-22 22:20:03','2026-06-22 22:20:03',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2924,'2026-06-22 22:20:03','2026-06-22 22:20:03',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2925,'2026-06-22 22:20:04','2026-06-22 22:20:04',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2926,'2026-06-22 22:20:04','2026-06-22 22:20:04',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2927,'2026-06-22 22:20:04','2026-06-22 22:20:04',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2928,'2026-06-22 22:20:08','2026-06-22 22:20:08',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2929,'2026-06-22 22:20:08','2026-06-22 22:20:08',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2930,'2026-06-22 22:20:08','2026-06-22 22:20:08',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2931,'2026-06-22 22:20:09','2026-06-22 22:20:09',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2932,'2026-06-22 22:20:09','2026-06-22 22:20:09',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2933,'2026-06-22 22:20:09','2026-06-22 22:20:09',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2934,'2026-06-22 22:20:13','2026-06-22 22:20:13',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2935,'2026-06-22 22:20:13','2026-06-22 22:20:13',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2936,'2026-06-22 22:20:13','2026-06-22 22:20:13',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2937,'2026-06-22 22:20:14','2026-06-22 22:20:14',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2938,'2026-06-22 22:20:14','2026-06-22 22:20:14',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2939,'2026-06-22 22:20:14','2026-06-22 22:20:14',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2940,'2026-06-22 22:20:17','2026-06-22 22:20:17',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2941,'2026-06-22 22:20:17','2026-06-22 22:20:17',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2942,'2026-06-22 22:20:18','2026-06-22 22:20:18',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2943,'2026-06-22 22:20:19','2026-06-22 22:20:19',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2944,'2026-06-22 22:20:19','2026-06-22 22:20:19',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2945,'2026-06-22 22:20:19','2026-06-22 22:20:19',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2946,'2026-06-22 22:20:23','2026-06-22 22:20:23',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2947,'2026-06-22 22:20:23','2026-06-22 22:20:23',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2948,'2026-06-22 22:20:23','2026-06-22 22:20:23',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2949,'2026-06-22 22:20:24','2026-06-22 22:20:24',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2950,'2026-06-22 22:20:24','2026-06-22 22:20:24',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2951,'2026-06-22 22:20:24','2026-06-22 22:20:24',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2952,'2026-06-22 22:20:28','2026-06-22 22:20:28',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2953,'2026-06-22 22:20:28','2026-06-22 22:20:28',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2954,'2026-06-22 22:20:28','2026-06-22 22:20:28',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2955,'2026-06-22 22:20:28','2026-06-22 22:20:28',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2956,'2026-06-22 22:20:29','2026-06-22 22:20:29',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2957,'2026-06-22 22:20:29','2026-06-22 22:20:29',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2958,'2026-06-22 22:20:29','2026-06-22 22:20:29',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2959,'2026-06-22 22:20:45','2026-06-22 22:20:45',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2960,'2026-06-22 22:20:45','2026-06-22 22:20:45',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2961,'2026-06-22 22:20:45','2026-06-22 22:20:45',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2962,'2026-06-22 22:20:45','2026-06-22 22:20:45',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2963,'2026-06-22 22:20:46','2026-06-22 22:20:46',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2964,'2026-06-22 22:20:46','2026-06-22 22:20:46',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2965,'2026-06-22 22:20:46','2026-06-22 22:20:46',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2966,'2026-06-22 22:20:57','2026-06-22 22:20:57',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2967,'2026-06-22 22:20:57','2026-06-22 22:20:57',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2968,'2026-06-22 22:20:57','2026-06-22 22:20:57',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2969,'2026-06-22 22:20:57','2026-06-22 22:20:57',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2970,'2026-06-22 22:21:08','2026-06-22 22:21:08',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2971,'2026-06-22 22:21:08','2026-06-22 22:21:08',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2972,'2026-06-22 22:21:08','2026-06-22 22:21:08',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2973,'2026-06-22 22:21:08','2026-06-22 22:21:08',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(2974,'2026-06-22 22:21:08','2026-06-22 22:21:08',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(2975,'2026-06-22 22:21:09','2026-06-22 22:21:09',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2976,'2026-06-22 22:21:09','2026-06-22 22:21:09',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2977,'2026-06-22 22:21:09','2026-06-22 22:21:09',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2978,'2026-06-22 22:21:12','2026-06-22 22:21:12',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2979,'2026-06-22 22:21:12','2026-06-22 22:21:12',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2980,'2026-06-22 22:21:12','2026-06-22 22:21:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2981,'2026-06-22 22:21:12','2026-06-22 22:21:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2982,'2026-06-22 22:21:16','2026-06-22 22:21:16',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2983,'2026-06-22 22:21:16','2026-06-22 22:21:16',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2984,'2026-06-22 22:21:16','2026-06-22 22:21:16',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2985,'2026-06-22 22:21:17','2026-06-22 22:21:17',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2986,'2026-06-22 22:21:17','2026-06-22 22:21:17',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2987,'2026-06-22 22:21:17','2026-06-22 22:21:17',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2988,'2026-06-22 22:21:20','2026-06-22 22:21:20',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2989,'2026-06-22 22:21:20','2026-06-22 22:21:20',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2990,'2026-06-22 22:21:20','2026-06-22 22:21:20',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2991,'2026-06-22 22:21:22','2026-06-22 22:21:22',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2992,'2026-06-22 22:21:22','2026-06-22 22:21:22',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2993,'2026-06-22 22:21:22','2026-06-22 22:21:22',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(2994,'2026-06-22 22:21:25','2026-06-22 22:21:25',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(2995,'2026-06-22 22:21:25','2026-06-22 22:21:25',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(2996,'2026-06-22 22:21:25','2026-06-22 22:21:25',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(2997,'2026-06-22 22:21:25','2026-06-22 22:21:25',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(2998,'2026-06-22 22:21:27','2026-06-22 22:21:27',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(2999,'2026-06-22 22:21:27','2026-06-22 22:21:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3000,'2026-06-22 22:21:27','2026-06-22 22:21:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3001,'2026-06-22 22:21:30','2026-06-22 22:21:30',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3002,'2026-06-22 22:21:30','2026-06-22 22:21:30',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3003,'2026-06-22 22:21:30','2026-06-22 22:21:30',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3004,'2026-06-22 22:21:31','2026-06-22 22:21:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3005,'2026-06-22 22:21:31','2026-06-22 22:21:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3006,'2026-06-22 22:21:31','2026-06-22 22:21:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3007,'2026-06-22 22:21:35','2026-06-22 22:21:35',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3008,'2026-06-22 22:21:35','2026-06-22 22:21:35',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3009,'2026-06-22 22:21:35','2026-06-22 22:21:35',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3010,'2026-06-22 22:21:35','2026-06-22 22:21:35',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3011,'2026-06-22 22:21:36','2026-06-22 22:21:36',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3012,'2026-06-22 22:21:36','2026-06-22 22:21:36',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3013,'2026-06-22 22:21:36','2026-06-22 22:21:36',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3014,'2026-06-22 22:21:40','2026-06-22 22:21:40',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3015,'2026-06-22 22:21:40','2026-06-22 22:21:40',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3016,'2026-06-22 22:21:40','2026-06-22 22:21:40',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3017,'2026-06-22 22:21:40','2026-06-22 22:21:40',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3018,'2026-06-22 22:21:41','2026-06-22 22:21:41',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3019,'2026-06-22 22:21:41','2026-06-22 22:21:41',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3020,'2026-06-22 22:21:41','2026-06-22 22:21:41',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3021,'2026-06-22 22:21:44','2026-06-22 22:21:44',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3022,'2026-06-22 22:21:44','2026-06-22 22:21:44',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3023,'2026-06-22 22:21:44','2026-06-22 22:21:44',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3024,'2026-06-22 22:21:46','2026-06-22 22:21:46',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3025,'2026-06-22 22:21:46','2026-06-22 22:21:46',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3026,'2026-06-22 22:21:46','2026-06-22 22:21:46',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3027,'2026-06-22 22:21:49','2026-06-22 22:21:49',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3028,'2026-06-22 22:21:49','2026-06-22 22:21:49',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3029,'2026-06-22 22:21:49','2026-06-22 22:21:49',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3030,'2026-06-22 22:21:49','2026-06-22 22:21:49',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3031,'2026-06-22 22:22:19','2026-06-22 22:22:19',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3032,'2026-06-22 22:22:19','2026-06-22 22:22:19',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3033,'2026-06-22 22:22:19','2026-06-22 22:22:19',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3034,'2026-06-22 22:22:23','2026-06-22 22:22:23',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(3035,'2026-06-22 22:22:24','2026-06-22 22:22:24',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3036,'2026-06-22 22:22:24','2026-06-22 22:22:24',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3037,'2026-06-22 22:22:24','2026-06-22 22:22:24',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3038,'2026-06-22 22:22:30','2026-06-22 22:22:30',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3039,'2026-06-22 22:22:30','2026-06-22 22:22:30',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3040,'2026-06-22 22:22:30','2026-06-22 22:22:30',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3041,'2026-06-22 22:22:31','2026-06-22 22:22:31',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3042,'2026-06-22 22:22:31','2026-06-22 22:22:31',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3043,'2026-06-22 22:22:31','2026-06-22 22:22:31',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3044,'2026-06-22 22:22:35','2026-06-22 22:22:35',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3045,'2026-06-22 22:22:35','2026-06-22 22:22:35',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3046,'2026-06-22 22:22:35','2026-06-22 22:22:35',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3047,'2026-06-22 22:22:36','2026-06-22 22:22:36',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3048,'2026-06-22 22:22:36','2026-06-22 22:22:36',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3049,'2026-06-22 22:22:36','2026-06-22 22:22:36',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3050,'2026-06-22 22:22:40','2026-06-22 22:22:40',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3051,'2026-06-22 22:22:40','2026-06-22 22:22:40',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3052,'2026-06-22 22:22:40','2026-06-22 22:22:40',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3053,'2026-06-22 22:22:43','2026-06-22 22:22:43',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3054,'2026-06-22 22:22:43','2026-06-22 22:22:43',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3055,'2026-06-22 22:22:43','2026-06-22 22:22:43',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3056,'2026-06-22 22:22:45','2026-06-22 22:22:45',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3057,'2026-06-22 22:22:45','2026-06-22 22:22:45',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3058,'2026-06-22 22:22:45','2026-06-22 22:22:45',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3059,'2026-06-22 22:22:48','2026-06-22 22:22:48',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3060,'2026-06-22 22:22:48','2026-06-22 22:22:48',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3061,'2026-06-22 22:22:48','2026-06-22 22:22:48',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3062,'2026-06-22 22:22:50','2026-06-22 22:22:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3063,'2026-06-22 22:22:50','2026-06-22 22:22:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3064,'2026-06-22 22:22:50','2026-06-22 22:22:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3065,'2026-06-22 22:22:53','2026-06-22 22:22:53',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3066,'2026-06-22 22:22:53','2026-06-22 22:22:53',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3067,'2026-06-22 22:22:53','2026-06-22 22:22:53',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3068,'2026-06-22 22:22:55','2026-06-22 22:22:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3069,'2026-06-22 22:22:55','2026-06-22 22:22:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3070,'2026-06-22 22:22:55','2026-06-22 22:22:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3071,'2026-06-22 22:22:58','2026-06-22 22:22:58',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3072,'2026-06-22 22:22:58','2026-06-22 22:22:58',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3073,'2026-06-22 22:22:58','2026-06-22 22:22:58',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3074,'2026-06-22 22:22:58','2026-06-22 22:22:58',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3075,'2026-06-22 22:23:00','2026-06-22 22:23:00',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3076,'2026-06-22 22:23:00','2026-06-22 22:23:00',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3077,'2026-06-22 22:23:00','2026-06-22 22:23:00',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3078,'2026-06-22 22:23:03','2026-06-22 22:23:03',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3079,'2026-06-22 22:23:03','2026-06-22 22:23:03',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3080,'2026-06-22 22:23:03','2026-06-22 22:23:03',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3081,'2026-06-22 22:23:03','2026-06-22 22:23:03',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3082,'2026-06-22 22:23:26','2026-06-22 22:23:26',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3083,'2026-06-22 22:23:26','2026-06-22 22:23:26',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3084,'2026-06-22 22:23:26','2026-06-22 22:23:26',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3085,'2026-06-22 22:23:30','2026-06-22 22:23:30',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(3086,'2026-06-22 22:23:30','2026-06-22 22:23:30',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3087,'2026-06-22 22:23:30','2026-06-22 22:23:30',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3088,'2026-06-22 22:23:30','2026-06-22 22:23:30',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3089,'2026-06-22 22:23:33','2026-06-22 22:23:33',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3090,'2026-06-22 22:23:33','2026-06-22 22:23:33',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3091,'2026-06-22 22:23:33','2026-06-22 22:23:33',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3092,'2026-06-22 22:24:11','2026-06-22 22:24:11',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3093,'2026-06-22 22:24:11','2026-06-22 22:24:11',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3094,'2026-06-22 22:24:11','2026-06-22 22:24:11',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3095,'2026-06-22 22:24:15','2026-06-22 22:24:15',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(3096,'2026-06-22 22:24:15','2026-06-22 22:24:15',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3097,'2026-06-22 22:24:15','2026-06-22 22:24:15',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3098,'2026-06-22 22:24:15','2026-06-22 22:24:15',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3099,'2026-06-22 22:24:18','2026-06-22 22:24:18',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3100,'2026-06-22 22:24:18','2026-06-22 22:24:18',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3101,'2026-06-22 22:24:18','2026-06-22 22:24:18',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3102,'2026-06-22 22:24:20','2026-06-22 22:24:20',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3103,'2026-06-22 22:24:20','2026-06-22 22:24:20',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3104,'2026-06-22 22:24:20','2026-06-22 22:24:20',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3105,'2026-06-22 22:24:23','2026-06-22 22:24:23',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3106,'2026-06-22 22:24:23','2026-06-22 22:24:23',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3107,'2026-06-22 22:24:23','2026-06-22 22:24:23',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3108,'2026-06-22 22:24:23','2026-06-22 22:24:23',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3109,'2026-06-22 22:24:23','2026-06-22 22:24:23',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3110,'2026-06-22 22:24:25','2026-06-22 22:24:25',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3111,'2026-06-22 22:24:25','2026-06-22 22:24:25',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3112,'2026-06-22 22:24:25','2026-06-22 22:24:25',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3113,'2026-06-22 22:24:28','2026-06-22 22:24:28',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3114,'2026-06-22 22:24:28','2026-06-22 22:24:28',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3115,'2026-06-22 22:24:28','2026-06-22 22:24:28',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3116,'2026-06-22 22:24:29','2026-06-22 22:24:29',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3117,'2026-06-22 22:24:29','2026-06-22 22:24:29',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}'),(3118,'2026-06-22 22:24:29','2026-06-22 22:24:29',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3119,'2026-06-22 22:24:29','2026-06-22 22:24:29',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}'),(3120,'2026-06-22 22:24:30','2026-06-22 22:24:30',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3121,'2026-06-22 22:24:30','2026-06-22 22:24:30',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3122,'2026-06-22 22:24:30','2026-06-22 22:24:30',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3123,'2026-06-22 22:24:33','2026-06-22 22:24:33',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3124,'2026-06-22 22:24:33','2026-06-22 22:24:33',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3125,'2026-06-22 22:24:33','2026-06-22 22:24:33',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3126,'2026-06-22 22:24:34','2026-06-22 22:24:34',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3127,'2026-06-22 22:24:34','2026-06-22 22:24:34',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}'),(3128,'2026-06-22 22:24:35','2026-06-22 22:24:35',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3129,'2026-06-22 22:24:35','2026-06-22 22:24:35',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}'),(3130,'2026-06-22 22:24:35','2026-06-22 22:24:35',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3131,'2026-06-22 22:24:35','2026-06-22 22:24:35',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3132,'2026-06-22 22:24:35','2026-06-22 22:24:35',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3133,'2026-06-22 22:24:38','2026-06-22 22:24:38',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3134,'2026-06-22 22:24:38','2026-06-22 22:24:38',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3135,'2026-06-22 22:24:39','2026-06-22 22:24:39',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3136,'2026-06-22 22:24:40','2026-06-22 22:24:40',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3137,'2026-06-22 22:24:40','2026-06-22 22:24:40',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3138,'2026-06-22 22:24:40','2026-06-22 22:24:40',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3139,'2026-06-22 22:24:44','2026-06-22 22:24:44',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3140,'2026-06-22 22:24:44','2026-06-22 22:24:44',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3141,'2026-06-22 22:24:44','2026-06-22 22:24:44',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3142,'2026-06-22 22:24:44','2026-06-22 22:24:44',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3143,'2026-06-22 22:24:45','2026-06-22 22:24:45',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3144,'2026-06-22 22:24:45','2026-06-22 22:24:45',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3145,'2026-06-22 22:24:45','2026-06-22 22:24:45',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3146,'2026-06-22 22:24:49','2026-06-22 22:24:49',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3147,'2026-06-22 22:24:49','2026-06-22 22:24:49',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3148,'2026-06-22 22:24:49','2026-06-22 22:24:49',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3149,'2026-06-22 22:24:50','2026-06-22 22:24:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3150,'2026-06-22 22:24:50','2026-06-22 22:24:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3151,'2026-06-22 22:24:50','2026-06-22 22:24:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3152,'2026-06-22 22:24:54','2026-06-22 22:24:54',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3153,'2026-06-22 22:24:54','2026-06-22 22:24:54',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3154,'2026-06-22 22:24:54','2026-06-22 22:24:54',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3155,'2026-06-22 22:24:54','2026-06-22 22:24:54',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3156,'2026-06-22 22:24:55','2026-06-22 22:24:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3157,'2026-06-22 22:24:55','2026-06-22 22:24:55',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3158,'2026-06-22 22:24:55','2026-06-22 22:24:55',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3159,'2026-06-22 22:24:59','2026-06-22 22:24:59',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3160,'2026-06-22 22:24:59','2026-06-22 22:24:59',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3161,'2026-06-22 22:24:59','2026-06-22 22:24:59',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3162,'2026-06-22 22:24:59','2026-06-22 22:24:59',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3163,'2026-06-22 22:25:00','2026-06-22 22:25:00',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3164,'2026-06-22 22:25:00','2026-06-22 22:25:00',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3165,'2026-06-22 22:25:00','2026-06-22 22:25:00',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3166,'2026-06-22 22:25:04','2026-06-22 22:25:04',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3167,'2026-06-22 22:25:04','2026-06-22 22:25:04',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3168,'2026-06-22 22:25:04','2026-06-22 22:25:04',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3169,'2026-06-22 22:25:05','2026-06-22 22:25:05',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3170,'2026-06-22 22:25:05','2026-06-22 22:25:05',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3171,'2026-06-22 22:25:05','2026-06-22 22:25:05',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3172,'2026-06-22 22:25:09','2026-06-22 22:25:09',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3173,'2026-06-22 22:25:09','2026-06-22 22:25:09',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3174,'2026-06-22 22:25:09','2026-06-22 22:25:09',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3175,'2026-06-22 22:25:09','2026-06-22 22:25:09',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3176,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3177,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3178,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3179,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3180,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3181,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3182,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3183,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3184,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3185,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3186,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3187,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3188,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3189,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3190,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3191,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3192,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3193,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3194,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3195,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3196,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3197,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3198,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3199,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3200,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3201,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3202,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3203,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3204,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3205,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3206,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3207,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3208,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3209,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3210,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3211,'2026-06-22 22:25:50','2026-06-22 22:25:50',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3212,'2026-06-22 22:26:07','2026-06-22 22:26:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3213,'2026-06-22 22:26:07','2026-06-22 22:26:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3214,'2026-06-22 22:26:11','2026-06-22 22:26:11',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3215,'2026-06-22 22:26:12','2026-06-22 22:26:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3216,'2026-06-22 22:26:12','2026-06-22 22:26:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3217,'2026-06-22 22:28:41','2026-06-22 22:28:41',NULL,NULL,'/admin/base/open/captcha','::1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(3218,'2026-06-22 22:29:42','2026-06-22 22:29:42',NULL,NULL,'/admin/base/open/captcha','::1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(3219,'2026-06-22 22:29:43','2026-06-22 22:29:43',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"cf4c5b90-6e46-11f1-bef0-8fb21d71874f\", \"verifyCode\": \"byyn\"}'),(3220,'2026-06-22 22:29:44','2026-06-22 22:29:44',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3221,'2026-06-22 22:29:44','2026-06-22 22:29:44',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3222,'2026-06-22 22:29:44','2026-06-22 22:29:44',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3223,'2026-06-22 22:29:48','2026-06-22 22:29:48',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3224,'2026-06-22 22:29:48','2026-06-22 22:29:48',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3225,'2026-06-22 22:29:48','2026-06-22 22:29:48',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3226,'2026-06-22 22:30:10','2026-06-22 22:30:10',NULL,NULL,'/admin/base/open/captcha','::1','{}'),(3227,'2026-06-22 22:30:10','2026-06-22 22:30:10',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"dfd9e040-6e46-11f1-bef0-8fb21d71874f\", \"verifyCode\": \"jba7\"}'),(3228,'2026-06-22 22:30:11','2026-06-22 22:30:11',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3229,'2026-06-22 22:30:11','2026-06-22 22:30:11',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3230,'2026-06-22 22:30:11','2026-06-22 22:30:11',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3231,'2026-06-22 22:30:15','2026-06-22 22:30:15',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3232,'2026-06-22 22:30:15','2026-06-22 22:30:15',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3233,'2026-06-22 22:30:15','2026-06-22 22:30:15',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3234,'2026-06-22 22:30:57','2026-06-22 22:30:57',NULL,NULL,'/admin/base/open/captcha','::1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(3235,'2026-06-22 22:30:57','2026-06-22 22:30:57',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"fb759830-6e46-11f1-bef0-8fb21d71874f\", \"verifyCode\": \"7ilb\"}'),(3236,'2026-06-22 22:30:57','2026-06-22 22:30:57',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3237,'2026-06-22 22:30:57','2026-06-22 22:30:57',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3238,'2026-06-22 22:30:58','2026-06-22 22:30:58',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3239,'2026-06-22 22:31:01','2026-06-22 22:31:01',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3240,'2026-06-22 22:31:01','2026-06-22 22:31:01',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3241,'2026-06-22 22:31:01','2026-06-22 22:31:01',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3242,'2026-06-22 22:32:03','2026-06-22 22:32:03',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}'),(3243,'2026-06-22 22:32:03','2026-06-22 22:32:03',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3244,'2026-06-22 22:32:04','2026-06-22 22:32:04',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3245,'2026-06-22 22:32:04','2026-06-22 22:32:04',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}'),(3246,'2026-06-22 22:32:06','2026-06-22 22:32:06',NULL,NULL,'/admin/base/open/captcha','::1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(3247,'2026-06-22 22:32:06','2026-06-22 22:32:06',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"24c88350-6e47-11f1-bef0-8fb21d71874f\", \"verifyCode\": \"duc5\"}'),(3248,'2026-06-22 22:32:07','2026-06-22 22:32:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3249,'2026-06-22 22:32:07','2026-06-22 22:32:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3250,'2026-06-22 22:32:07','2026-06-22 22:32:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3251,'2026-06-22 22:32:10','2026-06-22 22:32:10',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3252,'2026-06-22 22:32:10','2026-06-22 22:32:10',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3253,'2026-06-22 22:32:11','2026-06-22 22:32:11',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3254,'2026-06-22 22:32:14','2026-06-22 22:32:14',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3255,'2026-06-22 22:32:15','2026-06-22 22:32:15',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3256,'2026-06-22 22:32:15','2026-06-22 22:32:15',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3257,'2026-06-22 22:32:17','2026-06-22 22:32:17',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3258,'2026-06-22 22:32:17','2026-06-22 22:32:17',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3259,'2026-06-22 22:32:17','2026-06-22 22:32:17',NULL,1,'/admin/community/comment/list','127.0.0.1','{}'),(3260,'2026-06-22 22:32:17','2026-06-22 22:32:17',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3261,'2026-06-22 22:32:21','2026-06-22 22:32:21',NULL,1,'/admin/base/coding/getModuleTree','127.0.0.1','{}'),(3262,'2026-06-22 22:32:22','2026-06-22 22:32:22',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3263,'2026-06-22 22:32:25','2026-06-22 22:32:25',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3264,'2026-06-22 22:32:25','2026-06-22 22:32:25',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3265,'2026-06-22 22:32:26','2026-06-22 22:32:26',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3266,'2026-06-22 22:32:27','2026-06-22 22:32:27',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3267,'2026-06-22 22:32:30','2026-06-22 22:32:30',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3268,'2026-06-22 22:32:30','2026-06-22 22:32:30',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3269,'2026-06-22 22:32:31','2026-06-22 22:32:31',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3270,'2026-06-22 22:32:32','2026-06-22 22:32:32',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3271,'2026-06-22 22:32:34','2026-06-22 22:32:34',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3272,'2026-06-22 22:32:35','2026-06-22 22:32:35',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3273,'2026-06-22 22:32:39','2026-06-22 22:32:39',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3274,'2026-06-22 22:32:42','2026-06-22 22:32:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3275,'2026-06-22 22:32:42','2026-06-22 22:32:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3276,'2026-06-22 22:32:42','2026-06-22 22:32:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3277,'2026-06-22 22:32:45','2026-06-22 22:32:45',NULL,1,'/admin/clothing/category/list','127.0.0.1','{}'),(3278,'2026-06-22 22:32:45','2026-06-22 22:32:45',NULL,1,'/admin/merchant/list','127.0.0.1','{}'),(3279,'2026-06-22 22:32:46','2026-06-22 22:32:46',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3280,'2026-06-22 22:32:46','2026-06-22 22:32:46',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3281,'2026-06-22 22:32:46','2026-06-22 22:32:46',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3282,'2026-06-22 22:32:46','2026-06-22 22:32:46',NULL,1,'/admin/merchant/list','127.0.0.1','{}'),(3283,'2026-06-22 22:32:49','2026-06-22 22:32:49',NULL,1,'/admin/merchant/list','127.0.0.1','{}'),(3284,'2026-06-22 22:32:51','2026-06-22 22:32:51',NULL,1,'/admin/merchant/list','127.0.0.1','{}'),(3285,'2026-06-22 22:33:06','2026-06-22 22:33:06',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3286,'2026-06-22 22:33:07','2026-06-22 22:33:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3287,'2026-06-22 22:33:07','2026-06-22 22:33:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3288,'2026-06-22 22:33:11','2026-06-22 22:33:11',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3289,'2026-06-22 22:33:12','2026-06-22 22:33:12',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3290,'2026-06-22 22:33:12','2026-06-22 22:33:12',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3291,'2026-06-22 22:34:05','2026-06-22 22:34:05',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3292,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3293,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3294,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3295,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3296,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3297,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3298,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3299,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3300,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3301,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3302,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3303,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3304,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3305,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3306,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3307,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3308,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3309,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3310,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3311,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3312,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3313,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3314,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3315,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3316,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3317,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3318,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3319,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3320,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3321,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3322,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3323,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3324,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3325,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3326,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3327,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3328,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3329,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3330,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3331,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3332,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3333,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3334,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3335,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3336,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3337,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3338,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3339,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3340,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3341,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3342,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3343,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3344,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3345,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3346,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3347,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3348,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3349,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3350,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3351,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3352,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3353,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3354,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3355,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3356,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3357,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3358,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3359,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3360,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3361,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3362,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3363,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3364,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3365,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3366,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3367,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3368,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3369,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3370,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3371,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3372,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3373,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3374,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3375,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3376,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3377,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3378,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3379,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3380,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3381,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3382,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3383,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3384,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3385,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3386,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3387,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3388,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3389,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3390,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3391,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3392,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3393,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3394,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3395,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3396,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3397,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3398,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3399,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3400,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3401,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3402,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3403,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3404,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3405,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3406,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3407,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3408,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3409,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3410,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3411,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3412,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3413,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3414,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3415,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3416,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3417,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3418,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3419,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3420,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3421,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3422,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3423,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3424,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3425,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3426,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3427,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3428,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3429,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3430,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3431,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3432,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3433,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3434,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3435,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3436,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3437,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3438,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3439,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3440,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3441,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3442,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3443,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3444,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3445,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3446,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3447,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3448,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3449,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3450,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3451,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3452,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3453,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3454,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3455,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3456,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3457,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3458,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3459,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3460,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3461,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3462,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3463,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3464,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3465,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3466,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3467,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3468,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3469,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3470,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3471,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3472,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3473,'2026-06-22 22:36:07','2026-06-22 22:36:07',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3474,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3475,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3476,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3477,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3478,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3479,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3480,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3481,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3482,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3483,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3484,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3485,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3486,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3487,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3488,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3489,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3490,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3491,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3492,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3493,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3494,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3495,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3496,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3497,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3498,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3499,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3500,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3501,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3502,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3503,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3504,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3505,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3506,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3507,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3508,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3509,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3510,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3511,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3512,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3513,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3514,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3515,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3516,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3517,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3518,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3519,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3520,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3521,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3522,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3523,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3524,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3525,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3526,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3527,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3528,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3529,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3530,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3531,'2026-06-22 22:36:08','2026-06-22 22:36:08',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3532,'2026-06-22 22:37:18','2026-06-22 22:37:18',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3533,'2026-06-22 22:37:18','2026-06-22 22:37:18',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3534,'2026-06-22 22:37:23','2026-06-22 22:37:23',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3535,'2026-06-22 22:37:23','2026-06-22 22:37:23',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3536,'2026-06-22 22:37:23','2026-06-22 22:37:23',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3537,'2026-06-22 22:38:23','2026-06-22 22:38:23',NULL,NULL,'/admin/base/open/captcha','::1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(3538,'2026-06-22 22:38:23','2026-06-22 22:38:23',NULL,NULL,'/admin/base/open/login','::1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"0559d4f0-6e48-11f1-bef0-8fb21d71874f\", \"verifyCode\": \"fgej\"}'),(3539,'2026-06-22 22:38:42','2026-06-22 22:38:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3540,'2026-06-22 22:38:42','2026-06-22 22:38:42',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3541,'2026-06-22 22:38:42','2026-06-22 22:38:42',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3542,'2026-06-22 22:38:42','2026-06-22 22:38:42',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3543,'2026-06-22 22:38:45','2026-06-22 22:38:45',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3544,'2026-06-22 22:38:45','2026-06-22 22:38:45',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3545,'2026-06-22 22:38:49','2026-06-22 22:38:49',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3546,'2026-06-22 22:38:49','2026-06-22 22:38:49',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3547,'2026-06-22 22:38:49','2026-06-22 22:38:49',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3548,'2026-06-22 22:38:49','2026-06-22 22:38:49',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3549,'2026-06-22 22:38:49','2026-06-22 22:38:49',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3550,'2026-06-22 22:38:49','2026-06-22 22:38:49',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3551,'2026-06-22 22:38:50','2026-06-22 22:38:50',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3552,'2026-06-22 22:38:52','2026-06-22 22:38:52',NULL,1,'/admin/clothing/goods/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3553,'2026-06-22 22:38:54','2026-06-22 22:38:54',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3554,'2026-06-22 22:38:56','2026-06-22 22:38:56',NULL,1,'/admin/clothing/goodsSku/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3555,'2026-06-22 22:38:58','2026-06-22 22:38:58',NULL,1,'/admin/clothing/review/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3556,'2026-06-22 22:38:58','2026-06-22 22:38:58',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3557,'2026-06-22 22:38:58','2026-06-22 22:38:58',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}'),(3558,'2026-06-22 22:39:01','2026-06-22 22:39:01',NULL,1,'/admin/clothing/collect/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3559,'2026-06-22 22:39:01','2026-06-22 22:39:01',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}'),(3560,'2026-06-22 22:39:01','2026-06-22 22:39:01',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3561,'2026-06-22 22:39:03','2026-06-22 22:39:03',NULL,1,'/admin/food/restaurant/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3562,'2026-06-22 22:39:05','2026-06-22 22:39:05',NULL,1,'/admin/food/dish/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3563,'2026-06-22 22:39:08','2026-06-22 22:39:08',NULL,1,'/admin/food/timeSlot/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3564,'2026-06-22 22:39:10','2026-06-22 22:39:10',NULL,1,'/admin/food/agricultureCategory/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3565,'2026-06-22 22:39:12','2026-06-22 22:39:12',NULL,1,'/admin/food/agricultureGoods/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3566,'2026-06-22 22:39:15','2026-06-22 22:39:15',NULL,1,'/admin/food/review/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3567,'2026-06-22 22:39:15','2026-06-22 22:39:15',NULL,1,'/admin/food/restaurant/list','127.0.0.1','{}'),(3568,'2026-06-22 22:39:15','2026-06-22 22:39:15',NULL,1,'/admin/food/dish/list','127.0.0.1','{}'),(3569,'2026-06-22 22:39:15','2026-06-22 22:39:15',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3570,'2026-06-22 22:39:17','2026-06-22 22:39:17',NULL,1,'/admin/food/collect/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3571,'2026-06-22 22:39:17','2026-06-22 22:39:17',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3572,'2026-06-22 22:39:19','2026-06-22 22:39:19',NULL,1,'/admin/lodging/hostel/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3573,'2026-06-22 22:39:22','2026-06-22 22:39:22',NULL,1,'/admin/lodging/roomType/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3574,'2026-06-22 22:39:24','2026-06-22 22:39:24',NULL,1,'/admin/lodging/calendar/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3575,'2026-06-22 22:39:26','2026-06-22 22:39:26',NULL,1,'/admin/lodging/hostelPolicy/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3576,'2026-06-22 22:39:29','2026-06-22 22:39:29',NULL,1,'/admin/lodging/review/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3577,'2026-06-22 22:39:29','2026-06-22 22:39:29',NULL,1,'/admin/lodging/hostel/list','127.0.0.1','{}'),(3578,'2026-06-22 22:39:29','2026-06-22 22:39:29',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3579,'2026-06-22 22:39:31','2026-06-22 22:39:31',NULL,1,'/admin/lodging/collect/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3580,'2026-06-22 22:39:33','2026-06-22 22:39:33',NULL,1,'/admin/travel/scenic/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3581,'2026-06-22 22:39:36','2026-06-22 22:39:36',NULL,1,'/admin/travel/ticketType/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3582,'2026-06-22 22:39:38','2026-06-22 22:39:38',NULL,1,'/admin/travel/route/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3583,'2026-06-22 22:39:40','2026-06-22 22:39:40',NULL,1,'/admin/travel/routeDay/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3584,'2026-06-22 22:39:43','2026-06-22 22:39:43',NULL,1,'/admin/travel/eTicket/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3585,'2026-06-22 22:39:45','2026-06-22 22:39:45',NULL,1,'/admin/travel/guide/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3586,'2026-06-22 22:39:47','2026-06-22 22:39:47',NULL,1,'/admin/travel/review/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3587,'2026-06-22 22:39:47','2026-06-22 22:39:47',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3588,'2026-06-22 22:39:50','2026-06-22 22:39:50',NULL,1,'/admin/travel/collect/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3589,'2026-06-22 22:39:50','2026-06-22 22:39:50',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3590,'2026-06-22 22:39:52','2026-06-22 22:39:52',NULL,1,'/admin/community/article/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3591,'2026-06-22 22:39:54','2026-06-22 22:39:54',NULL,1,'/admin/community/comment/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3592,'2026-06-22 22:39:54','2026-06-22 22:39:54',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3593,'2026-06-22 22:39:54','2026-06-22 22:39:54',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3594,'2026-06-22 22:39:57','2026-06-22 22:39:57',NULL,1,'/admin/community/topic/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3595,'2026-06-22 22:39:59','2026-06-22 22:39:59',NULL,1,'/admin/community/report/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3596,'2026-06-22 22:40:01','2026-06-22 22:40:01',NULL,1,'/admin/community/follow/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3597,'2026-06-22 22:40:04','2026-06-22 22:40:04',NULL,1,'/admin/community/like/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3598,'2026-06-22 22:40:04','2026-06-22 22:40:04',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3599,'2026-06-22 22:40:06','2026-06-22 22:40:06',NULL,1,'/admin/community/collect/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3600,'2026-06-22 22:40:08','2026-06-22 22:40:08',NULL,1,'/admin/community/image/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3601,'2026-06-22 22:40:08','2026-06-22 22:40:08',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3602,'2026-06-22 22:40:11','2026-06-22 22:40:11',NULL,1,'/admin/community/video/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3603,'2026-06-22 22:40:11','2026-06-22 22:40:11',NULL,1,'/admin/community/article/list','127.0.0.1','{}'),(3604,'2026-06-22 22:40:13','2026-06-22 22:40:13',NULL,1,'/admin/community/tag/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3605,'2026-06-22 22:40:15','2026-06-22 22:40:15',NULL,1,'/admin/platform/merchantApply/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3606,'2026-06-22 22:40:18','2026-06-22 22:40:18',NULL,1,'/admin/platform/banner/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3607,'2026-06-22 22:40:20','2026-06-22 22:40:20',NULL,1,'/admin/platform/notice/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3608,'2026-06-22 22:40:22','2026-06-22 22:40:22',NULL,1,'/admin/platform/recommend/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3609,'2026-06-22 22:40:25','2026-06-22 22:40:25',NULL,1,'/admin/platform/sensitiveWord/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3610,'2026-06-22 22:40:27','2026-06-22 22:40:27',NULL,1,'/admin/platform/stat/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3611,'2026-06-22 22:40:29','2026-06-22 22:40:29',NULL,1,'/admin/user/info/page','127.0.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(3612,'2026-06-22 22:51:26','2026-06-22 22:51:26',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3613,'2026-06-22 22:51:26','2026-06-22 22:51:26',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3614,'2026-06-22 22:51:26','2026-06-22 22:51:26',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3615,'2026-06-22 22:51:29','2026-06-22 22:51:29',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3616,'2026-06-22 22:51:29','2026-06-22 22:51:29',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3617,'2026-06-22 22:51:29','2026-06-22 22:51:29',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3618,'2026-06-22 22:51:31','2026-06-22 22:51:31',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3619,'2026-06-22 22:52:49','2026-06-22 22:52:49',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3620,'2026-06-22 22:52:49','2026-06-22 22:52:49',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3621,'2026-06-22 22:52:54','2026-06-22 22:52:54',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(3622,'2026-06-22 22:52:54','2026-06-22 22:52:54',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3623,'2026-06-22 22:52:54','2026-06-22 22:52:54',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(3624,'2026-06-22 22:53:00','2026-06-22 22:53:00',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(3625,'2026-06-22 22:53:00','2026-06-22 22:53:00',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(3626,'2026-06-22 22:53:00','2026-06-22 22:53:00',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(3627,'2026-06-22 22:53:00','2026-06-22 22:53:00',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3628,'2026-06-22 22:53:05','2026-06-22 22:53:05',NULL,1,'/admin/clothing/goods/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3629,'2026-06-22 22:53:06','2026-06-22 22:53:06',NULL,1,'/admin/clothing/category/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3630,'2026-06-22 22:53:07','2026-06-22 22:53:07',NULL,1,'/admin/clothing/goodsSku/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3631,'2026-06-22 22:53:08','2026-06-22 22:53:08',NULL,1,'/admin/clothing/review/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3632,'2026-06-22 22:53:08','2026-06-22 22:53:08',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}'),(3633,'2026-06-22 22:53:08','2026-06-22 22:53:08',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3634,'2026-06-22 22:53:09','2026-06-22 22:53:09',NULL,1,'/admin/clothing/collect/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(3635,'2026-06-22 22:53:09','2026-06-22 22:53:09',NULL,1,'/admin/user/info/list','127.0.0.1','{}'),(3636,'2026-06-22 22:53:09','2026-06-22 22:53:09',NULL,1,'/admin/clothing/goods/list','127.0.0.1','{}');
/*!40000 ALTER TABLE `base_sys_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_menu`
--

DROP TABLE IF EXISTS `base_sys_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `base_sys_menu` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `parentId` int DEFAULT NULL COMMENT '父菜单ID',
  `name` varchar(255) NOT NULL COMMENT '菜单名称',
  `router` varchar(255) DEFAULT NULL COMMENT '菜单地址',
  `perms` text COMMENT '权限标识',
  `type` int NOT NULL DEFAULT '0' COMMENT '类型 0-目录 1-菜单 2-按钮',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序',
  `viewPath` varchar(255) DEFAULT NULL COMMENT '视图地址',
  `keepAlive` tinyint NOT NULL DEFAULT '1' COMMENT '路由缓存',
  `isShow` tinyint NOT NULL DEFAULT '1' COMMENT '是否显示',
  PRIMARY KEY (`id`),
  KEY `IDX_05e3d6a56604771a6da47ebf8e` (`createTime`),
  KEY `IDX_d5203f18daaf7c3fe0ab34497f` (`updateTime`),
  KEY `IDX_2087f9610c1fc5a184bedaacef` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_menu`
--

LOCK TABLES `base_sys_menu` WRITE;
/*!40000 ALTER TABLE `base_sys_menu` DISABLE KEYS */;
INSERT INTO `base_sys_menu` VALUES (1,'2026-06-21 22:40:32','2026-06-22 17:09:40',NULL,NULL,'系统管理','/sys',NULL,0,'icon-set',99,NULL,1,1),(2,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,1,'权限管理',NULL,NULL,0,'icon-auth',1,NULL,0,1),(3,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,2,'菜单列表','/sys/menu',NULL,1,'icon-menu',2,'modules/base/views/menu/index.vue',1,1),(4,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,3,'新增',NULL,'base:sys:menu:add',2,NULL,1,NULL,0,1),(5,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,3,'删除',NULL,'base:sys:menu:delete',2,NULL,2,NULL,0,1),(6,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,3,'查询',NULL,'base:sys:menu:page,base:sys:menu:list,base:sys:menu:info',2,NULL,4,NULL,0,1),(7,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,3,'参数','/test/aa',NULL,1,'icon-goods',0,'modules/base/views/info.vue',1,1),(8,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,3,'编辑',NULL,'base:sys:menu:info,base:sys:menu:update',2,NULL,0,NULL,1,1),(9,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,2,'角色列表','/sys/role',NULL,1,'icon-dept',3,'cool/modules/base/views/role.vue',1,1),(10,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,9,'新增',NULL,'base:sys:role:add',2,NULL,1,NULL,0,1),(11,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,9,'删除',NULL,'base:sys:role:delete',2,NULL,2,NULL,0,1),(12,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,9,'修改',NULL,'base:sys:role:update',2,NULL,3,NULL,0,1),(13,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,9,'查询',NULL,'base:sys:role:page,base:sys:role:list,base:sys:role:info',2,NULL,4,NULL,0,1),(14,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,2,'用户列表','/sys/user',NULL,1,'icon-user',0,'modules/base/views/user/index.vue',1,1),(15,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,14,'部门列表',NULL,'base:sys:department:list',2,NULL,0,NULL,1,1),(16,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,14,'新增部门',NULL,'base:sys:department:add',2,NULL,0,NULL,1,1),(17,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,14,'更新部门',NULL,'base:sys:department:update',2,NULL,0,NULL,1,1),(18,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,14,'删除部门',NULL,'base:sys:department:delete',2,NULL,0,NULL,1,1),(19,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,14,'部门排序',NULL,'base:sys:department:order',2,NULL,0,NULL,1,1),(20,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,14,'用户转移',NULL,'base:sys:user:move',2,NULL,0,NULL,1,1),(21,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,14,'新增',NULL,'base:sys:user:add',2,NULL,0,NULL,1,1),(22,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,14,'删除',NULL,'base:sys:user:delete',2,NULL,0,NULL,1,1),(23,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,14,'修改',NULL,'base:sys:user:delete,base:sys:user:update',2,NULL,0,NULL,1,1),(24,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,14,'查询',NULL,'base:sys:user:page,base:sys:user:list,base:sys:user:info',2,NULL,0,NULL,1,1),(25,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,1,'参数配置',NULL,NULL,0,'icon-params',3,NULL,1,1),(26,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,25,'参数列表','/sys/param',NULL,1,'icon-menu',0,'cool/modules/base/views/param.vue',1,1),(27,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,26,'新增',NULL,'base:sys:param:add',2,NULL,0,NULL,1,1),(28,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,26,'修改',NULL,'base:sys:param:info,base:sys:param:update',2,NULL,0,NULL,1,1),(29,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,26,'删除',NULL,'base:sys:param:delete',2,NULL,0,NULL,1,1),(30,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,26,'查看',NULL,'base:sys:param:page,base:sys:param:list,base:sys:param:info',2,NULL,0,NULL,1,1),(31,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,1,'监控管理',NULL,NULL,0,'icon-monitor',9,NULL,1,1),(32,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,31,'请求日志','/sys/log',NULL,1,'icon-log',1,'cool/modules/base/views/log.vue',1,1),(33,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,32,'权限',NULL,'base:sys:log:page,base:sys:log:clear,base:sys:log:getKeep,base:sys:log:setKeep',2,NULL,1,NULL,0,1),(34,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,1,'任务管理',NULL,NULL,0,'icon-activity',9,NULL,1,1),(35,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,34,'任务列表','/task/list',NULL,1,'icon-menu',0,'modules/task/views/list.vue',1,1),(36,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,35,'权限',NULL,'task:info:page,task:info:list,task:info:info,task:info:add,task:info:delete,task:info:update,task:info:stop,task:info:start,task:info:once,task:info:log',2,NULL,0,NULL,1,1),(37,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,NULL,'框架教程','/tutorial',NULL,0,'icon-task',98,NULL,1,1),(38,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,37,'文档官网','/tutorial/doc',NULL,1,'icon-log',0,'https://admin.cool-js.com',1,1),(39,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,37,'crud 示例','/demo/crud',NULL,1,'icon-favor',1,'modules/demo/views/crud/index.vue',1,1),(40,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,NULL,'通用',NULL,NULL,0,'icon-radioboxfill',99,NULL,1,0),(41,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,40,'图片上传',NULL,'space:info:page,space:info:list,space:info:info,space:info:add,space:info:delete,space:info:update,space:type:page,space:type:list,space:type:info,space:type:add,space:type:delete,space:type:update',2,NULL,1,NULL,1,1),(42,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,NULL,'首页','/',NULL,1,NULL,0,'modules/demo/views/home/index.vue',1,0),(43,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,NULL,'数据管理',NULL,NULL,0,'icon-data',7,NULL,1,1),(44,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,43,'字典管理','/dict/list',NULL,1,'icon-dict',3,'modules/dict/views/list.vue',1,1),(45,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,44,'删除',NULL,'dict:info:delete',2,NULL,0,NULL,1,1),(46,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,44,'修改',NULL,'dict:info:update,dict:info:info',2,NULL,0,NULL,1,1),(47,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,44,'获得字典数据',NULL,'dict:info:data',2,NULL,0,NULL,1,1),(48,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,44,'单个信息',NULL,'dict:info:info',2,NULL,0,NULL,1,1),(49,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,44,'列表查询',NULL,'dict:info:list',2,NULL,0,NULL,1,1),(50,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,44,'分页查询',NULL,'dict:info:page',2,NULL,0,NULL,1,1),(51,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,44,'新增',NULL,'dict:info:add',2,NULL,0,NULL,1,1),(52,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,44,'组权限',NULL,'dict:type:list,dict:type:update,dict:type:delete,dict:type:add',2,NULL,0,NULL,1,1),(53,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,44,'字典类型',NULL,'dict:type:delete,dict:type:update,dict:type:info,dict:type:list,dict:type:page,dict:type:add',2,NULL,0,NULL,1,1),(54,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,43,'数据回收站','/recycle/data',NULL,1,'icon-delete',6,'modules/recycle/views/data.vue',1,1),(55,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,54,'恢复数据',NULL,'recycle:data:restore',2,NULL,0,NULL,1,1),(56,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,54,'单个信息',NULL,'recycle:data:info',2,NULL,0,NULL,1,1),(57,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,54,'分页查询',NULL,'recycle:data:page',2,NULL,0,NULL,1,1),(58,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,43,'文件管理','/upload/list',NULL,1,'icon-log',5,'modules/space/views/list.vue',1,1),(59,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,58,'权限',NULL,'space:type:delete,space:type:update,space:type:info,space:type:list,space:type:page,space:type:add,space:info:getConfig,space:info:delete,space:info:update,space:info:info,space:info:list,space:info:page,space:info:add',2,NULL,0,NULL,1,1),(60,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,NULL,'用户管理',NULL,NULL,0,'icon-user',11,NULL,1,1),(61,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,60,'用户列表','/user/list',NULL,1,'icon-menu',1,'modules/user/views/list.vue',1,1),(62,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,61,'删除',NULL,'user:info:delete',2,NULL,0,NULL,1,1),(63,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,61,'修改',NULL,'user:info:update,user:info:info',2,NULL,0,NULL,1,1),(64,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,61,'单个信息',NULL,'user:info:info',2,NULL,0,NULL,1,1),(65,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,61,'列表查询',NULL,'user:info:list',2,NULL,0,NULL,1,1),(66,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,61,'分页查询',NULL,'user:info:page',2,NULL,0,NULL,1,1),(67,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,61,'新增',NULL,'user:info:add',2,NULL,0,NULL,1,1),(68,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,NULL,'扩展管理',NULL,NULL,0,'icon-favor',8,NULL,1,1),(69,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,68,'插件列表','/helper/plugins',NULL,1,'icon-list',1,'modules/helper/views/plugins.vue',1,1),(70,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,69,'删除',NULL,'plugin:info:delete',2,NULL,0,NULL,1,1),(71,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,69,'分页查询',NULL,'plugin:info:page',2,NULL,0,NULL,1,1),(72,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,69,'单个信息',NULL,'plugin:info:info',2,NULL,0,NULL,1,1),(73,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,69,'安装插件',NULL,'plugin:info:install',2,NULL,0,NULL,1,1),(74,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,69,'修改',NULL,'plugin:info:update',2,NULL,0,NULL,1,1),(75,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,69,'列表查询',NULL,'plugin:info:list',2,NULL,0,NULL,1,1),(76,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,69,'新增',NULL,'plugin:info:add',2,NULL,0,NULL,1,1),(77,'2026-06-22 14:33:30','2026-06-22 16:46:37',NULL,NULL,'衣模块',NULL,NULL,0,'icon-map',1,NULL,1,1),(78,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,77,'商品管理','/clothing/goods',NULL,1,'',1,'modules/clothing/views/crud/goods/index.vue',1,1),(79,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,77,'分类管理','/clothing/category',NULL,1,'',2,'modules/clothing/views/crud/category/index.vue',1,1),(80,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,77,'SKU管理','/clothing/sku',NULL,1,'',3,'modules/clothing/views/crud/sku/index.vue',1,1),(81,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,77,'评价管理','/clothing/review',NULL,1,'',4,'modules/clothing/views/crud/review/index.vue',1,1),(82,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,77,'收藏管理','/clothing/collect',NULL,1,'',5,'modules/clothing/views/crud/collect/index.vue',1,1),(83,'2026-06-22 14:33:30','2026-06-22 16:46:56',NULL,NULL,'食模块',NULL,NULL,0,'icon-iot',2,NULL,1,1),(84,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,83,'餐厅管理','/food/restaurant',NULL,1,'',1,'modules/food/views/crud/restaurant/index.vue',1,1),(85,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,83,'菜品管理','/food/dish',NULL,1,'',2,'modules/food/views/crud/dish/index.vue',1,1),(86,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,83,'时段管理','/food/timeSlot',NULL,1,'',3,'modules/food/views/crud/timeSlot/index.vue',1,1),(87,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,83,'农产品分类','/food/agricultureCategory',NULL,1,'',4,'modules/food/views/crud/agricultureCategory/index.vue',1,1),(88,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,83,'农产品管理','/food/agricultureGoods',NULL,1,'',5,'modules/food/views/crud/agricultureGoods/index.vue',1,1),(89,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,83,'评价管理','/food/review',NULL,1,'',6,'modules/food/views/crud/review/index.vue',1,1),(90,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,83,'收藏管理','/food/collect',NULL,1,'',7,'modules/food/views/crud/collect/index.vue',1,1),(91,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,NULL,'住模块',NULL,NULL,0,'home',3,NULL,1,1),(92,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,91,'民宿管理','/lodging/hostel',NULL,1,'',1,'modules/lodging/views/crud/hostel/index.vue',1,1),(93,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,91,'房型管理','/lodging/roomType',NULL,1,'',2,'modules/lodging/views/crud/roomType/index.vue',1,1),(94,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,91,'房态日历','/lodging/calendar',NULL,1,'',3,'modules/lodging/views/crud/calendar/index.vue',1,1),(95,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,91,'入住须知','/lodging/hostelPolicy',NULL,1,'',4,'modules/lodging/views/crud/hostelPolicy/index.vue',1,1),(96,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,91,'评价管理','/lodging/review',NULL,1,'',5,'modules/lodging/views/crud/review/index.vue',1,1),(97,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,91,'收藏管理','/lodging/collect',NULL,1,'',6,'modules/lodging/views/crud/collect/index.vue',1,1),(98,'2026-06-22 14:33:30','2026-06-22 16:47:29',NULL,NULL,'行模块',NULL,NULL,0,'icon-info',4,NULL,1,1),(99,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,98,'景区管理','/travel/scenic',NULL,1,'',1,'modules/travel/views/crud/scenic/index.vue',1,1),(100,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,98,'票种管理','/travel/ticketType',NULL,1,'',2,'modules/travel/views/crud/ticketType/index.vue',1,1),(101,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,98,'路线管理','/travel/route',NULL,1,'',3,'modules/travel/views/crud/route/index.vue',1,1),(102,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,98,'路线日程','/travel/routeDay',NULL,1,'',4,'modules/travel/views/crud/routeDay/index.vue',1,1),(103,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,98,'电子票管理','/travel/eTicket',NULL,1,'',5,'modules/travel/views/crud/eTicket/index.vue',1,1),(104,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,98,'交通攻略','/travel/guide',NULL,1,'',6,'modules/travel/views/crud/guide/index.vue',1,1),(105,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,98,'评价管理','/travel/review',NULL,1,'',7,'modules/travel/views/crud/review/index.vue',1,1),(106,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,98,'收藏管理','/travel/collect',NULL,1,'',8,'modules/travel/views/crud/collect/index.vue',1,1),(107,'2026-06-22 14:33:30','2026-06-22 16:47:36',NULL,NULL,'社区模块',NULL,NULL,0,'icon-dept',5,NULL,1,1),(108,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,107,'游记管理','/community/article',NULL,1,'',1,'modules/community/views/crud/article/index.vue',1,1),(109,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,107,'评论管理','/community/comment',NULL,1,'',2,'modules/community/views/crud/comment/index.vue',1,1),(110,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,107,'话题管理','/community/topic',NULL,1,'',3,'modules/community/views/crud/topic/index.vue',1,1),(111,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,107,'举报管理','/community/report',NULL,1,'',4,'modules/community/views/crud/report/index.vue',1,1),(112,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,107,'关注管理','/community/follow',NULL,1,'',5,'modules/community/views/crud/follow/index.vue',1,1),(113,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,107,'点赞管理','/community/like',NULL,1,'',6,'modules/community/views/crud/like/index.vue',1,1),(114,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,107,'收藏管理','/community/collect',NULL,1,'',7,'modules/community/views/crud/collect/index.vue',1,1),(115,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,107,'图片管理','/community/image',NULL,1,'',8,'modules/community/views/crud/image/index.vue',1,1),(116,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,107,'视频管理','/community/video',NULL,1,'',9,'modules/community/views/crud/video/index.vue',1,1),(117,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,107,'标签管理','/community/tag',NULL,1,'',10,'modules/community/views/crud/tag/index.vue',1,1),(118,'2026-06-22 14:33:30','2026-06-22 16:47:52',NULL,NULL,'平台管理',NULL,NULL,0,'icon-news',6,NULL,1,1),(119,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,118,'商家入驻审核','/platform/merchantApply',NULL,1,'',1,'modules/platform/views/crud/merchantApply/index.vue',1,1),(120,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,118,'轮播图管理','/platform/banner',NULL,1,'',2,'modules/platform/views/crud/banner/index.vue',1,1),(121,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,118,'公告管理','/platform/notice',NULL,1,'',3,'modules/platform/views/crud/notice/index.vue',1,1),(122,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,118,'推荐位管理','/platform/recommend',NULL,1,'',4,'modules/platform/views/crud/recommend/index.vue',1,1),(123,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,118,'敏感词管理','/platform/sensitiveWord',NULL,1,'',5,'modules/platform/views/crud/sensitiveWord/index.vue',1,1),(124,'2026-06-22 14:33:30','2026-06-22 14:33:30',NULL,118,'数据统计','/platform/stat',NULL,1,'',6,'modules/platform/views/crud/stat/index.vue',1,1);
/*!40000 ALTER TABLE `base_sys_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_param`
--

DROP TABLE IF EXISTS `base_sys_param`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `base_sys_param` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `keyName` varchar(255) NOT NULL COMMENT '键',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `data` text NOT NULL COMMENT '数据',
  `dataType` int NOT NULL DEFAULT '0' COMMENT '数据类型 0-字符串 1-富文本 2-文件 ',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_cf19b5e52d8c71caa9c4534454` (`keyName`),
  KEY `IDX_7bcb57371b481d8e2d66ddeaea` (`createTime`),
  KEY `IDX_479122e3bf464112f7a7253dac` (`updateTime`),
  KEY `IDX_8a0ab598ca7d63475356ca1157` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_param`
--

LOCK TABLES `base_sys_param` WRITE;
/*!40000 ALTER TABLE `base_sys_param` DISABLE KEYS */;
INSERT INTO `base_sys_param` VALUES (1,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'rich','富文本参数','<h3><strong>这是一个富文本</strong></h3><p>xxx</p><p>xxxxxxxxxx</p><p><br></p>',1,NULL),(2,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'json','JSON参数','{\n  \"code\": 111233\n}',0,NULL),(3,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'file','文件','',2,NULL),(4,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'text','测试','这是一段字符串',0,NULL);
/*!40000 ALTER TABLE `base_sys_param` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_role`
--

DROP TABLE IF EXISTS `base_sys_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `base_sys_role` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` varchar(255) NOT NULL COMMENT '用户ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `label` varchar(50) DEFAULT NULL COMMENT '角色标签',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `relevance` tinyint NOT NULL DEFAULT '0' COMMENT '数据权限是否关联上下级',
  `menuIdList` json NOT NULL COMMENT '菜单权限',
  `departmentIdList` json NOT NULL COMMENT '部门权限',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_469d49a5998170e9550cf113da` (`name`),
  UNIQUE KEY `IDX_f3f24fbbccf00192b076e549a7` (`label`),
  KEY `IDX_6f01184441dec49207b41bfd92` (`createTime`),
  KEY `IDX_d64ca209f3fc52128d9b20e97b` (`updateTime`),
  KEY `IDX_953dc26a4e8bd5d9c989295796` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_role`
--

LOCK TABLES `base_sys_role` WRITE;
/*!40000 ALTER TABLE `base_sys_role` DISABLE KEYS */;
INSERT INTO `base_sys_role` VALUES (1,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'1','超管','admin','最高权限的角色',0,'\"null\"','\"null\"');
/*!40000 ALTER TABLE `base_sys_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_role_department`
--

DROP TABLE IF EXISTS `base_sys_role_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `base_sys_role_department` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `roleId` int NOT NULL COMMENT '角色ID',
  `departmentId` int NOT NULL COMMENT '部门ID',
  PRIMARY KEY (`id`),
  KEY `IDX_e881a66f7cce83ba431cf20194` (`createTime`),
  KEY `IDX_cbf48031efee5d0de262965e53` (`updateTime`),
  KEY `IDX_055658b2de49d547635e06f160` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_role_department`
--

LOCK TABLES `base_sys_role_department` WRITE;
/*!40000 ALTER TABLE `base_sys_role_department` DISABLE KEYS */;
/*!40000 ALTER TABLE `base_sys_role_department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_role_menu`
--

DROP TABLE IF EXISTS `base_sys_role_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `base_sys_role_menu` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `roleId` int NOT NULL COMMENT '角色ID',
  `menuId` int NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`id`),
  KEY `IDX_3641f81d4201c524a57ce2aa54` (`createTime`),
  KEY `IDX_f860298298b26e7a697be36e5b` (`updateTime`),
  KEY `IDX_fd2d8bbe13949cfa56b1ed0a5d` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_role_menu`
--

LOCK TABLES `base_sys_role_menu` WRITE;
/*!40000 ALTER TABLE `base_sys_role_menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `base_sys_role_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_user`
--

DROP TABLE IF EXISTS `base_sys_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `base_sys_user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `departmentId` int DEFAULT NULL COMMENT '部门ID',
  `userId` int DEFAULT NULL COMMENT '创建者ID',
  `name` varchar(255) DEFAULT NULL COMMENT '姓名',
  `username` varchar(100) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `passwordV` int NOT NULL DEFAULT '1' COMMENT '密码版本, 作用是改完密码，让原来的token失效',
  `nickName` varchar(255) DEFAULT NULL COMMENT '昵称',
  `headImg` varchar(255) DEFAULT NULL COMMENT '头像',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-禁用 1-启用',
  `socketId` varchar(255) DEFAULT NULL COMMENT 'socketId',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_469ad55973f5b98930f6ad627b` (`username`),
  KEY `IDX_ca8611d15a63d52aa4e292e46a` (`createTime`),
  KEY `IDX_a0f2f19cee18445998ece93ddd` (`updateTime`),
  KEY `IDX_94cb6e88070603ac6729d514fd` (`tenantId`),
  KEY `IDX_0cf944da378d70a94f5fefd803` (`departmentId`),
  KEY `IDX_40541b0502eb2422c73ae2aad1` (`userId`),
  KEY `IDX_9ec6d7ac6337eafb070e4881a8` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_user`
--

LOCK TABLES `base_sys_user` WRITE;
/*!40000 ALTER TABLE `base_sys_user` DISABLE KEYS */;
INSERT INTO `base_sys_user` VALUES (1,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,1,NULL,'超级管理员','admin','e10adc3949ba59abbe56e057f20f883e',7,'管理员',NULL,'18000000000','team@cool-js.com','拥有最高权限的用户',1,NULL);
/*!40000 ALTER TABLE `base_sys_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_user_role`
--

DROP TABLE IF EXISTS `base_sys_user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `base_sys_user_role` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `roleId` int NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`id`),
  KEY `IDX_fa9555e03e42fce748c9046b1c` (`createTime`),
  KEY `IDX_3e36c0d2b1a4c659c6b4fc64b3` (`updateTime`),
  KEY `IDX_2f1dc0b6aad5604a2ddf37fba6` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_user_role`
--

LOCK TABLES `base_sys_user_role` WRITE;
/*!40000 ALTER TABLE `base_sys_user_role` DISABLE KEYS */;
INSERT INTO `base_sys_user_role` VALUES (1,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,1,1);
/*!40000 ALTER TABLE `base_sys_user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart_item` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `goodsId` int NOT NULL COMMENT '商品ID',
  `goodsTitle` varchar(100) NOT NULL COMMENT '商品标题',
  `mainImage` varchar(500) DEFAULT NULL COMMENT '主图',
  `skuId` int DEFAULT NULL COMMENT 'SKU ID',
  `skuName` varchar(100) DEFAULT NULL COMMENT 'SKU名称',
  `price` decimal(10,2) NOT NULL COMMENT '单价',
  `quantity` int NOT NULL DEFAULT '1' COMMENT '数量',
  `checked` int NOT NULL DEFAULT '1' COMMENT '是否选中 0=否 1=是',
  `moduleType` tinyint NOT NULL COMMENT '来源模块 1=衣 2=食-农产品',
  PRIMARY KEY (`id`),
  KEY `IDX_b3454d63680259fc38237ad355` (`createTime`),
  KEY `IDX_76ce885be16c2b3e160a69c954` (`updateTime`),
  KEY `IDX_c411ce0a5cfbf4c466ff3fc4a5` (`tenantId`),
  KEY `IDX_158f0325ccf7f68a5b395fa2f6` (`userId`),
  KEY `IDX_9d30dae5942f104de743302496` (`goodsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clothing_category`
--

DROP TABLE IF EXISTS `clothing_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clothing_category` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `parentId` int NOT NULL DEFAULT '0' COMMENT '父分类ID，0=顶级',
  `name` varchar(50) NOT NULL COMMENT '分类名称',
  `icon` varchar(200) DEFAULT NULL COMMENT '图标',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0=停用 1=启用',
  PRIMARY KEY (`id`),
  KEY `IDX_5accbcc6575973b393d6f57133` (`createTime`),
  KEY `IDX_0fea161cba89057814f0244b0d` (`updateTime`),
  KEY `IDX_c80b578b47818c25a5af216e9f` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clothing_category`
--

LOCK TABLES `clothing_category` WRITE;
/*!40000 ALTER TABLE `clothing_category` DISABLE KEYS */;
INSERT INTO `clothing_category` VALUES (1,'2026-06-22 22:14:50','2026-06-22 22:14:50',NULL,0,'11',NULL,1,1);
/*!40000 ALTER TABLE `clothing_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clothing_collect`
--

DROP TABLE IF EXISTS `clothing_collect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clothing_collect` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `goodsId` int NOT NULL COMMENT '商品ID',
  PRIMARY KEY (`id`),
  KEY `IDX_3873a9af20e1306a63cffcbd58` (`createTime`),
  KEY `IDX_0c0d7781c6264966ec1c4f07fe` (`updateTime`),
  KEY `IDX_97290267cc9dd057ce029a5f6f` (`tenantId`),
  KEY `IDX_e468977964ab84c029bce50dc5` (`userId`),
  KEY `IDX_0c23c335e58777eee5512a7d24` (`goodsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clothing_collect`
--

LOCK TABLES `clothing_collect` WRITE;
/*!40000 ALTER TABLE `clothing_collect` DISABLE KEYS */;
/*!40000 ALTER TABLE `clothing_collect` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clothing_goods`
--

DROP TABLE IF EXISTS `clothing_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clothing_goods` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `categoryId` int NOT NULL COMMENT '分类ID',
  `merchantId` int DEFAULT NULL COMMENT '商家ID',
  `title` varchar(100) NOT NULL COMMENT '商品标题',
  `subtitle` varchar(200) DEFAULT NULL COMMENT '副标题',
  `mainImage` varchar(500) DEFAULT NULL COMMENT '主图',
  `images` json DEFAULT NULL COMMENT '图片列表',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `marketPrice` decimal(10,2) DEFAULT NULL COMMENT '市场价',
  `stock` int NOT NULL DEFAULT '0' COMMENT '库存',
  `sales` int NOT NULL DEFAULT '0' COMMENT '销量',
  `rating` decimal(3,2) NOT NULL DEFAULT '5.00' COMMENT '评分',
  `craftIntro` text COMMENT '工艺介绍',
  `inheritorName` varchar(50) DEFAULT NULL COMMENT '传承人',
  `detailContent` text COMMENT '详情',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0=下架 1=上架',
  PRIMARY KEY (`id`),
  KEY `IDX_12256b27ccd61e50bb58897d6a` (`createTime`),
  KEY `IDX_940cf0743c2981c0185492b4ff` (`updateTime`),
  KEY `IDX_47dc16caeee591ecba2329607e` (`tenantId`),
  KEY `IDX_af4627fe42d3eddb873ecd47d9` (`categoryId`),
  KEY `IDX_bf260f3beec764229d819d49a6` (`merchantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clothing_goods`
--

LOCK TABLES `clothing_goods` WRITE;
/*!40000 ALTER TABLE `clothing_goods` DISABLE KEYS */;
/*!40000 ALTER TABLE `clothing_goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clothing_goods_sku`
--

DROP TABLE IF EXISTS `clothing_goods_sku`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clothing_goods_sku` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `goodsId` int NOT NULL COMMENT '商品ID',
  `specName` varchar(100) NOT NULL COMMENT '规格名称',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `stock` int NOT NULL DEFAULT '0' COMMENT '库存',
  `image` varchar(500) DEFAULT NULL COMMENT '图片',
  PRIMARY KEY (`id`),
  KEY `IDX_fb39f98336bdb6a232918c624b` (`createTime`),
  KEY `IDX_e039ff2dd34442b78227010e1f` (`updateTime`),
  KEY `IDX_4150cc1e9ba3a08117b01ce915` (`tenantId`),
  KEY `IDX_fba24dd7706ee83b55a587aec7` (`goodsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clothing_goods_sku`
--

LOCK TABLES `clothing_goods_sku` WRITE;
/*!40000 ALTER TABLE `clothing_goods_sku` DISABLE KEYS */;
/*!40000 ALTER TABLE `clothing_goods_sku` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clothing_review`
--

DROP TABLE IF EXISTS `clothing_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clothing_review` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderId` int NOT NULL COMMENT '订单ID',
  `goodsId` int NOT NULL COMMENT '商品ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `rating` tinyint NOT NULL COMMENT '评分',
  `content` text COMMENT '评价内容',
  `images` json DEFAULT NULL COMMENT '图片列表',
  `reply` text COMMENT '商家回复',
  PRIMARY KEY (`id`),
  KEY `IDX_701a9ba9ee54a3cd7844ce6565` (`createTime`),
  KEY `IDX_8375352ec308822763f55639a0` (`updateTime`),
  KEY `IDX_8b52dd21ec579fd96d2bfef433` (`tenantId`),
  KEY `IDX_85b02e242dd68bed5cb57d30ed` (`orderId`),
  KEY `IDX_3db419dc9ffc5f6d5693df211d` (`goodsId`),
  KEY `IDX_60c4862f916d915817e8fb38e8` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clothing_review`
--

LOCK TABLES `clothing_review` WRITE;
/*!40000 ALTER TABLE `clothing_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `clothing_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_article`
--

DROP TABLE IF EXISTS `community_article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `community_article` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `content` text NOT NULL COMMENT '文字内容',
  `images` json DEFAULT NULL COMMENT '图片列表',
  `videoUrl` varchar(500) DEFAULT NULL COMMENT '视频URL',
  `topicIds` json DEFAULT NULL COMMENT '话题ID列表',
  `relatedPlaceType` tinyint DEFAULT NULL COMMENT '关联地点类型 1=餐厅 2=民宿 3=景区',
  `relatedPlaceId` int DEFAULT NULL COMMENT '关联地点ID',
  `likes` int NOT NULL DEFAULT '0' COMMENT '点赞数',
  `comments` int NOT NULL DEFAULT '0' COMMENT '评论数',
  `collects` int NOT NULL DEFAULT '0' COMMENT '收藏数',
  `views` int NOT NULL DEFAULT '0' COMMENT '浏览数',
  `status` int NOT NULL DEFAULT '0' COMMENT '状态 0=待审核 1=正常 2=已下架',
  PRIMARY KEY (`id`),
  KEY `IDX_8d3d6f4a960a31f2bece975239` (`createTime`),
  KEY `IDX_6280484a9e5d5103cb48dc47ba` (`updateTime`),
  KEY `IDX_f112499ae8a9a6c6ea6aa71ac2` (`tenantId`),
  KEY `IDX_6948afb7d5cec491d569ac23b7` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_article`
--

LOCK TABLES `community_article` WRITE;
/*!40000 ALTER TABLE `community_article` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_collect`
--

DROP TABLE IF EXISTS `community_collect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `community_collect` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `articleId` int NOT NULL COMMENT '游记ID',
  PRIMARY KEY (`id`),
  KEY `IDX_37f09c324ea79a663f020cd711` (`createTime`),
  KEY `IDX_1ea39e97bb9030d3bc616d1bcc` (`updateTime`),
  KEY `IDX_5a3ec11cb36951319489c101c8` (`tenantId`),
  KEY `IDX_d9fdefde06c5ff0bb4b1a27e38` (`userId`),
  KEY `IDX_e7c2852481914e519ec279481f` (`articleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_collect`
--

LOCK TABLES `community_collect` WRITE;
/*!40000 ALTER TABLE `community_collect` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_collect` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_comment`
--

DROP TABLE IF EXISTS `community_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `community_comment` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `articleId` int NOT NULL COMMENT '游记ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `parentId` int NOT NULL DEFAULT '0' COMMENT '父评论ID，0=一级评论',
  `replyUserId` int DEFAULT NULL COMMENT '回复的用户ID',
  `content` varchar(500) NOT NULL COMMENT '评论内容',
  PRIMARY KEY (`id`),
  KEY `IDX_4136e73a3b34c8deb6e5a54a30` (`createTime`),
  KEY `IDX_105a7f2b921502f07edd6cb33f` (`updateTime`),
  KEY `IDX_2c8da8048f264274362ee09b3d` (`tenantId`),
  KEY `IDX_5f9d0a90d4ce5cf5063deda23a` (`articleId`),
  KEY `IDX_9b4cde466c11e62a50c87925e8` (`userId`),
  KEY `IDX_644d2a947c3f67a2bb37dfc6b0` (`parentId`),
  KEY `IDX_6b25390899818791e7cd01eed5` (`replyUserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_comment`
--

LOCK TABLES `community_comment` WRITE;
/*!40000 ALTER TABLE `community_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_follow`
--

DROP TABLE IF EXISTS `community_follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `community_follow` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `followerId` int NOT NULL COMMENT '关注者ID',
  `followeeId` int NOT NULL COMMENT '被关注者ID',
  PRIMARY KEY (`id`),
  KEY `IDX_5054de08abc26da3f03cbeb393` (`createTime`),
  KEY `IDX_7fb5e7b98162865c03ed1f5e66` (`updateTime`),
  KEY `IDX_d69b25265577968ee3ff71026f` (`tenantId`),
  KEY `IDX_50ceb9a4d1b33943ebf6968ab9` (`followerId`),
  KEY `IDX_7ffb23054a73a85fae78d6922d` (`followeeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_follow`
--

LOCK TABLES `community_follow` WRITE;
/*!40000 ALTER TABLE `community_follow` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_image`
--

DROP TABLE IF EXISTS `community_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `community_image` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `articleId` int NOT NULL COMMENT '游记ID',
  `imageUrl` varchar(500) NOT NULL COMMENT '图片URL',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `IDX_cd04b98ae6d54ae61e3eea8afc` (`createTime`),
  KEY `IDX_be8ce332b8a63fe4e7396a29f6` (`updateTime`),
  KEY `IDX_2a63c0fd5d66d50bb8a56bbda8` (`tenantId`),
  KEY `IDX_113496232654511b5808c7ae8f` (`articleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_image`
--

LOCK TABLES `community_image` WRITE;
/*!40000 ALTER TABLE `community_image` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_like`
--

DROP TABLE IF EXISTS `community_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `community_like` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `targetType` tinyint NOT NULL COMMENT '目标类型 1=游记 2=评论',
  `targetId` int NOT NULL COMMENT '目标ID',
  PRIMARY KEY (`id`),
  KEY `IDX_a7ca9646c5abfcba0573523e7a` (`createTime`),
  KEY `IDX_1498fb9dd9dd2474cc6a8c5b3b` (`updateTime`),
  KEY `IDX_449bc1b17c366b3047820ffc7c` (`tenantId`),
  KEY `IDX_5dadcd9545ebdb4f5ab19d2f2f` (`userId`),
  KEY `IDX_e30be41c49f58ce2e2697fcd39` (`targetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_like`
--

LOCK TABLES `community_like` WRITE;
/*!40000 ALTER TABLE `community_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_report`
--

DROP TABLE IF EXISTS `community_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `community_report` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int DEFAULT NULL COMMENT '举报用户ID',
  `targetType` tinyint NOT NULL COMMENT '目标类型 1=游记 2=评论',
  `targetId` int NOT NULL COMMENT '目标ID',
  `reason` varchar(200) NOT NULL COMMENT '举报原因',
  `status` int NOT NULL DEFAULT '0' COMMENT '处理状态 0=待处理 1=已处理 2=驳回',
  PRIMARY KEY (`id`),
  KEY `IDX_5b8a9688245f5bbe7ea93e70e1` (`createTime`),
  KEY `IDX_03e71c50be854c677851e35064` (`updateTime`),
  KEY `IDX_2c6da954782b9897df2b852e10` (`tenantId`),
  KEY `IDX_3219835a1594577cfde895719b` (`userId`),
  KEY `IDX_cb09609227b79ba81887de962c` (`targetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_report`
--

LOCK TABLES `community_report` WRITE;
/*!40000 ALTER TABLE `community_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_tag`
--

DROP TABLE IF EXISTS `community_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `community_tag` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(50) NOT NULL COMMENT '标签名',
  PRIMARY KEY (`id`),
  KEY `IDX_2fb779ae961c110a85e83fcf5d` (`createTime`),
  KEY `IDX_4eaa6cce84c90f38c57d1c0743` (`updateTime`),
  KEY `IDX_5df23d7065d54d4e86d316492a` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_tag`
--

LOCK TABLES `community_tag` WRITE;
/*!40000 ALTER TABLE `community_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_topic`
--

DROP TABLE IF EXISTS `community_topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `community_topic` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(50) NOT NULL COMMENT '话题名',
  `description` text COMMENT '简介',
  `icon` varchar(200) DEFAULT NULL COMMENT '图标',
  `followers` int NOT NULL DEFAULT '0' COMMENT '关注数',
  `articles` int NOT NULL DEFAULT '0' COMMENT '游记数',
  `isRecommended` int NOT NULL DEFAULT '0' COMMENT '是否推荐 0=否 1=是',
  PRIMARY KEY (`id`),
  KEY `IDX_507dcc171f1b83a9a6f2eaf419` (`createTime`),
  KEY `IDX_b34f31d400035d781d52cec80d` (`updateTime`),
  KEY `IDX_24a80d1136201c662ae3228d69` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_topic`
--

LOCK TABLES `community_topic` WRITE;
/*!40000 ALTER TABLE `community_topic` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_video`
--

DROP TABLE IF EXISTS `community_video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `community_video` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `articleId` int NOT NULL COMMENT '游记ID',
  `videoUrl` varchar(500) NOT NULL COMMENT '视频URL',
  PRIMARY KEY (`id`),
  KEY `IDX_9bacbb0da5503cc040372d27c6` (`createTime`),
  KEY `IDX_832291ecfc4a37a5a154951a18` (`updateTime`),
  KEY `IDX_7f196cb440a8b0a3fdf3f1ce34` (`tenantId`),
  KEY `IDX_a784199f6cf8950825aae44093` (`articleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_video`
--

LOCK TABLES `community_video` WRITE;
/*!40000 ALTER TABLE `community_video` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `demo_goods`
--

DROP TABLE IF EXISTS `demo_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `demo_goods` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `title` varchar(50) NOT NULL COMMENT '标题',
  `price` decimal(5,2) NOT NULL COMMENT '价格',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `mainImage` varchar(255) DEFAULT NULL COMMENT '主图',
  `type` int NOT NULL COMMENT '分类',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态',
  `exampleImages` json DEFAULT NULL COMMENT '示例图',
  `stock` int NOT NULL DEFAULT '0' COMMENT '库存',
  PRIMARY KEY (`id`),
  KEY `IDX_5075bf301ed9c39b5ca534231c` (`createTime`),
  KEY `IDX_82703e0477d1219261277df718` (`updateTime`),
  KEY `IDX_4773d4d34db0d601516da30bf3` (`tenantId`),
  KEY `IDX_85a70ee36c7c1b0a04bfa1ed27` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demo_goods`
--

LOCK TABLES `demo_goods` WRITE;
/*!40000 ALTER TABLE `demo_goods` DISABLE KEYS */;
/*!40000 ALTER TABLE `demo_goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dict_info`
--

DROP TABLE IF EXISTS `dict_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dict_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `typeId` int NOT NULL COMMENT '类型ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `value` varchar(255) DEFAULT NULL COMMENT '值',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `parentId` int DEFAULT NULL COMMENT '父ID',
  PRIMARY KEY (`id`),
  KEY `IDX_5c311a4af30de1181a5d7a7cc2` (`createTime`),
  KEY `IDX_10362a62adbf120821fff209d8` (`updateTime`),
  KEY `IDX_c26dc4b1ccb26e642191995edd` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dict_info`
--

LOCK TABLES `dict_info` WRITE;
/*!40000 ALTER TABLE `dict_info` DISABLE KEYS */;
INSERT INTO `dict_info` VALUES (21,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,19,'COOL','cool',1,NULL,NULL),(22,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,19,'闪酷','https://show.cool-admin.com/api/public/uploads/20230308/c731b0cba84046268b10edbbcf36f948_315c243a448e1369fa145c5ea3f020da.gif',2,NULL,NULL),(23,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,20,'法师','4',1,NULL,NULL),(24,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,20,'战士','3',2,NULL,NULL),(25,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,20,'坦克','2',3,NULL,NULL),(26,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,20,'刺客','1',4,NULL,NULL),(27,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,20,'射手','0',5,NULL,NULL),(30,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,20,'幻影刺客','5',1,NULL,26);
/*!40000 ALTER TABLE `dict_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dict_type`
--

DROP TABLE IF EXISTS `dict_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dict_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `key` varchar(255) NOT NULL COMMENT '标识',
  PRIMARY KEY (`id`),
  KEY `IDX_69734e5c2d29cc2139d5078f2c` (`createTime`),
  KEY `IDX_6cccb2e33846cd354e8dc0e0ef` (`updateTime`),
  KEY `IDX_7d4f3d2336e1afdda38278a07e` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dict_type`
--

LOCK TABLES `dict_type` WRITE;
/*!40000 ALTER TABLE `dict_type` DISABLE KEYS */;
INSERT INTO `dict_type` VALUES (19,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'品牌','brand'),(20,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,'职业','occupation');
/*!40000 ALTER TABLE `dict_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_agriculture_category`
--

DROP TABLE IF EXISTS `food_agriculture_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food_agriculture_category` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `parentId` int NOT NULL DEFAULT '0' COMMENT '父分类ID，0=顶级',
  `name` varchar(50) NOT NULL COMMENT '分类名称',
  `icon` varchar(200) DEFAULT NULL COMMENT '图标',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `IDX_284b9dbcd33facf13886afe4b1` (`createTime`),
  KEY `IDX_f619a2294dfa7cf9d8a1ca79cd` (`updateTime`),
  KEY `IDX_80c468da51d6facea45e5d6f61` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_agriculture_category`
--

LOCK TABLES `food_agriculture_category` WRITE;
/*!40000 ALTER TABLE `food_agriculture_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `food_agriculture_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_agriculture_goods`
--

DROP TABLE IF EXISTS `food_agriculture_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food_agriculture_goods` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `categoryId` int NOT NULL COMMENT '分类ID',
  `merchantId` int DEFAULT NULL COMMENT '商家ID',
  `name` varchar(100) NOT NULL COMMENT '商品名称',
  `mainImage` varchar(500) DEFAULT NULL COMMENT '主图',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `specification` varchar(50) DEFAULT NULL COMMENT '规格',
  `stock` int NOT NULL DEFAULT '0' COMMENT '库存',
  `origin` varchar(100) DEFAULT NULL COMMENT '产地',
  `shelfLife` varchar(50) DEFAULT NULL COMMENT '保质期',
  `detailContent` text COMMENT '详情',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0=下架 1=上架',
  PRIMARY KEY (`id`),
  KEY `IDX_27c80cde8c4a0ea3babe394684` (`createTime`),
  KEY `IDX_013644d8f7accb44c3bdd3798d` (`updateTime`),
  KEY `IDX_bdce03daf759f5a52b671cae0f` (`tenantId`),
  KEY `IDX_39e75292b07da6acb67ecc5df7` (`categoryId`),
  KEY `IDX_139ada176a33809840d72927bd` (`merchantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_agriculture_goods`
--

LOCK TABLES `food_agriculture_goods` WRITE;
/*!40000 ALTER TABLE `food_agriculture_goods` DISABLE KEYS */;
/*!40000 ALTER TABLE `food_agriculture_goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_collect`
--

DROP TABLE IF EXISTS `food_collect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food_collect` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `targetType` tinyint NOT NULL COMMENT '类型 1=餐厅 2=农产品',
  `targetId` int NOT NULL COMMENT '目标ID(餐厅ID或商品ID)',
  PRIMARY KEY (`id`),
  KEY `IDX_0081c57b56a6c815a671a6fb8a` (`createTime`),
  KEY `IDX_61e79b11aab37eec49ec49ac65` (`updateTime`),
  KEY `IDX_0635310aa437960cb3253b1b89` (`tenantId`),
  KEY `IDX_2c9aa7f37c58a2ae292c468e45` (`userId`),
  KEY `IDX_c1a5b49e8e496cb42e89735348` (`targetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_collect`
--

LOCK TABLES `food_collect` WRITE;
/*!40000 ALTER TABLE `food_collect` DISABLE KEYS */;
/*!40000 ALTER TABLE `food_collect` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_dish`
--

DROP TABLE IF EXISTS `food_dish`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food_dish` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `restaurantId` int NOT NULL COMMENT '餐厅ID',
  `name` varchar(100) NOT NULL COMMENT '菜品名称',
  `mainImage` varchar(500) DEFAULT NULL COMMENT '主图',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `description` text COMMENT '介绍',
  `isSignature` int NOT NULL DEFAULT '0' COMMENT '是否招牌 0=否 1=是',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `IDX_d58ecf28497c5badafb9a9192d` (`createTime`),
  KEY `IDX_da1f209fbbee13d25917bf0e13` (`updateTime`),
  KEY `IDX_5711a9846e1431a6788a228738` (`tenantId`),
  KEY `IDX_b946ff1bcb27e5684c1d69d6fe` (`restaurantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_dish`
--

LOCK TABLES `food_dish` WRITE;
/*!40000 ALTER TABLE `food_dish` DISABLE KEYS */;
/*!40000 ALTER TABLE `food_dish` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_restaurant`
--

DROP TABLE IF EXISTS `food_restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food_restaurant` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `merchantId` int DEFAULT NULL COMMENT '商家ID',
  `name` varchar(100) NOT NULL COMMENT '餐厅名称',
  `description` text COMMENT '简介',
  `mainImage` varchar(500) DEFAULT NULL COMMENT '主图',
  `address` varchar(200) DEFAULT NULL COMMENT '地址',
  `businessHours` varchar(100) DEFAULT NULL COMMENT '营业时间',
  `capacity` int NOT NULL DEFAULT '0' COMMENT '容纳人数',
  `rating` decimal(3,2) NOT NULL DEFAULT '5.00' COMMENT '评分',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0=停业 1=营业',
  PRIMARY KEY (`id`),
  KEY `IDX_1ea0f43bd5fae3f017b64df3b9` (`createTime`),
  KEY `IDX_7a055cdaee9252f4194067dc86` (`updateTime`),
  KEY `IDX_c08982e257788d4e23691ac466` (`tenantId`),
  KEY `IDX_804de22480bdf32b5745b845a3` (`merchantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_restaurant`
--

LOCK TABLES `food_restaurant` WRITE;
/*!40000 ALTER TABLE `food_restaurant` DISABLE KEYS */;
/*!40000 ALTER TABLE `food_restaurant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_review`
--

DROP TABLE IF EXISTS `food_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food_review` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `restaurantId` int DEFAULT NULL COMMENT '餐厅ID',
  `goodsId` int DEFAULT NULL COMMENT '商品ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `rating` tinyint NOT NULL COMMENT '评分',
  `content` text COMMENT '评价内容',
  `images` json DEFAULT NULL COMMENT '图片列表',
  PRIMARY KEY (`id`),
  KEY `IDX_4f0a37ef44140a086c26b465aa` (`createTime`),
  KEY `IDX_cb739523dc3bddc8df74165d37` (`updateTime`),
  KEY `IDX_1088b7b337fca687bfc2131666` (`tenantId`),
  KEY `IDX_7607641a21a5cf45d46a0feee7` (`restaurantId`),
  KEY `IDX_84d8c0bdac3ceec7ec770e406f` (`goodsId`),
  KEY `IDX_ccf4abb31982277d1cc7b887c9` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_review`
--

LOCK TABLES `food_review` WRITE;
/*!40000 ALTER TABLE `food_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `food_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_time_slot`
--

DROP TABLE IF EXISTS `food_time_slot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food_time_slot` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `restaurantId` int NOT NULL COMMENT '餐厅ID',
  `name` varchar(50) NOT NULL COMMENT '时段名称',
  `maxBookings` int NOT NULL DEFAULT '50' COMMENT '最大预订数',
  PRIMARY KEY (`id`),
  KEY `IDX_234d281e71f8dc64697cf258d6` (`createTime`),
  KEY `IDX_b8366d3905e976a749a92aca9d` (`updateTime`),
  KEY `IDX_66d8dc4f24a69c8efd853386d0` (`tenantId`),
  KEY `IDX_c91d2929c61e949ff95cf18c8a` (`restaurantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_time_slot`
--

LOCK TABLES `food_time_slot` WRITE;
/*!40000 ALTER TABLE `food_time_slot` DISABLE KEYS */;
/*!40000 ALTER TABLE `food_time_slot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lodging_calendar`
--

DROP TABLE IF EXISTS `lodging_calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lodging_calendar` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `roomTypeId` int NOT NULL COMMENT '房型ID',
  `date` date NOT NULL COMMENT '日期',
  `availableStock` int NOT NULL DEFAULT '0' COMMENT '可用库存',
  `price` decimal(10,2) NOT NULL COMMENT '当日价格',
  `isAvailable` int NOT NULL DEFAULT '1' COMMENT '是否可订 0=不可订 1=可订',
  PRIMARY KEY (`id`),
  KEY `IDX_b683c86d6c30e79f5a88886cb1` (`createTime`),
  KEY `IDX_9e3c8389a4061c79648fbbf614` (`updateTime`),
  KEY `IDX_a13cdeabf662ef70a3a85804ca` (`tenantId`),
  KEY `IDX_a6fd34a7488d14c49b54854caf` (`roomTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lodging_calendar`
--

LOCK TABLES `lodging_calendar` WRITE;
/*!40000 ALTER TABLE `lodging_calendar` DISABLE KEYS */;
/*!40000 ALTER TABLE `lodging_calendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lodging_collect`
--

DROP TABLE IF EXISTS `lodging_collect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lodging_collect` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `hostelId` int NOT NULL COMMENT '民宿ID',
  PRIMARY KEY (`id`),
  KEY `IDX_311181f9d8f688c56f8496b8c6` (`createTime`),
  KEY `IDX_5ed43af2bf019e105e6a68950c` (`updateTime`),
  KEY `IDX_cbffd56c8eba954c662a88ab72` (`tenantId`),
  KEY `IDX_ddb1bcec455af1ce4eed7ea9b3` (`userId`),
  KEY `IDX_42a56f5006505b8c63a3c3f36e` (`hostelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lodging_collect`
--

LOCK TABLES `lodging_collect` WRITE;
/*!40000 ALTER TABLE `lodging_collect` DISABLE KEYS */;
/*!40000 ALTER TABLE `lodging_collect` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lodging_hostel`
--

DROP TABLE IF EXISTS `lodging_hostel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lodging_hostel` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `merchantId` int DEFAULT NULL COMMENT '商家ID',
  `name` varchar(100) NOT NULL COMMENT '民宿名称',
  `address` varchar(200) NOT NULL COMMENT '地址',
  `mainImage` varchar(500) DEFAULT NULL COMMENT '主图',
  `images` json DEFAULT NULL COMMENT '图片列表',
  `description` text COMMENT '介绍',
  `rating` decimal(3,2) NOT NULL DEFAULT '5.00' COMMENT '评分',
  `styleTags` varchar(200) DEFAULT NULL COMMENT '风格标签',
  `facilityTags` varchar(200) DEFAULT NULL COMMENT '设施标签',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0=停业 1=营业',
  PRIMARY KEY (`id`),
  KEY `IDX_29347267d3f0ae7f0d5eb6cc01` (`createTime`),
  KEY `IDX_606539bb0f5fcc7c5983db4478` (`updateTime`),
  KEY `IDX_6fbf0a3fa8a092beb99e8b5463` (`tenantId`),
  KEY `IDX_39692cb1cca2c1ae0220c54247` (`merchantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lodging_hostel`
--

LOCK TABLES `lodging_hostel` WRITE;
/*!40000 ALTER TABLE `lodging_hostel` DISABLE KEYS */;
/*!40000 ALTER TABLE `lodging_hostel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lodging_hostel_policy`
--

DROP TABLE IF EXISTS `lodging_hostel_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lodging_hostel_policy` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `hostelId` int NOT NULL COMMENT '民宿ID',
  `checkInTime` varchar(20) NOT NULL DEFAULT '14:00' COMMENT '入住时间',
  `checkOutTime` varchar(20) NOT NULL DEFAULT '12:00' COMMENT '离店时间',
  `petPolicy` varchar(50) DEFAULT NULL COMMENT '宠物政策',
  `includeBreakfast` int NOT NULL DEFAULT '0' COMMENT '是否含早 0=否 1=是',
  `deposit` decimal(10,2) DEFAULT NULL COMMENT '押金金额',
  PRIMARY KEY (`id`),
  KEY `IDX_39628196c66da2a1782abc423f` (`createTime`),
  KEY `IDX_2feafce95461fdb2b305fc0dfe` (`updateTime`),
  KEY `IDX_6a2f63f11e501684ab1b004290` (`tenantId`),
  KEY `IDX_f2f6429113c61bf63a0e1d181d` (`hostelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lodging_hostel_policy`
--

LOCK TABLES `lodging_hostel_policy` WRITE;
/*!40000 ALTER TABLE `lodging_hostel_policy` DISABLE KEYS */;
/*!40000 ALTER TABLE `lodging_hostel_policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lodging_review`
--

DROP TABLE IF EXISTS `lodging_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lodging_review` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderId` int NOT NULL COMMENT '订单ID',
  `hostelId` int NOT NULL COMMENT '民宿ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `rating` tinyint NOT NULL COMMENT '评分',
  `content` text COMMENT '评价内容',
  `images` json DEFAULT NULL COMMENT '图片列表',
  `reply` text COMMENT '商家回复',
  PRIMARY KEY (`id`),
  KEY `IDX_70b0046e12b9307b724ecd2a55` (`createTime`),
  KEY `IDX_05e2fc2b902af907ef42363e97` (`updateTime`),
  KEY `IDX_8237caaf4606efbfdbc6a4976f` (`tenantId`),
  KEY `IDX_91349455efdaaa9e74c6fbba5e` (`orderId`),
  KEY `IDX_dd8795efe72e5b999e6173018c` (`hostelId`),
  KEY `IDX_8367ea0f16cc524681c2bc793a` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lodging_review`
--

LOCK TABLES `lodging_review` WRITE;
/*!40000 ALTER TABLE `lodging_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `lodging_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lodging_room_type`
--

DROP TABLE IF EXISTS `lodging_room_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lodging_room_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `hostelId` int NOT NULL COMMENT '民宿ID',
  `name` varchar(50) NOT NULL COMMENT '房型名',
  `bedType` varchar(50) DEFAULT NULL COMMENT '床型',
  `area` decimal(5,1) DEFAULT NULL COMMENT '面积(平方米)',
  `capacity` int NOT NULL DEFAULT '2' COMMENT '容纳人数',
  `facilities` text COMMENT '设施',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `stock` int NOT NULL DEFAULT '5' COMMENT '库存(房间数)',
  `mainImage` varchar(500) DEFAULT NULL COMMENT '主图',
  PRIMARY KEY (`id`),
  KEY `IDX_ba38903940e2562ebed46e4014` (`createTime`),
  KEY `IDX_5b5e0f4950f267ae9e4554afda` (`updateTime`),
  KEY `IDX_206b856262fc89ac0ac6a9318b` (`tenantId`),
  KEY `IDX_da8c6e497e089e60f52725eb76` (`hostelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lodging_room_type`
--

LOCK TABLES `lodging_room_type` WRITE;
/*!40000 ALTER TABLE `lodging_room_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `lodging_room_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `merchant`
--

DROP TABLE IF EXISTS `merchant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `merchant` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int DEFAULT NULL COMMENT '关联用户ID',
  `moduleType` tinyint NOT NULL COMMENT '所属模块 1=衣 2=食 3=住 4=行',
  `shopName` varchar(100) NOT NULL COMMENT '店铺名称',
  `contactName` varchar(50) DEFAULT NULL COMMENT '联系人',
  `contactPhone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0=禁用 1=正常',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_4973a7acae8e2f6bfac7a781ce` (`userId`),
  KEY `IDX_afd1adcd2d9973c3eff3004546` (`createTime`),
  KEY `IDX_c8c141977b6c36497f766d5ebb` (`updateTime`),
  KEY `IDX_533144d7ae94180235ea456625` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `merchant`
--

LOCK TABLES `merchant` WRITE;
/*!40000 ALTER TABLE `merchant` DISABLE KEYS */;
/*!40000 ALTER TABLE `merchant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_base`
--

DROP TABLE IF EXISTS `order_base`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_base` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderNo` varchar(32) NOT NULL COMMENT '订单编号',
  `userId` int NOT NULL COMMENT '用户ID',
  `merchantId` int DEFAULT NULL COMMENT '商家ID',
  `moduleType` tinyint NOT NULL COMMENT '模块类型 1=衣 2=食 3=住 4=行',
  `totalAmount` decimal(10,2) NOT NULL COMMENT '订单总金额',
  `payAmount` decimal(10,2) NOT NULL COMMENT '实付金额',
  `discountAmount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '优惠金额',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '订单状态 0=待支付 1=已支付 2=已确认 3=进行中 4=已完成 5=已取消 6=已退款',
  `payTime` datetime DEFAULT NULL COMMENT '支付时间',
  `finishTime` datetime DEFAULT NULL COMMENT '完成时间',
  `cancelTime` datetime DEFAULT NULL COMMENT '取消时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '用户备注',
  `items` json DEFAULT NULL COMMENT '订单明细(JSON)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_4dcd1604153bdf91875e0eaf2e` (`orderNo`),
  KEY `IDX_f8cc040d6b9e1342f0cb2aa1e0` (`createTime`),
  KEY `IDX_091f2df0ea26a1048e22a20f14` (`updateTime`),
  KEY `IDX_7437ae42630fd05de3cf3c533a` (`tenantId`),
  KEY `IDX_41366d1a896d60ecd674c8c5f9` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_base`
--

LOCK TABLES `order_base` WRITE;
/*!40000 ALTER TABLE `order_base` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_base` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_clothing`
--

DROP TABLE IF EXISTS `order_clothing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_clothing` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderNo` varchar(32) NOT NULL COMMENT '订单编号',
  `goodsId` int NOT NULL COMMENT '商品ID',
  `goodsTitle` varchar(100) NOT NULL COMMENT '商品标题',
  `skuId` int DEFAULT NULL COMMENT 'SKU ID',
  `quantity` int NOT NULL DEFAULT '1' COMMENT '数量',
  `price` decimal(10,2) NOT NULL COMMENT '单价',
  PRIMARY KEY (`id`),
  KEY `IDX_cea107aa3652f0ddfa67d7acc1` (`createTime`),
  KEY `IDX_c478802aa799789fe965beec50` (`updateTime`),
  KEY `IDX_51db353305c1222cb972de1e45` (`tenantId`),
  KEY `IDX_88ce4f3d8479d560e33855f959` (`orderNo`),
  KEY `IDX_e2cc6524ee2eb104cc0d7e795a` (`goodsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_clothing`
--

LOCK TABLES `order_clothing` WRITE;
/*!40000 ALTER TABLE `order_clothing` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_clothing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_food_booking`
--

DROP TABLE IF EXISTS `order_food_booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_food_booking` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderNo` varchar(32) NOT NULL COMMENT '订单编号',
  `restaurantId` int NOT NULL COMMENT '餐厅ID',
  `restaurantName` varchar(100) NOT NULL COMMENT '餐厅名称',
  `bookingDate` date NOT NULL COMMENT '预订日期',
  `timeSlotId` int NOT NULL COMMENT '时段ID',
  `personCount` int NOT NULL DEFAULT '1' COMMENT '人数',
  `totalAmount` decimal(10,2) NOT NULL COMMENT '总金额',
  `contactName` varchar(50) NOT NULL COMMENT '预订人姓名',
  `contactPhone` varchar(20) NOT NULL COMMENT '联系电话',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  KEY `IDX_e5c6e2d692c0282efe9781d02c` (`createTime`),
  KEY `IDX_aa05813cb20d2bb26dfcafa8d9` (`updateTime`),
  KEY `IDX_8c82c44009ad2b57baf4ce773f` (`tenantId`),
  KEY `IDX_73ee13b6e658e9493dea5a3b90` (`orderNo`),
  KEY `IDX_8d1b2ed2413a2437b969efebd0` (`restaurantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_food_booking`
--

LOCK TABLES `order_food_booking` WRITE;
/*!40000 ALTER TABLE `order_food_booking` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_food_booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_food_product`
--

DROP TABLE IF EXISTS `order_food_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_food_product` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderNo` varchar(32) NOT NULL COMMENT '订单编号',
  `goodsId` int NOT NULL COMMENT '农产品ID',
  `goodsTitle` varchar(100) NOT NULL COMMENT '商品标题',
  `quantity` int NOT NULL DEFAULT '1' COMMENT '数量',
  `price` decimal(10,2) NOT NULL COMMENT '单价',
  PRIMARY KEY (`id`),
  KEY `IDX_7d562715942fcdad0a92d01b2b` (`createTime`),
  KEY `IDX_cb4c071c36f6ac13b17692c94e` (`updateTime`),
  KEY `IDX_130726c05fabecf36ce175f8cf` (`tenantId`),
  KEY `IDX_75083d91b9f2e521902df584ce` (`orderNo`),
  KEY `IDX_6ecc2f54f05d47a074bfba791b` (`goodsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_food_product`
--

LOCK TABLES `order_food_product` WRITE;
/*!40000 ALTER TABLE `order_food_product` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_food_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_lodging`
--

DROP TABLE IF EXISTS `order_lodging`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_lodging` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderNo` varchar(32) NOT NULL COMMENT '订单编号',
  `hostelId` int NOT NULL COMMENT '民宿ID',
  `hostelName` varchar(100) NOT NULL COMMENT '民宿名称',
  `roomTypeId` int NOT NULL COMMENT '房型ID',
  `roomTypeName` varchar(50) NOT NULL COMMENT '房型名',
  `checkInDate` date NOT NULL COMMENT '入住日期',
  `checkOutDate` date NOT NULL COMMENT '离店日期',
  `nights` int NOT NULL DEFAULT '1' COMMENT '晚数',
  `guestCount` int NOT NULL DEFAULT '1' COMMENT '人数',
  `totalAmount` decimal(10,2) NOT NULL COMMENT '总金额',
  `guestName` varchar(50) NOT NULL COMMENT '入住人姓名',
  `idCard` varchar(20) DEFAULT NULL COMMENT '身份证号',
  PRIMARY KEY (`id`),
  KEY `IDX_b1e913ee1e2c4f84dfdfa292f0` (`createTime`),
  KEY `IDX_de9f0236a74a403cf95ba51d11` (`updateTime`),
  KEY `IDX_2b963331d8faad9269018fa6c2` (`tenantId`),
  KEY `IDX_a063f8f0910bf54869c14e2932` (`orderNo`),
  KEY `IDX_14897a887946e4bdfc27100da3` (`hostelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_lodging`
--

LOCK TABLES `order_lodging` WRITE;
/*!40000 ALTER TABLE `order_lodging` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_lodging` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_travel`
--

DROP TABLE IF EXISTS `order_travel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_travel` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderNo` varchar(32) NOT NULL COMMENT '订单编号',
  `itemType` tinyint NOT NULL COMMENT '类型 1=门票 2=路线',
  `targetId` int NOT NULL COMMENT '关联ID(景区ID或路线ID)',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `quantity` int NOT NULL DEFAULT '1' COMMENT '数量',
  `price` decimal(10,2) NOT NULL COMMENT '单价',
  `useDate` date DEFAULT NULL COMMENT '使用日期',
  `visitorName` varchar(50) NOT NULL COMMENT '游客姓名',
  `visitorPhone` varchar(20) NOT NULL COMMENT '联系电话',
  PRIMARY KEY (`id`),
  KEY `IDX_62063b59c84cca7038c6c71ee4` (`createTime`),
  KEY `IDX_5518459b5f8e7465a28a8cc4d4` (`updateTime`),
  KEY `IDX_cc800433ef848afc0e6599318d` (`tenantId`),
  KEY `IDX_111ad4f315916fef11738ec18f` (`orderNo`),
  KEY `IDX_57e85e710ffd8092149b4ee9fc` (`itemType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_travel`
--

LOCK TABLES `order_travel` WRITE;
/*!40000 ALTER TABLE `order_travel` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_travel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_record`
--

DROP TABLE IF EXISTS `payment_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_record` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderNo` varchar(32) NOT NULL COMMENT '订单编号',
  `transactionId` varchar(64) DEFAULT NULL COMMENT '支付流水号',
  `amount` decimal(10,2) NOT NULL COMMENT '支付金额',
  `payType` tinyint NOT NULL DEFAULT '1' COMMENT '支付方式 1=微信支付',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态 0=待支付 1=已支付 2=支付失败',
  `payTime` datetime DEFAULT NULL COMMENT '支付时间',
  `callbackData` text COMMENT '回调数据',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_bf448503db1fa87ff68de585e6` (`transactionId`),
  KEY `IDX_c3e7f4d7795db1497b6b93f569` (`createTime`),
  KEY `IDX_4a29bd59e6c2f44a6221ccda88` (`updateTime`),
  KEY `IDX_3fcf9850e4641bfde7b293192d` (`tenantId`),
  KEY `IDX_e1122ca87f563e8b395b7d28c1` (`orderNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_record`
--

LOCK TABLES `payment_record` WRITE;
/*!40000 ALTER TABLE `payment_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform_banner`
--

DROP TABLE IF EXISTS `platform_banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `platform_banner` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `imageUrl` varchar(500) NOT NULL COMMENT '图片URL',
  `linkUrl` varchar(500) DEFAULT NULL COMMENT '跳转链接',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0=停用 1=启用',
  PRIMARY KEY (`id`),
  KEY `IDX_ec3a94f0f9345ab5551f1d641d` (`createTime`),
  KEY `IDX_fd602897bfd4b725bb5b1ea0a6` (`updateTime`),
  KEY `IDX_22e2e43357c5ff83fba8218e67` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform_banner`
--

LOCK TABLES `platform_banner` WRITE;
/*!40000 ALTER TABLE `platform_banner` DISABLE KEYS */;
/*!40000 ALTER TABLE `platform_banner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform_merchant_apply`
--

DROP TABLE IF EXISTS `platform_merchant_apply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `platform_merchant_apply` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '申请人用户ID',
  `shopName` varchar(100) NOT NULL COMMENT '店铺名称',
  `moduleType` tinyint NOT NULL COMMENT '所属模块 1=衣 2=食 3=住 4=行',
  `contactName` varchar(50) NOT NULL COMMENT '联系人',
  `contactPhone` varchar(20) NOT NULL COMMENT '联系电话',
  `materials` text COMMENT '资质材料(JSON)',
  `status` int NOT NULL DEFAULT '0' COMMENT '审核状态 0=待审核 1=通过 2=驳回',
  `reviewer` varchar(50) DEFAULT NULL COMMENT '审核人',
  `reviewTime` datetime DEFAULT NULL COMMENT '审核时间',
  `rejectReason` varchar(200) DEFAULT NULL COMMENT '驳回原因',
  PRIMARY KEY (`id`),
  KEY `IDX_5e70191161e8f61b9a71a386ac` (`createTime`),
  KEY `IDX_2c342fcdc055745b5104722b35` (`updateTime`),
  KEY `IDX_8d9be75f9f4da9b08ebe60bbf9` (`tenantId`),
  KEY `IDX_c3f0f63c1280ef40eb5ba610e5` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform_merchant_apply`
--

LOCK TABLES `platform_merchant_apply` WRITE;
/*!40000 ALTER TABLE `platform_merchant_apply` DISABLE KEYS */;
/*!40000 ALTER TABLE `platform_merchant_apply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform_notice`
--

DROP TABLE IF EXISTS `platform_notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `platform_notice` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `content` text NOT NULL COMMENT '内容',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0=隐藏 1=显示',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `IDX_101bae7c014a6035af5acadf44` (`createTime`),
  KEY `IDX_cc2dfaec5edebfbec6a893fc17` (`updateTime`),
  KEY `IDX_595fd9b98f6bc4d188215171a6` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform_notice`
--

LOCK TABLES `platform_notice` WRITE;
/*!40000 ALTER TABLE `platform_notice` DISABLE KEYS */;
/*!40000 ALTER TABLE `platform_notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform_recommend`
--

DROP TABLE IF EXISTS `platform_recommend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `platform_recommend` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(50) NOT NULL COMMENT '推荐位名称',
  `contentType` tinyint NOT NULL COMMENT '内容类型 1=商品 2=餐厅 3=民宿 4=景区 5=路线 6=游记',
  `contentId` int NOT NULL COMMENT '关联内容ID',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `IDX_6f4815e2642d76c94752844d1e` (`createTime`),
  KEY `IDX_d134ee4384d2bb6738f09b52ac` (`updateTime`),
  KEY `IDX_c11b5cc4752ab85983215af004` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform_recommend`
--

LOCK TABLES `platform_recommend` WRITE;
/*!40000 ALTER TABLE `platform_recommend` DISABLE KEYS */;
/*!40000 ALTER TABLE `platform_recommend` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform_sensitive_word`
--

DROP TABLE IF EXISTS `platform_sensitive_word`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `platform_sensitive_word` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `word` varchar(100) NOT NULL COMMENT '敏感词',
  `type` int NOT NULL DEFAULT '1' COMMENT '类型 1=违禁词 2=广告词 3=辱骂词',
  PRIMARY KEY (`id`),
  KEY `IDX_766708909cfa954093eabf22a3` (`createTime`),
  KEY `IDX_b1848ff2f8695091dca03bce8b` (`updateTime`),
  KEY `IDX_28fe20ecd6b7cdfa1552552687` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform_sensitive_word`
--

LOCK TABLES `platform_sensitive_word` WRITE;
/*!40000 ALTER TABLE `platform_sensitive_word` DISABLE KEYS */;
/*!40000 ALTER TABLE `platform_sensitive_word` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform_stat`
--

DROP TABLE IF EXISTS `platform_stat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `platform_stat` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `statDate` date NOT NULL COMMENT '统计日期',
  `newUserCount` int NOT NULL DEFAULT '0' COMMENT '新增用户数',
  `orderCount` int NOT NULL DEFAULT '0' COMMENT '订单数',
  `gmv` decimal(12,2) NOT NULL COMMENT 'GMV',
  `articleCount` int NOT NULL DEFAULT '0' COMMENT '游记发布数',
  PRIMARY KEY (`id`),
  KEY `IDX_cbc8b62de898fa3045a0980d21` (`createTime`),
  KEY `IDX_3f5f1b390390e368d142ee9631` (`updateTime`),
  KEY `IDX_cd00c9e8119418c1dea334cc4d` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform_stat`
--

LOCK TABLES `platform_stat` WRITE;
/*!40000 ALTER TABLE `platform_stat` DISABLE KEYS */;
/*!40000 ALTER TABLE `platform_stat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugin_info`
--

DROP TABLE IF EXISTS `plugin_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plugin_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `description` varchar(255) NOT NULL COMMENT '简介',
  `keyName` varchar(255) NOT NULL COMMENT 'Key名',
  `hook` varchar(255) NOT NULL COMMENT 'Hook',
  `readme` text NOT NULL COMMENT '描述',
  `version` varchar(255) NOT NULL COMMENT '版本',
  `logo` text COMMENT 'Logo(base64)',
  `author` varchar(255) NOT NULL COMMENT '作者',
  `status` int NOT NULL DEFAULT '0' COMMENT '状态 0-禁用 1-启用',
  `content` json NOT NULL COMMENT '内容',
  `tsContent` json NOT NULL COMMENT 'ts内容',
  `pluginJson` json DEFAULT NULL COMMENT '插件的plugin.json',
  `config` json DEFAULT NULL COMMENT '配置',
  PRIMARY KEY (`id`),
  KEY `IDX_071da0804576df95363c24357c` (`createTime`),
  KEY `IDX_d94d7c2437aca9f1b183979b07` (`updateTime`),
  KEY `IDX_89a39daf328b50686755795546` (`tenantId`),
  KEY `IDX_95719662507de0fbf70ad1b5ee` (`keyName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugin_info`
--

LOCK TABLES `plugin_info` WRITE;
/*!40000 ALTER TABLE `plugin_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugin_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `query-result-cache`
--

DROP TABLE IF EXISTS `query-result-cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `query-result-cache` (
  `id` int NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) DEFAULT NULL,
  `time` bigint NOT NULL,
  `duration` int NOT NULL,
  `query` text NOT NULL,
  `result` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `query-result-cache`
--

LOCK TABLES `query-result-cache` WRITE;
/*!40000 ALTER TABLE `query-result-cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `query-result-cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recycle_data`
--

DROP TABLE IF EXISTS `recycle_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recycle_data` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `entityInfo` json NOT NULL COMMENT '表',
  `userId` int DEFAULT NULL COMMENT '操作人',
  `data` json NOT NULL COMMENT '被删除的数据',
  `url` varchar(255) DEFAULT NULL COMMENT '请求的接口',
  `params` json DEFAULT NULL COMMENT '请求参数',
  `count` int NOT NULL DEFAULT '1' COMMENT '删除数据条数',
  PRIMARY KEY (`id`),
  KEY `IDX_59fc783673f4a322e9c83e0599` (`createTime`),
  KEY `IDX_c6a499c4a4fcd37f2930d27816` (`updateTime`),
  KEY `IDX_6659453338145e11d9b5103f38` (`tenantId`),
  KEY `IDX_f3ed09ba7090f3eb378cb83b5b` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recycle_data`
--

LOCK TABLES `recycle_data` WRITE;
/*!40000 ALTER TABLE `recycle_data` DISABLE KEYS */;
INSERT INTO `recycle_data` VALUES (1,'2026-06-22 09:57:34','2026-06-22 09:57:34',NULL,'{\"entity\": \"MerchantEntity\", \"dataSourceName\": \"default\"}',1,'[{\"id\": 1, \"status\": 0, \"userId\": null, \"shopName\": \"新店铺名称\", \"tenantId\": null, \"createTime\": \"2026-06-22 09:57:10\", \"moduleType\": 1, \"updateTime\": \"2026-06-22 09:57:34\", \"contactName\": \"张三\", \"contactPhone\": \"13800138000\"}]','/admin/merchant/delete','{\"ids\": [1]}',1);
/*!40000 ALTER TABLE `recycle_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refund_record`
--

DROP TABLE IF EXISTS `refund_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refund_record` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderNo` varchar(32) NOT NULL COMMENT '订单编号',
  `transactionId` varchar(64) DEFAULT NULL COMMENT '支付流水号',
  `amount` decimal(10,2) NOT NULL COMMENT '退款金额',
  `reason` varchar(200) DEFAULT NULL COMMENT '退款原因',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态 0=申请中 1=已退款 2=拒绝退款',
  `refundTime` datetime DEFAULT NULL COMMENT '退款时间',
  PRIMARY KEY (`id`),
  KEY `IDX_8d07f78ad2a15841c7bbac3570` (`createTime`),
  KEY `IDX_bc8a0a172e23a78a0b3df4b632` (`updateTime`),
  KEY `IDX_39f7e04d442794b703be49ba7b` (`tenantId`),
  KEY `IDX_fbca836a0bc1a75a855499b717` (`orderNo`),
  KEY `IDX_815ab45bb1cea4534b7666b8e7` (`transactionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refund_record`
--

LOCK TABLES `refund_record` WRITE;
/*!40000 ALTER TABLE `refund_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `refund_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `space_info`
--

DROP TABLE IF EXISTS `space_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `space_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `url` varchar(255) NOT NULL COMMENT '地址',
  `type` varchar(255) NOT NULL COMMENT '类型',
  `classifyId` int DEFAULT NULL COMMENT '分类ID',
  `fileId` varchar(255) NOT NULL COMMENT '文件id',
  `name` varchar(255) NOT NULL COMMENT '文件名',
  `size` int NOT NULL COMMENT '文件大小',
  `version` int NOT NULL DEFAULT '1' COMMENT '文档版本',
  `key` varchar(255) NOT NULL COMMENT '文件位置',
  PRIMARY KEY (`id`),
  KEY `IDX_eb1da2f304c760846b5add09b3` (`createTime`),
  KEY `IDX_d7a2539961e9aacba8b353f3c9` (`updateTime`),
  KEY `IDX_6001c5ed2088b893c0d69bb244` (`tenantId`),
  KEY `IDX_0975633032bfe6574468b3a4ae` (`fileId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `space_info`
--

LOCK TABLES `space_info` WRITE;
/*!40000 ALTER TABLE `space_info` DISABLE KEYS */;
INSERT INTO `space_info` VALUES (1,'2026-06-21 22:44:22','2026-06-21 22:44:22',NULL,'http://127.0.0.1:8001/upload/20260621/微信图片_20260616164039_100_137_8def19dc40e14d7db822bb5ab7b0340d.jpg','image',1,'8def19dc40e14d7db822bb5ab7b0340d','微信图片_20260616164039_100_137.jpg',2388725,1,'/upload/20260621/微信图片_20260616164039_100_137_8def19dc40e14d7db822bb5ab7b0340d.jpg');
/*!40000 ALTER TABLE `space_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `space_type`
--

DROP TABLE IF EXISTS `space_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `space_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) NOT NULL COMMENT '类别名称',
  `parentId` int DEFAULT NULL COMMENT '父分类ID',
  PRIMARY KEY (`id`),
  KEY `IDX_6669449501d275f367ca295472` (`createTime`),
  KEY `IDX_0749b509b68488caecd4cc2bbc` (`updateTime`),
  KEY `IDX_5e7f846b8cdabbceba95ed3314` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `space_type`
--

LOCK TABLES `space_type` WRITE;
/*!40000 ALTER TABLE `space_type` DISABLE KEYS */;
INSERT INTO `space_type` VALUES (1,'2026-06-21 22:44:17','2026-06-21 22:44:17',NULL,'商品图片',NULL);
/*!40000 ALTER TABLE `space_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_info`
--

DROP TABLE IF EXISTS `task_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `jobId` varchar(255) DEFAULT NULL COMMENT '任务ID',
  `repeatConf` varchar(1000) DEFAULT NULL COMMENT '任务配置',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `cron` varchar(255) DEFAULT NULL COMMENT 'cron',
  `limit` int DEFAULT NULL COMMENT '最大执行次数 不传为无限次',
  `every` int DEFAULT NULL COMMENT '每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-停止 1-运行',
  `startDate` datetime DEFAULT NULL COMMENT '开始时间',
  `endDate` datetime DEFAULT NULL COMMENT '结束时间',
  `data` varchar(255) DEFAULT NULL COMMENT '数据',
  `service` varchar(255) DEFAULT NULL COMMENT '执行的service实例ID',
  `type` int NOT NULL DEFAULT '0' COMMENT '状态 0-系统 1-用户',
  `nextRunTime` datetime DEFAULT NULL COMMENT '下一次执行时间',
  `taskType` int NOT NULL DEFAULT '0' COMMENT '状态 0-cron 1-时间间隔',
  `lastExecuteTime` datetime DEFAULT NULL,
  `lockExpireTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_6ced02f467e59bd6306b549bb0` (`createTime`),
  KEY `IDX_2adc6f9c241391126f27dac145` (`updateTime`),
  KEY `IDX_11b991dc4a7a5585c636008d3a` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_info`
--

LOCK TABLES `task_info` WRITE;
/*!40000 ALTER TABLE `task_info` DISABLE KEYS */;
INSERT INTO `task_info` VALUES (1,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,NULL,NULL,'每秒执行一次',NULL,NULL,1000,NULL,0,NULL,NULL,NULL,'taskDemoService.test(1,2)',1,NULL,1,NULL,NULL),(2,'2026-06-21 22:40:32','2026-06-21 22:40:32',NULL,NULL,NULL,'cron任务，5秒执行一次','0/5 * * * * * ',NULL,NULL,NULL,0,NULL,NULL,NULL,'taskDemoService.test()',1,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `task_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_log`
--

DROP TABLE IF EXISTS `task_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `taskId` int DEFAULT NULL COMMENT '任务ID',
  `status` int NOT NULL DEFAULT '0' COMMENT '状态 0-失败 1-成功',
  `detail` text COMMENT '详情描述',
  PRIMARY KEY (`id`),
  KEY `IDX_b9af0e100be034924b270aab31` (`createTime`),
  KEY `IDX_8857d8d43d38bebd7159af1fa6` (`updateTime`),
  KEY `IDX_fa4cb94036d961600c0f22ed91` (`tenantId`),
  KEY `IDX_1142dfec452e924b346f060fda` (`taskId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_log`
--

LOCK TABLES `task_log` WRITE;
/*!40000 ALTER TABLE `task_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_collect`
--

DROP TABLE IF EXISTS `travel_collect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `travel_collect` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `targetType` tinyint NOT NULL COMMENT '类型 1=景区 2=路线',
  `targetId` int NOT NULL COMMENT '目标ID',
  PRIMARY KEY (`id`),
  KEY `IDX_872f93cf3cfb8d9fd4968b8df4` (`createTime`),
  KEY `IDX_fcfebd31dd505df5940a71694d` (`updateTime`),
  KEY `IDX_c254188a430950c7da9ce6f16d` (`tenantId`),
  KEY `IDX_2a0d48cdf5aca3290feed76384` (`userId`),
  KEY `IDX_60229110b2bf8544ec20efd779` (`targetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_collect`
--

LOCK TABLES `travel_collect` WRITE;
/*!40000 ALTER TABLE `travel_collect` DISABLE KEYS */;
/*!40000 ALTER TABLE `travel_collect` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_e_ticket`
--

DROP TABLE IF EXISTS `travel_e_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `travel_e_ticket` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderNo` varchar(32) NOT NULL COMMENT '订单编号',
  `targetId` int NOT NULL COMMENT '票种/路线ID',
  `qrCode` varchar(200) DEFAULT NULL COMMENT '二维码',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态 0=未使用 1=已使用 2=已退款',
  `useDate` date DEFAULT NULL COMMENT '使用日期',
  `verifyTime` datetime DEFAULT NULL COMMENT '核销时间',
  PRIMARY KEY (`id`),
  KEY `IDX_bc5e19810feb0a4d8b73d161e0` (`createTime`),
  KEY `IDX_4d7f77183a7552095605573044` (`updateTime`),
  KEY `IDX_274db85ad3ea68c5933ed93203` (`tenantId`),
  KEY `IDX_8ea074519479871acec229e8ce` (`orderNo`),
  KEY `IDX_ee9cc18f642d60feb69ded3978` (`targetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_e_ticket`
--

LOCK TABLES `travel_e_ticket` WRITE;
/*!40000 ALTER TABLE `travel_e_ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `travel_e_ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_guide`
--

DROP TABLE IF EXISTS `travel_guide`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `travel_guide` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `departure` varchar(50) NOT NULL COMMENT '出发地',
  `transport` varchar(50) NOT NULL COMMENT '交通方式',
  `duration` varchar(50) NOT NULL COMMENT '时长',
  `cost` varchar(50) NOT NULL COMMENT '费用',
  `content` text NOT NULL COMMENT '详细说明',
  `images` json DEFAULT NULL COMMENT '攻略图',
  PRIMARY KEY (`id`),
  KEY `IDX_b695f990abb3d9610895bf80eb` (`createTime`),
  KEY `IDX_20791d1d4a917077b07a173d95` (`updateTime`),
  KEY `IDX_3b1030e8ccd35bc3626e672c9d` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_guide`
--

LOCK TABLES `travel_guide` WRITE;
/*!40000 ALTER TABLE `travel_guide` DISABLE KEYS */;
/*!40000 ALTER TABLE `travel_guide` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_review`
--

DROP TABLE IF EXISTS `travel_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `travel_review` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderId` int NOT NULL COMMENT '订单ID',
  `targetId` int NOT NULL COMMENT '景区/路线ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `rating` tinyint NOT NULL COMMENT '评分',
  `content` text COMMENT '评价内容',
  `images` json DEFAULT NULL COMMENT '图片列表',
  PRIMARY KEY (`id`),
  KEY `IDX_3717c790633656eb63d6b60264` (`createTime`),
  KEY `IDX_caf20e996d7c18e198115f674e` (`updateTime`),
  KEY `IDX_bf6fa4fe186bc46fd999552914` (`tenantId`),
  KEY `IDX_8550f6a41a77090fc7073a4fc1` (`orderId`),
  KEY `IDX_a739b01a51d335e1fb104d30f9` (`targetId`),
  KEY `IDX_05b8fe6f0b511d2e5b461631b3` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_review`
--

LOCK TABLES `travel_review` WRITE;
/*!40000 ALTER TABLE `travel_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `travel_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_route`
--

DROP TABLE IF EXISTS `travel_route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `travel_route` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `merchantId` int DEFAULT NULL COMMENT '商家ID',
  `title` varchar(100) NOT NULL COMMENT '路线标题',
  `mainImage` varchar(500) DEFAULT NULL COMMENT '主图',
  `days` tinyint NOT NULL COMMENT '行程天数',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `includes` text COMMENT '包含项目',
  `notes` text COMMENT '注意事项',
  `detailContent` text COMMENT '详情',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0=下架 1=上架',
  PRIMARY KEY (`id`),
  KEY `IDX_8f9626384dabf7f79a8331416f` (`createTime`),
  KEY `IDX_c2e9897c0706fa8ab2a64ea74e` (`updateTime`),
  KEY `IDX_a1d3038743d767cdd7703ec815` (`tenantId`),
  KEY `IDX_aefbddf7e8080eeaf434d8f020` (`merchantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_route`
--

LOCK TABLES `travel_route` WRITE;
/*!40000 ALTER TABLE `travel_route` DISABLE KEYS */;
/*!40000 ALTER TABLE `travel_route` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_route_day`
--

DROP TABLE IF EXISTS `travel_route_day`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `travel_route_day` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `routeId` int NOT NULL COMMENT '路线ID',
  `day` tinyint NOT NULL COMMENT '天数',
  `description` text NOT NULL COMMENT '行程描述',
  `spots` varchar(200) DEFAULT NULL COMMENT '景点',
  `meals` varchar(100) DEFAULT NULL COMMENT '用餐',
  `accommodation` varchar(100) DEFAULT NULL COMMENT '住宿',
  PRIMARY KEY (`id`),
  KEY `IDX_033bfb8ef5f65c65094b08b0b8` (`createTime`),
  KEY `IDX_b114cdc0ffe36bed20a173c716` (`updateTime`),
  KEY `IDX_d5b8fcc0d4b6972e5c0a1fa259` (`tenantId`),
  KEY `IDX_9486e4a8a083d17aa0a7b2c5ff` (`routeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_route_day`
--

LOCK TABLES `travel_route_day` WRITE;
/*!40000 ALTER TABLE `travel_route_day` DISABLE KEYS */;
/*!40000 ALTER TABLE `travel_route_day` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_scenic`
--

DROP TABLE IF EXISTS `travel_scenic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `travel_scenic` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `merchantId` int DEFAULT NULL COMMENT '商家ID',
  `name` varchar(100) NOT NULL COMMENT '景区名称',
  `address` varchar(200) NOT NULL COMMENT '地址',
  `mainImage` varchar(500) DEFAULT NULL COMMENT '主图',
  `description` text COMMENT '介绍',
  `openHours` varchar(100) DEFAULT NULL COMMENT '开放时间',
  `rating` decimal(3,2) NOT NULL DEFAULT '5.00' COMMENT '评分',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0=关闭 1=开放',
  PRIMARY KEY (`id`),
  KEY `IDX_8291da61875559d505ce58a1a3` (`createTime`),
  KEY `IDX_a9efbf2f7c2865db4ccb0216ad` (`updateTime`),
  KEY `IDX_9839a1c5e83c25f245e5a0f118` (`tenantId`),
  KEY `IDX_6b822ff40a2b9a6de52d684f21` (`merchantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_scenic`
--

LOCK TABLES `travel_scenic` WRITE;
/*!40000 ALTER TABLE `travel_scenic` DISABLE KEYS */;
/*!40000 ALTER TABLE `travel_scenic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_ticket_type`
--

DROP TABLE IF EXISTS `travel_ticket_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `travel_ticket_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `scenicId` int NOT NULL COMMENT '景区ID',
  `name` varchar(50) NOT NULL COMMENT '票种名称',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `stock` int NOT NULL DEFAULT '0' COMMENT '库存',
  `validityRule` varchar(100) DEFAULT NULL COMMENT '有效期规则',
  PRIMARY KEY (`id`),
  KEY `IDX_431ad19ebce97268de1a3278e8` (`createTime`),
  KEY `IDX_14a8536e61035563f0f16bd1d6` (`updateTime`),
  KEY `IDX_59a5648e489dfd8aa09ddc7d12` (`tenantId`),
  KEY `IDX_f50ce2bf1e8944dd99514e3c6c` (`scenicId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_ticket_type`
--

LOCK TABLES `travel_ticket_type` WRITE;
/*!40000 ALTER TABLE `travel_ticket_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `travel_ticket_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_address` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `contact` varchar(255) NOT NULL COMMENT '联系人',
  `phone` varchar(11) NOT NULL COMMENT '手机号',
  `province` varchar(255) NOT NULL COMMENT '省',
  `city` varchar(255) NOT NULL COMMENT '市',
  `district` varchar(255) NOT NULL COMMENT '区',
  `address` varchar(255) NOT NULL COMMENT '地址',
  `isDefault` tinyint NOT NULL DEFAULT '0' COMMENT '是否默认',
  PRIMARY KEY (`id`),
  KEY `IDX_144621f4f7bf21e72ed6972d85` (`createTime`),
  KEY `IDX_de647797f6286697bfe9527955` (`updateTime`),
  KEY `IDX_d93103979d4be73c3192163996` (`tenantId`),
  KEY `IDX_1abd8badc4a127b0f357d9ecbc` (`userId`),
  KEY `IDX_905be3a22a4dfda68da8e4200a` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `unionid` varchar(255) DEFAULT NULL COMMENT '登录唯一ID',
  `avatarUrl` varchar(255) DEFAULT NULL COMMENT '头像',
  `nickName` varchar(255) DEFAULT NULL COMMENT '昵称',
  `phone` varchar(255) DEFAULT NULL COMMENT '手机号',
  `gender` int NOT NULL DEFAULT '0' COMMENT '性别',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态',
  `loginType` int NOT NULL DEFAULT '0' COMMENT '登录方式',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `description` text COMMENT '介绍',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_6edeceee578056a2c1e493563a` (`unionid`),
  UNIQUE KEY `IDX_9234e7bac72991a93b172618e2` (`phone`),
  KEY `IDX_e6386e92c288d85dbc43ac53f7` (`createTime`),
  KEY `IDX_5271afbb87138d688b6220b589` (`updateTime`),
  KEY `IDX_7c8ea8d68808b77734df54ce32` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_wx`
--

DROP TABLE IF EXISTS `user_wx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_wx` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `unionid` varchar(255) DEFAULT NULL COMMENT '微信unionid',
  `openid` varchar(255) NOT NULL COMMENT '微信openid',
  `avatarUrl` varchar(255) DEFAULT NULL COMMENT '头像',
  `nickName` varchar(255) DEFAULT NULL COMMENT '昵称',
  `gender` int NOT NULL DEFAULT '0' COMMENT '性别 0-未知 1-男 2-女',
  `language` varchar(255) DEFAULT NULL COMMENT '语言',
  `city` varchar(255) DEFAULT NULL COMMENT '城市',
  `province` varchar(255) DEFAULT NULL COMMENT '省份',
  `country` varchar(255) DEFAULT NULL COMMENT '国家',
  `type` int NOT NULL DEFAULT '0' COMMENT '类型 0-小程序 1-公众号 2-H5 3-APP',
  PRIMARY KEY (`id`),
  KEY `IDX_e23b473abf5a6b00e44f3fd842` (`createTime`),
  KEY `IDX_049adb91204e94c1ede5e6dd23` (`updateTime`),
  KEY `IDX_f39f7e2dd63c906fcee61c50ad` (`tenantId`),
  KEY `IDX_d22b5fa040a01ec1b09e1e181e` (`unionid`),
  KEY `IDX_7946849febadd93cf81fc2b53f` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_wx`
--

LOCK TABLES `user_wx` WRITE;
/*!40000 ALTER TABLE `user_wx` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_wx` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-22 23:02:58
