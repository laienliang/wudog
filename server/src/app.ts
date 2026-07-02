import "reflect-metadata";
import Koa from "koa";
import Router from "@koa/router";
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
import { TravelNote } from "./entity/travel-note.entity";
import { Comment } from "./entity/comment.entity";
import { Topic } from "./entity/topic.entity";
import { Follow } from "./entity/follow.entity";
import { Like } from "./entity/like.entity";
import { Favorite } from "./entity/favorite.entity";
import { Report } from "./entity/report.entity";
import { ProductCategory } from "./entity/product-category.entity";
import { Product } from "./entity/product.entity";
import { ProductSku } from "./entity/product-sku.entity";
import { ProductImage } from "./entity/product-image.entity";
import { ProductReview } from "./entity/product-review.entity";
import { ProductFavorite } from "./entity/product-favorite.entity";
import { Restaurant } from "./entity/restaurant.entity";
import { RestaurantDish } from "./entity/restaurant-dish.entity";
import { MealTimeSlot } from "./entity/meal-time-slot.entity";
import { RestaurantBooking } from "./entity/restaurant-booking.entity";
import { FarmProductCategory } from "./entity/farm-product-category.entity";
import { FarmProduct } from "./entity/farm-product.entity";
import { RestaurantReview } from "./entity/restaurant-review.entity";
import { Homestay } from "./entity/homestay.entity";
import { RoomType } from "./entity/room-type.entity";
import { RoomCalendar } from "./entity/room-calendar.entity";
import { HomestayBooking } from "./entity/homestay-booking.entity";
import { HomestayReview } from "./entity/homestay-review.entity";
import { ScenicSpot } from "./entity/scenic-spot.entity";
import { TicketType } from "./entity/ticket-type.entity";
import { ETicket } from "./entity/e-ticket.entity";
import { TourRoute } from "./entity/tour-route.entity";
import { TourItinerary } from "./entity/tour-itinerary.entity";
import { TransportGuide } from "./entity/transport-guide.entity";

import { AuthService } from "./service/auth.service";
import { CartService } from "./service/cart.service";
import { OrderService } from "./service/order.service";
import { TravelNoteService } from "./service/travel-note.service";
import { CommentService } from "./service/comment.service";
import { TopicService } from "./service/topic.service";
import { FollowService } from "./service/follow.service";
import { LikeService } from "./service/like.service";
import { FavoriteService } from "./service/favorite.service";
import { ReportService } from "./service/report.service";
import { ProductCategoryService } from "./service/product-category.service";
import { ProductService } from "./service/product.service";
import { ProductReviewService } from "./service/product-review.service";
import { ProductFavoriteService } from "./service/product-favorite.service";
import { RestaurantService } from "./service/restaurant.service";
import { RestaurantBookingService } from "./service/restaurant-booking.service";
import { FarmProductService } from "./service/farm-product.service";
import { RestaurantReviewService } from "./service/restaurant-review.service";
import { HomestayService } from "./service/homestay.service";
import { HomestayBookingService } from "./service/homestay-booking.service";
import { HomestayReviewService } from "./service/homestay-review.service";
import { ScenicSpotService } from "./service/scenic-spot.service";
import { TourRouteService } from "./service/tour-route.service";
import { ETicketService } from "./service/e-ticket.service";

