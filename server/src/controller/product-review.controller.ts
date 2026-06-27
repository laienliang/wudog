import Router from '@koa/router';
import { ProductReviewService } from '../service/product-review.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createProductReviewRouter(service: ProductReviewService) {
  const router = new Router();

  router.get('/list', async (ctx) => {
    const res = await service.list(ctx.query as any);
    ctx.body = { code: 200, message: 'success', data: res };
  });

  router.get('/admin/list', requireAuth('admin'), async (ctx) => {
    const res = await service.listAll(ctx.query as any);
    ctx.body = { code: 200, message: 'success', data: res };
  });

  router.post('/create', requireAuth(), async (ctx: any) => {
    const { product_id, rating } = ctx.request.body as any;
    if (!product_id || !rating) { ctx.status = 400; ctx.body = { code: 400, message: 'product_id 和 rating 不能为空' }; return; }
    try {
      const review = await service.create(getUserId(ctx), ctx.request.body as any);
      ctx.body = { code: 200, message: '评价成功', data: review };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/reply/:id', requireAuth('admin'), async (ctx: any) => {
    const { reply } = ctx.request.body as any;
    if (!reply) { ctx.status = 400; ctx.body = { code: 400, message: '回复内容不能为空' }; return; }
    try {
      const review = await service.reply(Number(ctx.params.id), reply);
      ctx.body = { code: 200, message: '回复成功', data: review };
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
