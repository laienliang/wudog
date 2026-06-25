import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  user_id: number;

  @Column({ length: 50, nullable: true })
  nickname: string;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender: string;

  @Column({ length: 100, nullable: true })
  region: string;

  @Column({ length: 500, nullable: true })
  bio: string;

  @Column({ default: 0 })
  follow_count: number;

  @Column({ default: 0 })
  follower_count: number;

  @Column({ default: 0 })
  note_count: number;
}
