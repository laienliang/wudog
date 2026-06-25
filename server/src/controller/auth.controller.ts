import Router from '@koa/router';
import { AuthService } from '../service/auth.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createAuthRouter(service: AuthService): Router {
  const router = new Router();

  router.post('/public/auth/register', async (ctx: any) => {
    try {
      const { username, password, phone } = ctx.request.body as any;
      if (!username || !password) {
        ctx.status = 400;
        ctx.body = { code: 400, message: '用户名和密码不能为空' };
        return;
      }
      if (password.length < 6) {
        ctx.status = 400;
        ctx.body = { code: 400, message: '密码长度不能少于6位' };
        return;
      }
      const result = await service.register({ username, password, phone });
      ctx.body = { code: 200, message: '注册成功', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.post('/public/auth/login', async (ctx: any) => {
    try {
      const { username, password } = ctx.request.body as any;
      if (!username || !password) {
        ctx.status = 400;
        ctx.body = { code: 400, message: '用户名和密码不能为空' };
        return;
      }
      const result = await service.login(username, password);
      ctx.body = { code: 200, message: '登录成功', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.get('/public/auth/userinfo', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const result = await service.getUserInfo(userId!);
      ctx.body = { code: 200, message: 'success', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/public/auth/profile', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const result = await service.updateProfile(userId!, ctx.request.body as any);
      ctx.body = { code: 200, message: '更新成功', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  return router;
}
