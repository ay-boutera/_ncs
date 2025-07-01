import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { WasteTypeService } from './waste-type.service';
import { CreateWasteTypeDto } from './dto/create-waste.dto';
import { UpdateWasteTypeDto } from './dto/update-waste.dto';

@Controller('waste-types')
export class WasteTypeController {
  constructor(private readonly wasteTypeService: WasteTypeService) {}

  @Post()
  public create(@Body() createWasteTypeDto: CreateWasteTypeDto) {
    return this.wasteTypeService.create(createWasteTypeDto);
  }

  @Get()
  public findAll() {
    return this.wasteTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wasteTypeService.findOne(id);
  }

  @Patch(':id')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWasteTypeDto: UpdateWasteTypeDto,
  ) {
    return this.wasteTypeService.update(id, updateWasteTypeDto);
  }

  @Delete(':id')
  public remove(@Param('id', ParseIntPipe) id: number) {
    return this.wasteTypeService.remove(id);
  }
}
