import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  adminId?: number;
  adminUsername?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ code: 401, message: "未授权，请先登录", data: null });
    return;
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET) as { id: number; username: string; exp?: number };
    req.adminId = payload.id;
    req.adminUsername = payload.username;
    next();
  } catch {
    res.status(401).json({ code: 401, message: "Token 无效或已过期", data: null });
  }
};
