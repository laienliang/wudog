import { Controller, Get, Post, Put, Body, Query, Param, Inject } from '@midwayjs/core';
import { CurrentUser } from '../decorator/CurrentUser';
import { ChatService } from '../service/ChatService';

@Controller('/api/chat')
export class ChatController {
  @Inject()
  chatService: ChatService;

  @Post('/send')
  async send(@CurrentUser user: any, @Body() body: {
    receiver_type: string;
    receiver_id: number;
    content: string;
  }) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    if (!body.content?.trim()) return { code: 400, message: '内容不能为空', data: null };

    const senderType = user.type === 'admin' ? 'admin' : 'user';
    const msg = await this.chatService.send({
      sender_type: senderType,
      sender_id: user.id,
      receiver_type: body.receiver_type,
      receiver_id: body.receiver_id,
      content: body.content.trim(),
    });
    return { code: 200, message: 'success', data: msg };
  }

  @Get('/conversation/:targetId')
  async conversation(@CurrentUser user: any, @Param('targetId') targetId: number, @Query('page') page: number) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };

    const senderType = user.type === 'admin' ? 'admin' : 'user';
    let result;
    if (senderType === 'admin') {
      result = await this.chatService.getAdminConversation(targetId, user.id, page || 1);
    } else {
      result = await this.chatService.getConversation(user.id, targetId, page || 1);
      // 标记管理员发的消息为已读
      await this.chatService.markRead(user.id, targetId);
    }
    return { code: 200, message: 'success', data: result };
  }

  @Get('/unread/:targetId')
  async unread(@CurrentUser user: any, @Param('targetId') targetId: number) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    const count = await this.chatService.getUnreadCount(user.id, targetId);
    return { code: 200, message: 'success', data: { count } };
  }

  @Get('/admin/conversations')
  async adminConversations() {
    const list = await this.chatService.getAdminConversations();
    return { code: 200, message: 'success', data: list };
  }
}
