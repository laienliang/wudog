/**
 * 操作日志中间件
 * 自动记录管理员的写操作（POST/PUT/DELETE）
 */
import { Middleware, Inject } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { OperationLogService } from '../service/operation-log.service';

@Middleware()
export class OperationLogMiddleware {
  @Inject()
  operationLogService: OperationLogService;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const startTime = Date.now();

      // 只记录写操作
      const method = ctx.method.toUpperCase();
      if (!['POST', 'PUT', 'DELETE'].includes(method)) {
        await next();
        return;
      }

      // 跳过登录接口和文件上传
      if (ctx.path.includes('/login') || ctx.path.includes('/upload/file')) {
        await next();
        return;
      }

      await next();

      // 请求完成后记录日志
      try {
        const admin = ctx.state.admin;
        if (!admin) return;

        // 根据路径和方法推断操作类型
        const action = this.getAction(method, ctx.path);
        const target = this.getTarget(ctx.path);

        // 获取请求体（排除敏感信息）
        const body = ctx.request.body ? JSON.parse(JSON.stringify(ctx.request.body)) : {};
        delete body.password;
        delete body.password_hash;
        delete body.token;

        await this.operationLogService.create({
          operator_id: admin.id,
          operator_name: admin.name,
          operator_type: 'admin',
          action,
          target,
          content: JSON.stringify({
            method,
            path: ctx.path,
            body: Object.keys(body).length > 0 ? body : undefined,
            status: ctx.status,
            duration: Date.now() - startTime,
          }).substring(0, 1000),
          ip: ctx.ip || ctx.req.socket.remoteAddress,
          user_agent: ctx.headers['user-agent']?.substring(0, 500),
        } as any);
      } catch (error) {
        // 日志记录失败不影响正常业务
        console.error('操作日志记录失败:', error);
      }
    };
  }

  /**
   * 根据请求方法和路径推断操作类型
   */
  private getAction(method: string, path: string): string {
    if (method === 'DELETE') return 'delete';
    if (path.includes('/approve')) return 'approve';
    if (path.includes('/reject')) return 'reject';
    if (path.includes('/ban')) return 'ban';
    if (path.includes('/unban')) return 'unban';
    if (path.includes('/read')) return 'read';
    if (method === 'POST') return 'create';
    if (method === 'PUT') return 'update';
    return 'other';
  }

  /**
   * 根据路径获取操作对象
   */
  private getTarget(path: string): string {
    const segments = path.split('/').filter(Boolean);
    if (segments.length >= 2) {
      return segments[1]; // api/xxx 中的 xxx
    }
    return path;
  }

  static getName() {
    return 'operationLog';
  }
}
