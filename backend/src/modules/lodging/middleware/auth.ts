// ============================================================
// JWT 认证中间件
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\middleware\auth.ts
// 挂载于 /api/lodging/admin/* 路由
// 验证 Authorization: Bearer <token>
// ============================================================
import { Middleware, IMiddleware, Inject } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';

@Middleware()
export class AuthMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  jwtService: JwtService;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const authHeader = ctx.get('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '未登录或 token 缺失',
          data: null,
        };
        return;
      }

      const token = authHeader.slice(7);
      try {
        const payload = await this.jwtService.verify(token);
        // 将用户信息挂载到 ctx
        (ctx as any).currentUser = payload;
        await next();
      } catch (err) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: 'token 无效或已过期',
          data: null,
        };
      }
    };
  }

  /** 中间件名称 */
  static getName(): string {
    return 'auth';
  }

  /** 仅匹配 /api/lodging/admin/* 路由 */
  match(ctx: Context): boolean {
    return ctx.path.startsWith('/api/lodging/admin');
  }
}
