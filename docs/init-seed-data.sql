-- ============================================================
-- 乌东系统 - 种子数据初始化脚本
-- 生成时间: 2026-06-23
-- 基于 wudong.sql 真实表结构编写
-- 注意: 所有 INSERT 不包含 id 字段（使用 AUTO_INCREMENT）
--       createTime/updateTime 使用 NOW()
--       tenantId 统一为 NULL（单租户）
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. 商户统一管理 (merchant)
-- ============================================================
INSERT INTO `merchant` (`createTime`, `updateTime`, `moduleType`, `shopName`, `contactName`, `contactPhone`, `status`) VALUES
(NOW(), NOW(), 1, '侗族非遗工坊', '杨秀琼', '13800001111', 1),
(NOW(), NOW(), 2, '乌东农家小院', '李大哥', '13800002222', 1),
(NOW(), NOW(), 2, '梯田稻花鱼庄', '韦阿水', '13800003333', 1),
(NOW(), NOW(), 2, '萨玛酸汤馆', '王萨玛', '13800004444', 1),
(NOW(), NOW(), 3, '乌东侗寨人家民宿', '杨阿妹', '13800005555', 1),
(NOW(), NOW(), 3, '梯田云舍', '龙小云', '13800006666', 1),
(NOW(), NOW(), 3, '萨玛小院', '吴萨玛', '13800007777', 1),
(NOW(), NOW(), 4, '乌东梯田景区管理处', '张主任', '13800008888', 1),
(NOW(), NOW(), 2, '乌东农产品合作社', '刘社长', '13800009999', 1);

SET @merchant_clothing = LAST_INSERT_ID();
SET @merchant_food_1 = @merchant_clothing + 1;
SET @merchant_food_2 = @merchant_clothing + 2;
SET @merchant_food_3 = @merchant_clothing + 3;
SET @merchant_hostel_1 = @merchant_food_3 + 1;
SET @merchant_hostel_2 = @merchant_hostel_1 + 1;
SET @merchant_hostel_3 = @merchant_hostel_2 + 1;
SET @merchant_scenic = @merchant_hostel_3 + 1;
SET @merchant_agri = @merchant_scenic + 1;

-- ============================================================
-- 2. 衣 - 分类 (clothing_category)
-- ============================================================
INSERT INTO `clothing_category` (`createTime`, `updateTime`, `parentId`, `name`, `icon`, `sort`, `status`) VALUES
(NOW(), NOW(), 0, '刺绣工艺', 'embroidery', 1, 1),
(NOW(), NOW(), 0, '编织工艺', 'weaving', 2, 1),
(NOW(), NOW(), 0, '陶艺瓷器', 'pottery', 3, 1),
(NOW(), NOW(), 0, '木雕工艺', 'woodcarving', 4, 1),
(NOW(), NOW(), 0, '染织工艺', 'dyeing', 5, 1),
(NOW(), NOW(), 0, '金属工艺', 'metalwork', 6, 1),
(NOW(), NOW(), 0, '纸艺工艺', 'paperart', 7, 1);

SET @cat_embroidery = LAST_INSERT_ID();
SET @cat_weaving = @cat_embroidery + 1;
SET @cat_pottery = @cat_weaving + 1;
SET @cat_woodcarving = @cat_pottery + 1;
SET @cat_dyeing = @cat_woodcarving + 1;
SET @cat_metalwork = @cat_dyeing + 1;
SET @cat_paperart = @cat_metalwork + 1;

-- ============================================================
-- 3. 衣 - 商品 (clothing_goods)
-- ============================================================
INSERT INTO `clothing_goods` (`createTime`, `updateTime`, `categoryId`, `merchantId`, `title`, `subtitle`, `mainImage`, `images`, `price`, `marketPrice`, `stock`, `sales`, `rating`, `craftIntro`, `inheritorName`, `detailContent`, `status`) VALUES
-- 刺绣工艺
(NOW(), NOW(), @cat_embroidery, @merchant_clothing, '苗族蜡染围巾', '手工植物染，传承百年技艺', 'clothing_goods_001.jpg', '["clothing_goods_001_1.jpg","clothing_goods_001_2.jpg"]', 298.00, 398.00, 156, 89, 4.9, '采用天然板蓝根植物染料，经手工蜡绘、染色、脱蜡等多道工序制成，每条围巾纹理独一无二。', '杨秀琼', '苗族蜡染已有千年历史，2006年被列入首批国家级非物质文化遗产名录。本围巾选用传统几何纹样，结合现代围巾尺寸设计，既可日常佩戴，也可作为收藏级工艺品。', 1),
(NOW(), NOW(), @cat_embroidery, @merchant_clothing, '苏绣团扇', '双面绣工艺，精美花卉图案', 'clothing_goods_002.jpg', '["clothing_goods_002_1.jpg"]', 568.00, 768.00, 45, 32, 5.0, '苏绣以精细雅洁著称，双面绣更是苏绣中的绝技，正反两面图案颜色一致，针法细腻。', '姚建萍', '苏绣已有2000多年历史，2006年列入国家级非物质文化遗产。双面绣团扇采用传统花卉图案，丝线分细至毛发的1/64，针脚细密均匀。', 1),
(NOW(), NOW(), @cat_embroidery, @merchant_clothing, '苗银胸针套装', '传统银饰工艺，民族风情', 'clothing_goods_003.jpg', '["clothing_goods_003_1.jpg"]', 888.00, 1088.00, 28, 15, 4.8, '苗银饰品采用传统錾刻工艺，花纹精细，具有浓郁的民族特色。套装包含胸针、耳环、手链三件套。', '石汉彪', '苗族银饰锻造技艺相传已有上千年历史，银匠用纯手工将银料打造成各种精美的饰品。', 1),

-- 编织工艺
(NOW(), NOW(), @cat_weaving, @merchant_clothing, '竹编收纳篮', '天然竹材，手工编织', 'clothing_goods_004.jpg', '["clothing_goods_004_1.jpg"]', 128.00, 168.00, 230, 156, 4.7, '选用当地优质毛竹，经劈篾、刮青、编织等多道工序，结实耐用，天然环保。', '刘泽英', '竹编工艺是中国传统手工技艺之一，本作品采用传统六角孔编织法，底部加固处理，适合家居收纳。', 1),
(NOW(), NOW(), @cat_weaving, @merchant_clothing, '草编拖鞋', '传统草编技艺，舒适透气', 'clothing_goods_005.jpg', '["clothing_goods_005_1.jpg"]', 68.00, 88.00, 500, 320, 4.5, '采用天然稻草手工编织，透气舒适，适合夏季居家穿着。', '张桂英', '草编拖鞋是侗族传统生活用品，每件作品均由手工编织，鞋底加厚处理，穿着舒适。', 1),

