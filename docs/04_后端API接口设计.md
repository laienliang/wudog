# 04 后端 API 接口设计

本文件适用于第 1 组“衣·非遗商品模块”。

## 1. 设计原则

* 接口统一使用 REST 风格
* 路径统一使用全小写、连字符和 `/api` 前缀
* 公开商品接口与后台管理接口分离
* 统一响应结构：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

* 分页响应结构：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 0,
    "page": 1,
    "pageSize": 10,
    "list": []
  }
}
```

### 1.1 Cool Admin Midway 适配说明

* 后端正式开发必须基于 Cool Admin Midway 当前实际版本。
* 管理员登录、JWT、角色权限、菜单、统一响应和基础 CRUD 优先复用 Cool 已有能力。
* 不重复设计一套管理员、JWT 和权限基础系统。
* 第 1 组业务模块建议放入独立模块，例如 `src/modules/wudong`。
* 普通用户接口与管理接口应分开规划，例如 `controller/app` 和 `controller/admin`。
* `@CoolController` 和自动 CRUD 可用于普通增删改查，但不能替代库存、上架、收藏去重和软删除过滤等业务校验。
* Cool 自动路由不一定天然符合课程接口路径，正式开发时应先检查当前版本，再通过路由前缀或自定义 Controller 实现兼容。

## 2. 通用状态码

| 状态码 | 含义 | 典型场景 |
| --- | --- | --- |
| 200 | 成功 | 查询、创建、更新、删除成功 |
| 400 | 请求参数错误 | 缺少字段、参数格式不对、库存为负 |
| 401 | 未认证 | 未携带 JWT 或令牌无效 |
| 403 | 无权限 | 普通用户访问管理接口 |
| 404 | 资源不存在 | 商品、分类、SKU、图片不存在 |
| 500 | 服务端错误 | 未预期异常 |

## 3. 统一业务规则

* 普通商品接口只返回已上架且未软删除商品
* 管理接口默认返回未软删除数据，不自动过滤下架状态
* 商品售罄字段按 SKU 库存实时计算，不单独落表
* 收藏接口采用“恢复已有收藏记录”方案避免重复收藏
* 商品上架前至少校验分类存在、主图存在、工艺介绍存在、传承人信息存在、至少存在一个启用 SKU
* SKU 库存不得为负数

## 4. 公共商品接口

## 4.1 获取商品分类列表

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/product-categories` |
| 是否鉴权 | 否 |
| 权限角色 | 游客、已登录普通用户 |
| Query 参数 | `keyword?`：分类关键词 |
| Path 参数 | 无 |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":[{"id":1,"name":"银饰","sortOrder":1,"status":1}]}` |
| 常见失败响应 | `400` 参数错误，`500` 服务异常 |
| 对应页面 | PC Web 商品列表页、微信小程序首页 |
| 业务校验规则 | 仅返回 `status=1` 且 `is_deleted=0` 的分类；按 `sort_order` 升序 |

## 4.2 获取商品分页列表

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/products` |
| 是否鉴权 | 否 |
| 权限角色 | 游客、已登录普通用户 |
| Query 参数 | `page`、`pageSize`、`categoryId?`、`keyword?` |
| Path 参数 | 无 |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"total":1,"page":1,"pageSize":10,"list":[{"id":101,"name":"苗绣手包","coverImage":"https://...","status":1,"soldOut":false,"minPrice":"199.00"}]}}` |
| 常见失败响应 | `400` 分页参数错误，`500` 服务异常 |
| 对应页面 | PC Web 商品列表页、微信小程序首页 |
| 业务校验规则 | 仅查询已上架、未删除商品；支持分类筛选和关键词模糊搜索；`soldOut` 由 SKU 库存汇总计算 |

