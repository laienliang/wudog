import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ScenicSpot } from "./ScenicSpot";
import { TicketOrder } from "./TicketOrder";

@Entity("ticket_type")
export class TicketType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "scenic_id", type: "bigint", nullable: true })
  scenicId: number | null;

  @Column({ name: "name", length: 50 })
  name: string;

  @Column({ name: "price", type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ name: "sell_price", type: "decimal", precision: 10, scale: 2 })
  sellPrice: number;

  @Column({ name: "stock", type: "int", default: 0 })
  stock: number;

  /** 按日期库存覆盖映射 JSON: { "2026-07-01": 100, "2026-07-02": 50 } */
  @Column({ name: "daily_stock", type: "json", nullable: true })
  dailyStock: Record<string, number> | null;

  @Column({ name: "valid_days", type: "int", default: 1 })
  validDays: number;

  @Column({ name: "description", length: 500, nullable: true })
  description: string | null;

  @Column({ type: "tinyint", default: 1 })
  status: number;

  @CreateDateColumn({ name: "created_at", type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "datetime" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
  deletedAt: Date | null;

  // ---- Relations ----

  @ManyToOne(() => ScenicSpot, { nullable: true, onDelete: "SET NULL" }) // Issue #20: CASCADE -> SET NULL
  @JoinColumn({ name: "scenic_id" })
  scenic: ScenicSpot | null;

  // 订单通过 ticketTypeId 关联到此票种

  // ---- Helper ----

  /** 获取指定日期的可用库存 */
  getStockForDate(date: string): number {
    if (this.dailyStock && this.dailyStock[date] !== undefined) {
      return this.dailyStock[date];
    }
    return this.stock;
  }
}
