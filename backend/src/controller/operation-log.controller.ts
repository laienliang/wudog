import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { OperationLogService } from '../service/operation-log.service';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@midwayjs/swagger';

/**
 * 操作日志控制器
 * 处理操作日志相关的 API 请求，包括操作日志的增删改查操作
 */
@ApiTags('OperationLog')
@ApiBearerAuth()
@Controller('/api/operation-logs')
export class OperationLogController {
  @Inject()
  operationLogService: OperationLogService;

  /**
   * 获取操作日志列表（分页）
   * GET /api/operation-logs/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @param operator_id - 操作人 ID 筛选（可选）
   * @param action - 操作类型筛选（可选）
   * @param keyword - 搜索关键词（可选）
   * @returns 分页操作日志列表
   */
  @Get('/list')
  @ApiOperation({ summary: '获取操作日志列表' })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', description: '每页数量', required: false, example: 20 })
  @ApiQuery({ name: 'operator_id', description: '操作人ID筛选', required: false, example: '1' })
  @ApiQuery({ name: 'action', description: '操作类型筛选', required: false, example: 'create' })
  @ApiQuery({ name: 'keyword', description: '搜索关键词', required: false, example: '用户' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          list: [
            {
              id: 1,
              operator_id: 1,
              operator_name: '张三',
              action: 'create',
              target_type: 'user',
              target_id: 1,
              detail: '创建用户账号',
              ip: '192.168.1.100',
              created_at: '2026-06-21 10:30:00',
            },
          ],
          total: 50,
          page: 1,
          pageSize: 20,
        },
      },
    },
  })
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('operator_id') operatorId?: string,
    @Query('action') action?: string,
    @Query('keyword') keyword?: string
  ) {
    const result = await this.operationLogService.findAll(
      Number(page),
      Number(pageSize),
      operatorId ? Number(operatorId) : undefined,
      action,
      keyword
    );
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取操作日志详情
   * GET /api/operation-logs/detail/:id
   * @param id - 日志 ID
   * @returns 操作日志详细信息
   */
  @Get('/detail/:id')
  @ApiOperation({ summary: '获取操作日志详情' })
  @ApiParam({ name: 'id', description: '日志ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          operator_id: 1,
          operator_name: '张三',
          action: 'create',
          target_type: 'user',
          target_id: 1,
          detail: '创建用户账号',
          ip: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          created_at: '2026-06-21 10:30:00',
        },
      },
    },
  })
  async detail(@Param('id') id: number) {
    const item = await this.operationLogService.findById(Number(id));
    if (!item) return { code: 404, message: '不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 创建操作日志
   * POST /api/operation-logs/create
   * @param body - 操作日志信息
   * @returns 创建后的操作日志信息
   */
  @Post('/create')
  @ApiOperation({ summary: '创建操作日志' })
  @ApiBody({
    schema: {
      properties: {
        operator_id: { type: 'number', description: '操作人ID', example: 1 },
        operator_name: { type: 'string', description: '操作人姓名', example: '张三' },
        action: { type: 'string', description: '操作类型', example: 'create' },
        target_type: { type: 'string', description: '目标类型', example: 'user' },
        target_id: { type: 'number', description: '目标ID', example: 1 },
        detail: { type: 'string', description: '操作详情', example: '创建用户账号' },
        ip: { type: 'string', description: '操作IP', example: '192.168.1.100' },
      },
      example: {
        operator_id: 1,
        operator_name: '张三',
        action: 'create',
        target_type: 'user',
        target_id: 1,
        detail: '创建用户账号',
        ip: '192.168.1.100',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '创建成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          operator_id: 1,
          operator_name: '张三',
          action: 'create',
          target_type: 'user',
          target_id: 1,
          detail: '创建用户账号',
          ip: '192.168.1.100',
          created_at: '2026-06-21 10:30:00',
        },
      },
    },
  })
  async create(@Body() body: any) {
    const item = await this.operationLogService.create(body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 更新操作日志信息
   * PUT /api/operation-logs/update/:id
   * @param id - 日志 ID
   * @param body - 更新的操作日志信息
   * @returns 更新后的操作日志信息
   */
  @Put('/update/:id')
  @ApiOperation({ summary: '更新操作日志' })
  @ApiParam({ name: 'id', description: '日志ID', example: 1 })
  @ApiBody({
    schema: {
      properties: {
        operator_id: { type: 'number', description: '操作人ID', example: 1 },
        operator_name: { type: 'string', description: '操作人姓名', example: '张三' },
        action: { type: 'string', description: '操作类型', example: 'update' },
        target_type: { type: 'string', description: '目标类型', example: 'user' },
        target_id: { type: 'number', description: '目标ID', example: 1 },
        detail: { type: 'string', description: '操作详情', example: '更新用户信息' },
        ip: { type: 'string', description: '操作IP', example: '192.168.1.100' },
      },
      example: {
        operator_id: 1,
        operator_name: '张三',
        action: 'update',
        target_type: 'user',
        target_id: 1,
        detail: '更新用户信息',
        ip: '192.168.1.100',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          operator_id: 1,
          operator_name: '张三',
          action: 'update',
          target_type: 'user',
          target_id: 1,
          detail: '更新用户信息',
          ip: '192.168.1.100',
          created_at: '2026-06-21 10:30:00',
        },
      },
    },
  })
  async update(@Param('id') id: number, @Body() body: any) {
    delete body.id;
    const item = await this.operationLogService.update(Number(id), body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 删除操作日志
   * DELETE /api/operation-logs/delete/:id
   * @param id - 日志 ID
   * @returns 操作结果
   */
  @Del('/delete/:id')
  @ApiOperation({ summary: '删除操作日志' })
  @ApiParam({ name: 'id', description: '日志ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '删除成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: null,
      },
    },
  })
  async remove(@Param('id') id: number) {
    await this.operationLogService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }
}
