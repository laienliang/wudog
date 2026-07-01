import { Controller, Get, Post, Put, Del, Inject, Body, Param } from '@midwayjs/core';
import { CurrentUser } from '../decorator/CurrentUser';
import { CartService } from '../service/CartService';

@Controller('/api/cart')
export class CartController {
  @Inject()
  cartService: CartService;

  @Get('/list')
  async list(@CurrentUser user: any) {
    const userId = user?.id;
    if (!userId) {
      return { code: 401, message: '未登录', data: null };
    }
    const list = await this.cartService.list(userId);
    return { code: 200, message: 'success', data: list };
  }

  @Post('/add')
  async add(@CurrentUser user: any, @Body() body: { product_id: number; sku_id?: number; quantity?: number }) {
    const userId = user?.id;
    if (!userId) {
      return { code: 401, message: '未登录', data: null };
    }
    if (!body.product_id) {
      return { code: 400, message: '参数错误', data: null };
    }
    const item = await this.cartService.add(userId, body.product_id, body.sku_id || null, body.quantity);
    return { code: 200, message: '已加入购物车', data: item };
  }

  @Put('/update/:id')
  async update(@CurrentUser user: any, @Param('id') id: number, @Body() body: { quantity: number }) {
    const userId = user?.id;
    if (!userId) {
      return { code: 401, message: '未登录', data: null };
    }
    if (!body.quantity || body.quantity < 1) {
      return { code: 400, message: '数量不能小于1', data: null };
    }
    const item = await this.cartService.updateQuantity(id, userId, body.quantity);
    if (!item) {
      return { code: 404, message: '购物车商品不存在', data: null };
    }
    return { code: 200, message: 'success', data: item };
  }

  @Del('/delete/:id')
  async delete(@CurrentUser user: any, @Param('id') id: number) {
    const userId = user?.id;
    if (!userId) {
      return { code: 401, message: '未登录', data: null };
    }
    const result = await this.cartService.delete(id, userId);
    if (!result) {
      return { code: 404, message: '购物车商品不存在', data: null };
    }
    return { code: 200, message: '已删除', data: null };
  }
}
