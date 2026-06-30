import { Rule, RuleType } from '@midwayjs/validate';

export class LoginDTO {
  @Rule(RuleType.string().required())
  phone: string;

  @Rule(RuleType.string().required())
  password: string;
}

export class SmsLoginDTO {
  @Rule(RuleType.string().required())
  phone: string;

  @Rule(RuleType.string().required().length(6))
  code: string;
}

export class WxLoginDTO {
  @Rule(RuleType.string().required())
  code: string;

  @Rule(RuleType.string().optional())
  phone?: string;
}

export class RefreshTokenDTO {
  @Rule(RuleType.string().required())
  refreshToken: string;
}
