import Router from '@koa/router';
import { ScenicSpotService } from '../service/scenic-spot.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createScenicSpotRouter(service: ScenicSpotService) {
  const router = new Router();

  router.get('/list', async (ctx) => {
    try {
      const res = await service.list(ctx.query as any);
      ctx.body = { code: 200, message: 'success', data: res };
    } catch (e: any) { ctx.status = 500; ctx.body = { code: 500, message: e.message }; }
  });

  router.get('/admin/list', requireAuth('admin'), async (ctx) => {
    try {
      const list = await service.listAll();
      ctx.body = { code: 200, message: 'success', data: list };
    } catch (e: any) { ctx.status = 500; ctx.body = { code: 500, message: e.message }; }
  });

  router.get('/detail/:id', async (ctx) => {
    try {
      const data = await service.detail(Number(ctx.params.id));
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) { ctx.status = 404; ctx.body = { code: 404, message: e.message }; }
  });

  router.post('/create', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.create(ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) { ctx.status = 400; ctx.body = { code: 400, message: e.message }; }
  });

  router.put('/update/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.update(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) { ctx.status = 400; ctx.body = { code: 400, message: e.message }; }
  });

  router.delete('/delete/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      await service.delete(Number(ctx.params.id));
      ctx.body = { code: 200, message: '删除成功' };
    } catch (e: any) { ctx.status = 400; ctx.body = { code: 400, message: e.message }; }
  });

  // Ticket type routes
  router.get('/ticket-type/list', requireAuth('admin'), async (ctx) => {
    try {
      const list = await service.listAllTicketTypes(ctx.query.spot_id ? Number(ctx.query.spot_id) : undefined);
      ctx.body = { code: 200, message: 'success', data: list };
    } catch (e: any) { ctx.status = 500; ctx.body = { code: 500, message: e.message }; }
  });

  router.post('/ticket-type/create', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.createTicketType(ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) { ctx.status = 400; ctx.body = { code: 400, message: e.message }; }
  });

  router.put('/ticket-type/update/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.updateTicketType(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) { ctx.status = 400; ctx.body = { code: 400, message: e.message }; }
  });

  router.delete('/ticket-type/delete/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      await service.deleteTicketType(Number(ctx.params.id));
      ctx.body = { code: 200, message: '删除成功' };
    } catch (e: any) { ctx.status = 400; ctx.body = { code: 400, message: e.message }; }
  });

  return router;
}
