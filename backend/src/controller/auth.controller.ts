import { Controller, Post, Inject, Body, Get, Headers } from '@midwayjs/decorator';
import { AdminService } from '../service/admin.service';
import { JwtService } from '@midwayjs/jwt';

/**
 * 管理员认证控制器
 * 处理管理员登录认证相关的 API 请求，包括登录、短信验证码和获取管理员信息
 */
@Controller('/api/auth')
export class AuthController {
  @Inject()
  adminService: AdminService;

  @Inject()
  jwtService: JwtService;

  /**
   * 发送短信验证码（模拟）
   * POST /api/auth/send-code
   * @param body - 包含 phone（手机号）
   * @returns 发送结果（验证码打印到日志，不接入真实短信服务商）
   */
  @Post('/send-code')
  async sendCode(@Body() body: { phone: string }) {
    if (!body.phone || !/^1\d{10}$/.test(body.phone)) {
      return { code: 400, message: '请输入正确的手机号', data: null };
    }
    // 生成6位随机验证码
    const code = String(Math.floor(100000 + Math.random() * 900000));
    // 模拟发送：打印到后端日志
    console.log(`[SMS模拟] 手机号: ${body.phone}, 验证码: ${code}`);
    return { code: 200, message: '验证码已发送', data: { phone: body.phone } };
  }

  /**
   * 管理员登录
   * POST /api/auth/login
   * @param body - 登录信息，包含 username（用户名）、password（密码）和 code（短信验证码，任意6位数字通过）
   * @returns 登录成功返回 JWT token 和管理员基本信息
   */
  @Post('/login')
  async login(@Body() body: { username: string; password: string; code?: string }) {
    // 短信验证码校验（模拟：任意6位数字均通过）
    if (body.code !== undefined) {
      if (!/^\d{6}$/.test(body.code)) {
        return { code: 400, message: '短信验证码格式错误，请输入6位数字', data: null };
      }
      console.log(`[SMS模拟] 验证码校验通过: ${body.code}`);
    }

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
