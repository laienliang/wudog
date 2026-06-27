import Router from '@koa/router';
import { RestaurantService } from '../service/restaurant.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createRestaurantRouter(service: RestaurantService) {
  const router = new Router();

  router.get('/list', async (ctx) => {
    const res = await service.list(ctx.query as any);
    ctx.body = { code: 200, message: 'success', data: res };
  });

  router.get('/admin/list', requireAuth('admin'), async (ctx) => {
    const list = await service.listAll();
    ctx.body = { code: 200, message: 'success', data: list };
  });

  router.get('/detail/:id', async (ctx) => {
    try {
      const data = await service.detail(Number(ctx.params.id));
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 404;
      ctx.body = { code: 404, message: e.message };
    }
  });

  router.post('/create', requireAuth('admin'), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const data = await service.create(userId, ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/update/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.update(Number(ctx.params.id), ctx.request.body as any);
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

  router.get('/dish/list', requireAuth('admin'), async (ctx) => {
    const list = await service.listAllDishes(ctx.query.restaurant_id ? Number(ctx.query.restaurant_id) : undefined);
    ctx.body = { code: 200, message: 'success', data: list };
  });

  // Dish routes
  router.post('/dish/create', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.createDish(ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/dish/update/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.updateDish(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.delete('/dish/delete/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      await service.deleteDish(Number(ctx.params.id));
      ctx.body = { code: 200, message: '删除成功' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // Slot routes
  router.get('/slots/:restaurantId', async (ctx) => {
    try {
      const data = await service.detail(Number(ctx.params.restaurantId));
      ctx.body = { code: 200, message: 'success', data: data.slots || [] };
    } catch (e: any) {
      ctx.status = 404;
      ctx.body = { code: 404, message: e.message };
    }
  });

  router.post('/slot/create', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.createSlot(ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/slot/update/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.updateSlot(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.delete('/slot/delete/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      await service.deleteSlot(Number(ctx.params.id));
      ctx.body = { code: 200, message: '删除成功' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  return router;
}