-- 陶艺瓷器
(NOW(), NOW(), @cat_pottery, @merchant_clothing, '建盏茶具套装', '兔毫纹，手工柴烧', 'clothing_goods_006.jpg', '["clothing_goods_006_1.jpg","clothing_goods_006_2.jpg"]', 1280.00, 1680.00, 18, 25, 5.0, '宋代名窑建盏复刻，采用传统柴烧工艺，釉面呈现自然兔毫纹路，每只盏的纹理都不同。', '陈国良', '建盏始于唐代，盛于宋代，是宋代斗茶文化的必备茶具。本套装包含6只建盏，每只均为独立烧制。', 1),
(NOW(), NOW(), @cat_pottery, @merchant_clothing, '紫砂壶', '宜兴原矿紫砂，手工拍打成型', 'clothing_goods_007.jpg', '["clothing_goods_007_1.jpg"]', 2680.00, 3280.00, 12, 8, 4.9, '选用宜兴黄龙山原矿紫砂泥料，全手工制作，壶身线条流畅，出水流畅。', '汪寅仙', '紫砂壶制作技艺始于明代，本作品采用传统拍打成型工艺，泥料陈腐半年以上，烧成后色泽温润。', 1),

-- 木雕工艺
(NOW(), NOW(), @cat_woodcarving, @merchant_clothing, '黄杨木雕刻摆件', '东阳木雕，山水意境', 'clothing_goods_008.jpg', '["clothing_goods_008_1.jpg"]', 3680.00, 4280.00, 5, 3, 4.8, '精选优质黄杨木，采用东阳木雕技法，浮雕山水画面，层次分明，意境深远。', '陆光正', '东阳木雕始于宋代，是中国四大木雕之一。本作品以传统山水画为题材，历时三个月手工雕刻而成。', 1),
(NOW(), NOW(), @cat_woodcarving, @merchant_clothing, '檀香木手串', '小叶紫檀，手工打磨', 'clothing_goods_009.jpg', '["clothing_goods_009_1.jpg"]', 588.00, 788.00, 88, 45, 4.6, '选用印度小叶紫檀，经多道打磨工序，手感温润，木纹清晰美观。', '王忠民', '小叶紫檀素有"木中之王"之称，密度高、油性足，长期盘玩会形成包浆，越盘越亮。', 1),

-- 染织工艺
(NOW(), NOW(), @cat_dyeing, @merchant_clothing, '侗布披肩', '手工靛蓝染，自然纹理', 'clothing_goods_010.jpg', '["clothing_goods_010_1.jpg"]', 398.00, 498.00, 75, 52, 4.8, '采用传统植物靛蓝染色，经多次浸染、氧化，色泽深邃自然，每条纹理独特。', '吴玉英', '侗布染织技艺是侗族传统工艺，染色过程需反复7-15次，每次氧化晾干，耗时约两周。', 1),
(NOW(), NOW(), @cat_dyeing, @merchant_clothing, '土家织锦腰带', '西兰卡普，传统图腾', 'clothing_goods_011.jpg', '["clothing_goods_011_1.jpg"]', 258.00, 328.00, 120, 88, 4.7, '土家族传统织锦"西兰卡普"工艺，采用彩色棉线织出传统图腾图案。', '彭秀菊', '土家织锦已有2000多年历史，2006年被列入国家级非物质文化遗产。图案寓意吉祥美好。', 1),

-- 金属工艺
(NOW(), NOW(), @cat_metalwork, @merchant_clothing, '银手镯（苗族款）', '手工錾刻，传统花纹', 'clothing_goods_012.jpg', '["clothing_goods_012_1.jpg"]', 1580.00, 1880.00, 22, 18, 4.9, '苗族传统银饰工艺，手工錾刻蝴蝶、花草等传统纹样，做工精细。', '龙胜军', '苗族银饰是苗族女性最重要的装饰品，蝴蝶纹是苗族图腾，象征生命起源。', 1),

-- 纸艺工艺
(NOW(), NOW(), @cat_paperart, @merchant_clothing, '剪纸装饰画', '传统窗花，精美装裱', 'clothing_goods_013.jpg', '["clothing_goods_013_1.jpg"]', 168.00, 218.00, 200, 135, 4.6, '传统剪纸工艺，以红色宣纸手工剪制，图案为花鸟鱼虫，装裱后可直接悬挂。', '库淑兰', '剪纸是中国最古老的民间艺术之一，本作品采用传统阴刻阳刻结合技法，图案生动。', 1);

-- ============================================================
-- 4. 衣 - SKU (clothing_goods_sku)
-- ============================================================
INSERT INTO `clothing_goods_sku` (`createTime`, `updateTime`, `goodsId`, `specName`, `price`, `stock`, `image`) VALUES
(NOW(), NOW(), 1, '蓝色植物纹', 298.00, 80, 'clothing_sku_001_blue.jpg'),
(NOW(), NOW(), 1, '白色几何纹', 298.00, 76, 'clothing_sku_001_white.jpg'),
(NOW(), NOW(), 6, '兔毫纹（单只）', 640.00, 9, 'clothing_sku_006_rabbit.jpg'),
(NOW(), NOW(), 6, '油滴纹（单只）', 640.00, 9, 'clothing_sku_006_oildrop.jpg');

-- ============================================================
-- 5. 衣 - 评价 (clothing_review)
-- ============================================================
INSERT INTO `clothing_review` (`createTime`, `updateTime`, `orderId`, `goodsId`, `userId`, `rating`, `content`, `images`, `reply`) VALUES
(NOW(), NOW(), 1001, 1, 101, 5, '围巾质感非常好，植物染料的颜色很自然，收到后很满意！', '["review_001_1.jpg"]', '感谢您的好评！我们会继续传承传统工艺～'),
(NOW(), NOW(), 1002, 1, 102, 4, '图案很漂亮，就是稍微有点硬，洗几次应该会好', NULL, '亲，植物染料天然特性，洗涤后会更加柔软哦～'),
(NOW(), NOW(), 1003, 2, 103, 5, '苏绣做工精细，双面绣太厉害了，送妈妈的礼物', '["review_002_1.jpg"]', ''),
(NOW(), NOW(), 1004, 6, 104, 5, '建盏的兔毫纹非常漂亮，每次喝茶都能感受到传统工艺的魅力', '["review_006_1.jpg"]', ''),
(NOW(), NOW(), 1005, 13, 105, 5, '剪纸装裱很精美，挂在客厅很有文化气息', NULL, ''),
(NOW(), NOW(), 1006, 4, 106, 4, '篮子编得很结实，尺寸比想象中大一些', NULL, ''),
(NOW(), NOW(), 1007, 10, 107, 5, '侗布的颜色太美了，每一条的纹理都不一样', '["review_010_1.jpg"]', ''),
(NOW(), NOW(), 1008, 12, 108, 5, '银手镯錾刻的花纹非常精致，重量也很足', NULL, '');

-- ============================================================
-- 6. 衣 - 收藏 (clothing_collect)
-- ============================================================
INSERT INTO `clothing_collect` (`createTime`, `userId`, `goodsId`) VALUES
(NOW(), 101, 1),
(NOW(), 102, 2),
(NOW(), 103, 6),
(NOW(), 104, 8),
(NOW(), 105, 10),
(NOW(), 101, 12),
(NOW(), 106, 3),
(NOW(), 107, 13);

