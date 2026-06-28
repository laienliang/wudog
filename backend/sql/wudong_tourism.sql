/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80037 (8.0.37)
 Source Host           : localhost:3306
 Source Schema         : wudong_tourism

 Target Server Type    : MySQL
 Target Server Version : 80037 (8.0.37)
 File Encoding         : 65001

 Date: 26/06/2026 14:44:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for accommodation
-- ----------------------------
DROP TABLE IF EXISTS `accommodation`;
CREATE TABLE `accommodation`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `village_id` bigint UNSIGNED NOT NULL COMMENT '所属苗寨ID',
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '民宿名称',
  `type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'minsute' COMMENT '类型:minsute民宿 inn客栈 hotel酒店',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '民宿详情',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '详细地址',
  `longitude` decimal(10, 6) NULL DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10, 6) NULL DEFAULT NULL COMMENT '纬度',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '联系电话',
  `cover_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '封面图URL',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '图片列表(JSON)',
  `lowest_price` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '最低价格',
  `highest_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '最高价格',
  `rating` decimal(2, 1) NULL DEFAULT 5.0 COMMENT '评分',
  `review_count` int NOT NULL DEFAULT 0 COMMENT '评价数',
  `facilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '设施(JSON)',
  `house_rules` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '入住须知',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态:0下架 1上架',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '软删除:0未删 1已删',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_village_id`(`village_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '住宿/民宿表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of accommodation
