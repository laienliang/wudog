import { Controller, Get, Inject, Headers, Query, Param } from '@midwayjs/decorator';
import { ApiOperation, ApiTags, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@midwayjs/swagger';
import { JwtService } from '@midwayjs/jwt';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { SystemMessage } from '../entity/system-message.entity';

/**
 * 商家后台仪表盘控制器
 * 提供商家维度的数据统计和消息通知接口
 */
@ApiTags('MerchantDashboard')
@ApiBearerAuth()
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
  @ApiOperation({ summary: '获取商家统计数据' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          todayOrders: 5,
          pendingShipped: 3,
          pendingRefund: 1,
          totalRevenue: 28650.00,
          recentOrders: [
            { id: 1001, order_no: 'WD20260621001', user_id: 101, merchant_id: 1, total_amount: 299.00, status: 'completed', order_type: 'product', created_at: '2026-06-21 10:30:00' },
            { id: 1000, order_no: 'WD20260621002', user_id: 102, merchant_id: 1, total_amount: 158.00, status: 'paid', order_type: 'food_order', created_at: '2026-06-21 09:15:00' },
          ],
        },
      },
    },
  })
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
  @ApiOperation({ summary: '获取商家消息通知列表' })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', description: '每页条数', required: false, example: 20 })
  @ApiQuery({ name: 'messageType', description: '消息类型（order/refund/system）', required: false, example: 'order' })
  @ApiQuery({ name: 'isRead', description: '是否已读（0未读 1已读）', required: false, example: '0' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          list: [
            { id: 1, user_id: 1, title: '新订单通知', content: '您有一笔新订单WD20260621001，请及时处理', message_type: 'order', is_read: 0, created_at: '2026-06-21 10:30:00' },
            { id: 2, user_id: 1, title: '退款申请通知', content: '用户申请退款，订单号WD20260620003', message_type: 'refund', is_read: 1, created_at: '2026-06-20 15:20:00' },
          ],
          total: 12,
          page: 1,
          pageSize: 20,
        },
      },
    },
  })
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
  @ApiOperation({ summary: '标记消息为已读' })
  @ApiParam({ name: 'id', description: '消息ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '操作成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: { id: 1, user_id: 1, title: '新订单通知', content: '您有一笔新订单WD20260621001，请及时处理', message_type: 'order', is_read: 1, created_at: '2026-06-21 10:30:00' },
      },
    },
  })
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

  /**
   * 获取商家数据统计
   * GET /api/merchant-dashboard/statistics
   *
   * 返回商家维度的销售/订单数据，支持时间范围筛选
   */
  @Get('/statistics')
  @ApiOperation({ summary: '获取商家详细数据统计' })
  @ApiQuery({ name: 'startDate', description: '开始日期（YYYY-MM-DD）', required: false, example: '2026-06-01' })
  @ApiQuery({ name: 'endDate', description: '结束日期（YYYY-MM-DD）', required: false, example: '2026-06-21' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          totalSales: 28650.00,
          totalOrders: 156,
          totalCustomers: 89,
          pendingPayment: 5,
          paid: 8,
          shipped: 12,
          completed: 120,
          cancelled: 6,
          refunding: 5,
          statusDistribution: [
            { status: 'pending_payment', label: '待支付', count: 5 },
            { status: 'paid', label: '已支付', count: 8 },
            { status: 'shipped', label: '已发货', count: 12 },
            { status: 'completed', label: '已完成', count: 120 },
            { status: 'cancelled', label: '已取消', count: 6 },
            { status: 'refunding', label: '退款中', count: 5 },
          ],
          salesTrend: [
            { date: '2026-06-19', amount: 3200.00 },
            { date: '2026-06-20', amount: 4150.00 },
            { date: '2026-06-21', amount: 2860.00 },
          ],
          orderTrend: [
            { date: '2026-06-19', count: 18 },
            { date: '2026-06-20', count: 24 },
            { date: '2026-06-21', count: 15 },
          ],
          typeStats: [
            { type: '商品', count: 68, amount: 12500.00 },
            { type: '餐饮', count: 45, amount: 8650.00 },
            { type: '住宿', count: 28, amount: 5200.00 },
            { type: '门票', count: 15, amount: 2300.00 },
          ],
        },
      },
    },
  })
  async statistics(
    @Headers('authorization') auth: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const merchantId = await this.getMerchantId(auth);
    if (!merchantId) {
      return { code: 401, message: '未登录或token无效', data: null };
    }

    try {
      // 构建时间范围条件
      const qb = this.orderRepo.createQueryBuilder('o')
        .where('o.merchant_id = :merchantId', { merchantId })
        .andWhere('o.is_deleted = 0');

      if (startDate) {
        qb.andWhere('o.created_at >= :startDate', { startDate });
      }
      if (endDate) {
        qb.andWhere('o.created_at <= :endDate', { endDate: endDate + ' 23:59:59' });
      }

      // 总销售额（已完成订单）
      const totalSalesResult = await qb
        .clone()
        .select('SUM(o.total_amount)', 'total')
        .andWhere('o.status = :status', { status: 'completed' })
        .getRawOne();

      // 总订单数
      const totalOrders = await qb.clone().getCount();

      // 客户数（去重）
      const totalCustomersResult = await qb
        .clone()
        .select('COUNT(DISTINCT o.user_id)', 'count')
        .getRawOne();

      // 各状态订单数
      const statusStats = await qb
        .clone()
        .select('o.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('o.status')
        .getRawMany();

      const statusMap: Record<string, number> = {};
      statusStats.forEach(item => {
        statusMap[item.status] = Number(item.count);
      });

      // 订单状态映射
      const ORDER_STATUS_MAP: Record<string, string> = {
        pending_payment: '待支付',
        paid: '已支付',
        shipped: '已发货',
        completed: '已完成',
        cancelled: '已取消',
        closed: '已关闭',
        refunding: '退款中',
        refund_approved: '退款通过',
        refund_rejected: '退款被拒',
        refunded: '已退款',
      };

      // 状态分布（包含所有状态，包括未知状态）
      const statusDistribution = statusStats.map(item => ({
        status: item.status,
        label: ORDER_STATUS_MAP[item.status] || item.status,
        count: Number(item.count),
      }));

      // 销售趋势（按天）
      const salesTrend = await qb
        .clone()
        .select("DATE_FORMAT(o.created_at, '%Y-%m-%d')", 'date')
        .addSelect('SUM(o.total_amount)', 'amount')
        .andWhere('o.status = :status', { status: 'completed' })
        .groupBy('date')
        .orderBy('date', 'ASC')
        .limit(30)
        .getRawMany();

      // 订单趋势（按天）
      const orderTrend = await qb
        .clone()
        .select("DATE_FORMAT(o.created_at, '%Y-%m-%d')", 'date')
        .addSelect('COUNT(*)', 'count')
        .groupBy('date')
        .orderBy('date', 'ASC')
        .limit(30)
        .getRawMany();

      // 按订单类型统计（统计所有订单，不仅仅是已完成的）
      const typeStats = await qb
        .clone()
        .select('o.order_type', 'type')
        .addSelect('COUNT(*)', 'count')
        .addSelect('SUM(o.total_amount)', 'amount')
        .groupBy('o.order_type')
        .orderBy('count', 'DESC')
        .getRawMany();

      // 订单类型映射
      const ORDER_TYPE_MAP: Record<string, string> = {
        product: '商品',
        food_order: '餐饮',
        stay: '住宿',
        ticket: '门票',
        route: '路线',
      };

      return {
        code: 200,
        message: 'success',
        data: {
          totalSales: Number(totalSalesResult?.total || 0),
          totalOrders,
          totalCustomers: Number(totalCustomersResult?.count || 0),
          // 各状态订单统计（预设状态）
          pendingPayment: statusMap['pending_payment'] || 0,
          paid: statusMap['paid'] || 0,
          shipped: statusMap['shipped'] || 0,
          completed: statusMap['completed'] || 0,
          cancelled: statusMap['cancelled'] || 0,
          refunding: statusMap['refunding'] || 0,
          // 所有状态分布（包含未知状态）
          statusDistribution,
          // 趋势数据
          salesTrend: salesTrend.map(item => ({
            date: item.date,
            amount: Number(item.amount || 0),
          })),
          orderTrend: orderTrend.map(item => ({
            date: item.date,
            count: Number(item.count || 0),
          })),
          // 按订单类型统计
          typeStats: typeStats.map(item => ({
            type: ORDER_TYPE_MAP[item.type] || item.type,
            count: Number(item.count || 0),
            amount: Number(item.amount || 0),
          })),
        },
      };
    } catch (err) {
      return { code: 500, message: '获取统计数据失败', data: null };
    }
  }
}
