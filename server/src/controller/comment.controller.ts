import Router from '@koa/router';
import { CommentService } from '../service/comment.service';
import { requireAuth, getUserId, isAdmin } from '../middleware/auth.middleware';

export function createCommentRouter(service: CommentService) {
  const router = new Router();

  router.get('/list', async (ctx) => {
    const res = await service.list(ctx.query as any);
    ctx.body = { code: 200, message: 'success', data: res };
  });

  router.post('/create', requireAuth(), async (ctx: any) => {
    try {
      const comment = await service.create(getUserId(ctx), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data: comment };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.delete('/delete/:id', requireAuth(), async (ctx: any) => {
    try {
      await service.delete(getUserId(ctx), Number(ctx.params.id), isAdmin(ctx));
      ctx.body = { code: 200, message: '删除成功' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  return router;
}
