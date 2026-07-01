import { Controller, Get, Post, Del, Inject, Body, Param, Query } from '@midwayjs/core';
import { ProductImageService } from '../service/ProductImageService';

@Controller('/api/product-image')
export class ProductImageController {
  @Inject()
  imageService: ProductImageService;

  @Get('/list')
  async list(@Query('productId') productId: number) {
    if (!productId) {
      return { code: 400, message: '参数错误：缺少productId', data: null };
    }
    const list = await this.imageService.list(productId);
    return { code: 200, message: 'success', data: list };
  }

  @Post('/create')
  async create(@Body() body: { product_id: number; image_url: string; sort_order?: number }) {
    const result = await this.imageService.create(body);
    return { code: 200, message: 'success', data: result };
  }

  @Del('/delete/:id')
  async delete(@Param('id') id: number) {
    await this.imageService.delete(id);
    return { code: 200, message: 'success', data: null };
  }
}
