import { Controller, Get, Post, Put, Del, Query, Body, Param, Inject } from '@midwayjs/core';
import { RoomService } from '../service/room.service';
import { success, fail } from '../utils/response';

@Controller('/room')
export class RoomController {
  @Inject()
  roomService: RoomService;

  /**
   * 房型列表（分页 + 搜索）
   * GET /api/room/list?page=1&pageSize=20&accommodationId=1
   */
  @Get('/list')
  async list(@Query() query: any) {
    const result = await this.roomService.list(query);
    return success(result);
  }

  /**
   * 房型详情
   * GET /api/room/detail/:id
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    if (!id) return fail('参数错误: id 不能为空');
    const data = await this.roomService.detail(Number(id));
    if (!data) return fail('房型不存在', 404);
    return success(data);
  }

  /**
   * 新增房型
   * POST /api/room/create
   */
  @Post('/create')
  async create(@Body() body: any) {
    if (!body || !body.name || !body.accommodationId) {
      return fail('参数错误: name、accommodationId 不能为空');
    }
    const data = await this.roomService.create(body);
    return success(data, '创建成功');
  }

  /**
   * 更新房型
   * PUT /api/room/update/:id
   */
  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    if (!id) return fail('参数错误: id 不能为空');
    if (!body) return fail('参数错误: 更新内容不能为空');
    const data = await this.roomService.update(Number(id), body);
    if (!data) return fail('房型不存在', 404);
    return success(data, '更新成功');
  }

  /**
   * 软删除房型
   * DELETE /api/room/delete/:id
   */
  @Del('/delete/:id')
  async delete(@Param('id') id: number) {
    if (!id) return fail('参数错误: id 不能为空');
    try {
      await this.roomService.softDelete(Number(id));
      return success(null, '删除成功');
    } catch (e) {
      return fail(e.message, 404);
    }
  }
}
