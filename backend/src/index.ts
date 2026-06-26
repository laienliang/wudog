import "reflect-metadata";
import { DataSource } from "typeorm";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { setupRoutes } from "./controllers";
import {
  ScenicSpot,
  TicketType,
  RoutePackage,
  RouteItinerary,
  TicketOrder,
  AdminUser,
} from "./entity";
import { seedTestData } from "./seed-data";

// ---- 校验必需环境变量 ----
if (!process.env.JWT_SECRET) {
  console.error("[FATAL] JWT_SECRET 环境变量未设置，请检查 .env 文件");
  process.exit(1);
}

// ---- TypeORM Data Source ----
const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "wudong_travel",
  synchronize: true, // 生产环境改为 false + migrate
  logging: false,
  entities: [ScenicSpot, TicketType, RoutePackage, RouteItinerary, TicketOrder, AdminUser],
});

// ---- Express App ----
async function bootstrap() {
  // 初始化数据库连接
  const dataSource = await AppDataSource.initialize();
  console.log("[DB] MySQL 连接成功");

  const adminRepo = dataSource.getRepository(AdminUser);
  const adminSvc = await import("./services/AdminService").then((m) => new m.AdminService(adminRepo));
  await adminSvc.seedDefaultAdmin();
  console.log("[DB] 默认管理员已就绪 (admin / Admin@123456)");

  // 插入种子数据
  await seedTestData(dataSource);

  const scenicRepo = dataSource.getRepository(ScenicSpot);
  const ticketRepo = dataSource.getRepository(TicketType);
  const routeRepo = dataSource.getRepository(RoutePackage);
  const itineraryRepo = dataSource.getRepository(RouteItinerary);
  const orderRepo = dataSource.getRepository(TicketOrder);

  const scenicSvc = new (await import("./services/ScenicSpotService")).ScenicSpotService(scenicRepo);
  const ticketSvc = new (await import("./services/TicketTypeService")).TicketTypeService(ticketRepo);
  const routeSvc = new (await import("./services/RouteService")).RouteService(routeRepo, itineraryRepo);
  const orderSvc = new (await import("./services/OrderService")).OrderService(orderRepo, ticketRepo, routeRepo, dataSource);
  const adminService = adminSvc;

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // 健康检查
  app.get("/health", (_req, res) => {
    res.json({ code: 200, message: "ok", data: null });
  });

  // 挂载路由
  app.use("/api", setupRoutes(scenicSvc, ticketSvc, routeSvc, orderSvc, adminService));

  app.listen(PORT, () => {
    console.log(`[Server] 运行在 http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("[启动失败]", err);
  process.exit(1);
});
