# Redis 缓存优化实现计划

> **对于代理执行者**：必需：使用 superpowers:subagent-driven-development（如果子代理可用）或 superpowers:executing-plans 执行此计划。步骤使用复选框（`- [ ]`）语法来跟踪。

**目标**：通过 Controller 层 @CoolCache 装饰器优化首页和列表页接口性能，将响应时间从 200-500ms 降低到 10-50ms（缓存命中时）。

**架构**：在现有 Cool-Admin 框架基础上，启用 Redis 作为缓存后端，使用 @CoolCache 装饰器在 Controller 方法上添加缓存，采用最终一致性策略和懒加载模式。

**技术栈**：Midway.js、TypeScript、Redis、cache-manager-ioredis-yet、Cool-Admin 8.x

---

## 文件结构规划

### 需要修改的文件

**第一阶段（基础配置）**：
- `cool-admin-midway/src/config/config.default.ts` — 启用 Redis 缓存配置

**第二阶段（平台核心接口）**：
- `cool-admin-midway/src/modules/platform/controller/open/client.ts` — 添加 4 个接口缓存

**第三阶段（业务模块接口）**：
- `cool-admin-midway/src/modules/clothing/controller/open/category.ts` — 分类列表缓存
- `cool-admin-midway/src/modules/clothing/controller/open/goods.ts` — 商品列表和分页缓存
- `cool-admin-midway/src/modules/food/controller/open/restaurant.ts` — 餐厅列表缓存
- `cool-admin-midway/src/modules/food/controller/open/dish.ts` — 菜品列表缓存
- `cool-admin-midway/src/modules/food/controller/open/agricultureGoods.ts` — 农产品列表缓存
- `cool-admin-midway/src/modules/lodging/controller/open/hostel.ts` — 民宿列表缓存
- `cool-admin-midway/src/modules/lodging/controller/open/roomType.ts` — 房型列表缓存
- `cool-admin-midway/src/modules/travel/controller/open/scenic.ts` — 景点列表缓存
- `cool-admin-midway/src/modules/travel/controller/open/route.ts` — 路线列表缓存
- `cool-admin-midway/src/modules/travel/controller/open/guide.ts` — 导游列表缓存
- `cool-admin-midway/src/modules/community/controller/open/article.ts` — 文章列表和分页缓存
- `cool-admin-midway/src/modules/community/controller/open/topic.ts` — 话题列表缓存

**文档**：
- `docs/superpowers/plans/2026-06-26-redis-caching-implementation.md` — 本实现计划

---

## 实施流程

### 阶段一：基础配置与依赖安装

#### Task 1: 安装 cache-manager-ioredis-yet 依赖

**文件**：
- `cool-admin-midway/package.json`

- [ ] **Step 1：查看当前依赖**

进入项目根目录：
```bash
cd cool-admin-midway
npm list cache-manager
```

预期输出：显示 `@midwayjs/cache-manager` 已安装，但 `cache-manager-ioredis-yet` 未安装。

- [ ] **Step 2：安装依赖**

```bash
npm install cache-manager-ioredis-yet
```

预期输出：
```
added X packages, and audited XXX packages
```

- [ ] **Step 3：验证安装**

```bash
npm list cache-manager-ioredis-yet
```

预期输出：显示 `cache-manager-ioredis-yet@X.X.X`

- [ ] **Step 4：提交**

```bash
git add package.json package-lock.json
git commit -m "deps: 安装 cache-manager-ioredis-yet"
```

---

#### Task 2: 修改 Redis 缓存配置

**文件**：
- `cool-admin-midway/src/config/config.default.ts`

- [ ] **Step 1：打开配置文件**

```bash
cat cool-admin-midway/src/config/config.default.ts | head -20
```

确认文件存在且包含 cacheManager 配置。

- [ ] **Step 2：修改配置文件启用 Redis**

在 `config.default.ts` 顶部导入 `redisStore`，并替换 cacheManager 配置：

修改前（第 8-62 行）：
```typescript
// redis缓存
// import { redisStore } from 'cache-manager-ioredis-yet';

// ...

cacheManager: {
  clients: {
    default: {
      store: CoolCacheStore,
      options: {
        path: pCachePath(),
        ttl: 0,
      },
    },
  },
},
```

修改后：
```typescript
// redis缓存
import { redisStore } from 'cache-manager-ioredis-yet';

// ...

cacheManager: {
  clients: {
    default: {
      store: redisStore,
      options: {
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        host: process.env.REDIS_HOST || '127.0.0.1',
        password: process.env.REDIS_PASSWORD || '',
        ttl: 0,
        db: 0,
      },
    },
  },
},
```

