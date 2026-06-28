SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `favorite`;
DROP TABLE IF EXISTS `product_image`;
DROP TABLE IF EXISTS `product_sku`;
DROP TABLE IF EXISTS `product`;
DROP TABLE IF EXISTS `product_category`;

CREATE TABLE `product_category` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类名称',
  `sortOrder` int NOT NULL DEFAULT '0' COMMENT '排序值',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-停用 1-启用',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `deleted` int NOT NULL DEFAULT '0' COMMENT '软删除 0-否 1-是',
  PRIMARY KEY (`id`),
  KEY `IDX_efb46307d87701bdd660ea36f1` (`createTime`),
  KEY `IDX_0d9b50aca4adf3411e7f434d9a` (`updateTime`),
  KEY `IDX_0a0cf25cd8232a154d1cce2641` (`tenantId`),
  KEY `IDX_96152d453aaea425b5afde3ae9` (`name`),
  KEY `IDX_deddf0932786693af8df3ba2e7` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `categoryId` int NOT NULL COMMENT '分类ID',
  `title` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品标题',
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '副标题',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '商品简介',
  `craftIntro` text COLLATE utf8mb4_unicode_ci COMMENT '工艺介绍',
  `inheritorName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '传承人姓名',
  `inheritorIntro` text COLLATE utf8mb4_unicode_ci COMMENT '传承人介绍',
  `minPrice` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '最低售价',
  `maxPrice` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '最高售价',
  `status` int NOT NULL DEFAULT '0' COMMENT '状态 0-下架 1-上架',
  `sortOrder` int NOT NULL DEFAULT '0' COMMENT '排序值',
  `deleted` int NOT NULL DEFAULT '0' COMMENT '软删除 0-否 1-是',
  PRIMARY KEY (`id`),
  KEY `IDX_b337971dcc056dc4f33b793b4b` (`createTime`),
  KEY `IDX_a11e5200288f7b16d0867450d3` (`updateTime`),
  KEY `IDX_08293ca31a601d3cd0228120bc` (`tenantId`),
  KEY `IDX_ff0c0301a95e517153df97f681` (`categoryId`),
  KEY `IDX_f7bf944ad9f1034110e8c2133a` (`title`),
  KEY `IDX_01286e06a0554cbb19375f0178` (`status`),
  KEY `IDX_233231c2f3ef7c0ec78667ec0d` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_sku` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `productId` int NOT NULL COMMENT '商品ID',
  `code` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SKU编码',
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SKU名称',
  `specs` json DEFAULT NULL COMMENT '规格描述',
  `salePrice` decimal(10,2) NOT NULL COMMENT '销售价',
  `originalPrice` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '原价',
  `stock` int NOT NULL DEFAULT '0' COMMENT '库存',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-停用 1-启用',
  `sortOrder` int NOT NULL DEFAULT '0' COMMENT '排序值',
  `deleted` int NOT NULL DEFAULT '0' COMMENT '软删除 0-否 1-是',
  PRIMARY KEY (`id`),
  KEY `IDX_333010cb899d20891e1fb096a7` (`createTime`),
  KEY `IDX_8cb115c6497c411a9b9189c6fb` (`updateTime`),
  KEY `IDX_505d4bf5fa042f7254adff9d6a` (`tenantId`),
  KEY `IDX_0833ab73f1447c11d5acd37cc2` (`productId`),
  KEY `IDX_a418937acd44d2f18fd872089b` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_image` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `productId` int NOT NULL COMMENT '商品ID',
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片地址',
  `isMain` int NOT NULL DEFAULT '0' COMMENT '是否主图 0-否 1-是',
  `sortOrder` int NOT NULL DEFAULT '0' COMMENT '排序值',
  `deleted` int NOT NULL DEFAULT '0' COMMENT '软删除 0-否 1-是',
  PRIMARY KEY (`id`),
  KEY `IDX_e014d9fb7895ae9cfc93cbe1db` (`createTime`),
  KEY `IDX_e554bca9a6a2d8d1c0facf8eab` (`updateTime`),
  KEY `IDX_3e45b57863ea737b74bd898084` (`tenantId`),
  KEY `IDX_40ca0cd115ef1ff35351bed8da` (`productId`),
  KEY `IDX_a3af0d6658b5b9dc7367325718` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `favorite` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `productId` int NOT NULL COMMENT '商品ID',
  `deleted` int NOT NULL DEFAULT '0' COMMENT '软删除 0-否 1-是',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_favorite_user_product_unique` (`userId`,`productId`),
  KEY `IDX_91a9c82a399ba1cbae8e5fb8de` (`createTime`),
  KEY `IDX_a4baf4e7b75e5f4bcbbb8d3e2d` (`updateTime`),
  KEY `IDX_fd7fbcabed207b9f7398802738` (`tenantId`),
  KEY `IDX_83b775fdebbe24c29b2b5831f2` (`userId`),
  KEY `IDX_b8e337759b77baa0a4055d1894` (`productId`),
  KEY `IDX_ea8bde853b0933751c31306524` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `favorite`;
