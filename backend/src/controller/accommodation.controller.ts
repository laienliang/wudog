import { Controller, Get, Post, Put, Del, Query, Body, Param, Inject } from '@midwayjs/core';
import { AccommodationService } from '../service/accommodation.service';
import { RoomService } from '../service/room.service';
import { success, fail } from '../utils/response';

@Controller('/accommodation')
export class AccommodationController {
  @Inject()
  accommodationService: AccommodationService;

  @Inject()
  roomService: RoomService;

  /**
   * 住宿/民宿列表（分页 + 搜索）
   * GET /api/accommodation/list?page=1&pageSize=20&keyword=苗岭&villageId=1&type=minsute&minPrice=200&maxPrice=600
   */
  @Get('/list')
  async list(@Query() query: any) {
    const result = await this.accommodationService.list(query);
    return success(result);
  }

  /**
   * 住宿详情（含房型列表）
   * GET /api/accommodation/detail/:id
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    if (!id) return fail('参数错误: id 不能为空');
    const accommodation = await this.accommodationService.detail(Number(id));
    if (!accommodation) return fail('住宿不存在', 404);

    // 获取该住宿下的所有房型
    const roomsResult = await this.roomService.list({ accommodationId: id, pageSize: 100 });
    const rooms = roomsResult.list || [];

    // 解析 JSON 字段
    const data: any = typeof (accommodation as any).toJSON === 'function'
      ? { ...(accommodation as any).toJSON() }
      : { ...(accommodation as any) };

    // 处理 images 字段（后端存储为JSON字符串，前端需要数组）
    try {
      if (typeof data.images === 'string') {
        data.images = JSON.parse(data.images);
      }
    } catch { data.images = []; }

    // 处理 facilities 字段
    try {
      if (typeof data.facilities === 'string') {
        data.facilities = JSON.parse(data.facilities);
      }
    } catch { data.facilities = []; }

    return success({
      ...data,
      rooms
    });
  }

  /**
   * 新增住宿
   * POST /api/accommodation/create
   */
  @Post('/create')
  async create(@Body() body: any) {
    if (!body || !body.name || !body.villageId) {
      return fail('参数错误: name、villageId 不能为空');
    }
    const data = await this.accommodationService.create(body);
    return success(data, '创建成功');
  }

  /**
   * 更新住宿
   * PUT /api/accommodation/update/:id
   */
  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    if (!id) return fail('参数错误: id 不能为空');
    if (!body) return fail('参数错误: 更新内容不能为空');
    const data = await this.accommodationService.update(Number(id), body);
    if (!data) return fail('住宿不存在', 404);
    return success(data, '更新成功');
  }

  /**
   * 软删除住宿
   * DELETE /api/accommodation/delete/:id
   */
  @Del('/delete/:id')
  async delete(@Param('id') id: number) {
    if (!id) return fail('参数错误: id 不能为空');
    try {
      await this.accommodationService.softDelete(Number(id));
      return success(null, '删除成功');
    } catch (e) {
      return fail(e.message, 404);
    }
  }
}
