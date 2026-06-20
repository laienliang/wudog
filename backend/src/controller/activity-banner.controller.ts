import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { ActivityBannerService } from '../service/activity-banner.service';

/**
 * 活动横幅控制器
 * 处理活动横幅相关的 API 请求，包括活动横幅的增删改查操作
 */
@Controller('/api/activity-banners')
export class ActivityBannerController {
  @Inject()
  activityBannerService: ActivityBannerService;

  /**
   * 获取活动横幅列表（分页）
   * GET /api/activity-banners/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @param keyword - 搜索关键词（可选）
   * @returns 分页活动横幅列表
   */
  @Get('/list')
  async list(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string) {
    const result = await this.activityBannerService.findAll(Number(page), Number(pageSize), keyword);
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取活动横幅详情
   * GET /api/activity-banners/detail/:id
   * @param id - 活动横幅 ID
   * @returns 活动横幅详细信息
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    const item = await this.activityBannerService.findById(Number(id));
    if (!item) return { code: 404, message: '活动横幅不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 创建活动横幅
   * POST /api/activity-banners/create
   * @param body - 活动横幅信息
   * @returns 创建后的活动横幅信息
   */
  @Post('/create')
  async create(@Body() body: any) {
    const item = await this.activityBannerService.create(body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 更新活动横幅信息
   * PUT /api/activity-banners/update/:id
   * @param id - 活动横幅 ID
   * @param body - 更新的活动横幅信息
   * @returns 更新后的活动横幅信息
   */
  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    delete body.id;
    const item = await this.activityBannerService.update(Number(id), body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 删除活动横幅
   * DELETE /api/activity-banners/delete/:id
   * @param id - 活动横幅 ID
   * @returns 操作结果
   */
  @Del('/delete/:id')
  async remove(@Param('id') id: number) {
    await this.activityBannerService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }
}
