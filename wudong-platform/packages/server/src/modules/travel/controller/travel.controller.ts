import { Controller, Get, Post, Put, Del, Param, Body, Query, Inject } from '@midwayjs/core';
import { TravelService } from '../service/travel.service';

@Controller('/api/v1')
export class TravelController {
  @Inject()
  travelService: TravelService;

  // ===== 景区 =====
  @Get('/scenic-spots') async listScenic(@Query() q: any) { return this.travelService.listScenicSpots(q); }
  @Get('/scenic-spots/all') async allScenic() { return this.travelService.getAllScenicSpots(); }
  @Get('/scenic-spots/:id') async detailScenic(@Param('id') id: number) { return this.travelService.getScenicSpot(id); }
  @Post('/scenic-spots') async createScenic(@Body() b: any) { return this.travelService.createScenicSpot(b); }
  @Put('/scenic-spots/:id') async updateScenic(@Param('id') id: number, @Body() b: any) { return this.travelService.updateScenicSpot(id, b); }
  @Del('/scenic-spots/:id') async deleteScenic(@Param('id') id: number) { await this.travelService.deleteScenicSpot(id); return { success: true }; }

  // ===== 票种 =====
  @Get('/scenic-spots/:id/ticket-types') async ticketTypes(@Param('id') id: number) { return this.travelService.listTicketTypes(id); }
  @Get('/ticket-types/all') async allTicketTypes() { return this.travelService.listTicketTypes(); }
  @Post('/ticket-types') async createTicketType(@Body() b: any) { return this.travelService.createTicketType(b); }
  @Put('/ticket-types/:id') async updateTicketType(@Param('id') id: number, @Body() b: any) { return this.travelService.updateTicketType(id, b); }
  @Del('/ticket-types/:id') async deleteTicketType(@Param('id') id: number) { await this.travelService.deleteTicketType(id); return { success: true }; }

  // ===== 路线套餐 =====
  @Get('/routes') async listRoutes(@Query() q: any) { return this.travelService.listRoutes(q); }
  @Get('/routes/:id') async detailRoute(@Param('id') id: number) { return this.travelService.getRoute(id); }
  @Post('/routes') async createRoute(@Body() b: any) { return this.travelService.createRoute(b); }
  @Put('/routes/:id') async updateRoute(@Param('id') id: number, @Body() b: any) { return this.travelService.updateRoute(id, b); }
  @Del('/routes/:id') async deleteRoute(@Param('id') id: number) { await this.travelService.deleteRoute(id); return { success: true }; }

  // ===== 电子票 =====
  @Get('/e-tickets') async listETickets(@Query() q: any) { return this.travelService.listETickets(q); }
  @Post('/e-tickets/verify') async verifyETicket(@Body() b: { ticketCode: string }) { return this.travelService.verifyETicket(b.ticketCode); }
}
