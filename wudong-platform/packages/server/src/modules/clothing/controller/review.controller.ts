import { Controller, Get, Post, Put, Del, Param, Body, Query, Inject } from '@midwayjs/core';
import { Validate } from '@midwayjs/validate';
import { ReviewService } from '../service/review.service';

@Controller('/api/v1/reviews')
export class ReviewController {
  @Inject()
  reviewService: ReviewService;

  @Get('/')
  async list(@Query() query: any) {
    return this.reviewService.paginate(query);
  }

  @Get('/:id')
  async detail(@Param('id') id: number) {
    const review = await this.reviewService['reviewModel'].findOne({ where: { id } });
    if (!review) throw new Error('评价不存在');
    return review;
  }

  @Put('/:id/status')
  async updateStatus(@Param('id') id: number, @Body() body: { status: string }) {
    return this.reviewService.updateStatus(id, body.status);
  }

  @Post('/batch/status')
  async batchUpdateStatus(@Body() body: { ids: number[]; status: string }) {
    return this.reviewService.batchUpdateStatus(body.ids, body.status);
  }

  @Post('/batch/delete')
  async batchDelete(@Body() body: { ids: number[] }) {
    return this.reviewService.batchDelete(body.ids);
  }

  @Put('/:id/reply')
  async reply(@Param('id') id: number, @Body() body: { reply: string }) {
    return this.reviewService.reply(id, body.reply);
  }

  @Del('/:id')
  async delete(@Param('id') id: number) {
    await this.reviewService.softDelete(id);
    return { success: true };
  }
}
