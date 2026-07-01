import { Controller, Get, Post, Put, Del, Body, Query, Param, Inject } from '@midwayjs/core';
import { CurrentUser } from '../decorator/CurrentUser';
import { ReviewService } from '../service/ReviewService';

@Controller('/api/review')
export class ReviewController {
  @Inject()
  reviewService: ReviewService;

  @Post('/create')
  async create(@CurrentUser user: any, @Body() body: {
    product_id: number;
    order_id: number;
    rating: number;
    content?: string;
    images?: string;
  }) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    if (!body.product_id || !body.order_id || !body.rating) {
      return { code: 400, message: '参数错误', data: null };
    }
    return await this.reviewService.create({ ...body, user_id: user.id });
  }

  @Get('/product/:productId')
  async productReviews(@Param('productId') productId: number, @Query('page') page: number) {
    const result = await this.reviewService.getProductReviews(productId, page || 1);
    return { code: 200, message: 'success', data: result };
  }

  @Get('/my')
  async myReviews(@CurrentUser user: any, @Query('page') page: number) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    const result = await this.reviewService.getUserReviews(user.id, page || 1);
    return { code: 200, message: 'success', data: result };
  }

  @Put('/reply/:id')
  async reply(@Param('id') id: number, @Body() body: { reply: string }) {
    if (!body.reply?.trim()) return { code: 400, message: '回复内容不能为空', data: null };
    return await this.reviewService.reply(id, body.reply);
  }

  @Del('/delete/:id')
  async delete(@Param('id') id: number) {
    return await this.reviewService.delete(id);
  }

  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    const result = await this.reviewService.getAllReviews(page || 1, pageSize || 20);
    return { code: 200, message: 'success', data: result };
  }
}
