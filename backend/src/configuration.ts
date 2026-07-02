import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as typeorm from '@midwayjs/typeorm';
import * as jwt from '@midwayjs/jwt';
import * as validate from '@midwayjs/validate';
import { join } from 'path';
import serve from 'koa-static';

@Configuration({
  imports: [koa, typeorm, jwt, validate],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    const imgDir = join(__dirname, '../img');
    this.app.use(serve(imgDir, { extensions: ['.jpg', '.png'] }));
    console.log('[乌东文旅] 后端服务已启动，端口: 3000');
    console.log('[乌东文旅] 静态图片目录:', imgDir);
  }
}
