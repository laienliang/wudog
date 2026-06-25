import jwt from 'jsonwebtoken';
import config from '../config/config';

export function authMiddleware() {
  return async (ctx: any, next: any) => {
    const authHeader = ctx.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.state.user = undefined;
    } else {
      const token = authHeader.split(' ')[1];
      try {
        ctx.state.user = jwt.verify(token, config.jwt.secret);
      } catch {
        ctx.state.user = undefined;
      }
    }
    await next();
  };
}

export function requireAuth(requiredRole?: string) {
  return async (ctx: any, next: any) => {
    const user = ctx.state.user;
    if (!user) {
      ctx.status = 401;
      ctx.body = { code: 401, message: '请先登录' };
      return;
    }
    if (requiredRole && user.role !== requiredRole && user.role !== 'super_admin') {
      ctx.status = 403;
      ctx.body = { code: 403, message: '无权限' };
      return;
    }
    await next();
  };
}

export function getUserId(ctx: any): number | null {
  return ctx.state?.user?.id || null;
}

export function isAdmin(ctx: any): boolean {
  const role = ctx.state?.user?.role;
  return role === 'admin' || role === 'super_admin';
}
