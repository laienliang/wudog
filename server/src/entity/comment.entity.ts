import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'note_id' })
  noteId: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ name: 'report_count', default: 0 })
  reportCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