-- ============================================================
-- 7. 食 - 农产品分类 (food_agriculture_category)
-- ============================================================
INSERT INTO `food_agriculture_category` (`createTime`, `updateTime`, `parentId`, `name`, `icon`, `sort`) VALUES
(NOW(), NOW(), 0, '新鲜水果', 'fruit', 1),
(NOW(), NOW(), 0, '蔬菜菌菇', 'vegetable', 2),
(NOW(), NOW(), 0, '粮油米面', 'grain', 3),
(NOW(), NOW(), 0, '禽蛋肉类', 'meat', 4),
(NOW(), NOW(), 0, '干货特产', 'dried', 5),
(NOW(), NOW(), 0, '茶叶饮品', 'tea', 6),
(NOW(), NOW(), 0, '蜂蜜蜜制品', 'honey', 7);

SET @agri_cat_fruit = LAST_INSERT_ID();
SET @agri_cat_veg = @agri_cat_fruit + 1;
SET @agri_cat_grain = @agri_cat_veg + 1;
SET @agri_cat_meat = @agri_cat_grain + 1;
SET @agri_cat_dried = @agri_cat_meat + 1;
SET @agri_cat_tea = @agri_cat_dried + 1;
SET @agri_cat_honey = @agri_cat_tea + 1;

-- ============================================================
-- 8. 食 - 餐厅 (food_restaurant)
-- ============================================================
INSERT INTO `food_restaurant` (`createTime`, `updateTime`, `merchantId`, `name`, `description`, `mainImage`, `address`, `businessHours`, `capacity`, `rating`, `status`) VALUES
(NOW(), NOW(), @merchant_food_1, '乌东农家小院', '正宗侗族风味，食材均来自当地农户，传承百年侗家菜谱', 'food_restaurant_01.jpg', '贵州省黔东南州从江县丙妹镇乌东村18号', '08:00-21:00', 80, 4.80, 1),
(NOW(), NOW(), @merchant_food_2, '梯田稻花鱼庄', '梯田稻花鱼为主打，生态养殖，现捞现做', 'food_restaurant_02.jpg', '贵州省黔东南州从江县加榜乡乌东梯田景区', '10:00-20:00', 60, 4.60, 1),
(NOW(), NOW(), @merchant_food_3, '萨玛酸汤馆', '百年老坛酸汤，侗族传统发酵工艺', 'food_restaurant_03.jpg', '贵州省黔东南州从江县丙妹镇鼓楼广场旁', '11:00-22:00', 45, 4.90, 1);

SET @rest_1 = LAST_INSERT_ID();
SET @rest_2 = @rest_1 + 1;
SET @rest_3 = @rest_2 + 1;

-- ============================================================
-- 9. 食 - 菜品 (food_dish)
-- ============================================================
INSERT INTO `food_dish` (`createTime`, `updateTime`, `restaurantId`, `name`, `mainImage`, `price`, `description`, `isSignature`, `sort`) VALUES
-- 乌东农家小院
(NOW(), NOW(), @rest_1, '侗家酸汤鱼', 'food_dish_01.jpg', 88.00, '精选本地稻花鱼，配以百年老坛酸汤，酸爽开胃', 1, 1),
(NOW(), NOW(), @rest_1, '禾花鱼炒腊肉', 'food_dish_02.jpg', 68.00, '梯田禾花鱼与农家烟熏腊肉同炒，鲜香四溢', 1, 2),
(NOW(), NOW(), @rest_1, '侗家腌鱼', NULL, 58.00, '传统侗家腌制工艺，酸辣可口', 0, 3),
(NOW(), NOW(), @rest_1, '糯米酒酿鸡', 'food_dish_04.jpg', 78.00, '本地糯米酒炖土鸡，滋补养生', 1, 4),
(NOW(), NOW(), @rest_1, '竹筒饭', 'food_dish_05.jpg', 18.00, '新鲜竹筒装入糯米蒸制，竹香四溢', 0, 5),
(NOW(), NOW(), @rest_1, '凉拌折耳根', NULL, 28.00, '本地新鲜折耳根拌辣椒醋，清爽开胃', 0, 6),
(NOW(), NOW(), @rest_1, '侗家豆花', NULL, 22.00, '手工石磨豆浆制成，嫩滑爽口', 0, 7),
(NOW(), NOW(), @rest_1, '梯田红米饭', NULL, 12.00, '本地红米，粗粮健康', 0, 8),
-- 梯田稻花鱼庄
(NOW(), NOW(), @rest_2, '清蒸稻花鱼', 'food_dish_09.jpg', 78.00, '现捞稻花鱼清蒸，肉质鲜嫩', 1, 1),
(NOW(), NOW(), @rest_2, '烤鱼配酸笋', 'food_dish_10.jpg', 68.00, '炭火烤鱼配本地酸笋，外焦里嫩', 1, 2),
(NOW(), NOW(), @rest_2, '稻田蛙炒辣椒', NULL, 58.00, '稻田生态蛙配本地小米辣', 0, 3),
(NOW(), NOW(), @rest_2, '鱼头豆腐汤', NULL, 48.00, '鱼头慢炖豆腐，汤白味鲜', 0, 4),
-- 萨玛酸汤馆
(NOW(), NOW(), @rest_3, '百年老坛酸汤牛腩', 'food_dish_13.jpg', 98.00, '百年老坛酸汤炖煮本地黄牛腩，肉质酥烂', 1, 1),
(NOW(), NOW(), @rest_3, '酸汤牛肉火锅', 'food_dish_14.jpg', 128.00, '酸汤锅底配现切牛肉，涮煮鲜香', 1, 2),
(NOW(), NOW(), @rest_3, '酸汤米粉', NULL, 28.00, '酸汤浇本地米粉，早餐首选', 0, 3),
(NOW(), NOW(), @rest_3, '酸汤鱼丸', NULL, 38.00, '手工鱼丸配酸汤，鲜美开胃', 0, 4);

-- ============================================================
-- 10. 食 - 农产品 (food_agriculture_goods)
-- ============================================================
INSERT INTO `food_agriculture_goods` (`createTime`, `updateTime`, `categoryId`, `merchantId`, `name`, `mainImage`, `price`, `specification`, `stock`, `origin`, `shelfLife`, `detailContent`, `status`) VALUES
(NOW(), NOW(), @agri_cat_fruit, @merchant_agri, '从江椪柑', 'food_agri_01.jpg', 38.00, '5斤装', 500, '贵州从江', '30天', '从江椪柑是国家地理标志产品，皮薄多汁，甜度适中', 1),
(NOW(), NOW(), @agri_cat_fruit, @merchant_agri, '黔东南蜜柚', 'food_agri_02.jpg', 28.00, '单果2斤+', 300, '贵州黔东南', '15天', '本地高山蜜柚，果肉饱满，清甜解渴', 1),
(NOW(), NOW(), @agri_cat_veg, @merchant_agri, '有机小米辣', 'food_agri_03.jpg', 15.00, '250g', 200, '贵州从江', '7天', '梯田生态种植，辣度适中，炒菜拌酱皆宜', 1),
(NOW(), NOW(), @agri_cat_grain, @merchant_agri, '乌东梯田大米', 'food_agri_04.jpg', 68.00, '10kg', 800, '贵州从江', '365天', '梯田稻花鱼共生大米，粒粒饱满，香气浓郁', 1),
(NOW(), NOW(), @agri_cat_meat, @merchant_agri, '散养土鸡蛋', 'food_agri_05.jpg', 48.00, '30枚', 150, '贵州从江', '30天', '山林散养土鸡所产，蛋黄橙红，营养丰富', 1),
(NOW(), NOW(), @agri_cat_dried, @merchant_agri, '侗家腊肉', 'food_agri_06.jpg', 88.00, '500g', 100, '贵州从江', '90天', '传统松木熏制，烟熏味浓郁，切片炒辣椒绝配', 1),
(NOW(), NOW(), @agri_cat_tea, @merchant_agri, '从江香禾糯茶', 'food_agri_07.jpg', 128.00, '100g', 80, '贵州从江', '730天', '梯田香禾糯搭配本地高山茶，清香回甘', 1),
(NOW(), NOW(), @agri_cat_honey, @merchant_agri, '野生槐花蜜', 'food_agri_08.jpg', 98.00, '500ml', 60, '贵州从江', '1095天', '深山野生槐花蜜，色泽清透，甜而不腻', 1);

