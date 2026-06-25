import { IApiResponse, IPageResult } from '../interfaces';

/**
 * 成功响应
 */
export function success<T = any>(data: T = null as any, message = 'success'): IApiResponse<T> {
  return { code: 200, message, data };
}

/**
 * 失败响应
 */
export function fail(message = '操作失败', code = 400): IApiResponse {
  return { code, message, data: null };
}

/**
 * 参数校验失败响应
 */
export function badRequest(message = '参数错误'): IApiResponse {
  return { code: 400, message, data: null };
}

/**
 * 资源未找到响应
 */
export function notFound(message = '资源不存在'): IApiResponse {
  return { code: 404, message, data: null };
}

/**
 * 构造分页结果
 */
export function pageResult<T = any>(list: T[], total: number, page: number, pageSize: number): IPageResult<T> {
  return { total, page, pageSize, list };
}

/**
 * 解析分页参数，返回安全值
 */
export function parsePage(query: { page?: any; pageSize?: any }): { page: number; pageSize: number } {
  let page = parseInt(query.page, 10);
  let pageSize = parseInt(query.pageSize, 10);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(pageSize) || pageSize < 1) pageSize = 20;
  if (pageSize > 100) pageSize = 100; // 上限保护
  return { page, pageSize };
}
