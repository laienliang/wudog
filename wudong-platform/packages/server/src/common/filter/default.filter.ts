import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

/**
 * 默认异常过滤器
 * 捕获所有未处理异常，返回统一错误响应
 */
@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    ctx.logger.error('[DefaultError]', err.message, err.stack);

    ctx.status = 500;
    return {
      code: 500,
      message: '服务器内部错误，请稍后重试',
      data: null,
      timestamp: Date.now(),
      requestId: ctx.requestId || '',
    };
  }
}
