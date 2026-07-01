import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as typeorm from '@midwayjs/typeorm';
import * as validate from '@midwayjs/validate';
import * as jwt from '@midwayjs/jwt';
import * as redis from '@midwayjs/redis';
import * as koaStatic from 'koa-static';

// koa-static export workaround for TypeScript
const serve = (koaStatic as any).default || koaStatic;
import { join } from 'path';
import { AdminAuthMiddleware } from './middleware/admin-auth';

@Configuration({
  imports: [koa, typeorm, validate, jwt, redis],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // CORS 中间件
    this.app.use(async (ctx, next) => {
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      ctx.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      if (ctx.method === 'OPTIONS') {
        ctx.status = 200;
        return;
      }
      await next();
    });

    // 静态文件服务（uploads目录）
    this.app.use(async (ctx, next) => {
      if (ctx.path.startsWith('/uploads/')) {
        ctx.path = ctx.path.replace('/uploads/', '/');
      }
      await next();
    });
    this.app.use(serve(join(__dirname, '../uploads')));

    // 注册管理员鉴权中间件
    this.app.useMiddleware(AdminAuthMiddleware);
  }
}
