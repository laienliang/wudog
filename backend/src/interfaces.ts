/**
 * 统一接口响应格式
 */
export interface IApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

/**
 * 分页列表查询参数
 */
export interface IPageQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  [key: string]: any;
}

/**
 * 分页列表响应结构
 */
export interface IPageResult<T = any> {
  total: number;
  page: number;
  pageSize: number;
  list: T[];
}
