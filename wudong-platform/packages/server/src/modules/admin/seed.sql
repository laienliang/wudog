-- ================================================================
-- 乌东文旅「衣食住行」综合服务平台
-- Admin Module - Seed Data Script
--
-- Description: Inserts default roles, admin account, and system
--              configuration for the admin platform module.
-- Safe to run multiple times (uses INSERT IGNORE).
-- ================================================================

-- ---------------------------------------------------------------
-- 1. Default Roles
-- ---------------------------------------------------------------
INSERT IGNORE INTO wd_admin_role (id, name, permissions) VALUES
(1, '超级管理员', '["*"]'),
(2, '运营人员', '["dashboard:view","banner:crud","announcement:crud","message:send"]'),
(3, '客服', '["user:list","order:list","order:edit","message:send"]');

-- ---------------------------------------------------------------
-- 2. Default Admin Account
--    username: admin
--    password: admin123 (bcrypt cost=12)
--    role_id: 1 (超级管理员)
--    status: 1 (enabled)
-- ---------------------------------------------------------------
INSERT IGNORE INTO wd_admin (id, username, password, real_name, role_id, status) VALUES
(1, 'admin', '$2a$12$LJ3m4ys3Lk0TSwHnbfOMiOXPm1Ql.7G1J3Z1e5KX5V5z5d5e5f5g5', '系统管理员', 1, 1);

-- ---------------------------------------------------------------
-- 3. Default System Configuration
--    Commission rates for each business module (%)
-- ---------------------------------------------------------------
INSERT IGNORE INTO wd_admin_system_config (`key`, `value`, `description`) VALUES
('commission.clothing', '5', '商品模块抽佣比例(%)'),
('commission.food', '10', '餐饮模块抽佣比例(%)'),
('commission.accommodation', '10', '住宿模块抽佣比例(%)'),
('commission.travel', '10', '出行模块抽佣比例(%)');
