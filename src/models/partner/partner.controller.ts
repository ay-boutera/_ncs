import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard) // AuthGuard MUST come first
  @Roles('admin', 'superAdmin') // Allow both admin and superAdmin
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnerService.create(createPartnerDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard) // AuthGuard MUST come first
  @Roles('admin', 'superAdmin') // Allow both admin and superAdmin
  findAll() {
    return this.partnerService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard) // AuthGuard MUST come first
  @Roles('admin', 'superAdmin') // Allow both admin and superAdmin
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partnerService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard) // AuthGuard MUST come first
  @Roles('admin', 'superAdmin') // Allow both admin and superAdmin
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    return this.partnerService.update(+id, updatePartnerDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard) // AuthGuard MUST come first
  @Roles('admin', 'superAdmin') // Allow both admin and superAdmin
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.partnerService.remove(id);
  }
}
