import { Controller, Get, Post, Put, Del, Query, Body, Param, Inject } from '@midwayjs/core';
import { MiaoVillageService } from '../service/miao-village.service';
import { success, fail } from '../utils/response';

@Controller('/miao-village')
export class MiaoVillageController {
  @Inject()
  miaoVillageService: MiaoVillageService;

  /**
   * 苗寨列表（分页 + 搜索）
   * GET /api/miao-village/list?page=1&pageSize=20&keyword=苗寨
   */
  @Get('/list')
  async list(@Query() query: any) {
    try {
      const result = await this.miaoVillageService.list(query);
      return success(result);
    } catch (e) {
      console.error('[miao-village list error]', e);
      return fail(e.message || '服务器内部错误', 500);
    }
  }

  /**
   * 苗寨详情
   * GET /api/miao-village/detail/:id
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    if (!id) return fail('参数错误: id 不能为空');
    const data = await this.miaoVillageService.detail(Number(id));
    if (!data) return fail('苗寨不存在', 404);
    return success(data);
  }

  /**
   * 新增苗寨
   * POST /api/miao-village/create
   */
  @Post('/create')
  async create(@Body() body: any) {
    if (!body || !body.name) {
      return fail('参数错误: name 不能为空');
    }
    const data = await this.miaoVillageService.create(body);
    return success(data, '创建成功');
  }

  /**
   * 更新苗寨
   * PUT /api/miao-village/update/:id
   */
  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    if (!id) return fail('参数错误: id 不能为空');
    if (!body) return fail('参数错误: 更新内容不能为空');
    const data = await this.miaoVillageService.update(Number(id), body);
    if (!data) return fail('苗寨不存在', 404);
    return success(data, '更新成功');
  }

  /**
   * 软删除苗寨
   * DELETE /api/miao-village/delete/:id
   */
  @Del('/delete/:id')
  async delete(@Param('id') id: number) {
    if (!id) return fail('参数错误: id 不能为空');
    try {
      await this.miaoVillageService.softDelete(Number(id));
      return success(null, '删除成功');
    } catch (e) {
      return fail(e.message, 404);
    }
  }
}
