import Router from '@koa/router';
import { ProductFavoriteService } from '../service/product-favorite.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createProductFavoriteRouter(service: ProductFavoriteService) {
  const router = new Router();

  router.post('/toggle', requireAuth(), async (ctx: any) => {
    const { product_id } = ctx.request.body as any;
    if (!product_id) { ctx.status = 400; ctx.body = { code: 400, message: 'product_id 不能为空' }; return; }
    try {
      const result = await service.toggle(getUserId(ctx), Number(product_id));
      ctx.body = { code: 200, message: 'success', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.get('/list', requireAuth(), async (ctx: any) => {
    const res = await service.list(getUserId(ctx), ctx.query as any);
    ctx.body = { code: 200, message: 'success', data: res };
  });

  return router;
}
