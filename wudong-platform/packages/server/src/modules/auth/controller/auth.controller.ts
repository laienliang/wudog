import { Inject, Controller, Post, Get, Put, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { Validate } from '@midwayjs/validate';
import { AuthService } from '../service/auth.service';
import { SmsService } from '../service/sms.service';
import { UnauthorizedError } from '../../../common/filter/unauthorized.filter';
import { RegisterDTO } from '../dto/register.dto';
import { LoginDTO, SmsLoginDTO, WxLoginDTO, RefreshTokenDTO } from '../dto/login.dto';
import { SendCodeDTO } from '../dto/send-code.dto';
import { UpdateProfileDTO } from '../dto/update-profile.dto';

@Controller('/api/v1/auth')
export class AuthController {
  @Inject()
  authService: AuthService;

  @Inject()
  smsService: SmsService;

  @Inject()
  ctx: Context;

  /**
   * 发送短信验证码
   */
  @Post('/send-code')
  @Validate()
  async sendCode(@Body() body: SendCodeDTO) {
    await this.smsService.sendCode(body.phone);
    return { expireIn: 300 };
  }

  /**
   * 手机号注册
   */
  @Post('/register')
  @Validate()
  async register(@Body() body: RegisterDTO) {
    const tokens = await this.authService.register(body.phone, body.code, body.password);
    return tokens;
  }

  /**
   * 密码登录
   */
  @Post('/login')
  @Validate()
  async login(@Body() body: LoginDTO) {
    const tokens = await this.authService.login(body.phone, body.password);
    return tokens;
  }

  /**
   * 验证码登录
   */
  @Post('/sms-login')
  @Validate()
  async smsLogin(@Body() body: SmsLoginDTO) {
    const tokens = await this.authService.smsLogin(body.phone, body.code);
    return tokens;
  }

  /**
   * 微信登录
   */
  @Post('/wx-login')
  @Validate()
  async wxLogin(@Body() body: WxLoginDTO) {
    const tokens = await this.authService.wxLogin(body.code, body.phone);
    return tokens;
  }

  /**
   * 刷新 Token
   */
  @Post('/refresh')
  @Validate()
  async refresh(@Body() body: RefreshTokenDTO) {
    const tokens = await this.authService.refreshToken(body.refreshToken);
    return tokens;
  }

  /**
   * 退出登录
   */
  @Post('/logout')
  async logout() {
    const userId = this.ctx.user?.userId;
    const token = this.ctx.headers.authorization?.replace('Bearer ', '');
    if (!userId || !token) {
      return { success: true };
    }
    await this.authService.logout(userId, token);
    return { success: true };
  }

  /**
   * 获取当前用户信息
   */
  @Get('/profile')
  async profile() {
    const userId = this.ctx.user?.userId;
    if (!userId) {
      throw new UnauthorizedError('请先登录');
    }
    return this.authService.getProfile(userId);
  }

  /**
   * 更新用户资料
   */
  @Put('/profile')
  @Validate()
  async updateProfile(@Body() body: UpdateProfileDTO) {
    const userId = this.ctx.user?.userId;
    if (!userId) {
      throw new UnauthorizedError('请先登录');
    }
    return this.authService.updateProfile(userId, body);
  }
}
