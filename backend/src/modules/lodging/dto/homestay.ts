// ============================================================
// 民宿 DTO
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\dto\homestay.ts
// ============================================================
import { Rule, RuleType } from '@midwayjs/validate';

/** 分页查询民宿 */
export class HomestayListDTO {
  @Rule(RuleType.number().integer().min(1).default(1))
  page: number;

  @Rule(RuleType.number().integer().min(1).max(100).default(20))
  pageSize: number;

  @Rule(RuleType.string().optional().allow(''))
  keyword?: string;

  @Rule(RuleType.number().integer().optional())
  status?: number;

  @Rule(RuleType.string().optional().allow(''))
  sort?: string; // price_asc | price_desc | rating_desc
}

/** 按日期+价格+设施搜索民宿 */
export class HomestaySearchDTO {
  @Rule(RuleType.string().required())
  checkInDate: string;

  @Rule(RuleType.string().required())
  checkOutDate: string;

  @Rule(RuleType.number().optional())
  minPrice?: number;

  @Rule(RuleType.number().optional())
  maxPrice?: number;

  @Rule(RuleType.string().optional().allow(''))
  keyword?: string;

  @Rule(RuleType.string().optional().allow(''))
  sort?: string;

  @Rule(RuleType.array().items(RuleType.string()).optional())
  facilities?: string[];

  @Rule(RuleType.number().integer().min(1).default(1))
  page: number;

  @Rule(RuleType.number().integer().min(1).max(100).default(20))
  pageSize: number;
}

/** 新增/编辑民宿 */
export class HomestaySaveDTO {
  @Rule(RuleType.number().optional())
  id?: number;

  @Rule(RuleType.string().required().max(100))
  name: string;

  @Rule(RuleType.string().required().max(255))
  address: string;

  @Rule(RuleType.number().optional())
  latitude?: number;

  @Rule(RuleType.number().optional())
  longitude?: number;

  @Rule(RuleType.string().optional().allow(''))
  cover_image?: string;

  @Rule(RuleType.array().items(RuleType.string()).optional())
  images?: string[];

  @Rule(RuleType.string().optional().allow(''))
  description?: string;

  @Rule(RuleType.array().items(RuleType.string()).optional())
  facilities?: string[];

  @Rule(RuleType.string().optional().allow(''))
  contact_phone?: string;

  @Rule(RuleType.number().optional())
  status?: number;
}
