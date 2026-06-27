import Router from '@koa/router';
import { LikeService } from '../service/like.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createLikeRouter(service: LikeService) {
  const router = new Router();

  router.post('/toggle', requireAuth(), async (ctx: any) => {
    const { target_type, target_id } = ctx.request.body as any;
    if (!target_type || !target_id) { ctx.status = 400; ctx.body = { code: 400, message: 'target_type 和 target_id 不能为空' }; return; }
    try {
      const result = await service.toggle(getUserId(ctx), target_type, Number(target_id));
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
