// ============================================================
// 收藏 DTO
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\dto\favorite.ts
// ============================================================
import { Rule, RuleType } from '@midwayjs/validate';

export class FavoriteListDTO {
  @Rule(RuleType.number().integer().min(1).default(1))
  page: number;

  @Rule(RuleType.number().integer().min(1).max(100).default(20))
  pageSize: number;
}

export class FavoriteToggleDTO {
  @Rule(RuleType.number().integer().required())
  homestay_id: number;
}