-- ----------------------------
INSERT INTO `accommodation` VALUES (1, 1, '苗岭云宿', 'minsute', '苗寨山顶观景民宿，推窗见万家灯火。', '西江千户苗寨观景台旁', NULL, NULL, '/images/accommodation/a01.jpg', '[\"https://picsum.photos/seed/acc-miaoling-1/800/400\",\"https://picsum.photos/seed/acc-miaoling-2/800/400\",\"https://picsum.photos/seed/acc-miaoling-3/800/400\",\"https://picsum.photos/seed/acc-miaoling-4/800/400\",\"https://picsum.photos/seed/acc-miaoling-5/800/400\"]', 388.00, 888.00, 4.8, 126, NULL, NULL, 1, '2026-06-19 17:51:23', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (2, 1, '风雨桥客栈', 'inn', '风雨桥畔临水客栈，清晨可听溪流鸟鸣。', '西江千户苗寨风雨桥边', NULL, NULL, '/images/accommodation/a02.jpg', '[\"https://picsum.photos/seed/acc-fengyuqiao-1/800/400\",\"https://picsum.photos/seed/acc-fengyuqiao-2/800/400\",\"https://picsum.photos/seed/acc-fengyuqiao-3/800/400\",\"https://picsum.photos/seed/acc-fengyuqiao-4/800/400\",\"https://picsum.photos/seed/acc-fengyuqiao-5/800/400\"]', 258.00, 458.00, 4.6, 89, NULL, NULL, 1, '2026-06-19 17:51:23', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (3, 2, '侗寨山居', 'minsute', '鼓楼旁木楼民宿，体验侗族大歌文化。', '肇兴侗寨核心区', NULL, NULL, '/images/accommodation/a03.jpg', '[\"https://picsum.photos/seed/acc-dongzhai-1/800/400\",\"https://picsum.photos/seed/acc-dongzhai-2/800/400\",\"https://picsum.photos/seed/acc-dongzhai-3/800/400\",\"https://picsum.photos/seed/acc-dongzhai-4/800/400\",\"https://picsum.photos/seed/acc-dongzhai-5/800/400\"]', 298.00, 598.00, 4.7, 64, NULL, NULL, 1, '2026-06-19 17:51:23', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (4, 1, '观景台别院', 'minsute', '位于观景台核心区域，每间房均有独立阳台可观苗寨全景，提供苗族服饰体验和长桌宴预订。', '西江千户苗寨1号风雨桥上行300米', 108.174000, 26.498000, '/images/accommodation/a04.jpg', '[\"https://picsum.photos/seed/acc-guanjingtai-1/800/400\",\"https://picsum.photos/seed/acc-guanjingtai-2/800/400\",\"https://picsum.photos/seed/acc-guanjingtai-3/800/400\",\"https://picsum.photos/seed/acc-guanjingtai-4/800/400\",\"https://picsum.photos/seed/acc-guanjingtai-5/800/400\"]', 688.00, 1288.00, 4.9, 203, '[\"WiFi\",\"停车场\",\"接站服务\",\"苗族服饰体验\",\"长桌宴\",\"茶室\",\"观景台\"]', '入住14:00后 退房12:00前 | 禁止吸烟 | 可携带宠物（需预约） | 提供苗寨文化讲解服务', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (5, 1, '银饰坊客栈', 'inn', '苗族银饰匠人自家开的客栈，可亲手体验银饰制作，院子有百年银杏树。', '西江千户苗寨古街中段银饰坊旁', 108.173500, 26.497500, '/images/accommodation/a05.jpg', '[\"https://picsum.photos/seed/acc-yinshifang-1/800/400\",\"https://picsum.photos/seed/acc-yinshifang-2/800/400\",\"https://picsum.photos/seed/acc-yinshifang-3/800/400\",\"https://picsum.photos/seed/acc-yinshifang-4/800/400\",\"https://picsum.photos/seed/acc-yinshifang-5/800/400\"]', 328.00, 528.00, 4.7, 156, '[\"WiFi\",\"银饰制作体验\",\"小厨房\",\"花园\",\"洗衣服务\"]', '入住14:00后 退房12:00前 | 安静时段22:00-07:00 | 银饰工坊体验需提前预约（收费）', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (6, 2, '鼓楼人家', 'minsute', '紧邻侗寨鼓楼群，由侗族老匠人亲手打造的木楼民宿，可参加侗族大歌篝火晚会。', '肇兴侗寨仁团鼓楼旁', 109.173000, 26.074000, '/images/accommodation/a06.jpg', '[\"https://picsum.photos/seed/acc-gulourenjia-1/800/400\",\"https://picsum.photos/seed/acc-gulourenjia-2/800/400\",\"https://picsum.photos/seed/acc-gulourenjia-3/800/400\",\"https://picsum.photos/seed/acc-gulourenjia-4/800/400\",\"https://picsum.photos/seed/acc-gulourenjia-5/800/400\"]', 358.00, 658.00, 4.8, 112, '[\"WiFi\",\"停车场\",\"侗族大歌表演\",\"篝火晚会\",\"侗族美食DIY\"]', '入住14:00后 退房12:00前 | 木楼结构请注意防火 | 参加篝火晚会需提前报名', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (7, 2, '溪畔水阁', 'inn', '沿溪而建的水阁客栈，每间房推窗见水，夏日可垂钓戏水，冬日围炉煮茶。', '肇兴侗寨花桥下游100米', 109.171000, 26.072000, '/images/accommodation/a07.jpg', '[\"https://picsum.photos/seed/acc-xipanshuige-1/800/400\",\"https://picsum.photos/seed/acc-xipanshuige-2/800/400\",\"https://picsum.photos/seed/acc-xipanshuige-3/800/400\",\"https://picsum.photos/seed/acc-xipanshuige-4/800/400\",\"https://picsum.photos/seed/acc-xipanshuige-5/800/400\"]', 258.00, 398.00, 4.5, 78, '[\"WiFi\",\"垂钓\",\"烧烤区\",\"棋牌室\",\"茶室\"]', '入住14:00后 退房12:00前 | 溪边活动请注意安全 | 烧烤区使用需预约', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (8, 3, '朗德苗家小院', 'minsute', '郎德上寨核心区域，原汁原味苗族吊脚楼改造，可参与苗家打糍粑、酸汤鱼制作。', '郎德上寨芦笙场旁', 108.046000, 26.483000, '/images/accommodation/a08.jpg', '[\"https://picsum.photos/seed/acc-langdexiaoyuan-1/800/400\",\"https://picsum.photos/seed/acc-langdexiaoyuan-2/800/400\",\"https://picsum.photos/seed/acc-langdexiaoyuan-3/800/400\",\"https://picsum.photos/seed/acc-langdexiaoyuan-4/800/400\",\"https://picsum.photos/seed/acc-langdexiaoyuan-5/800/400\"]', 288.00, 488.00, 4.6, 58, '[\"WiFi\",\"停车场\",\"苗族美食体验\",\"芦笙表演\",\"农耕体验\"]', '入住14:00后 退房12:00前 | 吊脚楼木结构请轻声慢步 | 农耕体验需预约', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (9, 3, '上寨望山居', 'minsute', '位于郎德上寨半山腰，可俯瞰整个苗寨和梯田风光，环境清幽。', '郎德上寨后山腰', 108.047000, 26.484000, '/images/accommodation/a09.jpg', '[\"https://picsum.photos/seed/acc-wangshanju-1/800/400\",\"https://picsum.photos/seed/acc-wangshanju-2/800/400\",\"https://picsum.photos/seed/acc-wangshanju-3/800/400\",\"https://picsum.photos/seed/acc-wangshanju-4/800/400\",\"https://picsum.photos/seed/acc-wangshanju-5/800/400\"]', 388.00, 688.00, 4.4, 36, '[\"WiFi\",\"停车场\",\"观景台\",\"茶室\",\"图书馆\"]', '入住15:00后 退房11:00前 | 山路较陡请注意安全 | 不接待10岁以下儿童', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (10, 4, '岜沙部落民宿', 'minsute', '深入岜沙苗寨核心，感受中国最后一个枪手部落的神秘文化和独特生活方式。', '岜沙苗寨村口大树旁', 108.910000, 25.763000, '/images/accommodation/a10.jpg', '[\"https://picsum.photos/seed/acc-bashabuluo-1/800/400\",\"https://picsum.photos/seed/acc-bashabuluo-2/800/400\",\"https://picsum.photos/seed/acc-bashabuluo-3/800/400\",\"https://picsum.photos/seed/acc-bashabuluo-4/800/400\",\"https://picsum.photos/seed/acc-bashabuluo-5/800/400\"]', 358.00, 598.00, 4.7, 89, '[\"WiFi\",\"停车场\",\"枪手文化体验\",\"镰刀剃头表演\",\"苗族药浴\"]', '入住14:00后 退房12:00前 | 尊重当地传统文化习俗 | 未经允许勿拍摄持枪仪式', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (11, 4, '岜沙树屋', 'hotel', '建在古树之上的特色树屋，与自然融为一体，鸟语花香，别具一格。', '岜沙苗寨古树林区域', 108.911000, 25.761000, '/images/accommodation/a11.jpg', '[\"https://picsum.photos/seed/acc-bashashuwu-1/800/400\",\"https://picsum.photos/seed/acc-bashashuwu-2/800/400\",\"https://picsum.photos/seed/acc-bashashuwu-3/800/400\",\"https://picsum.photos/seed/acc-bashashuwu-4/800/400\",\"https://picsum.photos/seed/acc-bashashuwu-5/800/400\"]', 688.00, 988.00, 4.9, 42, '[\"WiFi\",\"树屋观景台\",\"森林徒步向导\",\"药浴SPA\",\"有机餐厅\"]', '入住15:00后 退房11:00前 | 树屋空间有限适用2人入住 | 禁止吸烟明火 | 不适合恐高者', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (12, 5, '舞阳河客栈', 'inn', '紧邻舞阳河畔，推窗即见千年古镇山水画卷，青石板路直达古街。', '镇远古镇舞阳河畔新大桥旁', 108.428000, 27.051000, '/images/accommodation/a12.jpg', '[\"https://picsum.photos/seed/acc-wuyanghe-1/800/400\",\"https://picsum.photos/seed/acc-wuyanghe-2/800/400\",\"https://picsum.photos/seed/acc-wuyanghe-3/800/400\",\"https://picsum.photos/seed/acc-wuyanghe-4/800/400\",\"https://picsum.photos/seed/acc-wuyanghe-5/800/400\"]', 258.00, 458.00, 4.6, 132, '[\"WiFi\",\"河景房\",\"停车场\",\"自行车租赁\",\"古镇地图\"]', '入住14:00后 退房12:00前 | 河畔区域请注意安全 | 提供古镇免费地图和游览建议', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (13, 5, '青龙洞精品酒店', 'hotel', '古镇核心区域精品酒店，紧邻青龙洞古建筑群，融合苗侗文化与现代设计。', '镇远古镇青龙洞景区入口旁', 108.429000, 27.052000, '/images/accommodation/a13.jpg', '[\"https://picsum.photos/seed/acc-qinglongdong-1/800/400\",\"https://picsum.photos/seed/acc-qinglongdong-2/800/400\",\"https://picsum.photos/seed/acc-qinglongdong-3/800/400\",\"https://picsum.photos/seed/acc-qinglongdong-4/800/400\",\"https://picsum.photos/seed/acc-qinglongdong-5/800/400\"]', 428.00, 888.00, 4.8, 198, '[\"WiFi\",\"停车场\",\"餐厅\",\"会议室\",\"健身房\",\"SPA\",\"景观泳池\"]', '入住14:00后 退房12:00前 | 酒店提供免费接站服务 | 会议室需提前预订 | 泳池开放时间09:00-22:00', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (14, 6, '梯田日出民宿', 'minsute', '面朝加榜梯田核心观景区的绝佳位置，清晨在房间即可欣赏日出云海翻涌梯田的壮美景观。', '加榜梯田核心观景台旁', 108.561000, 25.621000, '/images/accommodation/a14.jpg', '[\"https://picsum.photos/seed/acc-titian-14-1/800/400\",\"https://picsum.photos/seed/acc-titian-14-2/800/400\",\"https://picsum.photos/seed/acc-titian-14-3/800/400\",\"https://picsum.photos/seed/acc-titian-14-4/800/400\",\"https://picsum.photos/seed/acc-titian-14-5/800/400\"]', 328.00, 568.00, 4.8, 45, '[\"WiFi\",\"停车场\",\"摄影向导\",\"梯田徒步\",\"星空观测\"]', '入住14:00后 退房12:00前 | 日出观景最佳时段05:30-07:00 | 摄影向导需提前预约', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (15, 6, '田居山房', 'minsute', '梯田间的独栋小木屋，开门即是稻田，可以体验插秧、收割等农耕生活。', '加榜梯田田埂区域', 108.559000, 25.619000, '/images/accommodation/a15.jpg', '[\"https://picsum.photos/seed/acc-tianjushanfang-1/800/400\",\"https://picsum.photos/seed/acc-tianjushanfang-2/800/400\",\"https://picsum.photos/seed/acc-tianjushanfang-3/800/400\",\"https://picsum.photos/seed/acc-tianjushanfang-4/800/400\",\"https://picsum.photos/seed/acc-tianjushanfang-5/800/400\"]', 198.00, 358.00, 4.3, 28, '[\"WiFi\",\"农耕体验\",\"稻田餐厅\",\"篝火晚会\"]', '入住14:00后 退房12:00前 | 农耕体验请着便装 | 雨天田埂较滑注意安全 | 提供雨鞋', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (16, 7, '非遗文化民宿', 'minsute', '以苗族非遗文化为主题的民宿，每间房以不同非遗元素布置，可体验蜡染、刺绣、造纸。', '丹寨万达小镇非遗文化街', 107.824000, 26.205000, '/images/accommodation/a16.jpg', '[\"https://picsum.photos/seed/acc-feiyi-1/800/400\",\"https://picsum.photos/seed/acc-feiyi-2/800/400\",\"https://picsum.photos/seed/acc-feiyi-3/800/400\",\"https://picsum.photos/seed/acc-feiyi-4/800/400\",\"https://picsum.photos/seed/acc-feiyi-5/800/400\"]', 388.00, 688.00, 4.7, 86, '[\"WiFi\",\"停车场\",\"蜡染体验\",\"古法造纸\",\"苗族刺绣\",\"亲子乐园\"]', '入住14:00后 退房12:00前 | 非遗体验项目需提前预约 | 适合亲子家庭 | 提供儿童洗漱用品', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);
INSERT INTO `accommodation` VALUES (17, 7, '万达锦华酒店', 'hotel', '万达旗下高端酒店品牌，设施齐全，服务周到，紧邻小镇核心商圈。', '丹寨万达小镇中心广场', 107.823000, 26.204000, '/images/accommodation/a17.jpg', '[\"https://picsum.photos/seed/acc-wandajinhua-1/800/400\",\"https://picsum.photos/seed/acc-wandajinhua-2/800/400\",\"https://picsum.photos/seed/acc-wandajinhua-3/800/400\",\"https://picsum.photos/seed/acc-wandajinhua-4/800/400\",\"https://picsum.photos/seed/acc-wandajinhua-5/800/400\"]', 528.00, 1288.00, 4.6, 234, '[\"WiFi\",\"停车场\",\"中西餐厅\",\"健身房\",\"游泳池\",\"儿童乐园\",\"商务中心\"]', '入住14:00后 退房12:00前 | 酒店提供免费停车 | 游泳池需佩戴泳帽 | 自助早餐07:00-10:00', 1, '2026-06-22 18:04:31', '2026-06-25 15:14:03', 0);

-- ----------------------------
-- Table structure for miao_village
-- ----------------------------
DROP TABLE IF EXISTS `miao_village`;
CREATE TABLE `miao_village`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '苗寨名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '苗寨简介',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '详细地址',
  `longitude` decimal(10, 6) NULL DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10, 6) NULL DEFAULT NULL COMMENT '纬度',
  `cover_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '封面图URL',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '图片列表(JSON数组)',
  `ticket_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '门票价格',
  `open_time` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '开放时间',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态:0下架 1上架',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '软删除:0未删 1已删',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '苗寨/景区表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of miao_village
-- ----------------------------
INSERT INTO `miao_village` VALUES (1, '西江千户苗寨', '世界上最大的苗族聚居村寨，吊脚楼依山而建，夜景璀璨。', '贵州省黔东南州雷山县西江镇', NULL, NULL, '/images/village/v1-xijiang.jpg', NULL, 120.00, '08:00-22:00', 1, '2026-06-19 17:51:23', '2026-06-25 14:33:08', 0);
INSERT INTO `miao_village` VALUES (2, '肇兴侗寨', '侗族文化中心，鼓楼与风雨桥闻名遐迩。', '贵州省黔东南州黎平县肇兴乡', NULL, NULL, '/images/village/v2-zhaoxing.jpg', NULL, 80.00, '08:00-18:00', 1, '2026-06-19 17:51:23', '2026-06-25 14:33:08', 0);
INSERT INTO `miao_village` VALUES (3, '朗德上寨', '贵州省最早对外开放的苗族村寨之一，原生态苗寨风情浓郁，有\"中国民间艺术之乡\"美誉。', '贵州省黔东南州雷山县郎德镇', 108.046300, 26.482500, '/images/village/v3-langde.jpg', NULL, 60.00, '08:30-18:00', 1, '2026-06-22 18:04:31', '2026-06-25 14:33:08', 0);
INSERT INTO `miao_village` VALUES (4, '岜沙苗寨', '中国最后一个持枪部落，保留着独特的苗族文化和镰刀剃头习俗，被誉为苗族文化的活化石。', '贵州省黔东南州从江县丙妹镇', 108.910200, 25.762800, '/images/village/v4-basha.jpg', NULL, 80.00, '08:00-17:30', 1, '2026-06-22 18:04:31', '2026-06-25 14:33:08', 0);
INSERT INTO `miao_village` VALUES (5, '镇远古镇', '国家级历史文化名城，舞阳河畔的千年古镇，山水城浑然一体，有\"东方威尼斯\"之称。', '贵州省黔东南州镇远县', 108.427700, 27.050000, '/images/village/v5-zhenyuan.jpg', NULL, 0.00, '全天开放', 1, '2026-06-22 18:04:31', '2026-06-25 14:33:08', 0);
INSERT INTO `miao_village` VALUES (6, '加榜梯田', '中国最美梯田之一，苗族人民世代耕作的杰作，四季景观变幻，日出云海壮美。', '贵州省黔东南州从江县加榜乡', 108.560000, 25.620000, '/images/village/v6-jiabang.jpg', NULL, 0.00, '全天开放', 1, '2026-06-22 18:04:31', '2026-06-25 14:33:08', 0);
INSERT INTO `miao_village` VALUES (7, '丹寨万达小镇', '以苗族非遗文化为主题的特色小镇，集非遗体验、休闲度假、亲子研学于一体。', '贵州省黔东南州丹寨县', 107.823400, 26.204100, '/images/village/v7-danzhai.png', NULL, 0.00, '09:00-21:00', 1, '2026-06-22 18:04:31', '2026-06-25 14:33:08', 0);

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_no` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '订单编号',
  `user_id` bigint UNSIGNED NOT NULL COMMENT '用户ID',
  `accommodation_id` bigint UNSIGNED NOT NULL COMMENT '住宿ID',
  `room_id` bigint UNSIGNED NOT NULL COMMENT '房型ID',
  `check_in_date` date NOT NULL COMMENT '入住日期',
  `check_out_date` date NOT NULL COMMENT '退房日期',
  `nights` int NOT NULL DEFAULT 1 COMMENT '入住晚数',
  `guests` int NOT NULL DEFAULT 1 COMMENT '入住人数',
  `guest_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '入住人姓名',
  `guest_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '入住人手机',
  `total_price` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '订单总价',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态:0待支付 1已支付 2已取消 3已完成 4已退款',
  `cancel_policy` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '退订政策说明（预留字段）',
  `cancel_deadline` datetime NULL DEFAULT NULL COMMENT '最晚免费取消时间（预留字段）',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '软删除:0未删 1已删',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_order_no`(`order_no` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_accommodation_id`(`accommodation_id` ASC) USING BTREE,
  INDEX `idx_room_id`(`room_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '预订订单表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO `order` VALUES (1, 'WD20260701001', 3, 4, 5, '2026-07-15', '2026-07-17', 2, 2, '小明', '13600136000', 1776.00, '希望安排高楼层视野好的房间', 0, '入住前48小时可免费取消，逾期扣首晚房费', '2026-07-13 14:00:00', '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `order` VALUES (2, 'WD20260702002', 5, 14, 28, '2026-07-20', '2026-07-22', 2, 2, '小雨', '13800138001', 1136.00, '需要摄影向导服务', 0, '入住前72小时可免费取消', '2026-07-17 14:00:00', '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `order` VALUES (3, 'WD20260703003', 7, 13, 26, '2026-07-25', '2026-07-27', 2, 4, '张先生', '15000150000', 2576.00, '带两个小朋友，需要加床', 0, '入住前24小时可免费取消', '2026-07-24 14:00:00', '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `order` VALUES (4, 'WD20260601004', 1, 1, 1, '2026-07-01', '2026-07-03', 2, 2, '小王', '13800138000', 1176.00, NULL, 3, '入住前48小时可免费取消，逾期扣首晚房费', '2026-06-29 14:00:00', '2026-06-22 18:05:40', '2026-06-25 13:31:17', 0);
INSERT INTO `order` VALUES (5, 'WD20260602005', 4, 11, 21, '2026-07-02', '2026-07-04', 2, 2, '大刘', '13700137000', 1776.00, '蜜月旅行纪念', 1, '入住前72小时可免费取消', '2026-06-29 14:00:00', '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `order` VALUES (6, 'WD20260603006', 2, 2, 3, '2026-07-03', '2026-07-05', 2, 2, '小李', '13900139000', 716.00, NULL, 1, '入住前24小时可免费取消', '2026-07-01 14:00:00', '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `order` VALUES (7, 'WD20260604007', 6, 12, 23, '2026-07-08', '2026-07-11', 3, 2, '老陈', '13900139001', 1374.00, '年纪大了，希望安排低楼层', 1, '入住前72小时可免费取消', '2026-07-05 14:00:00', '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `order` VALUES (8, 'WD20260605008', 8, 16, 32, '2026-07-10', '2026-07-13', 3, 2, '李夫妇', '15100151000', 1764.00, '结婚纪念日，希望安排浪漫布置', 2, '入住前48小时可免费取消，逾期扣首晚房费', '2026-07-08 14:00:00', '2026-06-22 18:05:40', '2026-06-23 00:35:46', 0);
INSERT INTO `order` VALUES (9, 'WD20260501009', 3, 5, 8, '2026-07-05', '2026-07-06', 1, 2, '小明', '13600136000', 428.00, '临时改变行程', 2, '入住前48小时可免费取消', '2026-07-03 14:00:00', '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `order` VALUES (10, 'WD20260502010', 5, 16, 34, '2026-07-12', '2026-07-15', 3, 4, '小雨', '13800138001', 2064.00, '行程冲突取消', 2, '入住前72小时可免费取消', '2026-07-09 14:00:00', '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `order` VALUES (11, 'WD20260401011', 1, 1, 1, '2026-06-15', '2026-06-17', 2, 2, '小王', '13800138000', 1176.00, '非常棒的体验，下次还来！', 3, '入住前48小时可免费取消', '2026-06-13 14:00:00', '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `order` VALUES (12, 'WD20260402012', 2, 3, 4, '2026-06-18', '2026-06-20', 2, 2, '小李', '13900139000', 916.00, NULL, 3, '入住前48小时可免费取消', '2026-06-16 14:00:00', '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `order` VALUES (13, 'WD20260403013', 4, 6, 10, '2026-06-20', '2026-06-22', 2, 2, '大刘', '13700137000', 1116.00, '拍摄了大量侗寨夜景照片', 3, '入住前72小时可免费取消', '2026-06-17 14:00:00', '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `order` VALUES (14, 'WD20260405014', 6, 13, 25, '2026-06-22', '2026-06-24', 2, 2, '老陈', '13900139001', 1776.00, '天气原因航班取消无法出行', 4, '入住前72小时可免费取消', '2026-06-19 14:00:00', '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `order` VALUES (15, 'WD20260406015', 7, 10, 19, '2026-06-25', '2026-06-27', 2, 4, '张先生', '15000150000', 976.00, '孩子突然生病无法成行', 4, '入住前24小时可免费取消', '2026-06-24 14:00:00', '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `order` VALUES (16, 'WD1782146123018308', 1, 4, 6, '2026-06-23', '2026-06-25', 2, 2, 'Anthony', '13434663090', 1376.00, '', 1, NULL, NULL, '2026-06-23 00:35:23', '2026-06-23 00:35:42', 0);
INSERT INTO `order` VALUES (17, 'WD178236551636740', 1, 4, 6, '2026-06-25', '2026-06-26', 1, 2, 'ERIC', '13425335567', 688.00, '', 1, NULL, NULL, '2026-06-25 13:31:56', '2026-06-25 13:32:02', 0);

-- ----------------------------
-- Table structure for review
-- ----------------------------
DROP TABLE IF EXISTS `review`;
CREATE TABLE `review`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint UNSIGNED NOT NULL COMMENT '用户ID',
  `accommodation_id` bigint UNSIGNED NOT NULL COMMENT '住宿ID',
  `order_id` bigint UNSIGNED NULL DEFAULT NULL COMMENT '订单ID',
  `rating` tinyint NOT NULL DEFAULT 5 COMMENT '评分1-5',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '评价内容',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '评价图片(JSON)',
  `is_anonymous` tinyint NOT NULL DEFAULT 0 COMMENT '是否匿名:0否 1是',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态:0隐藏 1显示',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '软删除:0未删 1已删',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_accommodation_id`(`accommodation_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '评价表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of review
-- ----------------------------
INSERT INTO `review` VALUES (1, 1, 1, 11, 5, '苗岭云宿真的太棒了！房间正对千户苗寨，晚上万家灯火的景色美到窒息。民宿老板很热情，还帮我们安排了苗族服饰体验和长桌宴。推荐大家一定要订观景房！', NULL, 0, 1, '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `review` VALUES (2, 2, 3, 12, 4, '侗寨山居位置不错，就在鼓楼旁边。房间干净整洁，木楼结构很有特色。唯一不足是隔音稍差，能听到楼上走路声。总体性价比很高。', NULL, 0, 1, '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `review` VALUES (3, 4, 6, 13, 5, '作为一个摄影爱好者，鼓楼人家简直是我的理想驻地！清晨推开窗就能拍到晨雾中的鼓楼，侗族大歌篝火晚会也很震撼。下次一定带更多摄影朋友来！', NULL, 0, 1, '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `review` VALUES (4, 1, 1, NULL, 5, '已经是第二次住苗岭云宿了，品质一如既往的好。这次住了星空双床房，阳台看星星太浪漫了。早餐的酸汤粉也很地道！', NULL, 0, 1, '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `review` VALUES (5, 3, 2, NULL, 4, '风雨桥客栈价格实惠，位置就在风雨桥边上，听溪水声入睡很惬意。设施不算豪华但干净舒适，适合预算有限的旅行者。', NULL, 0, 1, '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `review` VALUES (6, 5, 4, NULL, 5, '观景台别院的云端全景房绝对值这个价格！180度全景落地窗，躺在床上就能看夜景。苗族服饰体验太出片了，朋友圈被赞爆！', NULL, 0, 1, '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `review` VALUES (7, 2, 3, NULL, 3, '住了两晚鼓楼景观房，位置是真好，鼓楼就在眼前。但晚上有游客在鼓楼广场放音乐到很晚，有点吵。跟民宿反映后态度很好，送了水果致歉。', NULL, 0, 1, '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `review` VALUES (8, 6, 5, NULL, 4, '银饰坊客栈的老银杏树太美了，坐在院子里喝茶看书非常惬意。还体验了银饰制作，虽然手艺不精但很有纪念意义。', NULL, 0, 1, '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `review` VALUES (9, 4, 1, NULL, 5, '第三次入住苗岭云宿，每次都有新发现。这次住了阁楼星空套房，天窗看星空特别浪漫。老板还升级了苗族文化讲解服务，了解到很多苗寨历史。', NULL, 0, 1, '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `review` VALUES (10, 6, 7, NULL, 3, '溪畔水阁环境不错，溪水声很治愈。但房间面积偏小，设施也比较基础。2楼水阁房的木地板走在上面吱呀响，年纪大了不太适应。', NULL, 1, 1, '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `review` VALUES (11, 8, 16, NULL, 5, '非遗文化民宿的蜡染主题房太有特色了！房间里的蜡染作品都是手工精品。还参加了蜡染体验课，亲手做了一块方巾带回家，超级有意义。强烈推荐给亲子家庭！', NULL, 0, 1, '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);
INSERT INTO `review` VALUES (12, 3, 11, NULL, 4, '岜沙树屋真的住在树上了！这个体验独一无二。早晨被鸟叫声叫醒，晚上看满天繁星。不过下雨天树屋会比较潮湿，建议带防潮衣物。', NULL, 0, 1, '2026-06-22 18:05:40', '2026-06-22 18:05:40', 0);

-- ----------------------------
-- Table structure for room
-- ----------------------------
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `accommodation_id` bigint UNSIGNED NOT NULL COMMENT '所属住宿ID',
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '房型名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '房型描述',
  `cover_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '封面图URL',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '图片列表(JSON)',
  `area` decimal(8, 2) NULL DEFAULT NULL COMMENT '面积(平方米)',
  `max_guests` int NOT NULL DEFAULT 2 COMMENT '最大入住人数',
  `bed_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '大床房' COMMENT '床型',
  `floor` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '楼层',
  `price` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '价格/晚',
  `stock` int NOT NULL DEFAULT 1 COMMENT '库存数量',
  `facilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '房间设施(JSON)',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态:0下架 1上架',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '软删除:0未删 1已删',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_accommodation_id`(`accommodation_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '房型表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of room
-- ----------------------------
INSERT INTO `room` VALUES (1, 1, '观景大床房', '全景落地窗，直面苗寨夜景', 'https://picsum.photos/seed/room-1-1/400/300', NULL, 28.00, 2, '1.8m大床', NULL, 588.00, 3, NULL, 1, '2026-06-19 17:51:23', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (2, 1, '星空双床房', '独立阳台，可观星赏月', 'https://picsum.photos/seed/room-2-2/400/300', NULL, 32.00, 3, '1.2m双床', NULL, 688.00, 2, NULL, 1, '2026-06-19 17:51:23', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (3, 2, '临水标准间', '推窗即见风雨桥', 'https://picsum.photos/seed/room-3-3/400/300', NULL, 22.00, 2, '1.2m双床', NULL, 358.00, 5, NULL, 1, '2026-06-19 17:51:23', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (4, 3, '鼓楼景观房', '木楼结构，鼓楼景观', 'https://picsum.photos/seed/room-4-4/400/300', NULL, 26.00, 2, '1.8m大床', NULL, 458.00, 4, NULL, 1, '2026-06-19 17:51:23', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (5, 4, '云端全景大床房', '180度全景落地窗，直面苗寨万家灯火，独立观景阳台。', 'https://picsum.photos/seed/room-5/400/300', NULL, 35.00, 2, '2.0m特大床', '3F', 888.00, 2, '[\"空调\",\"独立卫浴\",\"观景阳台\",\"智能马桶\",\"浴缸\",\"迷你吧\",\"55寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (6, 4, '庭院景观双床房', '带独立小庭院，种植兰花和盆景，静谧舒适。', 'https://picsum.photos/seed/room-6/400/300', NULL, 30.00, 3, '1.35m双床', '1F', 688.00, 3, '[\"空调\",\"独立卫浴\",\"庭院\",\"书桌\",\"茶具套装\",\"43寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (7, 4, '阁楼星空套房', '顶楼复式阁楼，天窗可观星空，独立客厅+卧室。', 'https://picsum.photos/seed/room-7/400/300', NULL, 50.00, 4, '1.8m大床+1.5m沙发床', '4F', 1288.00, 1, '[\"空调\",\"独立卫浴\",\"天窗\",\"客厅\",\"浴缸\",\"迷你吧\",\"65寸电视\",\"家庭影院\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (8, 5, '古树庭院大床房', '窗外即是百年银杏树，秋日金黄满院。', 'https://picsum.photos/seed/room-8/400/300', NULL, 22.00, 2, '1.8m大床', '1F', 428.00, 4, '[\"空调\",\"独立卫浴\",\"庭院景观\",\"书桌\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (9, 5, '银饰主题双床房', '房间以苗族银饰文化布置，床头摆放手工银饰作品可供欣赏。', 'https://picsum.photos/seed/room-9/400/300', NULL, 25.00, 2, '1.2m双床', '2F', 358.00, 5, '[\"空调\",\"独立卫浴\",\"银饰展示柜\",\"32寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (10, 6, '鼓楼全景大床房', '正对鼓楼群，可近距离感受侗寨鼓楼建筑之美。', 'https://picsum.photos/seed/room-10/400/300', NULL, 28.00, 2, '1.8m大床', '2F', 558.00, 3, '[\"空调\",\"独立卫浴\",\"鼓楼景观\",\"阳台\",\"43寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (11, 6, '侗族木楼双床房', '传统侗族木楼结构改造，原木清香四溢。', 'https://picsum.photos/seed/room-11/400/300', NULL, 26.00, 3, '1.35m双床', '1F', 458.00, 4, '[\"空调\",\"独立卫浴\",\"木结构\",\"书桌\",\"32寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (12, 6, '家庭大套房', '两室一厅格局，适合家庭出行，独立厨房。', 'https://picsum.photos/seed/room-12/400/300', NULL, 60.00, 6, '1.8m大床×2', '1-2F', 888.00, 1, '[\"空调\",\"独立卫浴\",\"客厅\",\"小厨房\",\"冰箱\",\"洗衣机\",\"55寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (13, 7, '临溪大床房', '推窗即是潺潺溪水，枕水而眠。', 'https://picsum.photos/seed/room-13/400/300', NULL, 20.00, 2, '1.8m大床', '1F', 338.00, 4, '[\"空调\",\"独立卫浴\",\"溪景\",\"32寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (14, 7, '水阁双床房', '半悬于溪面之上，水声潺潺伴入眠。', 'https://picsum.photos/seed/room-14/400/300', NULL, 22.00, 2, '1.2m双床', '2F', 298.00, 5, '[\"空调\",\"独立卫浴\",\"溪景\",\"阳台\",\"32寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (15, 8, '吊脚楼大床房', '正宗苗族吊脚楼木结构，保留原始风貌与现代舒适。', 'https://picsum.photos/seed/room-15/400/300', NULL, 22.00, 2, '1.8m大床', '2F', 388.00, 3, '[\"空调\",\"独立卫浴\",\"苗寨景观\",\"书桌\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (16, 8, '苗家通铺房', '传统苗家大火炕风格，适合朋友结伴入住，体验苗族群居文化。', 'https://picsum.photos/seed/room-16/400/300', NULL, 30.00, 4, '1.5m通铺', '1F', 328.00, 2, '[\"空调\",\"公共卫浴\",\"炕铺\",\"苗家火塘\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (17, 9, '望山大床房', '半山位置，推窗即见层层梯田和远山如黛。', 'https://picsum.photos/seed/room-17/400/300', NULL, 30.00, 2, '1.8m大床', '2F', 588.00, 2, '[\"空调\",\"独立卫浴\",\"梯田景观\",\"阳台\",\"书桌\",\"43寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (18, 9, '山景露台套房', '独立露台可观日出日落，独立客厅配茶室。', 'https://picsum.photos/seed/room-18/400/300', NULL, 48.00, 3, '1.8m大床+1.2m沙发床', '3F', 688.00, 1, '[\"空调\",\"独立卫浴\",\"露台\",\"客厅\",\"茶室\",\"浴缸\",\"55寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (19, 10, '部落景观大床房', '融入岜沙部落传统建筑风格，窗外即是原始森林。', 'https://picsum.photos/seed/room-19/400/300', NULL, 28.00, 2, '1.8m大床', '2F', 488.00, 3, '[\"空调\",\"独立卫浴\",\"森林景观\",\"阳台\",\"43寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (20, 10, '岜沙家庭房', '大空间家庭房，配有苗族传统手工艺品装饰。', 'https://picsum.photos/seed/room-20/400/300', NULL, 38.00, 4, '1.8m大床+1.2m双床', '1F', 598.00, 2, '[\"空调\",\"独立卫浴\",\"客厅区域\",\"儿童用品\",\"32寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (21, 11, '古树树屋', '建在百年古树上的树屋，自然与建筑的完美结合。', 'https://picsum.photos/seed/room-21/400/300', NULL, 16.00, 2, '1.5m圆床', '树上', 888.00, 2, '[\"空调\",\"独立卫浴\",\"树顶观景台\",\"吊床\",\"蓝牙音箱\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (22, 11, '森林树屋套房', '更大的树屋套房，配有室外藤椅和秋千。', 'https://picsum.photos/seed/room-22/400/300', NULL, 22.00, 2, '1.8m大床', '树上', 988.00, 1, '[\"空调\",\"独立卫浴\",\"室外秋千\",\"藤椅茶座\",\"吊床\",\"蓝牙音箱\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (23, 12, '河景大床房', '正对舞阳河，夜景灯光璀璨，古桥倒映水中。', 'https://picsum.photos/seed/room-23/400/300', NULL, 25.00, 2, '1.8m大床', '2-3F', 458.00, 5, '[\"空调\",\"独立卫浴\",\"河景\",\"阳台\",\"43寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (24, 12, '古镇庭院双床房', '带古镇风情小庭院，青石板铺地。', 'https://picsum.photos/seed/room-24/400/300', NULL, 28.00, 2, '1.2m双床', '1F', 358.00, 4, '[\"空调\",\"独立卫浴\",\"庭院\",\"书桌\",\"茶具\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (25, 13, '豪华河景房', '高层河景，一览镇远古镇山水画卷。', 'https://picsum.photos/seed/room-25/400/300', NULL, 35.00, 2, '1.8m大床', '5-8F', 888.00, 8, '[\"空调\",\"独立卫浴\",\"河景\",\"阳台\",\"浴缸\",\"智能马桶\",\"55寸电视\",\"迷你吧\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (26, 13, '行政套房', '独立会客厅+卧室，配有行政酒廊使用权限。', 'https://picsum.photos/seed/room-26/400/300', NULL, 55.00, 2, '2.0m特大床', '8F', 1288.00, 3, '[\"空调\",\"独立卫浴\",\"客厅\",\"行政酒廊\",\"浴缸\",\"智能马桶\",\"65寸电视\",\"迷你吧\",\"胶囊咖啡机\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (27, 13, '标准双床房', '舒适实用的双床房，性价比之选。', 'https://picsum.photos/seed/room-27/400/300', NULL, 28.00, 2, '1.2m双床', '2-4F', 428.00, 12, '[\"空调\",\"独立卫浴\",\"城市景观\",\"43寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (28, 14, '日出观景大床房', '正对梯田核心景观，躺在床上看日出云海。', 'https://picsum.photos/seed/room-28/400/300', NULL, 28.00, 2, '1.8m大床', '2F', 568.00, 2, '[\"空调\",\"独立卫浴\",\"梯田景观\",\"阳台\",\"43寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (29, 14, '梯田全景双床房', '两面落地窗，270度梯田全景。', 'https://picsum.photos/seed/room-29/400/300', NULL, 32.00, 3, '1.35m双床', '3F', 498.00, 3, '[\"空调\",\"独立卫浴\",\"全景窗\",\"阳台\",\"书桌\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (30, 15, '田埂木屋大床房', '稻田边的独栋小木屋，自然质朴。', 'https://picsum.photos/seed/room-30/400/300', NULL, 18.00, 2, '1.5m大床', '1F', 298.00, 3, '[\"风扇\",\"独立卫浴\",\"稻田景观\",\"藤椅\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (31, 15, '田园家庭木屋', '两间相连木屋，适合亲子农耕体验。', 'https://picsum.photos/seed/room-31/400/300', NULL, 35.00, 4, '1.8m大床+1.2m双床', '1F', 358.00, 2, '[\"空调\",\"独立卫浴\",\"小院子\",\"农耕工具\",\"儿童挖沙区\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (32, 16, '蜡染主题大床房', '以苗族蜡染艺术为主题装饰，每一件布草都是手工蜡染精品。', 'https://picsum.photos/seed/room-32/400/300', NULL, 28.00, 2, '1.8m大床', '2F', 588.00, 3, '[\"空调\",\"独立卫浴\",\"蜡染装饰\",\"书桌\",\"蜡染体验套装\",\"43寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (33, 16, '刺绣主题双床房', '苗族刺绣元素布置，床头绣品均为非遗传承人手工制作。', 'https://picsum.photos/seed/room-33/400/300', NULL, 26.00, 2, '1.2m双床', '2F', 498.00, 4, '[\"空调\",\"独立卫浴\",\"刺绣装饰\",\"书桌\",\"32寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (34, 16, '造纸主题家庭房', '以古法造纸为设计灵感，配有造纸体验角，适合亲子家庭。', 'https://picsum.photos/seed/room-34/400/300', NULL, 40.00, 4, '1.8m大床+1.2m上下铺', '1F', 688.00, 2, '[\"空调\",\"独立卫浴\",\"造纸体验区\",\"儿童乐园角\",\"55寸电视\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (35, 17, '高级大床房', '万达标准品质大床房，舒适温馨。', 'https://picsum.photos/seed/room-35/400/300', NULL, 32.00, 2, '1.8m大床', '3-8F', 688.00, 20, '[\"空调\",\"独立卫浴\",\"城市景观\",\"书桌\",\"43寸电视\",\"迷你吧\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);
INSERT INTO `room` VALUES (36, 17, '豪华套房', '独立客厅+卧室+衣帽间，高端入住体验。', 'https://picsum.photos/seed/room-36/400/300', NULL, 60.00, 2, '2.0m特大床', '8-10F', 1288.00, 5, '[\"空调\",\"独立卫浴\",\"客厅\",\"衣帽间\",\"浴缸\",\"智能马桶\",\"65寸电视\",\"迷你吧\",\"胶囊咖啡机\"]', 1, '2026-06-22 18:04:31', '2026-06-25 13:37:12', 0);

-- ----------------------------
-- Table structure for room_calendar
-- ----------------------------
DROP TABLE IF EXISTS `room_calendar`;
CREATE TABLE `room_calendar`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `room_id` bigint UNSIGNED NOT NULL COMMENT '房型ID',
  `accommodation_id` bigint UNSIGNED NOT NULL COMMENT '住宿ID（冗余，便于查询）',
  `date` date NOT NULL COMMENT '日期',
  `price` decimal(10, 2) NOT NULL COMMENT '当日价格/晚',
  `stock` int NOT NULL DEFAULT 0 COMMENT '当日可用库存',
  `is_closed` tinyint NOT NULL DEFAULT 0 COMMENT '是否关闭:0正常 1关闭',
  `remark` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '软删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_room_date`(`room_id` ASC, `date` ASC) USING BTREE,
  INDEX `idx_accommodation_date`(`accommodation_id` ASC, `date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 382 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '房态日历表（每日库存价格）' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of room_calendar
-- ----------------------------
INSERT INTO `room_calendar` VALUES (1, 5, 4, '2026-07-01', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (2, 5, 4, '2026-07-02', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (3, 5, 4, '2026-07-03', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (4, 5, 4, '2026-07-04', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (5, 5, 4, '2026-07-05', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (6, 5, 4, '2026-07-06', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (7, 5, 4, '2026-07-07', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (8, 5, 4, '2026-07-08', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (9, 5, 4, '2026-07-09', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (10, 5, 4, '2026-07-10', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (11, 5, 4, '2026-07-11', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (12, 5, 4, '2026-07-12', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (13, 5, 4, '2026-07-13', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (14, 5, 4, '2026-07-14', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (15, 5, 4, '2026-07-15', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (16, 5, 4, '2026-07-16', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (17, 5, 4, '2026-07-17', 1088.00, 1, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (18, 5, 4, '2026-07-18', 1088.00, 0, 1, '周末已满房', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (19, 5, 4, '2026-07-19', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (20, 5, 4, '2026-07-20', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (21, 5, 4, '2026-07-21', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (22, 5, 4, '2026-07-22', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (23, 5, 4, '2026-07-23', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (24, 5, 4, '2026-07-24', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (25, 5, 4, '2026-07-25', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (26, 5, 4, '2026-07-26', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (27, 5, 4, '2026-07-27', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (28, 5, 4, '2026-07-28', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (29, 5, 4, '2026-07-29', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (30, 5, 4, '2026-07-30', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (31, 5, 4, '2026-07-31', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (32, 5, 4, '2026-08-01', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (33, 5, 4, '2026-08-02', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (34, 5, 4, '2026-08-03', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (35, 5, 4, '2026-08-04', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (36, 5, 4, '2026-08-05', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (37, 5, 4, '2026-08-06', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (38, 5, 4, '2026-08-07', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (39, 5, 4, '2026-08-08', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (40, 5, 4, '2026-08-09', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (41, 5, 4, '2026-08-10', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (42, 5, 4, '2026-08-11', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (43, 5, 4, '2026-08-12', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (44, 5, 4, '2026-08-13', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (45, 5, 4, '2026-08-14', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (46, 5, 4, '2026-08-15', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (47, 5, 4, '2026-08-16', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (48, 5, 4, '2026-08-17', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (49, 5, 4, '2026-08-18', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (50, 5, 4, '2026-08-19', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (51, 5, 4, '2026-08-20', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (52, 5, 4, '2026-08-21', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (53, 5, 4, '2026-08-22', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (54, 5, 4, '2026-08-23', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (55, 5, 4, '2026-08-24', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (56, 5, 4, '2026-08-25', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (57, 5, 4, '2026-08-26', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (58, 5, 4, '2026-08-27', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (59, 5, 4, '2026-08-28', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (60, 5, 4, '2026-08-29', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (61, 10, 6, '2026-07-01', 558.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (62, 10, 6, '2026-07-02', 558.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (63, 10, 6, '2026-07-03', 658.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (64, 10, 6, '2026-07-04', 658.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (65, 10, 6, '2026-07-05', 558.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (66, 10, 6, '2026-07-06', 558.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (67, 10, 6, '2026-07-07', 558.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (68, 10, 6, '2026-07-08', 558.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (69, 10, 6, '2026-07-09', 558.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (70, 10, 6, '2026-07-10', 658.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (71, 10, 6, '2026-07-11', 658.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (72, 10, 6, '2026-07-12', 558.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (73, 10, 6, '2026-07-13', 558.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (74, 10, 6, '2026-07-14', 558.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (75, 10, 6, '2026-07-15', 558.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (76, 10, 6, '2026-07-16', 558.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (77, 10, 6, '2026-07-17', 658.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (78, 10, 6, '2026-07-18', 658.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (79, 10, 6, '2026-07-19', 558.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (80, 10, 6, '2026-07-20', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (81, 10, 6, '2026-07-21', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (82, 10, 6, '2026-07-22', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (83, 10, 6, '2026-07-23', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (84, 10, 6, '2026-07-24', 658.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (85, 10, 6, '2026-07-25', 658.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (86, 10, 6, '2026-07-26', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (87, 10, 6, '2026-07-27', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (88, 10, 6, '2026-07-28', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (89, 10, 6, '2026-07-29', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (90, 10, 6, '2026-07-30', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (91, 10, 6, '2026-07-31', 658.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (92, 10, 6, '2026-08-01', 658.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (93, 10, 6, '2026-08-02', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (94, 10, 6, '2026-08-03', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (95, 10, 6, '2026-08-04', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (96, 10, 6, '2026-08-05', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (97, 10, 6, '2026-08-06', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (98, 10, 6, '2026-08-07', 658.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (99, 10, 6, '2026-08-08', 658.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (100, 10, 6, '2026-08-09', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (101, 10, 6, '2026-08-10', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (102, 10, 6, '2026-08-11', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (103, 10, 6, '2026-08-12', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (104, 10, 6, '2026-08-13', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (105, 10, 6, '2026-08-14', 658.00, 1, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (106, 10, 6, '2026-08-15', 658.00, 1, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (107, 10, 6, '2026-08-16', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (108, 10, 6, '2026-08-17', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (109, 10, 6, '2026-08-18', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (110, 10, 6, '2026-08-19', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (111, 10, 6, '2026-08-20', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (112, 10, 6, '2026-08-21', 658.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (113, 10, 6, '2026-08-22', 658.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (114, 10, 6, '2026-08-23', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (115, 10, 6, '2026-08-24', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (116, 10, 6, '2026-08-25', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (117, 10, 6, '2026-08-26', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (118, 10, 6, '2026-08-27', 558.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (119, 10, 6, '2026-08-28', 658.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (120, 10, 6, '2026-08-29', 658.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (121, 21, 11, '2026-07-01', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (122, 21, 11, '2026-07-02', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (123, 21, 11, '2026-07-03', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (124, 21, 11, '2026-07-04', 1088.00, 0, 1, '周末已满房', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (125, 21, 11, '2026-07-05', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (126, 21, 11, '2026-07-06', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (127, 21, 11, '2026-07-07', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (128, 21, 11, '2026-07-08', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (129, 21, 11, '2026-07-09', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (130, 21, 11, '2026-07-10', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (131, 21, 11, '2026-07-11', 1088.00, 1, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (132, 21, 11, '2026-07-12', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (133, 21, 11, '2026-07-13', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (134, 21, 11, '2026-07-14', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (135, 21, 11, '2026-07-15', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (136, 21, 11, '2026-07-16', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (137, 21, 11, '2026-07-17', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (138, 21, 11, '2026-07-18', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (139, 21, 11, '2026-07-19', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (140, 21, 11, '2026-07-20', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (141, 21, 11, '2026-07-21', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (142, 21, 11, '2026-07-22', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (143, 21, 11, '2026-07-23', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (144, 21, 11, '2026-07-24', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (145, 21, 11, '2026-07-25', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (146, 21, 11, '2026-07-26', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (147, 21, 11, '2026-07-27', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (148, 21, 11, '2026-07-28', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (149, 21, 11, '2026-07-29', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (150, 21, 11, '2026-07-30', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (151, 21, 11, '2026-07-31', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (152, 21, 11, '2026-08-01', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (153, 21, 11, '2026-08-02', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (154, 21, 11, '2026-08-03', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (155, 21, 11, '2026-08-04', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (156, 21, 11, '2026-08-05', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (157, 21, 11, '2026-08-06', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (158, 21, 11, '2026-08-07', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (159, 21, 11, '2026-08-08', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (160, 21, 11, '2026-08-09', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (161, 21, 11, '2026-08-10', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (162, 21, 11, '2026-08-11', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (163, 21, 11, '2026-08-12', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (164, 21, 11, '2026-08-13', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (165, 21, 11, '2026-08-14', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (166, 21, 11, '2026-08-15', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (167, 21, 11, '2026-08-16', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (168, 21, 11, '2026-08-17', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (169, 21, 11, '2026-08-18', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (170, 21, 11, '2026-08-19', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (171, 21, 11, '2026-08-20', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (172, 21, 11, '2026-08-21', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (173, 21, 11, '2026-08-22', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (174, 21, 11, '2026-08-23', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (175, 21, 11, '2026-08-24', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (176, 21, 11, '2026-08-25', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (177, 21, 11, '2026-08-26', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (178, 21, 11, '2026-08-27', 888.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (179, 21, 11, '2026-08-28', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (180, 21, 11, '2026-08-29', 1088.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (181, 25, 13, '2026-07-01', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (182, 25, 13, '2026-07-02', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (183, 25, 13, '2026-07-03', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (184, 25, 13, '2026-07-04', 988.00, 7, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (185, 25, 13, '2026-07-05', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (186, 25, 13, '2026-07-06', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (187, 25, 13, '2026-07-07', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (188, 25, 13, '2026-07-08', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (189, 25, 13, '2026-07-09', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (190, 25, 13, '2026-07-10', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (191, 25, 13, '2026-07-11', 988.00, 6, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (192, 25, 13, '2026-07-12', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (193, 25, 13, '2026-07-13', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (194, 25, 13, '2026-07-14', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (195, 25, 13, '2026-07-15', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (196, 25, 13, '2026-07-16', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (197, 25, 13, '2026-07-17', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (198, 25, 13, '2026-07-18', 988.00, 5, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (199, 25, 13, '2026-07-19', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (200, 25, 13, '2026-07-20', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (201, 25, 13, '2026-07-21', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (202, 25, 13, '2026-07-22', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (203, 25, 13, '2026-07-23', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (204, 25, 13, '2026-07-24', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (205, 25, 13, '2026-07-25', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (206, 25, 13, '2026-07-26', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (207, 25, 13, '2026-07-27', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (208, 25, 13, '2026-07-28', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (209, 25, 13, '2026-07-29', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (210, 25, 13, '2026-07-30', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (211, 25, 13, '2026-07-31', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (212, 25, 13, '2026-08-01', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (213, 25, 13, '2026-08-02', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (214, 25, 13, '2026-08-03', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (215, 25, 13, '2026-08-04', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (216, 25, 13, '2026-08-05', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (217, 25, 13, '2026-08-06', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (218, 25, 13, '2026-08-07', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (219, 25, 13, '2026-08-08', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (220, 25, 13, '2026-08-09', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (221, 25, 13, '2026-08-10', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (222, 25, 13, '2026-08-11', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (223, 25, 13, '2026-08-12', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (224, 25, 13, '2026-08-13', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (225, 25, 13, '2026-08-14', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (226, 25, 13, '2026-08-15', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (227, 25, 13, '2026-08-16', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (228, 25, 13, '2026-08-17', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (229, 25, 13, '2026-08-18', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (230, 25, 13, '2026-08-19', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (231, 25, 13, '2026-08-20', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (232, 25, 13, '2026-08-21', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (233, 25, 13, '2026-08-22', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (234, 25, 13, '2026-08-23', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (235, 25, 13, '2026-08-24', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (236, 25, 13, '2026-08-25', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (237, 25, 13, '2026-08-26', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (238, 25, 13, '2026-08-27', 888.00, 8, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (239, 25, 13, '2026-08-28', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (240, 25, 13, '2026-08-29', 988.00, 8, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (241, 28, 14, '2026-07-01', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (242, 28, 14, '2026-07-02', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (243, 28, 14, '2026-07-03', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (244, 28, 14, '2026-07-04', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (245, 28, 14, '2026-07-05', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (246, 28, 14, '2026-07-06', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (247, 28, 14, '2026-07-07', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (248, 28, 14, '2026-07-08', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (249, 28, 14, '2026-07-09', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (250, 28, 14, '2026-07-10', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (251, 28, 14, '2026-07-11', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (252, 28, 14, '2026-07-12', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (253, 28, 14, '2026-07-13', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (254, 28, 14, '2026-07-14', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (255, 28, 14, '2026-07-15', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (256, 28, 14, '2026-07-16', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (257, 28, 14, '2026-07-17', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (258, 28, 14, '2026-07-18', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (259, 28, 14, '2026-07-19', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (260, 28, 14, '2026-07-20', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (261, 28, 14, '2026-07-21', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (262, 28, 14, '2026-07-22', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (263, 28, 14, '2026-07-23', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (264, 28, 14, '2026-07-24', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (265, 28, 14, '2026-07-25', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (266, 28, 14, '2026-07-26', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (267, 28, 14, '2026-07-27', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (268, 28, 14, '2026-07-28', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (269, 28, 14, '2026-07-29', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (270, 28, 14, '2026-07-30', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (271, 28, 14, '2026-07-31', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (272, 28, 14, '2026-08-01', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (273, 28, 14, '2026-08-02', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (274, 28, 14, '2026-08-03', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (275, 28, 14, '2026-08-04', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (276, 28, 14, '2026-08-05', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (277, 28, 14, '2026-08-06', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (278, 28, 14, '2026-08-07', 668.00, 1, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (279, 28, 14, '2026-08-08', 668.00, 1, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (280, 28, 14, '2026-08-09', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (281, 28, 14, '2026-08-10', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (282, 28, 14, '2026-08-11', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (283, 28, 14, '2026-08-12', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (284, 28, 14, '2026-08-13', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (285, 28, 14, '2026-08-14', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (286, 28, 14, '2026-08-15', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (287, 28, 14, '2026-08-16', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (288, 28, 14, '2026-08-17', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (289, 28, 14, '2026-08-18', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (290, 28, 14, '2026-08-19', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (291, 28, 14, '2026-08-20', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (292, 28, 14, '2026-08-21', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (293, 28, 14, '2026-08-22', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (294, 28, 14, '2026-08-23', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (295, 28, 14, '2026-08-24', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (296, 28, 14, '2026-08-25', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (297, 28, 14, '2026-08-26', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (298, 28, 14, '2026-08-27', 568.00, 2, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (299, 28, 14, '2026-08-28', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (300, 28, 14, '2026-08-29', 668.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (301, 32, 16, '2026-07-01', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (302, 32, 16, '2026-07-02', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (303, 32, 16, '2026-07-03', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (304, 32, 16, '2026-07-04', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (305, 32, 16, '2026-07-05', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (306, 32, 16, '2026-07-06', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (307, 32, 16, '2026-07-07', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (308, 32, 16, '2026-07-08', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (309, 32, 16, '2026-07-09', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (310, 32, 16, '2026-07-10', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (311, 32, 16, '2026-07-11', 688.00, 2, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (312, 32, 16, '2026-07-12', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (313, 32, 16, '2026-07-13', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (314, 32, 16, '2026-07-14', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (315, 32, 16, '2026-07-15', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (316, 32, 16, '2026-07-16', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (317, 32, 16, '2026-07-17', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (318, 32, 16, '2026-07-18', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (319, 32, 16, '2026-07-19', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (320, 32, 16, '2026-07-20', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (321, 32, 16, '2026-07-21', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (322, 32, 16, '2026-07-22', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (323, 32, 16, '2026-07-23', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (324, 32, 16, '2026-07-24', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (325, 32, 16, '2026-07-25', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (326, 32, 16, '2026-07-26', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (327, 32, 16, '2026-07-27', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (328, 32, 16, '2026-07-28', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (329, 32, 16, '2026-07-29', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (330, 32, 16, '2026-07-30', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (331, 32, 16, '2026-07-31', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (332, 32, 16, '2026-08-01', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (333, 32, 16, '2026-08-02', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (334, 32, 16, '2026-08-03', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (335, 32, 16, '2026-08-04', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (336, 32, 16, '2026-08-05', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (337, 32, 16, '2026-08-06', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (338, 32, 16, '2026-08-07', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (339, 32, 16, '2026-08-08', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (340, 32, 16, '2026-08-09', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (341, 32, 16, '2026-08-10', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (342, 32, 16, '2026-08-11', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (343, 32, 16, '2026-08-12', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (344, 32, 16, '2026-08-13', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (345, 32, 16, '2026-08-14', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (346, 32, 16, '2026-08-15', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (347, 32, 16, '2026-08-16', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (348, 32, 16, '2026-08-17', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (349, 32, 16, '2026-08-18', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (350, 32, 16, '2026-08-19', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (351, 32, 16, '2026-08-20', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (352, 32, 16, '2026-08-21', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (353, 32, 16, '2026-08-22', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (354, 32, 16, '2026-08-23', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (355, 32, 16, '2026-08-24', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (356, 32, 16, '2026-08-25', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (357, 32, 16, '2026-08-26', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (358, 32, 16, '2026-08-27', 588.00, 3, 0, NULL, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (359, 32, 16, '2026-08-28', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (360, 32, 16, '2026-08-29', 688.00, 3, 0, '周末加价', '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `room_calendar` VALUES (361, 6, 4, '2026-06-21', 688.00, 3, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (362, 6, 4, '2026-06-22', 688.00, 3, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (363, 6, 4, '2026-06-23', 688.00, 3, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (364, 6, 4, '2026-06-24', 688.00, 3, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (365, 6, 4, '2026-06-25', 688.00, 3, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (366, 6, 4, '2026-06-26', 688.00, 3, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (367, 6, 4, '2026-06-27', 688.00, 3, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (368, 5, 4, '2026-06-21', 888.00, 2, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (369, 5, 4, '2026-06-22', 888.00, 2, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (370, 5, 4, '2026-06-23', 888.00, 2, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (371, 5, 4, '2026-06-24', 888.00, 2, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (372, 5, 4, '2026-06-25', 888.00, 2, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (373, 5, 4, '2026-06-26', 888.00, 2, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (374, 5, 4, '2026-06-27', 888.00, 2, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (375, 7, 4, '2026-06-21', 1288.00, 1, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (376, 7, 4, '2026-06-22', 1288.00, 1, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (377, 7, 4, '2026-06-23', 1288.00, 1, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (378, 7, 4, '2026-06-24', 1288.00, 1, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (379, 7, 4, '2026-06-25', 1288.00, 1, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (380, 7, 4, '2026-06-26', 1288.00, 1, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);
INSERT INTO `room_calendar` VALUES (381, 7, 4, '2026-06-27', 1288.00, 1, 0, NULL, '2026-06-22 18:06:57', '2026-06-23 00:33:21', 0);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码(加密)',
  `nickname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '昵称',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像URL',
  `gender` tinyint NULL DEFAULT 0 COMMENT '性别:0未知 1男 2女',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态:0禁用 1启用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '软删除:0未删 1已删',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'tourist01', 'e10adc3949ba59abbe56e057f20f883e', '游客小王', '13800138000', NULL, 0, 1, '2026-06-19 17:51:23', '2026-06-19 17:51:23', 0);
INSERT INTO `user` VALUES (2, 'traveler02', 'e10adc3949ba59abbe56e057f20f883e', '旅人小李', '13900139000', NULL, 0, 1, '2026-06-19 17:51:23', '2026-06-19 17:51:23', 0);
INSERT INTO `user` VALUES (3, 'traveler_ming', 'e10adc3949ba59abbe56e057f20f883e', '背包客小明', '13600136000', '/avatars/ming.jpg', 1, 1, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `user` VALUES (4, 'photo_liu', 'e10adc3949ba59abbe56e057f20f883e', '摄影师大刘', '13700137000', '/avatars/liu.jpg', 1, 1, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `user` VALUES (5, 'artist_yu', 'e10adc3949ba59abbe56e057f20f883e', '文艺女青年小雨', '13800138001', '/avatars/yu.jpg', 2, 1, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `user` VALUES (6, 'retired_chen', 'e10adc3949ba59abbe56e057f20f883e', '退休教师老陈', '13900139001', '/avatars/chen.jpg', 1, 1, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `user` VALUES (7, 'family_zhang', 'e10adc3949ba59abbe56e057f20f883e', '张家一家人', '15000150000', '/avatars/zhang.jpg', 0, 1, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);
INSERT INTO `user` VALUES (8, 'couple_li', 'e10adc3949ba59abbe56e057f20f883e', '蜜月旅行小李夫妇', '15100151000', '/avatars/li_couple.jpg', 0, 1, '2026-06-22 18:04:31', '2026-06-22 18:04:31', 0);

SET FOREIGN_KEY_CHECKS = 1;
