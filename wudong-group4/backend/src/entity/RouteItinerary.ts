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
import { RoutePackage } from "./RoutePackage";

@Entity("route_itinerary")
export class RouteItinerary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "route_id", type: "bigint" })
  routeId: number;

  @Column({ name: "day_order", type: "int" })
  dayOrder: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ name: "includes", type: "json", nullable: true })
  includes: string[] | null;

  @Column({ name: "not_includes", type: "json", nullable: true })
  notIncludes: string[] | null;

  @CreateDateColumn({ name: "created_at", type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "datetime" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
  deletedAt: Date | null;

  // ---- Relations ----

  @ManyToOne(() => RoutePackage, { onDelete: "CASCADE" })
  @JoinColumn({ name: "route_id" })
  route: RoutePackage;
}
