import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('follows')
@Unique(['followerId', 'followedId'])
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'follower_id' })
  followerId: number;

  @Column({ name: 'followed_id' })
  followedId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
