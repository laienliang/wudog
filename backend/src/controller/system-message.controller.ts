import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@midwayjs/swagger';
import { SystemMessageService } from '../service/system-message.service';
import { SystemMessage } from '../entity/system-message.entity';

/**
 * 系统消息控制器
 * 处理系统消息相关的 API 请求，包括消息的查询、发送、标记已读及删除
 */
@ApiTags('SystemMessage')
@ApiBearerAuth()
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
  @ApiOperation({ summary: '获取系统消息列表（分页）' })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', description: '每页数量', required: false, example: 20 })
  @ApiQuery({ name: 'userId', description: '用户ID筛选', required: false, example: 1 })
  @ApiQuery({ name: 'messageType', description: '消息类型筛选', required: false, example: '系统通知' })
  @ApiQuery({ name: 'isRead', description: '已读状态筛选（0未读/1已读）', required: false, example: 0 })
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
              user_id: 1,
              title: '系统维护通知',
              content: '系统将于今晚22:00-23:00进行例行维护，届时服务将暂停。',
              message_type: '系统通知',
              is_read: 0,
              created_at: '2026-06-21 10:00:00',
            },
          ],
          total: 1,
        },
      },
    },
  })
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
  @ApiOperation({ summary: '获取系统消息详情' })
  @ApiParam({ name: 'id', description: '消息ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          user_id: 1,
          title: '系统维护通知',
          content: '系统将于今晚22:00-23:00进行例行维护，届时服务将暂停。',
          message_type: '系统通知',
          is_read: 0,
          created_at: '2026-06-21 10:00:00',
        },
      },
    },
  })
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
  @ApiOperation({ summary: '创建系统消息' })
  @ApiBody({
    schema: {
      properties: {
        user_id: { type: 'number', description: '目标用户ID', example: 1 },
        title: { type: 'string', description: '消息标题', example: '系统维护通知' },
        content: { type: 'string', description: '消息内容', example: '系统将于今晚22:00-23:00进行例行维护，届时服务将暂停。' },
        message_type: { type: 'string', description: '消息类型', example: '系统通知' },
      },
      example: {
        user_id: 1,
        title: '系统维护通知',
        content: '系统将于今晚22:00-23:00进行例行维护，届时服务将暂停。',
        message_type: '系统通知',
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
          id: 2,
          user_id: 1,
          title: '系统维护通知',
          content: '系统将于今晚22:00-23:00进行例行维护，届时服务将暂停。',
          message_type: '系统通知',
          is_read: 0,
          created_at: '2026-06-21 10:30:00',
        },
      },
    },
  })
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
  @ApiOperation({ summary: '批量发送系统消息' })
  @ApiBody({
    schema: {
      properties: {
        userIds: { type: 'array', items: { type: 'number' }, description: '目标用户ID数组', example: [1, 2, 3] },
        title: { type: 'string', description: '消息标题', example: '优惠活动通知' },
        content: { type: 'string', description: '消息内容', example: '尊敬的用户，平台新推出限时优惠活动，欢迎参与！' },
        message_type: { type: 'string', description: '消息类型', example: '活动通知' },
      },
      example: {
        userIds: [1, 2, 3],
        title: '优惠活动通知',
        content: '尊敬的用户，平台新推出限时优惠活动，欢迎参与！',
        message_type: '活动通知',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '批量发送成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: { successCount: 3, failCount: 0 },
      },
    },
  })
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
  @ApiOperation({ summary: '标记消息为已读' })
  @ApiParam({ name: 'id', description: '消息ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '标记成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          user_id: 1,
          title: '系统维护通知',
          content: '系统将于今晚22:00-23:00进行例行维护，届时服务将暂停。',
          message_type: '系统通知',
          is_read: 1,
          created_at: '2026-06-21 10:00:00',
        },
      },
    },
  })
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
  @ApiOperation({ summary: '删除系统消息' })
  @ApiParam({ name: 'id', description: '消息ID', example: 1 })
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
    await this.systemMessageService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }
}
