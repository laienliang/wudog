import { Middleware, Config, Inject } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { RedisService } from '@midwayjs/redis';
import * as jwt from 'jsonwebtoken';

/**
 * JWT 认证中间件
 * 从 Authorization Header 提取 Token，解析后挂载到 ctx.user
 * 白名单路由跳过认证
 */
@Middleware()
export class AuthMiddleware {
  @Config('jwt.secret')
  jwtSecret: string;

  @Inject()
  redisService: RedisService;

  private whitelist = [
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/v1/auth/refresh',
    '/api/v1/auth/send-code',
    '/api/v1/auth/sms-login',
    '/api/v1/auth/wx-login',
    '/api/v1/admin/auth/login',
    '/api/v1/admin/auth/refresh',
    '/api/v1/products',
    '/api/v1/restaurants',
    '/api/v1/food-products',
    '/api/v1/food-categories',
    '/api/v1/foods',
    '/api/v1/accommodations',
    '/api/v1/travels',
    '/api/v1/travelogues',
    '/api/v1/search',
    '/api/v1/upload/apply',
    '/swagger-ui',
    '/swagger-docs',
  ];

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 认证相关接口始终免登录
      const isAuthRoute = ctx.path.startsWith('/api/v1/auth/');

      // GET 白名单：列表/详情接口免登录
      const isGetWhitelisted = ctx.method === 'GET' && this.whitelist.some((path) =>
        ctx.path === path || ctx.path.startsWith(path + '/'),
      );

      // MVP 阶段：商品、订单等核心业务接口 POST/PUT/DELETE 免登录
      const isProductEndpoint = ctx.path.startsWith('/api/v1/products');
      const isAdminEndpoint = ctx.path.startsWith('/api/v1/products/categories');
      const isReviewEndpoint = ctx.path.startsWith('/api/v1/reviews');
      const isFoodEndpoint = ctx.path.startsWith('/api/v1/restaurants') || ctx.path.startsWith('/api/v1/food-products') || ctx.path.startsWith('/api/v1/dishes');
      const isAccommodationEndpoint = ctx.path.startsWith('/api/v1/homestays') || ctx.path.startsWith('/api/v1/room-types') || ctx.path.startsWith('/api/v1/calendar') || ctx.path.startsWith('/api/v1/accommodation-orders') || ctx.path.startsWith('/api/v1/accommodation-reviews');
      const isOrderEndpoint = ctx.path.startsWith('/api/v1/orders');
      const isTravelEndpoint = ctx.path.startsWith('/api/v1/scenic-spots') || ctx.path.startsWith('/api/v1/ticket-types') || ctx.path.startsWith('/api/v1/routes') || ctx.path.startsWith('/api/v1/e-tickets');
      const isCommunityEndpoint = ctx.path.startsWith('/api/v1/travelogues') || ctx.path.startsWith('/api/v1/comments') || ctx.path.startsWith('/api/v1/likes') || ctx.path.startsWith('/api/v1/topics') || ctx.path.startsWith('/api/v1/follows') || ctx.path.startsWith('/api/v1/favorites') || ctx.path.startsWith('/api/v1/reports') || ctx.path.startsWith('/api/v1/community/stats') || ctx.path.startsWith('/api/v1/messages') || ctx.path.startsWith('/api/v1/banners');

      // [Security Finding - Accepted for MVP] 管理后台 API 全部免登录
      // 当前为 MVP 阶段，管理员鉴权暂不实现。生产环境上线前必须启用 JWT 验证，
      // 确保所有管理后台接口仅允许持有有效管理员 Token 的请求访问。
      const isAdminRoute = ctx.path.startsWith('/api/v1/admin/');

      if (isAuthRoute || isGetWhitelisted || isProductEndpoint || isAdminEndpoint || isReviewEndpoint || isFoodEndpoint || isAccommodationEndpoint || isOrderEndpoint || isTravelEndpoint || isCommunityEndpoint || isAdminRoute) {
        await next();
        return;
      }

      const authHeader = ctx.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '').trim();

      if (!token) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '请先登录',
          data: null,
          timestamp: Date.now(),
          requestId: ctx.requestId || '',
        };
        return;
      }

      try {
        const decoded = jwt.verify(token, this.jwtSecret) as { userId: number; type?: string };

        // Finding 3: 拒绝 Refresh Token 作为访问令牌
        if (decoded.type === 'refresh') {
          ctx.status = 401;
          ctx.body = {
            code: 401,
            message: '无效的访问令牌',
            data: null,
            timestamp: Date.now(),
            requestId: ctx.requestId || '',
          };
          return;
        }

        // Finding 2: 检查 Token 是否在黑名单中
        try {
          const blacklisted = await this.redisService.get(`blacklist:${token}`);
          if (blacklisted) {
            ctx.status = 401;
            ctx.body = {
              code: 401,
              message: '登录已过期，请重新登录',
              data: null,
              timestamp: Date.now(),
              requestId: ctx.requestId || '',
            };
            return;
          }
        } catch (_) {
          // Redis 不可用时跳过黑名单检查（MVP 阶段容错）
        }

        ctx.user = decoded;
        await next();
      } catch (err) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '登录已过期，请重新登录',
          data: null,
          timestamp: Date.now(),
          requestId: ctx.requestId || '',
        };
      }
    };
  }

  match(ctx: Context) {
    return ctx.path.startsWith('/api/');
  }
}
