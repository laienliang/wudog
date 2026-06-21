import { Controller, Get, Inject, Headers, Query, Param } from '@midwayjs/decorator';
import { JwtService } from '@midwayjs/jwt';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { SystemMessage } from '../entity/system-message.entity';

/**
 * 商家后台仪表盘控制器
 * 提供商家维度的数据统计和消息通知接口
 */
@Controller('/api/merchant-dashboard')
export class MerchantDashboardController {
  @Inject()
  jwtService: JwtService;

  @InjectEntityModel(Order)
  orderRepo: Repository<Order>;

  @InjectEntityModel(SystemMessage)
  messageRepo: Repository<SystemMessage>;

  /**
   * 从 JWT token 中解析商家 ID
   */
  private async getMerchantId(auth: string): Promise<number | null> {
    try {
      const token = auth?.replace('Bearer ', '');
      const payload: any = await this.jwtService.verify(token);
      if (payload.role !== 'merchant') return null;
      return payload.id;
    } catch {
      return null;
    }
  }

  /**
   * 获取商家统计数据
   * GET /api/merchant-dashboard/stats
   *
   * 返回：
   * - todayOrders: 今日订单数
   * - pendingShipped: 待发货数（已支付待发货）
   * - pendingRefund: 待退款数
   * - totalRevenue: 总营业额（已完成订单总额）
   * - recentOrders: 最近 5 笔订单
   */
  @Get('/stats')
  async stats(@Headers('authorization') auth: string) {
    const merchantId = await this.getMerchantId(auth);
    if (!merchantId) {
      return { code: 401, message: '未登录或token无效', data: null };
    }

    try {
      // 今日订单数（用 MySQL CURDATE() 避免时区偏差）
      const todayOrders = await this.orderRepo
        .createQueryBuilder('o')
        .where('o.merchant_id = :merchantId', { merchantId })
        .andWhere('o.is_deleted = 0')
        .andWhere('DATE(o.created_at) = CURDATE()')
        .getCount();

      // 待发货数（已支付）
      const pendingShipped = await this.orderRepo
        .createQueryBuilder('o')
        .where('o.merchant_id = :merchantId', { merchantId })
        .andWhere('o.status = :status', { status: 'paid' })
        .andWhere('o.is_deleted = 0')
        .getCount();

      // 待退款数
      const pendingRefund = await this.orderRepo
        .createQueryBuilder('o')
        .where('o.merchant_id = :merchantId', { merchantId })
        .andWhere('o.status = :status', { status: 'refunding' })
        .andWhere('o.is_deleted = 0')
        .getCount();

      // 总营业额（已完成订单）
      const revenueResult = await this.orderRepo
        .createQueryBuilder('o')
        .select('SUM(o.total_amount)', 'total')
        .where('o.merchant_id = :merchantId', { merchantId })
        .andWhere('o.status = :status', { status: 'completed' })
        .andWhere('o.is_deleted = 0')
        .getRawOne();

      // 最近 5 笔订单
      const recentOrders = await this.orderRepo
        .createQueryBuilder('o')
        .where('o.merchant_id = :merchantId', { merchantId })
        .andWhere('o.is_deleted = 0')
        .orderBy('o.id', 'DESC')
        .limit(5)
        .getMany();

      return {
        code: 200,
        message: 'success',
        data: {
          todayOrders,
          pendingShipped,
          pendingRefund,
          totalRevenue: Number(revenueResult?.total || 0),
          recentOrders,
        },
      };
    } catch (err) {
      return { code: 500, message: '获取统计数据失败', data: null };
    }
  }

  /**
   * 获取商家消息通知列表
   * GET /api/merchant-dashboard/messages
   *
   * 查询与当前商家相关的系统消息（订单消息、退款消息等）
   */
  @Get('/messages')
  async messages(
    @Headers('authorization') auth: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('messageType') messageType?: string,
    @Query('isRead') isRead?: string
  ) {
    const merchantId = await this.getMerchantId(auth);
    if (!merchantId) {
      return { code: 401, message: '未登录或token无效', data: null };
    }

    try {
      const qb = this.messageRepo.createQueryBuilder('m')
        .where('m.is_deleted = 0')
        .andWhere('(m.user_id = :merchantId OR m.user_id IS NULL)', { merchantId });

      if (messageType) {
        qb.andWhere('m.message_type = :messageType', { messageType });
      }
      if (isRead !== undefined && isRead !== null && isRead !== '') {
        qb.andWhere('m.is_read = :isRead', { isRead: Number(isRead) });
      }

      const [list, total] = await qb
        .orderBy('m.id', 'DESC')
        .skip((Number(page) - 1) * Number(pageSize))
        .take(Number(pageSize))
        .getManyAndCount();

      return {
        code: 200,
        message: 'success',
        data: { list, total, page: Number(page), pageSize: Number(pageSize) },
      };
    } catch (err) {
      return { code: 500, message: '获取消息列表失败', data: null };
    }
  }

  /**
   * 标记商家消息为已读
   * GET /api/merchant-dashboard/messages/read/:id
   */
  @Get('/messages/read/:id')
  async markMessageRead(
    @Headers('authorization') auth: string,
    @Param('id') id: number
  ) {
    const merchantId = await this.getMerchantId(auth);
    if (!merchantId) {
      return { code: 401, message: '未登录或token无效', data: null };
    }

    try {
      await this.messageRepo.update(id, { is_read: 1 });
      const item = await this.messageRepo.findOne({ where: { id } });
      return { code: 200, message: 'success', data: item };
    } catch (err) {
      return { code: 500, message: '操作失败', data: null };
    }
  }
}
