import Router from '@koa/router';
import { RestaurantBookingService } from '../service/restaurant-booking.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createRestaurantBookingRouter(service: RestaurantBookingService) {
  const router = new Router();

  router.get('/list', requireAuth(), async (ctx) => {
    try {
      const userId = getUserId(ctx);
      const res = await service.list(userId, ctx.query as any);
      ctx.body = { code: 200, message: 'success', data: res };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.get('/admin/list', requireAuth('admin'), async (ctx) => {
    try {
      const res = await service.listAll(ctx.query as any);
      ctx.body = { code: 200, message: 'success', data: res };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
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

  router.put('/status/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.updateStatus(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/cancel/:id', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const data = await service.cancel(userId, Number(ctx.params.id));
      ctx.body = { code: 200, message: '已取消', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  return router;
}
