import Router from '@koa/router';
import { TravelNoteService } from '../service/travel-note.service';
import { CommentService } from '../service/comment.service';
import { LikeService } from '../service/like.service';
import { FollowService } from '../service/follow.service';
import { FavoriteService } from '../service/favorite.service';
import { requireAuth, getUserId, isAdmin } from '../middleware/auth.middleware';

export function createTravelNoteRouter(
  service: TravelNoteService,
  commentService: CommentService,
  likeService: LikeService,
  followService: FollowService,
  favoriteService: FavoriteService,
) {
  const router = new Router();

  router.get('/list', async (ctx) => {
    const res = await service.list(ctx.query as any);
    ctx.body = { code: 200, message: 'success', data: res };
  });

  router.get('/detail/:id', async (ctx) => {
    try {
      const note = await service.detail(Number(ctx.params.id));
      const userId = getUserId(ctx);
      const [liked, favorited, comments] = await Promise.all([
        userId ? likeService.isLiked(userId, 'note', note.id) : false,
        userId ? favoriteService.isFavorited(userId, note.id) : false,
        commentService.list({ noteId: note.id, page: 1, pageSize: 3 }),
      ]);
      const followed = userId ? await followService.isFollowing(userId, note.userId) : false;
      ctx.body = { code: 200, message: 'success', data: { ...note, liked, favorited, followed, comments: comments.list } };
    } catch (e: any) {
      ctx.status = 404;
      ctx.body = { code: 404, message: e.message };
    }
  });

  router.post('/create', requireAuth(), async (ctx: any) => {
    try {
      const note = await service.create(getUserId(ctx), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data: note };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/update/:id', requireAuth(), async (ctx: any) => {
    try {
      const note = await service.update(getUserId(ctx), Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: 'success', data: note };
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

  router.put('/remove/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      await service.remove(Number(ctx.params.id));
      ctx.body = { code: 200, message: '已下架' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.post('/submit-review/:id', requireAuth(), async (ctx: any) => {
    try {
      await service.submitReview(getUserId(ctx), Number(ctx.params.id));
      ctx.body = { code: 200, message: '已提交审核' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/review/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      await service.review(Number(ctx.params.id), ctx.request.body as any);
      ctx.body = { code: 200, message: '审核完成' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  return router;
}
