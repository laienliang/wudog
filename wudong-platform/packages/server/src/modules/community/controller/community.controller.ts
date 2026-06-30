import { Controller, Get, Post, Put, Del, Param, Body, Query, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CommunityService } from '../service/community.service';

@Controller('/api/v1')
export class CommunityController {
  @Inject() ctx: Context;
  @Inject() communityService: CommunityService;

  @Get('/travelogues') async listTravelogues(@Query() q: any) { return this.communityService.listTravelogues(q); }
  @Get('/travelogues/:id') async detailTravelogue(@Param('id') id: number) { return this.communityService.getTravelogue(id); }
  @Post('/travelogues') async createTravelogue(@Body() b: any) {
    const userId = this.ctx.user?.userId || b.userId || 1;
    return this.communityService.createTravelogue({ ...b, userId });
  }
  @Put('/travelogues/:id') async updateTravelogue(@Param('id') id: number, @Body() b: any) { return this.communityService.updateTravelogue(id, b); }
  @Put('/travelogues/:id/status') async updateStatus(@Param('id') id: number, @Body() b: { status: number }) { return this.communityService.updateStatus(id, b.status); }
  @Del('/travelogues/:id') async deleteTravelogue(@Param('id') id: number) { await this.communityService.deleteTravelogue(id); return { success: true }; }

  @Get('/comments') async listComments(@Query() q: any) { return this.communityService.listComments(q); }
  @Post('/comments') async createComment(@Body() b: any) { return this.communityService.createComment(b); }
  @Del('/comments/:id') async deleteComment(@Param('id') id: number) { await this.communityService.deleteComment(id); return { success: true }; }

  @Post('/likes') async toggleLike(@Body() b: { userId: number; targetType: string; targetId: number }) {
    return this.communityService.toggleLike(b.userId || 1, b.targetType, b.targetId);
  }

  @Get('/topics') async listTopics() { return this.communityService.listTopics(); }
  @Post('/topics') async createTopic(@Body() b: any) { return this.communityService.createTopic(b); }
  @Put('/topics/:id') async updateTopic(@Param('id') id: number, @Body() b: any) { return this.communityService.updateTopic(id, b); }
  @Del('/topics/:id') async deleteTopic(@Param('id') id: number) { await this.communityService.deleteTopic(id); return { success: true }; }

  @Post('/follows') async toggleFollow(@Body() b: { followerId: number; followingId: number }) {
    return this.communityService.toggleFollow(b.followerId || 1, b.followingId || 1);
  }

  @Post('/favorites') async toggleFavorite(@Body() b: { userId: number; targetType: string; targetId: number }) {
    return this.communityService.toggleFavorite(b.userId || 1, b.targetType, b.targetId);
  }

  @Post('/reports') async createReport(@Body() b: any) { return this.communityService.reportModel.save(b); }
  @Get('/reports') async listReports(@Query() q: any) { return this.communityService.listReports(q); }
  @Put('/reports/:id/status') async updateReportStatus(@Param('id') id: number, @Body() b: { status: number }) {
    return this.communityService.updateReportStatus(id, b.status);
  }

  @Get('/community/stats') async stats() { return this.communityService.getStats(); }
}
