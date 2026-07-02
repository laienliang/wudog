// ============================================================
// 认证 Controller — 登录签发 JWT
// ============================================================
import { Controller, Post, Inject, Body } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';

@Controller('/api/auth')
export class AuthController {
  @Inject()
  jwtService: JwtService;

  /** POST /api/auth/login — 登录获取 token */
  @Post('/login')
  async login(@Body('username') username: string, @Body('password') password: string) {
    // 演示用：admin/admin123 可登录，后续可接入真实用户表
    if (username === 'admin' && password === 'admin123') {
      const token = await this.jwtService.sign({
        id: 1,
        username: 'admin',
        role: 'admin',
      });
      return {
        code: 200,
        message: '登录成功',
        data: { token, user: { id: 1, username: 'admin', role: 'admin' } },
      };
    }
    // 游客登录（任意用户名密码，返回游客 token）
    const token = await this.jwtService.sign({
      id: 999,
      username: username || 'guest',
      role: 'guest',
    });
    return {
      code: 200,
      message: '游客登录成功',
      data: { token, user: { id: 999, username: username || 'guest', role: 'guest' } },
    };
  }
}