DELETE FROM `product_image`;
DELETE FROM `product_sku`;
DELETE FROM `product`;
DELETE FROM `product_category`;

INSERT INTO `product_category`
  (`id`, `createTime`, `updateTime`, `tenantId`, `name`, `sortOrder`, `status`, `remark`, `deleted`)
VALUES
  (1, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, '刺绣服饰', 0, 1, 'AI整理后的课程作业数据', 0),
  (2, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, '扎染服饰', 1, 1, 'AI整理后的课程作业数据', 0),
  (3, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, '手工配饰', 2, 1, 'AI整理后的课程作业数据', 0);

INSERT INTO `product`
  (`id`, `createTime`, `updateTime`, `tenantId`, `categoryId`, `title`, `subtitle`, `description`, `craftIntro`, `inheritorName`, `inheritorIntro`, `minPrice`, `maxPrice`, `status`, `sortOrder`, `deleted`)
VALUES
  (101, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 1, '苗绣外套', '立体针法勾出山花纹样的短款外套', '以黑底面料承托彩线苗绣，版型利落好搭配，适合通勤、展演和节庆穿着，能一眼看出手工纹样的层次感。', '苗绣外套通常以棉麻或混纺底布作胎，先完成裁片定位，再用锁绣、平绣和贴布绣逐层叠加纹样。常见图案会借用山花、鸟羽、旋涡和藤蔓来表达吉祥寓意，针脚细密时能形成浮雕般的立体效果。成衣收尾前还要反复压整边线，保证袖口、门襟和肩部纹样在穿着时保持完整观感。', '杨秀兰', '杨秀兰长期在黔东南从事苗绣教学与样衣整理，擅长把传统纹样拆解成适合年轻穿着的服饰版型。她重视针法规范与色线搭配，也常带学生做旧衣再设计，让非遗工艺更贴近日常使用。', 299.00, 299.00, 1, 0, 0),
  (102, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 1, '苗绣披肩', '花卉纹样铺展肩面的轻暖手工披肩', '披肩以大面积绣花纹样呈现层次，披搭时能自然垂坠，既适合作为舞台点缀，也适合秋冬日常叠穿提升整体气质。', '刺绣披肩的制作重点在于大幅面构图和边缘收整。工匠先根据披肩长度排布主纹和辅纹，再以分段绣制的方式控制针脚疏密，避免布面过重。为了让披肩在披搭时更有流动感，边缘常用包边或暗缝固定，局部再加入流苏、滚边或压纹，让整件作品在展开和平铺时都保有完整装饰性。', '石月芬', '石月芬主做民族服饰与披肩绣品，熟悉大幅面绣片的构图节奏。她强调先定主纹再补细节的制作流程，作品常被用于节庆服饰和文创展示，也会带学员练习边角包缝和绣片整烫。', 239.00, 239.00, 1, 1, 0),
  (103, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 2, '扎染连衣裙', '蓝白晕染层层铺开的夏日感连衣裙', '以蓝白渐变扎染做视觉主调，裙身轻盈、图案不死板，适合拍照、出游与轻社交场景，既醒目又保留手作温度。', '扎染连衣裙的关键在于绑扎分区与上染节奏。面料会先预洗定型，再按裙片结构做折叠、缠线或夹板固定，让染液在松紧交界处自然形成晕染边界。多次浸染能让蓝白过渡更丰富，但每次都要控制停留时间和清洗顺序，避免色层浑浊。成衣拼接后还需再次整烫，保证纹样在裙身前后保持连贯。', '李青禾', '李青禾专注蓝染与扎染服饰开发，擅长把传统扎结方式转化成更适合连衣裙的纹样节奏。她重视色差控制和布料回缩率，经常带团队反复试版，让每件成衣都保留自然却不凌乱的染色层次。', 329.00, 329.00, 1, 2, 0),
  (104, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 2, '扎染围巾', '蓝靛过渡自然的轻薄围巾与披搭单品', '围巾色彩从深靛到浅白逐步过渡，卷绕佩戴或平铺拍摄都很好看，适合春秋通勤、旅行搭配和文创礼赠场景。', '扎染围巾比成衣更考验布面的染色均匀度。工匠会先根据围巾长度安排留白和深染区域，再通过卷扎、拧扎或折叠夹扎形成重复节奏。为了保留轻薄手感，染后清洗与晾晒必须更温和，既要把浮色洗净，又不能让纤维板结。最终成品通常还会进行软整处理，让围巾在系绕时更服帖。', '周染宁', '周染宁长期从事蓝染围巾和家居布艺制作，熟悉轻薄棉麻面料的扎染控制。她尤其看重颜色层次和边缘留白，经常用不同扎法做小样比较，再确定量产图案，保证每条围巾都带有稳定的手工辨识度。', 119.00, 119.00, 1, 3, 0),
  (105, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 1, '盘扣上衣', '斜襟盘扣点题的新中式亚麻感上衣', '保留中式斜襟和盘扣细节，版型宽松不挑身形，日常搭配半裙或长裤都很利落，适合新中式穿搭和展示场景。', '盘扣上衣的制作看似简洁，难点却集中在门襟结构和盘扣成型。布料裁片完成后，要先定位领口、胸襟与扣位，再以包条绕折、压缝和手工定型做出圆润服帖的盘扣。若面料偏软，还需要增加内衬或贴条来保证门襟挺度。最后通过整烫和手缝固定，让盘扣既能实用开合，也能成为整件上衣的视觉焦点。', '陈素锦', '陈素锦多年从事中式服装制作，擅长盘扣、斜襟和滚边工艺细节处理。她会把传统成衣结构拆解给学员练习，从一字扣到花型扣逐步进阶，也常参与新中式日常服饰的小批量打样。', 189.00, 189.00, 1, 4, 0),
  (106, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 3, '香包挂饰', '可悬挂可收纳香料的刺绣小香包挂饰', '小巧轻便，既能作为包挂和车挂，也适合节庆伴手礼。刺绣纹样清晰，配色温和，兼顾装饰感与传统手作气息。', '香包挂饰常用小块布料、棉线和填充香料手工制作，步骤虽短，但每个环节都很考验细致度。先裁出正反面形状并完成小面积绣样，再用暗缝或锁边收口，最后加入棉花、艾草或香料碎料，使香包既饱满又不显鼓胀。挂绳和穗子会在收尾阶段一并固定，保证悬挂时重心稳定、不易变形。', '吴佩芸', '吴佩芸长期做节令香包和布艺挂件，熟悉小件刺绣、填充和收口技巧。她常把传统纹样与现代配色结合，做出更适合文创礼品的挂饰样式，也会教授学生如何控制香料比例和挂绳牢度。', 79.00, 79.00, 1, 5, 0),
  (107, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 3, '绣花手提包', '花枝纹样醒目的复古风绣花手提包', '包身轮廓简洁，绣花细节集中在正面视觉区，既适合日常通勤，也适合作为非遗主题展示和拍照搭配单品。', '绣花手提包通常先完成包面绣片，再进入衬布复合、袋口加固和提手安装工序。因为包体需要承重，绣样布局不能只追求满绣效果，还要避开受力最重的折角和缝线位置。制作时会通过里布、棉衬和压线稳定包型，使绣面既能保持平整，也不容易因为反复开合而起皱变形。', '赵云岚', '赵云岚从事布包和绣片文创开发多年，擅长把传统花鸟纹样缩放到适合包袋正面的视觉比例。她很重视结构耐用性，常把衬布、提手和拉链牢度一起纳入打样标准，兼顾好看和实用。', 259.00, 259.00, 1, 6, 0),
  (108, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 3, '非遗布艺发饰', '带刺绣与织带细节的布艺发饰头带', '以布艺包覆发箍或头带结构，佩戴轻便不压头，适合节日造型、汉服新中式搭配和文创礼品场景，辨识度很高。', '布艺发饰看起来体量小，但很考验包布、定型和缝合精度。制作时要先确定发箍或头带骨架，再根据弧度裁布、覆棉和包边，局部可加入小型绣片、织带或盘花做装饰。因为佩戴会反复弯折，所有接缝都需要额外压线或手缝补强，保证发饰不易起皱、开胶或在头顶部位鼓起。', '何雨棠', '何雨棠擅长制作小型布艺配件，尤其重视佩戴舒适度和结构稳定性。她会把传统纹样简化成更适合头饰尺度的小元素，再结合织带和包边工艺，让作品既保有非遗气质，也更适合年轻用户日常搭配。', 59.00, 59.00, 1, 7, 0);