同时注释掉原有的文件缓存配置。

- [ ] **Step 3：验证配置语法**

```bash
cd cool-admin-midway
npm run lint
```

预期输出：无 TypeScript 或 ESLint 错误。

- [ ] **Step 4：提交**

```bash
git add src/config/config.default.ts
git commit -m "config: 启用 Redis 缓存后端"
```

---

#### Task 3: 本地测试 Redis 连接

**测试方式**：启动应用并验证 Redis 连接成功

- [ ] **Step 1：启动 Docker Compose**

```bash
docker-compose up -d
```

验证 MySQL 和 Redis 容器已启动：
```bash
docker-compose ps
```

预期输出：mysql、redis、midway 容器状态为 `Up`。

- [ ] **Step 2：查看后端日志**

```bash
docker-compose logs midway | grep -i redis
```

预期输出：看到连接成功的日志，例如 `Redis connection established`。

- [ ] **Step 3：验证 Redis 可访问**

```bash
redis-cli -p 16379 ping
```

预期输出：`PONG`

- [ ] **Step 4：记录测试结果**

创建临时文本文件记录测试通过，待 Task 完成后删除。

---

### 阶段二：平台核心接口缓存

#### Task 4: 添加平台 home 接口缓存

**文件**：
- `cool-admin-midway/src/modules/platform/controller/open/client.ts`

- [ ] **Step 1：打开 Controller 文件**

```bash
cat cool-admin-midway/src/modules/platform/controller/open/client.ts | head -30
```

确认文件包含 `OpenPlatformClientController` 和 `home()` 方法。

- [ ] **Step 2：添加导入语句**

在文件顶部添加（如果已存在则跳过）：
```typescript
import { CoolCache } from '@cool-midway/core';
```

- [ ] **Step 3：在 home() 方法添加缓存装饰器**

修改前：
```typescript
@Get('/home', { summary: '首页聚合数据' })
async home() {
  return this.ok(await this.platformClientService.home());
}
```

修改后：
```typescript
@CoolCache(30 * 60 * 1000) // 30 分钟
@Get('/home', { summary: '首页聚合数据' })
async home() {
  return this.ok(await this.platformClientService.home());
}
```

- [ ] **Step 4：验证语法**

```bash
npm run lint
```

预期输出：无错误。

- [ ] **Step 5：测试接口**

启动应用，调用接口：
```bash
curl http://localhost:8001/open/client/home
```

第一次调用：观察响应时间（应为 200-500ms）
第二次调用：观察响应时间（应为 10-50ms，缓存命中）

- [ ] **Step 6：提交**

```bash
git add src/modules/platform/controller/open/client.ts
git commit -m "cache: 添加首页聚合接口缓存（30分钟）"
```

---

#### Task 5: 添加平台 categories 接口缓存

**文件**：
- `cool-admin-midway/src/modules/platform/controller/open/client.ts`

- [ ] **Step 1：在 categories() 方法添加缓存装饰器**

修改前：
```typescript
@Get('/categories', { summary: '前台分类与话题' })
async categories() {
  return this.ok(await this.platformClientService.categories());
}
```

修改后：
```typescript
@CoolCache(60 * 60 * 1000) // 1 小时
@Get('/categories', { summary: '前台分类与话题' })
async categories() {
  return this.ok(await this.platformClientService.categories());
}
```

- [ ] **Step 2：验证语法**

```bash
npm run lint
```

- [ ] **Step 3：测试接口**

```bash
curl http://localhost:8001/open/client/categories
```

验证响应正确且缓存生效。

- [ ] **Step 4：提交**

```bash
git add src/modules/platform/controller/open/client.ts
git commit -m "cache: 添加分类和话题列表缓存（1小时）"
```

---

#### Task 6: 添加平台 channelPage 接口缓存

**文件**：
- `cool-admin-midway/src/modules/platform/controller/open/client.ts`

- [ ] **Step 1：在 channelPage() 方法添加缓存装饰器**

修改前：
```typescript
@Get('/page', { summary: '前台频道分页' })
async channelPage(
  @Query('type') type,
  @Query('page') page: number,
  @Query('pageSize') pageSize: number,
  @Query('keyword') keyword: string,
  @Query('categoryId') categoryId: number,
  @Query('status') status: number
) {
  return this.ok(
    await this.platformClientService.page(type, {
      page,
      pageSize,
      keyword,
      categoryId,
      status,
    })
  );
}
```

