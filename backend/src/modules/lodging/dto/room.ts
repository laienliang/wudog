// ============================================================
// 房型 DTO
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\dto\room.ts
// ============================================================
import { Rule, RuleType } from '@midwayjs/validate';

export class RoomListDTO {
  @Rule(RuleType.number().integer().min(1).default(1))
  page: number;

  @Rule(RuleType.number().integer().min(1).max(100).default(20))
  pageSize: number;

  @Rule(RuleType.number().integer().optional())
  homestay_id?: number;
}

export class RoomSaveDTO {
  @Rule(RuleType.number().optional())
  id?: number;

  @Rule(RuleType.number().integer().required())
  homestay_id: number;

  @Rule(RuleType.string().required().max(100))
  name: string;

  @Rule(RuleType.string().optional().allow(''))
  bed_type?: string;

  @Rule(RuleType.number().integer().optional())
  area?: number;

  @Rule(RuleType.number().integer().min(1).default(2))
  max_guests: number;

  @Rule(RuleType.number().min(0).required())
  base_price: number;

  @Rule(RuleType.array().items(RuleType.string()).optional())
  images?: string[];

  @Rule(RuleType.array().items(RuleType.string()).optional())
  facilities?: string[];

  @Rule(RuleType.string().optional().allow(''))
  description?: string;

  @Rule(RuleType.number().integer().min(1).default(5))
  default_stock: number;

  @Rule(RuleType.number().optional())
  status?: number;
}
