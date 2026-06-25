import { Controller, Get, Post, Put, Del, Query, Body, Param, Inject } from '@midwayjs/core';
import { OrderService } from '../service/order.service';
import { success, fail } from '../utils/response';

@Controller('/order')
export class OrderController {
  @Inject()
  orderService: OrderService;

  /**
   * 订单列表（分页 + 筛选）
   * GET /api/order/list?page=1&pageSize=20&userId=1&status=0
   */
  @Get('/list')
  async list(@Query() query: any) {
    const result = await this.orderService.list(query);
    return success(result);
  }

  /**
   * 订单详情
   * GET /api/order/detail/:id
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    if (!id) return fail('参数错误: id 不能为空');
    const data = await this.orderService.detail(Number(id));
    if (!data) return fail('订单不存在', 404);
    return success(data);
  }

  /**
   * 创建预订订单
   * POST /api/order/create
   * body: { userId, accommodationId, roomId, checkInDate, checkOutDate, guests, guestName, guestPhone, totalPrice, remark }
   */
  @Post('/create')
  async create(@Body() body: any) {
    if (!body || !body.userId || !body.accommodationId || !body.roomId || !body.checkInDate || !body.checkOutDate) {
      return fail('参数错误: userId、accommodationId、roomId、checkInDate、checkOutDate 不能为空');
    }
    const data = await this.orderService.create(body);
    return success(data, '预订成功');
  }

  /**
   * 更新订单（如修改状态、备注）
   * PUT /api/order/update/:id
   */
  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    if (!id) return fail('参数错误: id 不能为空');
    if (!body) return fail('参数错误: 更新内容不能为空');
    const data = await this.orderService.update(Number(id), body);
    if (!data) return fail('订单不存在', 404);
    return success(data, '更新成功');
  }

  /**
   * 软删除订单
   * DELETE /api/order/delete/:id
   */
  @Del('/delete/:id')
  async delete(@Param('id') id: number) {
    if (!id) return fail('参数错误: id 不能为空');
    try {
      await this.orderService.softDelete(Number(id));
      return success(null, '删除成功');
    } catch (e) {
      return fail(e.message, 404);
    }
  }
}