修改后：
```typescript
@CoolCache(30 * 60 * 1000) // 30 分钟
@Get('/page', { summary: '前台频道分页' })
async channelPage(
  @Query('type') type,
  @Query('page') page: number,
  @Query('pageSize') pageSize: number,
  @Query('keyword') keyword: string,
  @Query('categoryId') categoryId: number,
  @Query('status') status: number
) {
  return this.ok(
    await this.platformClientService.page(type, {
      page,
      pageSize,
      keyword,
      categoryId,
      status,
    })
  );
}
```

- [ ] **Step 2：验证语法和测试**

```bash
npm run lint
curl "http://localhost:8001/open/client/page?type=clothing&page=1&pageSize=10"
```

- [ ] **Step 3：提交**

```bash
git add src/modules/platform/controller/open/client.ts
git commit -m "cache: 添加前台频道分页缓存（30分钟）"
```

---

#### Task 7: 添加平台 search 接口缓存

**文件**：
- `cool-admin-midway/src/modules/platform/controller/open/client.ts`

- [ ] **Step 1：在 search() 方法添加缓存装饰器**

修改前：
```typescript
@Get('/search', { summary: '全站搜索' })
async search(@Query('keyword') keyword: string, @Query('limit') limit: number) {
  return this.ok(await this.platformClientService.search(keyword, limit));
}
```

修改后：
```typescript
@CoolCache(15 * 60 * 1000) // 15 分钟
@Get('/search', { summary: '全站搜索' })
async search(@Query('keyword') keyword: string, @Query('limit') limit: number) {
  return this.ok(await this.platformClientService.search(keyword, limit));
}
```

- [ ] **Step 2：验证和测试**

```bash
npm run lint
curl "http://localhost:8001/open/client/search?keyword=test&limit=10"
```

- [ ] **Step 3：提交**

```bash
git add src/modules/platform/controller/open/client.ts
git commit -m "cache: 添加全站搜索缓存（15分钟）"
```

---

### 阶段三：业务模块列表接口缓存

#### Task 8: 衣模块 — 添加商品和分类缓存

**文件**：
- `cool-admin-midway/src/modules/clothing/controller/open/category.ts`
- `cool-admin-midway/src/modules/clothing/controller/open/goods.ts`

- [ ] **Step 1：修改 category.ts**

添加导入：
```typescript
import { CoolCache } from '@cool-midway/core';
```

在 list 方法添加缓存（1 小时）：
```typescript
@CoolCache(60 * 60 * 1000)
@Get('/list', { summary: '分类列表' })
async list(@Query() query) {
  return this.ok(await this.clothingCategoryService.list(query));
}
```

- [ ] **Step 2：修改 goods.ts**

添加导入和缓存装饰器到 list 和 page 方法：

```typescript
import { CoolCache } from '@cool-midway/core';

@CoolCache(30 * 60 * 1000)
@Get('/list', { summary: '商品列表' })
async list(@Query() query) {
  return this.ok(await this.clothingGoodsService.list(query));
}

@CoolCache(30 * 60 * 1000)
@Post('/page', { summary: '商品分页' })
async page(@Body() body) {
  return this.ok(await this.clothingGoodsService.page(body));
}
```

- [ ] **Step 3：验证语法**

```bash
npm run lint
```

- [ ] **Step 4：测试接口**

```bash
curl http://localhost:8001/open/clothing/category/list
curl http://localhost:8001/open/clothing/goods/list
curl -X POST http://localhost:8001/open/clothing/goods/page -H "Content-Type: application/json" -d '{"page":1,"pageSize":10}'
```

- [ ] **Step 5：提交**

```bash
git add src/modules/clothing/controller/open/
git commit -m "cache: 添加衣模块列表和分类缓存"
```

---

#### Task 9: 食模块 — 添加餐厅、菜品、农产品缓存

**文件**：
- `cool-admin-midway/src/modules/food/controller/open/restaurant.ts`
- `cool-admin-midway/src/modules/food/controller/open/dish.ts`
- `cool-admin-midway/src/modules/food/controller/open/agricultureGoods.ts`

对每个文件的 list 和 page 方法（如存在）添加 `@CoolCache(30 * 60 * 1000)` 装饰器。

- [ ] **Step 1：修改 restaurant.ts、dish.ts、agricultureGoods.ts**

