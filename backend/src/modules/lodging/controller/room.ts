// ============================================================
// 房型 Controller
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\controller\room.ts
// ============================================================
import { Controller, Get, Post, Put, Del, Inject, Body, Query, Param } from '@midwayjs/core';
import { RoomService } from '../service/room';
import { RoomListDTO, RoomSaveDTO } from '../dto/room';

@Controller('/api/lodging')
export class RoomController {
  @Inject()
  roomService: RoomService;

  // ==================== 游客端接口 ====================

  /** GET /api/lodging/rooms — 房型列表（可按民宿筛选） */
  @Get('/rooms')
  async list(@Query() query: RoomListDTO) {
    try {
      const data = await this.roomService.list(query);
      return { code: 200, message: 'success', data: data || { total: 0, list: [] } };
    } catch { return { code: 200, message: 'success', data: { total: 0, list: [] } }; }
  }

  /** GET /api/lodging/rooms/:id — 房型详情 */
  @Get('/rooms/:id')
  async detail(@Param('id') id: number) {
    try {
      const data = await this.roomService.detail(id);
      if (!data) return { code: 404, message: '房型不存在', data: null };
      return { code: 200, message: 'success', data };
    } catch { return { code: 404, message: '房型不存在', data: null }; }
  }

  // ==================== 管理端接口 ====================

  /** GET /api/lodging/admin/rooms — 房型管理列表 */
  @Get('/admin/rooms')
  async adminList(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('homestay_id') homestayId?: number
  ) {
    try {
      const data = await this.roomService.list({ page, pageSize, homestay_id: homestayId });
      if (!data) return { code: 200, message: 'success', data: { total: 0, list: [] } };
      return { code: 200, message: 'success', data };
    } catch (err: any) {
      return { code: 200, message: 'success', data: { total: 0, list: [] } };
    }
  }

  /** POST /api/lodging/admin/rooms — 新增房型 */
  @Post('/admin/rooms')
  async create(@Body() body: RoomSaveDTO) {
    const data = await this.roomService.create(body as any);
    return { code: 200, message: '创建成功', data };
  }

  /** PUT /api/lodging/admin/rooms/:id — 编辑房型 */
  @Put('/admin/rooms/:id')
  async update(@Param('id') id: number, @Body() body: RoomSaveDTO) {
    const data = await this.roomService.update({ ...body as any, id });
    return { code: 200, message: '更新成功', data };
  }

  /** DELETE /api/lodging/admin/rooms/:id — 软删除房型 */
  @Del('/admin/rooms/:id')
  async delete(@Param('id') id: number) {
    await this.roomService.softDelete(id);
    return { code: 200, message: '删除成功', data: null };
  }
}