import { createAuthRouter } from "./controller/auth.controller";
import { createUploadRouter } from "./controller/upload.controller";
import { createCartRouter } from "./controller/cart.controller";
import { createOrderRouter } from "./controller/order.controller";
import { createAdminRouter } from "./controller/admin.controller";
import { createTravelNoteRouter } from "./controller/travel-note.controller";
import { createCommentRouter } from "./controller/comment.controller";
import { createTopicRouter } from "./controller/topic.controller";
import { createFollowRouter } from "./controller/follow.controller";
import { createLikeRouter } from "./controller/like.controller";
import { createFavoriteRouter } from "./controller/favorite.controller";
import { createReportRouter } from "./controller/report.controller";
import { createProductCategoryRouter } from "./controller/product-category.controller";
import { createProductRouter } from "./controller/product.controller";
import { createProductReviewRouter } from "./controller/product-review.controller";
import { createProductFavoriteRouter } from "./controller/product-favorite.controller";
import { createRestaurantRouter } from "./controller/restaurant.controller";
import { createRestaurantBookingRouter } from "./controller/restaurant-booking.controller";
import { createFarmProductRouter } from "./controller/farm-product.controller";
import { createRestaurantReviewRouter } from "./controller/restaurant-review.controller";
import { createHomestayRouter } from "./controller/homestay.controller";
import { createHomestayBookingRouter } from "./controller/homestay-booking.controller";
import { createHomestayReviewRouter } from "./controller/homestay-review.controller";
import { createScenicSpotRouter } from "./controller/scenic-spot.controller";
import { createTourRouteRouter } from "./controller/tour-route.controller";
import { createETicketRouter } from "./controller/e-ticket.controller";

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
      TravelNote, Comment, Topic, Follow, Like, Favorite, Report,
      ProductCategory, Product, ProductSku, ProductImage, ProductReview, ProductFavorite,
      Restaurant, RestaurantDish, MealTimeSlot, RestaurantBooking,
      FarmProductCategory, FarmProduct, RestaurantReview,
      Homestay, RoomType, RoomCalendar, HomestayBooking, HomestayReview,
      ScenicSpot, TicketType, ETicket, TourRoute, TourItinerary, TransportGuide,
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
  const travelNoteRepo = ds.getRepository(TravelNote);
  const commentRepo = ds.getRepository(Comment);
  const topicRepo = ds.getRepository(Topic);
  const followRepo = ds.getRepository(Follow);
  const likeRepo = ds.getRepository(Like);
  const favoriteRepo = ds.getRepository(Favorite);
  const reportRepo = ds.getRepository(Report);
  const productCategoryRepo = ds.getRepository(ProductCategory);
  const productRepo = ds.getRepository(Product);
  const productSkuRepo = ds.getRepository(ProductSku);
  const productImageRepo = ds.getRepository(ProductImage);
  const productReviewRepo = ds.getRepository(ProductReview);
  const productFavoriteRepo = ds.getRepository(ProductFavorite);
  const restaurantRepo = ds.getRepository(Restaurant);
  const dishRepo = ds.getRepository(RestaurantDish);
  const slotRepo = ds.getRepository(MealTimeSlot);
  const bookingRepo = ds.getRepository(RestaurantBooking);
  const farmProductCategoryRepo = ds.getRepository(FarmProductCategory);
  const farmProductRepo = ds.getRepository(FarmProduct);
  const restaurantReviewRepo = ds.getRepository(RestaurantReview);
  const homestayRepo = ds.getRepository(Homestay);
  const roomTypeRepo = ds.getRepository(RoomType);
  const roomCalendarRepo = ds.getRepository(RoomCalendar);
  const homestayBookingRepo = ds.getRepository(HomestayBooking);
  const homestayReviewRepo = ds.getRepository(HomestayReview);
  const scenicSpotRepo = ds.getRepository(ScenicSpot);
  const ticketTypeRepo = ds.getRepository(TicketType);
  const eTicketRepo = ds.getRepository(ETicket);
  const tourRouteRepo = ds.getRepository(TourRoute);
  const tourItineraryRepo = ds.getRepository(TourItinerary);
  const transportGuideRepo = ds.getRepository(TransportGuide);

  const authService = new AuthService(userRepo, profileRepo);
  const cartService = new CartService(cartRepo, productRepo, productSkuRepo, farmProductRepo);
  const orderService = new OrderService(orderRepo, orderItemRepo, paymentRepo, notifRepo);
  const travelNoteService = new TravelNoteService(travelNoteRepo);
  const commentService = new CommentService(commentRepo);
  const topicService = new TopicService(topicRepo);
  const likeService = new LikeService(likeRepo, travelNoteRepo, commentRepo);
  const followService = new FollowService(followRepo);
  const favoriteService = new FavoriteService(favoriteRepo, travelNoteRepo);
  const reportService = new ReportService(reportRepo, travelNoteRepo, commentRepo);
  const productCategoryService = new ProductCategoryService(productCategoryRepo);
  const productService = new ProductService(productRepo, productSkuRepo, productImageRepo);
  const productReviewService = new ProductReviewService(productReviewRepo, productRepo);
  const productFavoriteService = new ProductFavoriteService(productFavoriteRepo);
  const restaurantService = new RestaurantService(restaurantRepo, dishRepo, slotRepo);
  const restaurantBookingService = new RestaurantBookingService(bookingRepo, slotRepo, restaurantRepo);
  const farmProductService = new FarmProductService(farmProductRepo, farmProductCategoryRepo);
  const restaurantReviewService = new RestaurantReviewService(restaurantReviewRepo, restaurantRepo, farmProductRepo);
  const homestayService = new HomestayService(homestayRepo, roomTypeRepo, roomCalendarRepo);
  const homestayBookingService = new HomestayBookingService(homestayBookingRepo);
  const homestayReviewService = new HomestayReviewService(homestayReviewRepo, homestayRepo);
  const scenicSpotService = new ScenicSpotService(scenicSpotRepo, ticketTypeRepo);
  const tourRouteService = new TourRouteService(tourRouteRepo, tourItineraryRepo, transportGuideRepo);
  const eTicketService = new ETicketService(eTicketRepo);

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

  // 社区模块路由（挂在 /api 前缀下）
  const api = new Router();
  const travelNoteRouter = createTravelNoteRouter(travelNoteService, commentService, likeService, followService, favoriteService);
  const commentRouter = createCommentRouter(commentService);
  const topicRouter = createTopicRouter(topicService);
  const followRouter = createFollowRouter(followService);
  const likeRouter = createLikeRouter(likeService);
  const favoriteRouter = createFavoriteRouter(favoriteService);
  const reportRouter = createReportRouter(reportService);

  api.use("/api/travel-note", travelNoteRouter.routes(), travelNoteRouter.allowedMethods());
  api.use("/api/comment", commentRouter.routes(), commentRouter.allowedMethods());
  api.use("/api/topic", topicRouter.routes(), topicRouter.allowedMethods());
  api.use("/api/follow", followRouter.routes(), followRouter.allowedMethods());
  api.use("/api/like", likeRouter.routes(), likeRouter.allowedMethods());
  api.use("/api/favorite", favoriteRouter.routes(), favoriteRouter.allowedMethods());
  api.use("/api/report", reportRouter.routes(), reportRouter.allowedMethods());

  const productCategoryRouter = createProductCategoryRouter(productCategoryService);
  const productRouter = createProductRouter(productService, productReviewService, productFavoriteService);
  const productReviewRouter = createProductReviewRouter(productReviewService);
  const productFavoriteRouter = createProductFavoriteRouter(productFavoriteService);
  const restaurantRouter = createRestaurantRouter(restaurantService);
  const restaurantBookingRouter = createRestaurantBookingRouter(restaurantBookingService);
  const farmProductRouter = createFarmProductRouter(farmProductService);
  const restaurantReviewRouter = createRestaurantReviewRouter(restaurantReviewService);

  api.use("/api/product-category", productCategoryRouter.routes(), productCategoryRouter.allowedMethods());
  api.use("/api/product", productRouter.routes(), productRouter.allowedMethods());
  api.use("/api/product-review", productReviewRouter.routes(), productReviewRouter.allowedMethods());
  api.use("/api/product-favorite", productFavoriteRouter.routes(), productFavoriteRouter.allowedMethods());
  api.use("/api/restaurant", restaurantRouter.routes(), restaurantRouter.allowedMethods());
  api.use("/api/restaurant-booking", restaurantBookingRouter.routes(), restaurantBookingRouter.allowedMethods());
  api.use("/api/farm-product", farmProductRouter.routes(), farmProductRouter.allowedMethods());
  api.use("/api/restaurant-review", restaurantReviewRouter.routes(), restaurantReviewRouter.allowedMethods());

  const homestayRouter = createHomestayRouter(homestayService);
  const homestayBookingRouter = createHomestayBookingRouter(homestayBookingService);
  const homestayReviewRouter = createHomestayReviewRouter(homestayReviewService);

  api.use("/api/homestay", homestayRouter.routes(), homestayRouter.allowedMethods());
  api.use("/api/homestay-booking", homestayBookingRouter.routes(), homestayBookingRouter.allowedMethods());
  api.use("/api/homestay-review", homestayReviewRouter.routes(), homestayReviewRouter.allowedMethods());

  const scenicSpotRouter = createScenicSpotRouter(scenicSpotService);
  const tourRouteRouter = createTourRouteRouter(tourRouteService);
  const eTicketRouter = createETicketRouter(eTicketService);

  api.use("/api/scenic-spot", scenicSpotRouter.routes(), scenicSpotRouter.allowedMethods());
  api.use("/api/tour-route", tourRouteRouter.routes(), tourRouteRouter.allowedMethods());
  api.use("/api/e-ticket", eTicketRouter.routes(), eTicketRouter.allowedMethods());

  app.use(api.routes()).use(api.allowedMethods());

  const port = config.port;
  app.listen(port, () => {
    console.log("乌东文旅平台后端已启动: http://localhost:" + port);
  });
}

bootstrap().catch(err => {
  console.error("启动失败:", err);
  process.exit(1);
});