-- ============================================================
-- 11. 食 - 用餐时段 (food_time_slot)
-- ============================================================
INSERT INTO `food_time_slot` (`createTime`, `updateTime`, `restaurantId`, `name`, `maxBookings`) VALUES
(NOW(), NOW(), @rest_1, '午市 11:00-14:00', 40),
(NOW(), NOW(), @rest_1, '晚市 17:00-21:00', 40),
(NOW(), NOW(), @rest_2, '午市 10:00-14:00', 30),
(NOW(), NOW(), @rest_2, '晚市 17:00-20:00', 30),
(NOW(), NOW(), @rest_3, '午餐 11:00-14:00', 25),
(NOW(), NOW(), @rest_3, '晚餐 17:00-22:00', 25);

-- ============================================================
-- 12. 食 - 评价 (food_review)
-- ============================================================
INSERT INTO `food_review` (`createTime`, `updateTime`, `restaurantId`, `goodsId`, `userId`, `rating`, `content`, `images`) VALUES
(NOW(), NOW(), @rest_1, NULL, 101, 5, '酸汤鱼太正宗了！味道浓郁，鱼肉鲜嫩，侗家风味十足', '["review_food_01.jpg"]'),
(NOW(), NOW(), @rest_1, NULL, 102, 5, '禾花鱼炒腊肉绝了，腊肉的烟熏味和鱼的鲜味完美融合', NULL),
(NOW(), NOW(), @rest_3, NULL, 103, 5, '酸汤牛腩太好吃了，百年老坛的味道就是不一样，强烈推荐！', '["review_food_03.jpg"]'),
(NOW(), NOW(), @rest_2, NULL, 104, 4, '稻花鱼很新鲜，清蒸做法保留了原汁原味', NULL),
(NOW(), NOW(), @rest_1, NULL, 105, 5, '竹筒饭特别香，糯米吸收了竹叶的清香，很有特色', NULL);

-- ============================================================
-- 13. 食 - 收藏 (food_collect)
-- ============================================================
INSERT INTO `food_collect` (`createTime`, `userId`, `targetType`, `targetId`) VALUES
(NOW(), 101, 1, @rest_1),
(NOW(), 102, 1, @rest_3),
(NOW(), 103, 1, @rest_2),
(NOW(), 104, 1, @rest_1),
(NOW(), 105, 1, @rest_3);

-- ============================================================
-- 14. 住 - 民宿 (lodging_hostel)
-- ============================================================
INSERT INTO `lodging_hostel` (`createTime`, `updateTime`, `merchantId`, `name`, `address`, `mainImage`, `images`, `description`, `rating`, `styleTags`, `facilityTags`, `status`) VALUES
(NOW(), NOW(), @merchant_hostel_1, '乌东侗寨人家', '贵州省黔东南州从江县丙妹镇乌东村鼓楼旁', 'hostel_01_main.jpg', '["hostel_01_1.jpg","hostel_01_2.jpg"]', '百年侗族吊脚楼改造，推窗可见梯田，体验最地道的侗家生活', 4.90, '侗族传统,木质吊脚楼,田园风光', '免费WiFi,停车场,厨房,洗衣机,空调', 1),
(NOW(), NOW(), @merchant_hostel_2, '梯田云舍', '贵州省黔东南州从江县加榜乡乌东梯田景区内', 'hostel_02_main.jpg', '["hostel_02_1.jpg","hostel_02_2.jpg"]', '梯田边的精品民宿，超大落地窗，日出云海尽收眼底', 4.70, '现代简约,自然景观,亲子友好', '免费WiFi,停车场,儿童乐园,厨房,地暖', 1),
(NOW(), NOW(), @merchant_hostel_3, '萨玛小院', '贵州省黔东南州从江县丙妹镇侗族文化街区', 'hostel_03_main.jpg', '["hostel_03_1.jpg"]', '侗族文化主题民宿，院内种满花草，夜晚可听大歌', 4.80, '文化体验,古朴典雅,庭院深深', '免费WiFi,停车场,茶室,厨房,烧烤', 1);

SET @hostel_1 = LAST_INSERT_ID();
SET @hostel_2 = @hostel_1 + 1;
SET @hostel_3 = @hostel_2 + 1;

-- ============================================================
-- 15. 住 - 房型 (lodging_room_type)
-- ============================================================
INSERT INTO `lodging_room_type` (`createTime`, `updateTime`, `hostelId`, `name`, `bedType`, `area`, `capacity`, `facilities`, `price`, `stock`, `mainImage`) VALUES
-- 乌东侗寨人家
(NOW(), NOW(), @hostel_1, '吊脚楼双人房', '大床1.8m', 35.0, 2, '独立卫浴,观景阳台,空调,WiFi', 388.00, 5, 'hostel_01_room1.jpg'),
(NOW(), NOW(), @hostel_1, '吊脚楼家庭房', '大床1.8m+单人1.2m', 50.0, 4, '独立卫浴,观景阳台,厨房,空调,WiFi', 588.00, 3, 'hostel_01_room2.jpg'),
(NOW(), NOW(), @hostel_1, '梯田景观房', '大床2.0m', 45.0, 2, '独立卫浴,270°落地窗,浴缸,空调,WiFi', 488.00, 2, 'hostel_01_room3.jpg'),
-- 梯田云舍
(NOW(), NOW(), @hostel_2, '云海大床房', '大床2.0m', 40.0, 2, '独立卫浴,飘窗,空调,WiFi', 458.00, 4, 'hostel_02_room1.jpg'),
(NOW(), NOW(), @hostel_2, '亲子套房', '双层床+大床', 60.0, 4, '独立卫浴,儿童区,厨房,空调,WiFi', 688.00, 2, 'hostel_02_room2.jpg'),
-- 萨玛小院
(NOW(), NOW(), @hostel_3, '古宅单间', '大床1.5m', 25.0, 2, '独立卫浴,空调,WiFi', 288.00, 6, 'hostel_03_room1.jpg'),
(NOW(), NOW(), @hostel_3, '庭院套房', '大床1.8m', 45.0, 2, '独立卫浴,庭院露台,浴缸,空调,WiFi', 428.00, 3, 'hostel_03_room2.jpg');

