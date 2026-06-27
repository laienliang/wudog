import Router from '@koa/router';
import { AuthService } from '../service/auth.service';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { MerchantApplication } from '../entity/merchant-application.entity';
import { Banner } from '../entity/banner.entity';
import { Notification } from '../entity/notification.entity';
import { OperationLog } from '../entity/operation-log.entity';
import { Order } from '../entity/order.entity';
import { requireAuth, getUserId, isAdmin } from '../middleware/auth.middleware';

export function createAdminRouter(
  authService: AuthService,
  userRepo: Repository<User>,
  merchantAppRepo: Repository<MerchantApplication>,
  bannerRepo: Repository<Banner>,
  notifRepo: Repository<Notification>,
  logRepo: Repository<OperationLog>,
  orderRepo: Repository<Order>,
): Router {
  const router = new Router();

  // ====== 管理端登录 ======
  router.post('/admin/login', async (ctx: any) => {
    try {
      const { username, password } = ctx.request.body as any;
      const result = await authService.login(username, password);
      if (result.user.role !== 'admin' && result.user.role !== 'super_admin') {
        ctx.status = 403;
        ctx.body = { code: 403, message: '无管理权限' };
        return;
      }

      // 记录操作日志
      const log = logRepo.create({
        operator_id: result.user.id,
        operator_name: result.user.username,
        action: 'admin_login',
        content: '管理员登录',
        ip: ctx.ip,
      });
      await logRepo.save(log);

      ctx.body = { code: 200, message: '登录成功', data: result };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // ====== 工作台统计 ======
  router.get('/admin/dashboard', requireAuth('admin'), async (ctx: any) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [totalUsers, totalOrders, totalRevenue, todayOrders, pendingMerchants] = await Promise.all([
        userRepo.count({ where: { is_deleted: 0 } }),
        orderRepo.count({ where: { is_deleted: 0 } }),
        orderRepo.createQueryBuilder('o')
          .select('SUM(o.pay_amount)', 'total')
          .where('o.status IN (:...statuses)', { statuses: ['paid', 'shipped', 'completed'] })
          .andWhere('o.is_deleted = 0')
          .getRawOne(),
        orderRepo.createQueryBuilder('o')
          .where('o.is_deleted = 0')
          .andWhere('o.created_at >= :today', { today })
          .getCount(),
        merchantAppRepo.count({ where: { status: 'pending' } }),
      ]);

      ctx.body = {
        code: 200, message: 'success', data: {
          totalUsers,
          totalOrders,
          totalRevenue: parseInt(String(totalRevenue?.total || 0)),
          todayOrders,
          pendingMerchants,
        },
      };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // ====== 用户管理 ======
  router.get('/admin/users', requireAuth('admin'), async (ctx: any) => {
    try {
      const { page = 1, pageSize = 20, keyword } = ctx.query as any;
      const qb = userRepo.createQueryBuilder('u').where('u.is_deleted = 0');
      if (keyword) qb.andWhere('u.username LIKE :kw OR u.phone LIKE :kw', { kw: `%${keyword}%` });

      const [list, total] = await qb
        .orderBy('u.created_at', 'DESC')
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const safeList = list.map(u => ({
        id: u.id, username: u.username, phone: u.phone ? u.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : null,
        avatar: u.avatar, role: u.role, status: u.status, created_at: u.created_at,
      }));

      ctx.body = { code: 200, message: 'success', data: { list: safeList, total, page: parseInt(String(page)), pageSize: parseInt(String(pageSize)) } };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/admin/users/status/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const id = parseInt(ctx.params.id);
      const { status } = ctx.request.body as any;
      const user = await userRepo.findOne({ where: { id } });
      if (!user) throw new Error('用户不存在');
      user.status = status;
      await userRepo.save(user);
      ctx.body = { code: 200, message: '更新成功' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // ====== 商家入驻审核 ======
  router.get('/admin/merchant-applications', requireAuth('admin'), async (ctx: any) => {
    try {
      const { status, page = 1, pageSize = 20 } = ctx.query as any;
      const where: any = {};
      if (status) where.status = status;

      const [list, total] = await merchantAppRepo.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      ctx.body = { code: 200, message: 'success', data: { list, total, page: parseInt(String(page)), pageSize: parseInt(String(pageSize)) } };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.post('/admin/merchant-applications/review/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const id = parseInt(ctx.params.id);
      const userId = getUserId(ctx);
      const { action, remark } = ctx.request.body as any;

      const app = await merchantAppRepo.findOne({ where: { id } });
      if (!app) throw new Error('申请不存在');

      if (action === 'approve') {
        app.status = 'approved';
        // 升级用户为商家
        const user = await userRepo.findOne({ where: { id: app.user_id } });
        if (user && user.role === 'tourist') {
          user.role = 'merchant';
          await userRepo.save(user);
        }
      } else {
        app.status = 'rejected';
        app.review_remark = remark || '';
      }
      app.reviewer_id = userId!;
      app.reviewed_at = new Date();
      await merchantAppRepo.save(app);

      ctx.body = { code: 200, message: '审核完成' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // ====== 轮播图管理 ======
  router.get('/admin/banners', async (ctx: any) => {
    const list = await bannerRepo.find({ where: { is_deleted: 0 }, order: { sort_order: 'ASC' } });
    ctx.body = { code: 200, message: 'success', data: list };
  });

  router.post('/admin/banners', requireAuth('admin'), async (ctx: any) => {
    try {
      const banner = bannerRepo.create(ctx.request.body as any);
      const saved = await bannerRepo.save(banner);
      ctx.body = { code: 200, message: '创建成功', data: saved };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.put('/admin/banners/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const id = parseInt(ctx.params.id);
      const banner = await bannerRepo.findOne({ where: { id } });
      if (!banner) throw new Error('轮播图不存在');
      Object.assign(banner, ctx.request.body);
      await bannerRepo.save(banner);
      ctx.body = { code: 200, message: '更新成功' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.delete('/admin/banners/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const id = parseInt(ctx.params.id);
      const banner = await bannerRepo.findOne({ where: { id } });
      if (!banner) throw new Error('轮播图不存在');
      banner.is_deleted = 1;
      await bannerRepo.save(banner);
      ctx.body = { code: 200, message: '删除成功' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // ====== 消息通知 ======
  router.get('/admin/notifications', requireAuth('admin'), async (ctx: any) => {
    try {
      const { page = 1, pageSize = 20 } = ctx.query as any;
      const [list, total] = await notifRepo.findAndCount({
        order: { created_at: 'DESC' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      ctx.body = { code: 200, message: 'success', data: { list, total, page: parseInt(String(page)), pageSize: parseInt(String(pageSize)) } };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.post('/admin/notifications/send', requireAuth('admin'), async (ctx: any) => {
    try {
      const { user_id, type, title, content } = ctx.request.body as any;
      const notif = notifRepo.create({ user_id, type: type || 'system', title, content });
      await notifRepo.save(notif);
      ctx.body = { code: 200, message: '发送成功' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // ====== 操作日志 ======
  router.get('/admin/operation-logs', requireAuth('admin'), async (ctx: any) => {
    try {
      const { page = 1, pageSize = 50 } = ctx.query as any;
      const [list, total] = await logRepo.findAndCount({
        order: { created_at: 'DESC' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      ctx.body = { code: 200, message: 'success', data: { list, total, page: parseInt(String(page)), pageSize: parseInt(String(pageSize)) } };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // ====== 订单管理 ======
  router.put('/admin/orders/status/:id', requireAuth('admin'), async (ctx: any) => {
    try {
      const id = parseInt(ctx.params.id);
      const { status } = ctx.request.body as any;
      const validStatuses = ['pending', 'paid', 'confirmed', 'shipped', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) throw new Error('无效的订单状态');
      const order = await orderRepo.findOne({ where: { id, is_deleted: 0 } });
      if (!order) throw new Error('订单不存在');
      order.status = status;
      if (status === 'confirmed' || status === 'shipped' || status === 'completed') {
        const log = logRepo.create({
          operator_id: getUserId(ctx)!,
          operator_name: (ctx.state.user as any).username,
          action: 'order_status',
          target_type: 'order',
          target_id: id,
          content: `订单状态变更: ${status}`,
          ip: ctx.ip,
        });
        await logRepo.save(log);
      }
      await orderRepo.save(order);
      ctx.body = { code: 200, message: '状态更新成功' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  // ====== 商家入驻申请（用户端） ======
  router.post('/public/merchant/apply', requireAuth(), async (ctx: any) => {
    try {
      const userId = getUserId(ctx);
      const data = ctx.request.body as any;
      const exist = await merchantAppRepo.findOne({ where: { user_id: userId, status: 'pending' } });
      if (exist) throw new Error('您已有待审核的申请');

      const app = merchantAppRepo.create({
        user_id: userId,
        shop_name: data.shop_name,
        module: data.module,
        business_type: data.business_type,
        contact_name: data.contact_name,
        contact_phone: data.contact_phone,
        materials: data.materials || null,
      });
      await merchantAppRepo.save(app);
      ctx.body = { code: 200, message: '申请已提交，请等待审核' };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  return router;
}
