import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ name: 'cover_image', length: 500, nullable: true })
  coverImage: string;

  @Column({ name: 'note_count', default: 0 })
  noteCount: number;

  @Column({ name: 'follow_count', default: 0 })
  followCount: number;

  @Column({ name: 'is_pinned', type: 'tinyint', default: 0 })
  isPinned: number;

  @Column({ name: 'is_recommended', type: 'tinyint', default: 0 })
  isRecommended: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
