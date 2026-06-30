import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, MoreThan } from 'typeorm';
import { randomInt } from 'crypto';
import { SmsCode } from '../entity/sms-code.entity';

@Provide()
export class SmsService {
  @InjectEntityModel(SmsCode)
  smsCodeModel: Repository<SmsCode>;

  /**
   * 生成6位随机验证码
   */
  private generateCode(): string {
    return randomInt(100000, 1000000).toString();
  }

  /**
   * 发送验证码（开发环境直接返回，实际对接短信网关）
   */
  async sendCode(phone: string): Promise<void> {
    const code = this.generateCode();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);

    // 保存到数据库
    await this.smsCodeModel.insert({
      phone,
      code,
      expireAt,
      used: 0,
    });

    // TODO: 对接短信网关发送验证码
    // 开发环境直接打印到控制台
    console.log(`[SMS] 验证码已发送到 ${phone}: ${code}`);
  }

  /**
   * 校验验证码
   */
  async verifyCode(phone: string, code: string): Promise<boolean> {
    const result = await this.smsCodeModel.update(
      { phone, code, used: 0, expireAt: MoreThan(new Date()) },
      { used: 1 }
    );
    return (result.affected ?? 0) > 0;
  }
}
