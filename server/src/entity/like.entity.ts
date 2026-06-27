import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('likes')
@Unique(['userId', 'targetType', 'targetId'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'target_type', length: 20 })
  targetType: string;

  @Column({ name: 'target_id' })
  targetId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
