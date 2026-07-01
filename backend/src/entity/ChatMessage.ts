import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('chat_message')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'user/admin' })
  sender_type: string;

  @Column()
  sender_id: number;

  @Column({ comment: 'user/admin' })
  receiver_type: string;

  @Column()
  receiver_id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0, comment: '0未读 1已读' })
  is_read: number;

  @CreateDateColumn()
  created_at: Date;
}
