import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param, Headers } from '@midwayjs/decorator';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@midwayjs/swagger';
import { MerchantApplicationService } from '../service/merchant-application.service';
import { MerchantService } from '../service/merchant.service';
import { JwtService } from '@midwayjs/jwt';

/**
 * 商家入驻申请控制器
 * 处理商家入驻申请相关的 API 请求，包括申请的提交、审核及管理
 */
@ApiTags('MerchantApplication')
@ApiBearerAuth()
@Controller('/api/merchant-applications')
export class MerchantApplicationController {
  @Inject()
  merchantApplicationService: MerchantApplicationService;

  @Inject()
  merchantService: MerchantService;

  @Inject()
  jwtService: JwtService;

  /**
   * 获取入驻申请列表（分页）
   * GET /api/merchant-applications/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @param status - 申请状态筛选（可选）
   * @param keyword - 搜索关键词（可选）
   * @returns 分页入驻申请列表
   */
  @Get('/list')
  @ApiOperation({ summary: '获取入驻申请列表（分页）' })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', description: '每页数量', required: false, example: 20 })
  @ApiQuery({ name: 'status', description: '申请状态筛选 pending/approved/rejected', required: false, example: 'pending' })
  @ApiQuery({ name: 'keyword', description: '搜索关键词（商家名称/申请人姓名/手机号）', required: false, example: '张三' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          list: [
            {
              id: 1,
              user_id: 10,
              shop_name: '苗乡酸汤鱼',
              module_type: '美食',
              applicant_name: '张三',
              applicant_phone: '13800138001',
              status: 'pending',
              created_at: '2026-06-01T10:00:00.000Z',
            },
          ],
          total: 1,
        },
      },
    },
  })
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('status') status?: string,
    @Query('keyword') keyword?: string
  ) {
    const result = await this.merchantApplicationService.findAll(
      Number(page),
      Number(pageSize),
      status,
      keyword
    );
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取入驻申请详情
   * GET /api/merchant-applications/detail/:id
   * @param id - 申请 ID
   * @returns 入驻申请详细信息
   */
  @Get('/detail/:id')
  @ApiOperation({ summary: '获取入驻申请详情' })
  @ApiParam({ name: 'id', description: '申请ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          user_id: 10,
          shop_name: '苗乡酸汤鱼',
          module_type: '美食',
          applicant_name: '张三',
          applicant_phone: '13800138001',
          applicant_id_card: '522600199001011234',
          business_license: 'https://example.com/license.jpg',
          status: 'pending',
          reject_reason: null,
          reviewer_id: null,
          review_time: null,
          created_at: '2026-06-01T10:00:00.000Z',
          updated_at: '2026-06-01T10:00:00.000Z',
        },
      },
    },
  })
  async detail(@Param('id') id: number) {
    const item = await this.merchantApplicationService.findById(Number(id));
    if (!item) return { code: 404, message: '不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 提交入驻申请
   * POST /api/merchant-applications/create
   * @param body - 入驻申请信息
   * @returns 创建后的入驻申请信息
   */
  @Post('/create')
  @ApiOperation({ summary: '提交入驻申请' })
  @ApiBody({
    schema: {
      properties: {
        user_id: { type: 'number', description: '用户ID', example: 10 },
        shop_name: { type: 'string', description: '店铺名称', example: '苗乡酸汤鱼' },
        module_type: { type: 'string', description: '经营模块类型', example: '美食' },
        applicant_name: { type: 'string', description: '申请人姓名', example: '张三' },
        applicant_phone: { type: 'string', description: '申请人手机号', example: '13800138001' },
        applicant_id_card: { type: 'string', description: '申请人身份证号', example: '522600199001011234' },
        business_license: { type: 'string', description: '营业执照图片URL', example: 'https://example.com/license.jpg' },
      },
      example: {
        user_id: 10,
        shop_name: '苗乡酸汤鱼',
        module_type: '美食',
        applicant_name: '张三',
        applicant_phone: '13800138001',
        applicant_id_card: '522600199001011234',
        business_license: 'https://example.com/license.jpg',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '提交成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          user_id: 10,
          shop_name: '苗乡酸汤鱼',
          module_type: '美食',
          applicant_name: '张三',
          applicant_phone: '13800138001',
          status: 'pending',
          created_at: '2026-06-01T10:00:00.000Z',
        },
      },
    },
  })
  async create(@Body() body: any) {
    const item = await this.merchantApplicationService.create(body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 更新入驻申请信息
   * PUT /api/merchant-applications/update/:id
   * @param id - 申请 ID
   * @param body - 更新的入驻申请信息
   * @returns 更新后的入驻申请信息
   */
  @Put('/update/:id')
  @ApiOperation({ summary: '更新入驻申请信息' })
  @ApiParam({ name: 'id', description: '申请ID', example: 1 })
  @ApiBody({
    schema: {
      properties: {
        shop_name: { type: 'string', description: '店铺名称', example: '苗乡酸汤鱼旗舰店' },
        module_type: { type: 'string', description: '经营模块类型', example: '美食' },
        applicant_name: { type: 'string', description: '申请人姓名', example: '张三' },
        applicant_phone: { type: 'string', description: '申请人手机号', example: '13800138001' },
      },
      example: {
        shop_name: '苗乡酸汤鱼旗舰店',
        module_type: '美食',
        applicant_name: '张三',
        applicant_phone: '13800138001',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          user_id: 10,
          shop_name: '苗乡酸汤鱼旗舰店',
          module_type: '美食',
          applicant_name: '张三',
          applicant_phone: '13800138001',
          status: 'pending',
          updated_at: '2026-06-02T10:00:00.000Z',
        },
      },
    },
  })
  async update(@Param('id') id: number, @Body() body: any) {
    delete body.id;
    const item = await this.merchantApplicationService.update(Number(id), body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 删除入驻申请
   * DELETE /api/merchant-applications/delete/:id
   * @param id - 申请 ID
   * @returns 操作结果
   */
  @Del('/delete/:id')
  @ApiOperation({ summary: '删除入驻申请' })
  @ApiParam({ name: 'id', description: '申请ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '删除成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: null,
      },
    },
  })
  async remove(@Param('id') id: number) {
    await this.merchantApplicationService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }

  /**
   * 审批通过入驻申请
   * POST /api/merchant-applications/approve/:id
   * @param id - 申请 ID
   * @param auth - 请求头中的 Authorization Bearer token
   * @returns 更新后的申请信息
   */
  @Post('/approve/:id')
  @ApiOperation({ summary: '审批通过入驻申请' })
  @ApiParam({ name: 'id', description: '申请ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '审批通过',
    schema: {
      example: {
        code: 200,
        message: '审核通过，已自动创建商家账号（默认密码: 123456）',
        data: {
          id: 1,
          shop_name: '苗乡酸汤鱼',
          status: 'approved',
          reviewer_id: 1,
          review_time: '2026-06-02T10:00:00.000Z',
        },
      },
    },
  })
  async approve(@Param('id') id: number, @Headers('authorization') auth: string) {
    try {
      const token = auth?.replace('Bearer ', '');
      const payload: any = await this.jwtService.verify(token);
      const app = await this.merchantApplicationService.findById(Number(id));
      if (!app) return { code: 404, message: '申请不存在', data: null };
      if (app.status !== 'pending') return { code: 400, message: '该申请已处理', data: null };

      // 更新申请状态
      const item = await this.merchantApplicationService.update(Number(id), {
        status: 'approved',
        reviewer_id: payload.id,
        review_time: new Date()
      });

      // 自动创建商家账号（关联申请信息）
      const existingMerchant = await this.merchantService.findByUsername(app.applicant_phone || `merchant_${app.id}`);
      if (!existingMerchant) {
        const bcrypt = require('bcryptjs');
        const defaultPassword = '123456';
        await this.merchantService.create({
          user_id: app.user_id,
          username: app.applicant_phone || `merchant_${app.id}`,
          password_hash: bcrypt.hashSync(defaultPassword, 12),
          shop_name: app.shop_name,
          module_type: app.module_type,
          contact_name: app.applicant_name,
          contact_phone: app.applicant_phone,
          status: 1,
          joined_at: new Date(),
        } as any);
      }

      return { code: 200, message: '审核通过，已自动创建商家账号（默认密码: 123456）', data: item };
    } catch {
      return { code: 401, message: 'token无效', data: null };
    }
  }

  /**
   * 驳回入驻申请
   * POST /api/merchant-applications/reject/:id
   * @param id - 申请 ID
   * @param body - 驳回原因（reject_reason）
   * @param auth - 请求头中的 Authorization Bearer token
   * @returns 更新后的申请信息
   */
  @Post('/reject/:id')
  @ApiOperation({ summary: '驳回入驻申请' })
  @ApiParam({ name: 'id', description: '申请ID', example: 1 })
  @ApiBody({
    schema: {
      properties: {
        reject_reason: { type: 'string', description: '驳回原因', example: '营业执照信息不清晰，请重新上传' },
      },
      example: {
        reject_reason: '营业执照信息不清晰，请重新上传',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '驳回成功',
    schema: {
      example: {
        code: 200,
        message: '已驳回',
        data: {
          id: 1,
          shop_name: '苗乡酸汤鱼',
          status: 'rejected',
          reject_reason: '营业执照信息不清晰，请重新上传',
          reviewer_id: 1,
          review_time: '2026-06-02T10:00:00.000Z',
        },
      },
    },
  })
  async reject(@Param('id') id: number, @Body() body: { reject_reason: string }, @Headers('authorization') auth: string) {
    try {
      const token = auth?.replace('Bearer ', '');
      const payload: any = await this.jwtService.verify(token);

      const item = await this.merchantApplicationService.update(Number(id), {
        status: 'rejected',
        reviewer_id: payload.id,
        reject_reason: body.reject_reason,
        review_time: new Date()
      });

      return { code: 200, message: '已驳回', data: item };
    } catch {
      return { code: 401, message: 'token无效', data: null };
    }
  }

  /**
   * 超时未审核检查
   * GET /api/merchant-applications/overdue-check
   * 检查超过3个工作日未处理的申请并生成系统消息提醒
   * @returns 超时申请数量和详情
   */
  @Get('/overdue-check')
  @ApiOperation({ summary: '超时未审核检查' })
  @ApiResponse({
    status: 200,
    description: '检查完成',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          overdue_count: 2,
          overdue_applications: [
            {
              id: 3,
              shop_name: '西江苗寨银饰坊',
              applicant_name: '李四',
              created_at: '2026-06-10T10:00:00.000Z',
              days_overdue: 5,
            },
            {
              id: 5,
              shop_name: '侗乡民宿',
              applicant_name: '王五',
              created_at: '2026-06-08T10:00:00.000Z',
              days_overdue: 7,
            },
          ],
        },
      },
    },
  })
  async overdueCheck() {
    const result = await this.merchantApplicationService.checkOverdueApplications();
    return { code: 200, message: 'success', data: result };
  }
}