## 4.3 获取商品详情

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/products/{productId}` |
| 是否鉴权 | 否 |
| 权限角色 | 游客、已登录普通用户 |
| Query 参数 | 无 |
| Path 参数 | `productId`：商品 ID |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":101,"name":"苗绣手包","craftIntro":"介绍工艺","inheritorName":"传承人甲","inheritorIntro":"传承人简介","status":1,"allSoldOut":false}}` |
| 常见失败响应 | `404` 商品不存在或不可见，`500` 服务异常 |
| 对应页面 | PC Web 商品详情页、微信小程序商品详情页 |
| 业务校验规则 | 只允许读取已上架、未删除商品；详情必须返回工艺介绍和传承人信息 |

## 4.4 获取商品 SKU 信息

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/products/{productId}/skus` |
| 是否鉴权 | 否 |
| 权限角色 | 游客、已登录普通用户 |
| Query 参数 | 无 |
| Path 参数 | `productId`：商品 ID |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":[{"id":201,"skuCode":"SKU-001","specification":"蓝染 / M","price":"199.00","stock":8,"soldOut":false}]}` |
| 常见失败响应 | `404` 商品不存在，`500` 服务异常 |
| 对应页面 | PC Web 商品详情页、微信小程序商品详情页 |
| 业务校验规则 | 仅返回所属商品下已启用、未删除 SKU；当 `stock=0` 时返回 `soldOut=true` |

## 4.5 获取商品图片列表

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/products/{productId}/images` |
| 是否鉴权 | 否 |
| 权限角色 | 游客、已登录普通用户 |
| Query 参数 | 无 |
| Path 参数 | `productId`：商品 ID |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":[{"id":301,"imageUrl":"https://...","imageType":"detail","sortOrder":1}]}` |
| 常见失败响应 | `404` 商品不存在，`500` 服务异常 |
| 对应页面 | PC Web 商品详情页、微信小程序商品详情页 |
| 业务校验规则 | 仅返回未删除图片；按 `sort_order` 升序 |

## 5. 收藏接口

说明：以下接口都要求普通用户 JWT，但普通用户登录入口当前资料未明确，属于待确认的系统支撑能力。

## 5.1 收藏商品

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `POST` |
| 路径 | `/api/favorites` |
| 是否鉴权 | 是 |
| 权限角色 | 已登录普通用户 |
| Query 参数 | 无 |
| Path 参数 | 无 |
| Body 参数 | `productId` |
| 成功响应示例 | `{"code":200,"message":"success","data":{"productId":101,"favorited":true}}` |
| 常见失败响应 | `400` 商品参数错误，`401` 未登录，`404` 商品不存在，`500` 服务异常 |
| 对应页面 | 微信小程序商品详情页、PC Web 商品详情页 |
| 业务校验规则 | 商品必须存在、已上架、未删除；若已存在取消状态记录，则恢复为已收藏；不得重复插入收藏关系 |