SET @room_1 = LAST_INSERT_ID() - 6;
SET @room_2 = @room_1 + 1;
SET @room_3 = @room_2 + 1;
SET @room_4 = @room_3 + 1;
SET @room_5 = @room_4 + 1;
SET @room_6 = @room_5 + 1;
SET @room_7 = @room_6 + 1;

-- ============================================================
-- 16. 住 - 房态日历 (lodging_calendar) - 示例：未来30天
-- ============================================================
INSERT INTO `lodging_calendar` (`createTime`, `updateTime`, `roomTypeId`, `date`, `availableStock`, `price`, `isAvailable`) VALUES
-- 房型1（吊脚楼双人房）- 未来30天
(NOW(), NOW(), @room_1, DATE_ADD(CURDATE(), INTERVAL 0 DAY), 5, 388.00, 1),
(NOW(), NOW(), @room_1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 5, 388.00, 1),
(NOW(), NOW(), @room_1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 5, 428.00, 1),
(NOW(), NOW(), @room_1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 5, 388.00, 1),
(NOW(), NOW(), @room_1, DATE_ADD(CURDATE(), INTERVAL 7 DAY), 5, 388.00, 1),
(NOW(), NOW(), @room_1, DATE_ADD(CURDATE(), INTERVAL 14 DAY), 5, 388.00, 1),
(NOW(), NOW(), @room_1, DATE_ADD(CURDATE(), INTERVAL 21 DAY), 5, 388.00, 1),
-- 房型4（云海大床房）
(NOW(), NOW(), @room_4, DATE_ADD(CURDATE(), INTERVAL 0 DAY), 4, 458.00, 1),
(NOW(), NOW(), @room_4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 4, 458.00, 1),
(NOW(), NOW(), @room_4, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 4, 498.00, 1),
(NOW(), NOW(), @room_4, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 4, 458.00, 1);

-- ============================================================
-- 17. 住 - 民宿政策 (lodging_hostel_policy)
-- ============================================================
INSERT INTO `lodging_hostel_policy` (`createTime`, `updateTime`, `hostelId`, `checkInTime`, `checkOutTime`, `petPolicy`, `includeBreakfast`, `deposit`) VALUES
(NOW(), NOW(), @hostel_1, '14:00', '12:00', '不可携带', 1, 500.00),
(NOW(), NOW(), @hostel_2, '15:00', '12:00', '可携带(需提前告知)', 1, 800.00),
(NOW(), NOW(), @hostel_3, '14:00', '11:00', '不可携带', 0, 300.00);

-- ============================================================
-- 18. 住 - 评价 (lodging_review)
-- ============================================================
INSERT INTO `lodging_review` (`createTime`, `updateTime`, `orderId`, `hostelId`, `userId`, `rating`, `content`, `images`, `reply`) VALUES
(NOW(), NOW(), 2001, @hostel_1, 101, 5, '吊脚楼太有感觉了！早上推开窗就是梯田和晨雾，晚上还能听到侗族大歌，体验满分！', '["review_hostel_01.jpg"]', '感谢支持，欢迎再来！'),
(NOW(), NOW(), 2002, @hostel_1, 102, 5, '老板娘做的酸汤鱼太好吃啦！房间干净舒适，观景阳台看日落绝美', NULL, ''),
(NOW(), NOW(), 2003, @hostel_2, 103, 4, '落地窗看云海确实震撼，就是山路有点绕，导航容易偏', NULL, '已为您更新导航指引，建议傍晚前到达哦～'),
(NOW(), NOW(), 2004, @hostel_3, 104, 5, '小院很安静，院子里的花开得特别好，泡茶看书一整天都很舒服', '["review_hostel_03.jpg"]', ''),
(NOW(), NOW(), 2005, @hostel_1, 105, 5, '家庭房空间很大，带孩子来体验侗族文化，小朋友玩得很开心', NULL, ''),
(NOW(), NOW(), 2006, @hostel_2, 106, 5, '亲子套房太棒了，孩子喜欢双层床，梯田边抓稻花鱼很有趣', NULL, '');

-- ============================================================
-- 19. 住 - 收藏 (lodging_collect)
-- ============================================================
INSERT INTO `lodging_collect` (`createTime`, `userId`, `hostelId`) VALUES
(NOW(), 101, @hostel_1),
(NOW(), 102, @hostel_2),
(NOW(), 103, @hostel_3),
(NOW(), 104, @hostel_1),
(NOW(), 105, @hostel_2),
(NOW(), 106, @hostel_3);

-- ============================================================
-- 20. 行 - 景点 (travel_scenic)
-- ============================================================
INSERT INTO `travel_scenic` (`createTime`, `updateTime`, `merchantId`, `name`, `address`, `mainImage`, `description`, `openHours`, `rating`, `status`) VALUES
(NOW(), NOW(), @merchant_scenic, '乌东梯田景区', '贵州省黔东南州从江县加榜乡乌东村', 'scenic_01_main.jpg', '千年梯田，世界文化遗产预备名单，最佳观赏期为5-10月灌水期和9-10月丰收季', '全天开放', 4.90, 1),
(NOW(), NOW(), @merchant_scenic, '侗族鼓楼', '贵州省黔东南州从江县丙妹镇乌东村', 'scenic_02_main.jpg', '侗族标志性建筑，不用一钉一铆，全木结构，内有侗族文化展览', '08:00-22:00', 4.70, 1),
(NOW(), NOW(), @merchant_scenic, '萨玛神殿', '贵州省黔东南州从江县丙妹镇侗族文化街区', 'scenic_03_main.jpg', '供奉侗族萨玛女神的神殿，每年农历三月初三举行萨玛节祭祀活动', '09:00-18:00', 4.50, 1),
(NOW(), NOW(), @merchant_scenic, '月亮山古道', '贵州省黔东南州从江县加榜乡至月亮山镇', 'scenic_04_main.jpg', '千年马帮古道，沿途梯田、峡谷、原始森林，徒步绝佳路线', '全天开放', 4.60, 1);

SET @scenic_1 = LAST_INSERT_ID();
SET @scenic_2 = @scenic_1 + 1;
SET @scenic_3 = @scenic_2 + 1;
SET @scenic_4 = @scenic_3 + 1;

-- ============================================================
-- 21. 行 - 票务 (travel_ticket_type)
-- ============================================================
INSERT INTO `travel_ticket_type` (`createTime`, `updateTime`, `scenicId`, `name`, `price`, `stock`, `validityRule`) VALUES
-- 梯田景区
(NOW(), NOW(), @scenic_1, '成人门票', 60.00, 500, '当日有效'),
(NOW(), NOW(), @scenic_1, '学生/老人票', 30.00, 200, '当日有效'),
(NOW(), NOW(), @scenic_1, '观光车票', 20.00, 300, '当日有效'),
(NOW(), NOW(), @scenic_1, '套票(门票+车票)', 75.00, 400, '当日有效'),
-- 鼓楼
(NOW(), NOW(), @scenic_2, '成人门票', 20.00, 200, '当日有效'),
(NOW(), NOW(), @scenic_2, '讲解服务', 50.00, 50, '约1小时');

