import { Controller, Get, Post, Put, Del, Param, Body, Query, Inject } from '@midwayjs/core';
import { AccommodationService } from '../service/accommodation.service';

@Controller('/api/v1')
export class AccommodationController {
  @Inject()
  accommodationService: AccommodationService;

  // ===== 民宿 =====
  @Get('/homestays')
  async list(@Query() q: any) { return this.accommodationService.listHomestays(q); }

  @Get('/homestays/all')
  async all() { return this.accommodationService.getAllHomestays(); }

  @Get('/homestays/:id')
  async detail(@Param('id') id: number) { return this.accommodationService.getHomestay(id); }

  @Post('/homestays')
  async create(@Body() b: any) { return this.accommodationService.createHomestay(b); }

  @Put('/homestays/:id')
  async update(@Param('id') id: number, @Body() b: any) { return this.accommodationService.updateHomestay(id, b); }

  @Del('/homestays/:id')
  async delete(@Param('id') id: number) { await this.accommodationService.deleteHomestay(id); return { success: true }; }

  // ===== 房型 =====
  @Get('/homestays/:id/room-types')
  async roomTypes(@Param('id') id: number) { return this.accommodationService.listRoomTypes(id); }

  @Get('/room-types/all')
  async allRoomTypes() { return this.accommodationService.listRoomTypes(); }

  @Post('/room-types')
  async createRoomType(@Body() b: any) { return this.accommodationService.createRoomType(b); }

  @Put('/room-types/:id')
  async updateRoomType(@Param('id') id: number, @Body() b: any) { return this.accommodationService.updateRoomType(id, b); }

  @Del('/room-types/:id')
  async deleteRoomType(@Param('id') id: number) { await this.accommodationService.deleteRoomType(id); return { success: true }; }

  // ===== 房态日历 =====
  @Get('/room-types/:id/calendar')
  async calendar(@Param('id') id: number, @Query('month') month: string) {
    return this.accommodationService.getCalendar(id, month);
  }

  @Post('/calendar/batch')
  async batchCalendar(@Body() b: any) { return this.accommodationService.batchSetCalendar(b); }

  // ===== 住宿评价 =====
  @Get('/accommodation-reviews')
  async reviews(@Query() q: any) { return this.accommodationService.listAccommodationReviews(q); }

  // ===== 住宿订单 =====
  @Get('/accommodation-orders')
  async orders(@Query() q: any) { return this.accommodationService.listAccommodationOrders(q); }
}
