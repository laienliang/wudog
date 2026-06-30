import { Rule, RuleType } from '@midwayjs/validate';

export class UpdateProfileDTO {
  @Rule(RuleType.string().max(50).empty(''))
  nickname?: string;

  @Rule(RuleType.string().max(500).empty(''))
  avatar?: string;

  @Rule(RuleType.number().valid(0, 1, 2).optional())
  gender?: number;

  @Rule(RuleType.string().max(100).empty(''))
  region?: string;

  @Rule(RuleType.string().max(200).empty(''))
  bio?: string;
}