INSERT INTO `product_sku`
  (`id`, `createTime`, `updateTime`, `tenantId`, `productId`, `code`, `name`, `specs`, `salePrice`, `originalPrice`, `stock`, `status`, `sortOrder`, `deleted`)
VALUES
  (1001, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 101, 'SKU-MIAOXIUJACKET', '标准款', JSON_ARRAY('标准款'), 299.00, 369.00, 28, 1, 0, 0),
  (1002, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 102, 'SKU-MIAOXIUSHAWL', '标准款', JSON_ARRAY('标准款'), 239.00, 299.00, 35, 1, 0, 0),
  (1003, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 103, 'SKU-ZHARANDRESS', 'M码', JSON_ARRAY('M码'), 329.00, 399.00, 22, 1, 0, 0),
  (1004, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 104, 'SKU-ZHARANSCARF', '标准款', JSON_ARRAY('标准款'), 119.00, 169.00, 54, 1, 0, 0),
  (1005, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 105, 'SKU-PANKOUTOP', 'L码', JSON_ARRAY('L码'), 189.00, 249.00, 31, 1, 0, 0),
  (1006, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 106, 'SKU-XIANGBAOPENDANT', '标准款', JSON_ARRAY('标准款'), 79.00, 109.00, 68, 1, 0, 0),
  (1007, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 107, 'SKU-XIUHUAHANDBAG', '标准款', JSON_ARRAY('标准款'), 259.00, 329.00, 19, 1, 0, 0),
  (1008, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 108, 'SKU-BUYIHAIRACCESSORY', '标准款', JSON_ARRAY('标准款'), 59.00, 89.00, 73, 1, 0, 0);