## 5.2 取消收藏

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `DELETE` |
| 路径 | `/api/favorites/{productId}` |
| 是否鉴权 | 是 |
| 权限角色 | 已登录普通用户 |
| Query 参数 | 无 |
| Path 参数 | `productId`：商品 ID |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"productId":101,"favorited":false}}` |
| 常见失败响应 | `401` 未登录，`404` 收藏记录不存在，`500` 服务异常 |
| 对应页面 | 微信小程序商品详情页、我的收藏页、PC Web 商品详情页 |
| 业务校验规则 | 采用软删除取消收藏；幂等处理，重复取消时可返回当前状态 |

## 5.3 获取我的收藏列表

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/favorites` |
| 是否鉴权 | 是 |
| 权限角色 | 已登录普通用户 |
| Query 参数 | `page`、`pageSize` |
| Path 参数 | 无 |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"total":1,"page":1,"pageSize":10,"list":[{"productId":101,"name":"苗绣手包","coverImage":"https://...","status":1}]}}` |
| 常见失败响应 | `401` 未登录，`500` 服务异常 |
| 对应页面 | 微信小程序我的收藏页 |
| 业务校验规则 | 只返回当前用户 `is_deleted=0` 的收藏；若商品已被软删除，则默认不展示 |

## 5.4 查询是否已收藏

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/favorites/{productId}/status` |
| 是否鉴权 | 是 |
| 权限角色 | 已登录普通用户 |
| Query 参数 | 无 |
| Path 参数 | `productId`：商品 ID |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"productId":101,"favorited":true}}` |
| 常见失败响应 | `401` 未登录，`404` 商品不存在，`500` 服务异常 |
| 对应页面 | 微信小程序商品详情页、PC Web 商品详情页 |
| 业务校验规则 | 根据当前用户与商品关系返回收藏状态；不存在关系时返回 `false` |

## 6. 管理员认证接口

说明：本组管理认证能力必须优先复用 Cool Admin Midway 现有管理员登录、JWT、角色权限和菜单体系。以下路径是课程兼容目标路径，正式开发时需检查当前脚手架实际路由，并做兼容映射，不得重复造轮子。

## 6.1 管理员登录

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `POST` |
| 路径 | `/api/admin/auth/login` |
| 是否鉴权 | 否 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | 无 |
| Body 参数 | `username`、`password` |
| 成功响应示例 | `{"code":200,"message":"success","data":{"token":"jwt-token","admin":{"id":1,"username":"admin","displayName":"管理员"}}}` |
| 常见失败响应 | `400` 参数缺失，`401` 账号或密码错误，`403` 账号已停用，`500` 服务异常 |
| 对应页面 | 管理员登录页 |
| 业务校验规则 | 优先复用 Cool 现有管理员认证能力；课程兼容路径下返回管理员 JWT |

## 6.2 获取管理员信息

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/admin/auth/profile` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | 无 |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":1,"username":"admin","displayName":"管理员","status":1}}` |
| 常见失败响应 | `401` 令牌无效，`403` 角色不匹配，`500` 服务异常 |
| 对应页面 | 管理后台布局页 |
| 业务校验规则 | 仅管理员 JWT 可访问；优先复用 Cool 现有管理员资料与权限上下文 |

## 7. 分类管理接口

## 7.1 分类分页列表

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/admin/product-categories` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | `page`、`pageSize`、`keyword?`、`status?` |
| Path 参数 | 无 |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"total":2,"page":1,"pageSize":10,"list":[{"id":1,"name":"银饰","status":1}]}}` |
| 常见失败响应 | `401` 未登录，`500` 服务异常 |
| 对应页面 | 分类管理页、商品新增页 |
| 业务校验规则 | 默认仅返回未删除分类；支持关键词和状态筛选 |

## 7.2 分类详情

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/admin/product-categories/{categoryId}` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `categoryId` |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":1,"name":"银饰","description":"银饰类","status":1,"sortOrder":1}}` |
| 常见失败响应 | `401` 未登录，`404` 分类不存在，`500` 服务异常 |
| 对应页面 | 分类编辑弹窗/分类管理页 |
| 业务校验规则 | 仅查询未删除分类 |

## 7.3 新增分类

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `POST` |
| 路径 | `/api/admin/product-categories` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | 无 |
| Body 参数 | `name`、`description?`、`sortOrder?`、`status?` |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":1}}` |
| 常见失败响应 | `400` 名称缺失或重复，`401` 未登录，`500` 服务异常 |
| 对应页面 | 分类管理页 |
| 业务校验规则 | 未删除分类中名称不可重复；排序值必须为非负整数 |

## 7.4 更新分类

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `PUT` |
| 路径 | `/api/admin/product-categories/{categoryId}` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `categoryId` |
| Body 参数 | `name`、`description?`、`sortOrder?`、`status?` |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":1,"updated":true}}` |
| 常见失败响应 | `400` 参数错误，`401` 未登录，`404` 分类不存在，`500` 服务异常 |
| 对应页面 | 分类管理页 |
| 业务校验规则 | 目标分类必须存在且未删除；名称冲突时拒绝更新 |

