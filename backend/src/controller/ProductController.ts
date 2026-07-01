import { Controller, Get, Post, Put, Del, Inject, Body, Param, Query } from '@midwayjs/core';
import { ProductService } from '../service/ProductService';

@Controller('/api/product')
export class ProductController {
  @Inject()
  productService: ProductService;

  @Get('/list')
  async list(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('keyword') keyword?: string,
    @Query('categoryId') categoryId?: number
  ) {
    const result = await this.productService.list(
      page || 1,
      pageSize || 20,
      keyword,
      categoryId
    );
    return { code: 200, message: 'success', data: result };
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    const item = await this.productService.detail(id);
    if (!item) {
      return { code: 404, message: '商品不存在', data: null };
    }
    return { code: 200, message: 'success', data: item };
  }

  @Post('/create')
  async create(@Body() body: any) {
    const result = await this.productService.create(body);
    return { code: 200, message: 'success', data: result };
  }

  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    const result = await this.productService.update(id, body);
    return { code: 200, message: 'success', data: result };
  }

  @Del('/delete/:id')
  async delete(@Param('id') id: number) {
    await this.productService.delete(id);
    return { code: 200, message: 'success', data: null };
  }

  @Put('/toggle-status/:id')
  async toggleStatus(@Param('id') id: number) {
    const result = await this.productService.toggleStatus(id);
    if (!result) {
      return { code: 404, message: '商品不存在', data: null };
    }
    return { code: 200, message: 'success', data: result };
  }
}