-- ============================================================
-- 22. 行 - 旅行路线 (travel_route)
-- ============================================================
INSERT INTO `travel_route` (`createTime`, `updateTime`, `merchantId`, `title`, `mainImage`, `days`, `price`, `includes`, `notes`, `detailContent`, `status`) VALUES
(NOW(), NOW(), @merchant_scenic, '乌东梯田三日游', 'travel_route_01.jpg', 3, 888.00, '住宿3晚、早餐+2正餐、景区门票、观光车、导游服务', '建议穿舒适徒步鞋，5-10月为最佳旅游季节', '第一天：抵达从江，乘车前往乌东梯田，入住侗寨人家。第二天：清晨梯田摄影，午后侗寨文化体验。第三天：月亮山古道徒步，下午返程。', 1),
(NOW(), NOW(), @merchant_scenic, '黔东南两日深度游', 'travel_route_02.jpg', 2, 688.00, '住宿1晚、全程餐饮、导游服务、门票', '适合周末出行，体力要求中等', '第一天：侗族鼓楼参观+文化展览+侗族大歌表演。第二天：月亮山古道轻徒步+梯田下午茶。', 1),
(NOW(), NOW(), @merchant_scenic, '一日梯田漫步', 'travel_route_03.jpg', 1, 288.00, '早餐+午餐、观光车、导游服务', '当天往返，无需住宿', '清晨抵达梯田，沿栈道漫步，中午农家午餐，下午观看侗族大歌表演后返程。', 1);

SET @route_1 = LAST_INSERT_ID();
SET @route_2 = @route_1 + 1;
SET @route_3 = @route_2 + 1;

-- ============================================================
-- 23. 行 - 每日行程 (travel_route_day)
-- ============================================================
INSERT INTO `travel_route_day` (`createTime`, `updateTime`, `routeId`, `day`, `description`, `spots`, `meals`, `accommodation`) VALUES
(NOW(), NOW(), @route_1, 1, '抵达从江，乘车前往乌东梯田', '梯田景区', '农家接风宴', '乌东侗寨人家'),
(NOW(), NOW(), @route_1, 2, '清晨梯田摄影，午后侗寨文化体验', '梯田+鼓楼', '侗家特色午餐+晚餐', '乌东侗寨人家'),
(NOW(), NOW(), @route_1, 3, '月亮山古道徒步，下午返程', '月亮山古道', '山野简餐', ''),
(NOW(), NOW(), @route_2, 1, '侗族鼓楼参观+文化展览+侗族大歌', '鼓楼+萨玛神殿', '酸汤宴', '萨玛小院'),
(NOW(), NOW(), @route_2, 2, '月亮山古道轻徒步+梯田下午茶', '月亮山+梯田', '山野午餐+下午茶', '');

-- ============================================================
-- 24. 行 - 攻略 (travel_guide)
-- ============================================================
INSERT INTO `travel_guide` (`createTime`, `updateTime`, `title`, `departure`, `transport`, `duration`, `cost`, `content`, `images`) VALUES
(NOW(), NOW(), '乌东梯田最佳观赏季节与穿搭指南', '全国', '高铁到从江站+包车', '3-5天', '¥1000-3000', '最佳观赏期：5-6月灌水期如镜面、9-10月金黄收割季。穿搭建议：舒适徒步鞋、防晒帽、薄外套（早晚温差大）、深色衣物（梯田拍照更出片）', '["guide_01_1.jpg"]'),
(NOW(), NOW(), '侗族大歌体验全攻略', '贵阳/凯里', '自驾或班车', '2-3天', '¥500-1500', '侗族大歌是世界非物质文化遗产，最佳体验时间为傍晚，鼓楼下围坐聆听。三月三萨玛节期间可参与祭祀仪式，感受最纯正的侗族文化', '["guide_02_1.jpg"]'),
(NOW(), NOW(), '梯田徒步路线推荐', '从江县城', '包车/自驾', '1-2天', '¥300-800', '推荐路线：乌东村→加榜乡→月亮山，全程约15公里，途经三个侗族寨子，沿途梯田景观层次丰富，适合中等体力水平', '["guide_03_1.jpg"]');

-- ============================================================
-- 25. 行 - 评价 (travel_review)
-- ============================================================
INSERT INTO `travel_review` (`createTime`, `updateTime`, `orderId`, `targetId`, `userId`, `rating`, `content`, `images`) VALUES
(NOW(), NOW(), 3001, @scenic_1, 101, 5, '梯田太壮观了！清晨的云海配上晨雾中的村庄，随手一拍都是大片', '["review_travel_01.jpg"]'),
(NOW(), NOW(), 3002, @scenic_2, 102, 5, '鼓楼的建筑工艺令人叹为观止，完全没有一根钉子，全靠榫卯连接', NULL),
(NOW(), NOW(), 3003, @scenic_4, 103, 4, '月亮山古道风景绝美，但部分路段比较陡，建议穿防滑鞋', NULL),
(NOW(), NOW(), 3004, @scenic_1, 104, 5, '带孩子来体验梯田文化，抓稻花鱼、学做竹筒饭，孩子玩得超开心', NULL);

-- ============================================================
-- 26. 行 - 收藏 (travel_collect)
-- ============================================================
INSERT INTO `travel_collect` (`createTime`, `userId`, `targetType`, `targetId`) VALUES
(NOW(), 101, 1, @scenic_1),
(NOW(), 102, 2, @route_1),
(NOW(), 103, 1, @scenic_4),
(NOW(), 104, 2, @route_2),
(NOW(), 105, 1, @scenic_2);

-- ============================================================
-- 27. 社区 - 话题 (community_topic)
-- ============================================================
INSERT INTO `community_topic` (`createTime`, `updateTime`, `name`, `description`, `icon`, `followers`, `articles`, `isRecommended`) VALUES
(NOW(), NOW(), '梯田摄影', '分享梯田四季美景', 'photography', 1250, 89, 1),
(NOW(), NOW(), '侗族文化', '侗族历史、建筑、音乐、饮食', 'culture', 890, 56, 1),
(NOW(), NOW(), '民宿体验', '各地民宿入住体验分享', 'homestay', 670, 45, 1),
(NOW(), NOW(), '美食探店', '地方特色美食发现与测评', 'food', 1560, 120, 1),
(NOW(), NOW(), '徒步探险', '徒步路线分享与攻略', 'hiking', 430, 32, 0),
(NOW(), NOW(), '非遗手作', '传统手工艺制作过程与成果', 'handcraft', 380, 28, 0),
(NOW(), NOW(), '旅行穿搭', '旅行拍照穿搭推荐', 'fashion', 920, 67, 1);

SET @topic_photography = LAST_INSERT_ID();
SET @topic_culture = @topic_photography + 1;
SET @topic_homestay = @topic_culture + 1;
SET @topic_food = @topic_homestay + 1;
SET @topic_hiking = @topic_food + 1;
SET @topic_handcraft = @topic_hiking + 1;
SET @topic_fashion = @topic_handcraft + 1;

