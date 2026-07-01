import { Controller, Get, Put, Inject } from '@midwayjs/core';
import { CurrentUser } from '../decorator/CurrentUser';
import { NotificationService } from '../service/NotificationService';

@Controller('/api/notification')
export class NotificationController {
  @Inject()
  notificationService: NotificationService;

  @Get('/count')
  async count(@CurrentUser user: any) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    const data = await this.notificationService.getCounts(user.id);
    return { code: 200, message: 'success', data };
  }

  @Put('/read-orders')
  async readOrders(@CurrentUser user: any) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    await this.notificationService.markOrdersRead(user.id);
    return { code: 200, message: 'success', data: null };
  }

  @Put('/read-reviews')
  async readReviews(@CurrentUser user: any) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    await this.notificationService.markReviewsRead(user.id);
    return { code: 200, message: 'success', data: null };
  }
}
