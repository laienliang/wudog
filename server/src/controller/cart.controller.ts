import Router from '@koa/router';
import { CartService } from '../service/cart.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createCartRouter(service: CartService): Router {
  const router = new Router();

  router.get('/public/cart/list', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const result = await service.getCart(userId!);
      ctx.body = { code: 200, message: 'success', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.post('/public/cart/add', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const { product_id, sku_id, quantity, source_module } = ctx.request.body as any;
      if (!product_id) {
        ctx.status = 400;
        ctx.body = { code: 400, message: '商品ID不能为空' };
        return;
      }
      const result = await service.addItem(userId!, { product_id, sku_id, quantity: quantity || 1, source_module: source_module || 'module1' });
      ctx.body = { code: 200, message: '添加成功', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/public/cart/update/:id', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const id = parseInt(ctx.params.id);
      const { quantity } = ctx.request.body as any;
      const result = await service.updateItem(userId!, id, quantity);
      ctx.body = { code: 200, message: '更新成功', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.delete('/public/cart/delete/:id', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const id = parseInt(ctx.params.id);
      await service.deleteItem(userId!, id);
      ctx.body = { code: 200, message: '删除成功' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.delete('/public/cart/clear', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      await service.clearCart(userId!);
      ctx.body = { code: 200, message: '已清空' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  return router;
}
