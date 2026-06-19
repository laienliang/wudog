/**
 * 数据看板控制器
 * 提供平台运营数据统计接口
 */
import { Controller, Get, Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { MerchantService } from '../service/merchant.service';
import { OrderService } from '../service/order.service';
import { FinancialRecordService } from '../service/financial-record.service';

@Controller('/api/dashboard')
export class DashboardController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  merchantService: MerchantService;

  @Inject()
  orderService: OrderService;

  @Inject()
  financialRecordService: FinancialRecordService;

  /**
   * 获取平台总览数据
   * GET /api/dashboard/overview
   */
  @Get('/overview')
  async overview() {
    try {
      // 并行查询各项统计
      const [userStats, merchantStats, orderStats, financialStats] = await Promise.all([
        this.getUserStats(),
        this.getMerchantStats(),
        this.getOrderStats(),
        this.getFinancialStats(),
      ]);

      return {
        code: 200,
        message: 'success',
        data: {
          users: userStats,
          merchants: merchantStats,
          orders: orderStats,
          financial: financialStats,
        },
      };
    } catch (error) {
      return { code: 500, message: error.message, data: null };
    }
  }

  /**
   * 获取用户统计
   */
  private async getUserStats() {
    const total = await this.userService.findAll(1, 1);
    return {
      total: total.total,
    };
  }

  /**
   * 获取商家统计
   */
  private async getMerchantStats() {
    const total = await this.merchantService.findAll(1, 1);
    return {
      total: total.total,
    };
  }

  /**
   * 获取订单统计
   */
  private async getOrderStats() {
    const total = await this.orderService.findAll(1, 1);
    return {
      total: total.total,
    };
  }

  /**
   * 获取财务统计
   */
  private async getFinancialStats() {
    const total = await this.financialRecordService.findAll(1, 1);
    return {
      total: total.total,
    };
  }
}