示例（restaurant.ts）：
```typescript
import { CoolCache } from '@cool-midway/core';

@CoolCache(30 * 60 * 1000)
@Get('/list', { summary: '餐厅列表' })
async list(@Query() query) {
  return this.ok(await this.foodRestaurantService.list(query));
}

@CoolCache(30 * 60 * 1000)
@Post('/page', { summary: '餐厅分页' })
async page(@Body() body) {
  return this.ok(await this.foodRestaurantService.page(body));
}
```

重复此模式到 dish.ts 和 agricultureGoods.ts。

- [ ] **Step 2：验证语法**

```bash
npm run lint
```

- [ ] **Step 3：测试**

```bash
curl http://localhost:8001/open/food/restaurant/list
curl http://localhost:8001/open/food/dish/list
curl http://localhost:8001/open/food/agricultureGoods/list
```

- [ ] **Step 4：提交**

```bash
git add src/modules/food/controller/open/
git commit -m "cache: 添加食模块列表缓存"
```

---

#### Task 10: 住模块 — 添加民宿和房型缓存

**文件**：
- `cool-admin-midway/src/modules/lodging/controller/open/hostel.ts`
- `cool-admin-midway/src/modules/lodging/controller/open/roomType.ts`

对每个文件的 list 和 page 方法添加 `@CoolCache(30 * 60 * 1000)` 装饰器。

- [ ] **Step 1：修改文件**

```typescript
import { CoolCache } from '@cool-midway/core';

@CoolCache(30 * 60 * 1000)
@Get('/list', { summary: '民宿列表' })
async list(@Query() query) {
  return this.ok(await this.lodgingHostelService.list(query));
}
```

- [ ] **Step 2：验证和测试**

```bash
npm run lint
curl http://localhost:8001/open/lodging/hostel/list
curl http://localhost:8001/open/lodging/roomType/list
```

- [ ] **Step 3：提交**

```bash
git add src/modules/lodging/controller/open/
git commit -m "cache: 添加住模块列表缓存"
```

---

#### Task 11: 行模块 — 添加景点、路线、导游缓存

**文件**：
- `cool-admin-midway/src/modules/travel/controller/open/scenic.ts`
- `cool-admin-midway/src/modules/travel/controller/open/route.ts`
- `cool-admin-midway/src/modules/travel/controller/open/guide.ts`

对每个文件的 list 和 page 方法添加 `@CoolCache(30 * 60 * 1000)` 装饰器。

- [ ] **Step 1：修改文件**

```typescript
import { CoolCache } from '@cool-midway/core';

@CoolCache(30 * 60 * 1000)
@Get('/list', { summary: '景点列表' })
async list(@Query() query) {
  return this.ok(await this.travelScenicService.list(query));
}
```

- [ ] **Step 2：验证和测试**

```bash
npm run lint
curl http://localhost:8001/open/travel/scenic/list
curl http://localhost:8001/open/travel/route/list
curl http://localhost:8001/open/travel/guide/list
```

- [ ] **Step 3：提交**

```bash
git add src/modules/travel/controller/open/
git commit -m "cache: 添加行模块列表缓存"
```

---

#### Task 12: 社区模块 — 添加文章和话题缓存

**文件**：
- `cool-admin-midway/src/modules/community/controller/open/article.ts`
- `cool-admin-midway/src/modules/community/controller/open/topic.ts`

- [ ] **Step 1：修改 article.ts**

对 list 和 page 方法添加 `@CoolCache(15 * 60 * 1000)`（15 分钟）：

```typescript
import { CoolCache } from '@cool-midway/core';

@CoolCache(15 * 60 * 1000)
@Get('/list', { summary: '文章列表' })
async list(@Query() query) {
  return this.ok(await this.communityArticleService.list(query));
}

@CoolCache(15 * 60 * 1000)
@Post('/page', { summary: '文章分页' })
async page(@Body() body) {
  return this.ok(await this.communityArticleService.page(body));
}
```

- [ ] **Step 2：修改 topic.ts**

对 list 方法添加 `@CoolCache(60 * 60 * 1000)`（1 小时）：

```typescript
import { CoolCache } from '@cool-midway/core';

@CoolCache(60 * 60 * 1000)
@Get('/list', { summary: '话题列表' })
async list(@Query() query) {
  return this.ok(await this.communityTopicService.list(query));
}
```

- [ ] **Step 3：验证和测试**

```bash
npm run lint
curl http://localhost:8001/open/community/article/list
curl http://localhost:8001/open/community/topic/list
```

- [ ] **Step 4：提交**

```bash
git add src/modules/community/controller/open/
git commit -m "cache: 添加社区模块列表缓存"
```

