# 10 Cool Admin Midway 与课程技术栈适配说明

## 1. 最终技术栈

* 后端：Midway.js + Cool Admin Midway 脚手架
* PC Web：React
* 管理后台：React + Ant Design
* 微信端：原生微信小程序
* 数据库：MySQL
* 缓存：Redis
* 容器化：Docker
* 接口文档：Swagger / OpenAPI
* 协作：Git + GitHub

## 2. Cool 脚手架定位

* 后端不再按“从零创建普通 Midway 项目”设计。
* 后端应基于 Cool Admin Midway 当前实际版本进行第 1 组业务模块二次开发。
* 优先复用 Cool 已有的管理员登录、JWT、角色权限、菜单、统一响应、基础实体和基础 CRUD。
* 禁止重复设计一套管理员、JWT 和权限基础系统。

## 3. 模块目录规划

建议在 Cool 当前项目结构下增加独立业务模块，例如：

* `src/modules/wudong/controller/app`
* `src/modules/wudong/controller/admin`
* `src/modules/wudong/service`
* `src/modules/wudong/entity`
* `src/modules/wudong/dto`

说明：

* `controller/app` 面向普通用户公开接口
* `controller/admin` 面向管理后台接口
* 业务逻辑应集中在 `service`

## 4. 自动 CRUD 的使用边界

`@CoolController` 和自动 CRUD 可以用于：

* 普通分页列表
* 基础新增、编辑、删除
* 常规字段查询

但不能代替以下复杂业务校验：

* SKU 库存不能小于 0
* 库存必须放在 SKU 表
* 普通用户只能看到已上架商品
* 收藏去重
* 软删除过滤
* 商品上架前校验
* 全部 SKU 无库存时返回售罄
* 商品详情返回工艺介绍和传承人信息

这些逻辑必须由自定义 Service 负责。

## 5. app / admin 接口划分

建议划分如下：

* `controller/app`
  * 商品分类列表
  * 商品列表
  * 商品详情
  * SKU 信息
  * 商品图片
  * 收藏、取消收藏、我的收藏、收藏状态
* `controller/admin`
  * 商品分类管理
  * 商品管理
  * SKU 管理
  * 商品图片管理
  * 商品上架、下架

## 6. 路由兼容方案

课程接口规范仍保留：

* `/api` 前缀
* REST 风格
* 小写和连字符
* 统一响应格式
* 分页包含 `total`、`page`、`pageSize`、`list`
* JWT Bearer Token
* 软删除

兼容原则：

* Cool 自动路由不一定天然符合课程路径。
* 正式开发时必须先检查当前版本实际路由规则。
* 若现有自动路由不满足课程路径要求，应通过路由前缀配置或自定义 Controller 做兼容。

## 7. Entity 与 `init.sql` 同步方案

* 核心业务实体继续保留：
  * `product_category`
  * `product`
  * `product_sku`
  * `product_image`
  * `favorite`
* 商品库存只放在 SKU 表。
* 收藏对 `user_id + product_id` 设置唯一约束。
* 课程要求的 `backend/sql/init.sql` 与 Cool Entity 必须保持同步。
* 不能存在两套相互冲突的表结构。
* 本轮只写方案，不创建 SQL。

## 8. Redis、Swagger、Docker 的定位

### 8.1 Redis

* 可用于商品缓存、Token 辅助管理、限流和防重复操作。
* 核心商品 CRUD 必须在 Redis 未接入时也能运行。
* 收藏去重必须由数据库唯一约束兜底，不能只依赖 Redis。

### 8.2 Swagger / OpenAPI

* 后端后续应生成真实接口文档。
* Swagger 不能代替 Postman 和真实数据库联调。

### 8.3 Docker

* Docker 是课程整体技术栈和后期部署目标，但不是当前文档阶段任务。
* 当前不需要在 Docker 中安装 Codex、Gemini CLI 或 Claude Code。
* 后期单独规划：
  * 后端 Dockerfile
  * MySQL
  * Redis
  * Docker Compose
  * 数据卷
  * 环境变量
  * 容器联网和接口验证

## 9. React 和微信小程序的约束

* Cool Admin Midway 只作为后端脚手架。
* PC Web 继续使用 React。
* 管理后台继续使用 React + Ant Design。
* 微信端继续使用原生微信小程序。
* 禁止改成 Vue。
* 禁止改成 cool-admin-vue。
* 禁止改成 Element Plus。
* 禁止改成 UniApp。
* 禁止改成 Taro。

## 10. 后续 Gemini CLI 开发前需要检查的源码位置

正式开发前应只读检查：

* 当前脚手架 `README`
* `package.json`
* 启动命令和脚本
* 示例业务模块
* 全局配置文件
* 数据库配置
* 基础实体
* 基础控制器与自动 CRUD 示例
* 管理员认证和 JWT 相关代码
* 路由规则
* Swagger 接入方式

## 11. 待确认事项

* Cool Admin Midway 当前实际版本中的模块目录和基础实体命名
* 管理员认证接口最终是直接复用现有路由，还是做课程兼容映射
* 普通用户 JWT 的实际来源
