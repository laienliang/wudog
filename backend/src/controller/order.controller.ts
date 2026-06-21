import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@midwayjs/swagger';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, LessThan, In } from 'typeorm';
import { OrderService } from '../service/order.service';
import { SystemMessageService } from '../service/system-message.service';
import { Order } from '../entity/order.entity';

/**
 * 订单控制器
 * 处理订单相关的 API 请求，包括订单的增删改查及退款审批操作
 */
@ApiTags('Order')
@ApiBearerAuth()
@Controller('/api/orders')
export class OrderController {
  @Inject()
  orderService: OrderService;

  @Inject()
  systemMessageService: SystemMessageService;

  @InjectEntityModel(Order)
  orderRepo: Repository<Order>;

  /**
   * 获取订单列表（分页）
   * GET /api/orders/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @param orderType - 订单类型筛选（可选）
   * @param status - 订单状态筛选（可选）
   * @param keyword - 搜索关键词（可选）
   * @returns 分页订单列表
   */
  @Get('/list')
  @ApiOperation({ summary: '获取订单列表（分页）' })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', description: '每页数量', required: false, example: 20 })
  @ApiQuery({ name: 'orderType', description: '订单类型：product-商品,food_order-餐饮,stay-住宿,ticket-门票,route-路线', required: false, example: 'product' })
  @ApiQuery({ name: 'status', description: '订单状态：pending_payment-待支付,paid-已支付,refunding-退款中,refund_approved-退款通过,refund_rejected-退款拒绝,closed-已关闭', required: false, example: 'paid' })
  @ApiQuery({ name: 'keyword', description: '搜索关键词（订单号/用户名）', required: false, example: 'WD20260601' })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          list: [
            {
              id: 1,
              order_no: 'WD20260601001',
              user_id: 101,
              merchant_id: 10,
              order_type: 'product',
              total_amount: '299.00',
              status: 'paid',
              created_at: '2026-06-01T10:30:00.000Z',
            },
          ],
          total: 128,
        },
      },
    },
  })
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('orderType') orderType?: string,
    @Query('status') status?: string,
    @Query('keyword') keyword?: string
  ) {
    const result = await this.orderService.findAll(
      Number(page), Number(pageSize), orderType, status, keyword
    );
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取订单详情
   * GET /api/orders/detail/:id
   * @param id - 订单 ID
   * @returns 订单详细信息
   */
  @Get('/detail/:id')
  @ApiOperation({ summary: '获取订单详情' })
  @ApiParam({ name: 'id', description: '订单ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          order_no: 'WD20260601001',
          user_id: 101,
          merchant_id: 10,
          order_type: 'product',
          total_amount: '299.00',
          status: 'paid',
          created_at: '2026-06-01T10:30:00.000Z',
        },
      },
    },
  })
  async detail(@Param('id') id: number) {
    const item = await this.orderService.findById(Number(id));
    if (!item) return { code: 404, message: '订单不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 创建订单
   * POST /api/orders/create
   * @param body - 订单信息
   * @returns 创建后的订单信息
   */
  @Post('/create')
  @ApiOperation({ summary: '创建订单' })
  @ApiBody({
    schema: {
      properties: {
        user_id: { type: 'number', description: '用户ID', example: 101 },
        merchant_id: { type: 'number', description: '商家ID', example: 10 },
        order_type: { type: 'string', description: '订单类型：product-商品,food_order-餐饮,stay-住宿,ticket-门票,route-路线', example: 'product' },
        total_amount: { type: 'string', description: '订单总金额', example: '299.00' },
        status: { type: 'string', description: '订单状态', example: 'pending_payment' },
        remark: { type: 'string', description: '订单备注', example: '请尽快发货' },
      },
      example: {
        user_id: 101,
        merchant_id: 10,
        order_type: 'product',
        total_amount: '299.00',
        status: 'pending_payment',
        remark: '请尽快发货',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '创建成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          order_no: 'WD20260601001',
          user_id: 101,
          merchant_id: 10,
          order_type: 'product',
          total_amount: '299.00',
          status: 'pending_payment',
          created_at: '2026-06-01T10:30:00.000Z',
        },
      },
    },
  })
  async create(@Body() body: any) {
    const item = await this.orderService.create(body);

    // 发送新订单通知给商家
    if (item.merchant_id) {
      const orderTypeMap: Record<string, string> = {
        product: '商品', food_order: '餐饮', stay: '住宿', ticket: '门票', route: '路线',
      };
      await this.systemMessageService.create({
        user_id: item.merchant_id,
        message_type: 'order',
        title: '新订单通知',
        content: `您有新订单 ${item.order_no}，${orderTypeMap[item.order_type] || '商品'}订单，金额 ¥${Number(item.total_amount).toFixed(2)}，请及时处理。`,
        is_read: 0,
      });
    }

    return { code: 200, message: 'success', data: item };
  }

  /**
   * 更新订单信息
   * PUT /api/orders/update/:id
   * @param id - 订单 ID
   * @param body - 更新的订单信息
   * @returns 更新后的订单信息
   */
  @Put('/update/:id')
  @ApiOperation({ summary: '更新订单信息' })
  @ApiParam({ name: 'id', description: '订单ID', example: 1 })
  @ApiBody({
    schema: {
      properties: {
        status: { type: 'string', description: '订单状态', example: 'paid' },
        remark: { type: 'string', description: '订单备注', example: '已发货' },
      },
      example: {
        status: 'paid',
        remark: '已发货',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          order_no: 'WD20260601001',
          user_id: 101,
          merchant_id: 10,
          order_type: 'product',
          total_amount: '299.00',
          status: 'paid',
          created_at: '2026-06-01T10:30:00.000Z',
        },
      },
    },
  })
  async update(@Param('id') id: number, @Body() body: any) {
    delete body.id;

    // 查询原订单状态，判断是否为支付完成
    const oldOrder = await this.orderService.findById(Number(id));
    const item = await this.orderService.update(Number(id), body);

    // 状态变更为 paid → 发送收款到账通知给商家
    if (oldOrder && item && body.status === 'paid' && oldOrder.status !== 'paid' && item.merchant_id) {
      await this.systemMessageService.create({
        user_id: item.merchant_id,
        message_type: 'payment',
        title: '收款到账通知',
        content: `订单 ${item.order_no} 已完成支付，到账金额 ¥${Number(item.total_amount).toFixed(2)}。`,
        is_read: 0,
      });
    }

    return { code: 200, message: 'success', data: item };
  }

  /**
   * 审批退款通过
   * POST /api/orders/refund-approve/:id
   * @param id - 订单 ID
   * @returns 更新后的订单信息（状态变为 refund_approved）
   */
  @Post('/refund-approve/:id')
  @ApiOperation({ summary: '审批退款通过' })
  @ApiParam({ name: 'id', description: '订单ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '退款审批通过',
    schema: {
      example: {
        code: 200,
        message: '退款审批通过',
        data: {
          id: 1,
          order_no: 'WD20260601001',
          status: 'refund_approved',
          total_amount: '299.00',
        },
      },
    },
  })
  async refundApprove(@Param('id') id: number) {
    const item = await this.orderService.update(Number(id), { status: 'refund_approved' });
    if (!item) return { code: 404, message: '订单不存在', data: null };

    // 发送退款审核结果通知给商家
    if (item.merchant_id) {
      await this.systemMessageService.create({
        user_id: item.merchant_id,
        message_type: 'refund',
        title: '退款审核结果通知',
        content: `订单 ${item.order_no} 退款申请已通过，退款金额 ¥${Number(item.total_amount).toFixed(2)}，预计1-3个工作日到账。`,
        is_read: 0,
      });
    }

    return { code: 200, message: '退款审批通过', data: item };
  }

  /**
   * 拒绝退款申请
   * POST /api/orders/refund-reject/:id
   * @param id - 订单 ID
   * @param body - 拒绝原因（reason）
   * @returns 更新后的订单信息（状态变为 refund_rejected）
   */
  @Post('/refund-reject/:id')
  @ApiOperation({ summary: '拒绝退款申请' })
  @ApiParam({ name: 'id', description: '订单ID', example: 1 })
  @ApiBody({
    schema: {
      properties: {
        reason: { type: 'string', description: '拒绝原因', example: '商品已拆封，不支持退款' },
      },
      example: {
        reason: '商品已拆封，不支持退款',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '退款已拒绝',
    schema: {
      example: {
        code: 200,
        message: '退款已拒绝',
        data: {
          id: 1,
          order_no: 'WD20260601001',
          status: 'refund_rejected',
          refund_reject_reason: '商品已拆封，不支持退款',
          total_amount: '299.00',
        },
      },
    },
  })
  async refundReject(@Param('id') id: number, @Body() body: { reason: string }) {
    const item = await this.orderService.update(Number(id), {
      status: 'refund_rejected',
      refund_reject_reason: body.reason
    });
    if (!item) return { code: 404, message: '订单不存在', data: null };

    // 发送退款审核结果通知给商家
    if (item.merchant_id) {
      await this.systemMessageService.create({
        user_id: item.merchant_id,
        message_type: 'refund',
        title: '退款审核结果通知',
        content: `订单 ${item.order_no} 退款申请被拒绝，原因：${body.reason || '未说明'}。`,
        is_read: 0,
      });
    }

    return { code: 200, message: '退款已拒绝', data: item };
  }

  /**
   * 查询异常订单
   * GET /api/orders/abnormal
   * 包含两类：
   * 1. 长时间未支付（超过15分钟仍为 pending_payment）
   * 2. 退款争议（refund_rejected 或退款申请超过3天未处理）
   * @returns 异常订单列表
   */
  @Get('/abnormal')
  @ApiOperation({ summary: '查询异常订单' })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          unpaidOrders: [
            {
              id: 2,
              order_no: 'WD20260601002',
              status: 'pending_payment',
              total_amount: '159.00',
              abnormalType: 'unpaid',
            },
          ],
          refundDisputes: [
            {
              id: 3,
              order_no: 'WD20260601003',
              status: 'refund_rejected',
              total_amount: '520.00',
              abnormalType: 'refund_dispute',
            },
          ],
          totalUnpaid: 1,
          totalRefundDisputes: 1,
        },
      },
    },
  })
  async abnormal() {
    // 1. 长时间未支付：pending_payment 且创建时间超过15分钟
    const unpaidThreshold = new Date(Date.now() - 15 * 60 * 1000);
    const unpaidOrders = await this.orderRepo
      .createQueryBuilder('order')
      .where('order.is_deleted = 0')
      .andWhere('order.status = :status', { status: 'pending_payment' })
      .andWhere('order.created_at < :threshold', { threshold: unpaidThreshold })
      .orderBy('order.created_at', 'ASC')
      .getMany();

    // 2. 退款争议：refund_rejected 状态 或 refunding 超过3天
    const refundThreshold = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const refundDisputes = await this.orderRepo
      .createQueryBuilder('order')
      .where('order.is_deleted = 0')
      .andWhere(
        '(order.status = :s1 OR (order.status = :s2 AND order.updated_at < :threshold))',
        { s1: 'refund_rejected', s2: 'refunding', threshold: refundThreshold }
      )
      .orderBy('order.updated_at', 'ASC')
      .getMany();

    return {
      code: 200,
      message: 'success',
      data: {
        unpaidOrders: unpaidOrders.map(o => ({ ...o, abnormalType: 'unpaid' })),
        refundDisputes: refundDisputes.map(o => ({ ...o, abnormalType: 'refund_dispute' })),
        totalUnpaid: unpaidOrders.length,
        totalRefundDisputes: refundDisputes.length,
      },
    };
  }

  /**
   * 手动关闭未支付订单
   * POST /api/orders/close/:id
   * @param id - 订单 ID
   * @returns 更新后的订单信息（状态变为 closed）
   */
  @Post('/close/:id')
  @ApiOperation({ summary: '手动关闭未支付订单' })
  @ApiParam({ name: 'id', description: '订单ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '订单已关闭',
    schema: {
      example: {
        code: 200,
        message: '订单已关闭',
        data: {
          id: 1,
          order_no: 'WD20260601001',
          status: 'closed',
          total_amount: '299.00',
        },
      },
    },
  })
  async close(@Param('id') id: number) {
    const order = await this.orderService.findById(Number(id));
    if (!order) return { code: 404, message: '订单不存在', data: null };
    if (order.status !== 'pending_payment') {
      return { code: 400, message: '只能关闭未支付的订单', data: null };
    }
    const item = await this.orderService.update(Number(id), { status: 'closed' });
    return { code: 200, message: '订单已关闭', data: item };
  }
}
