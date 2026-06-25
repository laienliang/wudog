-- =====================================================================
-- 图片URL更新脚本 - 将本地路径替换为真实可访问的图片URL
-- 使用 picsum.photos 为每条记录生成唯一封面图(同seed=同图片)
-- =====================================================================
USE wudong_tourism;

-- =====================================================================
-- 苗寨封面图 (7个)
-- =====================================================================
UPDATE miao_village SET cover_image = 'https://picsum.photos/seed/mv-xijiang/800/400'    WHERE id = 1;
UPDATE miao_village SET cover_image = 'https://picsum.photos/seed/mv-zhaoxing/800/400'   WHERE id = 2;
UPDATE miao_village SET cover_image = 'https://picsum.photos/seed/mv-langde/800/400'     WHERE id = 3;
UPDATE miao_village SET cover_image = 'https://picsum.photos/seed/mv-basha/800/400'      WHERE id = 4;
UPDATE miao_village SET cover_image = 'https://picsum.photos/seed/mv-zhenyuan/800/400'   WHERE id = 5;
UPDATE miao_village SET cover_image = 'https://picsum.photos/seed/mv-jiabang/800/400'    WHERE id = 6;
UPDATE miao_village SET cover_image = 'https://picsum.photos/seed/mv-danzhai/800/400'    WHERE id = 7;

-- =====================================================================
-- 住宿封面图 (17个)
-- =====================================================================
-- 西江千户苗寨
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-miaoling/800/400'      WHERE id = 1;
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-fengyuqiao/800/400'    WHERE id = 2;
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-guanjingtai/800/400'    WHERE id = 4;
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-yinshifang/800/400'     WHERE id = 5;

-- 肇兴侗寨
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-dongzhai/800/400'      WHERE id = 3;
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-gulourenjia/800/400'    WHERE id = 6;
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-xipanshuige/800/400'    WHERE id = 7;

-- 朗德上寨
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-langdexiaoyuan/800/400' WHERE id = 8;
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-wangshanju/800/400'     WHERE id = 9;

-- 岜沙苗寨
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-bashabuluo/800/400'    WHERE id = 10;
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-bashashuwu/800/400'     WHERE id = 11;

-- 镇远古镇
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-wuyanghe/800/400'       WHERE id = 12;
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-qinglongdong/800/400'   WHERE id = 13;

-- 加榜梯田
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-titian-14/800/400'      WHERE id = 14;
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-tianjushanfang/800/400'  WHERE id = 15;

-- 丹寨万达小镇
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-feiyi/800/400'          WHERE id = 16;
UPDATE accommodation SET cover_image = 'https://picsum.photos/seed/acc-wandajinhua/800/400'    WHERE id = 17;

-- =====================================================================
-- 房型封面图 (36个) - 使用住宿ID+房型ID做唯一seed
-- =====================================================================
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-1-1/400/300'   WHERE id = 1;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-2-2/400/300'   WHERE id = 2;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-3-3/400/300'   WHERE id = 3;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-4-4/400/300'   WHERE id = 4;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-5/400/300'     WHERE id = 5;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-6/400/300'     WHERE id = 6;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-7/400/300'     WHERE id = 7;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-8/400/300'     WHERE id = 8;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-9/400/300'     WHERE id = 9;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-10/400/300'    WHERE id = 10;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-11/400/300'    WHERE id = 11;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-12/400/300'    WHERE id = 12;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-13/400/300'    WHERE id = 13;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-14/400/300'    WHERE id = 14;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-15/400/300'    WHERE id = 15;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-16/400/300'    WHERE id = 16;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-17/400/300'    WHERE id = 17;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-18/400/300'    WHERE id = 18;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-19/400/300'    WHERE id = 19;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-20/400/300'    WHERE id = 20;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-21/400/300'    WHERE id = 21;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-22/400/300'    WHERE id = 22;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-23/400/300'    WHERE id = 23;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-24/400/300'    WHERE id = 24;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-25/400/300'    WHERE id = 25;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-26/400/300'    WHERE id = 26;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-27/400/300'    WHERE id = 27;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-28/400/300'    WHERE id = 28;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-29/400/300'    WHERE id = 29;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-30/400/300'    WHERE id = 30;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-31/400/300'    WHERE id = 31;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-32/400/300'    WHERE id = 32;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-33/400/300'    WHERE id = 33;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-34/400/300'    WHERE id = 34;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-35/400/300'    WHERE id = 35;
UPDATE room SET cover_image = 'https://picsum.photos/seed/room-36/400/300'    WHERE id = 36;

