import Router from '@koa/router';
import { HomestayReviewService } from '../service/homestay-review.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createHomestayReviewRouter(service: HomestayReviewService) {
  const router = new Router();

  router.get('/list', async (ctx) => {
    try {
      const res = await service.list(ctx.query as any);
      ctx.body = { code: 200, message: 'success', data: res };
    } catch (e: any) {
      ctx.status = 500;
      ctx.body = { code: 500, message: e.message };
    }
  });

  router.get('/admin/list', requireAuth('admin'), async (ctx) => {
    try {
      const res = await service.listAll(ctx.query as any);
      ctx.body = { code: 200, message: 'success', data: res };
    } catch (e: any) {
      ctx.status = 500;
      ctx.body = { code: 500, message: e.message };
    }
  });

  router.post('/create', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const data = await service.create(userId, ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/reply/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.reply(Number(ctx.params.id), ctx.request.body.merchant_reply);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.delete('/delete/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      await service.delete(Number(ctx.params.id));
      ctx.body = { code: 200, message: '删除成功' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  return router;
}
