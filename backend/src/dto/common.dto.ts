import { ApiProperty } from '@midwayjs/swagger';

/**
 * 通用分页查询参数
 */
export class PaginationQueryDto {
  @ApiProperty({ description: '页码', example: 1, required: false })
  page?: number = 1;

  @ApiProperty({ description: '每页数量', example: 20, required: false })
  pageSize?: number = 20;

  @ApiProperty({ description: '搜索关键词', example: '', required: false })
  keyword?: string;
}

/**
 * 通用分页响应数据
 */
export class PaginationDataDto {
  @ApiProperty({ description: '数据列表', isArray: true })
  list: any[];

  @ApiProperty({ description: '总数量', example: 100 })
  total: number;
}

/**
 * 通用响应格式
 */
export class CommonResponseDto {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '提示信息', example: 'success' })
  message: string;

  @ApiProperty({ description: '响应数据' })
  data: any;
}

/**
 * 通用成功响应
 */
export const SuccessResponseExample = {
  code: 200,
  message: 'success',
  data: null,
};

/**
 * 通用错误响应
 */
export const ErrorResponseExample = {
  code: 400,
  message: '参数错误',
  data: null,
};

/**
 * 未授权响应
 */
export const UnauthorizedResponseExample = {
  code: 401,
  message: '未登录',
  data: null,
};

/**
 * 无权限响应
 */
export const ForbiddenResponseExample = {
  code: 403,
  message: '权限不足，无法执行此操作',
  data: null,
};
