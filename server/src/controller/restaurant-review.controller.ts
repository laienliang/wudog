import Router from '@koa/router';
import { RestaurantReviewService } from '../service/restaurant-review.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createRestaurantReviewRouter(service: RestaurantReviewService) {
  const router = new Router();

  router.get('/list', async (ctx) => {
    const { target_type, target_id, page, pageSize } = ctx.query as any;
    if (!target_type || !target_id) {
      ctx.status = 400;
      ctx.body = { code: 400, message: 'target_type 和 target_id 为必填' };
      return;
    }
    const res = await service.list(target_type, Number(target_id), { page: Number(page) || 1, pageSize: Number(pageSize) || 20 });
    ctx.body = { code: 200, message: 'success', data: res };
  });

  router.get('/admin/list', requireAuth('admin'), async (ctx) => {
    const res = await service.listAll(ctx.query as any);
    ctx.body = { code: 200, message: 'success', data: res };
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
      const { merchant_reply } = ctx.request.body as any;
      if (!merchant_reply) {
        ctx.status = 400;
        ctx.body = { code: 400, message: '回复内容不能为空' };
        return;
      }
      const data = await service.reply(Number(ctx.params.id), merchant_reply);
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