## 7.5 软删除分类

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `DELETE` |
| 路径 | `/api/admin/product-categories/{categoryId}` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `categoryId` |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":1,"deleted":true}}` |
| 常见失败响应 | `401` 未登录，`404` 分类不存在，`400` 分类下仍有商品，`500` 服务异常 |
| 对应页面 | 分类管理页 |
| 业务校验规则 | 若分类下仍有关联未删除商品，默认不允许删除 |

## 8. 商品管理接口

## 8.1 商品分页列表

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/admin/products` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | `page`、`pageSize`、`categoryId?`、`keyword?`、`status?`、`stockStatus?` |
| Path 参数 | 无 |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"total":1,"page":1,"pageSize":10,"list":[{"id":101,"name":"苗绣手包","status":0,"stockStatus":"in_stock"}]}}` |
| 常见失败响应 | `401` 未登录，`500` 服务异常 |
| 对应页面 | 商品管理页 |
| 业务校验规则 | 支持分页、关键词、分类、上架状态、库存状态筛选；库存状态由 SKU 汇总计算 |

## 8.2 商品详情

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/admin/products/{productId}` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `productId` |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":101,"categoryId":1,"name":"苗绣手包","craftIntro":"介绍工艺","inheritorName":"传承人甲","status":0}}` |
| 常见失败响应 | `401` 未登录，`404` 商品不存在，`500` 服务异常 |
| 对应页面 | 商品编辑页、商品管理页 |
| 业务校验规则 | 默认只查询未删除商品 |

## 8.3 新增商品

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `POST` |
| 路径 | `/api/admin/products` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | 无 |
| Body 参数 | `categoryId`、`name`、`subtitle?`、`description?`、`craftIntro`、`inheritorName`、`inheritorIntro`、`coverImage`、`status?` |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":101}}` |
| 常见失败响应 | `400` 参数缺失，`401` 未登录，`404` 分类不存在，`500` 服务异常 |
| 对应页面 | 商品新增页、PC Web 商品新增页 |
| 业务校验规则 | 分类必须存在；工艺介绍、传承人信息、主图必填；新建后默认可为下架状态 |

## 8.4 更新商品

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `PUT` |
| 路径 | `/api/admin/products/{productId}` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `productId` |
| Body 参数 | 同新增商品 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":101,"updated":true}}` |
| 常见失败响应 | `400` 参数错误，`401` 未登录，`404` 商品不存在，`500` 服务异常 |
| 对应页面 | 商品编辑页、PC Web 商品编辑页 |
| 业务校验规则 | 不允许把商品改到不存在的分类；更新后仍需保留工艺介绍和传承人信息 |

## 8.5 软删除商品

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `DELETE` |
| 路径 | `/api/admin/products/{productId}` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `productId` |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":101,"deleted":true}}` |
| 常见失败响应 | `401` 未登录，`404` 商品不存在，`500` 服务异常 |
| 对应页面 | 商品管理页 |
| 业务校验规则 | 删除采用软删除；公开接口和后台默认查询都不再返回该商品；相关 SKU 和图片需同步按未显示策略处理 |

## 8.6 商品上架

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `PATCH` |
| 路径 | `/api/admin/products/{productId}/publish` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `productId` |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":101,"status":1,"publishedAt":"2026-06-17 10:00:00"}}` |
| 常见失败响应 | `400` 上架前校验失败，`401` 未登录，`404` 商品不存在，`500` 服务异常 |
| 对应页面 | 商品管理页 |
| 业务校验规则 | 上架前必须校验分类有效、主图存在、工艺介绍存在、传承人信息存在、至少一个启用且未删除 SKU 存在；不满足任一条件则拒绝上架 |

## 8.7 商品下架

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `PATCH` |
| 路径 | `/api/admin/products/{productId}/unpublish` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `productId` |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":101,"status":0}}` |
| 常见失败响应 | `401` 未登录，`404` 商品不存在，`500` 服务异常 |
| 对应页面 | 商品管理页 |
| 业务校验规则 | 下架后公开列表与详情不再正常展示该商品；后台仍可见 |

