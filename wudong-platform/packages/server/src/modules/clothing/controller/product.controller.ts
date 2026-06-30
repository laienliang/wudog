import { Controller, Get, Post, Put, Del, Param, Body, Query, Inject } from '@midwayjs/core';
import { Validate } from '@midwayjs/validate';
import { ProductService } from '../service/product.service';
import { CreateProductDTO } from '../dto/create-product.dto';
import { UpdateProductDTO } from '../dto/update-product.dto';
import { CreateCategoryDTO } from '../dto/create-category.dto';
import { UpdateCategoryDTO } from '../dto/update-category.dto';
import { ProductQueryDTO } from '../dto/product-query.dto';

@Controller('/api/v1/products')
export class ProductController {
  @Inject()
  productService: ProductService;

  @Get('/')
  async list(@Query() query: ProductQueryDTO) {
    return this.productService.paginate(query);
  }

  @Get('/:id')
  async detail(@Param('id') id: number) {
    const product = await this.productService.getById(id);
    if (!product) {
      throw new Error('商品不存在');
    }
    return product;
  }

  @Post('/')
  @Validate()
  async create(@Body() body: CreateProductDTO) {
    return this.productService.create(body);
  }

  @Put('/:id')
  @Validate()
  async update(@Param('id') id: number, @Body() body: UpdateProductDTO) {
    return this.productService.update(id, body);
  }

  @Del('/:id')
  async delete(@Param('id') id: number) {
    await this.productService.softDelete(id);
    return { success: true };
  }

  @Get('/categories')
  async categories() {
    return this.productService.getCategories();
  }

  @Post('/categories')
  @Validate()
  async createCategory(@Body() body: CreateCategoryDTO) {
    return this.productService.createCategory(body);
  }

  @Put('/categories/:id')
  @Validate()
  async updateCategory(@Param('id') id: number, @Body() body: UpdateCategoryDTO) {
    return this.productService.updateCategory(id, body);
  }

  @Del('/categories/:id')
  async deleteCategory(@Param('id') id: number) {
    await this.productService.deleteCategory(id);
    return { success: true };
  }

  @Get('/:id/skus')
  async skus(@Param('id') id: number) {
    return this.productService.getSkus(id);
  }

  @Get('/:id/reviews')
  async reviews(@Param('id') id: number) {
    return this.productService.getReviews(id);
  }
}
