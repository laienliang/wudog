import { Controller, Post, Inject, Body, Get, Headers } from '@midwayjs/decorator';
import { MerchantService } from '../service/merchant.service';
import { JwtService } from '@midwayjs/jwt';

/**
 * 商家认证控制器
 * 处理商家登录认证相关的 API 请求，包括登录和获取商家信息
 */
@Controller('/api/merchant-auth')
export class MerchantAuthController {
  @Inject()
  merchantService: MerchantService;

  @Inject()
  jwtService: JwtService;

  /**
   * 商家登录
   * POST /api/merchant-auth/login
   * @param body - 登录信息，包含 username（用户名）和 password（密码）
   * @returns 登录成功返回 JWT token 和商家基本信息
   */
  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    const bcrypt = require('bcryptjs');
    const merchant = await this.merchantService.findByUsername(body.username);
    if (!merchant) {
      return { code: 401, message: '用户名或密码错误', data: null };
    }
    if (merchant.status === 0) {
      return { code: 403, message: '账号已被禁用', data: null };
    }
    const valid = bcrypt.compareSync(body.password, merchant.password_hash);
    if (!valid) {
      return { code: 401, message: '用户名或密码错误', data: null };
    }
    const token = await this.jwtService.sign({
      id: merchant.id,
      username: merchant.username,
      role: 'merchant'
    });
    await this.merchantService.update(merchant.id, { last_login_at: new Date() });
    return {
      code: 200,
      message: 'success',
      data: {
        token,
        merchant: { id: merchant.id, username: merchant.username, shop_name: merchant.shop_name, module_type: merchant.module_type }
      }
    };
  }

  /**
   * 获取当前登录商家信息
   * GET /api/merchant-auth/info
   * @param auth - 请求头中的 Authorization Bearer token
   * @returns 当前登录商家的基本信息
   */
  @Get('/info')
  async info(@Headers('authorization') auth: string) {
    try {
      const token = auth?.replace('Bearer ', '');
      const payload: any = await this.jwtService.verify(token);
      const merchant = await this.merchantService.findById(payload.id);
      if (!merchant) return { code: 401, message: '未登录', data: null };
      return {
        code: 200,
        message: 'success',
        data: { id: merchant.id, username: merchant.username, shop_name: merchant.shop_name, module_type: merchant.module_type }
      };
    } catch {
      return { code: 401, message: 'token无效', data: null };
    }
  }
}
