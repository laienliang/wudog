import Redis from 'ioredis';

let client: Redis | null = null;

/**
 * 获取 Redis 单例客户端
 * 优先从环境变量读取连接信息，环境变量适合 Docker 部署场景
 */
export function getRedisClient(): Redis {
  if (client && client.status === 'ready') {
    return client;
  }

  const host = process.env.REDIS_HOST || '127.0.0.1';
  const port = parseInt(process.env.REDIS_PORT || '6379', 10);

  client = new Redis({
    host,
    port,
    db: 0,
    keyPrefix: 'wudong:',
    retryStrategy(times) {
      if (times > 10) return null; // 重试 10 次后放弃
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  client.on('error', (err) => {
    console.error('[Redis] 连接异常:', err.message);
  });

  client.on('ready', () => {
    console.log(`[Redis] 已连接 -> ${host}:${port}`);
  });

  // 连接（lazyConnect 模式下需要手动调用）
  client.connect().catch((err) => {
    console.error('[Redis] 连接失败:', err.message);
  });

  return client;
}

/**
 * 获取缓存数据
 * @param key 缓存键
 * @param fetchFn 未命中时的回源函数
 * @param ttl 过期时间（秒），默认 300 秒
 */
export async function withCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = 300
): Promise<T> {
  const redis = getRedisClient();

  if (redis.status === 'ready') {
    try {
      const cached = await redis.get(key);
      if (cached) {
        console.log(`[Cache] 命中 -> ${key}`);
        return JSON.parse(cached) as T;
      }
      console.log(`[Cache] 未命中 -> ${key}`);
    } catch (e) {
      console.error(`[Cache] 读取失败 -> ${key}`, (e as Error).message);
    }
  }

  // 回源查询
  const data = await fetchFn();

  // 写入缓存
  if (redis.status === 'ready' && data) {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
      console.log(`[Cache] 已写入 -> ${key}, TTL=${ttl}s`);
    } catch (e) {
      console.error(`[Cache] 写入失败 -> ${key}`, (e as Error).message);
    }
  }

  return data;
}

/**
 * 按前缀删除缓存
 * @param prefix 缓存键前缀（不含 keyPrefix）
 */
export async function clearCacheByPrefix(prefix: string): Promise<number> {
  const redis = getRedisClient();
  if (redis.status !== 'ready') return 0;

  // ioredis 的 keyPrefix 不会应用到 SCAN 命令上，
  // 需要手动拼接完整前缀进行匹配，再去掉 keyPrefix 后删除
  const fullPrefix = `wudong:${prefix}`;

  let count = 0;
  let cursor = '0';
  do {
    const [newCursor, keys] = await redis.scan(
      cursor,
      'MATCH',
      `${fullPrefix}*`,
      'COUNT',
      100
    );
    cursor = newCursor;
    if (keys.length > 0) {
      // 去掉 keyPrefix 再传给 DEL（ioredis 会自动加回）
      const strippedKeys = keys.map(k => k.replace(/^wudong:/, ''));
      await redis.del(...strippedKeys);
      count += strippedKeys.length;
    }
  } while (cursor !== '0');

  console.log(`[Cache] 清除 ${count} 个键 -> 前缀: ${prefix}`);
  return count;
}