## 9. SKU 管理接口

## 9.1 SKU 列表

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/admin/products/{productId}/skus` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | `status?` |
| Path 参数 | `productId` |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":[{"id":201,"skuCode":"SKU-001","price":"199.00","stock":8,"status":1}]}` |
| 常见失败响应 | `401` 未登录，`404` 商品不存在，`500` 服务异常 |
| 对应页面 | SKU 管理页、商品编辑页 |
| 业务校验规则 | 仅返回所属商品的未删除 SKU；可按启用状态筛选 |

## 9.2 SKU 详情

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/admin/skus/{skuId}` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `skuId` |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":201,"productId":101,"skuCode":"SKU-001","specification":"蓝染 / M","price":"199.00","stock":8,"status":1}}` |
| 常见失败响应 | `401` 未登录，`404` SKU 不存在，`500` 服务异常 |
| 对应页面 | SKU 管理页 |
| 业务校验规则 | 仅允许查看未删除 SKU |

## 9.3 新增 SKU

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `POST` |
| 路径 | `/api/admin/products/{productId}/skus` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `productId` |
| Body 参数 | `skuCode`、`specification`、`price`、`stock`、`status?` |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":201}}` |
| 常见失败响应 | `400` 编码重复或库存非法，`401` 未登录，`404` 商品不存在，`500` 服务异常 |
| 对应页面 | SKU 管理页 |
| 业务校验规则 | `skuCode` 全局唯一；`price` 不能小于 0；`stock` 不能为负数 |

## 9.4 更新 SKU

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `PUT` |
| 路径 | `/api/admin/skus/{skuId}` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `skuId` |
| Body 参数 | `specification`、`price`、`stock`、`status` |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":201,"updated":true}}` |
| 常见失败响应 | `400` 参数非法，`401` 未登录，`404` SKU 不存在，`500` 服务异常 |
| 对应页面 | SKU 管理页 |
| 业务校验规则 | 更新后库存仍不能为负；停用 SKU 不参与公开售卖展示 |

## 9.5 软删除 SKU

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `DELETE` |
| 路径 | `/api/admin/skus/{skuId}` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `skuId` |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":201,"deleted":true}}` |
| 常见失败响应 | `401` 未登录，`404` SKU 不存在，`500` 服务异常 |
| 对应页面 | SKU 管理页 |
| 业务校验规则 | 删除后公开详情不再返回该 SKU；如果商品无可用 SKU，上架校验应失败 |

## 9.6 更新库存

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `PATCH` |
| 路径 | `/api/admin/skus/{skuId}/stock` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `skuId` |
| Body 参数 | `stock` |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":201,"stock":0,"soldOut":true}}` |
| 常见失败响应 | `400` 库存为负，`401` 未登录，`404` SKU 不存在，`500` 服务异常 |
| 对应页面 | SKU 管理页、商品管理页 |
| 业务校验规则 | 库存值必须为大于等于 0 的整数；更新后同步影响售罄状态计算 |

## 10. 商品图片接口

## 10.1 图片列表

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 路径 | `/api/admin/products/{productId}/images` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | `imageType?` |
| Path 参数 | `productId` |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":[{"id":301,"imageUrl":"https://...","imageType":"detail","sortOrder":1}]}` |
| 常见失败响应 | `401` 未登录，`404` 商品不存在，`500` 服务异常 |
| 对应页面 | 商品图片管理页 |
| 业务校验规则 | 仅返回未删除图片；支持按类型筛选 |

## 10.2 新增图片记录

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `POST` |
| 路径 | `/api/admin/products/{productId}/images` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `productId` |
| Body 参数 | `imageUrl`、`imageType`、`sortOrder?` |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":301}}` |
| 常见失败响应 | `400` 参数错误，`401` 未登录，`404` 商品不存在，`500` 服务异常 |
| 对应页面 | 商品图片管理页 |
| 业务校验规则 | 图片 URL 必填；`sortOrder` 必须为非负整数 |

