import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { AnnouncementService } from '../service/announcement.service';

/**
 * 公告控制器
 * 处理公告相关的 API 请求，包括公告的增删改查操作
 */
@Controller('/api/announcements')
export class AnnouncementController {
  @Inject()
  announcementService: AnnouncementService;

  /**
   * 获取公告列表（分页）
   * GET /api/announcements/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @param keyword - 搜索关键词（可选）
   * @returns 分页公告列表
   */
  @Get('/list')
  async list(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string) {
    const result = await this.announcementService.findAll(Number(page), Number(pageSize), keyword);
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取公告详情
   * GET /api/announcements/detail/:id
   * @param id - 公告 ID
   * @returns 公告详细信息
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    const item = await this.announcementService.findById(Number(id));
    if (!item) return { code: 404, message: '不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 创建公告
   * POST /api/announcements/create
   * @param body - 公告信息
   * @returns 创建后的公告信息
   */
  @Post('/create')
  async create(@Body() body: any) {
    const item = await this.announcementService.create(body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 更新公告信息
   * PUT /api/announcements/update/:id
   * @param id - 公告 ID
   * @param body - 更新的公告信息
   * @returns 更新后的公告信息
   */
  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    delete body.id;
    const item = await this.announcementService.update(Number(id), body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 删除公告
   * DELETE /api/announcements/delete/:id
   * @param id - 公告 ID
   * @returns 操作结果
   */
  @Del('/delete/:id')
  async remove(@Param('id') id: number) {
    await this.announcementService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }
}
