import Router from '@koa/router';
import { ReportService } from '../service/report.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createReportRouter(service: ReportService) {
  const router = new Router();

  router.post('/create', requireAuth(), async (ctx: any) => {
    const { target_type, target_id, reason } = ctx.request.body as any;
    if (!target_type || !target_id || !reason) {
      ctx.status = 400;
      ctx.body = { code: 400, message: 'target_type、target_id 和 reason 不能为空' };
      return;
    }
    try {
      const report = await service.create(getUserId(ctx), { target_type, target_id: Number(target_id), reason });
      ctx.body = { code: 200, message: '举报成功', data: report };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.get('/list', requireAuth('admin'), async (ctx: any) => {
    const res = await service.list(ctx.query as any);
    ctx.body = { code: 200, message: 'success', data: res };
  });

  router.put('/handle/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const result = await service.handle(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: '处理完成', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  return router;
}
