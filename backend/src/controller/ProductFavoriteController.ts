import { Controller, Get, Post, Inject, Body } from '@midwayjs/core';
import { CurrentUser } from '../decorator/CurrentUser';
import { ProductFavoriteService } from '../service/ProductFavoriteService';

@Controller('/api/product-favorite')
export class ProductFavoriteController {
  @Inject()
  favoriteService: ProductFavoriteService;

  @Get('/list')
  async list(@CurrentUser user: any) {
    const userId = user?.id;
    if (!userId) {
      return { code: 401, message: '未登录', data: null };
    }
    const list = await this.favoriteService.list(userId);
    return { code: 200, message: 'success', data: list };
  }

  @Post('/toggle')
  async toggle(@CurrentUser user: any, @Body() body: { product_id: number }) {
    const userId = user?.id;
    if (!userId) {
      return { code: 401, message: '请先登录', data: null };
    }
    if (!body.product_id) {
      return { code: 400, message: '参数错误', data: null };
    }
    const result = await this.favoriteService.toggle(body.product_id, userId);
    return { code: 200, message: 'success', data: result };
  }
}
