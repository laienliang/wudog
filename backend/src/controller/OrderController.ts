import { Controller, Get, Post, Put, Del, Body, Query, Param, Inject } from '@midwayjs/core';
import { CurrentUser } from '../decorator/CurrentUser';
import { OrderService } from '../service/OrderService';

@Controller('/api/order')
export class OrderController {
  @Inject()
  orderService: OrderService;

  @Get('/list')
  async list(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('userId') userId: number,
  ) {
    const result = await this.orderService.list(
      page || 1,
      pageSize || 20,
      userId || undefined,
    );
    return { code: 200, message: 'success', data: result };
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    const order = await this.orderService.detail(id);
    if (!order) {
      return { code: 404, message: '订单不存在', data: null };
    }
    return { code: 200, message: 'success', data: order };
  }

  @Post('/create')
  async create(@CurrentUser user: any, @Body() body: {
    product_id: number;
    sku_id?: number;
    product_name: string;
    spec_name?: string;
    price: number;
    quantity: number;
    receiver_name: string;
    receiver_phone: string;
    receiver_address: string;
    payment_method?: string;
  }) {
    const userId = user?.id;
    if (!userId) {
      return { code: 401, message: '未登录', data: null };
    }
    if (!body.product_id || !body.receiver_name || !body.receiver_phone || !body.receiver_address) {
      return { code: 400, message: '参数错误', data: null };
    }
    const order = await this.orderService.create({ ...body, user_id: userId });
    return { code: 200, message: '下单成功', data: order };
  }

  @Put('/update-status/:id')
  async updateStatus(@Param('id') id: number, @Body() body: { status: number }) {
    if (body.status === undefined || body.status === null) {
      return { code: 400, message: '参数错误', data: null };
    }
    const order = await this.orderService.updateStatus(id, body.status);
    return { code: 200, message: 'success', data: order };
  }

  @Del('/delete/:id')
  async delete(@Param('id') id: number) {
    await this.orderService.delete(id);
    return { code: 200, message: 'success', data: null };
  }

  @Put('/request-cancel/:id')
  async requestCancel(@CurrentUser user: any, @Param('id') id: number) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    const result = await this.orderService.requestCancel(id, user.id, 1);
    return { ...result, data: null };
  }

  @Put('/request-return/:id')
  async requestReturn(@CurrentUser user: any, @Param('id') id: number) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    const result = await this.orderService.requestCancel(id, user.id, 2);
    return { ...result, data: null };
  }

  @Put('/revoke-cancel/:id')
  async revokeCancel(@CurrentUser user: any, @Param('id') id: number) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    const result = await this.orderService.revokeCancel(id, user.id);
    return { ...result, data: null };
  }

  @Put('/approve-cancel/:id')
  async approveCancel(@Param('id') id: number) {
    const result = await this.orderService.approveCancel(id);
    return { ...result, data: null };
  }

  @Put('/reject-cancel/:id')
  async rejectCancel(@Param('id') id: number) {
    const result = await this.orderService.rejectCancel(id);
    return { ...result, data: null };
  }
}
