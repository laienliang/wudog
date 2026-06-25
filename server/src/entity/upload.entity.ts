import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('uploads')
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column({ length: 255 })
  filename: string;

  @Column({ length: 255 })
  original_name: string;

  @Column({ length: 500 })
  url: string;

  @Column({ default: 0 })
  size: number;

  @Column({ length: 50, nullable: true })
  mime_type: string;

  @CreateDateColumn()
  created_at: Date;
}
