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
import { CollectionPointService } from './collection-point.service';
import { CreateCollectionPointDto } from './dto/create-collection-point.dto';
import { UpdateCollectionPointDto } from './dto/update-collection-point.dto';

@Controller('collection-points')
export class CollectionPointController {
  constructor(
    private readonly collectionPointService: CollectionPointService,
  ) {}

  @Post('create')
  public create(@Body() createCollectionPointDto: CreateCollectionPointDto) {
    return this.collectionPointService.create(createCollectionPointDto);
  }

  @Get()
  public findAll() {
    return this.collectionPointService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.collectionPointService.findOne(id);
  }

  @Patch(':id')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCollectionPointDto: UpdateCollectionPointDto,
  ) {
    return this.collectionPointService.update(id, updateCollectionPointDto);
  }

  @Delete(':id')
  public remove(@Param('id', ParseIntPipe) id: number) {
    return this.collectionPointService.remove(id);
  }
}
