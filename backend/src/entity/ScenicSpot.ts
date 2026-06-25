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
import { RoutePackage } from "./RoutePackage";
import { TicketType } from "./TicketType";

@Entity("scenic_spot")
export class ScenicSpot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: "cover_image", length: 500, default: "" })
  coverImage: string;

  @Column({ type: "json", nullable: true })
  images: string[] | null;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ length: 200 })
  address: string;

  @Column({ name: "lat", type: "decimal", precision: 10, scale: 6, nullable: true })
  lat: number | null;

  @Column({ name: "lng", type: "decimal", precision: 10, scale: 6, nullable: true })
  lng: number | null;

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

  @OneToMany(() => TicketType, (tt) => tt.scenic)
  ticketTypes: TicketType[];

  @OneToMany(() => RoutePackage, (rp) => rp.scenic)
  routes: RoutePackage[];
}
