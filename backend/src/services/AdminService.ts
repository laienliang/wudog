import { Repository } from "typeorm";
import { AdminUser } from "../entities";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 10;

export class AdminService {
  private repo: Repository<AdminUser>;

  constructor(repo: Repository<AdminUser>) {
    this.repo = repo;
  }

  async login(username: string, password: string) {
    const user = await this.repo.findOne({ where: { username } });
    if (!user) throw new Error("用户名或密码错误");
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("用户名或密码错误");
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    return { token, user: { id: user.id, username: user.username, nickname: user.nickname } };
  }

  async seedDefaultAdmin() {
    if (process.env.SEED_DATA === "false") return;
    const exists = await this.repo.findOne({ where: { username: "admin" } });
    if (!exists) {
      const hashedPassword = await bcrypt.hash("Admin@123456", BCRYPT_ROUNDS);
      await this.repo.save(this.repo.create({ username: "admin", password: hashedPassword, nickname: "超级管理员" }));
    }
  }
}
