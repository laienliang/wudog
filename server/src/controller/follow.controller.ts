import Router from '@koa/router';
import { FollowService } from '../service/follow.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createFollowRouter(service: FollowService) {
  const router = new Router();

  router.post('/toggle', requireAuth(), async (ctx: any) => {
    const { followed_id } = ctx.request.body as any;
    if (!followed_id) { ctx.status = 400; ctx.body = { code: 400, message: 'followed_id 不能为空' }; return; }
    try {
      const result = await service.toggle(getUserId(ctx), followed_id);
      ctx.body = { code: 200, message: 'success', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.get('/list', async (ctx) => {
    const res = await service.list(ctx.query as any);
    ctx.body = { code: 200, message: 'success', data: res };
  });

  return router;
}
