import { Rule, RuleType } from '@midwayjs/validate';

/**
 * 通用分页查询 DTO
 */
export class PaginationDTO {
  @Rule(RuleType.number().min(1).default(1))
  page: number;

  @Rule(RuleType.number().min(1).max(100).default(10))
  pageSize: number;

  @Rule(RuleType.string().empty(''))
  keyword?: string;

  @Rule(RuleType.string().empty(''))
  sortField?: string;

  @Rule(RuleType.string().valid('ASC', 'DESC').default('DESC'))
  sortOrder: 'ASC' | 'DESC';
}

/**
 * 通用分页响应 VO
 */
export interface PaginatedVO<T> {
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
