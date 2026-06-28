# Gemini 项目规则

## 1. 工作目录

- 项目根目录：`D:\临时文件\水课任务\人工智能实践`
- 所有新增和修改都必须限制在该目录内

## 2. 固定技术栈

- 后端必须基于 `Cool Admin Midway`
- PC Web 必须使用 `React`
- 管理后台必须使用 `React + Ant Design`
- 微信端必须使用原生微信小程序
- 数据库为 `MySQL`
- 缓存为 `Redis`
- 接口文档为 `Swagger / OpenAPI`
- 协作为 `Git + GitHub`

禁止擅自改成：

- Vue
- cool-admin-vue
- Element Plus
- UniApp
- Taro

## 3. 当前仓库状态

当前仓库已经包含：

- `backend`：可构建、可本地联调的 Cool Admin Midway 后端
- `pc-web`：普通用户 React 端
- `admin-web`：React 管理后台
- `miniapp`：原生微信小程序
- `postman`：接口测试集合
- `backend/sql/init.sql`：业务初始化脚本

## 4. 后端约束

- 后端必须继续复用 Cool 的管理员登录、JWT、角色权限、菜单、统一响应和基础 CRUD
- 不得重复设计管理员、JWT 和权限基础系统
- 第 1 组业务模块固定放在 `backend/src/modules/wudong`
- 普通用户接口与管理接口继续分开：
  - `controller/app`
  - `controller/admin`
- 商品库存只能放在 `product_sku`
- 收藏必须继续由数据库唯一约束 `user_id + product_id` 兜底
- 商品详情必须继续返回：
  - `craftIntro`
  - `inheritorName`
  - `inheritorIntro`
  - 图片集
  - SKU 集
  - 售罄状态
  - 收藏状态

## 5. 开发节奏

- 每次只开发一个阶段
- 修改前先读取相关代码和文档
- 优先增量修改，不重写无关内容
- 不自动删除无关文件
- 不自动提交或推送 Git
- 不自动使用 Docker

## 6. 真实性要求

- 不虚构运行结果
- 不虚构测试结果
- 不用假数据冒充联调成功
- 如需演示成功，必须基于真实后端、真实数据库和真实接口返回

## 7. 阶段结束后的固定输出

每一阶段结束后必须输出：

- 新建文件
- 修改文件
- 执行命令
- 测试结果
- 失败项
- 未解决问题
- 下一阶段建议

输出后立即停止，等待下一阶段指令。
