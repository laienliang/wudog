import Router from '@koa/router';
import { ProductCategoryService } from '../service/product-category.service';
import { requireAuth } from '../middleware/auth.middleware';

export function createProductCategoryRouter(service: ProductCategoryService) {
  const router = new Router();

  router.get('/list', async (ctx) => {
    const list = await service.list(false);
    ctx.body = { code: 200, message: 'success', data: list };
  });

  router.get('/admin/list', requireAuth('admin'), async (ctx) => {
    const list = await service.list(true);
    ctx.body = { code: 200, message: 'success', data: list };
  });

  router.get('/detail/:id', async (ctx) => {
    const cat = await service.detail(Number(ctx.params.id));
    if (!cat) { ctx.status = 404; ctx.body = { code: 404, message: '分类不存在' }; return; }
    ctx.body = { code: 200, message: 'success', data: cat };
  });

  router.post('/create', requireAuth('admin'), async (ctx: any) => {
    try {
      const cat = await service.create(ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data: cat };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/update/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const cat = await service.update(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data: cat };
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
