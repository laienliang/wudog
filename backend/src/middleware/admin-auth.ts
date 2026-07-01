import { Inject, Middleware } from '@midwayjs/core';
import { IWebMiddleware, NextFunction, Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';

const PUBLIC_ROUTES = [
  { method: 'GET', pattern: '/api/product/list' },
  { method: 'GET', pattern: '/api/product/detail/' },
  { method: 'GET', pattern: '/api/product-category/list' },
  { method: 'GET', pattern: '/api/product-category/detail/' },
  { method: 'POST', pattern: '/api/admin/login' },
  { method: 'POST', pattern: '/api/user/register' },
  { method: 'POST', pattern: '/api/user/login' },
  { method: 'POST', pattern: '/api/upload/' },
  { method: 'GET', pattern: '/uploads/' },
];

const USER_AUTH_ROUTES = [
  { method: 'GET', pattern: '/api/user/info' },
  { method: 'PUT', pattern: '/api/user/update' },
  { method: 'POST', pattern: '/api/product-favorite/toggle' },
  { method: 'GET', pattern: '/api/product-favorite/list' },
  { method: 'GET', pattern: '/api/cart/' },
  { method: 'POST', pattern: '/api/cart/' },
  { method: 'PUT', pattern: '/api/cart/' },
  { method: 'DELETE', pattern: '/api/cart/' },
  { method: 'POST', pattern: '/api/order/' },
  { method: 'PUT', pattern: '/api/order/request-cancel/' },
  { method: 'PUT', pattern: '/api/order/request-return/' },
  { method: 'PUT', pattern: '/api/order/revoke-cancel/' },
  { method: 'GET', pattern: '/api/address/list' },
  { method: 'POST', pattern: '/api/address/create' },
  { method: 'PUT', pattern: '/api/address/update/' },
  { method: 'DELETE', pattern: '/api/address/delete/' },
  { method: 'PUT', pattern: '/api/address/set-default/' },
];

// 管理员专属接口
const ADMIN_AUTH_ROUTES = [
  { method: 'PUT', pattern: '/api/order/update-status/' },
  { method: 'PUT', pattern: '/api/order/approve-cancel/' },
  { method: 'PUT', pattern: '/api/order/reject-cancel/' },
  { method: 'DELETE', pattern: '/api/order/' },
];

// 用户和管理员均可访问的接口
const SHARED_AUTH_ROUTES = [
  { method: 'GET', pattern: '/api/order/' },
  { method: 'POST', pattern: '/api/chat/send' },
  { method: 'GET', pattern: '/api/chat/conversation/' },
  { method: 'GET', pattern: '/api/chat/unread/' },
  { method: 'GET', pattern: '/api/chat/admin/conversations' },
  { method: 'POST', pattern: '/api/review/create' },
  { method: 'GET', pattern: '/api/review/product/' },
  { method: 'GET', pattern: '/api/review/my' },
  { method: 'GET', pattern: '/api/review/list' },
  { method: 'PUT', pattern: '/api/review/reply/' },
  { method: 'DELETE', pattern: '/api/review/delete/' },
];

function matchRoute(method: string, path: string, routes: { method: string; pattern: string }[]) {
  return routes.some(route => method === route.method && path.startsWith(route.pattern));
}

@Middleware()
export class AdminAuthMiddleware implements IWebMiddleware {
  @Inject()
  jwtService: JwtService;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const { path, method } = ctx;

      if (method === 'OPTIONS') {
        await next();
        return;
      }

      if (matchRoute(method, path, PUBLIC_ROUTES)) {
        await next();
        return;
      }

      const authHeader = ctx.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        ctx.status = 200;
        ctx.body = { code: 401, message: '未登录或token无效', data: null };
        return;
      }

      const token = authHeader.slice(7);

      try {
        const decoded = await this.jwtService.verify(token) as any;

        if (matchRoute(method, path, ADMIN_AUTH_ROUTES)) {
          if (decoded.type !== 'admin') {
            ctx.status = 200;
            ctx.body = { code: 401, message: '权限不足', data: null };
            return;
          }
          ctx.adminUser = decoded;
          await next();
          return;
        }

        if (matchRoute(method, path, USER_AUTH_ROUTES)) {
          if (decoded.type !== 'user') {
            ctx.status = 200;
            ctx.body = { code: 401, message: '权限不足', data: null };
            return;
          }
          ctx.user = decoded;
          await next();
          return;
        }

        if (matchRoute(method, path, SHARED_AUTH_ROUTES)) {
          if (decoded.type === 'admin') {
            ctx.adminUser = decoded;
          } else {
            ctx.user = decoded;
          }
          await next();
          return;
        }

        // 其他需要登录的接口，admin和user均可访问
        if (decoded.type === 'admin') {
          ctx.adminUser = decoded;
        } else {
          ctx.user = decoded;
        }
        await next();
      } catch {
        ctx.status = 200;
        ctx.body = { code: 401, message: 'token已过期或无效', data: null };
      }
    };
  }
}
