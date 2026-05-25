import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { AuthGuard } from '../auth/auth.guard';
import type { RequestWithUser } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  CreateProfessionalDto,
  UpdateCredentialsDto,
} from './dto/professionals.dto';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async findMe(@Req() req: RequestWithUser) {
    if (!req.user) {
      throw new Error('User not found on request');
    }
    return this.professionalsService.findOne(req.user.sub);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return this.professionalsService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post('manual')
  async createManual(@Body() body: CreateProfessionalDto) {
    return this.professionalsService.createManual(body);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.professionalsService.updateStatus(id, status);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/credentials')
  async updateCredentials(
    @Param('id') id: string,
    @Body() body: UpdateCredentialsDto,
  ) {
    return this.professionalsService.updateCredentials(id, body);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.professionalsService.remove(id);
  }
}
