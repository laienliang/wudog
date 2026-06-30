import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

/**
 * 未授权/权限不足异常
 */
export class UnauthorizedError extends Error {
  constructor(message: string, public statusCode = 401) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
  statusCode: number;
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
  statusCode: number;
}

export class BusinessError extends Error {
  constructor(message: string, public statusCode = 422) {
    super(message);
    this.name = 'BusinessError';
  }
}

@Catch([UnauthorizedError, ForbiddenError, NotFoundError, BusinessError])
export class BusinessErrorFilter {
  async catch(err: any, ctx: Context) {
    ctx.status = err.statusCode || 400;

    return {
      code: err.statusCode || 400,
      message: err.message || '请求处理失败',
      data: null,
      timestamp: Date.now(),
      requestId: ctx.requestId || '',
    };
  }
}