INSERT INTO `product_image`
  (`id`, `createTime`, `updateTime`, `tenantId`, `productId`, `url`, `isMain`, `sortOrder`, `deleted`)
VALUES
  (2001, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 101, 'http://127.0.0.1:3000/heritage-products/miaoxiu-jacket/01.jpg', 1, 0, 0),
  (2002, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 101, 'http://127.0.0.1:3000/heritage-products/miaoxiu-jacket/02.jpg', 0, 1, 0),
  (2003, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 101, 'http://127.0.0.1:3000/heritage-products/miaoxiu-jacket/03.jpg', 0, 2, 0),
  (2004, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 102, 'http://127.0.0.1:3000/heritage-products/miaoxiu-shawl/01.jpg', 1, 0, 0),
  (2005, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 102, 'http://127.0.0.1:3000/heritage-products/miaoxiu-shawl/02.jpg', 0, 1, 0),
  (2006, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 102, 'http://127.0.0.1:3000/heritage-products/miaoxiu-shawl/03.jpg', 0, 2, 0),
  (2007, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 103, 'http://127.0.0.1:3000/heritage-products/zharan-dress/01.jpg', 1, 0, 0),
  (2008, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 103, 'http://127.0.0.1:3000/heritage-products/zharan-dress/02.jpg', 0, 1, 0),
  (2009, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 103, 'http://127.0.0.1:3000/heritage-products/zharan-dress/03.jpg', 0, 2, 0),
  (2010, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 104, 'http://127.0.0.1:3000/heritage-products/zharan-scarf/01.jpg', 1, 0, 0),
  (2011, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 104, 'http://127.0.0.1:3000/heritage-products/zharan-scarf/02.jpg', 0, 1, 0),
  (2012, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 104, 'http://127.0.0.1:3000/heritage-products/zharan-scarf/03.jpg', 0, 2, 0),
  (2013, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 105, 'http://127.0.0.1:3000/heritage-products/pankou-top/01.jpg', 1, 0, 0),
  (2014, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 105, 'http://127.0.0.1:3000/heritage-products/pankou-top/02.jpg', 0, 1, 0),
  (2015, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 105, 'http://127.0.0.1:3000/heritage-products/pankou-top/03.jpg', 0, 2, 0),
  (2016, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 106, 'http://127.0.0.1:3000/heritage-products/xiangbao-pendant/01.jpg', 1, 0, 0),
  (2017, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 106, 'http://127.0.0.1:3000/heritage-products/xiangbao-pendant/02.jpg', 0, 1, 0),
  (2018, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 106, 'http://127.0.0.1:3000/heritage-products/xiangbao-pendant/03.jpg', 0, 2, 0),
  (2019, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 107, 'http://127.0.0.1:3000/heritage-products/xiuhua-handbag/01.jpg', 1, 0, 0),
  (2020, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 107, 'http://127.0.0.1:3000/heritage-products/xiuhua-handbag/02.jpg', 0, 1, 0),
  (2021, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 107, 'http://127.0.0.1:3000/heritage-products/xiuhua-handbag/03.jpg', 0, 2, 0),
  (2022, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 108, 'http://127.0.0.1:3000/heritage-products/buyi-hair-accessory/01.jpg', 1, 0, 0),
  (2023, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 108, 'http://127.0.0.1:3000/heritage-products/buyi-hair-accessory/02.jpg', 0, 1, 0),
  (2024, '2026-06-19 20:00:00', '2026-06-19 20:00:00', NULL, 108, 'http://127.0.0.1:3000/heritage-products/buyi-hair-accessory/03.jpg', 0, 2, 0);

