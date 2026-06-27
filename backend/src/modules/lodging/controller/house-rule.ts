// ============================================================
// 入住须知 Controller
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\controller\house-rule.ts
// ============================================================
import { Controller, Get, Post, Put, Del, Inject, Body, Query, Param } from '@midwayjs/core';
import { HouseRuleService } from '../service/house-rule';
import { HouseRuleSaveDTO } from '../dto/house-rule';

@Controller('/api/lodging')
export class HouseRuleController {
  @Inject()
  houseRuleService: HouseRuleService;

  // ==================== 游客端接口 ====================

  /** GET /api/lodging/homestays/:id/rules — 获取某民宿的入住须知 */
  @Get('/homestays/:id/rules')
  async getByHomestay(@Param('id') homestayId: number) {
    try {
      const data = await this.houseRuleService.getByHomestay(homestayId);
      if (!data) return { code: 404, message: '该民宿暂未设置入住须知', data: null };
      return { code: 200, message: 'success', data };
    } catch { return { code: 404, message: '该民宿暂未设置入住须知', data: null }; }
  }

  // ==================== 管理端接口 ====================

  /** GET /api/lodging/admin/house-rules — 分页列表 */
  @Get('/admin/house-rules')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    try {
      const data = await this.houseRuleService.list({ page, pageSize });
      return { code: 200, message: 'success', data: data || { total: 0, list: [] } };
    } catch { return { code: 200, message: 'success', data: { total: 0, list: [] } }; }
  }

  /** POST /api/lodging/admin/house-rules — 新增入住须知 */
  @Post('/admin/house-rules')
  async create(@Body() body: HouseRuleSaveDTO) {
    const data = await this.houseRuleService.save(body);
    return { code: 200, message: '创建成功', data };
  }

  /** PUT /api/lodging/admin/house-rules/:id — 编辑入住须知 */
  @Put('/admin/house-rules/:id')
  async update(@Param('id') id: number, @Body() body: HouseRuleSaveDTO) {
    const data = await this.houseRuleService.save({ ...body, id });
    return { code: 200, message: '更新成功', data };
  }

  /** DELETE /api/lodging/admin/house-rules/:id — 软删除 */
  @Del('/admin/house-rules/:id')
  async delete(@Param('id') id: number) {
    await this.houseRuleService.softDelete(id);
    return { code: 200, message: '删除成功', data: null };
  }
}
