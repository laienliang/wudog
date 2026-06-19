import { Controller, Post, Inject, Body, Get, Headers } from '@midwayjs/decorator';
import { AdminService } from '../service/admin.service';
import { JwtService } from '@midwayjs/jwt';

/**
 * 管理员认证控制器
 * 处理管理员登录认证相关的 API 请求，包括登录和获取管理员信息
 */
@Controller('/api/auth')
export class AuthController {
  @Inject()
  adminService: AdminService;

  @Inject()
  jwtService: JwtService;

  /**
   * 管理员登录
   * POST /api/auth/login
   * @param body - 登录信息，包含 username（用户名）和 password（密码）
   * @returns 登录成功返回 JWT token 和管理员基本信息
   */
  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    const bcrypt = require('bcryptjs');
    const admin = await this.adminService.findByUsername(body.username);
    if (!admin) {
      return { code: 401, message: '用户名或密码错误', data: null };
    }
    if (admin.status === 0) {
      return { code: 403, message: '账号已被禁用', data: null };
    }
    const valid = bcrypt.compareSync(body.password, admin.password_hash);
    if (!valid) {
      return { code: 401, message: '用户名或密码错误', data: null };
    }
    const token = await this.jwtService.sign({ id: admin.id, username: admin.username, role_id: admin.role_id });
    await this.adminService.update(admin.id, { last_login_at: new Date() });
    return {
      code: 200,
      message: 'success',
      data: {
        token,
        admin: { id: admin.id, username: admin.username, name: admin.name, role_id: admin.role_id }
      }
    };
  }

  /**
   * 获取当前登录管理员信息
   * GET /api/auth/info
   * @param auth - 请求头中的 Authorization Bearer token
   * @returns 当前登录管理员的基本信息
   */
  @Get('/info')
  async info(@Headers('authorization') auth: string) {
    try {
      const token = auth?.replace('Bearer ', '');
      const payload: any = await this.jwtService.verify(token);
      const admin = await this.adminService.findById(payload.id);
      if (!admin) return { code: 401, message: '未登录', data: null };
      return { code: 200, message: 'success', data: { id: admin.id, username: admin.username, name: admin.name, role_id: admin.role_id } };
    } catch {
      return { code: 401, message: 'token无效', data: null };
    }
  }
}
