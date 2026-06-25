# 乌东文旅平台 - 微信小程序端搭建完成

## 已完成工作

### 1. 小程序项目结构
```
miniprogram/
  app.js               # 小程序入口
  app.json             # 全局配置（页面路由、窗口样式）
  app.wxss             # 全局样式
  sitemap.json         # 小程序配置
  utils/
    request.js         # 请求封装（wx.request 统一封装）
  pages/
    index/            # 首页/列表页
      index.js         # 列表页逻辑（搜索、筛选、分页加载）
      index.json       # 页面配置（下拉刷新）
      index.wxml       # 列表页结构（搜索栏、筛选栏、卡片列表）
      index.wxss       # 列表页样式
    detail/           # 详情页
      detail.js        # 详情页逻辑（获取详情、预览图片、跳转下单）
      detail.json      # 页面配置
      detail.wxml      # 详情页结构（轮播图、基本信息、设施、房型列表）
      detail.wxss      # 详情页样式
    order/            # 下单页
      order.js         # 下单页逻辑（表单验证、提交订单）
      order.json       # 页面配置
      order.wxml       # 下单页结构（订单信息、入住人表单、提交按钮）
      order.wxss      # 下单页样式
```

### 2. 功能实现
- ✅ **首页/列表页**：展示住宿列表，支持搜索、按苗寨筛选、分页加载
- ✅ **详情页**：展示住宿详情（主图轮播、评分、价格、设施、入住须知、房型列表），支持选择日期、跳转下单
- ✅ **下单页**：填写入住人信息、提交订单（调用 POST /api/order 接口）

### 3. 接口调用
- `GET /api/accommodation` - 获取住宿列表
- `GET /api/accommodation/detail/:id` - 获取住宿详情（需后端返回房型列表）
- `GET /api/room/:id` - 获取房型详情（下单页使用）
- `POST /api/order` - 创建订单

## 后续步骤

### 1. 修改后端接口（必需）
**问题**：住宿详情接口（`GET /api/accommodation/detail/:id`）当前只返回住宿信息，不包含房型列表。

**解决方案**：修改 `backend/src/controller/accommodation.controller.ts` 的 `detail` 方法，添加房型列表查询。

修改示例代码：
```typescript
// 在 AccommodationController 中注入 RoomService
@Inject()
roomService: RoomService;

// 修改 detail 方法
@Get('/detail/:id')
async detail(@Param('id') id: number) {
  if (!id) return fail('参数错误：id 不能为空');
  const accommodation = await this.accommodationService.detail(Number(id));
  if (!accommodation) return fail('住宿不存在', 404);

  // 获取该住宿下的所有房型
  const roomsResult = await this.roomService.list({ accommodationId: id, pageSize: 100 });
  const rooms = roomsResult.list || [];

  // 返回包含房型列表的详情
  return success({
    ...accommodation,
    rooms
  });
}
```

### 2. 在微信开发者工具中运行
1. 打开「微信开发者工具」
2. 选择「导入项目」
3. 项目目录选择 `miniprogram` 文件夹
4. 填入 AppID（测试可使用测试号）
5. 在项目设置中开启「不校验合法域名」
6. 确保后端服务运行在 `http://localhost:3000`
7. 编译运行

### 3. 真机调试（可选）
如果需要真机调试，需要修改 `utils/request.js` 中的 `BASE_URL`，将 `localhost` 改为本机 IP（如 `http://192.168.x.x:3000`）。

## 注意事项
1. 小程序本地开发时需在微信开发者工具中开启「不校验合法域名」
2. 用户登录功能暂未实现，订单提交时使用模拟用户ID（userId=1）
3. 后端服务需先启动（`cd backend && npm run dev`）
4. 数据库需先导入种子数据（执行 `backend/sql/seed_data.sql`）

## 测试账号
- 用户名：tourist01，密码：123456
- 用户名：traveler02，密码：123456
（订单提交时使用 userId=1 对应 tourist01）
