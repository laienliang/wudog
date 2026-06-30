import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as orm from '@midwayjs/orm';
import * as validate from '@midwayjs/validate';
import * as jwt from '@midwayjs/jwt';
import * as cache from '@midwayjs/cache';
import * as redis from '@midwayjs/redis';
import * as crossDomain from '@midwayjs/cross-domain';
import * as upload from '@midwayjs/upload';
import * as swagger from '@midwayjs/swagger';

import { DefaultErrorFilter } from './common/filter/default.filter';
import { BusinessErrorFilter } from './common/filter/unauthorized.filter';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { ResponseInterceptor } from './common/middleware/response.middleware';

@Configuration({
  imports: [
    koa,
    orm,
    validate,
    jwt,
    cache,
    redis,
    crossDomain,
    upload,
    swagger,
  ],
  importConfigs: [__dirname + '/config'],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // ---- 全局中间件 ----
    this.app.useMiddleware([ResponseInterceptor, AuthMiddleware]);

    // ---- 全局过滤器 ----
    this.app.useFilter([DefaultErrorFilter, BusinessErrorFilter]);
  }
}
