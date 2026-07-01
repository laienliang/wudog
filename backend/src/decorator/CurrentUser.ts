import { createRequestParamDecorator } from '@midwayjs/core';

export const CurrentUser = createRequestParamDecorator((ctx: any) => ctx.user || ctx.adminUser);
