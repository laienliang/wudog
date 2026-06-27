import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('travel_notes')
export class TravelNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ name: 'video_url', length: 500, nullable: true })
  videoUrl: string;

  @Column({ length: 200, nullable: true })
  location: string;

  @Column({ name: 'topic_id', nullable: true })
  topicId: number;

  @Column({ type: 'enum', enum: ['draft', 'reviewing', 'published', 'rejected', 'removed'], default: 'draft' })
  status: string;

  @Column({ name: 'reject_reason', length: 500, nullable: true })
  rejectReason: string;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ name: 'favorite_count', default: 0 })
  favoriteCount: number;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'report_count', default: 0 })
  reportCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
