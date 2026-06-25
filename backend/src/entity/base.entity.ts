import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

/**
 * 实体基类 —— 所有实体共用字段
 * id / created_at / updated_at / is_deleted
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: '主键ID' })
  id: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @Column({ type: 'tinyint', name: 'is_deleted', default: 0, comment: '软删除:0未删 1已删' })
  isDeleted: number;
}
