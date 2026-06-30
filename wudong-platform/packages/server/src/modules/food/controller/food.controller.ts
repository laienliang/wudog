import { Controller, Get, Post, Put, Del, Param, Body, Query, Inject, Config } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { FoodService } from '../service/food.service';
import * as jwt from 'jsonwebtoken';

@Controller('/api/v1')
export class FoodController {
  @Inject()
  foodService: FoodService;

  @Inject()
  ctx: Context;

  @Config('jwt.secret')
  jwtSecret: string;

  // ===== 餐厅 =====
  @Get('/restaurants')
  async listRestaurants(@Query() query: any) { return this.foodService.listRestaurants(query); }

  @Get('/restaurants/all')
  async allRestaurants() {
    const { list } = await this.foodService.listRestaurants({ page: 1, pageSize: 100 });
    return list;
  }

  @Get('/restaurants/:id')
  async getRestaurant(@Param('id') id: number) { return this.foodService.getRestaurant(id); }

  @Post('/restaurants')
  async createRestaurant(@Body() body: any) { return this.foodService.createRestaurant(body); }

  @Put('/restaurants/:id')
  async updateRestaurant(@Param('id') id: number, @Body() body: any) { return this.foodService.updateRestaurant(id, body); }

  @Del('/restaurants/:id')
  async deleteRestaurant(@Param('id') id: number) { await this.foodService.deleteRestaurant(id); return { success: true }; }

  @Get('/restaurants/:id/slots')
  async getMealSlots(@Param('id') id: number) { return this.foodService.getMealSlots(id); }

  @Get('/restaurants/:id/dishes')
  async getDishes(@Param('id') id: number) { return this.foodService.getDishes(id); }

  @Post('/restaurants/booking')
  async createBooking(@Body() body: any) {
    let userId = this.ctx.user?.userId;
    if (!userId) {
      // 从 Authorization header 手动提取 Token
      const authHeader = this.ctx.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '').trim();
      if (token) {
        try {
          const decoded = jwt.verify(token, this.jwtSecret) as any;
          userId = decoded.userId;
        } catch {}
      }
    }
    if (!userId) throw new Error('请先登录');
    return this.foodService.createBooking(userId, body);
  }

  // ===== 农产品 =====
  @Get('/food-categories')
  async listFoodCategories() {
    const data = await this.foodService.listCategories();
    return { code: 200, data };
  }

  @Get('/food-products')
  async listFoodProducts(@Query() query: any) { return this.foodService.listFoodProducts(query); }

  @Get('/food-products/:id')
  async getFoodProduct(@Param('id') id: number) { return this.foodService.getFoodProduct(id); }

  @Post('/food-products')
  async createFoodProduct(@Body() body: any) { return this.foodService.createFoodProduct(body); }

  @Put('/food-products/:id')
  async updateFoodProduct(@Param('id') id: number, @Body() body: any) { return this.foodService.updateFoodProduct(id, body); }

  @Del('/food-products/:id')
  async deleteFoodProduct(@Param('id') id: number) { await this.foodService.deleteFoodProduct(id); return { success: true }; }

  // ===== 菜品 =====
  @Get('/dishes')
  async listDishes(@Query() query: any) { return this.foodService.listDishes(query); }

  @Post('/dishes')
  async createDish(@Body() body: any) { return this.foodService.createDish(body); }

  @Put('/dishes/:id')
  async updateDish(@Param('id') id: number, @Body() body: any) { return this.foodService.updateDish(id, body); }

  @Del('/dishes/:id')
  async deleteDish(@Param('id') id: number) { await this.foodService.deleteDish(id); return { success: true }; }
}
