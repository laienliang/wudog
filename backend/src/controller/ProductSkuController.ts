import { Controller, Get, Post, Put, Del, Inject, Body, Param, Query } from '@midwayjs/core';
import { ProductSkuService } from '../service/ProductSkuService';

@Controller('/api/product-sku')
export class ProductSkuController {
  @Inject()
  skuService: ProductSkuService;

  @Get('/list')
  async list(@Query('productId') productId: number) {
    if (!productId) {
      return { code: 400, message: '参数错误：缺少productId', data: null };
    }
    const list = await this.skuService.list(productId);
    return { code: 200, message: 'success', data: list };
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    const item = await this.skuService.detail(id);
    if (!item) {
      return { code: 404, message: 'SKU不存在', data: null };
    }
    return { code: 200, message: 'success', data: item };
  }

  @Post('/create')
  async create(@Body() body: { product_id: number; spec_name: string; price: number; stock?: number }) {
    const result = await this.skuService.create(body);
    return { code: 200, message: 'success', data: result };
  }

  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    const result = await this.skuService.update(id, body);
    return { code: 200, message: 'success', data: result };
  }

  @Del('/delete/:id')
  async delete(@Param('id') id: number) {
    await this.skuService.delete(id);
    return { code: 200, message: 'success', data: null };
  }
}
