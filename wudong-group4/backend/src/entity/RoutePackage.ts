import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { ScenicSpot } from "./ScenicSpot";
import { RouteItinerary } from "./RouteItinerary";
import { TicketOrder } from "./TicketOrder";

@Entity("route_package")
export class RoutePackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "scenic_id", type: "bigint", nullable: true })
  scenicId: number | null;

  @Column({ length: 100 })
  name: string;

  @Column({ name: "cover_image", length: 500 })
  coverImage: string;

  @Column({ type: "json", nullable: true })
  images: string[] | null;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ name: "original_price", type: "decimal", precision: 10, scale: 2, nullable: true })
  originalPrice: number | null;

  @Column({ name: "duration_days", type: "int" })
  durationDays: number;

  @Column({ name: "min_people", type: "int", default: 1 })
  minPeople: number;

  @Column({ name: "max_people", type: "int", default: 20 })
  maxPeople: number;

  @Column({ type: "int", default: 0 })
  stock: number;

  /** 按日期库存覆盖映射 JSON */
  @Column({ name: "daily_stock", type: "json", nullable: true })
  dailyStock: Record<string, number> | null;

  @Column({ type: "tinyint", default: 1 })
  status: number;

  @Column({ type: "int", default: 0 })
  sort: number;

  @CreateDateColumn({ name: "created_at", type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "datetime" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
  deletedAt: Date | null;

  // ---- Relations ----

  @ManyToOne(() => ScenicSpot, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "scenic_id" })
  scenic: ScenicSpot | null;

  @OneToMany(() => RouteItinerary, (it) => it.route)
  itineraries: RouteItinerary[];

  // 订单通过 orderType=2 + itemId 关联到此路线

  // ---- Helper ----

  /** 获取指定日期的可用库存 */
  getStockForDate(date: string): number {
    if (this.dailyStock && this.dailyStock[date] !== undefined) {
      return this.dailyStock[date];
    }
    return this.stock;
  }
}
