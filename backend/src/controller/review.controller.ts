import { Controller, Get, Post, Put, Del, Query, Body, Param, Inject } from '@midwayjs/core';
import { ReviewService } from '../service/review.service';
import { success, fail } from '../utils/response';

@Controller('/review')
export class ReviewController {
  @Inject()
  reviewService: ReviewService;

  /**
   * 评价列表（分页 + 筛选）
   * GET /api/review/list?page=1&pageSize=20&accommodationId=1&rating=5
   */
  @Get('/list')
  async list(@Query() query: any) {
    const result = await this.reviewService.list(query);
    return success(result);
  }

  /**
   * 评价详情
   * GET /api/review/detail/:id
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    if (!id) return fail('参数错误: id 不能为空');
    const data = await this.reviewService.detail(Number(id));
    if (!data) return fail('评价不存在', 404);
    return success(data);
  }

  /**
   * 新增评价
   * POST /api/review/create
   */
  @Post('/create')
  async create(@Body() body: any) {
    if (!body || !body.userId || !body.accommodationId) {
      return fail('参数错误: userId、accommodationId 不能为空');
    }
    const data = await this.reviewService.create(body);
    return success(data, '评价成功');
  }

  /**
   * 更新评价
   * PUT /api/review/update/:id
   */
  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    if (!id) return fail('参数错误: id 不能为空');
    if (!body) return fail('参数错误: 更新内容不能为空');
    const data = await this.reviewService.update(Number(id), body);
    if (!data) return fail('评价不存在', 404);
    return success(data, '更新成功');
  }

  /**
   * 软删除评价
   * DELETE /api/review/delete/:id
   */
  @Del('/delete/:id')
  async delete(@Param('id') id: number) {
    if (!id) return fail('参数错误: id 不能为空');
    try {
      await this.reviewService.softDelete(Number(id));
      return success(null, '删除成功');
    } catch (e) {
      return fail(e.message, 404);
    }
  }
}