---

### 阶段四：验证与优化

#### Task 13: 性能测试与缓存验证

- [ ] **Step 1：使用 Apache Bench 进行性能测试**

首先访问一次接口来预热缓存：
```bash
curl http://localhost:8001/open/client/home
```

使用 ab 工具进行基准测试（20 次请求）：
```bash
ab -n 20 -c 1 http://localhost:8001/open/client/home
```

记录平均响应时间（应为 10-50ms）。

- [ ] **Step 2：监控 Redis 缓存命中率**

```bash
redis-cli -p 16379 INFO stats
```

查看输出中的 `keyspace_hits` 和 `keyspace_misses`，计算命中率：
```
命中率 = keyspace_hits / (keyspace_hits + keyspace_misses)
```

目标：≥70%

- [ ] **Step 3：测试缓存过期**

等待适当的 TTL 时间（或调整 TTL 以加速测试），验证缓存过期后重新查询数据库。

- [ ] **Step 4：创建测试报告**

创建文件 `docs/redis-caching-test-report.md`，记录：
- 性能提升指标
- 缓存命中率
- 内存使用情况
- 发现的问题和优化建议

---

#### Task 14: Redis 内存监控配置

- [ ] **Step 1：查看 Redis 内存使用**

```bash
redis-cli -p 16379 INFO memory
```

记录 `used_memory_human` 和 `maxmemory_human`。

- [ ] **Step 2：配置 Redis 内存限制（如需要）**

如果内存占用过高，可通过 Docker 环境变量或 Redis 配置文件设置：
```redis
maxmemory 512mb
maxmemory-policy allkeys-lru
```

- [ ] **Step 3：记录配置**

在 `docs/redis-caching-test-report.md` 中补充内存配置和监控结果。

---

### 阶段五：总结与优化建议

#### Task 15: 生成最终报告和文档

- [ ] **Step 1：更新设计文档附注**

在 `docs/superpowers/specs/2026-06-26-redis-caching-design.md` 中添加"实施总结"部分，记录：
- 实际应用接口数量
- 性能提升数据
- 遇到的问题和解决方案

- [ ] **Step 2：提交所有改动**

```bash
git add docs/
git commit -m "docs: 添加 Redis 缓存实施总结和测试报告"
```

- [ ] **Step 3：创建优化建议文档**

创建 `docs/redis-caching-future-improvements.md`，记录：
1. Service 层缓存扩展
2. 缓存预热机制
3. 主动失效策略
4. 缓存穿透防护
5. 分布式一致性方案

---

## 测试检查清单

- [ ] Redis 连接成功
- [ ] 所有 Controller 文件语法无误
- [ ] 首页接口缓存正常（首次 200-500ms，后续 10-50ms）
- [ ] 平台核心接口（home、categories、page、search）缓存生效
- [ ] 衣食住行各模块列表接口缓存生效
- [ ] 社区模块文章和话题缓存生效
- [ ] 缓存命中率 ≥70%
- [ ] Redis 内存使用在预期范围内（<512MB）
- [ ] 缓存 TTL 过期后数据刷新正常
- [ ] 并发测试下缓存稳定性良好

---

## 提交日志模板

按以下顺序提交：

1. `deps: 安装 cache-manager-ioredis-yet`
2. `config: 启用 Redis 缓存后端`
3. `cache: 添加首页聚合接口缓存（30分钟）`
4. `cache: 添加分类和话题列表缓存（1小时）`
5. `cache: 添加前台频道分页缓存（30分钟）`
6. `cache: 添加全站搜索缓存（15分钟）`
7. `cache: 添加衣模块列表和分类缓存`
8. `cache: 添加食模块列表缓存`
9. `cache: 添加住模块列表缓存`
10. `cache: 添加行模块列表缓存`
11. `cache: 添加社区模块列表缓存`
12. `docs: 添加 Redis 缓存实施总结和测试报告`

---

## 工时估算

- 阶段一（基础配置）：1 小时
- 阶段二（平台核心接口）：1-1.5 小时
- 阶段三（业务模块接口）：2-3 小时
- 阶段四（验证与优化）：1-1.5 小时
- 阶段五（总结与文档）：0.5-1 小时

**总计**：5.5-8.5 小时

---

## 回滚方案

如果 Redis 缓存出现问题，立即切换回文件缓存：

1. 修改 `config.default.ts`，将 cacheManager 改回 `CoolCacheStore`
2. 重启应用
3. 业务逻辑不受影响，仅性能回退

