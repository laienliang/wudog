import Router from '@koa/router';
import { ProductService } from '../service/product.service';
import { ProductReviewService } from '../service/product-review.service';
import { ProductFavoriteService } from '../service/product-favorite.service';
import { requireAuth, getUserId, isAdmin } from '../middleware/auth.middleware';

export function createProductRouter(
  service: ProductService,
  reviewService: ProductReviewService,
  favoriteService: ProductFavoriteService,
) {
  const router = new Router();

  router.get('/list', async (ctx) => {
    const res = await service.list(ctx.query as any);
    ctx.body = { code: 200, message: 'success', data: res };
  });

  router.get('/detail/:id', async (ctx) => {
    try {
      const product = await service.detail(Number(ctx.params.id));
      const userId = getUserId(ctx);
      const favorited = userId ? await favoriteService.isFavorited(userId, product.id) : false;
      ctx.body = { code: 200, message: 'success', data: { ...product, favorited } };
    } catch (e: any) {
      ctx.status = 404;
      ctx.body = { code: 404, message: e.message };
    }
  });

  router.post('/create', requireAuth(), async (ctx: any) => {
    try {
      const product = await service.create(getUserId(ctx), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data: product };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/update/:id', requireAuth(), async (ctx: any) => {
    try {
      const product = await service.update(getUserId(ctx), Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data: product };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.delete('/delete/:id', requireAuth(), async (ctx: any) => {
    try {
      await service.delete(getUserId(ctx), Number(ctx.params.id), isAdmin(ctx));
      ctx.body = { code: 200, message: '删除成功' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/remove/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      await service.remove(Number(ctx.params.id));
      ctx.body = { code: 200, message: '已下架' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.post('/submit-review/:id', requireAuth(), async (ctx: any) => {
    try {
      await service.submitReview(getUserId(ctx), Number(ctx.params.id));
      ctx.body = { code: 200, message: '已提交审核' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/review/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      await service.review(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: '审核完成' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  return router;
}
