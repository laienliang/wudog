// ============================================================
// 住宿评价 Controller
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\controller\review.ts
// ============================================================
import { Controller, Get, Post, Put, Del, Inject, Body, Query, Param } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ReviewService } from '../service/review';
import { ReviewCreateDTO, ReviewReplyDTO } from '../dto/review';

@Controller('/api/lodging')
export class ReviewController {
  @Inject()
  reviewService: ReviewService;

  // ==================== 游客端接口 ====================

  /** GET /api/lodging/reviews — 评价列表（按民宿筛选） */
  @Get('/reviews')
  async list(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('homestay_id') homestayId?: number
  ) {
    const data = await this.reviewService.list({ page, pageSize, homestay_id: homestayId });
    return { code: 200, message: 'success', data };
  }

  /** POST /api/lodging/reviews — 提交评价 */
  @Post('/reviews')
  async create(@Body() body: ReviewCreateDTO, ctx: Context) {
    const userId = (ctx as any).currentUser?.id || 1;
    try {
      const data = await this.reviewService.create({
        order_id: body.order_id,
        rating: body.rating,
        content: body.content,
        images: body.images,
        user_id: userId,
        homestay_id: body.homestay_id,
      });
      return { code: 200, message: '评价成功', data };
    } catch (err: any) {
      return { code: 400, message: err.message, data: null };
    }
  }

  // ==================== 管理端接口 ====================

  /** GET /api/lodging/admin/reviews — 评价管理列表 */
  @Get('/admin/reviews')
  async adminList(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    try {
      const data = await this.reviewService.list({ page, pageSize });
      if (!data) return { code: 200, message: 'success', data: { total: 0, list: [] } };
      return { code: 200, message: 'success', data };
    } catch (err: any) {
      return { code: 200, message: 'success', data: { total: 0, list: [] } };
    }
  }

  /** POST /api/lodging/admin/reviews/:id/reply — 房东回复 */
  @Post('/admin/reviews/:id/reply')
  async reply(@Param('id') id: number, @Body() body: ReviewReplyDTO) {
    try {
      const data = await this.reviewService.reply(id, body.owner_reply);
      return { code: 200, message: '回复成功', data };
    } catch (err: any) {
      return { code: 400, message: err.message, data: null };
    }
  }

  /** PUT /api/lodging/admin/reviews/:id/status — 切换显示/隐藏 */
  @Put('/admin/reviews/:id/status')
  async toggleStatus(@Param('id') id: number, @Body('status') status: number) {
    await this.reviewService.toggleStatus(id, status);
    return { code: 200, message: '状态更新成功', data: null };
  }

  /** DELETE /api/lodging/admin/reviews/:id — 软删除 */
  @Del('/admin/reviews/:id')
  async delete(@Param('id') id: number) {
    await this.reviewService.softDelete(id);
    return { code: 200, message: '删除成功', data: null };
  }
}