import { Controller, Get, Post, Put, Del, Param, Body, Query, Inject } from '@midwayjs/core';
import { AdminService } from '../service/admin.service';

@Controller('/api/v1/admin')
export class AdminController {
  @Inject()
  adminService: AdminService;

  // === 用户管理 ===

  @Get('/users')
  async listUsers(@Query() q: any) {
    return this.adminService.listUsers(q);
  }

  @Get('/users/:id')
  async getUserDetail(@Param('id') id: number) {
    return this.adminService.getUserDetail(id);
  }

  @Put('/users/:id')
  async updateUser(@Param('id') id: number, @Body() b: any) {
    return this.adminService.updateUser(id, b);
  }

  @Put('/users/:id/status')
  async toggleUserStatus(@Param('id') id: number, @Body() b: { status: number }) {
    return this.adminService.toggleUserStatus(id, b.status);
  }

  // === 商家管理 ===

  @Get('/merchants')
  async listMerchants(@Query() q: any) {
    return this.adminService.listMerchants(q);
  }

  @Post('/merchants/:id/force-logout')
  async forceLogoutMerchant(@Param('id') id: number) {
    await this.adminService.forceLogoutMerchant(id);
    return { success: true };
  }

  @Put('/merchants/:id/status')
  async updateMerchantStatus(@Param('id') id: number, @Body() b: { status: number }) {
    await this.adminService.updateMerchantStatus(id, b.status);
    return { success: true };
  }

  @Get('/merchant-applications')
  async listApplications(@Query() q: any) {
    return this.adminService.listApplications(q);
  }

  @Post('/merchant-applications/:id/review')
  async reviewApplication(
    @Param('id') id: number,
    @Body() b: { reviewerId?: number; status: number; rejectReason?: string },
  ) {
    return this.adminService.reviewApplication(
      id,
      b.reviewerId || 1,
      b.status,
      b.rejectReason,
    );
  }

  // === 角色权限 ===

  @Get('/roles')
  async listRoles() {
    return this.adminService.listRoles();
  }

  @Post('/roles')
  async createRole(@Body() b: any) {
    return this.adminService.createRole(b);
  }

  @Put('/roles/:id')
  async updateRole(@Param('id') id: number, @Body() b: any) {
    return this.adminService.updateRole(id, b);
  }

  @Del('/roles/:id')
  async deleteRole(@Param('id') id: number) {
    await this.adminService.deleteRole(id);
    return { success: true };
  }

  // === 数据看板 ===

  @Get('/dashboard')
  async dashboard() {
    return this.adminService.getDashboard();
  }

  // === 轮播图 ===

  @Get('/banners')
  async listBanners() {
    return this.adminService.listBanners();
  }

  @Post('/banners')
  async createBanner(@Body() b: any) {
    return this.adminService.createBanner(b);
  }

  @Put('/banners/:id')
  async updateBanner(@Param('id') id: number, @Body() b: any) {
    return this.adminService.updateBanner(id, b);
  }

  @Del('/banners/:id')
  async deleteBanner(@Param('id') id: number) {
    await this.adminService.deleteBanner(id);
    return { success: true };
  }

  // === 公告 ===

  @Get('/announcements')
  async listAnnouncements(@Query() q: any) {
    return this.adminService.listAnnouncements(q);
  }

  @Post('/announcements')
  async createAnnouncement(@Body() b: any) {
    return this.adminService.createAnnouncement(b);
  }

  @Put('/announcements/:id')
  async updateAnnouncement(@Param('id') id: number, @Body() b: any) {
    return this.adminService.updateAnnouncement(id, b);
  }

  @Del('/announcements/:id')
  async deleteAnnouncement(@Param('id') id: number) {
    await this.adminService.deleteAnnouncement(id);
    return { success: true };
  }

  // === 推荐位 ===

  @Get('/recommendations')
  async listRecommendations() {
    return this.adminService.listRecommendations();
  }

  @Get('/recommendations/featured')
  async featuredRecommendations() {
    return this.adminService.getFeaturedRecommendations();
  }

  @Post('/recommendations')
  async createRecommendation(@Body() b: any) {
    return this.adminService.createRecommendation(b);
  }

  @Put('/recommendations/:id')
  async updateRecommendation(@Param('id') id: number, @Body() b: any) {
    return this.adminService.updateRecommendation(id, b);
  }

  @Del('/recommendations/:id')
  async deleteRecommendation(@Param('id') id: number) {
    await this.adminService.deleteRecommendation(id);
    return { success: true };
  }

  // === 系统消息 ===

  @Get('/messages')
  async listMessages(@Query() q: any) {
    return this.adminService.listMessages(q);
  }

  @Post('/messages')
  async sendMessage(@Body() b: any) {
    return this.adminService.sendMessage(b);
  }

  // === 财务 ===

  @Get('/finance')
  async listFinance(@Query() q: any) {
    return this.adminService.listFinance(q);
  }

  // === 系统配置 ===

  @Get('/config')
  async getConfig(@Query('key') key?: string) {
    return this.adminService.getConfig(key);
  }

  @Put('/config/:key')
  async setConfig(@Param('key') key: string, @Body() b: { value: string }) {
    return this.adminService.setConfig(key, b.value);
  }

  // === 敏感词 ===

  @Get('/sensitive-words')
  async listSensitiveWords() {
    return this.adminService.listSensitiveWords();
  }

  @Post('/sensitive-words')
  async createSensitiveWord(@Body() b: any) {
    return this.adminService.createSensitiveWord(b);
  }

  @Del('/sensitive-words/:id')
  async deleteSensitiveWord(@Param('id') id: number) {
    await this.adminService.deleteSensitiveWord(id);
    return { success: true };
  }

  // === 操作日志 ===

  @Get('/operation-logs')
  async listOperationLogs(@Query() q: any) {
    return this.adminService.listOperationLogs(q);
  }

  // === 活动横幅 ===

  @Get('/activity-banners')
  async listActivityBanners() {
    return this.adminService.listActivityBanners();
  }

  @Post('/activity-banners')
  async createActivityBanner(@Body() b: any) {
    return this.adminService.createActivityBanner(b);
  }

  @Put('/activity-banners/:id')
  async updateActivityBanner(@Param('id') id: number, @Body() b: any) {
    return this.adminService.updateActivityBanner(id, b);
  }

  @Del('/activity-banners/:id')
  async deleteActivityBanner(@Param('id') id: number) {
    await this.adminService.deleteActivityBanner(id);
    return { success: true };
  }

  // === 消息模板 ===

  @Get('/message-templates')
  async listMessageTemplates(@Query() q: any) {
    return this.adminService.listMessageTemplates(q);
  }

  @Post('/message-templates')
  async createMessageTemplate(@Body() b: any) {
    return this.adminService.createMessageTemplate(b);
  }

  @Put('/message-templates/:id')
  async updateMessageTemplate(@Param('id') id: number, @Body() b: any) {
    return this.adminService.updateMessageTemplate(id, b);
  }

  @Del('/message-templates/:id')
  async deleteMessageTemplate(@Param('id') id: number) {
    await this.adminService.deleteMessageTemplate(id);
    return { success: true };
  }
}
