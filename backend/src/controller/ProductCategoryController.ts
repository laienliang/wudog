import { Controller, Get, Post, Put, Del, Inject, Body, Param, Query } from '@midwayjs/core';
import { ProductCategoryService } from '../service/ProductCategoryService';

@Controller('/api/product-category')
export class ProductCategoryController {
  @Inject()
  categoryService: ProductCategoryService;

  @Get('/list')
  async list() {
    const list = await this.categoryService.list();
    return { code: 200, message: 'success', data: list };
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    const item = await this.categoryService.detail(id);
    if (!item) {
      return { code: 404, message: '分类不存在', data: null };
    }
    return { code: 200, message: 'success', data: item };
  }

  @Post('/create')
  async create(@Body() body: { name: string; sort_order?: number }) {
    const result = await this.categoryService.create(body);
    return { code: 200, message: 'success', data: result };
  }

  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: { name?: string; sort_order?: number }) {
    const result = await this.categoryService.update(id, body);
    return { code: 200, message: 'success', data: result };
  }

  @Del('/delete/:id')
  async delete(@Param('id') id: number) {
    await this.categoryService.delete(id);
    return { code: 200, message: 'success', data: null };
  }
}
