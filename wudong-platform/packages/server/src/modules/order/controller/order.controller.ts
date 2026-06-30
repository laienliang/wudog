import { Controller, Get, Post, Param, Body, Query, Inject } from '@midwayjs/core';
import { Validate } from '@midwayjs/validate';
import { Context } from '@midwayjs/koa';
import { OrderService } from '../service/order.service';
import { CreateOrderDTO } from '../dto/create-order.dto';
import { OrderQueryDTO } from '../dto/order-query.dto';
import { UnauthorizedError, NotFoundError } from '../../../common/filter/unauthorized.filter';

@Controller('/api/v1/orders')
export class OrderController {
  @Inject()
  orderService: OrderService;

  @Inject()
  ctx: Context;

  /**
   * 创建订单
   */
  @Post('/')
  @Validate()
  async create(@Body() body: CreateOrderDTO) {
    const userId = this.ctx.user?.userId || 1; // MVP: default to user 1

    return this.orderService.createOrder(userId, {
      orderType: body.orderType as any,
      merchantId: body.merchantId,
      items: body.items.map(item => ({
        productType: item.productType,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        skuId: item.skuId,
        skuName: item.skuName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
      remark: body.remark,
    });
  }

  /**
   * 查询订单列表（分页）
   */
  @Get('/')
  @Validate()
  async list(@Query() query: OrderQueryDTO) {
    const userId = this.ctx.user?.userId || 1; // MVP: default to user 1

    return this.orderService.listOrders(userId, query as any);
  }

  /**
   * 查询订单详情
   */
  @Get('/:id')
  async detail(@Param('id') id: number) {
    const userId = this.ctx.user?.userId || 1;

    const order = await this.orderService.getOrderById(id, userId);
    if (!order) throw new NotFoundError('订单不存在');

    return order;
  }

  /**
   * 取消订单
   */
  @Post('/:id/cancel')
  async cancel(@Param('id') id: number) {
    const userId = this.ctx.user?.userId;
    if (!userId) throw new UnauthorizedError('请先登录');

    return this.orderService.cancelOrder(id, userId);
  }

  /**
   * 支付订单（模拟支付回调）
   */
  @Post('/:id/pay')
  async pay(@Param('id') id: number) {
    return this.orderService.payOrder(id, 'wechat');
  }

  /**
   * 确认完成
   */
  @Post('/:id/confirm')
  async confirm(@Param('id') id: number) {
    const userId = this.ctx.user?.userId;
    if (!userId) throw new UnauthorizedError('请先登录');

    return this.orderService.confirmOrder(id, userId);
  }

  /**
   * 查询订单状态日志
   */
  @Get('/:id/logs')
  async logs(@Param('id') id: number) {
    const order = await this.orderService.getOrderById(id);
    if (!order) throw new NotFoundError('订单不存在');

    return order.logs;
  }
}
