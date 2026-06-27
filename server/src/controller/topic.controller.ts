import Router from '@koa/router';
import { TopicService } from '../service/topic.service';
import { requireAuth } from '../middleware/auth.middleware';

export function createTopicRouter(service: TopicService) {
  const router = new Router();

  router.get('/list', async (ctx) => {
    const res = await service.list(ctx.query as any);
    ctx.body = { code: 200, message: 'success', data: res };
  });

  router.get('/detail/:id', async (ctx) => {
    const topic = await service.detail(Number(ctx.params.id));
    if (!topic) { ctx.status = 404; ctx.body = { code: 404, message: '话题不存在' }; return; }
    ctx.body = { code: 200, message: 'success', data: topic };
  });

  router.post('/create', requireAuth('admin'), async (ctx: any) => {
    try {
      const topic = await service.create(ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data: topic };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/update/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const topic = await service.update(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data: topic };
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