-- ============================================================
-- 28. 社区 - 文章 (community_article)
-- ============================================================
INSERT INTO `community_article` (`createTime`, `updateTime`, `userId`, `title`, `content`, `images`, `videoUrl`, `topicIds`, `relatedPlaceType`, `relatedPlaceId`, `likes`, `comments`, `collects`, `views`, `status`) VALUES
(NOW(), NOW(), 101, '乌东梯田：被时光遗忘的金色海洋', '站在梯田高处俯瞰，层层叠叠的田埂如大地的指纹，蜿蜒曲折延伸至天际。清晨时分，云雾缭绕在梯田之间，仿佛置身仙境...', '["article_01_1.jpg","article_01_2.jpg"]', NULL, '[1,2]', 3, @scenic_1, 256, 38, 89, 3200, 1),
(NOW(), NOW(), 102, '住在侗族吊脚楼里的三天', '推开木门的瞬间，百年历史的木柱和雕花窗棂扑面而来。这里的每一块木板都在诉说着故事...', '["article_02_1.jpg"]', NULL, '[2,3]', 2, @hostel_1, 189, 45, 67, 2800, 1),
(NOW(), NOW(), 103, '酸汤鱼的正确打开方式', '走进萨玛酸汤馆，一股浓郁的酸香扑面而来。老板端上一锅热气腾腾的酸汤牛腩，汤汁呈诱人的橘红色...', '["article_03_1.jpg"]', NULL, '[4]', 1, @rest_3, 312, 56, 120, 4500, 1),
(NOW(), NOW(), 104, '月亮山古道徒步全纪录', '从乌东村出发，沿着千年古道前行。沿途经过三个侗族寨子，梯田、峡谷、原始森林交替出现...', '["article_04_1.jpg","article_04_2.jpg"]', NULL, '[5,1]', 4, @scenic_4, 145, 28, 45, 1800, 1),
(NOW(), NOW(), 105, '鼓楼的秘密：不用一钉的建造奇迹', '走进鼓楼的第一感觉是震撼——整个建筑没有任何一颗铁钉，全靠榫卯结构咬合...', '["article_05_1.jpg"]', NULL, '[2]', 2, @scenic_2, 203, 34, 78, 2500, 1),
(NOW(), NOW(), 106, '梯田里的童年回忆', '回到乌东村的那一刻，仿佛回到了小时候。奶奶家的田就在梯田的最下面...', '["article_06_1.jpg"]', NULL, '[1,2]', 1, @scenic_1, 178, 42, 56, 2100, 1),
(NOW(), NOW(), 107, '从江酸汤馆探店指南', '在从江待了一周，吃了三家酸汤馆，总结出一份最全面的探店指南...', '["article_07_1.jpg"]', NULL, '[4]', 1, @rest_3, 267, 51, 98, 3800, 1),
(NOW(), NOW(), 108, '非遗蜡染：一针一线的温度', '在侗族非遗工坊，我亲眼见证了蜡染的全过程。阿姨手持铜笔蘸蜡液...', '["article_08_1.jpg"]', NULL, '[6,2]', NULL, NULL, 134, 22, 43, 1600, 1);

SET @article_1 = LAST_INSERT_ID();
SET @article_2 = @article_1 + 1;
SET @article_3 = @article_2 + 1;
SET @article_4 = @article_3 + 1;
SET @article_5 = @article_4 + 1;
SET @article_6 = @article_5 + 1;
SET @article_7 = @article_6 + 1;
SET @article_8 = @article_7 + 1;

-- ============================================================
-- 29. 社区 - 评论 (community_comment)
-- ============================================================
INSERT INTO `community_comment` (`createTime`, `updateTime`, `articleId`, `userId`, `parentId`, `replyUserId`, `content`) VALUES
(NOW(), NOW(), @article_1, 109, 0, NULL, '太美了！什么时候一定要去一次'),
(NOW(), NOW(), @article_1, 110, 0, NULL, '照片拍得真好，梯田的层次感绝了'),
(NOW(), NOW(), @article_3, 111, 0, NULL, '看得我流口水了，酸汤鱼真的是我的最爱'),
(NOW(), NOW(), @article_3, 112, 0, NULL, '请问那家酸汤馆叫什么名字？想去试试'),
(NOW(), NOW(), @article_4, 113, 0, NULL, '路线很详细，周末就去试试'),
(NOW(), NOW(), @article_5, 114, 0, NULL, '榫卯结构真的太神奇了，古人智慧'),
(NOW(), NOW(), @article_7, 115, 0, NULL, '萨玛酸汤馆确实好吃，牛腩火锅必点'),
(NOW(), NOW(), @article_2, 116, 0, NULL, '吊脚楼体验很棒，下次还想住');

-- ============================================================
-- 30. 社区 - 点赞 (community_like)
-- ============================================================
INSERT INTO `community_like` (`createTime`, `userId`, `targetType`, `targetId`) VALUES
(NOW(), 101, 1, @article_1),
(NOW(), 102, 1, @article_1),
(NOW(), 103, 1, @article_3),
(NOW(), 104, 1, @article_3),
(NOW(), 105, 1, @article_7),
(NOW(), 106, 1, @article_5),
(NOW(), 107, 1, @article_4),
(NOW(), 108, 1, @article_2);

-- ============================================================
-- 31. 社区 - 收藏 (community_collect)
-- ============================================================
INSERT INTO `community_collect` (`createTime`, `userId`, `articleId`) VALUES
(NOW(), 101, @article_1),
(NOW(), 102, @article_3),
(NOW(), 103, @article_7),
(NOW(), 104, @article_5),
(NOW(), 105, @article_2),
(NOW(), 106, @article_4),
(NOW(), 107, @article_6),
(NOW(), 108, @article_8);

-- ============================================================
-- 32. 社区 - 关注 (community_follow)
-- ============================================================
INSERT INTO `community_follow` (`createTime`, `updateTime`, `followerId`, `followeeId`) VALUES
(NOW(), NOW(), 101, 102),
(NOW(), NOW(), 103, 104),
(NOW(), NOW(), 105, 106),
(NOW(), NOW(), 107, 108),
(NOW(), NOW(), 109, 101);

-- ============================================================
-- 33. 平台管理 - 轮播图 (platform_banner)
-- ============================================================
INSERT INTO `platform_banner` (`createTime`, `updateTime`, `title`, `imageUrl`, `linkUrl`, `sort`, `status`) VALUES
(NOW(), NOW(), '乌东梯田四季之美', 'banner_01_terrace.jpg', '/scenic/1', 1, 1),
(NOW(), NOW(), '侗族大歌非遗体验', 'banner_02_dong_song.jpg', '/article/2', 2, 1),
(NOW(), NOW(), '民宿限时特惠', 'banner_03_hostel_deal.jpg', '/hostel/list', 3, 1),
(NOW(), NOW(), '酸汤美食文化节', 'banner_04_food_festival.jpg', '/food/list', 4, 1),
(NOW(), NOW(), '徒步路线推荐', 'banner_05_hiking.jpg', '/travel/route/1', 5, 1);

