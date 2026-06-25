import { Router, Request, Response, NextFunction } from "express";
import { ScenicSpotService } from "../services/ScenicSpotService";
import { TicketTypeService } from "../services/TicketTypeService";
import { RouteService } from "../services/RouteService";
import { OrderService } from "../services/OrderService";
import { AdminService } from "../services/AdminService";
import { authenticate, AuthRequest } from "../middleware/auth";
import { plainify } from "../utils/plainify";

export function setupRoutes(
  scenicSvc: ScenicSpotService,
  ticketSvc: TicketTypeService,
  routeSvc: RouteService,
  orderSvc: OrderService,
  adminSvc: AdminService,
) {
  const api = Router();

  // ==================== 公开接口 ====================

  // 景区列表
  api.get("/scenic-spots", async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await scenicSvc.getAll(page, pageSize);
      result.list = result.list.map(plainify);
      res.json({ code: 200, message: "success", data: result });
    } catch (e: any) {
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  // 景区详情
  api.get("/scenic-spots/:id", async (req: Request, res: Response) => {
    try {
      const spot = await scenicSvc.getById(parseInt(req.params.id));
      if (!spot) {
        res.status(404).json({ code: 404, message: "景区不存在", data: null });
        return;
      }
      res.json({ code: 200, message: "success", data: plainify(spot) });
    } catch (e: any) {
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  // 门票列表（按景区）
  api.get("/ticket-types", async (req: Request, res: Response) => {
    try {
      const scenicId = parseInt(req.query.scenicId as string);
      if (!scenicId) {
        res.status(400).json({ code: 400, message: "缺少 scenicId 参数", data: null });
        return;
      }
      const list = await ticketSvc.getByScenicId(scenicId);
      res.json({ code: 200, message: "success", data: list.map(plainify) });
    } catch (e: any) {
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  // 门票详情
  api.get("/ticket-types/:id", async (req: Request, res: Response) => {
    try {
      const tt = await ticketSvc.getById(parseInt(req.params.id));
      if (!tt) {
        res.status(404).json({ code: 404, message: "票种不存在", data: null });
        return;
      }
      res.json({ code: 200, message: "success", data: plainify(tt) });
    } catch (e: any) {
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  // 路线列表
  api.get("/routes", async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await routeSvc.getAll(page, pageSize);
      result.list = result.list.map(plainify);
      res.json({ code: 200, message: "success", data: result });
    } catch (e: any) {
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  // 路线详情
  api.get("/routes/:id", async (req: Request, res: Response) => {
    try {
      const route = await routeSvc.getById(parseInt(req.params.id));
      if (!route) {
        res.status(404).json({ code: 404, message: "路线不存在", data: null });
        return;
      }
      res.json({ code: 200, message: "success", data: plainify(route) });
    } catch (e: any) {
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  // ==================== 订单接口 ====================

  // 创建订单
  api.post("/orders", async (req: Request, res: Response) => {
    try {
      const { userId, orderType, itemId, itemName, ticketTypeId, quantity, totalPrice, visitDate, validDays } = req.body;
      if (!userId || !orderType || !itemId || !itemName || quantity === undefined || quantity === null) {
        res.status(400).json({ code: 400, message: "缺少必要参数", data: null });
        return;
      }
      if (quantity <= 0) {
        res.status(400).json({ code: 400, message: "数量必须大于0", data: null });
        return;
      }
      if (typeof totalPrice !== "number" || totalPrice < 0) {
        res.status(400).json({ code: 400, message: "总金额不能为负数", data: null });
        return;
      }
      const order = await orderSvc.createOrder({
        userId,
        orderType,
        itemId,
        itemName,
        ticketTypeId: ticketTypeId || null,
        quantity,
        totalPrice,
        visitDate: visitDate || null,
        validDays: validDays || 1,
      });
      res.json({ code: 200, message: "订单创建成功", data: plainify(order) });
    } catch (e: any) {
      res.status(400).json({ code: 400, message: e.message || "创建订单失败", data: null });
    }
  });

  // 我的订单
  api.get("/orders/my", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) {
        res.status(400).json({ code: 400, message: "缺少 userId 参数", data: null });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await orderSvc.getMyOrders(userId, page, pageSize);
      result.list = result.list.map(plainify);
      res.json({ code: 200, message: "success", data: result });
    } catch (e: any) {
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  // 订单详情
  api.get("/orders/:id", async (req: Request, res: Response) => {
    try {
      const order = await orderSvc.getOrderById(parseInt(req.params.id));
      if (!order) {
        res.status(404).json({ code: 404, message: "订单不存在", data: null });
        return;
      }
      res.json({ code: 200, message: "success", data: plainify(order) });
    } catch (e: any) {
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  // 取消订单
  api.put("/orders/:id/cancel", async (req: Request, res: Response) => {
    try {
      const order = await orderSvc.cancelOrder(parseInt(req.params.id));
      res.json({ code: 200, message: "订单已取消", data: plainify(order) });
    } catch (e: any) {
      res.status(400).json({ code: 400, message: e.message, data: null });
    }
  });

  // ==================== 管理员接口（需 JWT） ====================

  // 管理员登录
  api.post("/admin/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ code: 400, message: "请输入用户名和密码", data: null });
        return;
      }
      const result = await adminSvc.login(username, password);
      res.json({ code: 200, message: "登录成功", data: result });
    } catch (e: any) {
      res.status(401).json({ code: 401, message: e.message || "登录失败", data: null });
    }
  });

  // 管理员路由组
  const admin = Router();
  admin.use(authenticate);

  // ---- 景区管理 ----
  admin.get("/scenic-spots", async (req, res) => {
    try {
      const page = parseInt((req.query.page as string) || "1");
      const pageSize = parseInt((req.query.pageSize as string) || "10");
      const result = await scenicSvc.getAll(page, pageSize);
      res.json({ code: 200, message: "success", data: result });
    } catch (e: any) {
      console.error("[Admin] 景区列表错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.post("/scenic-spots", async (req, res) => {
    try {
      const spot = await scenicSvc.create(req.body);
      res.json({ code: 200, message: "创建成功", data: spot });
    } catch (e: any) {
      console.error("[Admin] 创建景区错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.put("/scenic-spots/:id", async (req, res) => {
    try {
      const spot = await scenicSvc.update(parseInt(req.params.id), req.body);
      res.json({ code: 200, message: "更新成功", data: spot });
    } catch (e: any) {
      console.error("[Admin] 更新景区错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.delete("/scenic-spots/:id", async (req, res) => {
    try {
      await scenicSvc.softDelete(parseInt(req.params.id));
      res.json({ code: 200, message: "删除成功", data: null });
    } catch (e: any) {
      console.error("[Admin] 删除景区错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.put("/scenic-spots/:id/status", async (req, res) => {
    try {
      const spot = await scenicSvc.toggleStatus(parseInt(req.params.id));
      res.json({ code: 200, message: "状态已更新", data: spot });
    } catch (e: any) {
      console.error("[Admin] 切换景区状态错误:", e);
      res.status(400).json({ code: 400, message: e.message || "状态更新失败", data: null });
    }
  });

  // ---- 票种管理 ----
  admin.get("/ticket-types", async (req, res) => {
    try {
      const list = await ticketSvc.getAll();
      res.json({ code: 200, message: "success", data: list });
    } catch (e: any) {
      console.error("[Admin] 票种列表错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.post("/ticket-types", async (req, res) => {
    try {
      const tt = await ticketSvc.create(req.body);
      res.json({ code: 200, message: "创建成功", data: tt });
    } catch (e: any) {
      console.error("[Admin] 创建票种错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.put("/ticket-types/:id", async (req, res) => {
    try {
      const tt = await ticketSvc.update(parseInt(req.params.id), req.body);
      res.json({ code: 200, message: "更新成功", data: tt });
    } catch (e: any) {
      console.error("[Admin] 更新票种错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.delete("/ticket-types/:id", async (req, res) => {
    try {
      await ticketSvc.softDelete(parseInt(req.params.id));
      res.json({ code: 200, message: "删除成功", data: null });
    } catch (e: any) {
      console.error("[Admin] 删除票种错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  // 按日期批量设置票种库存
  admin.put("/ticket-types/:id/daily-stock", async (req, res) => {
    try {
      const { stocks } = req.body;
      if (!Array.isArray(stocks)) {
        res.status(400).json({ code: 400, message: "stocks 必须为数组", data: null });
        return;
      }
      const tt = await ticketSvc.setDailyStocks(parseInt(req.params.id), stocks);
      res.json({ code: 200, message: "库存已更新", data: tt });
    } catch (e: any) {
      console.error("[Admin] 设置票种库存错误:", e);
      res.status(400).json({ code: 400, message: "库存更新失败", data: null });
    }
  });

  // ---- 路线管理 ----
  admin.get("/routes", async (req, res) => {
    try {
      const list = await routeSvc.adminGetAll();
      res.json({ code: 200, message: "success", data: list });
    } catch (e: any) {
      console.error("[Admin] 路线列表错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.post("/routes", async (req, res) => {
    try {
      const route = await routeSvc.adminCreate(req.body);
      res.json({ code: 200, message: "创建成功", data: route });
    } catch (e: any) {
      console.error("[Admin] 创建路线错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.put("/routes/:id", async (req, res) => {
    try {
      const route = await routeSvc.adminUpdate(parseInt(req.params.id), req.body);
      res.json({ code: 200, message: "更新成功", data: route });
    } catch (e: any) {
      console.error("[Admin] 更新路线错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.delete("/routes/:id", async (req, res) => {
    try {
      await routeSvc.adminSoftDelete(parseInt(req.params.id));
      res.json({ code: 200, message: "删除成功", data: null });
    } catch (e: any) {
      console.error("[Admin] 删除路线错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.put("/routes/:id/status", async (req, res) => {
    try {
      const route = await routeSvc.adminToggleStatus(parseInt(req.params.id));
      res.json({ code: 200, message: "状态已更新", data: route });
    } catch (e: any) {
      console.error("[Admin] 切换路线状态错误:", e);
      res.status(400).json({ code: 400, message: "状态更新失败", data: null });
    }
  });

  // 按日期批量设置路线库存
  admin.put("/routes/:id/daily-stock", async (req, res) => {
    try {
      const { stocks } = req.body;
      if (!Array.isArray(stocks)) {
        res.status(400).json({ code: 400, message: "stocks 必须为数组", data: null });
        return;
      }
      const route = await routeSvc.setDailyStocks(parseInt(req.params.id), stocks);
      res.json({ code: 200, message: "库存已更新", data: route });
    } catch (e: any) {
      console.error("[Admin] 设置路线库存错误:", e);
      res.status(400).json({ code: 400, message: "库存更新失败", data: null });
    }
  });

  // ---- 行程管理 ----
  admin.post("/routes/:routeId/itineraries", async (req, res) => {
    try {
      const it = await routeSvc.addItinerary(parseInt(req.params.routeId), req.body);
      res.json({ code: 200, message: "创建成功", data: it });
    } catch (e: any) {
      console.error("[Admin] 创建行程错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.put("/routes/:routeId/itineraries/:itId", async (req, res) => {
    try {
      const it = await routeSvc.updateItinerary(
        parseInt(req.params.routeId),
        parseInt(req.params.itId),
        req.body,
      );
      res.json({ code: 200, message: "更新成功", data: it });
    } catch (e: any) {
      console.error("[Admin] 更新行程错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.delete("/routes/:routeId/itineraries/:itId", async (req, res) => {
    try {
      await routeSvc.deleteItinerary(parseInt(req.params.routeId), parseInt(req.params.itId));
      res.json({ code: 200, message: "删除成功", data: null });
    } catch (e: any) {
      console.error("[Admin] 删除行程错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  // ---- 订单管理 ----
  admin.get("/orders", async (req, res) => {
    try {
      const page = parseInt((req.query.page as string) || "1");
      const pageSize = parseInt((req.query.pageSize as string) || "10");
      const status = req.query.status ? parseInt(req.query.status as string) : undefined;
      const orderType = req.query.orderType ? parseInt(req.query.orderType as string) : undefined;
      const result = await orderSvc.adminGetAll(page, pageSize, { status, orderType });
      res.json({ code: 200, message: "success", data: result });
    } catch (e: any) {
      console.error("[Admin] 订单列表错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.get("/orders/:id", async (req, res) => {
    try {
      const order = await orderSvc.getOrderById(parseInt(req.params.id));
      if (!order) {
        res.status(404).json({ code: 404, message: "订单不存在", data: null });
        return;
      }
      res.json({ code: 200, message: "success", data: order });
    } catch (e: any) {
      console.error("[Admin] 订单详情错误:", e);
      res.status(500).json({ code: 500, message: "服务器错误", data: null });
    }
  });

  admin.post("/orders/:id/verify", async (req, res) => {
    try {
      const order = await orderSvc.verifyOrder(parseInt(req.params.id));
      res.json({ code: 200, message: "核销成功", data: order });
    } catch (e: any) {
      console.error("[Admin] 核销错误:", e);
      res.status(400).json({ code: 400, message: e.message || "核销失败", data: null });
    }
  });

  // 退款接口
  admin.put("/orders/:id/refund", async (req, res) => {
    try {
      const order = await orderSvc.refundOrder(parseInt(req.params.id));
      res.json({ code: 200, message: "退款成功", data: order });
    } catch (e: any) {
      console.error("[Admin] 退款错误:", e);
      res.status(400).json({ code: 400, message: e.message || "退款失败", data: null });
    }
  });

  api.use("/admin", admin);

  return api;
}
