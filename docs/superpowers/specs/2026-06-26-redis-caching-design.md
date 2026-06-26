# Redis 缓存优化设计方案

**项目**：乌东文旅"衣食住行"综合管理平台  
**日期**：2026-06-26  
**目标**：通过 Redis 缓存优化首页和列表页接口性能  
**策略**：Controller 层缓存 + 最终一致性 + 懒加载模式

---

## 一、背景与目标

### 1.1 当前状态

- 项目已配置 Redis 服务（Docker Compose），但后端使用本地文件缓存
- 首页和列表页接口直接查询数据库，响应时间 200-500ms
- 高并发场景下数据库压力较大

### 1.2 优化目标

- **性能提升**：首页和列表页响应时间降低到 10-50ms（缓存命中时）
- **减轻数据库压力**：缓存命中率达到 70% 以上
- **用户体验**：页面加载速度提升 5-20 倍

### 1.3 技术约束

- 采用 Cool-Admin 原生 `@CoolCache` 装饰器，保持代码简洁
- 最终一致性策略，允许缓存延迟 30-60 分钟
- 懒加载模式，无需预热和主动失效逻辑

---

## 二、架构设计

### 2.1 缓存层级

```
┌─────────────┐
│   PC Web    │
│  小程序端    │
└──────┬──────┘
       │ HTTP
       ↓
┌─────────────┐
│  Midway.js  │
│ Controller  │ ← @CoolCache 装饰器（缓存层）
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Service   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   MySQL     │
└─────────────┘

       ↕
┌─────────────┐
│    Redis    │ ← 缓存存储
└─────────────┘
```

### 2.2 Redis 配置

**连接参数**：
- 本地开发：`localhost:6379`
- Docker 环境：`redis:6379`（服务名）
- 无密码认证
- 默认使用 db0

**内存限制**：
- `maxmemory`: 512MB
- `maxmemory-policy`: allkeys-lru（最近最少使用淘汰）

---

## 三、需要缓存的接口

### 3.1 平台核心接口（优先级 ⭐⭐⭐）

| 接口路径 | 方法 | 缓存时长 | 说明 |
|---------|------|---------|------|
| `/open/client/home` | GET | 30 分钟 | 首页聚合数据（Banner、热门商品、推荐内容） |
| `/open/client/categories` | GET | 1 小时 | 前台分类和话题列表 |
| `/open/client/page` | GET | 30 分钟 | 前台频道分页（按类型查询） |
| `/open/client/search` | GET | 15 分钟 | 全站搜索 |

**文件位置**：`cool-admin-midway/src/modules/platform/controller/open/client.ts`

### 3.2 业务模块列表接口（优先级 ⭐⭐）

#### 衣（非遗商品）
- `/open/clothing/goods/list` — 30 分钟
- `/open/clothing/goods/page` — 30 分钟
- `/open/clothing/category/list` — 1 小时

#### 食（餐饮美食）
- `/open/food/restaurant/list` — 30 分钟
- `/open/food/dish/list` — 30 分钟
- `/open/food/agricultureGoods/list` — 30 分钟

#### 住（民宿住宿）
- `/open/lodging/hostel/list` — 30 分钟
- `/open/lodging/roomType/list` — 30 分钟

#### 行（旅行出行）
- `/open/travel/scenic/list` — 30 分钟
- `/open/travel/route/list` — 30 分钟
- `/open/travel/guide/list` — 30 分钟

#### 社区（UGC）
- `/open/community/article/list` — 15 分钟
- `/open/community/article/page` — 15 分钟
- `/open/community/topic/list` — 1 小时

### 3.3 缓存时长策略

| 数据类型 | TTL | 理由 |
|---------|-----|------|
| 基础配置（分类、话题、Banner） | 1 小时 | 变化频率极低 |
| 商品和内容列表 | 30 分钟 | 平衡性能和数据新鲜度 |
| UGC 内容（社区文章） | 15 分钟 | 用户发布频率较高 |
| 搜索接口 | 15 分钟 | 防止缓存爆炸 |

---

## 四、实现方式

### 4.1 启用 Redis 缓存

**修改文件**：`cool-admin-midway/src/config/config.default.ts`

```typescript
// 1. 安装依赖
// npm install cache-manager-ioredis-yet

// 2. 导入 redisStore
import { redisStore } from 'cache-manager-ioredis-yet';

// 3. 替换 cacheManager 配置
export default {
  cacheManager: {
    clients: {
      default: {
        store: redisStore,
        options: {
          port: 6379,
          host: process.env.REDIS_HOST || '127.0.0.1',
          password: process.env.REDIS_PASSWORD || '',
          ttl: 0, // 由装饰器控制 TTL
          db: 0,
        },
      },
    },
  },
} as MidwayConfig;
```

### 4.2 添加 @CoolCache 装饰器

#### 示例一：无参数接口

```typescript
import { CoolCache } from '@cool-midway/core';

export class OpenPlatformClientController extends BaseController {
  @CoolCache(30 * 60 * 1000) // 30 分钟
  @Get('/home', { summary: '首页聚合数据' })
  async home() {
    return this.ok(await this.platformClientService.home());
  }

  @CoolCache(60 * 60 * 1000) // 1 小时
  @Get('/categories', { summary: '前台分类与话题' })
  async categories() {
    return this.ok(await this.platformClientService.categories());
  }
}
```

#### 示例二：带参数接口

