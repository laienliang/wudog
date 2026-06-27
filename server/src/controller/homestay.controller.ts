import Router from '@koa/router';
import { HomestayService } from '../service/homestay.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createHomestayRouter(service: HomestayService) {
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

  // Room type routes
  router.get('/room-type/list', requireAuth('admin'), async (ctx) => {
    const list = await service.listAllRoomTypes(ctx.query.homestay_id ? Number(ctx.query.homestay_id) : undefined);
    ctx.body = { code: 200, message: 'success', data: list };
  });

  router.post('/room-type/create', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.createRoomType(ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/room-type/update/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.updateRoomType(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.delete('/room-type/delete/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      await service.deleteRoomType(Number(ctx.params.id));
      ctx.body = { code: 200, message: '删除成功' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // Calendar routes
  router.get('/calendar/:roomTypeId', requireAuth('admin'), async (ctx) => {
    const { start_date, end_date } = ctx.query;
    const rows = await service.getCalendar(Number(ctx.params.roomTypeId), (start_date as string) || '', (end_date as string) || '');
    ctx.body = { code: 200, message: 'success', data: rows };
  });

  router.post('/calendar/batch/:roomTypeId', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.batchUpdateCalendar(Number(ctx.params.roomTypeId), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  return router;
}
