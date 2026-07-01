import { Controller, Get, Post, Put, Inject, Body } from '@midwayjs/core';
import { CurrentUser } from '../decorator/CurrentUser';
import { UserService } from '../service/UserService';

@Controller('/api/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Post('/register')
  async register(@Body() body: { username: string; password: string; nickname?: string; phone?: string }) {
    if (!body.username || !body.password) {
      return { code: 400, message: '请输入用户名和密码', data: null };
    }
    const result = await this.userService.register(body.username, body.password, body.nickname, body.phone);
    if (!result) {
      return { code: 400, message: '用户名已存在', data: null };
    }
    return { code: 200, message: '注册成功', data: result };
  }

  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    if (!body.username || !body.password) {
      return { code: 400, message: '请输入用户名和密码', data: null };
    }
    const result = await this.userService.login(body.username, body.password);
    if (!result) {
      return { code: 401, message: '用户名或密码错误', data: null };
    }
    return { code: 200, message: 'success', data: result };
  }

  @Get('/info')
  async info(@CurrentUser user: any) {
    const userId = user?.id;
    if (!userId) {
      return { code: 401, message: '未登录', data: null };
    }
    const userInfo = await this.userService.getUserInfo(userId);
    return { code: 200, message: 'success', data: userInfo };
  }

  @Put('/update-profile')
  async updateProfile(@CurrentUser user: any, @Body() body: { nickname?: string; avatar?: string; phone?: string }) {
    const userId = user?.id;
    if (!userId) {
      return { code: 401, message: '未登录', data: null };
    }
    const result = await this.userService.updateProfile(userId, body);
    return { code: 200, message: '更新成功', data: result };
  }

  @Put('/update-password')
  async updatePassword(@CurrentUser user: any, @Body() body: { oldPassword: string; newPassword: string }) {
    const userId = user?.id;
    if (!userId) {
      return { code: 401, message: '未登录', data: null };
    }
    if (!body.oldPassword || !body.newPassword) {
      return { code: 400, message: '请输入原密码和新密码', data: null };
    }
    const result = await this.userService.updatePassword(userId, body.oldPassword, body.newPassword);
    if (result?.error) {
      return { code: 400, message: result.error, data: null };
    }
    return { code: 200, message: '密码修改成功', data: null };
  }
}
