import { Rule, RuleType } from '@midwayjs/validate';

export class RegisterDTO {
  @Rule(RuleType.string().required().pattern(/^1[3-9]\d{9}$/).message('手机号格式不正确'))
  phone: string;

  @Rule(RuleType.string().required().length(6).message('验证码为6位数字'))
  code: string;

  @Rule(RuleType.string().required().min(8).max(20).pattern(/^(?=.*[a-zA-Z])(?=.*\d)/).message('密码8-20位，需包含字母和数字'))
  password: string;
}
