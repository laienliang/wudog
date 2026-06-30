import { Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { v4 as uuidv4 } from 'uuid';

/**
 * 统一响应格式中间件
 * 所有成功响应包装为：{ code, message, data, timestamp, requestId }
 */
@Middleware()
export class ResponseInterceptor {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const requestId = uuidv4();
      ctx.requestId = requestId;

      try {
        const result = await next();

        // 如果 body 已经是标准格式，不重复包装
        if (result && result.code !== undefined) {
          return result;
        }

        return {
          code: 200,
          message: 'success',
          data: result ?? null,
          timestamp: Date.now(),
          requestId,
        };
      } catch (err) {
        throw err; // 交给 filter 处理
      }
    };
  }

  match(ctx: Context) {
    // 只处理 API 路由
    return ctx.path.startsWith('/api/');
  }
}
