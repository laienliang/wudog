import { Controller, Get, Post, Put, Del, Query, Body, Param, Inject } from '@midwayjs/core';
import { RoomCalendarService } from '../service/room-calendar.service';
import { success, fail } from '../utils/response';

@Controller('/room-calendar')
export class RoomCalendarController {
  @Inject()
  roomCalendarService: RoomCalendarService;

  /**
   * 房态日历列表（分页）
   * GET /api/room-calendar/list?roomId=1&dateFrom=2026-07-01&dateTo=2026-07-07
   */
  @Get('/list')
  async list(@Query() query: any) {
    try {
      const result = await this.roomCalendarService.list(query);
      return success(result);
    } catch (e) {
      return fail(e.message || '服务器内部错误', 500);
    }
  }

  /**
   * 房态日历详情
   * GET /api/room-calendar/detail/:id
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    const data = await this.roomCalendarService.detail(Number(id));
    if (!data) return fail('记录不存在', 404);
    return success(data);
  }

  /**
   * 查询住宿在日期区间的日历（用于详情页展示）
   * GET /api/room-calendar/query?accommodationId=1&checkIn=2026-07-01&checkOut=2026-07-07
   */
  @Get('/query')
  async queryByAccommodation(@Query() query: any) {
    const { accommodationId, checkIn, checkOut } = query;
    if (!accommodationId || !checkIn || !checkOut) {
      return fail('参数错误: accommodationId / checkIn / checkOut 不能为空');
    }
    const data = await this.roomCalendarService.queryByAccommodationAndDateRange(
      Number(accommodationId),
      checkIn,
      checkOut,
    );
    return success(data);
  }

  /**
   * 新增单条房态
   * POST /api/room-calendar/create
   * Body: { roomId, accommodationId, date, price, stock, isClosed?, remark? }
   */
  @Post('/create')
  async create(@Body() body: any) {
    const { roomId, accommodationId, date, price, stock } = body;
    if (!roomId || !accommodationId || !date || price === undefined || stock === undefined) {
      return fail('参数错误: roomId / accommodationId / date / price / stock 不能为空');
    }
    const data = await this.roomCalendarService.create(body);
    return success(data, '创建成功');
  }

  /**
   * 批量 upsert 房态（适合日历批量录入）
   * POST /api/room-calendar/batch
   * Body: { items: [{ roomId, accommodationId, date, price, stock }] }
   */
  @Post('/batch')
  async batch(@Body() body: any) {
    const { items } = body;
    if (!Array.isArray(items) || items.length === 0) {
      return fail('参数错误: items 不能为空数组');
    }
    await this.roomCalendarService.batchUpsert(items);
    return success(null, `批量更新 ${items.length} 条房态成功`);
  }

  /**
   * 更新房态
   * PUT /api/room-calendar/update/:id
   */
  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() body: any) {
    const data = await this.roomCalendarService.update(Number(id), body);
    return success(data, '更新成功');
  }

  /**
   * 软删除房态
   * DELETE /api/room-calendar/delete/:id
   */
  @Del('/delete/:id')
  async softDelete(@Param('id') id: string) {
    try {
      await this.roomCalendarService.softDelete(Number(id));
      return success(null, '删除成功');
    } catch (e) {
      return fail(e.message, 404);
    }
  }
}
