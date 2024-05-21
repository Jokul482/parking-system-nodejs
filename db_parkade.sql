/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50520
 Source Host           : localhost:3306
 Source Schema         : db_parkade

 Target Server Type    : MySQL
 Target Server Version : 50520
 File Encoding         : 65001

 Date: 21/05/2024 23:33:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for access
-- ----------------------------
DROP TABLE IF EXISTS `access`;
CREATE TABLE `access`  (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `plateNumber` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `carNumber` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `area` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ownerName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `type` int(11) NULL DEFAULT NULL,
  `chargeHour` int(11) NULL DEFAULT NULL,
  `exittime` datetime NULL DEFAULT NULL,
  `leavingTime` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `duration` int(11) NULL DEFAULT 0,
  `amount` int(11) NULL DEFAULT 0,
  `status` int(11) NULL DEFAULT 2,
  `is_delete` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of access
-- ----------------------------
INSERT INTO `access` VALUES (1, '京A11111', 'A1', '1', '韩立', '13045624562', 1, 10, '2023-05-20 16:37:32', '2023-05-20 16:37:36', 1, 10, 1, '0');
INSERT INTO `access` VALUES (2, '京A22222', 'A2', '1', '历飞羽', '15012341234', 1, 10, '2023-05-20 16:38:33', NULL, 0, 0, 2, '0');

-- ----------------------------
-- Table structure for charge
-- ----------------------------
DROP TABLE IF EXISTS `charge`;
CREATE TABLE `charge`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `totalCharge` int(11) NULL DEFAULT NULL,
  `aTotalCharge` int(11) NULL DEFAULT NULL,
  `bTotalCharge` int(11) NULL DEFAULT NULL,
  `cTotalCharge` int(11) NULL DEFAULT NULL,
  `area` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `carNumber` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `type` int(11) NULL DEFAULT NULL,
  `parkQuantity` int(11) NULL DEFAULT NULL,
  `todayCharge` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of charge
-- ----------------------------
INSERT INTO `charge` VALUES (1, NULL, NULL, NULL, NULL, '1', 'A1', 1, 1, 10);
INSERT INTO `charge` VALUES (2, NULL, NULL, NULL, NULL, '1', 'A1', 1, 1, 10);

-- ----------------------------
-- Table structure for ev_users
-- ----------------------------
DROP TABLE IF EXISTS `ev_users`;
CREATE TABLE `ev_users`  (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `role_type` int(11) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `user_pic` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `is_delete` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ev_users
-- ----------------------------
INSERT INTO `ev_users` VALUES (1, 1, 'pt', '$2a$10$vTQsrulpFwZ5Yg4nMHk8fu1fZc3uwII8/IBznXeZZBO3fdVq6MtC6', '111', 'aaa@qq.com', NULL, '0');
INSERT INTO `ev_users` VALUES (2, 0, 'admin', '$2a$10$utb16NsKNXuNySTjWFAWbu/BtLM7U5ef90kGrf/wApSgOrYMsOrLe', NULL, NULL, 'data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=', '0');

-- ----------------------------
-- Table structure for vehicle
-- ----------------------------
DROP TABLE IF EXISTS `vehicle`;
CREATE TABLE `vehicle`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carNumber` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `area` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `chargeHour` int(11) NOT NULL,
  `remarks` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `type` tinyint(4) NULL DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `is_delete` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of vehicle
-- ----------------------------
INSERT INTO `vehicle` VALUES (1, 'A1', '1', 10, '', 1, 1, '0');
INSERT INTO `vehicle` VALUES (2, 'A2', '1', 10, '', 1, 2, '0');

SET FOREIGN_KEY_CHECKS = 1;
