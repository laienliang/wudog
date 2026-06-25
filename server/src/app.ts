import "reflect-metadata";
import Koa from "koa";
import cors from "@koa/cors";
import { DataSource } from "typeorm";
import koaBody from "koa-body";
import path from "path";
import fs from "fs";
import config from "./config/config";

import { User } from "./entity/user.entity";
import { UserProfile } from "./entity/user-profile.entity";
import { Address } from "./entity/address.entity";
import { ShoppingCart } from "./entity/shopping-cart.entity";
import { Order } from "./entity/order.entity";
import { OrderItem } from "./entity/order-item.entity";
import { Payment } from "./entity/payment.entity";
import { Notification } from "./entity/notification.entity";
import { Upload } from "./entity/upload.entity";
import { MerchantApplication } from "./entity/merchant-application.entity";
import { Banner } from "./entity/banner.entity";
import { OperationLog } from "./entity/operation-log.entity";

import { AuthService } from "./service/auth.service";
import { CartService } from "./service/cart.service";
import { OrderService } from "./service/order.service";

import { createAuthRouter } from "./controller/auth.controller";
import { createUploadRouter } from "./controller/upload.controller";
import { createCartRouter } from "./controller/cart.controller";
import { createOrderRouter } from "./controller/order.controller";
import { createAdminRouter } from "./controller/admin.controller";

import { authMiddleware } from "./middleware/auth.middleware";

async function bootstrap() {
  const ds = new DataSource({
    type: config.database.type,
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    synchronize: config.database.synchronize,
    logging: config.database.logging,
    entities: [
      User, UserProfile, Address, ShoppingCart, Order, OrderItem,
      Payment, Notification, Upload, MerchantApplication, Banner, OperationLog,
    ],
    timezone: config.database.timezone,
  });
  await ds.initialize();
  console.log("数据库连接成功");

  const userRepo = ds.getRepository(User);
  const profileRepo = ds.getRepository(UserProfile);
  const cartRepo = ds.getRepository(ShoppingCart);
  const orderRepo = ds.getRepository(Order);
  const orderItemRepo = ds.getRepository(OrderItem);
  const paymentRepo = ds.getRepository(Payment);
  const notifRepo = ds.getRepository(Notification);
  const uploadRepo = ds.getRepository(Upload);
  const merchantAppRepo = ds.getRepository(MerchantApplication);
  const bannerRepo = ds.getRepository(Banner);
  const logRepo = ds.getRepository(OperationLog);

  const authService = new AuthService(userRepo, profileRepo);
  const cartService = new CartService(cartRepo);
  const orderService = new OrderService(orderRepo, orderItemRepo, paymentRepo, notifRepo);

  const uploadDir = path.resolve(config.upload.dir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const app = new Koa();

  app.use(cors());

  app.use(async (ctx: any, next: any) => {
    if (ctx.path.startsWith("/uploads/")) {
      const filePath = path.join(uploadDir, path.basename(ctx.path));
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes: any = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".webp": "image/webp", ".mp4": "video/mp4" };
        ctx.type = mimeTypes[ext] || "application/octet-stream";
        ctx.body = fs.createReadStream(filePath);
        return;
      }
      ctx.status = 404;
      return;
    }
    await next();
  });

  app.use(async (ctx: any, next: any) => {
    if (ctx.path.startsWith("/uploads/")) {
      await next();
      return;
    }
    await koaBody({
      multipart: true,
      formidable: {
        uploadDir: uploadDir,
        keepExtensions: true,
        maxFileSize: config.upload.maxSize,
      },
    })(ctx, next);
  });

  app.use(authMiddleware());

  const authRouter = createAuthRouter(authService);
  const uploadRouter = createUploadRouter(uploadRepo);
  const cartRouter = createCartRouter(cartService);
  const orderRouter = createOrderRouter(orderService);
  const adminRouter = createAdminRouter(authService, userRepo, merchantAppRepo, bannerRepo, notifRepo, logRepo, orderRepo);

  app.use(authRouter.routes()).use(authRouter.allowedMethods());
  app.use(uploadRouter.routes()).use(uploadRouter.allowedMethods());
  app.use(cartRouter.routes()).use(cartRouter.allowedMethods());
  app.use(orderRouter.routes()).use(orderRouter.allowedMethods());
  app.use(adminRouter.routes()).use(adminRouter.allowedMethods());

  const port = config.port;
  app.listen(port, () => {
    console.log("乌东文旅平台后端已启动: http://localhost:" + port);
  });
}

bootstrap().catch(err => {
  console.error("启动失败:", err);
  process.exit(1);
});
