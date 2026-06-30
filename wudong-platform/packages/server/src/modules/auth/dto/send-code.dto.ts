import { Rule, RuleType } from '@midwayjs/validate';

export class SendCodeDTO {
  @Rule(RuleType.string().required().pattern(/^1[3-9]\d{9}$/).message('手机号格式不正确'))
  phone: string;
}