-- =====================================================================
-- 住宿详情图(images字段) - 每个住宿补充3-5张图片
-- =====================================================================
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-miaoling-1/800/400","https://picsum.photos/seed/acc-miaoling-2/800/400","https://picsum.photos/seed/acc-miaoling-3/800/400","https://picsum.photos/seed/acc-miaoling-4/800/400","https://picsum.photos/seed/acc-miaoling-5/800/400"]' WHERE id = 1;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-fengyuqiao-1/800/400","https://picsum.photos/seed/acc-fengyuqiao-2/800/400","https://picsum.photos/seed/acc-fengyuqiao-3/800/400","https://picsum.photos/seed/acc-fengyuqiao-4/800/400","https://picsum.photos/seed/acc-fengyuqiao-5/800/400"]' WHERE id = 2;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-dongzhai-1/800/400","https://picsum.photos/seed/acc-dongzhai-2/800/400","https://picsum.photos/seed/acc-dongzhai-3/800/400","https://picsum.photos/seed/acc-dongzhai-4/800/400","https://picsum.photos/seed/acc-dongzhai-5/800/400"]' WHERE id = 3;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-guanjingtai-1/800/400","https://picsum.photos/seed/acc-guanjingtai-2/800/400","https://picsum.photos/seed/acc-guanjingtai-3/800/400","https://picsum.photos/seed/acc-guanjingtai-4/800/400","https://picsum.photos/seed/acc-guanjingtai-5/800/400"]' WHERE id = 4;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-yinshifang-1/800/400","https://picsum.photos/seed/acc-yinshifang-2/800/400","https://picsum.photos/seed/acc-yinshifang-3/800/400","https://picsum.photos/seed/acc-yinshifang-4/800/400","https://picsum.photos/seed/acc-yinshifang-5/800/400"]' WHERE id = 5;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-gulourenjia-1/800/400","https://picsum.photos/seed/acc-gulourenjia-2/800/400","https://picsum.photos/seed/acc-gulourenjia-3/800/400","https://picsum.photos/seed/acc-gulourenjia-4/800/400","https://picsum.photos/seed/acc-gulourenjia-5/800/400"]' WHERE id = 6;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-xipanshuige-1/800/400","https://picsum.photos/seed/acc-xipanshuige-2/800/400","https://picsum.photos/seed/acc-xipanshuige-3/800/400","https://picsum.photos/seed/acc-xipanshuige-4/800/400","https://picsum.photos/seed/acc-xipanshuige-5/800/400"]' WHERE id = 7;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-langdexiaoyuan-1/800/400","https://picsum.photos/seed/acc-langdexiaoyuan-2/800/400","https://picsum.photos/seed/acc-langdexiaoyuan-3/800/400","https://picsum.photos/seed/acc-langdexiaoyuan-4/800/400","https://picsum.photos/seed/acc-langdexiaoyuan-5/800/400"]' WHERE id = 8;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-wangshanju-1/800/400","https://picsum.photos/seed/acc-wangshanju-2/800/400","https://picsum.photos/seed/acc-wangshanju-3/800/400","https://picsum.photos/seed/acc-wangshanju-4/800/400","https://picsum.photos/seed/acc-wangshanju-5/800/400"]' WHERE id = 9;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-bashabuluo-1/800/400","https://picsum.photos/seed/acc-bashabuluo-2/800/400","https://picsum.photos/seed/acc-bashabuluo-3/800/400","https://picsum.photos/seed/acc-bashabuluo-4/800/400","https://picsum.photos/seed/acc-bashabuluo-5/800/400"]' WHERE id = 10;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-bashashuwu-1/800/400","https://picsum.photos/seed/acc-bashashuwu-2/800/400","https://picsum.photos/seed/acc-bashashuwu-3/800/400","https://picsum.photos/seed/acc-bashashuwu-4/800/400","https://picsum.photos/seed/acc-bashashuwu-5/800/400"]' WHERE id = 11;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-wuyanghe-1/800/400","https://picsum.photos/seed/acc-wuyanghe-2/800/400","https://picsum.photos/seed/acc-wuyanghe-3/800/400","https://picsum.photos/seed/acc-wuyanghe-4/800/400","https://picsum.photos/seed/acc-wuyanghe-5/800/400"]' WHERE id = 12;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-qinglongdong-1/800/400","https://picsum.photos/seed/acc-qinglongdong-2/800/400","https://picsum.photos/seed/acc-qinglongdong-3/800/400","https://picsum.photos/seed/acc-qinglongdong-4/800/400","https://picsum.photos/seed/acc-qinglongdong-5/800/400"]' WHERE id = 13;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-titian-14-1/800/400","https://picsum.photos/seed/acc-titian-14-2/800/400","https://picsum.photos/seed/acc-titian-14-3/800/400","https://picsum.photos/seed/acc-titian-14-4/800/400","https://picsum.photos/seed/acc-titian-14-5/800/400"]' WHERE id = 14;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-tianjushanfang-1/800/400","https://picsum.photos/seed/acc-tianjushanfang-2/800/400","https://picsum.photos/seed/acc-tianjushanfang-3/800/400","https://picsum.photos/seed/acc-tianjushanfang-4/800/400","https://picsum.photos/seed/acc-tianjushanfang-5/800/400"]' WHERE id = 15;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-feiyi-1/800/400","https://picsum.photos/seed/acc-feiyi-2/800/400","https://picsum.photos/seed/acc-feiyi-3/800/400","https://picsum.photos/seed/acc-feiyi-4/800/400","https://picsum.photos/seed/acc-feiyi-5/800/400"]' WHERE id = 16;
UPDATE accommodation SET images = '["https://picsum.photos/seed/acc-wandajinhua-1/800/400","https://picsum.photos/seed/acc-wandajinhua-2/800/400","https://picsum.photos/seed/acc-wandajinhua-3/800/400","https://picsum.photos/seed/acc-wandajinhua-4/800/400","https://picsum.photos/seed/acc-wandajinhua-5/800/400"]' WHERE id = 17;
