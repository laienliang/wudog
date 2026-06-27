import Router from '@koa/router';
import { FarmProductService } from '../service/farm-product.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createFarmProductRouter(service: FarmProductService) {
  const router = new Router();

  // Category routes
  router.get('/category/list', async (ctx) => {
    const list = await service.listCategories(false);
    ctx.body = { code: 200, message: 'success', data: list };
  });

  router.get('/category/admin/list', requireAuth('admin'), async (ctx) => {
    const list = await service.listCategories(true);
    ctx.body = { code: 200, message: 'success', data: list };
  });

  router.post('/category/create', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.createCategory(ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/category/update/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.updateCategory(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.delete('/category/delete/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      await service.deleteCategory(Number(ctx.params.id));
      ctx.body = { code: 200, message: '删除成功' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // Product routes
  router.get('/list', async (ctx) => {
    const res = await service.list(ctx.query as any);
    ctx.body = { code: 200, message: 'success', data: res };
  });

  router.get('/admin/list', requireAuth('admin'), async (ctx) => {
    const res = await service.listAll(ctx.query as any);
    ctx.body = { code: 200, message: 'success', data: res };
  });

  router.get('/detail/:id', async (ctx) => {
    try {
      const product = await service.detail(Number(ctx.params.id));
      ctx.body = { code: 200, message: 'success', data: product };
    } catch (e: any) {
      ctx.status = 404;
      ctx.body = { code: 404, message: e.message };
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

  router.put('/update/:id', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const data = await service.update(userId, Number(ctx.params.id), ctx.request.body as any);
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
