import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '../entity/ChatMessage';
import { User } from '../entity/User';

@Provide()
export class ChatService {
  @InjectEntityModel(ChatMessage)
  chatRepo: Repository<ChatMessage>;

  @InjectEntityModel(User)
  userRepo: Repository<User>;

  async send(data: {
    sender_type: string;
    sender_id: number;
    receiver_type: string;
    receiver_id: number;
    content: string;
  }) {
    const msg = this.chatRepo.create(data);
    return await this.chatRepo.save(msg);
  }

  async getConversation(userId: number, adminId: number, page = 1, pageSize = 50) {
    const [list, total] = await this.chatRepo.findAndCount({
      where: [
        { sender_type: 'user', sender_id: userId, receiver_type: 'admin' },
        { sender_type: 'admin', receiver_type: 'user', receiver_id: userId },
      ],
      order: { created_at: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { total, page, pageSize, list };
  }

  async getUnreadCount(userId: number, adminId: number) {
    const count = await this.chatRepo.count({
      where: { sender_type: 'admin', sender_id: adminId, receiver_type: 'user', receiver_id: userId, is_read: 0 },
    });
    return count;
  }

  async markRead(userId: number, adminId: number) {
    await this.chatRepo.update(
      { sender_type: 'admin', sender_id: adminId, receiver_type: 'user', receiver_id: userId, is_read: 0 },
      { is_read: 1 },
    );
  }

  async markAdminRead(userId: number, adminId: number) {
    await this.chatRepo.update(
      { sender_type: 'user', sender_id: userId, receiver_type: 'admin', receiver_id: adminId, is_read: 0 },
      { is_read: 1 },
    );
  }

  // 管理员获取所有会话列表
  async getAdminConversations() {
    // 获取所有与管理员相关的消息，按用户分组
    const allMsgs = await this.chatRepo.find({
      where: [
        { sender_type: 'user', receiver_type: 'admin' },
        { sender_type: 'admin', receiver_type: 'user' },
      ],
      order: { created_at: 'DESC' },
    });

    const userMap = new Map<number, ChatMessage>();
    const unreadMap = new Map<number, number>();

    allMsgs.forEach(m => {
      const userId = m.sender_type === 'user' ? m.sender_id : m.receiver_id;
      if (!userMap.has(userId)) {
        userMap.set(userId, m);
      }
    });

    // 获取用户昵称
    const userIds = Array.from(userMap.keys());
    const users = await this.userRepo.findByIds(userIds);
    const userNicknameMap = new Map<number, string>();
    users.forEach(u => {
      userNicknameMap.set(u.id, u.nickname || u.username);
    });

    // 统计每个用户发给管理员的未读消息
    for (const [userId] of userMap) {
      const count = await this.chatRepo.count({
        where: { sender_type: 'user', sender_id: userId, is_read: 0 },
      });
      unreadMap.set(userId, count);
    }

    return Array.from(userMap.entries()).map(([userId, lastMsg]) => ({
      user_id: userId,
      nickname: userNicknameMap.get(userId) || `用户 #${userId}`,
      last_message: lastMsg,
      unread: unreadMap.get(userId) || 0,
    }));
  }

  // 管理员获取与某用户的会话
  async getAdminConversation(userId: number, adminId: number, page = 1, pageSize = 50) {
    const [list, total] = await this.chatRepo.findAndCount({
      where: [
        { sender_type: 'user', sender_id: userId, receiver_type: 'admin' },
        { sender_type: 'admin', receiver_type: 'user', receiver_id: userId },
      ],
      order: { created_at: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 标记用户发的消息为已读
    await this.chatRepo.update(
      { sender_type: 'user', sender_id: userId, is_read: 0 },
      { is_read: 1 },
    );

    return { total, page, pageSize, list };
  }
}
