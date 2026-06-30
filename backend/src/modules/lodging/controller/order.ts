// ============================================================
// 住宿订单 Controller — 下单 + 取消 + 核销码 + 管理
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\controller\order.ts
// ============================================================
import { Controller, Get, Post, Put, Del, Inject, Body, Query, Param } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { OrderService } from '../service/order';
import { OrderCreateDTO, OrderCancelDTO } from '../dto/order';

@Controller('/api/lodging')
export class OrderController {
  @Inject()
  orderService: OrderService;

  /**
   * 统一获取当前用户 ID。
   * 规则：优先取 JWT 注入的 currentUser.id；无鉴权时统一回退到 1（游客/开发环境）。
   */
  private getUserId(ctx: Context): number {
    const id = (ctx as any)?.currentUser?.id;
    if (id != null) return Number(id);
    return 1; // 游客或开发环境统一回退
  }

  // ==================== 游客端接口 ====================

  /**
   * POST /api/lodging/orders — 创建订单（下单，扣库存）
   * 游客端免登录，使用设备ID或临时用户ID
   */
  @Post('/orders')
  async create(@Body() body: OrderCreateDTO, ctx: Context) {
    const userId = this.getUserId(ctx);
    try {
      const data = await this.orderService.create(body, Number(userId) || 1);
      return { code: 200, message: '下单成功', data };
    } catch (err: any) {
      return { code: 400, message: err.message || '下单失败', data: null };
    }
  }

  /** GET /api/lodging/orders — 我的订单列表 */
  @Get('/orders')
  async list(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('status') status: string,
    ctx: Context
  ) {
    try {
      const userId = this.getUserId(ctx);
      const data = await this.orderService.list({ page, pageSize, status, userId });
      if (!data) return { code: 200, message: 'success', data: { total: 0, list: [] } };
      return { code: 200, message: 'success', data };
    } catch (err: any) {
      return { code: 200, message: 'success', data: { total: 0, list: [] } };
    }
  }

  /** GET /api/lodging/orders/:id — 订单详情 */
  @Get('/orders/:id')
  async detail(@Param('id') id: number) {
    const data = await this.orderService.detail(id);
    if (!data) return { code: 404, message: '订单不存在', data: null };
    return { code: 200, message: 'success', data };
  }

  /**
   * ★ 业务接口3：POST /api/lodging/order/cancel
   * 取消订单 → 返还库存 + 执行退改规则
   */
  @Post('/order/cancel')
  async cancel(@Body() body: OrderCancelDTO, ctx: Context) {
    const userId = this.getUserId(ctx);
    try {
      const data = await this.orderService.cancel(body.orderId, userId, body.reason);
      return {
        code: 200,
        message:
          data.refund_amount && data.refund_amount > 0
            ? `取消成功，退款￥${data.refund_amount}`
            : '取消成功',
        data,
      };
    } catch (err: any) {
      return { code: 400, message: err.message || '取消失败', data: null };
    }
  }

  /**
   * ★ 业务接口4：GET /api/lodging/order/check-in-code/:id
   * 获取入住核销二维码字符串
   */
  @Get('/order/check-in-code/:id')
  async getCheckInCode(@Param('id') id: number) {
    try {
      const data = await this.orderService.getCheckInCode(id);
      return { code: 200, message: 'success', data };
    } catch (err: any) {
      return { code: 400, message: err.message, data: null };
    }
  }

  // ==================== 管理端接口 ====================

  /** GET /api/lodging/admin/orders — 订单管理列表 */
  @Get('/admin/orders')
  async adminList(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('status') status: string
  ) {
    try {
      const data = await this.orderService.list({ page, pageSize, status });
      if (!data) return { code: 200, message: 'success', data: { total: 0, list: [] } };
      return { code: 200, message: 'success', data };
    } catch (err: any) {
      return { code: 200, message: 'success', data: { total: 0, list: [] } };
    }
  }

  /** PUT /api/lodging/admin/orders/:id/status — 订单状态流转 */
  @Put('/admin/orders/:id/status')
  async updateStatus(@Param('id') id: number, @Body('status') status: string) {
    try {
      const data = await this.orderService.updateStatus(id, status);
      return { code: 200, message: '状态更新成功', data };
    } catch (err: any) {
      return { code: 400, message: err.message, data: null };
    }
  }

  /** POST /api/lodging/admin/orders/verify — 核销验证 */
  @Post('/admin/orders/verify')
  async verify(@Body('code') code: string) {
    try {
      const data = await this.orderService.verifyCheckIn(code);
      return { code: 200, message: '核销成功', data };
    } catch (err: any) {
      return { code: 400, message: err.message, data: null };
    }
  }

  /** DELETE /api/lodging/admin/orders/:id — 软删除订单 */
  @Del('/admin/orders/:id')
  async delete(@Param('id') id: number) {
    await this.orderService.softDelete(id);
    return { code: 200, message: '删除成功', data: null };
  }
}