```typescript
@CoolCache(30 * 60 * 1000)
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

**缓存 key 生成规则**：
```
cache:{ControllerName}:{MethodName}:{参数JSON}
```

示例：
- `cache:OpenPlatformClientController:home`
- `cache:OpenPlatformClientController:page:{"type":"clothing","page":1,"pageSize":10}`

#### 示例三：覆写标准 CRUD 接口

对于 `@CoolController` 自动生成的 `list` 和 `page` 接口，需要手动覆写并添加缓存：

```typescript
@CoolController({
  api: ['page', 'info', 'list'],
  entity: ClothingGoodsEntity,
  service: ClothingGoodsService,
})
export class OpenClothingGoodsController extends BaseController {
  @Inject()
  clothingGoodsService: ClothingGoodsService;

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
}
```

### 4.3 缓存失效策略

**采用被动失效（TTL 过期）**：
- 不主动清除缓存，依赖 Redis TTL 自动过期
- 后台更新数据后，前台最多 30-60 分钟后看到变化
- 如需立即生效，可手动清除缓存（后续扩展功能）

**手动清除缓存（可选）**：
```typescript
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';

export class SomeService {
  @Inject()
  cachingFactory: CachingFactory;

  async clearCache(key: string) {
    const cache: MidwayCache = this.cachingFactory.getCache('default');
    await cache.del(key);
  }
}
```

---

## 五、监控与调优

### 5.1 缓存命中率监控

**方式一：Redis INFO 命令**

```bash
redis-cli INFO stats | grep keyspace
```

查看指标：
- `keyspace_hits`：缓存命中次数
- `keyspace_misses`：缓存未命中次数
- **命中率** = hits / (hits + misses)

目标：命中率 ≥ 70%

**方式二：应用层日志（可选）**

在关键接口添加日志，记录缓存命中/未命中：

```typescript
@Get('/home')
async home() {
  const startTime = Date.now();
  const result = await this.platformClientService.home();
  const duration = Date.now() - startTime;
  this.logger.info(`[Cache] home API took ${duration}ms`);
  return this.ok(result);
}
```

### 5.2 内存使用监控

**查看 Redis 内存占用**：
```bash
redis-cli INFO memory
```

关键指标：
- `used_memory_human`：当前内存使用
- `maxmemory_human`：内存限制

**建议配置**：
```redis
maxmemory 512mb
maxmemory-policy allkeys-lru
```

**内存评估**：
- 预估缓存 key 数量：5000-20000 个
- 每个缓存条目大小：1KB-50KB
- 总内存需求：100MB-500MB

### 5.3 性能预期

| 场景 | 响应时间 | 提升倍数 |
|------|---------|---------|
| 首次访问（缓存未命中） | 200-500ms | 基线 |
| 缓存命中 | 10-50ms | **5-20x** |

### 5.4 调优方向

1. **命中率低于 70%**：延长 TTL 或优化参数组合
2. **Redis 内存占用过高**：缩短 TTL 或限制缓存的参数组合
3. **访问量极低的接口**：不添加缓存，避免内存浪费

---

## 六、风险与回滚方案

### 6.1 潜在风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| Redis 服务故障 | 应用无法启动或缓存失效 | 回滚到文件缓存 |
| 缓存穿透 | 恶意查询导致数据库压力 | 限流 + 空值缓存（后续扩展） |
| 数据不一致 | 用户看到过期数据 | 调整 TTL 或增加手动失效机制 |
| 内存溢出 | Redis OOM | 设置 maxmemory 和淘汰策略 |

### 6.2 回滚方案

如果 Redis 缓存出现问题，可以快速回滚到文件缓存：

**步骤**：
1. 修改 `config.default.ts`，切换回 `CoolCacheStore`：
   ```typescript
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
2. 重启应用
3. 不影响业务逻辑，只是性能回退

---

## 七、实施计划

### 7.1 第一阶段：基础配置（1 小时）

- [ ] 安装 `cache-manager-ioredis-yet` 依赖
- [ ] 修改 `config.default.ts` 启用 Redis
- [ ] 重启应用，验证 Redis 连接

### 7.2 第二阶段：核心接口缓存（2-3 小时）

- [ ] 添加平台核心接口缓存（首页、分类、搜索）
- [ ] 测试缓存命中和过期逻辑
- [ ] 监控性能提升效果

### 7.3 第三阶段：业务模块缓存（3-4 小时）

- [ ] 添加衣食住行四大模块列表接口缓存
- [ ] 添加社区模块接口缓存
- [ ] 全面测试各模块接口

### 7.4 第四阶段：监控与优化（1-2 小时）

- [ ] 配置 Redis 内存限制和淘汰策略
- [ ] 监控缓存命中率
- [ ] 根据实际情况调整 TTL

**总工时预估**：7-10 小时

---

## 八、后续优化方向

1. **Service 层缓存**：对于跨接口复用的基础数据（字典、分类），可以在 Service 层添加缓存
2. **缓存预热**：应用启动时预加载热门数据
3. **主动失效**：后台更新数据时，通过消息队列或事件机制清除对应缓存
4. **缓存穿透防护**：对不存在的查询结果也缓存（空值缓存）
5. **分布式缓存一致性**：多实例部署时，通过 Redis Pub/Sub 同步缓存失效事件

---

## 九、参考资料

- [Midway.js 缓存文档](http://www.midwayjs.org/docs/extensions/caching)
- [Cool-Admin 缓存示例](cool-admin-midway/src/modules/demo/controller/open/cache.ts)
- [Redis 官方文档](https://redis.io/docs/)
- [cache-manager-ioredis-yet](https://github.com/dabroek/cache-manager-ioredis-yet)