CREATE TABLE IF NOT EXISTS `user_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `unionid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '登录唯一ID',
  `avatarUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像',
  `nickName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `gender` int NOT NULL DEFAULT '0' COMMENT '性别',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态',
  `loginType` int NOT NULL DEFAULT '0' COMMENT '登录方式',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '密码',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '介绍',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_6edeceee578056a2c1e493563a` (`unionid`),
  UNIQUE KEY `IDX_9234e7bac72991a93b172618e2` (`phone`),
  KEY `IDX_e6386e92c288d85dbc43ac53f7` (`createTime`),
  KEY `IDX_5271afbb87138d688b6220b589` (`updateTime`),
  KEY `IDX_7c8ea8d68808b77734df54ce32` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user_info`
  (`id`, `createTime`, `updateTime`, `tenantId`, `unionid`, `avatarUrl`, `nickName`, `phone`, `gender`, `status`, `loginType`, `password`, `description`)
VALUES
  (1, '2026-06-18 00:00:00', '2026-06-18 00:00:00', NULL, 'wudong-smoke-user', NULL, '联调用户', '13800000000', 0, 1, 2, 'e10adc3949ba59abbe56e057f20f883e', '课程前端联调默认账号')
ON DUPLICATE KEY UPDATE
  `updateTime` = VALUES(`updateTime`),
  `nickName` = VALUES(`nickName`),
  `password` = VALUES(`password`),
  `status` = VALUES(`status`),
  `description` = VALUES(`description`);

SET FOREIGN_KEY_CHECKS = 1;
