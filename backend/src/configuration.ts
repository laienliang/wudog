// ============================================================
// Midway 生命周期配置
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\configuration.ts
// ============================================================
import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as typeorm from '@midwayjs/typeorm';
import * as jwt from '@midwayjs/jwt';
import * as validate from '@midwayjs/validate';
import { join } from 'path';

@Configuration({
  imports: [
    koa,
    typeorm,
    jwt,
    validate,
  ],
  importConfigs: [
    join(__dirname, './config'),
  ],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // 应用启动完成
    console.log('[乌东文旅] 后端服务已启动，端口: 3000');
    console.log('[乌东文旅] API 基础路径: /api/lodging');
  }
}
