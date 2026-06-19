import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { OrderService } from '../service/order.service';

/**
 * 订单控制器
 * 处理订单相关的 API 请求，包括订单的增删改查及退款审批操作
 */
@Controller('/api/orders')
export class OrderController {
  @Inject()
  orderService: OrderService;

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
  async create(@Body() body: any) {
    const item = await this.orderService.create(body);
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
  async update(@Param('id') id: number, @Body() body: any) {
    delete body.id;
    const item = await this.orderService.update(Number(id), body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 审批退款通过
   * POST /api/orders/refund-approve/:id
   * @param id - 订单 ID
   * @returns 更新后的订单信息（状态变为 refund_approved）
   */
  @Post('/refund-approve/:id')
  async refundApprove(@Param('id') id: number) {
    const item = await this.orderService.update(Number(id), { status: 'refund_approved' });
    if (!item) return { code: 404, message: '订单不存在', data: null };
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
  async refundReject(@Param('id') id: number, @Body() body: { reason: string }) {
    const item = await this.orderService.update(Number(id), {
      status: 'refund_rejected',
      refund_reject_reason: body.reason
    });
    if (!item) return { code: 404, message: '订单不存在', data: null };
    return { code: 200, message: '退款已拒绝', data: item };
  }
}
