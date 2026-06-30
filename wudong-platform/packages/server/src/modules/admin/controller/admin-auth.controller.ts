import { Controller, Post, Body, Inject } from '@midwayjs/core';
import { AdminAuthService } from '../service/admin-auth.service';

@Controller('/api/v1/admin/auth')
export class AdminAuthController {
  @Inject()
  adminAuthService: AdminAuthService;

  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    return this.adminAuthService.login(body.username, body.password);
  }

  @Post('/refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.adminAuthService.refresh(body.refreshToken);
  }

  @Post('/logout')
  async logout() {
    return { success: true };
  }
}