-- ============================================================
-- 34. 平台管理 - 公告 (platform_notice)
-- ============================================================
INSERT INTO `platform_notice` (`createTime`, `updateTime`, `title`, `content`, `status`, `sort`) VALUES
(NOW(), NOW(), '乌东系统正式上线', '欢迎来到乌东平台！这里汇聚侗族风情、梯田美景、非遗文化和地道美食。', 1, 1),
(NOW(), NOW(), '民宿预订须知', '入住前请仔细阅读各民宿政策，部分房型需提前3天预约。', 1, 2),
(NOW(), NOW(), '社区内容规范', '发布游记请确保内容真实，禁止发布违规和不良信息。', 1, 3);

-- ============================================================
-- 35. 平台管理 - 推荐位 (platform_recommend)
-- ============================================================
INSERT INTO `platform_recommend` (`createTime`, `updateTime`, `name`, `contentType`, `contentId`, `sort`) VALUES
-- 热门推荐
(NOW(), NOW(), '热门商品', 1, 1, 1),   -- 苗族蜡染围巾
(NOW(), NOW(), '热门商品', 1, 6, 2),   -- 建盏茶具套装
(NOW(), NOW(), '热门商品', 1, 10, 3),  -- 侗布披肩
-- 餐厅推荐
(NOW(), NOW(), '热门餐厅', 2, @rest_3, 1),  -- 萨玛酸汤馆
(NOW(), NOW(), '热门餐厅', 2, @rest_1, 2),  -- 乌东农家小院
-- 民宿推荐
(NOW(), NOW(), '热门民宿', 3, @hostel_1, 1), -- 乌东侗寨人家
(NOW(), NOW(), '热门民宿', 3, @hostel_2, 2), -- 梯田云舍
-- 景区推荐
(NOW(), NOW(), '热门景区', 4, @scenic_1, 1), -- 乌东梯田
(NOW(), NOW(), '热门景区', 4, @scenic_2, 2), -- 侗族鼓楼
-- 路线推荐
(NOW(), NOW(), '热门路线', 5, @route_1, 1),  -- 乌东梯田三日游
(NOW(), NOW(), '热门路线', 5, @route_2, 2),  -- 黔东南两日深度游
-- 游记推荐
(NOW(), NOW(), '热门游记', 6, @article_1, 1), -- 乌东梯田：被时光遗忘的金色海洋
(NOW(), NOW(), '热门游记', 6, @article_3, 2), -- 酸汤鱼的正确打开方式
(NOW(), NOW(), '热门游记', 6, @article_7, 3)); -- 从江酸汤馆探店指南

-- ============================================================
-- 36. 平台管理 - 敏感词 (platform_sensitive_word)
-- ============================================================
INSERT INTO `platform_sensitive_word` (`createTime`, `updateTime`, `word`, `type`) VALUES
(NOW(), NOW(), '诈骗', 1),
(NOW(), NOW(), '赌博', 1),
(NOW(), NOW(), '毒品', 1),
(NOW(), NOW(), '色情', 1),
(NOW(), NOW(), '暴力', 1),
(NOW(), NOW(), '传销', 1),
(NOW(), NOW(), '加微信', 2),
(NOW(), NOW(), 'QQ群', 2),
(NOW(), NOW(), '兼职刷单', 2),
(NOW(), NOW(), '低价代购', 2),
(NOW(), NOW(), '傻逼', 3),
(NOW(), NOW(), '滚蛋', 3),
(NOW(), NOW(), '去死', 3);

-- ============================================================
-- 37. 平台管理 - 统计 (platform_stat) - 最近30天
-- ============================================================
INSERT INTO `platform_stat` (`createTime`, `updateTime`, `statDate`, `newUserCount`, `orderCount`, `gmv`, `articleCount`) VALUES
(DATE_SUB(CURDATE(), INTERVAL 29 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 29 DAY), 12, 8, 3580.00, 1),
(DATE_SUB(CURDATE(), INTERVAL 28 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 28 DAY), 15, 12, 5200.00, 2),
(DATE_SUB(CURDATE(), INTERVAL 27 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 27 DAY), 8, 6, 2100.00, 1),
(DATE_SUB(CURDATE(), INTERVAL 26 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 26 DAY), 20, 18, 8900.00, 3),
(DATE_SUB(CURDATE(), INTERVAL 25 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 25 DAY), 14, 10, 4500.00, 2),
(DATE_SUB(CURDATE(), INTERVAL 24 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 24 DAY), 18, 15, 6800.00, 1),
(DATE_SUB(CURDATE(), INTERVAL 23 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 23 DAY), 10, 7, 3200.00, 2),
(DATE_SUB(CURDATE(), INTERVAL 22 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 22 DAY), 22, 20, 9500.00, 3),
(DATE_SUB(CURDATE(), INTERVAL 21 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 21 DAY), 16, 14, 6200.00, 1),
(DATE_SUB(CURDATE(), INTERVAL 20 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 20 DAY), 11, 9, 4100.00, 2),
(DATE_SUB(CURDATE(), INTERVAL 19 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 19 DAY), 25, 22, 11200.00, 4),
(DATE_SUB(CURDATE(), INTERVAL 18 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 18 DAY), 19, 16, 7300.00, 2),
(DATE_SUB(CURDATE(), INTERVAL 17 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 17 DAY), 13, 11, 5000.00, 1),
(DATE_SUB(CURDATE(), INTERVAL 16 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 16 DAY), 17, 13, 5800.00, 3),
(DATE_SUB(CURDATE(), INTERVAL 15 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 15 DAY), 21, 19, 8600.00, 2),
(DATE_SUB(CURDATE(), INTERVAL 14 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 14 DAY), 15, 12, 5500.00, 1),
(DATE_SUB(CURDATE(), INTERVAL 13 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 13 DAY), 23, 21, 9800.00, 3),
(DATE_SUB(CURDATE(), INTERVAL 12 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 12 DAY), 18, 15, 6900.00, 2),
(DATE_SUB(CURDATE(), INTERVAL 11 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 11 DAY), 14, 10, 4600.00, 1),
(DATE_SUB(CURDATE(), INTERVAL 10 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 10 DAY), 20, 17, 7800.00, 2),
(DATE_SUB(CURDATE(), INTERVAL 9 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 9 DAY), 16, 13, 5900.00, 3),
(DATE_SUB(CURDATE(), INTERVAL 8 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 8 DAY), 24, 22, 10500.00, 2),
(DATE_SUB(CURDATE(), INTERVAL 7 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 7 DAY), 19, 16, 7200.00, 1),
(DATE_SUB(CURDATE(), INTERVAL 6 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 6 DAY), 12, 8, 3600.00, 2),
(DATE_SUB(CURDATE(), INTERVAL 5 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 5 DAY), 21, 18, 8200.00, 3),
(DATE_SUB(CURDATE(), INTERVAL 4 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 4 DAY), 17, 14, 6400.00, 1),
(DATE_SUB(CURDATE(), INTERVAL 3 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 3 DAY), 22, 19, 8800.00, 2),
(DATE_SUB(CURDATE(), INTERVAL 2 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 2 DAY), 15, 12, 5400.00, 3),
(DATE_SUB(CURDATE(), INTERVAL 1 DAY), NOW(), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 18, 15, 6700.00, 2),
(NOW(), NOW(), CURDATE(), 20, 17, 7500.00, 1);

SET FOREIGN_KEY_CHECKS = 1;
