import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { CarouselService } from '../service/carousel.service';

/**
 * 轮播图控制器
 * 处理轮播图相关的 API 请求，包括轮播图的增删改查操作
 */
@Controller('/api/carousels')
export class CarouselController {
  @Inject()
  carouselService: CarouselService;

  /**
   * 获取轮播图列表（分页）
   * GET /api/carousels/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @param keyword - 搜索关键词（可选）
   * @returns 分页轮播图列表
   */
  @Get('/list')
  async list(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string) {
    const result = await this.carouselService.findAll(Number(page), Number(pageSize), keyword);
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取轮播图详情
   * GET /api/carousels/detail/:id
   * @param id - 轮播图 ID
   * @returns 轮播图详细信息
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    const item = await this.carouselService.findById(Number(id));
    if (!item) return { code: 404, message: '不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 创建轮播图
   * POST /api/carousels/create
   * @param body - 轮播图信息
   * @returns 创建后的轮播图信息
   */
  @Post('/create')
  async create(@Body() body: any) {
    const item = await this.carouselService.create(body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 更新轮播图信息
   * PUT /api/carousels/update/:id
   * @param id - 轮播图 ID
   * @param body - 更新的轮播图信息
   * @returns 更新后的轮播图信息
   */
  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    delete body.id;
    const item = await this.carouselService.update(Number(id), body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 删除轮播图
   * DELETE /api/carousels/delete/:id
   * @param id - 轮播图 ID
   * @returns 操作结果
   */
  @Del('/delete/:id')
  async remove(@Param('id') id: number) {
    await this.carouselService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }
}
