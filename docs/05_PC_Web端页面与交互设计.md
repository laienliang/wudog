# 05 PC Web 端页面与交互设计

本文件适用于第 1 组“衣·非遗商品模块”。

## 1. 设计定位

PC Web 采用 `React 18 + Vite + React Router v6 + Axios`。  
本端承担两类任务：

* 面向普通浏览的商品列表页和商品详情页
* 面向课程演示与接口联调的商品新增页和商品编辑页

说明：PC Web 的新增、编辑表单用于满足课程要求的表单页和接口联调展示，不代表完整商家平台。

前端约束：

* PC Web 继续使用 React，不改为 Vue、UniApp 或 Taro。
* Cool Admin Midway 只作为后端脚手架，不替代 React PC Web。

## 2. 建议路由

| 路由 | 页面 |
| --- | --- |
| `/products` | 商品列表页 |
| `/products/:id` | 商品详情页 |
| `/products/new` | 商品新增页 |
| `/products/:id/edit` | 商品编辑页 |

## 3. 页面设计

## 3.1 商品列表页

### 页面目标

* 展示已上架商品
* 支持分类筛选、关键词搜索和分页
* 作为进入商品详情页的主入口

### 页面区域

* 顶部标题区
* 分类筛选区
* 搜索区
* 商品卡片列表区
* 分页区

### 展示字段

* 分类名称
* 商品主图
* 商品名称
* 商品副标题
* 最低价格
* 商品售罄状态

### 交互操作

* 切换分类
* 输入关键词搜索
* 切换分页
* 点击商品卡片进入详情页

### 调用接口

* `GET /api/product-categories`
* `GET /api/products`

### loading 状态

* 首屏加载商品骨架屏
* 切换分类或分页时显示局部 loading

### 空状态

* 分类下暂无商品
* 搜索无结果

### 错误状态

* 接口失败时展示错误提示与重试按钮

### 表单校验

* 搜索关键词允许为空
* 分页参数必须为正整数

### 提交成功后的行为

* 本页无提交动作

## 3.2 商品详情页

### 页面目标

* 展示商品完整详情、工艺介绍、传承人信息、SKU 和图片
* 支持查看收藏状态并触发收藏操作

### 页面区域

* 面包屑或返回区
* 商品主信息区
* 图片轮播或图片列表区
* SKU 选择区
* 工艺介绍区
* 传承人信息区
* 收藏操作区

### 展示字段

* 商品名称
* 副标题
* 主图和商品图片
* 价格
* SKU 规格
* SKU 库存
* SKU 售罄状态
* `craft_intro`
* `inheritor_name`
* `inheritor_intro`

### 交互操作

* 选择 SKU
* 点击收藏或取消收藏
* 返回列表页

### 调用接口

* `GET /api/products/{productId}`
* `GET /api/products/{productId}/skus`
* `GET /api/products/{productId}/images`
* `GET /api/favorites/{productId}/status`
* `POST /api/favorites`
* `DELETE /api/favorites/{productId}`

### loading 状态

* 详情首屏 loading
* 收藏按钮局部 loading

### 空状态

* 商品不存在或已下架
* 商品暂无附加图片

### 错误状态

* 详情接口失败时展示错误页
* 收藏接口失败时展示消息提示

### 表单校验

* 收藏操作前无需表单校验
* 若未登录，点击收藏时提示先完成用户登录流程

### 提交成功后的行为

* 收藏成功后刷新收藏状态
* 取消收藏成功后同步按钮状态

## 3.3 商品新增页

### 页面目标

* 以课程演示方式展示商品新增表单
* 完成商品创建接口联调

### 页面区域

* 页面标题区
* 基础信息表单区
* 工艺与传承人信息区
* 封面图 URL 输入区
* 操作按钮区

### 展示字段

* 分类
* 商品名称
* 副标题
* 商品描述
* 工艺介绍
* 传承人姓名
* 传承人介绍
* 主图 URL
* 初始上架状态

### 交互操作

* 录入表单
* 选择分类
* 提交创建
* 取消并返回

### 调用接口

* `GET /api/admin/product-categories`
* `POST /api/admin/products`

### loading 状态

* 分类下拉加载中
* 提交按钮 loading

### 空状态

* 无可用分类时提示先去后台维护分类

### 错误状态

* 表单提交失败时展示错误消息
* 401 时跳转到管理员登录状态说明页或提示先获取管理员令牌

### 表单校验

* 分类必选
* 商品名称必填
* 工艺介绍必填
* 传承人姓名必填
* 传承人介绍必填
* 主图 URL 必填

### 提交成功后的行为

* 提示创建成功
* 跳转到 `/products/:id/edit` 或返回商品列表页

## 3.4 商品编辑页

### 页面目标

* 展示课程所需的商品编辑表单
* 完成商品详情获取与更新接口联调

### 页面区域

* 页面标题区
* 基础信息表单区
* 工艺与传承人信息区
* 状态展示区
* 操作按钮区

### 展示字段

* 商品现有分类
* 商品名称
* 副标题
* 商品描述
* 工艺介绍
* 传承人姓名
* 传承人介绍
* 主图 URL
* 上下架状态

### 交互操作

* 加载商品详情
* 修改表单
* 提交更新
* 取消并返回

### 调用接口

* `GET /api/admin/products/{productId}`
* `GET /api/admin/product-categories`
* `PUT /api/admin/products/{productId}`

### loading 状态

* 首屏详情 loading
* 提交按钮 loading

### 空状态

* 商品不存在或已被删除

### 错误状态

* 详情获取失败时显示错误页
* 更新失败时显示消息提示

### 表单校验

* 与新增页一致
* 不允许清空工艺介绍与传承人信息

### 提交成功后的行为

* 提示更新成功
* 保留当前页并刷新数据，或跳转回商品列表页

## 4. 页面—组件—接口对应表

| 页面 | 组件建议 | 接口 |
| --- | --- | --- |
| 商品列表页 | 分类筛选条、搜索框、商品卡片、分页器 | `GET /api/product-categories`、`GET /api/products` |
| 商品详情页 | 图片轮播、SKU 选择器、详情区、收藏按钮 | `GET /api/products/{productId}`、`GET /api/products/{productId}/skus`、`GET /api/products/{productId}/images`、收藏接口 |
| 商品新增页 | 分类选择器、基础表单、文本域、提交按钮 | `GET /api/admin/product-categories`、`POST /api/admin/products` |
| 商品编辑页 | 详情回填表单、状态展示区、提交按钮 | `GET /api/admin/products/{productId}`、`GET /api/admin/product-categories`、`PUT /api/admin/products/{productId}` |

## 5. 状态处理约定

* 商品详情页中，若全部 SKU 售罄，则显示“已售罄”
* 商品下架时，公开详情页不展示正常内容
* 课程表单页若缺少管理员令牌，不直接静默失败，而是明确提示当前仅用于联调

## 6. 待确认事项

* PC Web 的新增/编辑页最终是否需要独立登录入口；当前建议复用管理员 JWT
