import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { OperationLogService } from '../service/operation-log.service';

/**
 * 操作日志控制器
 * 处理操作日志相关的 API 请求，包括操作日志的增删改查操作
 */
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
  async remove(@Param('id') id: number) {
    await this.operationLogService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }
}
