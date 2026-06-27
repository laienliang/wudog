import { Controller, Get, Post, Put, Del, Inject, Body, Query, Param } from '@midwayjs/core';
import { HomestayService } from '../service/homestay';
import { HouseRuleService } from '../service/house-rule';
import { HomestayListDTO, HomestaySearchDTO, HomestaySaveDTO } from '../dto/homestay';

@Controller('/api/homestay')
export class HomestayController {
  @Inject()
  homestayService: HomestayService;

  @Inject()
  houseRuleService: HouseRuleService;

  @Get('/list')
  async list(@Query() query: HomestayListDTO) {
    try {
      const data = await this.homestayService.list(query);
      return { code: 200, message: 'success', data: data || { total: 0, list: [] } };
    } catch { return { code: 200, message: 'success', data: { total: 0, list: [] } }; }
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    try {
      const data = await this.homestayService.detail(id);
      if (!data) return { code: 404, message: '民宿不存在', data: null };
      return { code: 200, message: 'success', data };
    } catch { return { code: 404, message: '民宿不存在', data: null }; }
  }

  @Get('/search')
  async search(@Query() query: HomestaySearchDTO) {
    try {
      const data = await this.homestayService.searchByDate(query);
      return { code: 200, message: 'success', data: data || { total: 0, list: [] } };
    } catch { return { code: 200, message: 'success', data: { total: 0, list: [] } }; }
  }

  @Post('/create')
  async create(@Body() body: HomestaySaveDTO) {
    try {
      const data = await this.homestayService.create(body as any);
      return { code: 200, message: '创建成功', data: data as any };
    } catch (err: any) { return { code: 400, message: err.message || '创建失败', data: null }; }
  }

  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: HomestaySaveDTO) {
    try {
      const data = await this.homestayService.update({ ...body as any, id });
      return { code: 200, message: '更新成功', data };
    } catch (err: any) { return { code: 400, message: err.message || '更新失败', data: null }; }
  }

  @Get('/:id/rules')
  async getRules(@Param('id') id: number) {
    try {
      const data = await this.houseRuleService.getByHomestay(id);
      if (!data) return { code: 404, message: '该民宿暂未设置入住须知', data: null };
      return { code: 200, message: 'success', data };
    } catch { return { code: 404, message: '该民宿暂未设置入住须知', data: null }; }
  }

  @Del('/delete/:id')
  async delete(@Param('id') id: number) {
    try {
      await this.homestayService.softDelete(id);
      return { code: 200, message: '删除成功', data: null };
    } catch (err: any) { return { code: 400, message: err.message || '删除失败', data: null }; }
  }
}
