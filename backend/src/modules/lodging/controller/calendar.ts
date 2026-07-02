// ============================================================
// 房态日历 Controller
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\controller\calendar.ts
// ============================================================
import { Controller, Get, Put, Patch, Inject, Body, Query, Param } from '@midwayjs/core';
import { CalendarService } from '../service/calendar';
import { CalendarQueryDTO, CalendarBatchEditDTO, CalendarSingleEditDTO } from '../dto/calendar';

@Controller('/api/lodging')
export class CalendarController {
  @Inject()
  calendarService: CalendarService;

  // ==================== 游客端接口 ====================

  /** GET /api/lodging/calendar/:roomId — 查询某房型日期范围的房态 */
  @Get('/calendar/:roomId')
  async query(
    @Param('roomId') roomId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    try {
      const data = await this.calendarService.query(roomId, startDate, endDate);
      return { code: 200, message: 'success', data: data || [] };
    } catch { return { code: 200, message: 'success', data: [] }; }
  }

  // ==================== 管理端接口 ====================

  /** GET /api/lodging/admin/calendar — 分页列表 */
  @Get('/admin/calendar')
  async list(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('room_id') roomId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    try {
      const data = await this.calendarService.list({ page, pageSize, room_id: roomId, startDate, endDate });
      return { code: 200, message: 'success', data: data || { total: 0, list: [] } };
    } catch { return { code: 200, message: 'success', data: { total: 0, list: [] } }; }
  }

  /**
   * ★ 业务接口2：PUT /api/lodging/room-calendar/batch-edit
   * 后台批量修改日期库存/价格
   */
  @Put('/room-calendar/batch-edit')
  async batchEdit(@Body() body: CalendarBatchEditDTO) {
    try {
      const data = await this.calendarService.batchEdit({
        roomId: body.roomId,
        startDate: body.startDate,
        endDate: body.endDate,
        availableStock: body.availableStock,
        price: body.price,
        status: body.status,
      });
      return { code: 200, message: `批量更新成功，影响 ${data.affected} 条记录`, data };
    } catch (err: any) {
      return { code: 400, message: err.message || '批量更新失败', data: null };
    }
  }

  /** PATCH /api/lodging/admin/calendar/single — 单日编辑 */
  @Patch('/admin/calendar/single')
  async singleEdit(@Body() body: CalendarSingleEditDTO) {
    try {
      const data = await this.calendarService.singleEdit({
        roomId: body.roomId,
        date: body.date,
        availableStock: body.availableStock,
        price: body.price,
        status: body.status,
      });
      return { code: 200, message: '更新成功', data };
    } catch (err: any) {
      return { code: 400, message: err.message || '单日更新失败', data: null };
    }
  }
}
