import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as typeorm from '@midwayjs/typeorm';
import * as validate from '@midwayjs/validate';
import * as crossDomain from '@midwayjs/cross-domain';
import { join } from 'path';
import koaStatic = require('koa-static');

@Configuration({
  importConfigs: [join(__dirname, './config.default')],
  imports: [
    koa,
    crossDomain,
    validate,
    typeorm,
  ],
})
export class AutoConfiguration {
  @App()
  app: koa.Application;

  async onReady(): Promise<void> {
    // 托管静态文件（图片等资源）
    const staticDir = join(__dirname, '../public');
    this.app.use(koaStatic(staticDir));
    console.log('[wudong-tourism] 静态文件目录:', staticDir);
    console.log('[wudong-tourism] 应用就绪');
  }
}
