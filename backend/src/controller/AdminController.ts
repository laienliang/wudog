import { Controller, Post, Inject, Body } from '@midwayjs/core';
import { AdminService } from '../service/AdminService';

@Controller('/api/admin')
export class AdminController {
  @Inject()
  adminService: AdminService;

  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    if (!body.username || !body.password) {
      return { code: 400, message: '请输入用户名和密码', data: null };
    }
    const result = await this.adminService.login(body.username, body.password);
    if (!result) {
      return { code: 401, message: '用户名或密码错误', data: null };
    }
    return { code: 200, message: 'success', data: result };
  }
}