## 10.3 更新图片记录

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `PUT` |
| 路径 | `/api/admin/product-images/{imageId}` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `imageId` |
| Body 参数 | `imageUrl`、`imageType`、`sortOrder` |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":301,"updated":true}}` |
| 常见失败响应 | `400` 参数错误，`401` 未登录，`404` 图片不存在，`500` 服务异常 |
| 对应页面 | 商品图片管理页 |
| 业务校验规则 | 仅允许更新未删除图片记录 |

## 10.4 删除图片记录

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `DELETE` |
| 路径 | `/api/admin/product-images/{imageId}` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `imageId` |
| Body 参数 | 无 |
| 成功响应示例 | `{"code":200,"message":"success","data":{"id":301,"deleted":true}}` |
| 常见失败响应 | `401` 未登录，`404` 图片不存在，`500` 服务异常 |
| 对应页面 | 商品图片管理页 |
| 业务校验规则 | 删除采用软删除；若删除后商品失去全部展示图，不影响历史数据但上架校验可继续仅检查主图 |

## 10.5 调整排序

| 项目 | 内容 |
| --- | --- |
| 请求方法 | `PATCH` |
| 路径 | `/api/admin/products/{productId}/images/sort` |
| 是否鉴权 | 是 |
| 权限角色 | 管理员 |
| Query 参数 | 无 |
| Path 参数 | `productId` |
| Body 参数 | `items`：数组，元素包含 `imageId`、`sortOrder` |
| 成功响应示例 | `{"code":200,"message":"success","data":{"productId":101,"updated":true}}` |
| 常见失败响应 | `400` 排序参数非法，`401` 未登录，`404` 商品或图片不存在，`500` 服务异常 |
| 对应页面 | 商品图片管理页 |
| 业务校验规则 | 只允许调整该商品名下图片；排序值必须为非负整数 |

## 11. 重点规则对照

### 11.1 商品列表如何分页

* 统一使用 `page` 和 `pageSize`
* 返回 `total`、`page`、`pageSize`、`list`
* `page` 从 `1` 开始

### 11.2 商品列表如何按分类、关键词、状态筛选

* 公开商品列表：`categoryId`、`keyword`
* 后台商品列表：`categoryId`、`keyword`、`status`、`stockStatus`

### 11.3 普通用户接口只能展示已上架商品

* 公开商品列表和详情统一附加 `status = 1`
* 已下架商品对普通用户返回不可见或 404 风格结果

### 11.4 售罄字段如何返回

* SKU 级返回 `soldOut`
* 商品级返回 `soldOut` 或 `allSoldOut`
* 计算依据均为 SKU 库存

### 11.5 收藏去重如何处理

* 数据库层使用 `UNIQUE(user_id, product_id)`
* 业务层对已存在记录执行恢复而不是重复插入

### 11.6 软删除商品后的查询规则

* 公开接口不返回
* 后台默认列表也不返回
* 商品详情、SKU、图片等关联查询均按 `is_deleted = 0` 过滤

## 12. Swagger / OpenAPI 与课程接口兼容说明

* 后端后续应基于真实接口生成 Swagger / OpenAPI 文档。
* Swagger 文档路径、装饰器和插件接法必须以 Cool Admin Midway 当前版本为准。
* Swagger 不能代替 Postman 测试，也不能代替真实数据库联调。
* 即使启用了 Cool 自动路由或 Swagger 自动扫描，最终对外课程接口仍应以 `/api`、REST 风格、小写和连字符为准。

## 13. 待确认事项

* 普通用户 JWT 的签发接口与流程
* 管理端是否需要更细粒度角色权限；当前统一为管理员
* Cool Admin Midway 当前版本中管理员认证和 Swagger 的实际接入方式
