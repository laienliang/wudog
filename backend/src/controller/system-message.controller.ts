import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { SystemMessageService } from '../service/system-message.service';
import { SystemMessage } from '../entity/system-message.entity';

/**
 * 系统消息控制器
 * 处理系统消息相关的 API 请求，包括消息的查询、发送、标记已读及删除
 */
@Controller('/api/system-messages')
export class SystemMessageController {
  @Inject()
  systemMessageService: SystemMessageService;

  /**
   * 获取系统消息列表（分页）
   * GET /api/system-messages/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @param userId - 用户 ID 筛选（可选）
   * @param messageType - 消息类型筛选（可选）
   * @param isRead - 已读状态筛选（可选，0 未读 / 1 已读）
   * @returns 分页系统消息列表
   */
  @Get('/list')
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('userId') userId?: number,
    @Query('messageType') messageType?: string,
    @Query('isRead') isRead?: number
  ) {
    const result = await this.systemMessageService.findAll(
      Number(page), Number(pageSize), userId, messageType, isRead
    );
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取系统消息详情
   * GET /api/system-messages/detail/:id
   * @param id - 消息 ID
   * @returns 系统消息详细信息
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    const item = await this.systemMessageService.findById(Number(id));
    if (!item) return { code: 404, message: '消息不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 创建系统消息
   * POST /api/system-messages/create
   * @param body - 消息信息
   * @returns 创建后的消息信息
   */
  @Post('/create')
  async create(@Body() body: any) {
    const item = await this.systemMessageService.create(body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 批量发送系统消息
   * POST /api/system-messages/batch-send
   * @param body - 包含 userIds（目标用户 ID 数组）和消息数据
   * @returns 批量发送结果
   */
  @Post('/batch-send')
  async batchSend(@Body() body: { userIds: number[]; [key: string]: any }) {
    const { userIds, ...messageData } = body;
    const result = await this.systemMessageService.batchSend(userIds, messageData as Partial<SystemMessage>);
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 标记消息为已读
   * PUT /api/system-messages/read/:id
   * @param id - 消息 ID
   * @returns 更新后的消息信息
   */
  @Put('/read/:id')
  async markAsRead(@Param('id') id: number) {
    const item = await this.systemMessageService.update(Number(id), { is_read: 1 });
    if (!item) return { code: 404, message: '消息不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 删除系统消息
   * DELETE /api/system-messages/delete/:id
   * @param id - 消息 ID
   * @returns 操作结果
   */
  @Del('/delete/:id')
  async remove(@Param('id') id: number) {
    await this.systemMessageService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }
}
