import Router from '@koa/router';
import { OrderService } from '../service/order.service';
import { requireAuth, getUserId } from '../middleware/auth.middleware';

export function createOrderRouter(service: OrderService): Router {
  const router = new Router();

  // 用户创建订单
  router.post('/public/order/create', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const body = ctx.request.body as any;
      const result = await service.createOrder(userId!, body);
      ctx.body = { code: 200, message: '下单成功', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // 用户订单列表
  router.get('/public/order/list', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const query = ctx.query as any;
      const result = await service.getUserOrders(userId!, { type: query.type, status: query.status, page: parseInt(query.page) || 1, pageSize: parseInt(query.pageSize) || 20 });
      ctx.body = { code: 200, message: 'success', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // 订单详情
  router.get('/public/order/detail/:id', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const id = parseInt(ctx.params.id);
      const result = await service.getOrderDetail(id, userId);
      ctx.body = { code: 200, message: 'success', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // 取消订单
  router.put('/public/order/cancel/:id', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const id = parseInt(ctx.params.id);
      const result = await service.cancelOrder(userId!, id);
      ctx.body = { code: 200, message: '订单已取消', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // 模拟支付（开发阶段）
  router.post('/public/order/pay/:id', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const id = parseInt(ctx.params.id);
      const result = await service.mockPay(userId!, id);
      ctx.body = { code: 200, message: '支付成功', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // 确认收货
  router.put('/public/order/confirm/:id', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const id = parseInt(ctx.params.id);
      const result = await service.confirmReceive(userId!, id);
      ctx.body = { code: 200, message: '已确认收货', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // 管理端 — 全部订单查询
  router.get('/admin/orders', requireAuth('admin'), async (ctx: any) => {
    try {
      const query = ctx.query as any;
      const result = await service.getAllOrders(query);
      ctx.body = { code: 200, message: 'success', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  return router;
}
