import { Controller, Get, Provide } from '@midwayjs/decorator';

@Provide()
@Controller('/')
export class TestController {
  @Get('/test')
  async test() {
    return { code: 200, message: 'ok', data: 'hello' };
  }
}
