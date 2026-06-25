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
import { TicketType } from "./TicketType";

@Entity("ticket_order")
// Issue #21: 移除全局唯一约束，订单去重已在 createOrder 中按业务逻辑处理
export class TicketOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "order_no", length: 32, unique: true })
  orderNo: string;

  @Column({ name: "uuid", length: 36, unique: true })
  uuid: string;

  @Column({ name: "user_id", type: "bigint" })
  userId: number;

  @Column({ name: "order_type", type: "tinyint" })
  orderType: number; // 1=门票 2=路线套餐

  @Column({ name: "item_id", type: "bigint" })
  itemId: number;

  @Column({ name: "item_name", length: 200 })
  itemName: string;

  /** 票种 ID（仅 orderType=1 时有值） */
  @Column({ name: "ticket_type_id", type: "bigint", nullable: true })
  ticketTypeId: number | null;

  @Column({ type: "int" })
  quantity: number;

  @Column({ name: "total_price", type: "decimal", precision: 10, scale: 2 })
  totalPrice: number;

  /** 预约游玩日期（仅门票类型有值） */
  @Column({ name: "visit_date", type: "date", nullable: true })
  visitDate: string | null;

  /** 有效期至 */
  @Column({ name: "valid_until", type: "datetime" })
  validUntil: Date;

  /** 状态：0-待使用 1-已核销 2-已过期 3-已取消 4-已退款 */
  @Column({ type: "tinyint", default: 0 })
  status: number;

  @Column({ length: 500, nullable: true })
  remark: string | null;

  @CreateDateColumn({ name: "created_at", type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "datetime" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
  deletedAt: Date | null;

  // ---- Relations ----

  @ManyToOne(() => TicketType, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "ticket_type_id" })
  ticketType: TicketType | null;

  // 注意：不再定义 route 的 @ManyToOne 关系
  // 因为 item_id 在门票场景下存的是 ticket_type.id，
  // 而 route_package FK 指向同一列会导致外键冲突
  // 如需查询路线信息，通过 orderType=2 + itemId 在应用层处理
}
