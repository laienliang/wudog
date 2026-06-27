import Router from '@koa/router';
import { TourRouteService } from '../service/tour-route.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createTourRouteRouter(service: TourRouteService) {
  const router = new Router();

  // Route list/detail
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
      const userId = getUserId(ctx);
      const data = await service.create(userId, ctx.request.body as any);
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

  // Itinerary routes
  router.get('/itinerary/list/:routeId', async (ctx) => {
    try {
      const list = await service.listItineraries(Number(ctx.params.routeId));
      ctx.body = { code: 200, message: 'success', data: list };
    } catch (e: any) { ctx.status = 500; ctx.body = { code: 500, message: e.message }; }
  });

  router.post('/itinerary/create', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.createItinerary(ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) { ctx.status = 400; ctx.body = { code: 400, message: e.message }; }
  });

  router.put('/itinerary/update/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.updateItinerary(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) { ctx.status = 400; ctx.body = { code: 400, message: e.message }; }
  });

  router.delete('/itinerary/delete/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      await service.deleteItinerary(Number(ctx.params.id));
      ctx.body = { code: 200, message: '删除成功' };
    } catch (e: any) { ctx.status = 400; ctx.body = { code: 400, message: e.message }; }
  });

  // Transport guide routes
  router.get('/guide/list', async (ctx) => {
    try {
      const res = await service.listGuides(ctx.query as any);
      ctx.body = { code: 200, message: 'success', data: res };
    } catch (e: any) { ctx.status = 500; ctx.body = { code: 500, message: e.message }; }
  });

  router.get('/guide/admin/list', requireAuth('admin'), async (ctx) => {
    try {
      const list = await service.listAllGuides();
      ctx.body = { code: 200, message: 'success', data: list };
    } catch (e: any) { ctx.status = 500; ctx.body = { code: 500, message: e.message }; }
  });

  router.post('/guide/create', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.createGuide(ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) { ctx.status = 400; ctx.body = { code: 400, message: e.message }; }
  });

  router.put('/guide/update/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const data = await service.updateGuide(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data };
    } catch (e: any) { ctx.status = 400; ctx.body = { code: 400, message: e.message }; }
  });

  router.delete('/guide/delete/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      await service.deleteGuide(Number(ctx.params.id));
      ctx.body = { code: 200, message: '删除成功' };
    } catch (e: any) { ctx.status = 400; ctx.body = { code: 400, message: e.message }; }
  });

  return router;
}
